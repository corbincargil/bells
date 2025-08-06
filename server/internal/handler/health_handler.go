package handler

import (
	"encoding/json"
	"net/http"

	database "github.com/corbincargil/bells/server/internal/db"
)

type HealthHandler struct {
	db *database.Database
}

func NewPublicHealthHandler(db *database.Database) *HealthHandler {
	return &HealthHandler{db: db}
}

func (h *HealthHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	if err := h.db.Ping(); err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	body := map[string]string{"status": "ok"}
	json.NewEncoder(w).Encode(body)
}
