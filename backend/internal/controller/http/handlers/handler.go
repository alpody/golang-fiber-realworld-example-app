package handlers

import (
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"realworld-fiber-sqlc/pkg/logger"
)

type HandlerBase struct {
	Queries sqlc.Querier
	Logger  logger.Interface
}

func NewHandlerQ(queries sqlc.Querier, l logger.Interface) *HandlerBase {
	return &HandlerBase{
		Queries: queries,
		Logger:  l,
	}
}
