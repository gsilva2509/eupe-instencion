import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function CancelOrder() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cancellableOrders } = trpc.cancellations.getCancellableOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cancelOrderMutation = trpc.cancellations.cancelOrder.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Faça Login</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para cancelar pedidos
          </p>
          <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
        </Card>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    if (!selectedOrderId) {
      toast.error("Selecione um pedido para cancelar");
      return;
    }

    if (!cancellationReason.trim()) {
      toast.error("Informe o motivo do cancelamento");
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelOrderMutation.mutateAsync({
        orderId: selectedOrderId,
        reason: cancellationReason,
      });
      toast.success("Pedido cancelado com sucesso!");
      setCancellationReason("");
      setSelectedOrderId(null);
    } catch (error) {
      toast.error("Erro ao cancelar pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/pedidos")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Pedidos
          </Button>
          <h1 className="text-3xl font-bold">Cancelar Pedido</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 max-w-2xl">
        <div className="space-y-6">
          {/* Info Alert */}
          <Card className="p-4 border-yellow-500/30 bg-yellow-500/10">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Aviso</h3>
                <p className="text-sm text-yellow-800">
                  Você pode cancelar apenas pedidos com status "Pendente". Após o cancelamento, o reembolso será processado automaticamente.
                </p>
              </div>
            </div>
          </Card>

          {/* Select Order */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Selecione um Pedido</h3>

            {!cancellableOrders || cancellableOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Você não tem pedidos pendentes para cancelar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cancellableOrders.map((order) => (
                  <label
                    key={order.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedOrderId === order.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="order"
                      value={order.id}
                      checked={selectedOrderId === order.id}
                      onChange={(e) => setSelectedOrderId(Number(e.target.value))}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Pedido #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(order.totalAmount / 100).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-700">
                      Pendente
                    </span>
                  </label>
                ))}
              </div>
            )}
          </Card>

          {/* Cancellation Reason */}
          {selectedOrderId && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Motivo do Cancelamento</h3>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Explique por que deseja cancelar este pedido (mínimo 5 caracteres)..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {cancellationReason.length} caracteres
              </p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleCancelOrder}
              disabled={!selectedOrderId || isSubmitting || cancellationReason.length < 5}
              className="flex-1"
              size="lg"
            >
              {isSubmitting ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/pedidos")}
              className="flex-1"
              size="lg"
            >
              Voltar
            </Button>
          </div>

          {/* Success Message */}
          <Card className="p-4 border-green-500/30 bg-green-500/10 hidden">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-900 mb-1">Cancelamento Confirmado</h3>
                <p className="text-sm text-green-800">
                  Seu pedido foi cancelado com sucesso. O reembolso será processado em até 5 dias úteis.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
