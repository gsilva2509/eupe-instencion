import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Package, Calendar, DollarSign, Truck } from "lucide-react";
import { useLocation } from "wouter";

interface Order {
  id: number;
  date: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  items: number;
  estimatedDelivery: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    date: "2026-04-12",
    total: 9999,
    status: "delivered",
    items: 1,
    estimatedDelivery: "2026-04-19",
  },
];

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Faça Login</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para visualizar seus pedidos
          </p>
          <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600";
      case "paid":
        return "bg-blue-500/20 text-blue-600";
      case "shipped":
        return "bg-purple-500/20 text-purple-600";
      case "delivered":
        return "bg-green-500/20 text-green-600";
      case "cancelled":
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "paid":
        return "Pago";
      case "shipped":
        return "Enviado";
      case "delivered":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            Meus Pedidos
          </h1>
        </div>
      </div>

      {/* Orders Content */}
      <div className="container py-12">
        {mockOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold mb-2">Nenhum Pedido</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não realizou nenhum pedido
            </p>
            <Button onClick={() => setLocation("/catalogo")}>
              Explorar Catálogo
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  {/* Order ID */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pedido</p>
                    <p className="font-bold text-lg">#{order.id}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Data
                    </p>
                    <p className="font-semibold">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Itens</p>
                    <p className="font-semibold">{order.items} produto(s)</p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Total
                    </p>
                    <p className="font-bold text-primary">
                      R$ {order.total.toLocaleString("pt-BR")}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalhes
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => setLocation("/cancelar-pedido")}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                {order.status !== "cancelled" && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>
                      Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
