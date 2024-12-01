# Finance-Based Q&A Platform

## Project Overview

This repository contains a Finance-Based Q&A Platform that allows users to ask and answer questions related to finance, investments, banking, and other financial topics. The platform includes user authentication, profile management, and an admin dashboard for question moderation.


## Deployment Links

- **Client Deployment Link**: [https://qulth.vercel.app/](https://qulth.vercel.app/)
- **Server Deployment Link**: [https://qulth-backend.onrender.com/](https://qulth-backend.onrender.com/)


## Features

### Frontend

#### Authentication
- Secure signup and login with Clerk.js

#### Pages
- `/`: Home page displaying all financial questions
- `/signup`: User registration page
- `/login`: User login page
- `/question/:questionId`: View specific financial question details, including user comments
- `/questions`: Manage all finance-related questions posted by the user (segregated by status: approved, pending)
- `/adminQuestions`: Admin dashboard for managing financial questions (approve/disapprove)
- `/questionSearch/:keyword`: Search results for financial queries

#### Dialog Boxes
- Add Question Dialog: Allows users to submit new financial questions
- Profile Update Dialog: Lets users update their personal and financial profile details

#### Question Management
- Infinite scrolling to load questions dynamically
- Sorting and filtering options for finance-related categories (e.g., investments, banking, taxes)

#### Error Handling
- Notifications for failed actions or API errors

### Backend

#### User Management
- Profile creation, fetching, and updating
- Unique username validation using a Bloom filter

#### Finance Question Management
- CRUD operations for financial questions
- Admin functionality to approve or disapprove questions
- Search functionality optimized for financial terms and categories

#### Commenting
- Add and view comments on financial questions

#### Authentication Middleware
- Securely protects routes with Clerk's ClerkExpressRequireAuth

#### Search Functionality
- Full-text search for financial questions using keywords and tags

#### Webhooks
- Clerk webhook listener to handle user account updates

#### Data Storage
- MongoDB for storing financial questions, user profiles, and comments
- Cloudinary for managing media uploads

# Backend API Endpoints Documentation

## **Authentication Endpoints**

### **POST /webhook/clerk**
- **Description**: Handles Clerk webhook events to sync data between the application and Clerk.

### **GET /get**
- **Description**: Retrieves the authenticated user's profile data.

### **POST /check-username**
- **Description**: Checks if a username is unique using Bloom filter.

### **POST /update**
- **Description**: Updates the profile information of the authenticated user.

---

## **Comment Endpoints**

### **POST /create**
- **Description**: Creates a new comment for a specific question. Requires user authentication.

### **GET /get**
- **Description**: Retrieves all comments for a specific question.

---

## **Like/Dislike Endpoints**

### **POST /likeQuestion**
- **Description**: Allows the authenticated user to like a specific question.

### **POST /dislikeQuestion**
- **Description**: Allows the authenticated user to dislike a specific question.

---

## **Question Endpoints**

### **POST /create**
- **Description**: Allows the authenticated user to create a new question.

### **POST /edit**
- **Description**: Allows the authenticated user to edit an existing question.

### **POST /approve**
- **Description**: Approves a question for visibility.

### **POST /disapprove**
- **Description**: Disapproves a question and removes it from visibility.

### **GET /delete**
- **Description**: Deletes a specific question.

### **GET /get**
- **Description**: Retrieves all questions for the authenticated user. Supports infinite scrolling for pagination.

### **GET /getById**
- **Description**: Retrieves a specific question by its ID.

---

## **Security Considerations**
- All sensitive routes require authentication via Clerk to ensure secure access.
- Bloom filter is used to efficiently check for unique usernames.

---

## **Additional Notes**
- Infinite scroll functionality is implemented in the `/get` endpoint for fetching questions.
- Clerk is used for user authentication and profile management.

---


## Technologies Used

### Frontend
- **Framework**: React (Vite for fast builds)
- **UI Library**: TailwindCSS
- **Authentication**: Clerk.js
- **State Management**: Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB (with Mongoose)
- **Authentication**: Clerk SDK

### Utilities
- Multer for file uploads
- Bloom Filter for unique username validation
- **Hosting**: 
  - Vercel (Frontend)
  - Render (Backend)

## Setup Instructions

### Prerequisites
- Install Node.js and npm
- Set up a MongoDB Atlas cluster or local MongoDB instance
- Register for a Clerk account for authentication
- Create a Cloudinary account for media uploads

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. **Install Dependencies**
   ```bash
    # For Backend
    cd server
    npm install

    # For Frontend
    cd client
    npm install

3. **Enviroment Variable .env**
    ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
    PORT=8000
    CLERK_WEBHOOK_SECRET_KEY=whsec_XXXXXXXXXXXXXXXXXXXXXXXXX
    CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXX
    CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXX
    CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
    CLOUDINARY_API_KEY=<cloudinary-api-key>
    CLOUDINARY_SECRET_KEY=<cloudinary-secret-key>

4. **Frontend .env**
    ```bash
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXX
    VITE_BACKEND_URL=http://localhost:8000

## Running the Application

### Backend
    ```bash
    cd server
    npm start

### Frontend
    ```bash
    cd client
    npm run dev

## Usage

Visit http://localhost:5173 for the frontend.
Sign up or log in using Clerk authentication.

### Features:

- Submit financial questions for the community to answer.
- Search financial queries by keywords and tags.
- Admins can moderate questions (approve/disapprove).
- Users can comment and participate in discussions.

## Future Enhancements

- **Push Notifications**: Notify users about question approvals or responses.
- **Enhanced Search**: Filters for financial tags like investment, taxation, or budgeting.
- **Gamification**: Add badges for active participants (e.g., Finance Expert, Tax Advisor).
- **Data Analytics**: Provide insights into popular questions, topics, and user engagement.
- **Mobile Support**: Optimize for smaller screens and add a mobile app.

## Support

For further support, feel free to raise an issue on the repository or contact the maintainer.
