package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/polinanime/sna25/model"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func New() *gorm.DB {
	//dsn := "host=/tmp user=realworld dbname=realworld"
	dsn := "./database/realworld.db"

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Millisecond * 10, // Slow SQL threshold
			LogLevel:                  logger.Info,           // Log level
			IgnoreRecordNotFoundError: false,                 // Ignore ErrRecordNotFound error for logger
			Colorful:                  true,                  // Disable color
		},
	)

	// Globally mode
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	/*
	 *db, err := gorm.Open(postgres.New(postgres.Config{
	 *  DSN: dsn,
	 *  //PreferSimpleProtocol: true, // disables implicit prepared statement usage
	 *}), &gorm.Config{})
	 */

	//db, err := gorm.Open("postgresql", "postgresql://realworld@/realworld?host=/tmp")
	//db, err := gorm.Open("sqlite3", "./database/realworld.db")
	if err != nil {
		fmt.Println("storage err: ", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		fmt.Println("storage err: ", err)
	}

	sqlDB.SetMaxIdleConns(3)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db
}

func NewPostgres(config *DatabaseConfig) *gorm.DB {
	// Force port to be 5432 for PostgreSQL
	config.Port = "5432" // Always use standard PostgreSQL port

	// Override with environment variables if available
	if envHost := os.Getenv("DB_HOST"); envHost != "" {
		config.Host = envHost
	}

	if envPort := os.Getenv("DB_PORT"); envPort != "" {
		config.Port = envPort
	}

	if envUser := os.Getenv("DB_USER"); envUser != "" {
		config.User = envUser
	}

	if envPassword := os.Getenv("DB_PASSWORD"); envPassword != "" {
		config.Password = envPassword
	}
	
	if envName := os.Getenv("DB_NAME"); envName != "" {
		config.Name = envName
	}
	
	if envSSLMode := os.Getenv("DB_SSLMODE"); envSSLMode != "" {
		config.SSLMode = envSSLMode
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Password, config.Name, config.SSLMode)

	// Debug connection info
	log.Printf("[DEBUG] Connecting to PostgreSQL with DSN: host=%s port=%s user=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Name, config.SSLMode)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Millisecond * 10, // Slow SQL threshold
			LogLevel:                  logger.Info,           // Log level
			IgnoreRecordNotFoundError: false,                 // Ignore ErrRecordNotFound error for logger
			Colorful:                  true,                  // Disable color
		},
	)

	// Try to connect multiple times with exponential backoff
	var db *gorm.DB
	var err error
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if err == nil {
			break
		}
		retryTime := time.Duration(1<<uint(i)) * time.Second
		log.Printf("[WARN] Failed to connect to PostgreSQL (attempt %d/%d): %v. Retrying in %v...", 
			i+1, maxRetries, err, retryTime)
		time.Sleep(retryTime)
	}
	
	if err != nil {
		log.Printf("[ERROR] Failed to connect to PostgreSQL after %d attempts: %v", maxRetries, err)
		fmt.Println("storage err: ", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Printf("[ERROR] Failed to get database connection: %v", err)
		fmt.Println("storage err: ", err)
	}

	sqlDB.SetMaxIdleConns(3)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db
}

func TestDB() *gorm.DB {
	dsn := "./../database/realworld_test.db"
	//newLogger := logger.New(
	//log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
	//logger.Config{
	//SlowThreshold:             time.Millisecond * 10, // Slow SQL threshold
	//LogLevel:                  logger.Info,           // Log level
	//IgnoreRecordNotFoundError: false,                 // Ignore ErrRecordNotFound error for logger
	//Colorful:                  true,                  // Disable color
	//},
	//)

	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
		//Logger: newLogger,
	})
	if err != nil {
		fmt.Println("storage err: ", err)
	}
	return db
}

func DropTestDB() error {
	if err := os.Remove("./../database/realworld_test.db"); err != nil {
		return err
	}
	return nil
}

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(
		&model.User{},
		&model.Follow{},
		&model.Article{},
		&model.Comment{},
		&model.Tag{},
	)
}
