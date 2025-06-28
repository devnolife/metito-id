# Image Upload Feature Guide

## Overview
Fitur upload gambar telah diintegrasikan ke dalam sistem admin untuk memudahkan pengelolaan gambar di berbagai halaman admin seperti Products, Customers, Gallery, dll.

## Features
- ✅ Upload multiple images dengan drag & drop
- ✅ Validasi file type (JPEG, PNG, WebP, GIF)
- ✅ Validasi file size (max 5MB)
- ✅ Preview gambar yang diupload
- ✅ Delete gambar
- ✅ Metadata gambar (title, description, alt text)
- ✅ Relasi dengan Product dan User
- ✅ Database storage untuk metadata gambar

## Database Schema

### Image Model
```prisma
model Image {
  id          String    @id @default(cuid())
  fileName    String
  originalName String
  filePath    String
  fileSize    Int
  fileType    String
  imageType   ImageType
  title       String?
  description String?
  altText     String?
  isActive    Boolean   @default(true)
  isFeatured  Boolean   @default(false)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  userId      String?
  productId   String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product     Product?  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("images")
}
```

### ImageType Enum
```prisma
enum ImageType {
  PRODUCT
  GALLERY
  CUSTOMER
  TESTIMONIAL
  BLOG
  CERTIFICATE
  DOCUMENT
}
```

## API Endpoints

### POST /api/upload
Upload gambar baru

**Parameters:**
- `file` (File): File gambar
- `category` (string): Kategori upload (products, gallery, customers, dll)
- `productId` (string, optional): ID produk jika upload untuk produk tertentu
- `userId` (string, optional): ID user jika upload untuk user tertentu
- `title` (string, optional): Judul gambar
- `description` (string, optional): Deskripsi gambar
- `altText` (string, optional): Alt text untuk accessibility

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "image_id",
    "fileName": "filename.jpg",
    "filePath": "/images/products/product_id/filename.jpg",
    "fileSize": 1024000,
    "fileType": "image/jpeg",
    "category": "products",
    "productId": "product_id",
    "userId": null,
    "title": "Product Image",
    "description": "Product description",
    "altText": "Product alt text"
  }
}
```

### DELETE /api/upload?imageId={id}
Hapus gambar

### GET /api/upload
Ambil daftar gambar dengan filter

**Query Parameters:**
- `imageType` (string, optional): Filter berdasarkan tipe gambar
- `productId` (string, optional): Filter berdasarkan product ID
- `userId` (string, optional): Filter berdasarkan user ID
- `limit` (number, optional): Jumlah data per halaman (default: 50)
- `offset` (number, optional): Offset untuk pagination (default: 0)

## Component Usage

### ImageUpload Component
```tsx
import { ImageUpload } from '@/components/admin/image-upload'

// Basic usage
<ImageUpload
  category="products"
  onUploadComplete={(images) => console.log('Uploaded:', images)}
  onImageDelete={(imageId) => console.log('Deleted:', imageId)}
  maxFiles={5}
/>

// With product relation
<ImageUpload
  category="products"
  productId="product_123"
  onUploadComplete={handleImageUpload}
  onImageDelete={handleImageDelete}
  existingImages={productImages}
  maxFiles={10}
  className="mt-4"
/>

// For customer avatar
<ImageUpload
  category="customers"
  userId="user_123"
  onUploadComplete={handleAvatarUpload}
  onImageDelete={handleAvatarDelete}
  maxFiles={1}
/>
```

### Props
- `category` (required): Kategori upload ('products' | 'gallery' | 'customers' | 'testimonials' | 'blog' | 'certificates' | 'documents')
- `productId` (optional): ID produk untuk relasi
- `userId` (optional): ID user untuk relasi
- `onUploadComplete` (optional): Callback ketika upload berhasil
- `onImageDelete` (optional): Callback ketika gambar dihapus
- `maxFiles` (optional): Maksimal jumlah file (default: 10)
- `className` (optional): CSS class tambahan
- `existingImages` (optional): Array gambar yang sudah ada

## File Structure
```
public/
├── images/
│   ├── products/
│   │   └── {product_id}/
│   ├── gallery/
│   ├── users/
│   ├── testimonials/
│   └── blog/
├── certificates/
└── documents/
    └── products/
```

## Integration Examples

### 1. Product Management
```tsx
// Di dalam form product
<div>
  <Label>Product Images</Label>
  <ImageUpload
    category="products"
    productId={editingProduct?.id?.toString()}
    onUploadComplete={handleImageUpload}
    onImageDelete={handleImageDelete}
    existingImages={productImages}
    maxFiles={5}
    className="mt-2"
  />
</div>
```

### 2. Customer Management
```tsx
// Di dalam form customer
<div>
  <Label>Customer Avatar</Label>
  <ImageUpload
    category="customers"
    userId={customerId}
    onUploadComplete={handleAvatarUpload}
    onImageDelete={handleAvatarDelete}
    maxFiles={1}
    className="mt-2"
  />
</div>
```

### 3. Gallery Management
```tsx
// Di dalam form gallery
<div>
  <Label>Gallery Images</Label>
  <ImageUpload
    category="gallery"
    onUploadComplete={handleGalleryUpload}
    onImageDelete={handleGalleryDelete}
    existingImages={galleryImages}
    maxFiles={20}
    className="mt-2"
  />
</div>
```

## Security Features
- ✅ Admin authentication required
- ✅ File type validation
- ✅ File size validation
- ✅ Unique filename generation
- ✅ Secure file storage
- ✅ Database metadata storage

## Error Handling
- File type not allowed
- File size too large
- Upload directory not accessible
- Database connection issues
- Authentication failures

## Best Practices
1. **File Naming**: Gunakan timestamp + random string untuk menghindari konflik nama file
2. **Directory Structure**: Organisir file berdasarkan kategori dan relasi
3. **Metadata**: Selalu isi metadata gambar untuk SEO dan accessibility
4. **Validation**: Validasi file di client dan server
5. **Error Handling**: Handle error dengan user-friendly messages
6. **Cleanup**: Hapus file dari filesystem ketika record dihapus dari database

## Migration
Setelah menambahkan schema baru, jalankan:
```bash
npx prisma migrate dev --name add_image_table
npx prisma generate
```

## Dependencies
- `react-dropzone`: Untuk drag & drop upload
- `@prisma/client`: Untuk database operations
- `fs/promises`: Untuk file system operations 
