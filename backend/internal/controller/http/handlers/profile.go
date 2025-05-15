package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"realworld-fiber-sqlc/internal/entity"
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
)

func (h *HandlerBase) GetProfile(c *fiber.Ctx) error {
	h.Logger.Info("getProfile handler")
	username := c.Params("username")
	if username == "" {
		h.Logger.Error("username is required")
		return c.Status(422).JSON(fiber.Map{
			"errors": fiber.Map{
				"body": []string{"username is required"},
			},
		})
	}

	userID := userIDFromToken(c)

	profile, err := h.Queries.GetUserProfile(c.Context(), &sqlc.GetUserProfileParams{
		Username: username,
		FollowerID: pgtype.Int8{
			Int64: userID,
			Valid: userID != 0,
		},
	})
	if err != nil {
		h.Logger.Error("error getting profile: %v", err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"profile": profile})

}

func (h *HandlerBase) Follow(c *fiber.Ctx) error {
	h.Logger.Info("follow handler")
	userID := userIDFromToken(c)
	if userID == 0 {
		h.Logger.Info("user not authenticated")
		return c.SendStatus(401)
	}

	username := c.Params("username")
	if username == "" {
		h.Logger.Info("username params is not provided")
		return c.Status(422).JSON(fiber.Map{
			"errors": fiber.Map{
				"body": []string{"username is required"},
			},
		})
	}

	profile, err := h.Queries.FollowUser(c.Context(), &sqlc.FollowUserParams{
		Username:   username,
		FollowerID: userID,
	})
	if err != nil {
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{
		"profile": entity.Profile{
			Username:  profile.Username,
			Bio:       profile.Bio.String,
			Image:     profile.Image.String,
			Following: profile.Following,
		},
	})
}

func (h *HandlerBase) Unfollow(c *fiber.Ctx) error {
	h.Logger.Info("unfollow handler")
	userID := userIDFromToken(c)
	if userID == 0 {
		h.Logger.Info("user not authenticated")
		return c.SendStatus(401)
	}

	username := c.Params("username")
	if username == "" {
		h.Logger.Info("username is not provided")
		return c.Status(422).JSON(fiber.Map{
			"errors": fiber.Map{
				"body": []string{"username is required"},
			},
		})
	}

	profile, err := h.Queries.UnfollowUser(c.Context(), &sqlc.UnfollowUserParams{
		Username:   username,
		FollowerID: userID,
	})
	if err != nil {
		h.Logger.Error("error unfollowing user: %v", err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{
		"profile": entity.Profile{
			Username:  profile.Username,
			Bio:       profile.Bio.String,
			Image:     profile.Image.String,
			Following: profile.Following,
		},
	})
}
