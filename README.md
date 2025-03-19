# AI Powered Note Summarizer

## 🚀 Description

This project is an AI-driven text summarization tool that generates concise summaries with a specified tone and character limit. It ensures clarity while preserving key details, making it ideal for quick information processing.

## 🛠️ Tech Stack

### **Frontend:**

- React (TypeScript)
- Material UI
- Tailwind CSS

### **Backend:**

- Express.js (TypeScript, TSX)
- PostgreSQL

## 📦 Installation & Setup

### **1. Clone the repository**

```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### **2. Install dependencies**

#### Frontend

```sh
cd frontend
npm install
npm run dev
```

#### Backend

```sh
cd backend
npm install
npm run dev
```

### **3. Set up environment variables**

Create a .env file in the backend directory:

```sh
PORT=5000
DATABASE_URL=
POSTGRES_PASSWORD=
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=
```

Create a .env file in the frontend directory:

```sh
REACT_APP_BACKEND_URL=http://localhost:5000
```

## 🔥 API Endpoints

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| `GET`  | `/notes`           | Get all notes        |
| `POST` | `/notes/save`      | Save the summary     |
| `POST` | `/notes/summarize` | Generate the summary |

## 🎨 DEMO

![Demo](./frontend/src/assets/Demo.gif)
