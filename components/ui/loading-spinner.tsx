import LogoLoader from './logo-loader'

interface LoadingSpinnerProps {
  message?: string
  className?: string
}

export function LoadingSpinner({ message = 'Memuat...', className = '' }: LoadingSpinnerProps) {
  return <LogoLoader message={message} className={className} />
} 
