import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  createdAt: Date;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
  refundAmount?: number | null;
  refundProcessed?: number | null;
}

export default function AdminCancellationsTab() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  const { data: allOrders } = trpc.cancellations.getAllOrdersForCancellation.useQuery();
  const { data: stats } = trpc.cancellations.getCancellationStats.useQuery();
  const cancelOrderMutation = trpc.cancellations.cancelOrder.useMutation();

  const cancellableOrders = allOrders?.filter((o) => o.status === "pending" || o.status === "paid") || [];
  const cancelledOrders = allOrders?.filter((o) => o.status === "cancelled") || [];

  const handleCancelOrder = async () => {
    if (!selectedOrder) {
      toast.error("Selecione um pedido");
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync({
        orderId: selectedOrder.id,
        reason: cancellationReason || "Cancelado pelo administrador",
      });
      toast.success("Pedido cancelado com sucesso");
      setCancellationReason("");
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Erro ao cancelar pedido");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total de Cancelamentos</p>
            <p className="text-3xl font-bold">{stats.totalCancellations}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Reembolsado</p>
            <p className="text-3xl font-bold text-primary">
              R$ {(stats.totalRefunded / 100).toLocaleString("pt-BR")}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Taxa de Cancelamento</p>
            <p className="text-3xl font-bold">{stats.cancellationRate.toFixed(1)}%</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cancellable Orders */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Pedidos Canceláveis</h3>

            {cancellableOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum pedido disponível para cancelamento
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cancellableOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">Pedido #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Usuário ID: {order.userId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          R$ {(order.totalAmount / 100).toLocaleString("pt-BR")}
                        </p>
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-700">
                          {order.status === "pending" ? "Pendente" : "Pago"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Cancellation Form */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Cancelar Pedido</h3>

            {selectedOrder ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm font-semibold">Pedido #{selectedOrder.id}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {(selectedOrder.totalAmount / 100).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Motivo do Cancelamento
                  </label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Motivo do cancelamento..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCancelOrder}
                  className="w-full"
                  variant="destructive"
                >
                  Confirmar Cancelamento
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Selecione um pedido para cancelar
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Cancelled Orders History */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Histórico de Cancelamentos</h3>

        {cancelledOrders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum pedido cancelado
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cancelledOrders.slice(-10).map((order) => (
              <div key={order.id} className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Pedido #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Cancelado em:{" "}
                        {order.cancelledAt
                          ? new Date(order.cancelledAt).toLocaleDateString("pt-BR")
                          : "N/A"}
                      </p>
                      {order.cancellationReason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Motivo: {order.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      Reembolso: R${" "}
                      {(order.refundAmount || 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-700 mt-1">
                      {order.refundProcessed ? "Processado" : "Pendente"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
