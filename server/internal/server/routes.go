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
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodDelete},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		ExposeHeaders:    []string{"Authorization"},
		AllowCredentials: true,
	}))

	e.GET("/", s.HelloWorldHandler)

	e.GET("/health", s.HealthHandler)

	e.POST("/task", middlewares.ValidateTask(s.handler.NewTask))
	e.POST("/task/:id/subtask", middlewares.ValidateSubTask(s.handler.AddSubTask))
	e.POST("/task/:id/file", middlewares.ValidateFiles(s.handler.AddFiles))
	e.GET("/task", s.handler.GetTasks)
	e.GET("/task/:id", s.handler.GetTaskByID)
	e.PATCH("/task/:id", middlewares.ValidateUpdateTask(s.handler.UpdateTask))
	e.PATCH("/task/:id/subtask/:subtaskId", middlewares.ValidateSubTask(s.handler.UpdateSubtask))
	e.DELETE("/task/:id", s.handler.DeleteTask)
	e.DELETE("/task/:id/subtask/:subtaskId", s.handler.DeleteSubtask)

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
