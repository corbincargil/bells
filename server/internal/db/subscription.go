package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetSubscriptionsByUserId(userId int) ([]model.PushSubscription, error) {
	rows, err := db.db.Query("SELECT * FROM push_subscriptions WHERE user_id = $1", userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no subscriptions found for user: %d", userId)
		}
		log.Print("Error fetching subscriptions: ", err)
		return nil, fmt.Errorf("error fetching user's subscriptions: %w", err)
	}
	defer rows.Close()
	var subscriptions []model.PushSubscription

	for rows.Next() {
		var s model.PushSubscription
		err := rows.Scan(&s.ID, &s.UUID, &s.UserID, &s.IsActive, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			return subscriptions, err
		}
		subscriptions = append(subscriptions, s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return subscriptions, nil
}
