package database

import (
	"fmt"
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetSubscriptionsByUserId(userId int) ([]model.PushSubscription, error) {
	rows, err := db.db.Query("SELECT * FROM push_subscriptions WHERE user_id = $1", userId)
	if err != nil {
		log.Printf("Database error fetching subscriptions for user %d: %v", userId, err)
		return nil, fmt.Errorf("error fetching subscriptions")
	}
	defer rows.Close()

	var subscriptions []model.PushSubscription

	for rows.Next() {
		var s model.PushSubscription
		err := rows.Scan(
			&s.ID,
			&s.UUID,
			&s.UserID,
			&s.IsActive,
			&s.CreatedAt,
			&s.UpdatedAt,
		)

		if err != nil {
			log.Printf("Error scanning subscriptions: %v", err)
			return subscriptions, fmt.Errorf("error fetching subscriptions")
		}
		subscriptions = append(subscriptions, s)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating subscriptions: %v", err)
		return nil, fmt.Errorf("error fetching subscriptions")
	}

	return subscriptions, nil
}

func (db *Database) CreatePushSubscription(webhook *model.PushSubscription) (*model.PushSubscription, error) {
	query := `
        INSERT INTO push_subscriptions (
            user_id,
            is_active
        ) 
        VALUES ($1, $2)
        RETURNING uuid, is_active, created_at, updated_at
    `

	var subscription model.PushSubscription
	err := db.db.QueryRow(
		query,
		webhook.UserID,
		webhook.IsActive,
	).Scan(
		&subscription.UUID,
		&subscription.IsActive,
		&subscription.CreatedAt,
		&subscription.UpdatedAt,
	)

	if err != nil {
		log.Printf("Database error creating push subscription: %v", err)
		return nil, fmt.Errorf("unexpected database error")
	}

	return &subscription, nil
}
