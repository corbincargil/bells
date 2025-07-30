package service

import (
	"context"
	"fmt"

	"github.com/corbincargil/bells/server/internal/constants"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type NotificationService struct {
	db *database.Database
}

func NewNotificationService(db *database.Database) *NotificationService {
	return &NotificationService{db: db}
}

func (s *NotificationService) GetUserNotifications(ctx context.Context) ([]model.Notification, error) {
	userId, ok := ctx.Value(constants.InternalUserIDKey).(int)
	if !ok {
		return nil, fmt.Errorf("%s not found in context", constants.InternalUserIDKey)
	}

	notifications, err := s.db.GetNotificationsByUserId(userId)

	if err != nil {
		return nil, err
	}

	return notifications, nil
}
