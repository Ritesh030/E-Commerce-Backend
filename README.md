# E-Commerce Backend API

A Node.js, Express, and MongoDB backend for an e-commerce application. This project includes JWT-based authentication, role-based product management, cart handling, order creation, image uploads with Cloudinary, and paginated product listing.

## Features

- User registration and login with hashed passwords using `bcrypt`
- JWT-based authentication with access token and refresh token support
- Token delivery through both cookies and JSON response payloads
- Role-based authorization for admin-only product actions
- Product creation with image upload to Cloudinary
- Auto-generated SKU for new products
- Product listing with pagination
- Single-product fetch by SKU
- Stock update endpoint for admins
- User-specific cart creation and management
- Add, remove, update, and fetch cart items
- Order creation from cart contents
- Automatic stock reduction when an order is placed
- Cart clearing after successful order creation
- MongoDB models for users, products, carts, and orders
- CORS, cookie parsing, JSON parsing, and response-time middleware

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT
- Bcrypt
- Multer
- Cloudinary

## Project Structure

```text
src/
  app.js
  index.js
  config/
    db_config.js
    server_config.js
  controllers/
    cart_controller.js
    order_controller.js
    product_controller.js
    user_controller.js
  middlewares/
    auth_middleware.js
    isadmin_middleware.js
    multer_middleware.js
  models/
    cart_model.js
    order_model.js
    product_model.js
    user_model.js
  routes/
    api_router.js
    v1/
      a.index.js
      cart_router.js
      order_router.js
      product_router.js
      user_router.js
  utils/
    cloudinary.js
    apiResponse_and_handlers/
```

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

### 3. Create the environment file

Create a `.env` file in the project root and add the required values.

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/ecommerce
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
```

### 4. Start the server

```bash
npm start
```

The server runs on:

```text
http://localhost:3000
```

Base API path:

```text
http://localhost:3000/api/v1
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port used by the Express server |
| `MONGODB_URL` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry, for example `15m` |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry, for example `10d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN` | Allowed frontend origin for CORS |

## Authentication

Protected routes accept the access token in either of these ways:

- `Authorization: Bearer <access_token>`
- `accessToken` cookie

On login and refresh, the server also sets:

- `accessToken` cookie
- `refreshToken` cookie

## API Overview

### User Routes

Base path: `/api/v1/user`

#### Register user

`POST /register`

Request body:

```json
{
  "username": "ritesh",
  "fullname": "Ritesh Kumar",
  "email": "ritesh@gmail.com",
  "password": "secret123",
  "role": "user"
}
```

Notes:

- All fields are required
- Email validation currently accepts only Gmail addresses
- Allowed roles are `user` and `admin`

#### Login user

`POST /login`

Request body:

```json
{
  "email": "ritesh@gmail.com",
  "password": "secret123"
}
```

You can also log in with `username` instead of `email`.

Success response includes:

- user details
- access token
- refresh token
- auth cookies

#### Logout user

`POST /logout`

Authentication required.

This clears stored refresh token data and removes auth cookies.

#### Refresh access token

`POST /refresh-token`

Refresh token can be sent in:

- request cookies
- request body as `refreshToken`

### Product Routes

Base path: `/api/v1/product`

#### Create product

`POST /create`

Authentication required: admin only

Content type:

```text
multipart/form-data
```

Fields:

- `name`
- `brand`
- `price`
- `description`
- `stock`
- `image`

Behavior:

- uploads the image to Cloudinary
- generates a SKU automatically
- stores initial price in `priceHistory`

#### Get all products

`GET /`

Query parameters:

- `page` default is `1`
- `limit` default is `10`

Response includes:

- `products`
- `page`
- `totalPages`
- `totalProducts`

#### Get product by SKU

`GET /:sku`

Example:

```text
GET /api/v1/product/APPLE-IPHONE13-001
```

#### Add stock to product

`PATCH /:sku/addstock`

Authentication required: admin only

Request body:

```json
{
  "stock": 5
}
```

### Cart Routes

Base path: `/api/v1/cart`

All cart routes require authentication.

#### Add item to cart

`POST /:sku/add`

Request body:

```json
{
  "quantity": 2
}
```

If the user does not already have a cart, one is created automatically.

#### Remove item from cart

`DELETE /:sku/remove`

Removes the matching product from the user's cart.

#### Update cart item quantity

`PATCH /:sku/update`

Request body:

```json
{
  "quantity": 4
}
```

#### Get current cart

`GET /`

Returns the current user's cart with populated product details.

### Order Routes

Base path: `/api/v1/order`

All order routes require authentication.

#### Create order from cart

`POST /create`

Behavior:

- reads the authenticated user's cart
- validates cart is not empty
- validates stock for each item
- reduces product stock
- creates an order with item price snapshots
- calculates total order price
- clears the cart after success

## Data Models

### User

- `username`
- `fullname`
- `email`
- `password`
- `refreshToken`
- `role`

### Product

- `name`
- `brand`
- `sku`
- `price`
- `priceHistory`
- `description`
- `stock`
- `image.url`
- `image.publicId`

### Cart

- `userId`
- `items[].productId`
- `items[].quantity`

### Order

- `userId`
- `items[].productId`
- `items[].quantity`
- `items[].price`
- `totalPrice`
- `status`

Available order statuses:

- `pending`
- `paid`
- `shipped`
- `delivered`
- `cancelled`

## Response Format

Most successful responses follow this shape:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "success"
}
```

## Notes

- Product image uploads are first stored locally in `public/assets` and then uploaded to Cloudinary
- Access and refresh tokens are both returned in the login response
- Product creation and stock updates are restricted to admin users
- Product SKU lookup is handled in uppercase form
- `npm start` currently runs the server with `nodemon`

## Current Limitations

- No test suite is configured yet
- No endpoint is implemented for listing all orders or fetching a single order
- User profile, password reset, and payment integration are not implemented yet
- Product filters, search, and category support are not implemented yet
