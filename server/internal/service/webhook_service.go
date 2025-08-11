package service

import (
	"fmt"
	"log"

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

func (s *WebhookService) GetWebhookByID(webhookId string) (*model.Webhook, error) {
	return s.db.GetWebhookByID(webhookId)
}

func (s *WebhookService) CreateWebhook(webhook *model.Webhook) (*model.Webhook, error) {
	return s.db.CreateWebhook(webhook)
}

func (s *WebhookService) FindAndVerifyWebhook(userPrefix string, webhookSlug string) (*model.Webhook, error) {
	// * lookup user
	userId, err := s.db.GetUserIdByPrefix(userPrefix)
	if err != nil {
		log.Printf("Error fetching userId with prefix %s. Reason: %v", userPrefix, err)
		return nil, fmt.Errorf("webhook not found") //* return generic error
	}

	// * lookup user webhooks
	webhooks, err := s.db.GetWebhooksByUserId(userId)
	if err != nil {
		log.Printf("Error fetching webhooks for user %d. Reason: %v", userId, err)
		return nil, fmt.Errorf("webhook not found") //* return generic error
	}

	// * confirm user owns webhook
	userWebhookSlugs := make(map[string]int, len(webhooks))
	for i, w := range webhooks {
		userWebhookSlugs[w.Slug] = i
	}

	index, exists := userWebhookSlugs[webhookSlug]
	if !exists {
		log.Printf("No matching webhook found for user prefix %s and slug %s", userPrefix, webhookSlug)
		return nil, fmt.Errorf("webhook not found") //* return generic error
	}

	verifiedWebhook := webhooks[index]

	// * confirm webhook is active
	if !verifiedWebhook.IsActive {
		log.Printf("Incoming request received for inactive webhhook: %d", verifiedWebhook.ID)
		return nil, fmt.Errorf("webhook not found") //* return generic error
	}

	return &verifiedWebhook, nil
}
