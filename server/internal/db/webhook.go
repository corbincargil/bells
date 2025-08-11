package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetWebhooksByUserId(userId int) ([]model.Webhook, error) {
	rows, err := db.db.Query("SELECT * FROM webhooks WHERE user_id = $1 ORDER BY created_at DESC", userId)
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

func (db *Database) GetWebhookByID(id string) (*model.Webhook, error) {
	query := `SELECT * FROM webhooks WHERE uuid = $1`

	var w model.Webhook
	err := db.db.QueryRow(query, id).Scan(
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
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no webhooks found with id: %s", id)
		}
		log.Printf("Database error fetching webhook %s: %v", id, err)
		return nil, fmt.Errorf("error fetching webhook: %s", id)
	}

	return &w, err
}

// todo: add description
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
        RETURNING *
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

func (db *Database) UpdateWebhook(webhook *model.Webhook) (*model.Webhook, error) {
	query := `
        UPDATE webhooks 
		SET 
            name = $1,
			description = $2,
            slug = $3,
            notification_title = $4,
            notification_message = $5,
            is_active = $6,
			updated_at = $7
        WHERE uuid = $8
        RETURNING *
    `

	var w model.Webhook
	err := db.db.QueryRow(
		query,
		webhook.Name,
		webhook.Description,
		webhook.Slug,
		webhook.NotificationTitle,
		webhook.NotificationMessage,
		webhook.IsActive,
		time.Now(),
		webhook.UUID,
	).Scan(
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
		log.Printf("Database error updating webhook: %v", err)
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
