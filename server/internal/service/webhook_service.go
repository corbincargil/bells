package service

import (
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type WebhookService struct {
	db *database.Database
}

func NewWebhookService(db *database.Database) *WebhookService {
	return &WebhookService{db: db}
}

func (s *WebhookService) GetUserWebhooks(userId int) ([]model.Webhook, error) {
	return s.db.GetWebhooksByUserId(userId)
}

func (s *WebhookService) CreateWebhook(webhook *model.Webhook) (*model.Webhook, error) {
	return s.db.CreateWebhook(webhook)
}
