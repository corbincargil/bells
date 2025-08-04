package middleware

import (
	"context"
	"log"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/corbincargil/bells/server/internal/constants"
	"github.com/corbincargil/bells/server/internal/service"
)

func WithAuth(userService *service.UserService, handler http.Handler) http.Handler {
	return clerkhttp.WithHeaderAuthorization()(checkClerkAuth(userService, handler))
}

func checkClerkAuth(userService *service.UserService, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := clerk.SessionClaimsFromContext(r.Context())
		if !ok {
			log.Printf("AUTH_FAILED: path=%s method=%s ip=%s user_agent=%s",
				r.URL.Path, r.Method, r.RemoteAddr, r.UserAgent())
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized", "message": "unauthorized"}`))
			return
		}

		clerkUserID := claims.Subject
		if clerkUserID == "" {
			log.Printf("Missing clerk user ID")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized", "message": "missing clerk user id"}`))
			return
		}

		user, err := userService.GetOrCreateUser(clerkUserID)
		if err != nil {
			log.Printf("Could not get or create user: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"access": "error", "message": "failed to process user"}`))
			return
		}

		ctx := context.WithValue(r.Context(), constants.ClerkUserIDKey, clerkUserID)
		ctx = context.WithValue(ctx, constants.InternalUserIDKey, user.ID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
