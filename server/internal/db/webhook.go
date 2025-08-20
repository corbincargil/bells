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
	query := `
			SELECT 
				w.id,
				w.uuid,
				w.user_id,
				w.name,
				w.description,
				w.slug,
				w.endpoint,
				w.notification_title,
				w.notification_message,
				w.is_active,
				w.last_used,
				w.created_at,
				w.updated_at
			FROM webhooks w
			WHERE user_id = $1
			ORDER BY created_at DESC
			`
	rows, err := db.db.Query(query, userId)
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
			&w.Endpoint,
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
	query := `
	SELECT
		w.id,
		w.uuid,
		w.user_id,
		w.name,
		w.description,
		w.slug,
		w.endpoint,
		w.notification_title,
		w.notification_message,
		w.is_active,
		w.last_used,
		w.created_at,
		w.updated_at
	FROM webhooks w
	WHERE uuid = $1`

	var w model.Webhook
	err := db.db.QueryRow(query, id).Scan(
		&w.ID,
		&w.UUID,
		&w.UserID,
		&w.Name,
		&w.Description,
		&w.Slug,
		&w.Endpoint,
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

	return &w, nil
}

// todo: add description
func (db *Database) CreateWebhook(webhook *model.Webhook) (*model.Webhook, error) {
	query := `
        INSERT INTO webhooks (
            user_id,
            name,
            slug,
			endpoint,
            notification_title,
            notification_message,
            is_active
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
			id,
			uuid,
			user_id,
			name,
			description,
			slug,
			endpoint,
			notification_title,
			notification_message,
			is_active,
			last_used,
			created_at,
			updated_at
    `

	var w model.Webhook
	err := db.db.QueryRow(
		query,
		webhook.UserID,
		webhook.Name,
		webhook.Slug,
		webhook.Endpoint,
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
		&w.Endpoint,
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

	return &w, nil
}

func (db *Database) UpdateWebhook(webhook *model.Webhook) (*model.Webhook, error) {
	query := `
        UPDATE webhooks 
		SET 
            name = $1,
			description = $2,
            slug = $3,
			endpoint = $4,
            notification_title = $5,
            notification_message = $6,
            is_active = $7,
			updated_at = $8
        WHERE uuid = $9
        RETURNING 
			id,
			uuid,
			user_id,
			name,
			description,
			slug,
			endpoint,
			notification_title,
			notification_message,
			is_active,
			last_used,
			created_at,
			updated_at
    `

	var w model.Webhook
	err := db.db.QueryRow(
		query,
		webhook.Name,
		webhook.Description,
		webhook.Slug,
		webhook.Endpoint,
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
		&w.Endpoint,
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

	return &w, nil
}

func (db *Database) UpdateWebhookLastUsedNow(id string) error {
	query := `
	UPDATE webhooks
	SET last_used = NOW()
	WHERE uuid = $1
	`

	result, err := db.db.Exec(query, id)
	if err != nil {
		log.Printf("Error updating webhook %s last_used: %v", id, err)
		return fmt.Errorf("error updating webhook: %s", id)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no webhooks found with id: %s", id)
	}

	return nil
}

func (db *Database) DeleteWebhookByID(id string) error {
	query := `DELETE FROM webhooks WHERE uuid = $1`

	result, err := db.db.Exec(query, id)
	if err != nil {
		log.Printf("Error deleting webhook %s: %v", id, err)
		return fmt.Errorf("error deleting webhook: %s", id)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no webhooks found with id: %s", id)
	}

	return nil
}
