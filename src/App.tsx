import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ClientsPage from './pages/ClientsPage'
import BudgetsPage from './pages/BudgetsPage'
import BudgetFormPage from './pages/BudgetFormPage'
import BudgetDetailPage from './pages/BudgetDetailPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/" element={<MainLayout />}>
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
