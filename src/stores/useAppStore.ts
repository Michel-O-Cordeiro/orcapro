import { create } from 'zustand'
import { User, Client, Budget } from '@/types'
import { auth, db } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'

export interface AppState {
  theme: 'light' | 'dark'
  user: User | null
  isLoading: boolean
  clients: Client[]
  budgets: Budget[]
  toggleTheme: () => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  setUser: (user: User | null) => void
  loadClients: () => Promise<void>
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>
  updateClient: (id: string, client: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  loadBudgets: () => Promise<void>
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
  updateBudgetStatus: (id: string, status: Budget['status']) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'light',
  user: null,
  isLoading: false,
  clients: [],
  budgets: [],

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  setUser: (user) => set({ user }),

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      set({
        user: {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
          email: firebaseUser.email || ''
        },
        isLoading: false
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    await signOut(auth)
    set({ user: null, clients: [], budgets: [] })
  },

  forgotPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true })
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      set({
        user: {
          id: userCredential.user.uid,
          name,
          email
        },
        isLoading: false
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  loadClients: async () => {
    const { user } = get()
    if (!user) return
    
    try {
      const q = query(collection(db, 'clients'), where('userId', '==', user.id))
      const querySnapshot = await getDocs(q)
      const clients: Client[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Client))
      set({ clients })
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    }
  },

  addClient: async (clientData) => {
    const { user } = get()
    if (!user) return
    
    const docRef = await addDoc(collection(db, 'clients'), {
      ...clientData,
      userId: user.id,
      createdAt: serverTimestamp()
    })
    
    const newClient: Client = {
      ...clientData,
      id: docRef.id,
      createdAt: new Date()
    }
    
    set((state) => ({ clients: [...state.clients, newClient] }))
  },

  updateClient: async (id, clientData) => {
    await updateDoc(doc(db, 'clients', id), clientData)
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...clientData } : client
      )
    }))
  },

  deleteClient: async (id) => {
    await deleteDoc(doc(db, 'clients', id))
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id)
    }))
  },

  loadBudgets: async () => {
    const { user } = get()
    if (!user) return
    
    try {
      const q = query(collection(db, 'budgets'), where('userId', '==', user.id))
      const querySnapshot = await getDocs(q)
      const budgets: Budget[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Budget))
      set({ budgets })
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error)
    }
  },

  addBudget: async (budgetData) => {
    const { user } = get()
    if (!user) return
    
    const docRef = await addDoc(collection(db, 'budgets'), {
      ...budgetData,
      userId: user.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    const newBudget: Budget = {
      ...budgetData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    set((state) => ({ budgets: [...state.budgets, newBudget] }))
  },

  updateBudget: async (id, budgetData) => {
    await updateDoc(doc(db, 'budgets', id), {
      ...budgetData,
      updatedAt: serverTimestamp()
    })
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...budgetData, updatedAt: new Date() } : budget
      )
    }))
  },

  deleteBudget: async (id) => {
    await deleteDoc(doc(db, 'budgets', id))
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id)
    }))
  },

  updateBudgetStatus: async (id, status) => {
    await updateDoc(doc(db, 'budgets', id), {
      status,
      updatedAt: serverTimestamp()
    })
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, status, updatedAt: new Date() } : budget
      )
    }))
  }
}))
