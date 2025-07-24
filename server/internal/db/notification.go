package database

import (
	"log"

	"github.com/corbincargil/bells/internal/model"
)

func (db *Database) GetAllNotifications() ([]model.Notification, error) {
	rows, err := db.db.Query("SELECT * FROM notification")
		if err != nil {
			log.Fatal("Error fetching notifications: ", err)
		}
		defer rows.Close()
		var notifications []model.Notification
		
		for rows.Next() {
			var n model.Notification
			err := rows.Scan(&n.ID, &n.Title)
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