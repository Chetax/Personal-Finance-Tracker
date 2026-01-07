# Personal Finance Management System

A full-stack **Personal Finance Management System** that helps users track income, expenses, and financial patterns over time.  
The frontend is built using **React.js with Redux for state management**, while the backend is developed using **Django**.

The project focuses on clean data modeling, predictable state management, and scalable backend APIs.

---

## Project Overview

Managing personal finances manually is error-prone and unstructured.  
This system provides a digital solution to record transactions, categorize expenses, and analyze spending habits.

---

## Tech Stack

### Frontend
- React.js
- Redux (State Management)
- Material UI (MUI)
- JavaScript (ES6+)
- Axios

### Backend
- Python
- Django
- Django REST Framework (DRF)
- SQLite / PostgreSQL / MySQL

---

## System Architecture

```

React + Redux (Frontend)
|
|  REST API (JSON)
v
Django (Backend)
|
v
Database

````

- Redux manages global state like transactions, categories, and summaries.
- Django acts as the central authority for business logic and data storage.

---

## Features

### User Features
- Add income and expense transactions
- Categorize expenses (Food, Rent, Travel, etc.)
- View transaction history
- Track monthly spending

### State Management (Redux)
- Centralized store for transactions
- Predictable state updates using actions and reducers
- Improved performance for large datasets

---

## Frontend Setup (React + Redux + MUI)

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Steps to Run Frontend
1. Clone the repository
   ```bash
   git clone <repository-url>
````

2. Navigate to frontend directory

   ```bash
   cd frontend
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Start the development server

   ```bash
   npm start
   ```

5. Application runs on:

   ```
   http://localhost:3000
   ```

---

## Backend Setup (Django)

### Prerequisites

* Python 3.9+
* pip
* Virtual environment (recommended)

### Steps to Run Backend

1. Navigate to backend directory

   ```bash
   cd backend
   ```

2. Create and activate virtual environment

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations

   ```bash
   python manage.py migrate
   ```

5. Start the server

   ```bash
   python manage.py runserver
   ```

6. Backend runs on:

   ```
   http://localhost:8000
   ```

---

## API Overview

Some important API endpoints:

* `GET /api/transactions/` – List all transactions
* `POST /api/transactions/` – Add new transaction
* `GET /api/categories/` – List expense categories
* `GET /api/summary/` – Monthly finance summary

(All responses are in JSON format)

---

## Contributors

* **Frontend Development**: You (React, Redux, MUI)
* **Backend Development**: Ashwin (Django)

---

## Future Enhancements

* Authentication & authorization
* Budget limits & alerts
* Charts and analytics dashboard
* Export reports (CSV / PDF)
* AI-based spending insights

---
