package model

import "time"

type PushSubscription struct {
	ID        int       `db:"id"         json:"-"`
	UUID      string    `db:"uuid"       json:"uuid"`
	UserID    int       `db:"user_id"    json:"-"`
	IsActive  bool      `db:"is_active"  json:"isActive"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}
