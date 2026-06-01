import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, FileText, LogOut } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import type { AppState } from '@/stores/useAppStore'
import { useEffect } from 'react'

export default function MainLayout() {
  const theme = useAppStore((state: AppState) => state.theme)
  const toggleTheme = useAppStore((state: AppState) => state.toggleTheme)
  const user = useAppStore((state: AppState) => state.user)
  const logout = useAppStore((state: AppState) => state.logout)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        <nav className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4 lg:space-x-8">
                <Link to="/" className="text-xl font-bold text-primary">
                  OrçaPro
                </Link>
                <div className="flex space-x-2 lg:space-x-6">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActive('/') 
                        ? 'bg-accent text-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  <Link
                    to="/clientes"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActive('/clientes') 
                        ? 'bg-accent text-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden lg:inline">Clientes</span>
                  </Link>
                  <Link
                    to="/orcamentos"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActive('/orcamentos') 
                        ? 'bg-accent text-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden lg:inline">Orçamentos</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Olá, {user.name}
                </span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md bg-muted hover:bg-accent transition-colors"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
