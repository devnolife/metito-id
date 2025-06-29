# Testing Guide - Metito ID Application

Panduan lengkap untuk testing aplikasi Metito ID. Script testing ini akan membantu Anda mengidentifikasi masalah pada API, database, dan file system.

## 🚀 Quick Start

### 1. Jalankan Semua Test
```bash
npm run test-all
```

### 2. Test Cepat API
```bash
npm run test-api-quick
```

## 📋 Available Test Commands

| Command | Description | Duration |
|---------|-------------|----------|
| `npm run test-all` | Menjalankan semua test suite | ~2-3 menit |
| `npm run test-api-quick` | Test cepat API endpoints penting | ~30 detik |
| `npm run test-api` | Test lengkap semua API endpoints | ~1-2 menit |
| `npm run test-db` | Test koneksi database dan schema | ~15 detik |
| `npm run test-fs` | Test file system dan upload directories | ~10 detik |

## 🔍 Test Categories

### 1. API Endpoints Testing (`test-api` & `test-api-quick`)

**Endpoints yang ditest:**
- ✅ Authentication (`/api/auth/*`)
  - Register, Login, Logout, Me
- ✅ Products (`/api/products`)
  - GET, POST, PUT, DELETE
- ✅ Categories (`/api/categories`)
- ✅ Services (`/api/services`)
- ✅ Blog (`/api/blog`)
- ✅ Gallery (`/api/gallery`)
- ✅ Testimonials (`/api/testimonials`)
- ✅ Certifications (`/api/certifications`)
- ✅ Contact (`/api/contact`)
- ✅ Newsletter (`/api/newsletter`)
- ✅ Cart (`/api/cart`)
- ✅ Settings (`/api/settings`)
- ✅ Upload (`/api/upload`)

**Output yang dihasilkan:**
- Status code setiap endpoint
- Response time
- Error messages (jika ada)
- Authentication status
- Detailed JSON report file

### 2. Database Testing (`test-db`)

**Yang ditest:**
- ✅ Koneksi database
- ✅ Akses ke semua tabel
- ✅ Jumlah records di setiap tabel
- ✅ Admin user existence
- ✅ Settings configuration
- ✅ Recent data

### 3. File System Testing (`test-fs`)

**Yang ditest:**
- ✅ Required directories existence
- ✅ Write permissions
- ✅ Existing uploaded files
- ✅ Disk space usage
- ✅ Placeholder files

**Directories yang dicek:**
```
public/images/
├── products/
├── gallery/
├── blog/
├── testimonials/
├── users/
public/documents/
├── products/
public/certificates/
```

## 🛠️ Prerequisites

### 1. Development Server
Pastikan server development berjalan:
```bash
npm run dev
```

### 2. Database Connection
Pastikan database terkoneksi dan migrations sudah dijalankan:
```bash
npm run db:push
# atau
npm run db:migrate
```

### 3. Environment Variables
Pastikan file `.env` sudah dikonfigurasi dengan benar.

## 📊 Understanding Test Results

### Success Indicators
- ✅ **Green checkmarks**: Test passed
- 🟢 **2xx Status codes**: API endpoints working
- 📈 **High success rate**: Overall system health

### Warning Indicators
- ⚠️ **Yellow warnings**: Non-critical issues
- 🟡 **Missing data**: Empty tables (normal for new installations)

### Error Indicators
- ❌ **Red X marks**: Test failed
- 🔴 **4xx/5xx Status codes**: API errors
- 💥 **Connection errors**: Server/database issues

## 🔧 Common Issues & Solutions

### API Test Failures

**Problem**: Server not running
```
❌ Server is not running on http://localhost:3000
```
**Solution**: 
```bash
npm run dev
```

**Problem**: Authentication failures
```
❌ 401 Unauthorized
```
**Solution**: 
```bash
npm run create-admin
```

### Database Test Failures

**Problem**: Database connection failed
```
❌ Database connection failed
```
**Solution**: 
1. Check `.env` file
2. Run `npm run db:push`
3. Check database server status

**Problem**: Missing tables
```
❌ Table 'products' does not exist
```
**Solution**: 
```bash
npm run db:migrate
```

### File System Test Failures

**Problem**: Missing directories
```
❌ public/images/products - does not exist
```
**Solution**: 
```bash
npm run setup-dirs
```

**Problem**: Permission denied
```
❌ Write permissions - Failed
```
**Solution**: Check folder permissions

## 📄 Test Reports

### Detailed Reports
Test lengkap akan menghasilkan file report:
```
scripts/api-test-report-[timestamp].json
```

### Report Contents
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "summary": {
    "total": 25,
    "passed": 23,
    "failed": 2,
    "successRate": 92.0
  },
  "results": [...]
}
```

## 🎯 Best Practices

### 1. Regular Testing
Jalankan test secara berkala:
- Setelah perubahan code
- Sebelum deployment
- Saat troubleshooting

### 2. Test Order
Recommended testing sequence:
1. `npm run test-fs` - Check file system first
2. `npm run test-db` - Verify database
3. `npm run test-api-quick` - Quick API check
4. `npm run test-api` - Full API test (if needed)

### 3. Development Workflow
```bash
# Start development
npm run dev

# Quick health check
npm run test-api-quick

# Full system check
npm run test-all
```

## 🚨 Troubleshooting

### Server Issues
1. Check if port 3000 is available
2. Verify `.env` configuration
3. Check for compilation errors

### Database Issues
1. Verify database server is running
2. Check connection string in `.env`
3. Run database migrations
4. Seed initial data if needed

### File Upload Issues
1. Check directory permissions
2. Verify disk space
3. Test file upload API directly

## 📞 Support

Jika masih mengalami masalah:
1. Jalankan `npm run test-all` untuk diagnostic lengkap
2. Check individual test reports
3. Review error messages carefully
4. Verify all prerequisites are met

---

**Happy Testing! 🧪✨** 
