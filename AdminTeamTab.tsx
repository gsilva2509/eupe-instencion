import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

export default function AdminTeamTab() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const staffQuery = trpc.team.listStaff.useQuery();
  const createStaffMutation = trpc.team.createStaff.useMutation({
    onSuccess: () => {
      toast.success('Staff criado com sucesso!');
      setFormData({ name: '', email: '' });
      setShowForm(false);
      staffQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteStaffMutation = trpc.team.deleteStaff.useMutation({
    onSuccess: () => {
      toast.success('Staff removido com sucesso!');
      staffQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Preencha todos os campos');
      return;
    }
    await createStaffMutation.mutateAsync(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Equipe</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 hover:bg-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Staff
        </Button>
      </div>

      {/* Formulário de Adicionar Staff */}
      {showForm && (
        <Card className="bg-gray-900 border-red-500/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do staff"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createStaffMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                {createStaffMutation.isPending ? 'Criando...' : 'Criar Staff'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de Staff */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Staff Ativo ({staffQuery.data?.length || 0})</h3>
        {staffQuery.isLoading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : staffQuery.data && staffQuery.data.length > 0 ? (
          <div className="space-y-2">
            {staffQuery.data.map((staff) => (
              <Card key={staff.id} className="bg-gray-900 border-gray-800 p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{staff.name}</p>
                  <p className="text-sm text-gray-400">{staff.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja remover este staff?')) {
                      deleteStaffMutation.mutate({ id: staff.id });
                    }
                  }}
                  disabled={deleteStaffMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Nenhum staff adicionado ainda</p>
        )}
      </div>
    </div>
  );
}
