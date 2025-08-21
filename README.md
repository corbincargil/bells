# Honk 📢
> Turn any HTTP request into an instant notification

<div align="center">
  <img width="400" height="400" alt="honk-logo" src="https://github.com/user-attachments/assets/ad6a6a3f-9e3f-45cb-b269-2a299d9d5905" />
</div>

## Motivation

I'm a developer who got tired of drowning in spam emails and missing the important stuff. So I built Honk to centralize all the alerts I actually care about from my projects and services. Plus, I wanted an excuse to learn Go.

No more digging through email clutter to find that critical deployment notification or missing that payment alert because it got buried under newsletters. Just clean, instant notifications for the things that matter.

## 🚀 How It Works

1. **Create a Webhook** - Set up a custom webhook with your notification message and title
2. **Connect Your Service** - Use the webhook URL in your apps, CI/CD, monitoring tools, or any HTTP service
3. **Get Notified** - Receive instant push notifications on all your devices when the webhook is triggered

## 💡 Ideal For

- CI/CD pipeline notifications
- Deployment alerts
- Error monitoring
- Build status updates
- Payment confirmations
- System health checks

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Go server
- **Database**: PostgreSQL (Neon for production)
- **Authentication**: Clerk
- **Deployment**: Railway
- **Web Server**: Nginx

## 🛠️ Development

```bash
# Clone and run with Docker (recommended)
git clone https://github.com/corbincargil/bells.git
cd bells

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL (any PostgreSQL), CLERK keys, and VAPID keys

# Run the full stack
docker-compose up
```

Frontend: `http://localhost:3000` | Backend: `http://localhost:8080`

## 🚢 Deployment

Deployed on **Railway** with automatic builds from GitHub. You can also use `docker-compose` on any host.

## 📝 Contributing

Fork, branch, commit, push, PR. Standard stuff!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made by [Corbin Cargil](https://github.com/corbincargil)**
