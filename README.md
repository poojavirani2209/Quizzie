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
### Clone the project

```bash
git clone https://github.com/poojavirani2209/Quizzie
```

### Run with docker

```bash
  docker-compose up --build
```

## Authors

- [@PoojaVirani](https://github.com/poojavirani2209)
