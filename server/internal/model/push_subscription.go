package model

import "time"

type PushSubscription struct {
	ID       int    `db:"id"         json:"-"`
	UUID     string `db:"uuid"       json:"uuid"`
	UserID   int    `db:"user_id"    json:"-"`
	IsActive bool   `db:"is_active"  json:"isActive"`
	// todo: endpoint VARCHAR(500) NOT NULL,
	// todo: p256dh_key VARCHAR(255) NOT NULL,
	// todo: auth_key VARCHAR(255) NOT NULL,
	// todo: subscription_json TEXT NOT NULL,
	// todo: expiration (datetime),
	// todo: last_used
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type CreateSubscriptionRequest struct {
	IsActive *bool `json:"isActive"`
}
