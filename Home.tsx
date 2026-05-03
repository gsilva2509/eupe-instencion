import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Zap, Shield, TrendingUp, Code2, Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationCenter from "@/components/NotificationCenter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const productsQuery = trpc.products.list.useQuery({
    limit: 6,
    offset: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-premium flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg">Eupe Instencion</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {(user?.role === "admin" || user?.role === "staff") && (
                  <NotificationCenter />
                )}
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                {(user?.role === "admin" || user?.role === "staff") && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/admin">Dashboard</a>
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600" size="sm" asChild>
                      <a href="/add-product">+ Produto</a>
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href="/faq">FAQ</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/pedidos">Pedidos</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/perfil">Perfil</a>
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Assimétrico */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Conteúdo Hero */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Plataforma <span className="text-primary">Premium</span> para Sistemas Digitais
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Conecte desenvolvedores brasileiros com clientes europeus. Venda seus sistemas com segurança, confiança e exclusividade.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Button size="lg" className="gap-2" asChild>
                    <a href="/catalogo">
                      Explorar Catálogo <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-2">
                      <a href={getLoginUrl()}>
                        Começar Agora <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="lg">
                      Saiba Mais
                    </Button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-primary">4</div>
                  <p className="text-sm text-muted-foreground">Desenvolvedores</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">0</div>
                  <p className="text-sm text-muted-foreground">Sistemas Vendidos</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <p className="text-sm text-muted-foreground">Países</p>
                </div>
              </div>
            </div>

            {/* Visual Hero - Elemento Decorativo */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96">
                {/* Gradiente Background */}
                <div className="absolute inset-0 bg-gradient-premium rounded-3xl opacity-10 blur-3xl" />

                {/* Card Principal */}
                <div className="absolute inset-0 bg-card border border-border rounded-3xl shadow-premium p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Sistema Premium</h3>
                      <p className="text-sm text-muted-foreground">Exemplo de Produto</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Preço</span>
                      <span className="font-bold text-lg text-primary">R$ 1.000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Prazo</span>
                      <span className="font-bold">7 dias</span>
                    </div>
                    <Button className="w-full gap-2">
                      Comprar <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que Eupe Instencion?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para vender seus sistemas com segurança e alcance global
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Segurança Premium",
                description: "Moderação automática de conteúdo com IA e proteção de dados",
              },
              {
                icon: Zap,
                title: "Pagamentos Globais",
                description: "PIX, Cartão de Crédito e PayPal integrados",
              },
              {
                icon: TrendingUp,
                title: "Dashboard Completo",
                description: "Controle total sobre produtos, pedidos e avaliações",
              },
              {
                icon: Cpu,
                title: "Tecnologia Avançada",
                description: "Plataforma moderna com performance otimizada",
              },
              {
                icon: Code2,
                title: "Chat em Tempo Real",
                description: "Comunicação direta com clientes e suporte integrado",
              },
              {
                icon: TrendingUp,
                title: "Alcance Global",
                description: "Conecte com clientes de toda a Europa",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-premium transition-shadow">
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Sistemas em Destaque</h2>
            <p className="text-lg text-muted-foreground">
              Conheça alguns dos melhores sistemas da plataforma
            </p>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-muted" />
              ))}
            </div>
          ) : productsQuery.data?.items.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productsQuery.data.items.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-premium transition-all group cursor-pointer"
                >
                  {/* Product Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors flex items-center justify-center">
                    <Code2 className="w-12 h-12 text-primary/50" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Preço</p>
                        <p className="text-xl font-bold text-primary">
                          R$ {(product.price / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Prazo</p>
                        <p className="font-bold">{product.averageDeliveryDays} dias</p>
                      </div>
                    </div>

                    <Button className="w-full gap-2 group/btn">
                      Ver Detalhes <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum sistema disponível no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-premium text-white">
        <div className="container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Pronto para começar?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Junte-se a centenas de desenvolvedores que já estão vendendo seus sistemas com sucesso
            </p>
          </div>

          <Button asChild size="lg" variant="secondary" className="gap-2">
            <a href={getLoginUrl()}>
              Criar Conta Agora <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Eupe Instencion</h4>
              <p className="text-sm text-muted-foreground">
                Plataforma premium para venda de sistemas digitais
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground">Preços</a></li>
                <li><a href="#" className="hover:text-foreground">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Sobre</a></li>
                <li><a href="/faq" className="hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground">Termos</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 Eupe Instencion. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
