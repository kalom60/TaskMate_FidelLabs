package repository

import (
	"github.com/kalom60/TaskMate_FidelLabs/server/internal/database"
)

type Repository interface{}

type repository struct {
	client database.Service
}

func NewRepository(client database.Service) Repository {
	return &repository{
		client: client,
	}
}
