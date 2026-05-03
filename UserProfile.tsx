import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { User, Edit2, Save, X, ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function UserProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
  });

  const profileQuery = trpc.profile.getCurrent.useQuery(undefined, {
    enabled: !!user,
  });
  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      profileQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setFormData({
        name: profileQuery.data.user.name || "",
        bio: profileQuery.data.profile?.bio || "",
        phone: profileQuery.data.profile?.phone || "",
        address: profileQuery.data.profile?.address || "",
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
      }));
    }
  }, [profileQuery.data, user]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Faça login para acessar seu perfil</h1>
          <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
            onClick={() => setLocation("/")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Avatar Section */}
          <Card className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <User className="w-12 h-12 text-primary/50" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{profileQuery.data?.user.name || user.name || "Usuário"}</h2>
                <p className="text-muted-foreground text-sm capitalize">{user.role}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
              )}
            </div>
          </Card>

          {/* Profile Form */}
          <Card className="p-8 space-y-6">
            <div>
              <label className="text-sm font-semibold block mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50"
                placeholder="+55 (11) 99999-9999"
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Endereço</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50"
                placeholder="Rua, número, cidade, estado"
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="gap-2 flex-1"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar Alterações
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    if (profileQuery.data) {
                      setFormData({
                        name: profileQuery.data.user.name || "",
                        bio: profileQuery.data.profile?.bio || "",
                        phone: profileQuery.data.profile?.phone || "",
                        address: profileQuery.data.profile?.address || "",
                      });
                    }
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </Card>

          {/* Account Info */}
          <Card className="p-8">
            <h3 className="text-lg font-bold mb-4">Informações da Conta</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de Conta:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membro desde:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
