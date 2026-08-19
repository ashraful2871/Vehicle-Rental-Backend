# Vehicle Rental Management Backend

A REST API backend for a vehicle rental company built with Node.js, Express, TypeScript, and Knex.js.

## Features
- Staff Authentication via JWT
- Vehicle Fleet Management
- Rental Booking (with overlap prevention and automatic amount calculation)
- Monthly Revenue Reporting per vehicle

## Setup & Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup:**
   Run the migrations to create the required tables:
   ```bash
   npm run db:migrate
   ```

4. **Seed Initial Data:**
   Seed the database with an admin user, sample vehicles, and a completed rental (for report testing):
   ```bash
   npm run db:seed
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:3000` (or the port defined in `.env`).

## Built With
- Node.js & Express
- TypeScript
- Knex.js & PostgreSQL
- Joi Validation
- JWT Authentication
- Multer for File Uploads
