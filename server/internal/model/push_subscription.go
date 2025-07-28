package model

import "time"

type PushSubscription struct {
	ID        int       `db:"id"`
	UUID      string    `db:"uuid"`
	UserID    int       `db:"user_id"`
	IsActive  bool      `db:"is_active"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
