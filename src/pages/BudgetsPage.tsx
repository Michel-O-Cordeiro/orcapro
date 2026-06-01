import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/stores/useAppStore'
import { useToast } from '../contexts/ToastContext'
import { ConfirmModal } from '../components/ConfirmModal'
import type { Budget } from '@/types'
import { FileText, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react'

export default function BudgetsPage() {
  const { budgets, clients, deleteBudget, updateBudgetStatus } = useAppStore()
  const { showToast } = useToast()
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; budget: Budget | null }>({
    open: false,
    budget: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteModal.budget) return
    setIsDeleting(true)
    try {
      await deleteBudget(deleteModal.budget.id)
      showToast('Orçamento excluído com sucesso!')
      setDeleteModal({ open: false, budget: null })
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
        <Button asChild>
          <Link to="/orcamentos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ainda não tem orçamentos cadastrados</h3>
            <p className="text-muted-foreground">Clique em "Novo Orçamento" no canto superior direito para criar o primeiro</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const client = clients.find(c => c.id === budget.clientId)
            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{budget.title}</CardTitle>
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
                  <CardDescription>
                    {client?.name} • Criado em {budget.createdAt.toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      R$ {budget.total.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {budget.items.length} item(s)
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orcamentos/${budget.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orcamentos/${budget.id}/editar`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    {budget.status === 'sent' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => await updateBudgetStatus(budget.id, 'approved')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1 text-success" />
                          Aprovar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => await updateBudgetStatus(budget.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4 mr-1 text-destructive" />
                          Recusar
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModal({ open: true, budget })}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir este orçamento? (${deleteModal.budget?.title})`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, budget: null })}
        isLoading={isDeleting}
      />
    </div>
  )
}
