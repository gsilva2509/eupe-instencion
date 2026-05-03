import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Send, Upload } from 'lucide-react';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  isRead: boolean;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatQuery = trpc.chat.listMessages.useQuery({
    limit: 50,
    offset: 0,
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessageText('');
      setSelectedImage(null);
      chatQuery.refetch();
      toast.success('Mensagem enviada!');
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  useEffect(() => {
    if (chatQuery.data?.items) {
      setMessages(chatQuery.data.items.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: 'Usuario',
        content: msg.content,
        imageUrl: msg.images ? msg.images.split(',')[0] : undefined,
        createdAt: new Date(msg.createdAt),
        isRead: msg.isRead === 1,
      })));
    }
  }, [chatQuery.data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() && !selectedImage) {
      toast.error('Digite uma mensagem ou selecione uma imagem');
      return;
    }

    let imageUrl: string | undefined;

    // Se houver imagem, fazer upload (simulado por enquanto)
    if (selectedImage) {
      // Em produção, fazer upload para S3
      imageUrl = URL.createObjectURL(selectedImage);
    }

    await sendMessageMutation.mutateAsync({
      content: messageText,
      images: imageUrl ? [imageUrl] : undefined,
      recipientId: 1, // Admin por padrão
      messageType: 'support',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Você precisa estar autenticado para acessar o chat</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 font-mono">
          Chat com <span className="text-red-500">Suporte</span>
        </h1>
        <p className="text-gray-400 mb-8">Converse com nossa equipe de suporte</p>

        <Card className="bg-gray-900 border-red-500/20 h-96 md:h-[500px] flex flex-col">
          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Nenhuma mensagem ainda. Comece uma conversa!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === user.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Chat image"
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
                placeholder="Digite sua mensagem..."
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
            {selectedImage && (
              <p className="text-xs text-gray-400 mt-2">
                Imagem selecionada: {selectedImage.name}
              </p>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
