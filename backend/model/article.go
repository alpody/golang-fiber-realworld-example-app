// Package model provides ...
package model

import (
	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	Slug        string `gorm:"uniqueIndex;not null"`
	Title       string `gorm:"not null"`
	Description string
	Body        string
	Author      User
	AuthorID    uint
	Comments    []Comment
	Favorites   []User `gorm:"many2many:favorites;"`
	Tags        []Tag  `gorm:"many2many:article_tags;"`
}

type Comment struct {
	gorm.Model
	Article   Article
	ArticleID uint
	User      User
	UserID    uint
	Body      string
}

type Tag struct {
	gorm.Model
	Tag      string    `gorm:"uniqueIndex"`
	Articles []Article `gorm:"many2many:article_tags;"`
}
