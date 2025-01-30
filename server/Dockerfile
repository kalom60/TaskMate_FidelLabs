# Use Golang 1.23.0 on Alpine as the base image for building
FROM golang:1.23.0-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

COPY . .

RUN go build -o app ./cmd/api/main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=build /app/app .

EXPOSE 8080

CMD ["./app"]
