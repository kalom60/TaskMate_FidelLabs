package handler

import (
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
	GetTasks(c echo.Context) error
	AddSubTask(c echo.Context) error
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
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, task)
}

func (h *handler) GetTasks(c echo.Context) error {
	tasks, err := h.repository.GetTasks(c.Request().Context())
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, tasks)
}

func (h *handler) AddSubTask(c echo.Context) error {
	id := c.Param("id")

	if _, err := uuid.Parse(id); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid task ID")
	}

	task, err := h.repository.GetTaskByID(c.Request().Context(), id)
	if err != nil {
		if err == repository.ErrTaskNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	var subTask models.Subtask

	if err := c.Bind(&subTask); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid input")
	}

	subTask.ID = uuid.New().String()
	subTask.CreatedAt = time.Now()
	subTask.UpdatedAt = time.Now()

	task.Subtasks = append(task.Subtasks, subTask)

	err = h.repository.UpdateTask(c.Request().Context(), task)
	if err != nil {
		if err == repository.ErrTaskNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "SubTask added Successfully",
	})
}
