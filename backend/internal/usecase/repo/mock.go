package repo

import (
	"context"
	"github.com/jackc/pgx/v5/pgtype"
	"realworld-fiber-sqlc/internal/usecase/repo/sqlc"
)

type MockQuerier struct{}

func (m *MockQuerier) CreateArticle(ctx context.Context, arg *sqlc.CreateArticleParams) (sqlc.CreateArticleRow, error) {
	return sqlc.CreateArticleRow{}, nil
}

func (m *MockQuerier) CreateComment(ctx context.Context, arg *sqlc.CreateCommentParams) (sqlc.CreateCommentRow, error) {
	return sqlc.CreateCommentRow{}, nil
}

func (m *MockQuerier) CreateUser(ctx context.Context, arg *sqlc.CreateUserParams) (sqlc.User, error) {
	return sqlc.User{}, nil
}

func (m *MockQuerier) DeleteArticle(ctx context.Context, arg *sqlc.DeleteArticleParams) error {
	return nil
}

func (m *MockQuerier) DeleteComment(ctx context.Context, arg *sqlc.DeleteCommentParams) error {
	return nil
}

func (m *MockQuerier) FavoriteArticle(ctx context.Context, arg *sqlc.FavoriteArticleParams) (sqlc.FavoriteArticleRow, error) {
	return sqlc.FavoriteArticleRow{}, nil
}

func (m *MockQuerier) FeedArticles(ctx context.Context, arg *sqlc.FeedArticlesParams) ([]sqlc.FeedArticlesRow, error) {
	return nil, nil
}

func (m *MockQuerier) FollowUser(ctx context.Context, arg *sqlc.FollowUserParams) (sqlc.FollowUserRow, error) {
	return sqlc.FollowUserRow{}, nil
}

func (m *MockQuerier) GetArticle(ctx context.Context, arg *sqlc.GetArticleParams) (sqlc.GetArticleRow, error) {
	return sqlc.GetArticleRow{}, nil
}

func (m *MockQuerier) GetCommentsByArticleSlug(ctx context.Context, slug string) ([]sqlc.GetCommentsByArticleSlugRow, error) {
	return nil, nil
}

func (m *MockQuerier) GetSingleComment(ctx context.Context) (sqlc.GetSingleCommentRow, error) {
	return sqlc.GetSingleCommentRow{}, nil
}

func (m *MockQuerier) GetTags(ctx context.Context) ([]string, error) {
	return nil, nil
}

func (m *MockQuerier) GetUser(ctx context.Context, id int64) (sqlc.GetUserRow, error) {
	return sqlc.GetUserRow{
		Email:    "test@example.com",
		Username: "testuser",
		Bio:      pgtype.Text{String: "test bio", Valid: true},
		Image:    pgtype.Text{String: "test image", Valid: true},
	}, nil
}

func (m *MockQuerier) GetUserByEmail(ctx context.Context, email string) (sqlc.User, error) {
	return sqlc.User{}, nil
}

func (m *MockQuerier) GetUserProfile(ctx context.Context, arg *sqlc.GetUserProfileParams) (sqlc.GetUserProfileRow, error) {
	return sqlc.GetUserProfileRow{}, nil
}

func (m *MockQuerier) GetUserProfileById(ctx context.Context, arg *sqlc.GetUserProfileByIdParams) (sqlc.GetUserProfileByIdRow, error) {
	return sqlc.GetUserProfileByIdRow{}, nil
}

func (m *MockQuerier) ListArticles(ctx context.Context, arg *sqlc.ListArticlesParams) ([]sqlc.ListArticlesRow, error) {
	return nil, nil
}

func (m *MockQuerier) UnfavoriteArticle(ctx context.Context, arg *sqlc.UnfavoriteArticleParams) (sqlc.UnfavoriteArticleRow, error) {
	return sqlc.UnfavoriteArticleRow{}, nil
}

func (m *MockQuerier) UnfollowUser(ctx context.Context, arg *sqlc.UnfollowUserParams) (sqlc.UnfollowUserRow, error) {
	return sqlc.UnfollowUserRow{}, nil
}

func (m *MockQuerier) UpdateArticle(ctx context.Context, arg *sqlc.UpdateArticleParams) (sqlc.UpdateArticleRow, error) {
	return sqlc.UpdateArticleRow{}, nil
}

func (m *MockQuerier) UpdateUser(ctx context.Context, arg *sqlc.UpdateUserParams) (sqlc.UpdateUserRow, error) {
	return sqlc.UpdateUserRow{}, nil
}
