package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/router"
	"github.com/corbincargil/bells/server/internal/service"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error on startup. Could not load .env file: ", err)
	}

	db := database.DatabaseConnect()
	defer db.Close()

	notificationService := service.NewNotificationService(db)
	webhookService := service.NewWebhookService(db)

	v1router := router.NewV1Router(db, notificationService, webhookService)
	v1router.SetupRoutes()

	port := os.Getenv("PORT")
	addr := fmt.Sprintf(":%s", port)

	log.Printf("Starting server on port %s\n", port)

	http.ListenAndServe(addr, nil)
}
