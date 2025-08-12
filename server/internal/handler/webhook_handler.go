package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/corbincargil/bells/server/internal/apperrors"
	"github.com/corbincargil/bells/server/internal/model"
	"github.com/corbincargil/bells/server/internal/service"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type WebhookHandler struct {
	webhookService *service.WebhookService
}

func NewWebhookHandler(webhookService *service.WebhookService) *WebhookHandler {
	return &WebhookHandler{webhookService: webhookService}
}

func (h *WebhookHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Path
	pathSegments := strings.Split(strings.Trim(path, "/"), "/")

	switch req.Method {
	case http.MethodGet:
		if len(pathSegments) == 3 && pathSegments[2] == "webhooks" {
			h.GetUserWebhooks(w, req)
		} else if len(pathSegments) == 4 && pathSegments[2] == "webhooks" {
			webhookId := pathSegments[3]
			h.GetWebhookByID(w, req, webhookId)
		} else {
			log.Printf("Page not found. Path segments: %v", pathSegments)
			apperrors.WriteJSONError(w, http.StatusNotFound, "404 page not found")
			return
		}
	case http.MethodPost:
		h.CreateWebhook(w, req)
	case http.MethodPut:
		h.UpdateWebhook(w, req)
	case http.MethodDelete:
		if len(pathSegments) == 4 && pathSegments[2] == "webhooks" {
			webhookId := pathSegments[3]
			h.DeleteWebhookByID(w, req, webhookId)
		} else {
			log.Printf("Page not found. Path segments: %v", pathSegments)
			apperrors.WriteJSONError(w, http.StatusNotFound, "404 page not found")
			return
		}
	default:
		apperrors.WriteJSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func (h *WebhookHandler) GetUserWebhooks(w http.ResponseWriter, req *http.Request) {
	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	webhooks, err := h.webhookService.GetUserWebhooks(userId)
	if err != nil {
		log.Printf("Error fetching webhooks: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching webhooks")
		return
	}

	json, err := json.Marshal(webhooks)
	if err != nil {
		log.Printf("Error marshalling webhook data: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func (h *WebhookHandler) GetWebhookByID(w http.ResponseWriter, req *http.Request, webhookId string) {
	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	if webhookId == "" || len(webhookId) != 36 {
		log.Printf("Invalid webhook ID: %s", webhookId)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid webhook ID")
		return
	}

	webhook, err := h.webhookService.GetWebhookByID(webhookId)
	if err != nil {
		if strings.Contains(err.Error(), "no webhooks found") {
			apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found")
			return
		} else {
			log.Printf("Error fetching webhook %s: %v", webhookId, err)
			apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching webhook")
			return
		}
	}

	if webhook.UserID != userId {
		log.Printf("User %d attempted to fetch webhook %s that does not belong to them", userId, webhookId)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching webhook")
		return
	}

	json, err := json.Marshal(webhook)
	if err != nil {
		log.Printf("Error marshalling webhook data: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func (h *WebhookHandler) CreateWebhook(w http.ResponseWriter, req *http.Request) {
	var requestBody model.CreateWebhookRequest

	err := json.NewDecoder(req.Body).Decode(&requestBody)
	if err != nil {
		log.Printf("Failed to parse request body: %v", err)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid json")
		return
	}

	err = requestBody.Validate()
	if err != nil {
		log.Printf("Webhook request body validation failed: %v", err)
		apperrors.WriteJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	isActive := true
	if requestBody.IsActive != nil {
		isActive = *requestBody.IsActive
	}

	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	webhookParams := model.Webhook{
		UserID:              userId,
		Name:                requestBody.Name,
		Slug:                requestBody.Slug,
		NotificationTitle:   requestBody.NotificationTitle,
		NotificationMessage: requestBody.NotificationMessage,
		IsActive:            isActive,
	}

	webhook, err := h.webhookService.CreateWebhook(&webhookParams)
	if err != nil {
		switch err.(type) {
		case *model.DuplicateWebhookNameError:
			apperrors.WriteJSONError(w, http.StatusConflict, err.Error())
			return
		case *model.DuplicateWebhookSlugError:
			apperrors.WriteJSONError(w, http.StatusConflict, err.Error())
			return
		default:
			log.Printf("Error updating webhook: %v", err)
			apperrors.WriteJSONError(w, http.StatusInternalServerError, "error creating webhook")
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(webhook)
}

func (h *WebhookHandler) UpdateWebhook(w http.ResponseWriter, req *http.Request) {
	var requestBody model.UpdateWebhookRequest

	err := json.NewDecoder(req.Body).Decode(&requestBody)
	if err != nil {
		log.Printf("Failed to parse request body: %v", err)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid json")
		return
	}

	err = requestBody.Validate()
	if err != nil {
		log.Printf("Webhook request body validation failed: %v", err)
		apperrors.WriteJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	isActive := true
	if requestBody.IsActive != nil {
		isActive = *requestBody.IsActive
	}

	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	webhook, err := h.webhookService.GetWebhookByID(requestBody.UUID)
	if err != nil {
		if strings.Contains(err.Error(), "no webhooks found") {
			apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found")
			return
		} else {
			log.Printf("Error fetching webhook %s: %v", requestBody.UUID, err)
			apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching webhook")
			return
		}
	}

	if webhook.UserID != userId {
		log.Printf("User %d attempted to update webhook %s that does not belong to them", userId, requestBody.UUID)
		apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found")
		return
	}

	webhookParams := model.Webhook{
		UUID:                requestBody.UUID,
		UserID:              userId,
		Name:                requestBody.Name,
		Description:         requestBody.Description,
		Slug:                requestBody.Slug,
		NotificationTitle:   requestBody.NotificationTitle,
		NotificationMessage: requestBody.NotificationMessage,
		IsActive:            isActive,
	}

	updatedWebhook, err := h.webhookService.UpdateWebhook(&webhookParams)
	if err != nil {
		switch err.(type) {
		case *model.DuplicateWebhookNameError:
			apperrors.WriteJSONError(w, http.StatusConflict, err.Error())
			return
		case *model.DuplicateWebhookSlugError:
			apperrors.WriteJSONError(w, http.StatusConflict, err.Error())
			return
		default:
			log.Printf("Error updating webhook: %v", err)
			apperrors.WriteJSONError(w, http.StatusInternalServerError, "error updating webhook")
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedWebhook)
}

func (h *WebhookHandler) DeleteWebhookByID(w http.ResponseWriter, req *http.Request, webhookId string) {
	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	if webhookId == "" || len(webhookId) != 36 {
		log.Printf("Invalid webhook ID: %s", webhookId)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid webhook ID")
		return
	}

	webhook, err := h.webhookService.GetWebhookByID(webhookId)
	if err != nil {
		if strings.Contains(err.Error(), "no webhooks found") {
			apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found")
			return
		} else {
			log.Printf("Error fetching webhook %s: %v", webhookId, err)
			apperrors.WriteJSONError(w, http.StatusInternalServerError, "error deleting webhook")
			return
		}
	}

	if webhook.UserID != userId {
		log.Printf("User %d attempted to delete webhook %s that does not belong to them", userId, webhookId)
		apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found")
		return
	}

	err = h.webhookService.DeleteWebhook(webhookId)
	if err != nil {
		if strings.Contains(err.Error(), "no webhooks found") {
			apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found")
			return
		} else {
			log.Printf("Error deleting webhook %s: %v", webhookId, err)
			apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching webhook")
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
