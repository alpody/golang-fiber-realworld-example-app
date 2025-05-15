// Package model provides ...
package model

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username   string `gorm:"uniqueIndex;not nul"`
	Email      string `gorm:"uniqueIndex;not null"`
	Password   string `gorm:"not null"`
	Bio        *string
	Image      *string
	Followers  []Follow  `gorm:"foreignKey:FollowingID"`
	Followings []Follow  `gorm:"foreignKey:FollowerID"`
	Favorites  []Article `gorm:"many2many:favorites;"`
}

type Follow struct {
	Follower    User
	FollowerID  uint `gorm:"primaryKey" sql:"type:int not null"`
	Following   User
	FollowingID uint `gorm:"primaryKey" sql:"type:int not null"`
}

func (u *User) HashPassword(plain string) (string, error) {
	if len(plain) == 0 {
		return "", errors.New("password should not be empty")
	}
	h, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	return string(h), err
}

func (u *User) CheckPassword(plain string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plain))
	return err == nil
}

func (u *User) FollowedBy(id uint) bool {
	if u.Followers == nil {
		return false
	}
	for _, f := range u.Followers {
		if f.FollowerID == id {
			return true
		}
	}
	return false
}
