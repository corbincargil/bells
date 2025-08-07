package apperrors

import (
	"encoding/json"
	"net/http"
)

func WriteJSONError(w http.ResponseWriter, statusCode int, err string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := map[string]string{
		"error": err,
	}

	json.NewEncoder(w).Encode(response)
}
