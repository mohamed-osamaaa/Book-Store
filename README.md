# 📚 Book-Store REST API (NestJS + MySQL)

## Description
Book-Store is a scalable and modular REST API built using NestJS and MySQL. It provides essential eCommerce features for managing books, authors, orders, and user interactions.

## Features
- 🔐 **JWT Authentication** with bcrypt password hashing
- 👤 **User Management** (Registration, Login, Profile)
- 📚 **Book & Author Management** (CRUD operations)
- 🛒 **Order Processing** (Cart, Checkout, Order Tracking)
- ⭐ **Review System** (Product Reviews and Ratings)
- 🏷️ **Category & Shipping Management**
- 🗄️ **TypeORM with MySQL** for database operations
- 🔄 **TypeORM Migrations** for schema version control
- 🛠️ **Modular Architecture** for scalability

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamed-osamaaa/Book-Store
   ```
2. Navigate to the project directory:
   ```bash
   cd Book-Store
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Configuration
Create a `.env` file in the root directory and configure the following environment variables:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

ACCESS_TOKEN_SECRET_KEY=
ACCESS_TOKEN_EXPIRE_TIME=
```

## 🚀 Running the Application
Start the development server:
```bash
npm run start:dev
```

Build and run in production:
```bash
npm run build
npm run start
```

## 🗄️ Database Migrations
To manage database schema changes efficiently, this project uses TypeORM migrations.

- **Generate a new migration**
  ```bash
  npm run migration:generate -- -n MigrationName
  ```
- **Run pending migrations**
  ```bash
  npm run migration:run
  ```
- **Revert the last migration**
  ```bash
  npm run migration:revert
  ```

## 🔧 Technologies Used
- **NestJS** - Backend Framework
- **TypeORM** - ORM for MySQL
- **MySQL** - Database
- **JWT & Bcrypt** - Authentication & Security
- **DTO Validation** - Request Data Validation
- **TypeORM Migrations** - Database Schema Management

## 🛠️ Entities
- **Users**
- **Authors**
- **Orders**
- **Books**
- **Categories**
- **Shipping**
- **Reviews**

## 📄 License
This project is open-source and available under the MIT License.

---

🔥 Built with NestJS & MySQL | 🚀 Scalable & Modular

