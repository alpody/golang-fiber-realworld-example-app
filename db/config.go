package db

import (
	"os"
	"github.com/spf13/viper"
)

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Name     string `mapstructure:"name"`
	SSLMode  string `mapstructure:"sslmode"`
}

// Helper function to get environment variable with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func LoadConfig() (*DatabaseConfig, error) {
	config := &DatabaseConfig{
		Host:     getEnv("DB_HOST", "postgres"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "password"),
		Name:     getEnv("DB_NAME", "realworld"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}
	
	// Also try viper for backward compatibility
	viper.SetConfigName("config")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")

	viper.BindEnv("host", "DB_HOST")
	viper.BindEnv("port", "DB_PORT")
	viper.BindEnv("user", "DB_USER")
	viper.BindEnv("password", "DB_PASSWORD")
	viper.BindEnv("name", "DB_NAME")
	viper.BindEnv("sslmode", "DB_SSLMODE")

	viper.AutomaticEnv()

	// Try to read from file, but don't error if not found
	_ = viper.ReadInConfig()

	var viperConfig DatabaseConfig
	if err := viper.Unmarshal(&viperConfig); err == nil {
		// Only override if values are non-empty
		if viperConfig.Host != "" {
			config.Host = viperConfig.Host
		}
		if viperConfig.Port != "" {
			config.Port = viperConfig.Port
		}
		if viperConfig.User != "" {
			config.User = viperConfig.User
		}
		if viperConfig.Password != "" {
			config.Password = viperConfig.Password
		}
		if viperConfig.Name != "" {
			config.Name = viperConfig.Name
		}
		if viperConfig.SSLMode != "" {
			config.SSLMode = viperConfig.SSLMode
		}
	}

	return config, nil
}
