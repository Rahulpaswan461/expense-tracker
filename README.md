# Expense Tracker 
This is a simple **Expense Tracker API** built with **Node.js**, **Express**, and **MongoDB**. The API allows users to add and track their expenses,
view balances, and download balance sheets.

## Features
- Add and manage expenses
- Split expenses by percentage or equal amounts
- Download user-specific balance sheets
- User authentication using tokens

## Prerequisites
- Before running this project, make sure you have the following installed:
- **Node.js**: Download and install it from [here](https://nodejs.org/).
- **MongoDB**: Install MongoDB from [here](https://www.mongodb.com/try/download/community).
- **Git**: To clone the repository.

## Installation
1. Clone the repository:
   git clone https://github.com/Rahulpaswan461/expense-tracker
2. Navigate to the project directory:
   cd expense-sharing-application
3. Install the dependencies:
    npm install
4. Set up the environment variables:
    - JWT_SECRET = your-secret-key
    - PORT = port-number
    - MONGO_URL = your-mongodb-url
5. Start the server:
   npm start


  
 ### Example .env file:
- JWT_SECRET=mySuperSecretKey
- PORT=3000
- MONGO_URL=mongodb://localhost:27017/assignment-portal

 ## API Endpoints
  ### User Endpoints
  - POST /api/user/register

         {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "password": "password123"
        }

 - POST /api/user/login

       {
        "email": "johndoe@example.com",
        "password": "password123"
       }
 - GET /api/user/get-users - return all the users

   ### Expensee Endpoints
   - POST /api/expense
     
     1. Body
     
               {
                "amount": 100,
                "description": "Lunch with friends",
                "participants": [
                    {"userId": "UserID1", "amountPaid": 50},
                    {"userId": "UserID2", "amountPaid": 50}
                ],
                "splitMethod": "equal",
                "createdBy": "UserID1"
               }
  - GET /api/get/:userId - expense details for the specific user
  - GET /api/get-all - all the expenses details of the user     
  - GET /api/expense/balance/:userId

   ## Technologies Used
- Node.js: JavaScript runtime for building fast, scalable network applications.
- Express.js: Web framework for Node.js.
- MongoDB: NoSQL database for storing users, admins, and assignments.
- Mongoose: ODM library for MongoDB and Node.js.
- JWT: Used for authentication and authorization.
- dotenv: For managing environment variables.

  ## License
  This project is licensed under the MIT License - see the LICENSE file for details.
  
