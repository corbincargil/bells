package handler

import (
	"encoding/json"
	"log"
	"net/http"

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
	switch req.Method {
	case http.MethodGet:
		h.GetUserWebhooks(w, req)
	case http.MethodPost:
		h.CreateWebhook(w, req)
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
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(webhook)
}
