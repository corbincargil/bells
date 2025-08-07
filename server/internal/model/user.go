package model

import "time"

type User struct {
	ID          int       `db:"id"            json:"-"`
	UUID        string    `db:"uuid"          json:"uuid"`
	ClerkUserID string    `db:"clerk_user_id" json:"clerkUserId"`
	UserPrefix  string    `db:"user_prefix"   json:"userPrefix"`
	CreatedAt   time.Time `db:"created_at"    json:"createdAt"`
	UpdatedAt   time.Time `db:"updated_at"    json:"updatedAt"`
}
