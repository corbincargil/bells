package handler

import (
	"log"
	"net/http"

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

	log.Printf("user_prefix: %v\n", incomingUserPrefix)
	log.Printf("slug: %v\n", incomingWebhookSlug)

	//* lookup user
	user, err := h.db.GetUserByPrefix(incomingUserPrefix)
	if err != nil {
		log.Printf("Error fetching user with prefix %s. Reason: %s", incomingUserPrefix, err)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error": "webhook not found"}`))
		return
	}

	//* lookup user webhooks
	webhooks, err := h.db.GetWebhooksByUserId(user.ID)
	if err != nil {
		log.Printf("Error fetching user webhooks: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Error fetching user webhooks"}`))
		return
	}

	//* confirm user owns webhook
	webhookSlugs := make(map[string]int, len(webhooks))
	for i, w := range webhooks {
		webhookSlugs[w.Slug] = i
	}

	index := webhookSlugs[incomingWebhookSlug]
	verifiedWebhook := webhooks[index]

	//* confirm webhook is active
	if !verifiedWebhook.IsActive {
		log.Printf("Incoming request received for inactive webhhook: %d", verifiedWebhook.ID)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error": "webhook not found"}`))
		return
	}

	log.Println("Verified Webhook:")
	log.Printf("	id: %d\n", verifiedWebhook.ID)
	log.Printf("	slug: %s\n", verifiedWebhook.Slug)
	log.Printf("	isActive: %t\n", verifiedWebhook.IsActive)

	//* create notification record and send push notification (ATOMIC)
	//* update lastUsed on the webhook
}
