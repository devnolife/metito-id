# Admin Authentication Flow

## Overview
Sistem autentikasi admin telah diperbarui untuk memberikan pengalaman yang lebih baik dengan validasi otomatis dan redirect yang tepat.

## Struktur Halaman

### 1. `/admin` - Halaman Utama Admin
- **Fungsi**: Menangani login dan dashboard dalam satu halaman
- **Behavior**:
  - Jika user sudah login dan memiliki role ADMIN → tampilkan dashboard
  - Jika user belum login atau bukan ADMIN → tampilkan form login
  - Jika login berhasil → tampilkan dashboard

### 2. `/admin/login` - Halaman Login Terpisah
- **Fungsi**: Halaman login khusus untuk admin
- **Behavior**:
  - Jika user sudah login dan memiliki role ADMIN → redirect ke `/admin` atau halaman yang diminta
  - Jika user belum login → tampilkan form login
  - Jika login berhasil → redirect ke halaman yang diminta atau `/admin`

## Flow Autentikasi

### Login Process
1. User mengakses `/admin` atau `/admin/login`
2. Sistem mengecek status autentikasi:
   - Jika sudah login dan ADMIN → langsung ke dashboard
   - Jika belum login → tampilkan form login
3. User mengisi form login
4. Sistem memvalidasi credentials
5. Jika berhasil:
   - Token disimpan di localStorage
   - User data disimpan di localStorage
   - Redirect ke dashboard atau halaman yang diminta

### Logout Process
1. User klik logout
2. Sistem memanggil `/api/auth/logout`
3. Cookies dibersihkan (dengan `expires: new Date(0)`)
4. localStorage dibersihkan
5. sessionStorage dibersihkan
6. Force redirect ke `/admin/login`

### Token Expiration
- JWT token berlaku 12 jam
- Cookies juga expired setelah 12 jam
- Jika token expired, user akan diarahkan ke login

## Keamanan

### Middleware Protection
- Semua halaman admin (kecuali `/admin` dan `/admin/login`) dilindungi middleware
- API routes admin dilindungi middleware
- Token validation di setiap request

### Cookie Security
- `auth-token`: HTTP-only cookie untuk keamanan
- `auth-status`: Client-readable cookie untuk status UI
- Secure flag di production
- SameSite: 'lax' untuk compatibility

## Error Handling

### Network Errors
- Toast notification untuk error jaringan
- Fallback ke login form
- Clear semua data auth pada error

### Invalid Token
- Automatic redirect ke login
- Clear semua stored data
- Force page reload untuk memastikan cleanup

## Development Tips

### Testing Login
1. Buka `/admin` atau `/admin/login`
2. Login dengan credentials admin
3. Cek localStorage untuk token
4. Refresh halaman untuk test persistence

### Testing Logout
1. Login sebagai admin
2. Klik logout
3. Cek bahwa semua data terhapus
4. Coba akses halaman admin (harus redirect ke login)

### Manual Cache Clear
Jika ada masalah dengan auth, jalankan script ini di browser console:
```javascript
// Clear all auth data
localStorage.removeItem('authToken')
localStorage.removeItem('adminUser')
sessionStorage.clear()
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
})
window.location.reload()
```

## File Structure
```
app/admin/
├── page.tsx              # Main admin page (login + dashboard)
├── login/
│   └── page.tsx          # Separate login page
├── layout.tsx            # Admin layout with sidebar
└── [other pages]/

components/admin/
├── admin-login.tsx       # Login form component
└── [other components]/

lib/
├── auth.ts               # JWT utilities
└── auth-context.tsx      # Auth context provider

middleware.ts             # Route protection
``` 
