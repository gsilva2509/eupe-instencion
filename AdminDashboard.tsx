import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  Package,
  ShoppingCart,
  MessageSquare,
  Star,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import AdminCancellationsTab from "@/components/AdminCancellationsTab";
import AdminFaqTab from "@/components/AdminFaqTab";
import AdminTeamTab from "@/components/AdminTeamTab";
import AdminUsersTab from "@/components/AdminUsersTab";
import AdminChatTab from "@/components/AdminChatTab";
import AdminReviewsTab from "@/components/AdminReviewsTab";

type TabType = "overview" | "products" | "orders" | "users" | "reviews" | "chat" | "cancellations" | "faq" | "team" | "admin-chat" | "settings";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin or staff
  if (user?.role !== "admin" && user?.role !== "staff") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">Você não tem permissão para acessar o dashboard</p>
          <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "products", label: "Produtos", icon: Package },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "users", label: "Usuários", icon: Users },
    { id: "reviews", label: "Avaliações", icon: Star },
    { id: "chat", label: "Chat/Suporte", icon: MessageSquare },
    { id: "admin-chat", label: "Todos os Chats", icon: MessageSquare },
    { id: "cancellations", label: "Cancelamentos", icon: X },
    { id: "faq", label: "FAQs", icon: MessageSquare },
    { id: "team", label: "Equipe", icon: Users },
    { id: "settings", label: "Configurações", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-primary">Eupe Instencion</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-semibold">{user?.name || "Admin"}</p>
              <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } border-r border-border bg-card transition-all duration-300 overflow-hidden lg:w-64`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {activeTab === "overview" && <OverviewTab user={user} />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "reviews" && <AdminReviewsTab />}
          {activeTab === "chat" && <ChatTab />}
          {activeTab === "admin-chat" && <AdminChatTab />}
          {activeTab === "cancellations" && <AdminCancellationsTab />}
          {activeTab === "faq" && <AdminFaqTab />}
          {activeTab === "team" && <AdminTeamTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Bem-vindo, {user?.name}!</h2>
        <p className="text-muted-foreground">Gerencie sua plataforma Eupe Instencion</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Produtos</p>
              <p className="text-3xl font-bold">10</p>
            </div>
            <Package className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pedidos</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Usuários</p>
              <p className="text-3xl font-bold">1</p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avaliações</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Star className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Atividade Recente</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Nenhuma atividade recente</p>
        </div>
      </Card>
    </div>
  );
}

function ProductsTab() {
  const [, setLocation] = useLocation();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Produtos</h2>
        <Button onClick={() => setLocation("/add-product")}>+ Novo Produto</Button>
      </div>

      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum produto cadastrado</p>
        </div>
      </Card>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>

      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum pedido realizado</p>
        </div>
      </Card>
    </div>
  );
}

function UsersTab() {
  return <AdminUsersTab />;
}

function ReviewsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciamento de Avaliações</h2>

      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma avaliação pendente de moderação</p>
        </div>
      </Card>
    </div>
  );
}

function ChatTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Chat e Suporte</h2>

      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma mensagem de suporte</p>
        </div>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações</h2>

      <Card className="p-6 space-y-6">
        <div>
          <h3 className="font-bold mb-4">Informações da Plataforma</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Nome da Plataforma</label>
              <input
                type="text"
                defaultValue="Eupe Instencion"
                className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Descrição</label>
              <textarea
                defaultValue="Plataforma premium para venda de sistemas digitais"
                className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background"
                rows={4}
              />
            </div>
            <Button>Salvar Alterações</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
