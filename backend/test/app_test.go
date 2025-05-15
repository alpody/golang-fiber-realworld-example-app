package test

import (
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"io"
	"net/http"
	"realworld-fiber-sqlc/internal/controller/http"
	"realworld-fiber-sqlc/internal/usecase/repo"
	sqlc2 "realworld-fiber-sqlc/internal/usecase/repo/sqlc"
	"realworld-fiber-sqlc/pkg/logger"
	"testing"
)

func mockUserIDFromToken(c *fiber.Ctx) int64 {
	return 1 // Mock user ID
}

func setupRoutes(app *fiber.App, dbQueries sqlc2.Querier, l logger.Interface) {
	routes.Setup(app, dbQueries, l)
}

func TestApp(t *testing.T) {
	tests := []struct {
		description   string
		route         string
		expectedError bool
		expectedCode  int
		expectedBody  string
		setupAuth     bool
	}{
		{
			description:   "non existing route",
			route:         "/non-existing-route",
			expectedError: false,
			expectedCode:  404,
			expectedBody:  "Cannot GET /non-existing-route",
		},
		{
			description:   "authentication required",
			route:         "/api/user",
			expectedError: false,
			expectedCode:  401,
			expectedBody:  "Unauthorized",
		},
	}

	app := fiber.New()
	dbQueries := &repo.MockQuerier{}
	l := &logger.MockLogger{}
	setupRoutes(app, dbQueries, l)

	for _, test := range tests {
		req, _ := http.NewRequest("GET", test.route, nil)

		if test.setupAuth {
			req.Header.Set("Authorization", "Bearer valid-token")
		}

		resp, err := app.Test(req)

		assert.Equalf(t, test.expectedError, err != nil, test.description)

		if test.expectedError {
			continue
		}

		assert.Equalf(t, test.expectedCode, resp.StatusCode, test.description)

		body, err := io.ReadAll(resp.Body)

		assert.Nilf(t, err, test.description)

		assert.Equalf(t, test.expectedBody, string(body), test.description)
	}
}
