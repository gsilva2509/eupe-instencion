import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AddProduct() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    averageDeliveryDays: '7',
    images: '',
  });
  const [loading, setLoading] = useState(false);

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success('Produto criado com sucesso!');
      navigate('/admin');
    },
    onError: (error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    },
  });

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Apenas Admin e Staff podem adicionar produtos.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageArray = formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(url => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });

      await createProductMutation.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        price: Number(formData.price),
        stock: Number(formData.stock),
        averageDeliveryDays: Number(formData.averageDeliveryDays),
        images: imageArray,
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 font-mono">
          Adicionar <span className="text-red-500">Produto</span>
        </h1>
        <p className="text-gray-400 mb-8">Crie um novo sistema para venda</p>

        <Card className="bg-gray-900 border-red-500/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Produto */}
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Produto</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Sistema de Gestão Premium"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva os recursos e benefícios do seu sistema..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Preço */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1000"
                  required
                  min="0"
                  step="0.01"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Estoque */}
              <div>
                <label className="block text-sm font-medium mb-2">Estoque</label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="10"
                  required
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Prazo de Entrega */}
            <div>
              <label className="block text-sm font-medium mb-2">Prazo de Entrega (dias)</label>
              <Input
                type="number"
                name="averageDeliveryDays"
                value={formData.averageDeliveryDays}
                onChange={handleChange}
                placeholder="7"
                min="1"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* URLs de Imagens */}
            <div>
              <label className="block text-sm font-medium mb-2">URLs de Imagens</label>
              <Textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="Cole as URLs das imagens, uma por linha"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400 mt-2">
                Cole as URLs das imagens do seu produto, uma por linha (devem ser URLs válidas)
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || createProductMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {loading || createProductMutation.isPending ? 'Criando...' : 'Criar Produto'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/admin')}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
