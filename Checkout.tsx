import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CreditCard, QrCode, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type PaymentMethod = "pix" | "card" | "paypal";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentsMutation = trpc.payments.processCardPayment.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Faça Login para Continuar</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para completar sua compra
          </p>
          <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await paymentsMutation.mutateAsync({
        orderId: 1,
        cardToken: "token-" + paymentMethod,
        cardholderName: user?.name || "Cliente",
        installments: paymentMethod === "card" ? 1 : undefined,
      });
      toast.success("Pagamento processado com sucesso!");
      setLocation("/");
    } catch (error) {
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/cart")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Carrinho
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Informações de Entrega</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">Nome Completo</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ""}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Telefone</label>
                    <input
                      type="tel"
                      placeholder="+55 (11) 99999-9999"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-2">CEP</label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua, número"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Método de Pagamento</h3>
              <div className="space-y-3">
                {/* PIX */}
                <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  style={{borderColor: paymentMethod === "pix" ? "hsl(0, 84%, 60%)" : ""}}>
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === "pix"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mr-4"
                  />
                  <QrCode className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <p className="font-bold">PIX</p>
                    <p className="text-sm text-muted-foreground">
                      Transferência instantânea com QR Code
                    </p>
                  </div>
                </label>

                {/* Credit Card */}
                <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  style={{borderColor: paymentMethod === "card" ? "hsl(0, 84%, 60%)" : ""}}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mr-4"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <p className="font-bold">Cartão de Crédito</p>
                    <p className="text-sm text-muted-foreground">
                      Parcelado em até 12x
                    </p>
                  </div>
                </label>

                {/* PayPal */}
                <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  style={{borderColor: paymentMethod === "paypal" ? "hsl(0, 84%, 60%)" : ""}}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mr-4"
                  />
                  <Zap className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <p className="font-bold">PayPal</p>
                    <p className="text-sm text-muted-foreground">
                      Pague com sua conta PayPal
                    </p>
                  </div>
                </label>
              </div>
            </Card>

            {/* Card Details (if card selected) */}
            {paymentMethod === "card" && (
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Dados do Cartão</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold block mb-2">
                        Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="000"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 space-y-6">
              <h3 className="text-xl font-bold">Resumo do Pedido</h3>

              <div className="space-y-3 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">R$ 9.999,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-semibold">Grátis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impostos</span>
                  <span className="font-semibold">R$ 0,00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">R$ 9.999,00</span>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Processando..." : "Confirmar Pagamento"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setLocation("/cart")}
                className="w-full"
              >
                Voltar ao Carrinho
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
