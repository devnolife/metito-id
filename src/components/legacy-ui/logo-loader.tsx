import Image from 'next/image'

export default function LogoLoader({ message = 'Memuat...', className = '' }: { message?: string, className?: string }) {
  return (
    <div className={`relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-navy ${className}`}>
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative animate-spin-slow mb-6">
        <Image src="/images/logo.png" alt="Logo" width={120} height={120} priority />
      </div>
      <span className="rail relative text-gold animate-pulse">{message}</span>
    </div>
  )
}

// tailwind.config.js: tambahkan keyframes untuk 'spin-slow' jika belum ada
// 'spin-slow': 'spin 2.5s linear infinite', 
