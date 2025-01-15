package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/kalom60/TaskMate_FidelLabs/server/internal/database"
	models "github.com/kalom60/TaskMate_FidelLabs/server/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrTaskNotFound = errors.New("task not found")

type Repository interface {
	SaveNewTask(ctx context.Context, task models.Task) error
	GetTaskByID(ctx context.Context, id string) (*models.Task, error)
	UpdateTask(ctx context.Context, task *models.Task) error
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

func (r *repository) GetTaskByID(ctx context.Context, id string) (*models.Task, error) {
	coll := r.client.GetCollection("taskmate", "task")

	var task models.Task
	err := coll.FindOne(ctx, bson.M{"id": id}).Decode(&task)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, ErrTaskNotFound
		}
		return nil, err
	}

	return &task, nil
}

func (r *repository) UpdateTask(ctx context.Context, task *models.Task) error {
	coll := r.client.GetCollection("taskmate", "task")

	filter := bson.M{"id": task.ID}
	updatedTask := bson.M{"$set": task}

	result, err := coll.UpdateOne(ctx, filter, updatedTask, options.Update().SetUpsert(false))
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return ErrTaskNotFound
	}
	return nil
}
