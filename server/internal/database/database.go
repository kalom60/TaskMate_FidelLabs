package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Service interface {
	Health() map[string]string
	GetCollection(databaseName, collectionName string) *mongo.Collection
}

type service struct {
	client *mongo.Client
}

var (
	host     = os.Getenv("DB_HOST")
	port     = os.Getenv("DB_PORT")
	username = os.Getenv("DB_USERNAME")
	password = os.Getenv("DB_PASSWORD")
)

func New() Service {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@%s:%s", username, password, host, port)))
	if err != nil {
		log.Fatal(err)
	}

	return &service{
		client: client,
	}
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err := s.client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(fmt.Sprintf("db down: %v", err))
	}

	return map[string]string{
		"message": "It's healthy",
	}
}

func (s *service) GetCollection(databaseName, collectionName string) *mongo.Collection {
	return s.client.Database(databaseName).Collection(collectionName)
}
