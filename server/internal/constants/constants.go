package constants

type key string

// * Context keys
const (
	ClerkUserIDKey    key = "clerk_user_id"
	InternalUserIDKey key = "user_id"
)

// * Webhook public path keys
const (
	UserPrefix  = "user_prefix"
	WebhookSlug = "webhook_slug"
)
