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
      {/* Imagem de fundo - apenas em telas grandes (md+) */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-left relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
      </div>
      {/* Formulário - ocupa 100% da tela em mobile, 50% em telas grandes */}
      <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-6">
              <img src={logoImg} alt="Logo OrçaPro" className="h-40 sm:h-48 md:h-60" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              Recupere sua senha
            </CardTitle>
            <p className="text-gray-500 text-sm sm:text-base">
              Para experiências rápidas e precisas
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isSuccess ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-10 sm:h-11"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-base"
                  >
                    Enviar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-10 sm:h-11 text-base"
                    onClick={() => navigate('/login')}
                  >
                    Voltar para login
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-green-600 text-center py-4 text-sm sm:text-base">{message}</p>
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-base"
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
