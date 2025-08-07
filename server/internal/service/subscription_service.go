package service

import (
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type SubscriptionService struct {
	db *database.Database
}

func NewSubscriptionService(db *database.Database) *SubscriptionService {
	return &SubscriptionService{db: db}
}

func (s *SubscriptionService) GetUserSubscriptions(userId int) ([]model.PushSubscription, error) {
	return s.db.GetSubscriptionsByUserId(userId)
}

func (s *SubscriptionService) CreateSubscription(subscription *model.PushSubscription) (*model.PushSubscription, error) {
	return s.db.CreatePushSubscription(subscription)
}
