package database

import (
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetAllNotifications() ([]model.Notification, error) {
	rows, err := db.db.Query("SELECT * FROM notifications")
	if err != nil {
		log.Fatal("Error fetching notifications: ", err)
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
