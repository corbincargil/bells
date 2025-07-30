package router

import (
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/handler"
	"github.com/corbincargil/bells/server/internal/middleware"
	"github.com/corbincargil/bells/server/internal/service"
)

type V1Router struct {
	db                  *database.Database
	notificationHandler *handler.NotificationHandler
}

func NewV1Router(db *database.Database, n *service.NotificationService) *V1Router {
	return &V1Router{db: db, notificationHandler: handler.NewNotificationHandler(n)}
}

func (v *V1Router) SetupRoutes() {
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	//* health
	healthHandler := handler.NewHealthHandler(v.db)
	http.Handle("/api/v1/health", healthHandler)

	//* notifications
	http.Handle("/api/v1/notifications", middleware.WithAuth(v.db, v.notificationHandler))
}
