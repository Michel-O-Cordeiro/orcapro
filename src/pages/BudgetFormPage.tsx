import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/stores/useAppStore'
import { useToast } from '../contexts/ToastContext'
import type { Budget, BudgetItem } from '@/types'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'

export default function BudgetFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { budgets, clients, addBudget, updateBudget } = useAppStore()
  const { showToast } = useToast()
  const isEditing = !!id
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({
    clientId: '',
    title: '',
    description: '',
    status: '',
    items: '',
    itemPrices: '' as string | null,
  })

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    items: [] as BudgetItem[],
    status: 'draft' as Budget['status'],
    total: 0,
  })

  useEffect(() => {
    if (isEditing) {
      const budget = budgets.find(b => b.id === id)
      if (budget) {
        setFormData(budget)
      }
    }
  }, [id, budgets, isEditing])

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
      }],
    })
  }

  const updateItem = (index: number, field: keyof BudgetItem, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    
    setFormData({ ...formData, items: updatedItems, total })
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    setFormData({ ...formData, items: updatedItems, total })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      clientId: '',
      title: '',
      description: '',
      status: '',
      items: '',
      itemPrices: null as string | null,
    }
    
    if (!formData.clientId.trim()) {
      newErrors.clientId = 'Selecione um cliente'
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título do orçamento é obrigatório'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }
    
    if (!formData.status.trim()) {
      newErrors.status = 'Selecione um status'
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'Adicione pelo menos 1 item ao orçamento'
    }
    
    const hasZeroPriceItem = formData.items.some(item => item.unitPrice <= 0)
    if (hasZeroPriceItem) {
      newErrors.itemPrices = 'Todos os itens devem ter preço maior que 0'
    }
    
    const hasZeroQuantityItem = formData.items.some(item => item.quantity < 1)
    if (hasZeroQuantityItem) {
      newErrors.itemPrices = newErrors.itemPrices || 'Todos os itens devem ter quantidade maior que 0'
    }
    
    const hasEmptyDescriptionItem = formData.items.some(item => !item.description.trim())
    if (hasEmptyDescriptionItem) {
      newErrors.itemPrices = newErrors.itemPrices || 'Todos os itens devem ter descrição'
    }
    
    setErrors(newErrors)
    if (Object.values(newErrors).some(err => err)) {
      return
    }
    
    setIsSaving(true)
    try {
      if (isEditing) {
        await updateBudget(id!, formData)
        showToast('Orçamento atualizado com sucesso!')
      } else {
        await addBudget(formData)
        showToast('Orçamento criado com sucesso!')
      }
      navigate('/orcamentos')
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link to="/orcamentos">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Label htmlFor="clientId">Cliente</Label>
            <select
              id="clientId"
              value={formData.clientId}
              onChange={(e) => {
                setFormData({ ...formData, clientId: e.target.value })
                if (errors.clientId) setErrors({ ...errors, clientId: '' })
              }}
              className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-foreground bg-background ${errors.clientId ? 'border-red-500 ring-red-500' : 'border-input focus-visible:ring-ring'}`}
            >
              <option value="" className="bg-popover text-popover-foreground">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id} className="bg-popover text-popover-foreground">
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>}
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="title">Título do Orçamento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="lg:col-span-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value as any })
                if (errors.status) setErrors({ ...errors, status: '' })
              }}
              className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-foreground bg-background ${errors.status ? 'border-red-500 ring-red-500' : 'border-input focus-visible:ring-ring'}`}
            >
              <option value="draft" className="bg-popover text-popover-foreground">Rascunho</option>
              <option value="sent" className="bg-popover text-popover-foreground">Enviado</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) setErrors({ ...errors, description: '' })
              }}
              className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Itens do Orçamento</CardTitle>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={item.id} className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-12 items-end">
                <div className="col-span-2 md:col-span-4 lg:col-span-5">
                  <Label>Descrição</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => {
                      updateItem(index, 'description', e.target.value)
                      if (errors.itemPrices) setErrors({ ...errors, itemPrices: null })
                    }}
                    placeholder="Ex: Instalação de piso"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      updateItem(index, 'quantity', parseInt(e.target.value) || 1)
                      if (errors.itemPrices) setErrors({ ...errors, itemPrices: null })
                    }}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <Label>Preço Uni. (R$)</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => {
                      updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                      if (errors.itemPrices) setErrors({ ...errors, itemPrices: null })
                    }}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <p className="text-sm font-medium whitespace-nowrap">
                    R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {(errors.items || errors.itemPrices) && (
              <p className="text-red-500 text-sm">
                {errors.items || errors.itemPrices}
              </p>
            )}

            {formData.items.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Nenhum item adicionado. Clique em "Adicionar Item" para começar.
              </p>
            )}

            {formData.items.length > 0 && (
              <div className="border-t pt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {formData.total.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" asChild disabled={isSaving}>
            <Link to="/orcamentos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Salvando...</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Salvar Alterações' : 'Criar Orçamento'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
