package service

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"strings"

	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type UserService struct {
	db *database.Database
}

func NewUserService(db *database.Database) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(clerkUserId string) (*model.User, error) {
	prefix, err := s.GenerateUserPrefix()
	if err != nil {
		return nil, err
	}

	params := database.CreateUserParams{ClerkUserId: clerkUserId, Prefix: prefix}

	user, err := s.db.CreateUser(params)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetOrCreateUser(clerkUserID string) (*model.User, error) {
	userID, err := s.db.GetUserIdByClerkID(clerkUserID)
	if err == nil {
		return &model.User{ID: userID, ClerkUserID: clerkUserID}, nil
	}

	return s.CreateUser(clerkUserID)
}

func (s *UserService) GetUserPrefixByID(internalID int) (string, error) {
	return s.db.GetUserPrefixByID(internalID)
}

func (s *UserService) GenerateUserPrefix() (string, error) {
	const MAX_TRIES int = 10
	const PREFIX_LENGTH int = 8

	for i := 0; i <= MAX_TRIES; i++ {
		prefix, err := generateURLSafeString(PREFIX_LENGTH)
		if err != nil {
			return "", err
		}

		isUnique, err := s.db.IsUserPrefixUnique(prefix)
		if err != nil {
			return "", err
		}
		if isUnique {
			return prefix, nil
		}
	}
	return "", fmt.Errorf("could not generate unique user prefix")
}

func generateURLSafeString(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}

	encoded := base64.URLEncoding.EncodeToString(bytes)
	return strings.TrimRight(encoded, "=")[:length], nil
}
