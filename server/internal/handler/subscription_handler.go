package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
	fmt.Fprintf(w, "Post request\n")
}
