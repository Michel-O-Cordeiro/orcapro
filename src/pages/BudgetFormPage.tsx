import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/stores/useAppStore'
import type { Budget, BudgetItem } from '@/types'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'

export default function BudgetFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { budgets, clients, addBudget, updateBudget } = useAppStore()
  const isEditing = !!id

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      updateBudget(id!, formData)
    } else {
      addBudget(formData)
    }
    navigate('/orcamentos')
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
        <h1 className="text-3xl font-bold tracking-tight">
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
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="title">Título do Orçamento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="lg:col-span-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="draft">Rascunho</option>
              <option value="sent">Enviado</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
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
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Ex: Instalação de piso"
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <Label>Preço Unitário (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    required
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
          <Button type="button" variant="secondary" asChild>
            <Link to="/orcamentos">Cancelar</Link>
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Salvar Alterações' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </div>
  )
}
