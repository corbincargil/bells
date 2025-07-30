package database

import (
	"fmt"
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetNotificationsByUserId(userId int) ([]model.Notification, error) {
	rows, err := db.db.Query("SELECT * FROM notifications WHERE user_id = $1", userId)
	if err != nil {
		log.Print("Error fetching notifications: ", err)
		return nil, fmt.Errorf("error fetching user's notifications: %w", err)
	}
	defer rows.Close()
	var notifications []model.Notification

	for rows.Next() {
		var n model.Notification
		err := rows.Scan(&n.ID, &n.UUID, &n.UserID, &n.WebhookID, &n.Title, &n.Message, &n.URL, &n.IsRead, &n.IsDeleted, &n.CreatedAt, &n.UpdatedAt)
		if err != nil {
			return notifications, err
		}
		notifications = append(notifications, n)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
}
