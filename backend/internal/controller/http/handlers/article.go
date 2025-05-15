package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"realworld-fiber-sqlc/internal/entity"
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"strings"
)

func formTagList(tagList interface{}) []string {
	tags := []string{}
	if tagList != nil {
		tagList, ok := tagList.([]interface{})
		if !ok {
			return tags
		}

		for _, tag := range tagList {
			if tag != nil {
				tagStr, ok := tag.(string)
				if !ok {
					return tags
				}
				tags = append(tags, tagStr)
			}
		}
	}
	return tags
}

func transformString(s string) string {
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, " ", "-")
	return s
}

func (h *HandlerBase) GetArticle(c *fiber.Ctx) error {
	h.Logger.Info("GetArticle handler")
	userID := userIDFromToken(c)
	ID := pgtype.Int8{}
	if userID != 0 {
		ID.Scan(userID)
	}

	slug := c.Params("slug")

	h.Logger.Info("querying article")
	article, err := h.Queries.GetArticle(c.Context(), &sqlc.GetArticleParams{
		Slug:   slug,
		UserID: ID,
	})
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"article": entity.Article{
		Slug:           article.Slug,
		Title:          article.Title,
		Description:    article.Description,
		Body:           article.Body,
		TagList:        formTagList(article.TagList),
		CreatedAt:      article.CreatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
		UpdatedAt:      article.UpdatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
		Favorited:      article.Favorited,
		FavoritesCount: article.FavoritesCount,
		Author: entity.Profile{
			Username:  article.Username,
			Bio:       article.Bio.String,
			Image:     article.Image.String,
			Following: article.Following,
		},
	}})
}

func (h *HandlerBase) CreateArticle(c *fiber.Ctx) error {
	h.Logger.Info("CreateArticle handler")
	var req entity.CreateArticleReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{"body": []string{"can't be blank"}}})
	}

	authorId := userIDFromToken(c)
	if authorId == 0 {
		h.Logger.Info("Unauthorized")
		return c.SendStatus(401)
	}
	ID := pgtype.Int8{}
	ID.Scan(authorId)

	slug := transformString(req.Article.Title)

	article, err := h.Queries.CreateArticle(c.Context(), &sqlc.CreateArticleParams{
		Title:       req.Article.Title,
		Slug:        slug,
		Description: req.Article.Description,
		Body:        req.Article.Body,
		AuthorID:    ID,
		Tags:        req.Article.TagList,
	})
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"article": entity.Article{
		Slug:           article.Slug,
		Title:          article.Title,
		Description:    article.Description,
		Body:           article.Body,
		TagList:        req.Article.TagList,
		CreatedAt:      article.CreatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
		UpdatedAt:      article.UpdatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
		Favorited:      false,
		FavoritesCount: article.FavoritesCount,
		Author: entity.Profile{
			Username:  article.Username,
			Bio:       article.Bio.String,
			Image:     article.Image.String,
			Following: false,
		},
	}})
}

func (h *HandlerBase) UpdateArticle(c *fiber.Ctx) error {
	h.Logger.Info("UpdateArticle handler")
	userId := userIDFromToken(c)
	if userId == 0 {
		h.Logger.Info("Unauthorized")
		return c.SendStatus(401)
	}
	ID := pgtype.Int8{}
	ID.Scan(userId)

	slug := c.Params("slug")
	if slug == "" {
		h.Logger.Info("Slug is empty")
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{"slug": []string{"can't be blank"}}})
	}

	var req entity.CreateArticleReq
	if err := c.BodyParser(&req); err != nil {
		h.Logger.Error(err)
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{"body": []string{"can't be blank"}}})
	}

	newSlug := transformString(req.Article.Title)

	article, err := h.Queries.UpdateArticle(c.Context(), &sqlc.UpdateArticleParams{
		Slug:        slug,
		Title:       req.Article.Title,
		Description: req.Article.Description,
		Body:        req.Article.Body,
		AuthorID:    ID,
		Slug_2:      newSlug,
	})
	if err != nil {
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"article": entity.Article{
		Slug:           article.Slug,
		Title:          article.Title,
		Description:    article.Description,
		Body:           article.Body,
		TagList:        formTagList(article.Taglist),
		CreatedAt:      article.CreatedAt,
		UpdatedAt:      article.UpdatedAt,
		Favorited:      article.Favorited,
		FavoritesCount: article.FavoritesCount,
		Author: entity.Profile{
			Username:  article.Username,
			Bio:       article.Bio.String,
			Image:     article.Image.String,
			Following: false,
		},
	}})

}

func (h *HandlerBase) DeleteArticle(c *fiber.Ctx) error {
	h.Logger.Info("DeleteArticle handler")
	userId := userIDFromToken(c)
	if userId == 0 {
		return c.SendStatus(401)
	}

	slug := c.Params("slug")
	if slug == "" {
		h.Logger.Info("Slug is empty")
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{"slug": []string{"can't be blank"}}})
	}

	err := h.Queries.DeleteArticle(c.Context(), &sqlc.DeleteArticleParams{
		Slug:     slug,
		AuthorID: pgtype.Int8{Int64: userId, Valid: true},
	})
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	return c.SendStatus(200)
}

func (h *HandlerBase) FavoriteArticle(c *fiber.Ctx) error {
	h.Logger.Info("FavoriteArticle handler")
	userId := userIDFromToken(c)
	if userId == 0 {
		h.Logger.Info("Unauthorized")
		return c.SendStatus(401)
	}

	slug := c.Params("slug")
	if slug == "" {
		h.Logger.Info("Slug is empty")
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{"slug": []string{"can't be blank"}}})
	}

	article, err := h.Queries.FavoriteArticle(c.Context(), &sqlc.FavoriteArticleParams{
		Slug:       slug,
		FollowerID: userId,
	})
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"article": entity.Article{
		Slug:           article.Slug,
		Title:          article.Title,
		Description:    article.Description,
		Body:           article.Body,
		TagList:        formTagList(article.Taglist),
		CreatedAt:      article.CreatedAt,
		UpdatedAt:      article.UpdatedAt,
		Favorited:      true,
		FavoritesCount: article.FavoritesCount,
		Author: entity.Profile{
			Username:  article.Username,
			Bio:       article.Bio.String,
			Image:     article.Image.String,
			Following: article.Following,
		},
	}})
}

func (h *HandlerBase) UnfavoriteArticle(c *fiber.Ctx) error {
	h.Logger.Info("UnfavoriteArticle handler")
	userId := userIDFromToken(c)
	if userId == 0 {
		h.Logger.Info("Unauthorized")
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized"})
	}

	slug := c.Params("slug")
	if slug == "" {
		h.Logger.Info("Slug is empty")
		return c.Status(422).JSON(fiber.Map{"errors": fiber.Map{"slug": []string{"can't be blank"}}})
	}

	article, err := h.Queries.UnfavoriteArticle(c.Context(), &sqlc.UnfavoriteArticleParams{
		Slug:       slug,
		FollowerID: userId,
	})
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"article": entity.Article{
		Slug:           article.Slug,
		Title:          article.Title,
		Description:    article.Description,
		Body:           article.Body,
		TagList:        formTagList(article.Taglist),
		CreatedAt:      article.CreatedAt,
		UpdatedAt:      article.UpdatedAt,
		Favorited:      false,
		FavoritesCount: article.FavoritesCount,
		Author: entity.Profile{
			Username:  article.Username,
			Bio:       article.Bio.String,
			Image:     article.Image.String,
			Following: article.Following,
		},
	}})
}

func (h *HandlerBase) GetTags(c *fiber.Ctx) error {
	h.Logger.Info("GetTags handler")
	tags, err := h.Queries.GetTags(c.Context())
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	return c.Status(200).JSON(fiber.Map{"tags": tags})
}

func (h *HandlerBase) GetArticles(c *fiber.Ctx) error {
	h.Logger.Info("GetArticles handler")
	userID := userIDFromToken(c)
	userIDPG := &pgtype.Int8{}
	if userID != 0 {
		h.Logger.Info("user is authorized")
		_ = userIDPG.Scan(userID)
	}

	tag := c.Query("tag")
	tagPG := &pgtype.Text{}
	if tag != "" {
		h.Logger.Info("tag is not empty", tag)
		_ = tagPG.Scan(tag)
	}

	author := c.Query("author")
	authorPG := &pgtype.Text{}
	if author != "" {
		h.Logger.Info("author is not empty", author)
		_ = authorPG.Scan(author)
	}

	favorited := c.Query("favorited")
	favoritedPG := &pgtype.Text{}
	if favorited != "" {
		h.Logger.Info("favorited is not empty", favorited)
		_ = favoritedPG.Scan(favorited)
	}

	limit := c.Query("limit", "20")
	limitPG := &pgtype.Int4{}
	_ = limitPG.Scan(limit)

	offset := c.Query("offset", "0")
	offsetPG := &pgtype.Int4{}
	_ = offsetPG.Scan(offset)

	var params sqlc.ListArticlesParams
	params = sqlc.ListArticlesParams{
		Tag:         *tagPG,
		Author:      *authorPG,
		FavoritedBy: *favoritedPG,
		Limitt:      limitPG.Int32,
		Offsett:     offsetPG.Int32,
		UserID:      *userIDPG,
	}

	articlesData, err := h.Queries.ListArticles(c.Context(), &params)
	if err != nil {
		h.Logger.Error("error getting articles: %v", err)
		return c.SendStatus(500)
	}

	articles := make([]entity.Article, 0)
	cnt := 0
	for _, article := range articlesData {
		cnt += 1
		articles = append(articles, entity.Article{
			Slug:           article.Slug,
			Title:          article.Title,
			Description:    article.Description,
			Body:           article.Body,
			TagList:        formTagList(article.TagList),
			CreatedAt:      article.CreatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
			UpdatedAt:      article.UpdatedAt.Time.Format("2006-01-02T15:04:05.000Z"),
			FavoritesCount: int32(article.FavoritesCount),
			Author: entity.Profile{
				Username:  article.AuthorUsername,
				Bio:       article.AuthorBio.String,
				Image:     article.AuthorImage.String,
				Following: article.Following.(bool),
			},
		})
	}

	return c.Status(200).JSON(fiber.Map{"articles": articles, "articlesCount": cnt})

}

func (h *HandlerBase) Feed(c *fiber.Ctx) error {
	h.Logger.Info("Feed handler")
	userID := userIDFromToken(c)
	if userID == 0 {
		h.Logger.Info("unauthorized")
		return c.SendStatus(401)
	}

	userIDPG := &pgtype.Int4{}
	_ = userIDPG.Scan(userID)

	limit := c.Query("limit", "20")
	limitPG := &pgtype.Int4{}
	_ = limitPG.Scan(limit)

	offset := c.Query("offset", "0")
	offsetPG := &pgtype.Int4{}
	_ = offsetPG.Scan(offset)

	articlesData, err := h.Queries.FeedArticles(c.Context(), &sqlc.FeedArticlesParams{
		Limitt:  limitPG.Int32,
		Offsett: offsetPG.Int32,
		UserID:  *userIDPG,
	})
	if err != nil {
		h.Logger.Error(err)
		return c.SendStatus(500)
	}

	articles := make([]entity.Article, 0)
	cnt := 0
	for _, article := range articlesData {
		cnt += 1
		articles = append(articles, entity.Article{
			Slug:           article.Slug,
			Title:          article.Title,
			Description:    article.Description,
			Body:           article.Body,
			TagList:        formTagList(article.TagList),
			CreatedAt:      article.CreatedAt,
			UpdatedAt:      article.UpdatedAt,
			Favorited:      article.Favorited.(bool),
			FavoritesCount: article.FavoritesCount,
			Author: entity.Profile{
				Username:  article.Username.String,
				Bio:       article.Bio.String,
				Image:     article.Image.String,
				Following: article.Following.(bool),
			},
		})
	}

	return c.Status(200).JSON(fiber.Map{"articles": articles, "articlesCount": cnt})

}
