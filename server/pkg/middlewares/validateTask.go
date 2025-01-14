package middlewares

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

const MaxFileSize = 10 * 1024 * 1024 // 10MB
var ValidExtensions = []string{"jpg", "png", "pdf"}

type TaskForm struct {
	Title       string `validate:"required"`
	Description string `validate:"required"`
	DueDate     string `validate:"required,datetime=2006-01-02T15:04:05Z"`
	Status      string `validate:"required,oneof='Not Started' 'In Progress' 'Completed'"`
}

func ValidateTask(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		form := TaskForm{
			Title:       c.FormValue("title"),
			Description: c.FormValue("description"),
			DueDate:     c.FormValue("dueDate"),
			Status:      c.FormValue("status"),
		}

		validate := validator.New()
		if err := validate.Struct(form); err != nil {
			errors := err.(validator.ValidationErrors)
			return echo.NewHTTPError(http.StatusBadRequest, errors.Error())
		}

		if _, err := time.Parse(time.RFC3339, form.DueDate); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid dueDate format. Use RFC3339 (e.g., 2006-01-02T15:04:05Z)")
		}

		multipartForm, err := c.MultipartForm()
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Failed to parse form data")
		}

		files := multipartForm.File["files"]
		if len(files) > 0 {
			for _, file := range files {
				if file.Size > MaxFileSize {
					return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("File %s exceeds the size limit of 10MB", file.Filename))
				}

				ext := file.Filename[strings.LastIndex(file.Filename, ".")+1:]
				if !contains(ext) {
					return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Invalid file type: %s", ext))
				}
			}
		}

		return next(c)

	}
}

func contains(ext string) bool {
	for _, v := range ValidExtensions {
		if strings.EqualFold(v, ext) {
			return true
		}
	}
	return false
}
