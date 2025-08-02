-- Add column with default 
ALTER TABLE users 
ADD COLUMN user_prefix VARCHAR(255) NOT NULL DEFAULT '';

-- Update existing users
UPDATE users SET user_prefix = CONCAT('user_', id) WHERE user_prefix = '';

-- Make it NOT NULL
ALTER TABLE users ALTER COLUMN user_prefix SET NOT NULL;
ALTER TABLE users ALTER COLUMN user_prefix DROP DEFAULT;