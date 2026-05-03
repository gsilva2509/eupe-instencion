import { useState, useEffect } from 'react';
import { Bell, X, MessageCircle, ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface Notification {
  id: string;
  type: 'new_message' | 'new_order' | 'new_review' | 'user_banned';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Polling para notificações a cada 5 segundos
  const { data: recentNotifications } = trpc.notificationsRealtime.listRecent.useQuery(
    { limit: 10 },
    {
      refetchInterval: 5000, // Polling a cada 5 segundos
      enabled: true,
    }
  );

  useEffect(() => {
    if (recentNotifications?.items) {
      const newNotifications = recentNotifications.items.map((item: any) =>
        createNotificationFromEvent(item)
      );
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter((n) => !n.read).length);
    }
  }, [recentNotifications]);

  const createNotificationFromEvent = (event: any): Notification => {
    const baseNotification = {
      id: `${event.id || Date.now()}`,
      timestamp: new Date(event.createdAt || event.timestamp),
      read: event.read || false,
    };

    switch (event.type) {
      case 'new_message':
        return {
          ...baseNotification,
          type: 'new_message',
          title: 'Nova Mensagem',
          message: `${event.data?.userName || 'Usuário'}: ${
            event.data?.content?.substring(0, 50) || event.message
          }...`,
          icon: <MessageCircle className="w-5 h-5" />,
          color: 'text-blue-500',
        };
      case 'new_order':
        return {
          ...baseNotification,
          type: 'new_order',
          title: 'Novo Pedido',
          message: `${event.data?.userName || 'Cliente'} fez um pedido`,
          icon: <ShoppingCart className="w-5 h-5" />,
          color: 'text-green-500',
        };
      case 'new_review':
        return {
          ...baseNotification,
          type: 'new_review',
          title: 'Nova Avaliação',
          message: `Avaliação recebida`,
          icon: <Star className="w-5 h-5" />,
          color: 'text-yellow-500',
        };
      case 'user_banned':
        return {
          ...baseNotification,
          type: 'user_banned',
          title: 'Usuário Banido',
          message: `Usuário foi banido`,
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'text-red-500',
        };
      default:
        return {
          ...baseNotification,
          type: 'new_message',
          title: 'Notificação',
          message: event.message || 'Nova notificação',
          icon: <Bell className="w-5 h-5" />,
          color: 'text-gray-500',
        };
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        title="Notificações"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h3 className="font-semibold text-white">Notificações</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-gray-800/30' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 ${notification.color}`}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-800 flex justify-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearAll}
                className="text-gray-400 hover:text-white"
              >
                Limpar Tudo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return new Date(date).toLocaleDateString('pt-BR');
}
