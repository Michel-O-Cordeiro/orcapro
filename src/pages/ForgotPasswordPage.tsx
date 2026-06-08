import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import loginBg from '../assets/login.png'
import logoImg from '../assets/logo.png'
import { useAppStore } from '@/stores/useAppStore'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsSuccess(false)

    try {
      await useAppStore.getState().forgotPassword(email)
      setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
      setIsSuccess(true)
    } catch (error: any) {
      const errorCode = error.code
      let errorMessage = 'Ocorreu um erro ao enviar o e-mail de recuperação.'
      
      if (errorCode === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Verifique o formato.'
      } else if (errorCode === 'auth/user-not-found') {
        errorMessage = 'Nenhuma conta encontrada com este e-mail.'
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.'
      }
      
      setMessage(errorMessage)
      setIsSuccess(false)
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
              Recupere sua senha
            </CardTitle>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              Para experiências rápidas e precisas
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSuccess ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm md:text-base">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-9 sm:h-10 md:h-11"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                  >
                    Enviar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    onClick={() => navigate('/login')}
                  >
                    Voltar para login
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-green-600 text-center py-4 text-xs sm:text-sm md:text-base">{message}</p>
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    onClick={() => navigate('/login')}
                  >
                    Voltar para login
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
