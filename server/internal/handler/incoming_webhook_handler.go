package handler

import (
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/apperrors"
	"github.com/corbincargil/bells/server/internal/constants"
	"github.com/corbincargil/bells/server/internal/service"
)

type PublicWebhookHandler struct {
	webhookService *service.WebhookService
}

func NewPublicWebhookHandler(s *service.WebhookService) *PublicWebhookHandler {
	return &PublicWebhookHandler{webhookService: s}
}

func (h *PublicWebhookHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	incomingUserPrefix := req.PathValue(constants.UserPrefix)
	incomingWebhookSlug := req.PathValue(constants.WebhookSlug)

	verifiedWebhook, err := h.webhookService.FindAndVerifyWebhook(incomingUserPrefix, incomingWebhookSlug)
	if err != nil {
		apperrors.WriteJSONError(w, http.StatusNotFound, err.Error())
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
