package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"realworld-fiber-sqlc/internal/controller/http"
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"realworld-fiber-sqlc/pkg/logger"
	"realworld-fiber-sqlc/pkg/postgres"
)

func New() {
	l := logger.New("debug")

	var err error
	pool, err := postgres.NewPool(l)
	if err != nil {
		l.Fatal(err)
	}
	defer pool.Close()
	dbQueries := sqlc.New(pool)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, HEAD, PUT, PATCH, POST, DELETE",
	}))

	routes.Setup(app, dbQueries, l)

	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404)
	})

	app.Listen(":3000")
}
