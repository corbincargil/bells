package middleware

import (
	"context"
	"log"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/corbincargil/bells/server/internal/constants"
	database "github.com/corbincargil/bells/server/internal/db"
)

func WithAuth(db *database.Database, handler http.Handler) http.Handler {
	return clerkhttp.WithHeaderAuthorization()(checkClerkAuth(db, handler))
}

func checkClerkAuth(db *database.Database, next http.Handler) http.Handler {
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

		internalUserId, err := db.GetUserIDByClerkID(clerkUserID)
		if err != nil {
			log.Printf("Could not find user")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized", "message": "could not find user with that clerk id"}`))
			return
		}

		ctx := context.WithValue(r.Context(), constants.ClerkUserIDKey, clerkUserID)
		ctx = context.WithValue(ctx, constants.InternalUserIDKey, internalUserId)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
