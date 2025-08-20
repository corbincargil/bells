ALTER TABLE webhooks ADD COLUMN endpoint VARCHAR(255) NOT NULL DEFAULT '';

UPDATE webhooks SET endpoint = CONCAT('/', (SELECT user_prefix FROM users WHERE users.id = webhooks.user_id), '/webhook/', slug);

ALTER TABLE webhooks ALTER COLUMN endpoint DROP DEFAULT;