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

type SubscriptionHandler struct {
	subscriptionService *service.SubscriptionService
}

func NewSubscriptionHandler(subscriptionService *service.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{subscriptionService: subscriptionService}
}

func (h *SubscriptionHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Path
	pathSegments := strings.Split(strings.Trim(path, "/"), "/")

	switch req.Method {
	case http.MethodGet:
		h.GetUserSubscriptions(w, req)
	case http.MethodPost:
		if len(pathSegments) == 4 && pathSegments[2] == "subscriptions" && pathSegments[3] == "subscribe" {
			h.HandleNewSubscription(w, req)
		} else {
			log.Printf("Page not found. Path segments: %v", pathSegments)
			apperrors.WriteJSONError(w, http.StatusNotFound, "page not found")
			return
		}
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *SubscriptionHandler) GetUserSubscriptions(w http.ResponseWriter, req *http.Request) {
	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	subscriptions, err := h.subscriptionService.GetUserSubscriptions(userId)
	if err != nil {
		log.Printf("Error fetching subscriptions for user %d: %v", userId, err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	json, err := json.Marshal(subscriptions)
	if err != nil {
		log.Printf("Error marshalling subscriptions: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching subscriptions")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func (h *SubscriptionHandler) HandleNewSubscription(w http.ResponseWriter, req *http.Request) {
	var requestBody model.SubscribeRequest

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

	subsciptionParams := model.PushSubscription{
		UserID:     userId,
		IsActive:   true,
		Endpoint:   requestBody.Subscription.Endpoint,
		AuthKey:    requestBody.Subscription.Keys.Auth,
		P256dhKey:  requestBody.Subscription.Keys.P256dh,
		DeviceName: requestBody.Device.Name,
		Browser:    requestBody.Device.Browser,
		Platform:   requestBody.Device.Platform,
	}

	sub, err := h.subscriptionService.CreateSubscription(&subsciptionParams)
	if err != nil {
		log.Printf("Error creating subscription: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(sub)
}
