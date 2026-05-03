import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Code2, Search, Star } from "lucide-react";
import { useState } from "react";

export default function ProductsCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const productsQuery = trpc.products.list.useQuery({
    limit: pageSize,
    offset: currentPage * pageSize,
  });

  const filteredProducts = productsQuery.data?.items.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Sistemas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore nossa coleção de sistemas digitais premium desenvolvidos por profissionais brasileiros
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sistemas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Filtros</Button>
            <Button variant="outline">Ordenar</Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container pb-20">
        {productsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-premium transition-all group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Code2 className="w-24 h-24 text-primary" />
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">Fora de Estoque</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex flex-col h-full">
                    {/* Title and Description */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg line-clamp-2 mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {product.description || "Sem descrição disponível"}
                      </p>
                    </div>

                    {/* Rating Placeholder */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-secondary text-secondary"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(0 avaliações)</span>
                    </div>

                    {/* Price and Delivery */}
                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Preço</span>
                        <span className="text-xl font-bold text-primary">
                          R$ {(product.price / 100).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prazo Médio</span>
                        <span className="font-bold">{product.averageDeliveryDays} dias</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estoque</span>
                        <span className={`font-bold ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}>
                          {product.stock} unidades
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full gap-2 group/btn"
                      disabled={product.stock === 0}
                    >
                      Ver Detalhes{" "}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(Math.ceil((productsQuery.data?.items.length || 0) / pageSize))]
                  .slice(Math.max(0, currentPage - 1), currentPage + 2)
                  .map((_, i) => {
                    const pageNum = Math.max(0, currentPage - 1) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={(currentPage + 1) * pageSize >= (productsQuery.data?.items.length || 0)}
              >
                Próximo
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Nenhum sistema encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Tente ajustar seus critérios de busca"
                : "Nenhum sistema disponível no momento"}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(0);
                }}
              >
                Limpar Busca
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
