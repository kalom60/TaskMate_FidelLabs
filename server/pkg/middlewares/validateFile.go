package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func ValidateFiles(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

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
