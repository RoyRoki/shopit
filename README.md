# 🛍️ ShopIt

ShopIt is a **full-stack e-commerce platform** built with modern technologies to provide a seamless shopping experience. It includes features like **user authentication, secure payments, efficient data handling, and cloud storage**.

---

## 🚀 Features

- **User Authentication** (JWT-based security)
- **Product Management** (Add, update, and delete products)
- **Payment Integration** (Razorpay for secure transactions)
- **Cloud Storage** (AWS S3 for managing product images)
- **Real-time Cache** (Redis for faster access)
- **Email & OTP Verification** (SMTP integration)
- **Dockerized Backend** (Run with Docker Compose for easy deployment)

---

## 🖥️ Tech Stack

### Frontend

- ![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
- ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
- [Redux](https://redux.js.org/)

### Backend

- ![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
- ![Java](https://img.shields.io/badge/-Java-007396?style=for-the-badge&logo=java&logoColor=white)
- ![Docker Compose](https://img.shields.io/badge/-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white) for backend deployment

### Database

- ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### Other Tools & Services

- ![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) for authentication
- ![AWS S3](https://img.shields.io/badge/-AWS%20S3-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white) for image storage
- ![Razorpay](https://img.shields.io/badge/-Razorpay-0D1A4B?style=for-the-badge&logo=razorpay&logoColor=white) for payments
- ![SMTP](https://img.shields.io/badge/-SMTP-F2A900?style=for-the-badge&logo=gmail&logoColor=white) for email verification

---

## 📸 Screenshots

### 🏠 Home Page

![Home Page](./home.png)

### 🛒 Product Page

![Product Page](./product.png)

---

## 📜 Environment Variables

Create a `.env` file in the backend and add the following:

```env
SPRING_DATASOURCE_URL=your_postgresql_url
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_DATA_REDIS_HOST=your_redis_host
SPRING_DATA_REDIS_PORT=your_redis_port
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
PAYMENT_RAZORPAY_KEY_ID=your_razorpay_key
PAYMENT_RAZORPAY_KEY_SECRET=your_razorpay_secret
SECURITY_JWT_SECRET_KEY=your_jwt_secret
```

[![Postman Documentation](https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg)](https://documenter.getpostman.com/view/35037237/2sB2cSh3qT)
A Postman collection containing all API endpoints is available.
