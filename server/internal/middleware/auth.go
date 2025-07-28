package middleware

import (
	"log"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
)

func WithAuth(handler http.Handler) http.Handler {
	return clerkhttp.WithHeaderAuthorization()(checkClerkAuth(handler))
}

func checkClerkAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, ok := clerk.SessionClaimsFromContext(r.Context())
		if !ok {
			log.Printf("AUTH_FAILED: path=%s method=%s ip=%s user_agent=%s",
				r.URL.Path, r.Method, r.RemoteAddr, r.UserAgent())
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized"}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}
