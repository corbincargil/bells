package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/apperrors"
	"github.com/corbincargil/bells/server/internal/service"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type NotificationHandler struct {
	notificationService *service.NotificationService
}

func NewNotificationHandler(notificationService *service.NotificationService) *NotificationHandler {
	return &NotificationHandler{notificationService: notificationService}
}

func (h *NotificationHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodGet:
		h.GetUserNotifications(w, req)
	case http.MethodPost:
		h.CreateNotification(w, req)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *NotificationHandler) GetUserNotifications(w http.ResponseWriter, req *http.Request) {
	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user in context: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	notifications, err := h.notificationService.GetUserNotificationsWithWebhooks(userId)
	if err != nil {
		log.Printf("Error fetching notifications: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	json, err := json.Marshal(notifications)
	if err != nil {
		log.Printf("Error marshalling notifications: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching notificaitons")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func (h *NotificationHandler) CreateNotification(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Post request\n")
}
