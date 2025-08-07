package handler

import (
	"context"
	"fmt"

	"github.com/corbincargil/bells/server/internal/constants"
)

func GetUserIDFromContext(ctx context.Context) (int, error) {
	userId, ok := ctx.Value(constants.InternalUserIDKey).(int)
	if !ok {
		return 0, fmt.Errorf("user ID not found in context")
	}
	return userId, nil
}
