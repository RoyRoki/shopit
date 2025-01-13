# eShop API Documentation


user => 
      cart => ORDER
      products -> store 1 [p1,p2,p3] , store 2 [px,p4]
         store 1 -> shipping =>
            SELF -> [p1,p2]
               1. send user info to admin
               2. order processing
            ESHOP -> [p3]
               1. get-shipping cost
               2. total price ->
                  COD -> order processing -> create order 
                           -> sent info to admin [use delivery partner]
                  UPI -> order processing 
                        -> payment success -> sent info to admin [...]
      Add order to user
      
      /{orderId}/update -> update the state of order




























## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Roles and Permissions](#roles-and-permissions)
4. [API Endpoints](#api-endpoints)
    - [User Endpoints](#user-endpoints)
    - [Admin Endpoints](#admin-endpoints)
5. [Data Models](#data-models)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [Request and Response Structure](#request-and-response-structure)
8. [Installation and Setup](#installation-and-setup)
9. [Testing](#testing)
10. [Future Enhancements](#future-enhancements)

---

## Introduction
The **eShop API** is a RESTful service built with Spring Boot, allowing users to browse and purchase products while enabling admins to manage stores, add products, and view orders.

## Features
- **Users** can browse products, add items to a cart, and place orders.
- **Admins** can create stores, add/update products, and manage orders.

## Roles and Permissions
- **User (Customer)**: Can view products, manage a shopping cart, and place orders.
- **Admin (Store Owner)**: Can create stores, manage products, and view all orders.

## API Endpoints

### User Endpoints
- `GET /api/products` - Get all products.
- `GET /api/products/{id}` - Get a specific product by ID.
- `POST /api/cart` - Add items to the user's cart.
- `POST /api/orders` - Place an order with items in the cart.
- `GET /api/orders` - View the order history of the user.

### Admin Endpoints
- `POST /api/stores` - Create a new store.
- `POST /api/stores/{storeId}/products` - Add products to a store.
- `PUT /api/stores/{storeId}/products/{productId}` - Update product details.
- `DELETE /api/stores/{storeId}/products/{productId}` - Delete a product.
- `GET /api/orders` - View all orders.

## Data Models
- **User**: Defines the user entity with fields like `user_id`, `name`, `email`, `role`, etc.
- **Product**: Represents each product's details (e.g., `product_id`, `name`, `price`, `category`).
- **Order**: Contains details of each order, including items, quantity, user, and order status.
- **Store**: Represents the store managed by admins, including `store_id`, `name`, and `products`.

## Authentication and Authorization
This API uses JWT-based authentication. Each request requires a valid JWT token:
- **User Tokens**: Grants access to product browsing and order placement.
- **Admin Tokens**: Grants access to store and product management.

## Request and Response Structure

### Example - Creating a Store (Admin Only)
**Request**: `POST /api/stores`
```json
{
  "name": "Gadget Store",
  "location": "Online"
}
```

**Response**:
```json
{
  "storeId": 1,
  "name": "Gadget Store",
  "location": "Online",
  "createdAt": "2024-11-15T12:34:56"
}
```

### Example - Placing an Order (User Only)
**Request**: `POST /api/orders`
```json
{
  "items": [
    {
      "productId": 101,
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main Street, City"
}
```

**Response**:
```json
{
  "orderId": 2001,
  "status": "Processing",
  "totalPrice": 599.98,
  "createdAt": "2024-11-15T12:34:56"
}
```

## Installation and Setup
1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `./mvnw clean install`
3. Set up the PostgreSQL database (update configurations in `application.properties`):
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/eshop
    spring.datasource.username=yourUsername
    spring.datasource.password=yourPassword
    ```
4. Run the application: `./mvnw spring-boot:run`

## Testing
- **Postman** or **Swagger UI**: Use these tools to interact with the API endpoints and view responses.
- **Unit and Integration Tests**: Run `./mvnw test` to execute tests for service layer and controller functionality.

## Future Enhancements
- Add features like product reviews, discount codes, and personalized recommendations.
- Implement a customer support module.
- Improve caching for product data to enhance performance.

---

This structure provides clarity to developers and users of the API, outlining the purpose, setup, and details of each endpoint. Let me know if you’d like specific sections expanded!

