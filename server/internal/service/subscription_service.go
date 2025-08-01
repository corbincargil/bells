package service

import (
	"context"
	"fmt"

	"github.com/corbincargil/bells/server/internal/constants"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type SubscriptionService struct {
	db *database.Database
}

func NewSubscriptionService(db *database.Database) *SubscriptionService {
	return &SubscriptionService{db: db}
}

func (s *SubscriptionService) GetUserSubscriptions(ctx context.Context) ([]model.PushSubscription, error) {
	userId, ok := ctx.Value(constants.InternalUserIDKey).(int)
	if !ok {
		return nil, fmt.Errorf("%s not found in context", constants.InternalUserIDKey)
	}

	subscriptions, err := s.db.GetSubscriptionsByUserId(userId)
	if err != nil {
		return nil, err
	}

	return subscriptions, nil
}
