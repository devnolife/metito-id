# Metito Water API Documentation

## Overview

This is the complete API documentation for the Metito Water website. The API provides endpoints for authentication, product management, content management, and more.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "errors": object
}
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+62812345678",
  "company": "Company Name"
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### POST /api/auth/logout
Logout and clear authentication cookies.

### GET /api/auth/me
Get current user profile (requires authentication).

## Product Endpoints

### GET /api/products
Get list of products with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `search` (string): Search term
- `category` (string): Category ID
- `application` (string): Industrial or Municipal
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `inStock` (boolean): Filter by stock status
- `featured` (boolean): Filter featured products

### POST /api/products
Create a new product (Admin only).

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 10000,
  "capacity": "1000 L/h",
  "efficiency": "99%",
  "location": "Indonesia",
  "application": "Industrial",
  "categoryId": "category-id",
  "features": ["Feature 1", "Feature 2"],
  "specs": {"key": "value"},
  "images": ["image1.jpg"],
  "warranty": "2 years",
  "delivery": "4-6 weeks"
}
```

### GET /api/products/[id]
Get single product by ID.

### PUT /api/products/[id]
Update product (Admin only).

### DELETE /api/products/[id]
Delete product (Admin only).

## Category Endpoints

### GET /api/categories
Get all categories.

**Query Parameters:**
- `includeProducts` (boolean): Include products in response

### POST /api/categories
Create new category (Admin only).

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category description",
  "icon": "icon-name",
  "color": "blue"
}
```

## Blog Endpoints

### GET /api/blog
Get blog posts with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term
- `featured` (boolean): Filter featured posts
- `tag` (string): Filter by tag slug

### POST /api/blog
Create new blog post (Admin only).

**Request Body:**
```json
{
  "title": "Blog Post Title",
  "content": "Blog post content",
  "excerpt": "Short excerpt",
  "coverImage": "image.jpg",
  "authorName": "Author Name",
  "authorEmail": "author@example.com",
  "tags": ["tag1", "tag2"],
  "isPublished": true,
  "isFeatured": false
}
```

## Contact/Inquiry Endpoints

### POST /api/contact
Submit contact inquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+62812345678",
  "company": "Company Name",
  "subject": "Inquiry Subject",
  "message": "Inquiry message",
  "productId": "optional-product-id"
}
```

### GET /api/contact
Get inquiries (Admin only).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `search` (string): Search term

## Service Endpoints

### GET /api/services
Get all services.

**Query Parameters:**
- `featured` (boolean): Filter featured services

### POST /api/services
Create new service (Admin only).

**Request Body:**
```json
{
  "name": "Service Name",
  "description": "Service description",
  "shortDesc": "Short description",
  "icon": "icon-name",
  "features": ["Feature 1", "Feature 2"],
  "pricing": {"basic": 1000, "premium": 2000},
  "isFeatured": true
}
```

## Testimonial Endpoints

### GET /api/testimonials
Get approved testimonials.

**Query Parameters:**
- `featured` (boolean): Filter featured testimonials
- `limit` (number): Limit results

### POST /api/testimonials
Submit new testimonial.

**Request Body:**
```json
{
  "name": "Customer Name",
  "company": "Company Name",
  "position": "Job Title",
  "content": "Testimonial content",
  "rating": 5,
  "avatar": "avatar.jpg"
}
```

## Gallery Endpoints

### GET /api/gallery
Get gallery items with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category
- `projectType` (string): INDUSTRIAL, MUNICIPAL, etc.
- `featured` (boolean): Filter featured items

### POST /api/gallery
Create new gallery item (Admin only).

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Project description",
  "image": "image.jpg",
  "category": "Industrial",
  "projectType": "INDUSTRIAL",
  "location": "Jakarta, Indonesia",
  "completedAt": "2023-12-01T00:00:00Z",
  "isFeatured": true
}
```

## Newsletter Endpoints

### POST /api/newsletter
Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "User Name"
}
```

### DELETE /api/newsletter?email=user@example.com
Unsubscribe from newsletter.

## Certification Endpoints

### GET /api/certifications
Get company certifications.

**Query Parameters:**
- `active` (boolean): Filter active certifications

### POST /api/certifications
Create new certification (Admin only).

**Request Body:**
```json
{
  "name": "ISO 9001:2015",
  "description": "Quality Management System",
  "issuer": "ISO",
  "issuedAt": "2022-01-01T00:00:00Z",
  "expiresAt": "2025-01-01T00:00:00Z"
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Edit .env with your database credentials
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed database with initial data
   npm run db:seed
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel:**
   - Email: admin@metito.id
   - Password: admin123

## Database Schema

The API uses PostgreSQL with Prisma ORM. Main models include:

- **User** - User accounts and authentication
- **Product** - Water treatment products
- **Category** - Product categories
- **Order** - Customer orders
- **BlogPost** - Blog articles
- **Inquiry** - Contact inquiries
- **Service** - Company services
- **Testimonial** - Customer testimonials
- **GalleryItem** - Project gallery
- **Certification** - Company certifications
- **Newsletter** - Email subscriptions

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection protection via Prisma
- Rate limiting (recommended for production)
- CORS configuration
- Environment variable protection

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy application
5. Set up SSL certificates
6. Configure reverse proxy (nginx)
7. Set up monitoring and logging 
