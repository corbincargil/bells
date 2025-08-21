package database

import (
	"database/sql"
	"errors"
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
		log.Print("Error opening database:, ", err)
	}

	if err := sqlDB.Ping(); err != nil {
		log.Print("Error connecting to database:", err)
		sqlDB.Close()
		return &Database{db: nil}
	}

	return &Database{db: sqlDB}
}

func (d *Database) Ping() error {
	if d.db == nil {
		return errors.New("database not connected")
	}
	return d.db.Ping()
}

func (d *Database) Close() {
	err := d.db.Close()
	if err != nil {
		log.Fatal("Error closing database connection: ", err)
	}
}
