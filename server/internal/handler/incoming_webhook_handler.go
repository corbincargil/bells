package handler

import (
	"log"
	"net/http"

	"github.com/corbincargil/bells/server/internal/apperrors"
	"github.com/corbincargil/bells/server/internal/constants"
	"github.com/corbincargil/bells/server/internal/model"
	"github.com/corbincargil/bells/server/internal/service"
)

type PublicWebhookHandler struct {
	webhookService      *service.WebhookService
	notificationService *service.NotificationService
	subscriptionService *service.SubscriptionService
}

func NewPublicWebhookHandler(w *service.WebhookService, n *service.NotificationService, s *service.SubscriptionService) *PublicWebhookHandler {
	return &PublicWebhookHandler{webhookService: w, notificationService: n, subscriptionService: s}
}

func (h *PublicWebhookHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	incomingUserPrefix := req.PathValue(constants.UserPrefix)
	incomingWebhookSlug := req.PathValue(constants.WebhookSlug)

	verifiedWebhook, err := h.webhookService.FindAndVerifyWebhook(incomingUserPrefix, incomingWebhookSlug)
	if err != nil {
		apperrors.WriteJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	log.Println("Verified Webhook ✅")

	//todo: create notification record and send push notification (ATOMIC)
	var newNotificationParams model.Notification
	newNotificationParams.Title = verifiedWebhook.NotificationTitle
	newNotificationParams.Message = verifiedWebhook.NotificationMessage
	newNotificationParams.UserID = verifiedWebhook.UserID

	//todo: make atomic with sending push notification
	newNotification, err := h.notificationService.CreateNotification(&newNotificationParams)
	if err != nil {
		log.Printf("Error creating notification: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	userSubscriptions, err := h.subscriptionService.GetUserSubscriptions(newNotification.UserID)
	if err != nil {
		log.Printf("Error fetching user subscriptions: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	if len(userSubscriptions) == 0 {
		log.Printf("No user subscriptions found")
		return
	}

	var sub model.WebPushSubscription
	sub.Endpoint = userSubscriptions[0].Endpoint
	sub.Keys.Auth = userSubscriptions[0].AuthKey
	sub.Keys.P256dh = userSubscriptions[0].P256dhKey

	//todo: cleanup/improve error handling
	err = h.notificationService.SendPushNotification(newNotification, &sub)
	if err != nil {
		log.Printf("Error sending push notification: %v", err)
		apperrors.WriteJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Printf("user sub: %s", userSubscriptions[0].Endpoint)

	//todo: update lastUsed on the webhook
}
