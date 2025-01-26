package handler

import (
	"net/http"
	"time"

	"github.com/google/uuid"
	models "github.com/kalom60/TaskMate_FidelLabs/server/internal/model"
	"github.com/kalom60/TaskMate_FidelLabs/server/internal/repository"
	"github.com/kalom60/TaskMate_FidelLabs/server/pkg/cloudinary"
	"github.com/kalom60/TaskMate_FidelLabs/server/pkg/middlewares"
	"github.com/kalom60/TaskMate_FidelLabs/server/pkg/utils"
	"github.com/labstack/echo/v4"
)

type Handler interface {
	NewTask(c echo.Context) error
	GetTasks(c echo.Context) error
	GetTaskByID(c echo.Context) error
	AddSubTask(c echo.Context) error
	AddFiles(c echo.Context) error
	UpdateTask(c echo.Context) error
	UpdateSubtask(c echo.Context) error
	DeleteSubtask(c echo.Context) error
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
	owner, err := c.Cookie("UserID")
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	dueDate, err := utils.ParseDueDate(c.FormValue("dueDate"))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	task := models.Task{
		ID:          uuid.New().String(),
		Title:       c.FormValue("title"),
		Description: c.FormValue("description"),
		DueDate:     dueDate,
		Priority:    c.FormValue("priority"),
		Status:      c.FormValue("status"),
		Owner:       owner.Value,
	}

	multipartForm, err := c.MultipartForm()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}

	files := multipartForm.File["files"]
	if len(files) > 0 {
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
	}

	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	err = h.repository.SaveNewTask(c.Request().Context(), task)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusCreated, task)
}

func (h *handler) GetTasks(c echo.Context) error {
	tasks, err := h.repository.GetTasks(c.Request().Context())
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, tasks)
}

func (h *handler) GetTaskByID(c echo.Context) error {
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

	return c.JSON(http.StatusOK, task)
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
	if v, ok := c.Get("subTask").(models.Subtask); ok {
		subTask.Title = v.Title
	} else {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
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

func (h *handler) AddFiles(c echo.Context) error {
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

	multipartForm, err := c.MultipartForm()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}

	files := multipartForm.File["files"]
	uploadedFiles, _ := h.cloudinary.UploadNewTaskFiles(c.Request().Context(), files, task.ID)

	for _, uploaded := range uploadedFiles {
		file := models.File{
			ID:        uuid.New().String(),
			FileName:  uploaded.DisplayName,
			FileURL:   uploaded.URL,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		task.Files = append(task.Files, file)
	}

	err = h.repository.UpdateTask(c.Request().Context(), task)
	if err != nil {
		if err == repository.ErrTaskNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Files added Successfully",
	})
}

func (h *handler) UpdateTask(c echo.Context) error {
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

	if updates, ok := c.Get("task").(middlewares.UpdateTaskForm); ok {
		if updates.Title != "" {
			task.Title = updates.Title
		}
		if updates.Description != "" {
			task.Description = updates.Description
		}
		if updates.DueDate != "" {
			dueDate, err := utils.ParseDueDate(updates.DueDate)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
			}
			task.DueDate = dueDate
		}
		if updates.Priority != "" {
			task.Priority = updates.Priority
		}
		if updates.Status != "" {
			task.Status = updates.Status
		}
	} else {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	task.UpdatedAt = time.Now()
	err = h.repository.UpdateTask(c.Request().Context(), task)
	if err != nil {
		if err == repository.ErrTaskNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Task updated successfully",
	})
}

func (h *handler) UpdateSubtask(c echo.Context) error {
	taskID := c.Param("id")
	subtaskID := c.Param("subtaskId")

	var subTask models.Subtask
	if v, ok := c.Get("subTask").(models.Subtask); ok {
		subTask.Title = v.Title
	} else {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
	}

	err := h.repository.UpdateSubtask(c.Request().Context(), taskID, subtaskID, subTask.Title)
	if err != nil {
		if err.Error() == "task not found" {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		} else if err.Error() == "subtask not found" {
			return echo.NewHTTPError(http.StatusNotFound, "Subtask not found")
		} else {
			return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
		}
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Subtask updated successfully",
	})
}

func (h *handler) DeleteSubtask(c echo.Context) error {
	taskID := c.Param("id")
	subtaskID := c.Param("subtaskId")

	err := h.repository.DeleteSubtask(c.Request().Context(), taskID, subtaskID)
	if err != nil {
		if err.Error() == "task not found" {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		} else if err.Error() == "subtask not found" {
			return echo.NewHTTPError(http.StatusNotFound, "Subtask not found")
		} else {
			return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
		}
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Subtask deleted successfully",
	})
}
