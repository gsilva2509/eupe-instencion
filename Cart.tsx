import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Sistema Premium",
      price: 9999,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success("Produto removido do carrinho");
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para fazer checkout");
      return;
    }
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/catalogo")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuar Comprando
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Carrinho de Compras
          </h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-bold mb-2">Carrinho Vazio</h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não adicionou nenhum produto ao carrinho
                </p>
                <Button onClick={() => setLocation("/catalogo")}>
                  Explorar Catálogo
                </Button>
              </Card>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-primary font-bold text-xl">
                        R$ {item.price.toLocaleString("pt-BR")}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 space-y-6">
              <h3 className="text-xl font-bold">Resumo do Pedido</h3>

              <div className="space-y-3 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    R$ {total.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-semibold">Grátis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impostos</span>
                  <span className="font-semibold">Calculado no checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  R$ {total.toLocaleString("pt-BR")}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full"
                size="lg"
              >
                Ir para Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => setLocation("/catalogo")}
                className="w-full"
              >
                Continuar Comprando
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
