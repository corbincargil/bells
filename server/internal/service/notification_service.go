package service

import (
	"fmt"
	"os"

	"github.com/SherClockHolmes/webpush-go"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type NotificationService struct {
	db *database.Database
}

func NewNotificationService(db *database.Database) *NotificationService {
	return &NotificationService{db: db}
}

func (s *NotificationService) GetUserNotifications(userId int) ([]model.Notification, error) {
	return s.db.GetNotificationsByUserId(userId)
}

func (s *NotificationService) GetUserNotificationsWithWebhooks(userId int) ([]model.NotificationWithWebhook, error) {
	return s.db.GetNotificationsWithWebhooksByUserId(userId)
}

func (s *NotificationService) GetNotificationWithWebhook(uuid string) (*model.NotificationWithWebhook, error) {
	return s.db.GetNotificationWithWebhookByUUID(uuid)
}

func (s *NotificationService) CreateNotification(notification *model.Notification) (*model.Notification, error) {
	return s.db.CreateNotification(notification)
}

func (s *NotificationService) UpdateNotificationReadStatus(uuid string, readStatus bool) error {
	return s.db.UpdateNotificationReadStatus(uuid, readStatus)
}

func (s *NotificationService) UpdateNotificationArchiveStatus(uuid string, archiveStatus bool) error {
	return s.db.UpdateNotificationArchiveStatus(uuid, archiveStatus)
}

func (s *NotificationService) DeleteNotificationByUUID(uuid string) error {
	return s.db.DeleteNotificationByUUID(uuid)
}

func (s *NotificationService) SendPushNotification(newNotification *model.Notification, subscription *model.WebPushSubscription) error {
	sub := &webpush.Subscription{}
	sub.Endpoint = subscription.Endpoint
	sub.Keys.Auth = subscription.Keys.Auth
	sub.Keys.P256dh = subscription.Keys.P256dh

	payload := fmt.Appendf(nil, `{"title":"%s","message":"%s"}`, newNotification.Title, newNotification.Message)

	resp, err := webpush.SendNotification(payload, sub, &webpush.Options{
		//todo remove email address
		Subscriber:      "corbin.carigl@gmail.com",
		VAPIDPublicKey:  os.Getenv("VAPID_PUBLIC_KEY"),
		VAPIDPrivateKey: os.Getenv("VAPID_PRIVATE_KEY"),
		TTL:             30,
	})
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}
