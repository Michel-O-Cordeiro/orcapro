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
        className="hidden md:block md:w-1/2 bg-cover bg-left relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      ></div>
  
      <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-6">
              <img src={logoImg} alt="Logo OrçaPro" className="h-40 sm:h-48 md:h-60" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              Criar Conta
            </CardTitle>
            <p className="text-gray-500 text-sm sm:text-base">
              Comece a gerenciar seus orçamentos
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 sm:h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="text-blue-600 text-sm sm:text-base hover:underline"
                >
                  Já tem uma conta? Entrar
                </Link>
              </div>
              {error && (
                <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-base"
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
