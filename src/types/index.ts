export interface User {
  id: string
  name: string
  email: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  createdAt: Date
}

export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected'

export interface BudgetItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Budget {
  id: string
  clientId: string
  title: string
  description: string
  items: BudgetItem[]
  status: BudgetStatus
  total: number
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ThemeMode {
  mode: 'light' | 'dark'
}
