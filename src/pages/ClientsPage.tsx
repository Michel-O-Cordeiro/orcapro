import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/stores/useAppStore'
import { useToast } from '../contexts/ToastContext'
import { ConfirmModal } from '../components/ConfirmModal'
import type { Client } from '@/types'
import { Users, Plus, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react'

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useAppStore()
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    let formatted = numbers
    
    if (numbers.length > 0) {
      formatted = '(' + numbers.substring(0, 2)
    }
    if (numbers.length > 2) {
      formatted += ') ' + numbers.substring(2, 7)
    }
    if (numbers.length > 7) {
      formatted += '-' + numbers.substring(7, 11)
    }
    
    return formatted
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '')
    return numbers.length === 11
  }

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value
    
    if (field === 'phone') {
      processedValue = formatPhone(value)
    }
    
    if (field === 'name') {
      processedValue = value.substring(0, 20)
    }
    
    setFormData({ ...formData, [field]: processedValue })
    
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido (use o formato: (99) 99999-9999)'
    }
    
    if (newErrors.name || newErrors.email || newErrors.phone) {
      setErrors(newErrors)
      return
    }
    
    setIsSaving(true)
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData)
        showToast('Cliente atualizado com sucesso!')
      } else {
        await addClient(formData)
        showToast('Cliente criado com sucesso!')
      }
      setIsModalOpen(false)
      setEditingClient(null)
      setFormData({ name: '', email: '', phone: '', address: '' })
      setErrors({ name: '', email: '', phone: '' })
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: formatPhone(client.phone),
      address: client.address || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteModal.client) return
    setIsSaving(true)
    try {
      await deleteClient(deleteModal.client.id)
      showToast('Cliente excluído com sucesso!')
      setDeleteModal({ open: false, client: null })
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ainda não tem clientes cadastrados</h3>
            <p className="text-muted-foreground">Clique em "Novo Cliente" no canto superior direito para adicionar o primeiro</p>
          </div>
        ) : (
          clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteModal({ open: true, client })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Cliente desde {client.createdAt.toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                {client.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{client.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Máximo 20 caracteres"
                    maxLength={20}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="exemplo@dominio.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(99) 99999-9999"
                    maxLength={15}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Endereço (opcional)</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingClient(null)
                    }}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      editingClient ? 'Salvar Alterações' : 'Criar Cliente'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir este cliente? (${deleteModal.client?.name})`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, client: null })}
        isLoading={isSaving}
      />
    </div>
  )
}
