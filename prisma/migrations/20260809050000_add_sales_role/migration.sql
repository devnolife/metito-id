-- Menambah peran SALES pada enum UserRole.
-- Bersifat aditif: seluruh user yang ada tetap ADMIN/CUSTOMER dan tidak berubah.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SALES';
