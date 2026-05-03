import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Trash2, Search } from 'lucide-react';

export default function AdminUsersTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const usersQuery = trpc.team.listUsers.useQuery();
  const banUserMutation = trpc.team.banUser.useMutation({
    onSuccess: () => {
      toast.success('Usuário banido com sucesso!');
      usersQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const filteredUsers = usersQuery.data?.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const clientUsers = filteredUsers.filter((u) => u.role === 'user');
  const staffUsers = filteredUsers.filter((u) => u.role === 'staff');
  const adminUsers = filteredUsers.filter((u) => u.role === 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      {usersQuery.isLoading ? (
        <p className="text-gray-400">Carregando usuários...</p>
      ) : (
        <div className="space-y-6">
          {/* Administradores */}
          {adminUsers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-500">
                Administradores ({adminUsers.length})
              </h3>
              <div className="space-y-2">
                {adminUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="bg-gray-900 border-gray-800 p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-red-500 mt-1">Admin</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Staff */}
          {staffUsers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-500">
                Staff ({staffUsers.length})
              </h3>
              <div className="space-y-2">
                {staffUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="bg-gray-900 border-gray-800 p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-yellow-500 mt-1">Staff</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Clientes */}
          {clientUsers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Clientes ({clientUsers.length})
              </h3>
              <div className="space-y-2">
                {clientUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="bg-gray-900 border-gray-800 p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Cadastrado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja banir este usuário?')) {
                          banUserMutation.mutate({
                            id: user.id,
                            reason: 'Banido pelo admin',
                          });
                        }
                      }}
                      disabled={banUserMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              Nenhum usuário encontrado
            </p>
          )}
        </div>
      )}
    </div>
  );
}
