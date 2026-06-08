import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/stores/useAppStore'
import { ArrowLeft, Edit, Trash2, Printer } from 'lucide-react'

export default function BudgetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { budgets, clients, deleteBudget, updateBudgetStatus } = useAppStore()

  const budget = budgets.find(b => b.id === id)
  const client = budget ? clients.find(c => c.id === budget.clientId) : null

  if (!budget) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Orçamento não encontrado</h1>
        <Button asChild>
          <Link to="/orcamentos">Voltar para Orçamentos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/orcamentos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{budget.title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button asChild>
            <Link to={`/orcamentos/${budget.id}/editar`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteBudget(budget.id)
              navigate('/orcamentos')
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Orçamento</CardTitle>
            <CardDescription>
              Criado em {budget.createdAt.toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Status</h3>
              <Badge variant={
                budget.status === 'approved' ? 'success' :
                budget.status === 'rejected' ? 'destructive' :
                budget.status === 'sent' ? 'warning' : 'secondary'
              }>
                {budget.status === 'draft' ? 'Rascunho' :
                 budget.status === 'sent' ? 'Enviado' :
                 budget.status === 'approved' ? 'Aprovado' : 'Recusado'}
              </Badge>
            </div>

            <div>
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-muted-foreground">{budget.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Itens</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Descrição</th>
                      <th className="px-4 py-2 text-right">Qtd</th>
                      <th className="px-4 py-2 text-right">Preço Unitário</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.description}</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">
                          R$ {item.unitPrice.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right font-bold">Total</td>
                      <td className="px-4 py-2 text-right font-bold">
                        R$ {budget.total.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {budget.status === 'sent' && (
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => updateBudgetStatus(budget.id, 'approved')}
                >
                  Aprovar Orçamento
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateBudgetStatus(budget.id, 'rejected')}
                >
                  Recusar Orçamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            {client && (
              <div className="space-y-2">
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
                {client.address && (
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
