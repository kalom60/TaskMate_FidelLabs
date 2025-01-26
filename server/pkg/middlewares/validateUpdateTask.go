package middlewares

import (
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type UpdateTaskForm struct {
	Title       string `json:"title" validate:"omitempty"`
	Description string `json:"description" validate:"omitempty"`
	DueDate     string `json:"dueDate" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
	Priority    string `json:"priority" validate:"omitempty,oneof=Low Medium High"`
	Status      string `json:"status" validate:"omitempty,oneof='Not Started' 'In Progress' Completed"`
}

func ValidateUpdateTask(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var task UpdateTaskForm

		if err := c.Bind(&task); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid input")
		}

		validate := validator.New()
		if err := validate.Struct(task); err != nil {
			errors := err.(validator.ValidationErrors)
			return echo.NewHTTPError(http.StatusBadRequest, errors.Error())
		}

		if task.DueDate != "" {
			if _, err := time.Parse(time.RFC3339, task.DueDate); err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, "Invalid dueDate format. Use RFC3339 (e.g., 2006-01-02T15:04:05Z)")
			}
		}

		c.Set("task", task)

		return next(c)

	}
}
