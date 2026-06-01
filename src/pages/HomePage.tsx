import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { Users, FileText, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  const { clients, budgets } = useAppStore()
  
  const totalBudgets = budgets.length
  const approvedBudgets = budgets.filter(b => b.status === 'approved').length
  const approvalRate = totalBudgets > 0 ? Math.round((approvedBudgets / totalBudgets) * 100) : 0
  const totalRevenue = budgets.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.total, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/orcamentos/novo">Novo Orçamento</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Orçamentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBudgets}</div>
            <p className="text-xs text-muted-foreground">
              +1 novo esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Aprovados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedBudgets}</div>
            <p className="text-xs text-muted-foreground">
              {approvalRate}% de aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Somente orçamentos aprovados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Últimos Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Não tem orçamentos no momento
                </p>
              ) : (
                budgets.slice().reverse().slice(0, 5).map((budget) => {
                  const client = clients.find(c => c.id === budget.clientId)
                  return (
                    <div key={budget.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-2">
                      <div>
                        <p className="font-medium">{budget.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {client?.name} • R$ {budget.total.toLocaleString('pt-BR')}
                        </p>
                      </div>
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
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Últimos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Não tem clientes no momento
                </p>
              ) : (
                clients.slice().reverse().slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
