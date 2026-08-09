-- Menambah peran MAGANG pada enum UserRole.
--
-- Peran terbatas untuk mahasiswa/magang: hanya boleh mengisi Log Aktivitas.
-- Bersifat aditif; seluruh user yang ada tidak berubah.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MAGANG';
