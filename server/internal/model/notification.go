package model

import "time"

type Notification struct {
	ID        int       `db:"id"         json:"-"`
	UUID      string    `db:"uuid"       json:"uuid"`
	UserID    int       `db:"user_id"    json:"-"`
	WebhookID *int      `db:"webhook_id" json:"webhookId"`
	Title     string    `db:"title"      json:"title"`
	Message   string    `db:"message"    json:"message"`
	URL       *string   `db:"url"        json:"url"`
	IsRead    bool      `db:"is_read"    json:"isRead"`
	IsDeleted bool      `db:"is_deleted" json:"isDeleted"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}
