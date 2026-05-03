import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Trash2, Eye, Star } from 'lucide-react';

interface Review {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: Date;
  isModerated: boolean;
}

export default function AdminReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const reviewsQuery = trpc.reviews.listByProduct.useQuery({ productId: 0, limit: 100, offset: 0 });

  useEffect(() => {
    if (reviewsQuery.data?.items) {
      const reviewList = reviewsQuery.data.items.map((review: any) => ({
        id: review.id,
        userId: review.userId,
        userName: 'Usuário',
        productId: review.productId,
        productName: 'Produto',
        rating: review.rating,
        comment: review.comment,
        imageUrl: review.images ? review.images.split(',')[0] : undefined,
        createdAt: new Date(review.createdAt),
        isModerated: review.isModerated === 1,
      }));
      setReviews(reviewList);
      setFilteredReviews(reviewList);
    }
  }, [reviewsQuery.data]);

  useEffect(() => {
    const filtered = reviews.filter(
      (review) =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
  }, [searchTerm, reviews]);

  const handleDeleteReview = async (reviewId: number) => {
    if (confirm('Tem certeza que deseja deletar esta avaliação?')) {
      toast.info('Funcionalidade em desenvolvimento');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gerenciar Avaliações</h2>
        <p className="text-gray-400">Visualize e modere avaliações de produtos</p>
      </div>

      {/* Barra de Busca */}
      <div className="flex gap-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por produto, usuário ou comentário..."
          className="flex-1 bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 p-4">
          <p className="text-gray-400 text-sm">Total de Avaliações</p>
          <p className="text-2xl font-bold text-red-500">{reviews.length}</p>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-4">
          <p className="text-gray-400 text-sm">Média de Classificação</p>
          <p className="text-2xl font-bold text-yellow-500">
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'}
          </p>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-4">
          <p className="text-gray-400 text-sm">Moderadas</p>
          <p className="text-2xl font-bold text-green-500">
            {reviews.filter((r) => r.isModerated).length}
          </p>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-4">
          <p className="text-gray-400 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-orange-500">
            {reviews.filter((r) => !r.isModerated).length}
          </p>
        </Card>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {reviewsQuery.isLoading ? (
          <Card className="bg-gray-900 border-gray-800 p-6 text-center text-gray-400">
            Carregando avaliações...
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800 p-6 text-center text-gray-400">
            Nenhuma avaliação encontrada
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card
              key={review.id}
              className="bg-gray-900 border-gray-800 p-6 hover:border-red-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-white">{review.productName}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Por {review.userName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedReview(review)}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comentário */}
              <p className="text-gray-300 mb-4">{review.comment}</p>

              {/* Imagem */}
              {review.imageUrl && (
                <img
                  src={review.imageUrl}
                  alt="Review"
                  className="max-w-xs rounded mb-4 max-h-48 object-cover"
                />
              )}

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    review.isModerated
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {review.isModerated ? 'Moderada' : 'Pendente'}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-red-500/20 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedReview.productName}</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < selectedReview.rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-300 mb-4">{selectedReview.comment}</p>

              {selectedReview.imageUrl && (
                <img
                  src={selectedReview.imageUrl}
                  alt="Review"
                  className="max-w-full rounded mb-4 max-h-64 object-cover"
                />
              )}

              <div className="text-sm text-gray-400">
                <p>Usuário: {selectedReview.userName}</p>
                <p>Data: {new Date(selectedReview.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
