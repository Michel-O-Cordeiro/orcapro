import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ClientsPage from './pages/ClientsPage'
import BudgetsPage from './pages/BudgetsPage'
import BudgetFormPage from './pages/BudgetFormPage'
import BudgetDetailPage from './pages/BudgetDetailPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import RegisterPage from './pages/RegisterPage'
import { useAppStore } from './stores/useAppStore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'

function App() {
  const { user, setUser, loadClients, loadBudgets } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && isMounted) {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
            email: firebaseUser.email || ''
          })
          await loadClients()
          await loadBudgets()
        } else if (isMounted) {
          setUser(null)
        }
      } catch (error) {
        console.error('Erro na autenticação:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [setUser, loadClients, loadBudgets])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    return <>{children}</>
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="orcamentos" element={<BudgetsPage />} />
        <Route path="orcamentos/novo" element={<BudgetFormPage />} />
        <Route path="orcamentos/:id" element={<BudgetDetailPage />} />
        <Route path="orcamentos/:id/editar" element={<BudgetFormPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
