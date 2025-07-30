package service

import (
	"context"
	"fmt"

	"github.com/corbincargil/bells/server/internal/constants"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type WebhookService struct {
	db *database.Database
}

func NewWebhookService(db *database.Database) *WebhookService {
	return &WebhookService{db: db}
}

func (s *WebhookService) GetUserWebhooks(ctx context.Context) ([]model.Webhook, error) {
	userId, ok := ctx.Value(constants.InternalUserIDKey).(int)
	if !ok {
		return nil, fmt.Errorf("%s not found in context", constants.InternalUserIDKey)
	}

	webhooks, err := s.db.GetWebhooksByUserId(userId)
	if err != nil {
		return nil, err
	}

	return webhooks, nil
}
