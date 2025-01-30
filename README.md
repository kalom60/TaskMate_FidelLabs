# TaskMate - Task Management API with File Storage

## 🚀 Live Demo
🔗 **App Link:** [TaskMate](https://task-mate-fidel-labs.vercel.app/)

## 📌 Project Description
TaskMate is a **task management system** that allows users to create, manage, and track tasks with file attachments. The app provides a user-friendly interface for task organization and integrates with **Cloudinary** for seamless file storage.

## 🏗 Features
### ✅ Backend (Golang + Echo)
- CRUD APIs for **tasks and subtasks**
- **File upload/download** functionality (via Cloudinary)
- **Task status management** (Not Started, In Progress, Done)
- Basic user context (**no authentication required**)
- **Proper error handling** for API requests

### ✅ Frontend (React + Vite + PNPM)
- **List/Board view** for task visualization
- **Drag & drop** interface for file uploads
- **Task creation & editing**
- **File preview/download** support
- **Filter & search tasks**

### ✅ External API Integration
- **Cloudinary API** (free tier) for **file storage**

## 🛠 Tech Stack
- **Backend:** Golang, Echo, MongoDB Atlas
- **Frontend:** React, Vite, PNPM, TypeScript
- **Storage:** Cloudinary API for file uploads
- **Deployment:** Render (Backend), Vercel (Frontend)

## 📂 Folder Structure
```
TaskMate/
├── client/       # Frontend (React + Vite)
├── server/       # Backend (Golang + Echo)
├── docker-compose.yml
├── README.md
└── .env          # Environment variables (not pushed to GitHub)
```

## 📦 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/kalom60/TaskMate_FidelLabs.git
cd TaskMate_FidelLabs 
```

### 2️⃣ Setup Backend (Golang + MongoDB Atlas)
#### 🔹 Environment Variables (`server/.env`)
```sh
DB_URL=mongodb+srv://<username>:<password>@cluster0.hfaao.mongodb.net/
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloud-name
ALLOWED_ORIGINS=https://task-mate-fidel-labs.vercel.app
```
#### 🔹 Run Backend Locally
```sh
cd server
go run main.go
```

### 3️⃣ Setup Frontend (React + Vite + PNPM)
#### 🔹 Install Dependencies
```sh
cd client
pnpm install
```
#### 🔹 Start Development Server
```sh
pnpm run dev
```

### 4️⃣ Run with Docker (Optional)
```sh
docker-compose up --build
```

## 🚀 API Endpoints
### 📌 Task Management
| Method | Endpoint       | Description               |
|--------|--------------|---------------------------|
| GET    | `/tasks`      | Fetch all tasks          |
| POST   | `/tasks`      | Create a new task        |
| PATCH  | `/tasks/:id`  | Update a task            |
| DELETE | `/tasks/:id`  | Delete a task            |


## 🚧 Roadmap & Improvements
- 🔹 User authentication (JWT or OAuth)
- 🔹 Task assignment & collaboration
- 🔹 Notifications & reminders
- 🔹 Offline support & caching
