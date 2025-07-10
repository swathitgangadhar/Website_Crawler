# Website Crawler Dashboard

This is a full-stack web application that allows users to analyze and monitor key metadata of websites such as HTML version, internal/external links, broken links, and login form presence. Built using React (TypeScript) on the frontend and Go (Gin) on the backend.

## Features

### 🔎 URL Management
- Submit URLs for analysis
- View and manage submitted URLs
- Bulk delete and re-analyze URLs

### 📊 Results Dashboard
- Paginated, sortable table with metadata
- Filters and global search

### 📁 Details View
- View per-URL insights
- Internal vs. external links bar chart
- List of broken links with status codes

### ⏱️ Real-Time Progress
- Live crawl status (queued → running → done/error)


## Tech Stack

**Frontend**  
- React + TypeScript  
- React Router  
- Chart.js (Bar chart)  
- Bootstrap (UI styling)

**Backend**  
- Go (Golang)  
- Gin framework  
- GORM ORM  
- MySQL database


---

## Getting Started

### 1. Backend (Go)

cd backend
go run main.go

### 2. Ensure .env contains:
MYSQL_DSN=username:password@tcp(127.0.0.1:3306)/crawler_db?parseTime=true

## 3. Frontend (React + TypeScript)
cd frontend
npm install
npm start
