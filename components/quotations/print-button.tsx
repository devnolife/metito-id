'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Memicu dialog cetak browser, yang juga menyediakan "Save as PDF". */
export function PrintButton({ className }: { className?: string }) {
  return (
    <Button onClick={() => window.print()} className={className}>
      <Printer className="mr-2 h-4 w-4" />
      Unduh PDF
    </Button>
  )
}
