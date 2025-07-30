package database

import (
	"database/sql"
	"fmt"
)

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
