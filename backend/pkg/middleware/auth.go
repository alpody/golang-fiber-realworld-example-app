package middleware

import (
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	jwt2 "realworld-fiber-sqlc/pkg/jwt"
)

// Protected protect routes
func Protected() fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{
			JWTAlg: jwt.SigningMethodHS256.Name,
			Key:    jwt2.JwtKey},
		ErrorHandler: jwtError,
		TokenLookup:  "header:Authorization",
		AuthScheme:   "Token",
	})
}

func jwtError(c *fiber.Ctx, err error) error {
	return c.SendStatus(fiber.StatusUnauthorized)
}
