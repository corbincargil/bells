package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port            string
	DBUrl           string
	ClerkKey        string
	Env             string
	VAPIDEmail      string
	VAPIDPublicKey  string
	VAPIDPrivateKey string
}

func Load() *Config {
	env := os.Getenv("GO_ENV")
	if env == "" {
		env = "development"
	}

	if env == "development" {
		godotenv.Load()
	}

	cfg := &Config{
		Port:            getEnvOrDefault("PORT", "8080"),
		DBUrl:           os.Getenv("DATABASE_URL"),
		ClerkKey:        os.Getenv("CLERK_SECRET_KEY"),
		VAPIDEmail:      os.Getenv("VAPID_EMAIL_ADDRESS"),
		VAPIDPublicKey:  os.Getenv("VAPID_PUBLIC_KEY"),
		VAPIDPrivateKey: os.Getenv("VAPID_PRIVATE_KEY"),
		Env:             env,
	}

	if env == "production" {
		validateProductionConfig(cfg)
	}

	return cfg
}

func getEnvOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func validateProductionConfig(cfg *Config) {
	required := map[string]string{
		"DATABASE_URL":        cfg.DBUrl,
		"CLERK_SECRET_KEY":    cfg.ClerkKey,
		"VAPID_EMAIL_ADDRESS": cfg.VAPIDEmail,
		"VAPID_PUBLIC_KEY":    cfg.VAPIDPublicKey,
		"VAPID_PRIVATE_KEY":   cfg.VAPIDPrivateKey,
	}

	var missing []string
	for name, value := range required {
		if value == "" {
			missing = append(missing, name)
		}
	}

	if len(missing) > 0 {
		log.Fatalf("Missing required environment variables in production: %v", missing)
	}
}
