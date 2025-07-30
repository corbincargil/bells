package database

import (
	"database/sql"
	"fmt"
	"log"

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
		err := rows.Scan(&w.ID, &w.UUID, &w.UserID, &w.Name, &w.Description, &w.Slug, &w.NotificationTitle, &w.NotificationMessage, &w.IsActive, &w.LastUsed, &w.CreatedAt, &w.UpdatedAt)
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
