import { create } from 'zustand'
import { User, Client, Budget } from '@/types'

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'João Pereira',
    email: 'joao@exemplo.com',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 456 - São Paulo',
    createdAt: new Date('2024-02-20'),
  },
]

const mockBudgets: Budget[] = [
  {
    id: '1',
    clientId: '1',
    title: 'Reforma de Cozinha',
    description: 'Instalação de armários e piso',
    items: [
      { id: '1', description: 'Armários de MDF', quantity: 5, unitPrice: 800 },
      { id: '2', description: 'Piso cerâmico', quantity: 20, unitPrice: 150 },
    ],
    status: 'sent',
    total: 7000,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    clientId: '2',
    title: 'Instalação Elétrica',
    description: 'Troca de fiação e tomadas',
    items: [
      { id: '1', description: 'Fiação 2,5mm', quantity: 100, unitPrice: 5 },
      { id: '2', description: 'Tomadas', quantity: 15, unitPrice: 25 },
    ],
    status: 'approved',
    total: 875,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-12'),
  },
]

export interface AppState {
  theme: 'light' | 'dark'
  user: User | null
  isLoading: boolean
  clients: Client[]
  budgets: Budget[]
  toggleTheme: () => void
  setUser: (user: User | null) => void
  logout: () => void
  setIsLoading: (isLoading: boolean) => void
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  updateBudgetStatus: (id: string, status: Budget['status']) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  user: null,
  isLoading: false,
  clients: mockClients,
  budgets: mockBudgets,

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setIsLoading: (isLoading) => set({ isLoading }),

  addClient: (clientData) => set((state) => ({
    clients: [...state.clients, {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }],
  })),

  updateClient: (id, clientData) => set((state) => ({
    clients: state.clients.map((client) =>
      client.id === id ? { ...client, ...clientData } : client
    ),
  })),

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((client) => client.id !== id),
  })),

  addBudget: (budgetData) => set((state) => ({
    budgets: [...state.budgets, {
      ...budgetData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),

  updateBudget: (id, budgetData) => set((state) => ({
    budgets: state.budgets.map((budget) =>
      budget.id === id ? { ...budget, ...budgetData, updatedAt: new Date() } : budget
    ),
  })),

  deleteBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((budget) => budget.id !== id),
  })),

  updateBudgetStatus: (id, status) => set((state) => ({
    budgets: state.budgets.map((budget) =>
      budget.id === id ? { ...budget, status, updatedAt: new Date() } : budget
    ),
  })),
}))
