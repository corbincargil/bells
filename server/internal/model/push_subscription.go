package model

import "time"

type PushSubscription struct {
	ID         int        `db:"id"          json:"-"`
	UUID       string     `db:"uuid"        json:"uuid"`
	UserID     int        `db:"user_id"     json:"-"`
	IsActive   bool       `db:"is_active"   json:"isActive"`
	Endpoint   string     `db:"endpoint"    json:"endpoint"`
	P256dhKey  string     `db:"p256dh_key"  json:"-"`
	AuthKey    string     `db:"auth_key"    json:"-"`
	DeviceName string     `db:"device_name" json:"deviceName"`
	Browser    string     `db:"browser"     json:"browser"`
	Platform   string     `db:"platform"    json:"platform"`
	LastUsed   *time.Time `db:"last_used"   json:"lastUsed"`
	CreatedAt  time.Time  `db:"created_at"  json:"createdAt"`
	UpdatedAt  time.Time  `db:"updated_at"  json:"updatedAt"`
}

type SubKeys struct {
	Auth   string `json:"auth"`
	P256dh string `json:"p256dh"`
}

type WebPushSubscription struct {
	Endpoint string  `json:"endpoint"`
	Keys     SubKeys `json:"keys"`
}

type DeviceInfo struct {
	Name     string `json:"name"`
	Browser  string `json:"browser"`
	Platform string `json:"platform"`
}

type SubscribeRequest struct {
	Subscription WebPushSubscription
	Device       DeviceInfo
}
