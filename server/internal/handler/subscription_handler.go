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

type SubscriptionHandler struct {
	subscriptionService *service.SubscriptionService
}

func NewSubscriptionHandler(subscriptionService *service.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{subscriptionService: subscriptionService}
}

func (h *SubscriptionHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodGet:
		h.GetUserSubscriptions(w, req)
	case http.MethodPost:
		h.CreateSubscription(w, req)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *SubscriptionHandler) GetUserSubscriptions(w http.ResponseWriter, req *http.Request) {
	subscriptions, err := h.subscriptionService.GetUserSubscriptions(req.Context())
	if err != nil {
		log.Printf("Error fetching subscriptions: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Error fetching subscriptions"}`))
		return
	}

	json, err := json.Marshal(subscriptions)
	if err != nil {
		log.Printf("Error fetching subscriptions: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func (h *SubscriptionHandler) CreateSubscription(w http.ResponseWriter, req *http.Request) {
	var requestBody model.CreateSubscriptionRequest

	err := json.NewDecoder(req.Body).Decode(&requestBody)
	if err != nil {
		log.Printf("Failed to parse request body: %v", err)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid json")
		return
	}

	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	isActive := true
	if requestBody.IsActive != nil {
		isActive = *requestBody.IsActive
	}

	webhookParams := model.PushSubscription{
		UserID:   userId,
		IsActive: isActive,
	}

	webhook, err := h.subscriptionService.CreateSubscription(&webhookParams)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(webhook)
}
