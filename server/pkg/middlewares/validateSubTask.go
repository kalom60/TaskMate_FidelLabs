package middlewares

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	models "github.com/kalom60/TaskMate_FidelLabs/server/internal/model"
	"github.com/labstack/echo/v4"
)

func ValidateSubTask(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var subTask models.Subtask

		if err := c.Bind(&subTask); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid input")
		}

		validate := validator.New()
		if err := validate.Struct(subTask); err != nil {
			errors := err.(validator.ValidationErrors)
			return echo.NewHTTPError(http.StatusBadRequest, errors.Error())
		}

		c.Set("subTask", subTask)

		return next(c)
	}
}
