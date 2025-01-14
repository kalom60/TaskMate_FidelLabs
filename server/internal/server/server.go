package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"

	"github.com/kalom60/TaskMate_FidelLabs/server/internal/database"
	"github.com/kalom60/TaskMate_FidelLabs/server/internal/handler"
	"github.com/kalom60/TaskMate_FidelLabs/server/internal/repository"
	"github.com/kalom60/TaskMate_FidelLabs/server/pkg/cloudinary"
)

type Server struct {
	port    int
	db      database.Service
	handler handler.Handler
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	db := database.New()

	cloudinary, err := cloudinary.NewCloudinaryService()
	if err != nil {
		panic(err)
	}

	taskRepository := repository.NewRepository(db)
	taskHandler := handler.NewHandler(taskRepository, *cloudinary)

	NewServer := &Server{
		port:    port,
		db:      db,
		handler: taskHandler,
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", NewServer.port),
		Handler: NewServer.RegisterRoutes(),
	}

	return server
}
