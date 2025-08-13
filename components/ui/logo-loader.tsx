import Image from 'next/image'

export default function LogoLoader({ message = 'Memuat...', className = '' }: { message?: string, className?: string }) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-white ${className}`}>
      <div className="animate-spin-slow mb-6">
        <Image src="/images/logo.png" alt="Logo" width={120} height={120} priority />
      </div>
      <span className="text-lg text-gray-700 font-semibold animate-pulse">{message}</span>
    </div>
  )
}

// tailwind.config.js: tambahkan keyframes untuk 'spin-slow' jika belum ada
// 'spin-slow': 'spin 2.5s linear infinite', 
