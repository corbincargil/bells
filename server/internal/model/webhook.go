package model

import (
	"fmt"
	"time"
)

// todo: add url (should i use url or slug? Keep both? Or just one of them?)
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
	UpdatedAt           time.Time  `db:"updated_at"           json:"updatedAt"`
}

type CreateWebhookRequest struct {
	Name                string  `json:"name"`
	Description         *string `json:"description"`
	Slug                string  `json:"slug"`
	NotificationTitle   string  `json:"notificationTitle"`
	NotificationMessage string  `json:"notificationMessage"`
	IsActive            *bool   `json:"isActive"`
}

type UpdateWebhookRequest struct {
	UUID                string  `json:"uuid"`
	Name                string  `json:"name"`
	Description         *string `json:"description"`
	Slug                string  `json:"slug"`
	NotificationTitle   string  `json:"notificationTitle"`
	NotificationMessage string  `json:"notificationMessage"`
	IsActive            *bool   `json:"isActive"`
}

func (req *CreateWebhookRequest) Validate() error {
	if req.Name == "" {
		return fmt.Errorf("name is required")
	}
	if req.Slug == "" {
		return fmt.Errorf("slug is required")
	}
	if req.NotificationTitle == "" {
		return fmt.Errorf("notification title is required")
	}
	if req.NotificationMessage == "" {
		return fmt.Errorf("notification message is required")
	}
	return nil
}

func (req *UpdateWebhookRequest) Validate() error {
	if req.UUID == "" {
		return fmt.Errorf("uuid is required")
	}
	if req.Name == "" {
		return fmt.Errorf("missing name")
	}
	if req.Slug == "" {
		return fmt.Errorf("missing slug")
	}
	if req.NotificationTitle == "" {
		return fmt.Errorf("missing notification title")
	}
	if req.NotificationMessage == "" {
		return fmt.Errorf("missing notification message")
	}
	return nil
}

type DuplicateWebhookNameError struct {
	WebhookName string
}

func (e *DuplicateWebhookNameError) Error() string {
	return fmt.Sprintf("webhook with name '%s' already exists for this user", e.WebhookName)
}

type DuplicateWebhookSlugError struct {
	WebhookSlug string
}

func (e *DuplicateWebhookSlugError) Error() string {
	return fmt.Sprintf("webhook with slug '%s' already exists for this user", e.WebhookSlug)
}
