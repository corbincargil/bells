package service

import (
	database "github.com/corbincargil/bells/internal/db"
	"github.com/corbincargil/bells/internal/model"
)

type NotificationService struct {
	db *database.Database
}

func NewNotificationService(db *database.Database) *NotificationService {
	return &NotificationService{db: db}
}

func (s *NotificationService) GetAllNotifications() ([]model.Notification, error) {
	notifications, err := s.db.GetAllNotifications()

	if err != nil {
		return nil, err
	}

	return notifications, nil
}