package handlers

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"realworld-fiber-sqlc/internal/entity"
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"strconv"
)

func (h *HandlerBase) CreateComment(c *fiber.Ctx) error {
	userID := userIDFromToken(c)
	fmt.Println(userID)
	if userID == 0 {
		return fiber.ErrUnauthorized
	}
	slug := c.Params("slug")

	var req entity.CreateCommentReq
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	comment, err := h.Queries.CreateComment(c.Context(), &sqlc.CreateCommentParams{
		Slug:   slug,
		Body:   req.Comment.Body,
		UserID: pgtype.Int8{Int64: userID, Valid: true},
	})
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{"comment": Comment{
		ID:        comment.ID,
		CreatedAt: comment.CreatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
		UpdatedAt: comment.UpdatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
		Body:      comment.Body,
		Author: entity.Profile{
			Username:  comment.Username,
			Bio:       comment.Bio.String,
			Image:     comment.Image.String,
			Following: comment.Following,
		},
	}})

}

func (h *HandlerBase) DeleteComment(c *fiber.Ctx) error {
	userID := userIDFromToken(c)
	if userID == 0 {
		return fiber.ErrUnauthorized
	}

	commentID := c.Params("id")

	i, err := strconv.ParseInt(commentID, 10, 32)
	if err != nil {
		panic(err)
	}
	commentID32 := int32(i)

	err = h.Queries.DeleteComment(c.Context(), &sqlc.DeleteCommentParams{
		ID:     commentID32,
		UserID: pgtype.Int8{Int64: userID, Valid: true},
	})
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}

type Comment struct {
	ID        int32          `json:"id"`
	CreatedAt string         `json:"createdAt"`
	UpdatedAt string         `json:"updatedAt"`
	Body      string         `json:"body"`
	Author    entity.Profile `json:"author"`
}

func (h *HandlerBase) GetComments(c *fiber.Ctx) error {
	slug := c.Params("slug")

	commentsData, err := h.Queries.GetCommentsByArticleSlug(c.Context(), slug)
	if err != nil {
		return err
	}

	var comments []Comment
	for _, comment := range commentsData {
		comments = append(comments, Comment{
			ID:        comment.ID,
			CreatedAt: comment.CreatedAt,
			UpdatedAt: comment.UpdatedAt,
			Body:      comment.Body,
			Author: entity.Profile{
				Username:  comment.Username,
				Bio:       comment.Bio.String,
				Image:     comment.Image.String,
				Following: comment.Following,
			},
		})
	}

	return c.JSON(fiber.Map{"comments": comments})
}
