# 📸 Panduan Upload Multiple Images untuk Produk

## ✅ Fitur Multiple Images Sudah Aktif!

Sistem sudah mendukung **unlimited multiple images per produk** dengan fitur lengkap.

---

## 🎯 Halaman yang Mendukung Multiple Images

### 1. **Halaman Create Product** (`/admin/products` → Tambah Produk)
- ✅ Upload multiple images sekaligus
- ✅ Drag & drop support
- ✅ Preview grid dengan thumbnail
- ✅ Reorder gambar (kiri/kanan)
- ✅ Remove individual image
- ✅ Primary image indicator

### 2. **Halaman Edit Product** (`/admin/products/[id]/edit`)
- ✅ Semua fitur dari Create Product
- ✅ Load existing images
- ✅ Add more images ke existing
- ✅ Remove images dari existing

### 3. **Halaman Detail Product** (`/admin/products/[id]`) ⭐ BARU DITINGKATKAN
- ✅ Grid view semua gambar
- ✅ Responsive layout (2-3-4 kolom)
- ✅ Lightbox modal untuk view full size
- ✅ Navigate between images (prev/next)
- ✅ Primary badge untuk gambar utama
- ✅ Image counter (#1, #2, #3...)
- ✅ Hover effects dengan scale
- ✅ Empty state informatif
- ✅ Image count badge

---

## 📝 Cara Menggunakan

### **Upload Multiple Images:**

1. **Buka form Create/Edit Product**
2. **Scroll ke section "Gambar Produk"**
3. **Klik area upload atau drag & drop**
4. **Pilih MULTIPLE gambar** (Ctrl+Click atau Shift+Click)
5. **Wait** hingga semua gambar selesai diupload
6. **Lihat preview** semua gambar dalam grid

### **Manage Images:**

#### **Reorder Images:**
- Gunakan tombol **panah kiri** (←) untuk pindah ke kiri
- Gunakan tombol **panah kanan** (→) untuk pindah ke kanan
- Gambar pertama = **Primary Image** (gambar utama)

#### **Remove Images:**
- Hover ke gambar yang ingin dihapus
- Klik tombol **X merah** di pojok kanan atas

#### **View Full Size (Detail Page):**
- **Klik gambar** untuk membuka lightbox modal
- Gunakan tombol **"← Sebelumnya"** atau **"Selanjutnya →"**
- Tekan **ESC** atau klik di luar untuk tutup

---

## 🎨 UI/UX Features

### **Detail Page Enhancements:**

```tsx
✅ Responsive Grid
   - Mobile: 2 kolom
   - Tablet: 3 kolom  
   - Desktop: 4 kolom

✅ Interactive Effects
   - Hover: Scale 110%
   - Border: Blue on hover
   - Shadow: Elevated on hover
   - Overlay: Dark with Maximize icon

✅ Badges & Indicators
   - "Gambar Utama" badge (blue)
   - "#1, #2, #3" counter (black)
   - "X Gambar" count badge (header)

✅ Lightbox Modal
   - Full image preview
   - Navigation buttons
   - Image counter
   - Primary badge
   - Close with ESC

✅ Empty State
   - Icon placeholder
   - Informative message
   - Dashed border
```

---

## 💾 Database Schema

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  images      String[] @default([])  // ← Array of image URLs
  // ...other fields
}
```

**Contoh Data:**
```json
{
  "id": "abc123",
  "name": "RO System 1000 LPH",
  "images": [
    "/images/products/ro-system-main.jpg",     // Primary image
    "/images/products/ro-system-side.jpg",
    "/images/products/ro-system-detail.jpg",
    "/images/products/ro-system-control.jpg"
  ]
}
```

---

## 🔧 Technical Details

### **File Upload:**
- **Max file size:** 5MB per image
- **Allowed formats:** JPG, PNG, GIF, WEBP
- **Storage:** `/public/images/products/`
- **URL format:** `/images/products/{timestamp}_{random}.{ext}`

### **Components Used:**
- `ProductForm` - Form with upload
- `FileUpload` - Upload handler
- `Image` (Next.js) - Optimized images
- `Dialog` - Lightbox modal
- `Badge` - Indicators

### **API Endpoints:**
- `POST /api/upload` - Upload single file
- `POST /api/products` - Create with images
- `PUT /api/products/[id]` - Update with images
- `GET /api/products/[id]` - Get with images

---

## 🚀 Performance

### **Optimizations:**
- ✅ Next.js Image component (auto optimization)
- ✅ Lazy loading
- ✅ Responsive images
- ✅ WebP format support
- ✅ CDN ready

### **Loading States:**
- Upload progress indicator
- Skeleton placeholders
- Smooth transitions

---

## 📱 Responsive Design

| Device | Grid Columns | Image Size |
|--------|-------------|-----------|
| Mobile | 2 kolom | Square |
| Tablet | 3 kolom | Square |
| Desktop | 4 kolom | Square |
| Lightbox | Full width | Contain |

---

## 🎯 Best Practices

### **Image Guidelines:**

1. **Resolution:**
   - Minimum: 800x800px
   - Recommended: 1200x1200px
   - Maximum: 4000x4000px

2. **Aspect Ratio:**
   - Preferably: 1:1 (square)
   - System will crop to fit

3. **File Size:**
   - Keep under 2MB per image
   - Compress before upload

4. **Naming:**
   - Use descriptive names
   - System auto-renames on upload

5. **Order:**
   - First image = Primary/Featured
   - Use best quality for first image

### **How Many Images?**

| Product Type | Recommended Images |
|-------------|-------------------|
| Simple Product | 2-4 images |
| Complex Product | 4-8 images |
| System/Plant | 6-12 images |

**Show:**
- Front view (primary)
- Side/back views
- Detail shots
- Control panel
- Installation examples
- Application scenarios

---

## 🐛 Troubleshooting

### **Images not uploading?**
- Check file size (max 5MB)
- Check file format (JPG, PNG, GIF, WEBP)
- Check internet connection
- Check browser console for errors

### **Images not showing?**
- Check URL in database
- Check file exists in `/public/images/products/`
- Clear browser cache
- Check image permissions

### **Modal not opening?**
- Check browser console
- Check Dialog component installed
- Clear cache and reload

---

## 📞 Support

Jika ada masalah atau pertanyaan, silakan hubungi:
- **Developer:** Tim Development
- **Documentation:** README.md
- **Repository:** GitHub

---

**Last Updated:** October 8, 2025
**Version:** 2.0.0
