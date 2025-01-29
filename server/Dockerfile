# Use Golang 1.23.0 on Alpine as the base image for building
FROM golang:1.23.0-alpine AS build

WORKDIR /app

COPY server/go.mod server/go.sum ./

RUN go mod tidy

COPY server/ .

RUN go build -o app ./cmd/api/main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=build /app/app .

EXPOSE 8080

CMD ["./app"]
