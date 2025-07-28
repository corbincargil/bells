-- Drop indexes first
DROP INDEX IF EXISTS idx_webhooks_user_name_unique;
DROP INDEX IF EXISTS idx_webhooks_user_slug_unique;

-- Drop tables in reverse order (respecting foreign key dependencies)
DROP TABLE IF EXISTS push_subscriptions;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS users;
