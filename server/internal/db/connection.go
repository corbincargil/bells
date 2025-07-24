package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type Database struct {
	db *sql.DB
}

func DatabaseConnect() *Database {
	sqlDB, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Error connecting to database:, ", err)
	}

	log.Println("Connected to database")
	return &Database{db: sqlDB}
}

func (d *Database) Close() {
	err := d.db.Close()
	if err != nil {
		log.Fatal("Error closing database connection: ", err)
	}
}