package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/apperrors"
	"github.com/corbincargil/bells/server/internal/constants"
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
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *WebhookHandler) GetUserWebhooks(w http.ResponseWriter, req *http.Request) {
	webhooks, err := h.webhookService.GetUserWebhooks(req.Context())
	if err != nil {
		log.Printf("Error fetching webhooks: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Error fetching webhooks"}`))
		return
	}

	json, err := json.Marshal(webhooks)
	if err != nil {
		log.Printf("Error fetching webhooks: %v", err)
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

	userId, ok := req.Context().Value(constants.InternalUserIDKey).(int)
	if !ok {
		log.Printf("Missing user ID in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "user not found")
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
