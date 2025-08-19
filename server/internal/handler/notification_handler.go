package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

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
	path := req.URL.Path
	pathSegments := strings.Split(strings.Trim(path, "/"), "/")

	switch req.Method {
	case http.MethodGet:
		if len(pathSegments) == 3 && pathSegments[2] == "notifications" {
			h.GetUserNotifications(w, req)
		} else if len(pathSegments) == 4 && pathSegments[2] == "notifications" {
			notificationUuid := pathSegments[3]
			h.GetNotificationByID(w, req, notificationUuid)
		}
	case http.MethodPatch:
		if len(pathSegments) == 4 && pathSegments[2] == "notifications" {
			notificationUuid := pathSegments[3]
			readStatus := req.URL.Query().Get("read")
			h.UpdateNotificationReadStatus(w, req, notificationUuid, readStatus)
		}
	case http.MethodDelete:
		if len(pathSegments) == 4 && pathSegments[2] == "notifications" {
			notificationUuid := pathSegments[3]
			h.SoftDeleteNotification(w, req, notificationUuid)
		}
	default:
		log.Printf("Invalid request: method %s - path %s", req.Method, path)
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

func (h *NotificationHandler) GetNotificationByID(w http.ResponseWriter, req *http.Request, notificationUuid string) {
	userId, err := GetUserIDFromContext(req.Context())
	if err != nil {
		log.Printf("Could not find user %d in context: %v", userId, err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	if notificationUuid == "" || len(notificationUuid) != 36 {
		log.Printf("Invalid webhook UUID: %s", notificationUuid)
		errString := fmt.Sprintf("invalid webhook ID: %s", notificationUuid)
		apperrors.WriteJSONError(w, http.StatusBadRequest, errString)
		return
	}

	notification, err := h.notificationService.GetNotificationWithWebhook(notificationUuid)
	if err != nil {
		if strings.Contains(err.Error(), "notification not found") {
			apperrors.WriteJSONError(w, http.StatusNotFound, err.Error())
		}
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	json, err := json.Marshal(notification)
	if err != nil {
		log.Printf("Error marshalling notification: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "error fetching notificaiton")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}

func (h *NotificationHandler) UpdateNotificationReadStatus(w http.ResponseWriter, req *http.Request, notificationUuid string, readStatus string) {
	if notificationUuid == "" || len(notificationUuid) != 36 {
		log.Printf("Invalid webhook UUID: %s", notificationUuid)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid webhook ID")
		return
	}

	var status bool
	switch readStatus {
	case "true":
		status = true
	case "false":
		status = false
	default:
		log.Printf("Invalid readStatus: %s", readStatus)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid 'read' param. must be 'true' or 'false'")
		return
	}

	err := h.notificationService.UpdateNotificationReadStatus(notificationUuid, status)
	if err != nil {
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (h *NotificationHandler) SoftDeleteNotification(w http.ResponseWriter, req *http.Request, notificationUuid string) {
	if notificationUuid == "" || len(notificationUuid) != 36 {
		log.Printf("Invalid webhook UUID: %s", notificationUuid)
		apperrors.WriteJSONError(w, http.StatusBadRequest, "invalid webhook ID")
		return
	}

	err := h.notificationService.SoftDeleteNotification(notificationUuid)
	if err != nil {
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
