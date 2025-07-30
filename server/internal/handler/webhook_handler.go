package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
	fmt.Fprintf(w, "Post request\n")
}
