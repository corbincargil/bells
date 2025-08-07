package database

import (
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
