# Alzine.com Backend API Routes

## Public Routes

- `GET /`  
  Welcome message

- `GET /api/`  
  Welcome message

- `GET /api/about`  
  About Alzine Backend

- `GET /api/contact`  
  Contact Alzine Backend

---

## Admin Routes (`/api/admin`)

- `POST /api/admin/auth/register`  
  Admin registration (rate limited)

- `POST /api/admin/auth/login`  
  Admin login (rate limited)

- `GET /api/admin/dashboard`  
  Admin dashboard (requires admin JWT)

- `POST /api/admin/upload/image`  
  Upload a single image (requires admin JWT)

- `POST /api/admin/upload/images`  
  Upload multiple images (requires admin JWT)

---

## Product Routes (`/api/admin/product`)

- `POST /api/admin/product/create`  
  Create a product (requires admin JWT, supports image upload)

- `GET /api/admin/product/forms`  
  Get all product forms (requires admin JWT)

### Product Form Subroutes (`/api/admin/product/forms`)

- `GET /api/admin/product/forms/`  
  Get all product forms

- `POST /api/admin/product/forms/create`  
  Create a new product form (requires admin JWT)

- `PUT /api/admin/product/forms/:id`  
  Update a product form by ID (requires admin JWT)

- `DELETE /api/admin/product/forms/:id`  
  Delete a product form by ID (requires admin JWT)

---

## Static Files

- `/uploads/...