package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/corbincargil/bells/server/internal/apperrors"
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
		fmt.Printf("Error in pinging db in /health-check: %v", err)
		apperrors.WriteJSONError(w, http.StatusServiceUnavailable, "service unavailable")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	body := map[string]string{"status": "ok"}
	json.NewEncoder(w).Encode(body)
}
