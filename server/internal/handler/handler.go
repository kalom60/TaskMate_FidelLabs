package handler

import "github.com/kalom60/TaskMate_FidelLabs/server/internal/repository"

type Handler interface{}

type handler struct {
	repository repository.Repository
}

func NewHandler(repository repository.Repository) Handler {
	return &handler{
		repository: repository,
	}
}
