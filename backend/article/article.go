package article

import (
	"github.com/polinanime/sna25/model"
)

type Store interface {
	GetBySlug(string) (*model.Article, error)
	GetUserArticleBySlug(userID uint, slug string) (*model.Article, error)
	CreateArticle(*model.Article) error
	UpdateArticle(*model.Article, []string) error
	DeleteArticle(*model.Article) error
	List(offset, limit int) ([]model.Article, int64, error)
	ListByTag(tag string, offset, limit int) ([]model.Article, int64, error)
	ListByAuthor(username string, offset, limit int) ([]model.Article, int64, error)
	ListByWhoFavorited(username string, offset, limit int) ([]model.Article, int64, error)
	ListFeed(userID uint, offset, limit int) ([]model.Article, int64, error)
	AddComment(*model.Article, *model.Comment) error
	GetCommentsBySlug(string) ([]model.Comment, error)
	GetCommentByID(uint) (*model.Comment, error)
	DeleteComment(*model.Comment) error
	AddFavorite(*model.Article, uint) error
	RemoveFavorite(*model.Article, uint) error
	ListTags() ([]model.Tag, error)
}
