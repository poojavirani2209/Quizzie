## Problem Overview
A monolith arch based quiz application with restful API

### Clone the project

```bash
git clone https://github.com/poojavirani2209/Quizzie
```

### Navigate to the project directory

```bash
  cd Quizzie
```

### Install dependencies for frontend and backend separately

**Tip:** To efficiently install dependencies for both frontend and backend simultaneously, use split terminals.

Install frontend dependencies

```bash
cd client
npm install
```

Install backend dependencies

```bash
cd server
npm install
```

### Running Development Servers

**Important:**

- **Separate terminals**: Run the commands in separate terminal windows or use `split terminal` to avoid conflicts.

#### Start the backend server

- Navigate to the `server` directory: `cd server`
- Start the server: `npm start`
- You should see a message indicating the server is running, usually on port 8887.

#### Start the frontend server:

- Navigate to the `client` directory: `cd client`
- Start the server: `npm start`
- You should see a message indicating the client is running, usually on port 3000.

### Accessing the Application

Once both servers are running, you can access them at the following URL's:

- Client: http://localhost:3000
- Server: http://localhost:8887

### Steps to run with docker
### Clone the project

```bash
git clone https://github.com/poojavirani2209/Quizzie
```

### Navigate to the project directory

```bash
  cd Quizzie
```
### Run with docker

```bash
  docker-compose up --build
```

## Authors

- [@PoojaVirani](https://github.com/poojavirani2209)

# Quiz Application API Guide

This application uses Role-Based Access Control (RBAC) and JSON Web Tokens (JWT) for authorization. You need to register and log in to perform any operations. Below is the detailed guide for using the API.

---

## ADMIN USER

## 1. Register as an Admin

### Endpoint:

`POST http://localhost:8887/auth/admin/register`

### Input Request body JSON:

```json
{
  "username": "admin1",
  "password": "adminPass"
}
```

### Expected Output:
201 created

## 2. Login as an Admin

### Endpoint:

`POST http://localhost:8887/auth/login`

### Input Request body JSON:

```json
{
  "username": "admin1",
  "password": "adminPass"
}
```

### Expected Output:

200 OK

### Output Response body JSON:

```json
{
  "token": "This token needs to be sent with other requests in the auth header to ensure only admin can create questions/quiz.",
  "role": 1 // Role ID for admin
}
```

## 3. Create a new question - Only admin has the access to do this, if you give auth token of learner, you will get access is denied.

### Endpoint:

`POST http://localhost:8887/question`

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

```json
{
  "text": "Question 2",
  "options": ["ans1", "ans2", "ans3", "ans4"],
  "correctOption": 2 //This is 0 index based
}
```

### Expected Output:

201 Created

## 4. Get all questions list

### Endpoint:

`GET http://localhost:8887/question`

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

Not required

### Expected Output:

200 OK

### Output Response body JSON:

```json
[
  {
    "id": 1,
    "text": "Question 2",
    "options": "[\"ans1\",\"ans2\",\"ans3\",\"ans4\"]",
    "correct_option": 2
  }
]
```

## 5. Get question detials by Id

### Endpoint:

`GET http://localhost:8887/question/1`
This has /question/:questionId

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

Not required

### Expected Output:

200 OK

### Output Response body JSON:

```json
{
  "id": 1,
  "text": "Question 2",
  "options": ["ans1", "ans2", "ans3", "ans4"],
  "correctOption": 2
}
```

## 6. Create a new quiz - Only admin has the access to do this, if you give auth token of learner, you will get access is denied.

### Endpoint:

`POST http://localhost:8887/quiz`

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

```json
{
  "title": "Quiz 22",
  "questions": [1] // List of question IDs, which you will get from above GET responses. This could have used title of Questions, but for unique identification we have gone ahead with Id's
}
```

### Expected Output:

201 Created

## 7. Get all quizzes list

### Endpoint:

`GET http://localhost:8887/quiz`

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

Not required

### Expected Output:

200 OK

### Output Response body JSON:

```json
[
  {
    "id": 1,
    "title": "Quiz 22",
    "questions": "[1]"
  }
]
```

## 8. Get quiz detials by Id

### Endpoint:

`GET http://localhost:8887/quiz/1`
This is: /quiz/:quizId

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

Not required

### Expected Output:

200 OK

### Output Response body JSON:

```json
{
  "id": 1,
  "text": "Question 2",
  "options": ["ans1", "ans2", "ans3", "ans4"],
  "correctOption": 2
}
```

## LEARNER USER

## 1. Register as a Leaner

### Endpoint:

`POST http://localhost:8887/auth/register`

### Input Request body JSON:

```json
{
  "username": "learner1",
  "password": "learnerPass"
}
```

### Expected Output:

201 created

## 2. Login as a Learner

### Endpoint:

`POST http://localhost:8887/auth/login`

### Input Request body JSON:

```json
{
  "username": "learner1",
  "password": "learnerPass"
}
```

### Expected Output:

200 OK

### Output Response body JSON:

```json
{
  "token": "This token needs to be sent with other requests in the auth header to ensure only admin can create questions/quiz.",
  "role": 2 // Role ID for Learner
}
```

## 3. Get Quiz By Id [Same as API above in admin but with learners token]

## 4. Submit answers for a quiz

### Endpoint:

`POST http://localhost:8887/result/submit-answers`

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:

```json
{
  "quizId": 1,
  "answers": [{ "questionId": 1, "selectedOption": 2 }]
}
```

### Expected Output:

200 OK

### Output Response body JSON:

```json
{
    "score": 1,
    "actualAnswersSummary": [
        {
            "correctOption": 2,
            "isCorrectAnswer": true,
            "questionId": 1,
            "selectedOption": 2
        }
    ]
}
```

Note: You are allowed to submit answers for all questions in the quiz at once, so use an array for the answers.


## 5. Get Results for a user for a quiz

### Endpoint:

`GET http://localhost:8887/result/quiz/1`
This is /quiz/:quizId

### Authorization:

Include the Bearer token from the login response in the Authorization header.

### Input Request body JSON:
Not required as quizId is obtained from query params

### Expected Output:
200 OK

### Output Response body JSON:

```json
{
    "score": 1,
    "answers": [
        {
            "correctOption": 2,
            "isCorrectAnswer": true,
            "questionId": 1,
            "selectedOption": 2
        }
    ]
}

```


