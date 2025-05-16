# Secure File Upload & Metadata Processing Microservice

A Node.js microservice that handles authenticated file uploads, stores associated metadata in a database, and processes files asynchronously.

## Features

- JWT-based authentication
- Secure file upload with metadata
- Asynchronous file processing using BullMQ
- PostgreSQL database integration
- File status tracking
- User-based access control

## Tech Stack

- Node.js (>=18)
- Express.js
- PostgreSQL with Sequelize
- JWT for authentication
- BullMQ for background jobs
- Multer for file handling

## Prerequisites

- Node.js >= 18
- PostgreSQL
- Redis (for BullMQ)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up PostgreSQL database
5. Run migrations:
   ```bash
   npm run migrate
   ```
6. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

#### POST /auth/register
Register a new user and receive JWT token.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### File Upload

#### POST /upload
Upload a file with optional metadata.

Headers:
- Authorization: Bearer <jwt_token>

Request body (multipart/form-data):
- file: The file to upload
- title: (optional) File title
- description: (optional) File description

### File Status

#### GET /files/:id
Get file status and metadata.

Headers:
- Authorization: Bearer <jwt_token>

## API cURL Examples

### Authentication

#### Register New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### File Operations

#### Upload File
```bash
curl -X POST http://localhost:3000/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.txt" \
  -F "title=My File" \
  -F "description=This is a test file"
```

#### Get File Status
```bash
curl -X GET http://localhost:3000/files/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Health Check
```bash
curl -X GET http://localhost:3000/health
```

### Example Usage Flow

1. First, register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

2. Use the received token to upload a file:
```bash
curl -X POST http://localhost:3000/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.txt" \
  -F "title=My File" \
  -F "description=This is a test file"
```

3. Check the file status using the file ID received from the upload:
```bash
curl -X GET http://localhost:3000/files/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=file_upload
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_URL=redis://localhost:6379
```

## Security Features

- JWT authentication
- File size limits
- User-based access control
- Rate limiting
- Helmet security headers
- CORS configuration

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── app.js         # Express app setup
```

## License

ISC
