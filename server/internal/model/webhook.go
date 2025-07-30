package model

import "time"

type Webhook struct {
	ID                  int        `db:"id"                   json:"-"`
	UUID                string     `db:"uuid"                 json:"uuid"`
	UserID              int        `db:"user_id"              json:"-"`
	Name                string     `db:"name"                 json:"name"`
	Description         *string    `db:"description"          json:"description"`
	Slug                string     `db:"slug"                 json:"slug"`
	NotificationTitle   string     `db:"notification_title"   json:"notificationTitle"`
	NotificationMessage string     `db:"notification_message" json:"notificationMessage"`
	IsActive            bool       `db:"is_active"            json:"isActive"`
	LastUsed            *time.Time `db:"last_used"            json:"lastUsed"`
	CreatedAt           time.Time  `db:"created_at"           json:"createdAt"`
	UpdatedAt           time.Time  `db:"updated_at"           json:"updtedAt"`
}
