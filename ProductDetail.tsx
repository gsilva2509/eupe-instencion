import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  ArrowLeft,
  Code2,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function ProductDetail() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  // Get product ID from URL params (simplified, would need proper routing)
  const productId = 1; // TODO: Get from URL params

  const productQuery = trpc.products.getById.useQuery({ id: productId });
  const product = productQuery.data;

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <Code2 className="w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Button onClick={() => setLocation("/catalogo")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/catalogo")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Catálogo
          </Button>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <Code2 className="w-24 h-24 text-primary/50" />
            </div>

            {/* Image Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">(0 avaliações)</span>
              </div>

              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Price and Availability */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Preço</span>
                <span className="text-3xl font-bold text-primary">
                  R$ {(product.price / 100).toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prazo de Entrega</p>
                  <p className="font-bold flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    {product.averageDeliveryDays} dias
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Disponibilidade</p>
                  <p className={`font-bold ${
                    product.stock > 10
                      ? "text-green-600"
                      : product.stock > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>
                    {product.stock > 0 ? `${product.stock} em estoque` : "Fora de estoque"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Purchase Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <span className="px-4 font-bold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                <span className="text-muted-foreground text-sm">
                  Total: R$ {((product.price / 100) * quantity).toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="gap-2"
                  disabled={product.stock === 0 || !isAuthenticated}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Agora
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Personalizar
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>Garantia de qualidade e suporte técnico</span>
              </div>
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-primary" />
                <span>Código-fonte otimizado e documentado</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span>Entrega rápida e segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="border-t border-border bg-card py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Avaliações</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review Stats */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold">5.0</span>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-secondary text-secondary"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Baseado em 0 avaliações</p>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-12">{stars} estrelas</span>
                    <div className="flex-1 h-2 bg-muted rounded-full" />
                    <span className="text-sm text-muted-foreground">0</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Deixe sua avaliação</h3>
              <Button className="w-full" disabled={!isAuthenticated}>
                Avaliar este produto
              </Button>
              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground mt-3">
                  Faça login para avaliar este produto
                </p>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
