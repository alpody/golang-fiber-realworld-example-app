package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"realworld-fiber-sqlc/internal/entity"
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"realworld-fiber-sqlc/pkg/hash"
)

func (h *HandlerBase) CurrentUser(c *fiber.Ctx) error {
	h.Logger.Info("currentUser handler")

	id := userIDFromToken(c)
	if id == 0 {
		return c.SendStatus(401)
	}

	user, err := h.Queries.GetUser(c.Context(), id)
	if err != nil {
		h.Logger.Error("error getting user: %v", err)
		return c.SendStatus(500)
	}

	token := c.Locals("user").(*jwt.Token).Raw

	return c.Status(200).JSON(fiber.Map{"user": entity.User{
		Email:    user.Email,
		Username: user.Username,
		Bio:      user.Bio.String,
		Image:    user.Image.String,
		Token:    token,
	}})
}

func (h *HandlerBase) UpdateProfile(c *fiber.Ctx) error {
	h.Logger.Info("updateProfile handler")
	id := userIDFromToken(c)
	if id == 0 {
		h.Logger.Info("user not authenticated")
		return c.SendStatus(401)
	}

	var params entity.UserUPDReq
	if err := c.BodyParser(&params); err != nil {
		h.Logger.Error("error parsing body: %v", err)
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{
			"body": []string{"Invalid body"},
		}})
	}

	hashed, err := hash.HashPassword(params.User.Password)
	if err != nil {
		h.Logger.Error("error hashing password: %v", err)
		return c.SendStatus(500)
	}

	user, err := h.Queries.UpdateUser(c.Context(), &sqlc.UpdateUserParams{
		ID:       id,
		Email:    params.User.Email,
		Username: params.User.Username,
		Password: hashed,
		Bio:      params.User.Bio,
		Image:    params.User.Image,
	})
	if err != nil {
		h.Logger.Error("error updating user: %v", err)
		return c.SendStatus(500)
	}

	token := c.Locals("user").(*jwt.Token).Raw

	return c.Status(200).JSON(
		fiber.Map{
			"user": entity.User{
				Email:    user.Email,
				Username: user.Username,
				Bio:      user.Bio.String,
				Image:    user.Image.String,
				Token:    token,
			},
		})
}
