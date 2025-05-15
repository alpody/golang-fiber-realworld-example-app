package handlers

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"net/mail"
	"realworld-fiber-sqlc/internal/entity"
	sqlc2 "realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"realworld-fiber-sqlc/pkg/hash"
	jwt2 "realworld-fiber-sqlc/pkg/jwt"
	"strconv"
)

func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func userIDFromToken(c *fiber.Ctx) int64 {
	token, ok := c.Locals("user").(*jwt.Token)
	if !ok {
		return 0
	}
	claims := token.Claims.(jwt.MapClaims)
	subj, err := claims.GetSubject()
	if err != nil {
		return 0
	}

	id, _ := strconv.ParseInt(subj, 10, 64)
	return id
}

func (h *HandlerBase) Login(c *fiber.Ctx) error {
	h.Logger.Info("Login handler")
	var params entity.LoginParams
	if err := c.BodyParser(&params); err != nil {
		h.Logger.Error("error parsing body: %v", err)
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{
			"body": []string{"Invalid body"},
		}})
	}

	hashPass, err := hash.HashPassword(params.User.Password)
	if err != nil {
		h.Logger.Error("error hashing password: %v", err)
		return c.SendStatus(500)
	}

	user, err := h.Queries.GetUserByEmail(c.Context(), params.User.Email)
	if err != nil {
		h.Logger.Error("error getting user by email: %v", err)
		return c.SendStatus(500)
	}

	if !hash.CheckPasswordHash(params.User.Password, hashPass) {
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{
			"body": []string{"Invalid email or password"},
		}})
	}

	token, err := jwt2.GenerateToken(user.ID)
	if err != nil {
		h.Logger.Error("error generating token: %v", err)
		return c.SendStatus(500)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": entity.User{
		Email:    user.Email,
		Username: user.Username,
		Bio:      user.Bio.String,
		Image:    user.Image.String,
		Token:    token,
	}})
}

func (h *HandlerBase) Register(c *fiber.Ctx) error {
	h.Logger.Info("Register handler")
	var params entity.RegisterParamsT
	if err := c.BodyParser(&params); err != nil {
		h.Logger.Error("error parsing body: %v", err)
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{
			"body": []string{"Invalid body"},
		}})
	}

	if !validEmail(params.User.Email) {
		h.Logger.Error("invalid email", params.User.Email)
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{
			"body": []string{"Invalid email"},
		}})

	}

	hashPass, err := hash.HashPassword(params.User.Password)
	if err != nil {
		h.Logger.Error("error hashing password: %v", err)
		return c.SendStatus(500)
	}

	user, err := h.Queries.CreateUser(context.Background(), &sqlc2.CreateUserParams{
		Email:    params.User.Email,
		Username: params.User.Username,
		Password: hashPass,
	})
	if err != nil {
		h.Logger.Error("error creating user: %v", err)
		return c.SendStatus(500)
	}

	token, err := jwt2.GenerateToken(user.ID)
	if err != nil {
		h.Logger.Error("error generating token: %v", err)
		return c.SendStatus(500)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": entity.User{
		Email:    user.Email,
		Username: user.Username,
		Bio:      user.Bio.String,
		Image:    user.Image.String,
		Token:    token,
	}})
}
