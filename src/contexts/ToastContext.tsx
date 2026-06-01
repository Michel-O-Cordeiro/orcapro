import { createContext, useContext, useState, ReactNode } from 'react'
import { Toast } from '../components/ui/toast'

interface ToastContextType {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
  })

  const showToast = (message: string) => {
    setToast({
      isVisible: true,
      message,
    })
  }

  const hideToast = () => {
    setToast({
      isVisible: false,
      message: '',
    })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
