package middlewares

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func CheckCookie(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie("UserID")
		if err != nil || cookie == nil {
			newUserID := uuid.New().String()

			newCookie := &http.Cookie{
				Name:     "UserID",
				Value:    newUserID,
				Path:     "/",
				HttpOnly: true,
			}
			c.SetCookie(newCookie)
		}
		return next(c)
	}
}
