package middlewares

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type SubTaskForm struct {
	Title string `validate:"required"`
}

func ValidateSubTask(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		subTaskform := SubTaskForm{
			Title: c.FormValue("title"),
		}

		validate := validator.New()
		if err := validate.Struct(subTaskform); err != nil {
			errors := err.(validator.ValidationErrors)
			return echo.NewHTTPError(http.StatusBadRequest, errors.Error())
		}
		return next(c)
	}
}
