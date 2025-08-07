package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetWebhooksByUserId(userId int) ([]model.Webhook, error) {
	rows, err := db.db.Query("SELECT * FROM webhooks WHERE user_id = $1", userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no webhooks found for user: %d", userId)
		}
		log.Print("Error fetching webhooks: ", err)
		return nil, fmt.Errorf("error fetching user's webhooks: %w", err)
	}
	defer rows.Close()
	var webhooks []model.Webhook

	for rows.Next() {
		var w model.Webhook
		err := rows.Scan(
			&w.ID,
			&w.UUID,
			&w.UserID,
			&w.Name,
			&w.Description,
			&w.Slug,
			&w.NotificationTitle,
			&w.NotificationMessage,
			&w.IsActive,
			&w.LastUsed,
			&w.CreatedAt,
			&w.UpdatedAt,
		)
		if err != nil {
			return webhooks, err
		}
		webhooks = append(webhooks, w)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return webhooks, nil
}

func (db *Database) CreateWebhook(webhook *model.Webhook) (*model.Webhook, error) {
	query := `
        INSERT INTO webhooks (
            user_id,
            name,
            slug,
            notification_title,
            notification_message,
            is_active
        ) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, uuid, user_id, name, slug, notification_title, notification_message, is_active, created_at, updated_at
    `

	var w model.Webhook
	err := db.db.QueryRow(
		query,
		webhook.UserID,
		webhook.Name,
		webhook.Slug,
		webhook.NotificationTitle,
		webhook.NotificationMessage,
		webhook.IsActive,
	).Scan(
		&w.UUID,
		&w.Name,
		&w.Slug,
		&w.NotificationTitle,
		&w.NotificationMessage,
		&w.IsActive,
		&w.CreatedAt,
		&w.UpdatedAt,
	)

	if err != nil {
		log.Printf("Database error creating webhook: %v", err)
		if strings.Contains(err.Error(), "idx_webhooks_user_name_unique") {
			return nil, &model.DuplicateWebhookNameError{
				WebhookName: webhook.Name,
			}
		}

		if strings.Contains(err.Error(), "idx_webhooks_user_slug_unique") {
			return nil, &model.DuplicateWebhookSlugError{
				WebhookSlug: webhook.Slug,
			}
		}

		return nil, fmt.Errorf("unexpected database error")
	}

	return &w, err
}
