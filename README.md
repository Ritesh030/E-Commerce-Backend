## Getting Started
 
### 1. Clone the repository
 
```bash
git clone https://github.com/Ritesh030/E-Commerce-Backend.git
cd E-Commerce-Backend
```
 
### 2. Install dependencies
 
```bash
npm install
```
 
### 3. Configure environment variables
 
Create a `.env` file in the root directory:
 
```bash
cp .env.example .env
```
 
Then fill in the values (see [Environment Variables](#environment-variables) below).
 
### 4. Start the server
 
```bash
# Development (with auto-restart)
npm run dev
 
# Production
npm start
```
 
The server will start at `http://localhost:<PORT>`.
 
---
 
## Environment Variables
 
Create a `.env` file in the root directory with the following variables:
 
| Variable               | Description                                      | Example                  |
|------------------------|--------------------------------------------------|--------------------------|
| `PORT`                 | Port the server listens on                       | `3000`                   |
| `MONGODB_URL`          | MongoDB connection string                        | `mongodb://localhost:27017/ecommerce` |
| `ACCESS_TOKEN_SECRET`  | Secret key for signing access tokens             | any long random string   |
| `ACCESS_TOKEN_EXPIRY`  | Access token expiry duration                     | `15m`                    |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh tokens            | any long random string   |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry duration                    | `10d`                    |
 
**Example `.env`:**
 
```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/ecommerce
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=10d
```
 
---
 
## API Reference
 
**Base URL:** `http://localhost:3000/api/v1`
 
All responses are in JSON format.
 
---
 
### User Routes
 
#### Register a new user
 
```
POST /user/register
```
 
**Request Body:**
 
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```
 
**Success Response — `201 Created`:**
 
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "64abc123...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```
 
---
 
#### Login
 
```
POST /user/login
```
 
**Request Body:**
 
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```
 
**Success Response — `200 OK`:**
 
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt_access_token>",
    "refreshToken": "<jwt_refresh_token>"
  }
}
```
 
> Access token is short-lived (`15m`). Use the refresh token endpoint to renew it.
 
---
 
#### Logout
 
```
POST /user/logout
```
 
**Auth required:** Yes — send the `accessToken` in the `Authorization` header.
 
```
Authorization: Bearer <access_token>
```
 
**Success Response — `200 OK`:**
 
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
 
---
 
#### Refresh Access Token
 
```
POST /user/refresh-token
```
 
**Request Body:**
 
```json
{
  "refreshToken": "<your_refresh_token>"
}
```
 
**Success Response — `200 OK`:**
 
```json
{
  "success": true,
  "data": {
    "accessToken": "<new_jwt_access_token>"
  }
}
```
 
---
 
### HTTP Status Codes
 
| Code  | Meaning                          |
|-------|----------------------------------|
| `200` | OK — request succeeded           |
| `201` | Created — resource created       |
| `400` | Bad Request — invalid input      |
| `401` | Unauthorized — invalid/missing token |
| `404` | Not Found — resource not found   |
| `500` | Internal Server Error            |
 
---
 
## License
 
This project is licensed under the [MIT License](LICENSE).
 
---
 
> Built by [Ritesh030](https://github.com/Ritesh030)
