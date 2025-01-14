package repository

import (
	"context"
	"fmt"

	"github.com/kalom60/TaskMate_FidelLabs/server/internal/database"
	models "github.com/kalom60/TaskMate_FidelLabs/server/internal/model"
)

type Repository interface {
	SaveNewTask(ctx context.Context, task models.Task) error
}

type repository struct {
	client database.Service
}

func NewRepository(client database.Service) Repository {
	return &repository{
		client: client,
	}
}

func (r *repository) SaveNewTask(ctx context.Context, task models.Task) error {
	coll := r.client.GetCollection("taskmate", "task")

	_, err := coll.InsertOne(ctx, task)
	if err != nil {
		return fmt.Errorf("error while saving new task: %w", err)
	}
	return nil
}
