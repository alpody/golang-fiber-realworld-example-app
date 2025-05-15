package jwt2

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var JwtKey = []byte("your_secret_key")

func GenerateToken(userID int64) (string, error) {
	claims := &jwt.RegisteredClaims{
		Subject:   fmt.Sprintf("%d", userID),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
