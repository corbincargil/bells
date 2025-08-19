package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetNotificationsByUserId(userId int) ([]model.Notification, error) {
	rows, err := db.db.Query("SELECT * FROM notifications WHERE user_id = $1", userId)
	if err != nil {
		log.Printf("Database error fetching notifications for user %d: %v", userId, err)
		return nil, fmt.Errorf("error fetching notifications")
	}
	defer rows.Close()

	var notifications []model.Notification

	for rows.Next() {
		var n model.Notification
		err := rows.Scan(
			&n.ID,
			&n.UUID,
			&n.UserID,
			&n.WebhookID,
			&n.Title,
			&n.Message,
			&n.URL,
			&n.IsRead,
			&n.IsDeleted,
			&n.CreatedAt,
			&n.UpdatedAt,
		)

		if err != nil {
			log.Printf("Error scanning notifications: %v", err)
			return notifications, fmt.Errorf("error fetching notifications")
		}
		notifications = append(notifications, n)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating notificaitons: %v", err)
		return nil, fmt.Errorf("error fetching notifications")
	}

	return notifications, nil
}

func (db *Database) GetNotificationsWithWebhooksByUserId(userId int) ([]model.NotificationWithWebhook, error) {
	query := `
		SELECT 
			n.id,
    		n.uuid,
    		n.user_id,
    		n.webhook_id,
    		n.title,
    		n.message,
    		n.url,
    		n.is_read,
    		n.is_deleted,
    		n.created_at,
    		n.updated_at,
    		w.uuid as webhook_uuid,
    		w.name as webhook_name,
    		w.slug as webhook_slug
		FROM notifications n
		LEFT OUTER JOIN webhooks w
		ON n.webhook_id = w.id
		WHERE n.user_id = $1
		ORDER BY n.created_at DESC
	`
	rows, err := db.db.Query(query, userId)
	if err != nil {
		log.Printf("Database error fetching notifications for user %d: %v", userId, err)
		return nil, fmt.Errorf("error fetching notifications")
	}
	defer rows.Close()

	var notifications []model.NotificationWithWebhook

	for rows.Next() {
		var n model.NotificationWithWebhook
		err := rows.Scan(
			&n.ID,
			&n.UUID,
			&n.UserID,
			&n.WebhookID,
			&n.Title,
			&n.Message,
			&n.URL,
			&n.IsRead,
			&n.IsDeleted,
			&n.CreatedAt,
			&n.UpdatedAt,
			&n.WebhookUUID,
			&n.WebhookName,
			&n.WebhookSlug,
		)

		if err != nil {
			log.Printf("Error scanning notifications: %v", err)
			return notifications, fmt.Errorf("error fetching notifications")
		}
		notifications = append(notifications, n)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating notificaitons: %v", err)
		return nil, fmt.Errorf("error fetching notifications")
	}

	return notifications, nil
}

func (db *Database) GetNotificationWithWebhookByUUID(uuid string) (*model.NotificationWithWebhook, error) {
	query := `
		SELECT 
			n.id,
    		n.uuid,
    		n.user_id,
    		n.webhook_id,
    		n.title,
    		n.message,
    		n.url,
    		n.is_read,
    		n.is_deleted,
    		n.created_at,
    		n.updated_at,
    		w.uuid as webhook_uuid,
    		w.name as webhook_name,
    		w.slug as webhook_slug
		FROM notifications n
		LEFT OUTER JOIN webhooks w
		ON n.webhook_id = w.id
		WHERE n.uuid = $1
	`

	var n model.NotificationWithWebhook
	err := db.db.QueryRow(query, uuid).Scan(
		&n.ID,
		&n.UUID,
		&n.UserID,
		&n.WebhookID,
		&n.Title,
		&n.Message,
		&n.URL,
		&n.IsRead,
		&n.IsDeleted,
		&n.CreatedAt,
		&n.UpdatedAt,
		&n.WebhookUUID,
		&n.WebhookName,
		&n.WebhookSlug,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("Notification not found %s", uuid)
			return nil, fmt.Errorf("notification not found: %s", uuid)
		}
		log.Printf("Database error fetching notification %s: %v", uuid, err)
		return nil, fmt.Errorf("error fetching notification: %s", uuid)
	}

	return &n, nil
}

func (db *Database) CreateNotification(notification *model.Notification) (*model.Notification, error) {
	query := `
        INSERT INTO notifications (
            user_id,
            title,
            message
		)
        VALUES ($1, $2, $3)
        RETURNING 
			id,
			uuid,
			user_id,
			title,
			message,
			is_read,
			is_deleted,
			created_at,
			updated_at
    `

	var n model.Notification
	err := db.db.QueryRow(
		query,
		notification.UserID,
		notification.Title,
		notification.Message,
	).Scan(
		&n.ID,
		&n.UUID,
		&n.UserID,
		&n.Title,
		&n.Message,
		&n.IsRead,
		&n.IsDeleted,
		&n.CreatedAt,
		&n.UpdatedAt,
	)

	if err != nil {
		log.Printf("Database error creating notification: %v", err)

		return nil, fmt.Errorf("unexpected database error")
	}

	return &n, nil
}

func (db *Database) SoftDeleteNotification(uuid string) error {
	query := `
        UPDATE notifications 
		SET 
		  is_deleted = true,
		  updated_at = NOW()
		WHERE uuid = $1
    `

	result, err := db.db.Exec(query, uuid)
	if err != nil {
		log.Printf("Database error soft deleting notification: %v", err)
		return fmt.Errorf("unexpected database error")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Error checking affected rows while soft deleting notification: %v", err)
		return fmt.Errorf("error deleting notification")
	}

	if rowsAffected == 0 {
		log.Printf("Attempted to soft delete notification %s that does not exist: %v", uuid, err)
		return fmt.Errorf("notification not found")
	}

	return nil
}
