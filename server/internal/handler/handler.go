package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	models "github.com/kalom60/TaskMate_FidelLabs/server/internal/model"
	"github.com/kalom60/TaskMate_FidelLabs/server/internal/repository"
	"github.com/kalom60/TaskMate_FidelLabs/server/pkg/cloudinary"
	"github.com/labstack/echo/v4"
)

type Handler interface {
	NewTask(c echo.Context) error
}

type handler struct {
	repository repository.Repository
	cloudinary cloudinary.Cloudinary
}

func NewHandler(repository repository.Repository, cloudinary cloudinary.Cloudinary) Handler {
	return &handler{
		repository: repository,
		cloudinary: cloudinary,
	}
}

func (h *handler) NewTask(c echo.Context) error {
	owner, _ := c.Cookie("UserID")
	dateString := "1995-11-22T12:00:00Z"
	dueDate, err := time.Parse(c.FormValue("dueDate"), dateString)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	task := models.Task{
		ID:          uuid.New().String(),
		Title:       c.FormValue("title"),
		Description: c.FormValue("description"),
		DueDate:     dueDate,
		Status:      c.FormValue("status"),
		Owner:       owner.Value,
	}

	multipartForm, err := c.MultipartForm()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Failed to parse form data")
	}

	files := multipartForm.File["files"]
	uploadedFiles, _ := h.cloudinary.UploadNewTaskFiles(c.Request().Context(), files, task.ID)

	var taskFiles []models.File

	for _, uploaded := range uploadedFiles {
		file := models.File{
			ID:        uuid.New().String(),
			FileName:  uploaded.DisplayName,
			FileURL:   uploaded.URL,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		taskFiles = append(taskFiles, file)
	}

	task.Files = taskFiles

	err = h.repository.SaveNewTask(c.Request().Context(), task)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, task)
}
