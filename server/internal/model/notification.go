package model

import "time"

type Notification struct {
	ID        int       `db:"id"`
	UUID      string    `db:"uuid"`
	UserID    int       `db:"user_id"`
	WebhookID *int      `db:"webhook_id"`
	Title     string    `db:"title"`
	Message   string    `db:"message"`
	URL       *string   `db:"url"`
	IsRead    bool      `db:"is_read"`
	IsDeleted bool      `db:"is_deleted"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
