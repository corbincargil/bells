package model

import "time"

type Webhook struct {
	ID                  int        `db:"id"`
	UUID                string     `db:"uuid"`
	UserID              int        `db:"user_id"`
	Name                string     `db:"name"`
	Description         *string    `db:"description"`
	Slug                string     `db:"slug"`
	NotificationTitle   string     `db:"notification_title"`
	NotificationMessage string     `db:"notification_message"`
	IsActive            bool       `db:"is_active"`
	LastUsed            *time.Time `db:"last_used"`
	CreatedAt           time.Time  `db:"created_at"`
	UpdatedAt           time.Time  `db:"updated_at"`
}
