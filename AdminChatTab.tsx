import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Send, Upload, MessageCircle } from 'lucide-react';

interface ChatConversation {
  id: number;
  userId: number;
  userName: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: Date;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  isRead: boolean;
}

export default function AdminChatTab() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationsQuery = trpc.chat.listMessages.useQuery({ limit: 100, offset: 0 });
  const messagesQuery = trpc.chat.listMessages.useQuery(
    selectedConversation ? { conversationId: selectedConversation, limit: 100, offset: 0 } : { limit: 100, offset: 0 },
    { enabled: !!selectedConversation }
  );

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessageText('');
      setSelectedImage(null);
      if (selectedConversation) {
        messagesQuery.refetch();
      }
      toast.success('Mensagem enviada!');
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  useEffect(() => {
    if (conversationsQuery.data?.items) {
      setConversations(conversationsQuery.data.items as any);
    }
  }, [conversationsQuery.data]);

  useEffect(() => {
    if (messagesQuery.data?.items) {
      setMessages(messagesQuery.data.items.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderId === 1 ? 'Admin' : 'Usuario',
        content: msg.content,
        imageUrl: msg.images ? msg.images.split(',')[0] : undefined,
        createdAt: new Date(msg.createdAt),
        isRead: msg.isRead === 1,
      })));
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() && !selectedImage) {
      toast.error('Digite uma mensagem ou selecione uma imagem');
      return;
    }

    if (!selectedConversation) {
      toast.error('Selecione uma conversa');
      return;
    }

    let imageUrl: string | undefined;
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }

    await sendMessageMutation.mutateAsync({
      content: messageText,
      images: imageUrl ? [imageUrl] : undefined,
      recipientId: selectedConversation,
      messageType: 'direct',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Chat - Todos os Usuários</h2>
        <p className="text-gray-400">Visualize e responda todos os chats dos usuários</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Conversas */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900 border-gray-800 h-96 overflow-y-auto">
            {conversationsQuery.isLoading ? (
              <div className="p-4 text-gray-400">Carregando conversas...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-gray-400 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma conversa</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm">{conv.userName}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-75 truncate">{conv.lastMessage}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {new Date(conv.lastMessageTime).toLocaleTimeString('pt-BR')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Conversa Selecionada */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="bg-gray-900 border-red-500/20 h-96 md:h-[500px] flex flex-col">
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messagesQuery.isLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Carregando mensagens...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Nenhuma mensagem nesta conversa</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === 1 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === 1
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="Chat"
                            className="max-w-xs rounded mb-2"
                          />
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Formulário de envio */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="p-2 hover:bg-gray-800 rounded transition">
                      <Upload className="w-5 h-5" />
                    </div>
                  </label>
                  <Button
                    type="submit"
                    disabled={sendMessageMutation.isPending}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-800 h-96 md:h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma conversa para começar</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
