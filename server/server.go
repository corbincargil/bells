package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/config"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/router"
	"github.com/corbincargil/bells/server/internal/service"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	cfg := config.Load()

	db := database.DatabaseConnect()
	defer db.Close()

	notificationService := service.NewNotificationService(db)
	webhookService := service.NewWebhookService(db)
	subscriptionService := service.NewSubscriptionService(db)
	userService := service.NewUserService(db)

	v1router := router.NewV1Router(db, notificationService, webhookService, subscriptionService, userService)
	v1router.SetupRoutes()

	addr := fmt.Sprintf(":%s", cfg.Port)

	log.Printf("Starting server on port:  %s", cfg.Port)
	log.Printf("Environment: %s", cfg.Env)

	http.ListenAndServe(addr, nil)
}
