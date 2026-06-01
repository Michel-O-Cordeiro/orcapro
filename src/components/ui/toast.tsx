import { useEffect } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-in">
      <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg shadow-lg opacity-90 backdrop-blur-sm">
        <p className="font-medium">{message}</p>
      </div>
    </div>
  )
}
