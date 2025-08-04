package model

import "time"

type User struct {
	ID          int       `db:"id"`
	UUID        string    `db:"uuid"`
	ClerkUserID string    `db:"clerk_user_id"`
	UserPrefix  string    `db:"user_prefix"`
	CreatedAt   time.Time `db:"created_at"`
	UpdatedAt   time.Time `db:"updated_at"`
}
