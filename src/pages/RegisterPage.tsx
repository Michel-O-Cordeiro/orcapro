import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/stores/useAppStore'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import loginBg from '../assets/login.png'
import logoImg from '../assets/logo.png'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)
    try {
      await useAppStore.getState().register(name, email, password)
      navigate('/')
    } catch (error: any) {
      const errorCode = error.code
      let errorMessage = 'Ocorreu um erro ao criar a conta.'
      
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está sendo usado por outra conta.'
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Verifique o formato.'
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.'
      } else if (errorCode === 'auth/operation-not-allowed') {
        errorMessage = 'Operação não permitida. Contate o suporte.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-left relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      ></div>
  
      <div className="w-full lg:w-1/2 bg-white p-2 sm:p-4 md:p-6 lg:p-8 flex items-start justify-center pt-2 sm:pt-4 md:pt-6 lg:pt-12">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center pb-1">
            <div className="flex justify-center mb-2">
              <img src={logoImg} alt="Logo OrçaPro" className="h-20 sm:h-28 md:h-36 lg:h-48" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-800 mb-1">
              Criar Conta
            </CardTitle>
            <p className="text-gray-500 text-xs sm:text-sm">
              Comece a gerenciar seus orçamentos
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs sm:text-sm">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 h-8 sm:h-9 md:h-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs sm:text-sm">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-8 sm:h-9 md:h-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs sm:text-sm">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 h-8 sm:h-9 md:h-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 h-8 sm:h-9 md:h-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center pt-1">
                <Link
                  to="/login"
                  className="text-blue-600 text-xs sm:text-sm hover:underline"
                >
                  Já tem uma conta? Entrar
                </Link>
              </div>
              {error && (
                <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
