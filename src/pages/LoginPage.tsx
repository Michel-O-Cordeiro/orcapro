import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/stores/useAppStore'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import loginBg from '../assets/login.png'
import logoImg from '../assets/logo.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await useAppStore.getState().login(email, password)
      navigate('/')
    } catch (error: any) {
      const errorCode = error.code
      let errorMessage = 'E-mail ou senha incorretos.'
      
      if (errorCode === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Verifique o formato.'
      } else if (errorCode === 'auth/user-disabled') {
        errorMessage = 'Esta conta foi desativada.'
      } else if (errorCode === 'auth/user-not-found') {
        errorMessage = 'Nenhuma conta encontrada com este e-mail.'
      } else if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta. Tente novamente.'
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.'
      } else if (errorCode === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas. Verifique e-mail e senha.'
      }
      
      setError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex">

      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-left relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
      </div>
  
      <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="Logo OrçaPro" className="h-28 sm:h-36 md:h-44 lg:h-60" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
              Bem-vindo de volta
            </CardTitle>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              Para experiências rápidas e precisas
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm md:text-base">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-9 sm:h-10 md:h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm md:text-base">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="123456"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-9 sm:h-10 md:h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <Link
                  to="/register"
                  className="text-blue-600 text-xs sm:text-sm md:text-base hover:underline"
                >
                  Criar conta
                </Link>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 text-xs sm:text-sm md:text-base hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              {error && (
                <p className="text-red-500 text-xs sm:text-sm md:text-base text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 md:h-11 text-sm md:text-base"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
