// You must first install   https://github.com/arsmn/fiber-swagger
//
//go:generate swag init
package main

import (
	"fmt"
	"log"

	"github.com/polinanime/sna25/db"
	_ "github.com/polinanime/sna25/docs"
	"github.com/polinanime/sna25/handler"
	"github.com/polinanime/sna25/router"
	"github.com/polinanime/sna25/store"
	"github.com/gofiber/swagger"
)

// @description Conduit API
// @title Conduit API

// @BasePath /api

// @schemes http https
// @produce application/json
// @consumes application/json

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

func main() {
	r := router.New()
	r.Get("/swagger/*", swagger.HandlerDefault)

	config, err := db.LoadConfig()
	if err != nil {
		log.Fatalf("Error when loading database config: %e", err)
	}
	d := db.NewPostgres(config)
	db.AutoMigrate(d)

	us := store.NewUserStore(d)
	as := store.NewArticleStore(d)

	h := handler.NewHandler(us, as)
	h.Register(r)
	err = r.Listen(":8585")
	if err != nil {
		fmt.Printf("%v", err)
	}
}
