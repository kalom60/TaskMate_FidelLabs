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
				SameSite: http.SameSiteNoneMode,
				Secure:   true,
			}

			c.SetCookie(newCookie)
			c.Logger().Info("✅ New UserID cookie set:", newUserID)
		} else {
			c.Logger().Info("✅ Existing UserID cookie:", cookie.Value)
		}
		return next(c)
	}
}
