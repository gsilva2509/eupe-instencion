import { useState, useMemo } from 'react';
import { Search, Filter, Download, Trash2, Eye, EyeOff, Bell, MessageCircle, ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

interface NotificationItem {
  id: string;
  type: 'new_message' | 'new_order' | 'new_review' | 'user_banned' | 'other';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationHistory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Buscar notificações
  const { data: notificationsData } = trpc.notificationsRealtime.listRecent.useQuery(
    { limit: 1000 },
    { enabled: user?.role === 'admin' }
  );

  // Filtrar e buscar notificações
  const filteredNotifications = useMemo(() => {
    let filtered = notificationsData?.items || [];

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter((n: any) => n.type === filterType);
    }

    // Filtro por status de leitura
    if (filterRead === 'unread') {
      filtered = filtered.filter((n: any) => !n.read);
    } else if (filterRead === 'read') {
      filtered = filtered.filter((n: any) => n.read);
    }

    // Busca por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((n: any) =>
        n.title?.toLowerCase().includes(term) ||
        n.content?.toLowerCase().includes(term) ||
        n.message?.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a: any, b: any) => 
      new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime()
    );
  }, [notificationsData, searchTerm, filterType, filterRead]);

  // Paginação
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIdx, startIdx + itemsPerPage);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'new_order':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'new_review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'user_banned':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new_message: 'Mensagem',
      new_order: 'Pedido',
      new_review: 'Avaliação',
      user_banned: 'Banimento',
      other: 'Outro',
    };
    return labels[type] || 'Notificação';
  };

  const handleExport = () => {
    const csv = [
      ['Data', 'Tipo', 'Título', 'Mensagem', 'Status'].join(','),
      ...filteredNotifications.map((n: any) =>
        [
          new Date(n.createdAt || n.timestamp).toLocaleString('pt-BR'),
          getTypeLabel(n.type),
          n.title,
          n.message || n.content,
          n.read ? 'Lida' : 'Não lida',
        ].map(v => `"${v}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notificacoes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-gray-400">Apenas administradores podem acessar o histórico de notificações.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Histórico de Notificações</h1>
          <p className="text-gray-400">Visualize e gerencie todas as notificações recebidas</p>
        </div>

        {/* Controles */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            {/* Filtro por Tipo */}
            <Select value={filterType} onValueChange={(v) => {
              setFilterType(v);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="new_message">Mensagens</SelectItem>
                <SelectItem value="new_order">Pedidos</SelectItem>
                <SelectItem value="new_review">Avaliações</SelectItem>
                <SelectItem value="user_banned">Banimentos</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Status */}
            <Select value={filterRead} onValueChange={(v) => {
              setFilterRead(v);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Não lidas</SelectItem>
                <SelectItem value="read">Lidas</SelectItem>
              </SelectContent>
            </Select>

            {/* Botão Exportar */}
            <Button
              onClick={handleExport}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">{filteredNotifications.length}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-gray-400">Não lidas</p>
              <p className="text-2xl font-bold text-blue-500">
                {filteredNotifications.filter((n: any) => !n.read).length}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-gray-400">Lidas</p>
              <p className="text-2xl font-bold text-green-500">
                {filteredNotifications.filter((n: any) => n.read).length}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-gray-400">Página</p>
              <p className="text-2xl font-bold text-white">{currentPage} / {totalPages || 1}</p>
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {paginatedNotifications.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            paginatedNotifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start gap-4 hover:border-gray-700 transition-colors ${
                  !notification.read ? 'bg-gray-800/50' : ''
                }`}
              >
                {/* Ícone */}
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-white">
                      {notification.title}
                    </h3>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    {notification.message || notification.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt || notification.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Status e Ações */}
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    title={notification.read ? 'Marcar como não lida' : 'Marcar como lida'}
                  >
                    {notification.read ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Anterior
            </Button>
            <div className="text-gray-400 text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
