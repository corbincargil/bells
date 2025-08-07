package handler

import (
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/apperrors"
	"github.com/corbincargil/bells/server/internal/constants"
	database "github.com/corbincargil/bells/server/internal/db"
)

type PublicWebhookHandler struct {
	db *database.Database
}

func NewPublicWebhookHandler(db *database.Database) *PublicWebhookHandler {
	return &PublicWebhookHandler{db: db}
}

func (h *PublicWebhookHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	incomingUserPrefix := req.PathValue(constants.UserPrefix)
	incomingWebhookSlug := req.PathValue(constants.WebhookSlug)

	//* lookup user
	user, err := h.db.GetUserByPrefix(incomingUserPrefix)
	if err != nil {
		log.Printf("Error fetching user with prefix %s. Reason: %v", incomingUserPrefix, err)
		apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found") //* return generic error
		return
	}

	//* lookup user webhooks
	webhooks, err := h.db.GetWebhooksByUserId(user.ID)
	if err != nil {
		log.Printf("Error fetching webhooks for user %d. Reason: %v", user.ID, err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	//* confirm user owns webhook
	userWebhookSlugs := make(map[string]int, len(webhooks))
	for i, w := range webhooks {
		userWebhookSlugs[w.Slug] = i
	}

	index, exists := userWebhookSlugs[incomingWebhookSlug]
	if !exists {
		log.Printf("No matching webhook found for user prefix %s and slug %s", incomingUserPrefix, incomingWebhookSlug)
		apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found") //* return generic error
		return
	}

	verifiedWebhook := webhooks[index]

	//* confirm webhook is active
	if !verifiedWebhook.IsActive {
		log.Printf("Incoming request received for inactive webhhook: %d", verifiedWebhook.ID)
		apperrors.WriteJSONError(w, http.StatusNotFound, "webhook not found") //* return generic error
		return
	}

	log.Println("Verified Webhook:")
	log.Printf("	id: %d\n", verifiedWebhook.ID)
	log.Printf("	slug: %s\n", verifiedWebhook.Slug)
	log.Printf("	isActive: %t\n", verifiedWebhook.IsActive)

	//todo: export webhook verification to service layer
	//todo: create notification record and send push notification (ATOMIC)
	//todo: update lastUsed on the webhook
}
