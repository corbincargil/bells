package handler

import (
	"encoding/json"
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
	//todo: implement rate-limiting

	//todo: create notification record and send push notification (ATOMIC)
	var newNotificationParams model.Notification
	newNotificationParams.Title = verifiedWebhook.NotificationTitle
	newNotificationParams.Message = verifiedWebhook.NotificationMessage
	newNotificationParams.UserID = verifiedWebhook.UserID
	newNotificationParams.WebhookID = &verifiedWebhook.ID

	//todo: make atomic with sending push notification
	//todo: could create notification from front end after successful push notification (need to make sure to prevent dupes)
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

	//todo: cleanup/improve error handling
	if len(userSubscriptions) == 0 {
		log.Printf("No user subscriptions found")
		return
	}

	for i := range userSubscriptions {
		sub := model.WebPushSubscription{
			Endpoint: userSubscriptions[i].Endpoint,
			Keys: model.SubKeys{
				Auth:   userSubscriptions[i].AuthKey,
				P256dh: userSubscriptions[i].P256dhKey,
			},
		}

		job := service.Job{
			Notification:    *newNotification,
			WebSubscription: sub,
		}

		h.notificationService.SubmitJob(job)
	}

	err = h.webhookService.UpdateWebhookLastUsedNow(verifiedWebhook.UUID)
	if err != nil {
		apperrors.WriteJSONError(w, http.StatusInternalServerError, "internal service error")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
