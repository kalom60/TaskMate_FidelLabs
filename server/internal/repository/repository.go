package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/kalom60/TaskMate_FidelLabs/server/internal/database"
	models "github.com/kalom60/TaskMate_FidelLabs/server/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrTaskNotFound = errors.New("task not found")

type Repository interface {
	SaveNewTask(ctx context.Context, task models.Task) error
	GetTasks(ctx context.Context) (*[]models.Task, error)
	GetTaskByID(ctx context.Context, id string) (*models.Task, error)
	UpdateTask(ctx context.Context, task *models.Task) error
	UpdateSubtask(ctx context.Context, taskID, subtaskID, title string) error
	DeleteTask(ctx context.Context, id string) error
	DeleteSubtask(ctx context.Context, taskID, subtaskID string) error
	DeleteTaskFile(ctx context.Context, taskID, fileID string) error
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

func (r *repository) GetTasks(ctx context.Context) (*[]models.Task, error) {
	coll := r.client.GetCollection("taskmate", "task")

	var tasks []models.Task
	cursor, err := coll.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var task models.Task
		if err := cursor.Decode(&task); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return &tasks, nil
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

func (r *repository) UpdateSubtask(ctx context.Context, taskID, subtaskID, title string) error {
	coll := r.client.GetCollection("taskmate", "task")

	var task models.Task
	filter := bson.M{"id": taskID}
	err := coll.FindOne(context.TODO(), filter).Decode(&task)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return errors.New("task not found")
		}
		return err
	}

	subtaskExists := false
	for _, subtask := range task.Subtasks {
		if subtask.ID == subtaskID {
			subtaskExists = true
			break
		}
	}
	if !subtaskExists {
		return errors.New("subtask not found")
	}

	update := bson.M{
		"$set": bson.M{
			"subtasks.$[elem].title":    title,
			"subtasks.$[elem].updateAt": time.Now(),
		},
	}

	arrayFilter := options.ArrayFilters{
		Filters: []interface{}{bson.M{"elem.id": subtaskID}},
	}

	opts := options.Update().SetArrayFilters(arrayFilter)
	result, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return errors.New("subtask not found")
	}

	return nil
}

func (r *repository) DeleteTask(ctx context.Context, id string) error {
	coll := r.client.GetCollection("taskmate", "task")

	filter := bson.M{"id": id}

	result, err := coll.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("task not found")
	}

	return nil
}

func (r *repository) DeleteSubtask(ctx context.Context, taskID, subtaskID string) error {
	coll := r.client.GetCollection("taskmate", "task")

	filter := bson.M{"id": taskID}

	update := bson.M{
		"$pull": bson.M{
			"subtasks": bson.M{"id": subtaskID},
		},
	}

	result, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("task not found")
	}
	if result.ModifiedCount == 0 {
		return errors.New("subtask not found")
	}

	return nil
}

func (r *repository) DeleteTaskFile(ctx context.Context, taskID, fileID string) error {
	coll := r.client.GetCollection("taskmate", "task")

	filter := bson.M{"id": taskID}

	update := bson.M{
		"$pull": bson.M{
			"files": bson.M{"id": fileID},
		},
	}

	result, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("task not found")
	}
	if result.ModifiedCount == 0 {
		return errors.New("file not found")
	}

	return nil
}
