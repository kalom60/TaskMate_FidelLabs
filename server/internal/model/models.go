package models

import "time"

type Subtask struct {
	ID        string    `json:"id" bson:"id"`
	Title     string    `json:"title" bson:"title"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}

type File struct {
	ID        string    `json:"id" bson:"id"`
	FileName  string    `json:"fileName" bson:"fileName"`
	FileURL   string    `json:"fileURL" bson:"fileURL"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}

type Task struct {
	ID          string    `json:"id" bson:"id"`
	Title       string    `json:"title" bson:"title"`
	Description string    `json:"description" bson:"description"`
	DueDate     time.Time `json:"dueDate" bson:"dueDate"`
	Priority    string    `json:"priority" bson:"priority"`
	Status      string    `json:"status" bson:"status"`
	Owner       string    `json:"owner" bson:"owner"`
	Subtasks    []Subtask `json:"subtasks" bson:"subtasks"`
	Files       []File    `json:"files" bson:"files"`
	CreatedAt   time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" bson:"updatedAt"`
}
