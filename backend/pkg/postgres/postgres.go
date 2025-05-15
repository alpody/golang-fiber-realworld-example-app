package postgres

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"os"
	"realworld-fiber-sqlc/pkg/logger"
)

func NewPool(l *logger.Logger) (*pgxpool.Pool, error) {
	l.Info("Connecting to the database")

	connStr := os.Getenv("DATABASE_URL")
	//connStr := "postgres://postgres:postgres@localhost:5432/realworld?sslmode=disable"
	dbpool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		l.Warn("failed to connect to the database")
		return nil, err
	}

	l.Info("Connected to the database")

	if err := dbpool.Ping(context.Background()); err != nil {
		l.Warn("failed to ping the database")
		return nil, err
	}

	return dbpool, nil
}
