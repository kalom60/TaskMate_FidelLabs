package server

import (
	"net/http"

	"github.com/kalom60/TaskMate_FidelLabs/server/pkg/middlewares"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(middlewares.CheckCookie)

	e.GET("/", s.HelloWorldHandler)

	e.GET("/health", s.HealthHandler)

	e.POST("/task", middlewares.ValidateTask(s.handler.NewTask))
	e.POST("/task/:id", middlewares.ValidateSubTask(s.handler.AddSubTask))

	return e
}

func (s *Server) HelloWorldHandler(c echo.Context) error {
	resp := map[string]string{
		"message": "Hello World!",
	}

	return c.JSON(http.StatusOK, resp)
}

func (s *Server) HealthHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, s.db.Health())
}
