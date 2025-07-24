package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/service"
	_ "github.com/jackc/pgx/v5/stdlib"
)

const GET = "GET"
const POST = "POST"

type NotificationHandler struct {
	notificationService *service.NotificationService
}

func NewNotificationHandler(notificationService *service.NotificationService) *NotificationHandler {
	return &NotificationHandler{notificationService: notificationService}
}

func (h *NotificationHandler) NotificationHandler(w http.ResponseWriter, req *http.Request) {
	if req.Method == GET {
		notifications, err := h.notificationService.GetAllNotifications()

		if err != nil {
			log.Panic("Error fetching notifications: %w", err)
			return
		}

		json, err := json.Marshal(notifications)
		if err != nil {
			log.Panic("Error converting notifications to json: ", err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(json)
	}

	if req.Method == POST {
		fmt.Fprintf(w, "Post request\n")
	}

}
