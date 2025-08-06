package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/corbincargil/bells/server/internal/model"
)

type CreateUserParams struct {
	ClerkUserId string
	Prefix      string
}

func (db *Database) GetUserIDByClerkID(clerkUserId string) (int, error) {
	var userId int
	if err := db.db.QueryRow("SELECT id FROM users WHERE clerk_user_id = $1", clerkUserId).Scan(&userId); err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("no users found with clerk user id: %s", clerkUserId)
		}
		return 0, fmt.Errorf("could not find user with id: %s", clerkUserId)
	}
	return userId, nil
}

func (db *Database) GetUserByPrefix(prefix string) (*model.User, error) {
	var user model.User
	err := db.db.QueryRow("SELECT id, uuid, clerk_user_id, user_prefix, created_at, updated_at FROM users WHERE user_prefix = $1", prefix).Scan(
		&user.ID,
		&user.UUID,
		&user.ClerkUserID,
		&user.UserPrefix,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		log.Println(err)
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no users found with prefix: %s", prefix)
		}
		return nil, fmt.Errorf("could not find user with prefix: %s", prefix)
	}

	return &user, nil
}

func (db *Database) CreateUser(userData CreateUserParams) (*model.User, error) {
	var user model.User

	query := `
		INSERT INTO users (clerk_user_id, user_prefix)
		VALUES ($1, $2)
		RETURNING id, uuid, clerk_user_id, user_prefix, created_at, updated_at
	`

	err := db.db.QueryRow(query, userData.ClerkUserId, userData.Prefix).Scan(
		&user.ID,
		&user.UUID,
		&user.ClerkUserID,
		&user.UserPrefix,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &user, nil
}

func (db *Database) IsUserPrefixUnique(prefix string) (bool, error) {
	var count int
	err := db.db.QueryRow("SELECT COUNT(*) FROM users WHERE user_prefix = $1", prefix).Scan(&count)
	if err != nil {
		return false, err
	}
	return count == 0, nil
}
