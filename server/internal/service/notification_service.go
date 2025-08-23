package service

import (
	"fmt"
	"log"
	"os"

	"github.com/SherClockHolmes/webpush-go"
	database "github.com/corbincargil/bells/server/internal/db"
	"github.com/corbincargil/bells/server/internal/model"
)

type NotificationService struct {
	db       *database.Database
	jobQueue chan Job
	quit     chan bool
}

type Job struct {
	Notification    model.Notification
	WebSubscription model.WebPushSubscription
}

func NewNotificationService(db *database.Database) *NotificationService {
	poolSize := 20
	queueSize := 1000

	s := &NotificationService{
		db:       db,
		jobQueue: make(chan Job, queueSize),
		quit:     make(chan bool),
	}

	for range poolSize {
		go s.worker()
	}

	return s
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
	// todo: validate notification title/message content length
	sub := &webpush.Subscription{}
	sub.Endpoint = subscription.Endpoint
	sub.Keys.Auth = subscription.Keys.Auth
	sub.Keys.P256dh = subscription.Keys.P256dh

	payload := fmt.Appendf(nil, `{"title":"%s","message":"%s"}`, newNotification.Title, newNotification.Message)

	resp, err := webpush.SendNotification(payload, sub, &webpush.Options{
		Subscriber:      os.Getenv("VAPID_EMAIL_ADDRESS"),
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

func (s *NotificationService) SubmitJob(job Job) {
	s.jobQueue <- job
}

func (s *NotificationService) worker() {
	for {
		select {
		case job := <-s.jobQueue:
			err := s.SendPushNotification(&job.Notification, &job.WebSubscription)
			if err != nil {
				log.Printf("Push notification failed: %v", err)
			}
			log.Printf("Push notification sent")
		case <-s.quit:
			return
		}
	}
}
