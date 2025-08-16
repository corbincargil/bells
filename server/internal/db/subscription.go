package database

import (
	"fmt"
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

func (db *Database) GetSubscriptionsByUserId(userId int) ([]model.PushSubscription, error) {
	rows, err := db.db.Query(`
	SELECT
		uuid,
		is_active,
		endpoint,
		auth_key,
		p256dh_key,
		device_name,
		browser,
		platform,
		last_used,
		created_at,
		updated_at
	FROM push_subscriptions 
	WHERE user_id = $1
	ORDER BY created_at DESC`, userId)
	if err != nil {
		log.Printf("Database error fetching subscriptions for user %d: %v", userId, err)
		return nil, fmt.Errorf("error fetching subscriptions")
	}
	defer rows.Close()

	var subscriptions []model.PushSubscription

	for rows.Next() {
		var s model.PushSubscription
		err := rows.Scan(
			&s.UUID,
			&s.IsActive,
			&s.Endpoint,
			&s.AuthKey,
			&s.P256dhKey,
			&s.DeviceName,
			&s.Browser,
			&s.Platform,
			&s.LastUsed,
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

func (db *Database) CreatePushSubscription(s *model.PushSubscription) (*model.PushSubscription, error) {
	query := `
        INSERT INTO push_subscriptions (
            user_id,
            is_active,
			endpoint,
			auth_key,
			p256dh_key,
			device_name,
			browser,
			platform
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING 
			uuid,
			is_active,
			endpoint,
			auth_key,
			p256dh_key,
			device_name,
			browser,
			platform,
			last_used,
			created_at,
			updated_at;
    `

	var subscription model.PushSubscription
	err := db.db.QueryRow(
		query,
		s.UserID,
		s.IsActive,
		s.Endpoint,
		s.AuthKey,
		s.P256dhKey,
		s.DeviceName,
		s.Browser,
		s.Platform,
	).Scan(
		&subscription.UUID,
		&subscription.IsActive,
		&subscription.Endpoint,
		&subscription.AuthKey,
		&subscription.P256dhKey,
		&subscription.DeviceName,
		&subscription.Browser,
		&subscription.Platform,
		&subscription.LastUsed,
		&subscription.CreatedAt,
		&subscription.UpdatedAt,
	)

	if err != nil {
		log.Printf("Database error creating push subscription: %v", err)
		return nil, fmt.Errorf("unexpected database error")
	}

	return &subscription, nil
}
