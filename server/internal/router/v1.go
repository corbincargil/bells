package router

import (
	"fmt"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/corbincargil/bells/server/internal/constants"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/handler"
	"github.com/corbincargil/bells/server/internal/middleware"
	"github.com/corbincargil/bells/server/internal/service"
)

type V1Router struct {
	db                   *database.Database
	userService          *service.UserService
	publicHealthHandler  *handler.HealthHandler
	publicWebhookHandler *handler.PublicWebhookHandler
	notificationHandler  *handler.NotificationHandler
	webhookHandler       *handler.WebhookHandler
	subscriptionHandler  *handler.SubscriptionHandler
}

func NewV1Router(db *database.Database, n *service.NotificationService, w *service.WebhookService, s *service.SubscriptionService) *V1Router {
	return &V1Router{
		db:                   db,
		userService:          service.NewUserService(db),
		publicHealthHandler:  handler.NewPublicHealthHandler(db),
		publicWebhookHandler: handler.NewPublicWebhookHandler(w),
		notificationHandler:  handler.NewNotificationHandler(n),
		webhookHandler:       handler.NewWebhookHandler(w),
		subscriptionHandler:  handler.NewSubscriptionHandler(s),
	}
}

func (v *V1Router) SetupRoutes() {
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	//* health
	http.Handle("/api/v1/health", v.publicHealthHandler)

	//* incoming webhooks
	incomingWebhookPath := fmt.Sprintf("/{%s}/webhook/{%s}", constants.UserPrefix, constants.WebhookSlug)

	http.Handle(incomingWebhookPath, v.publicWebhookHandler)

	//* notifications
	http.Handle("/api/v1/notifications", middleware.WithAuth(v.userService, v.notificationHandler))

	//* webhooks
	http.Handle("/api/v1/webhooks", middleware.WithAuth(v.userService, v.webhookHandler))

	//* push subscriptions
	http.Handle("/api/v1/subscriptions", middleware.WithAuth(v.userService, v.subscriptionHandler))
}
