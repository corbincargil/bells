package service

import (
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type NotificationService struct {
	db *database.Database
}

func NewNotificationService(db *database.Database) *NotificationService {
	return &NotificationService{db: db}
}

func (s *NotificationService) GetUserNotifications(userId int) ([]model.Notification, error) {
	return s.db.GetNotificationsByUserId(userId)
}

func (s *NotificationService) GetUserNotificationsWithWebhooks(userId int) ([]model.NotificationWithWebhook, error) {
	return s.db.GetNotificationsWithWebhooksByUserId(userId)
}
