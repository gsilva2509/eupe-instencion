import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Edit2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  order: number;
  isActive: number;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminFaqTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: "",
    order: 0,
  });

  const { data: faqs = [], isLoading, refetch } = trpc.faqAdmin.getAll.useQuery();
  const createMutation = trpc.faqAdmin.create.useMutation();
  const updateMutation = trpc.faqAdmin.update.useMutation();
  const deleteMutation = trpc.faqAdmin.delete.useMutation();
  const reorderMutation = trpc.faqAdmin.reorder.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.question || !formData.answer) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("FAQ atualizada com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("FAQ criada com sucesso");
      }

      setFormData({ category: "", question: "", answer: "", order: 0 });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar FAQ");
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta FAQ?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("FAQ deletada com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao deletar FAQ");
    }
  };

  const handleReorder = async (id: number, direction: "up" | "down") => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) return;

    const newOrder = direction === "up" ? faq.order - 1 : faq.order + 1;

    try {
      await reorderMutation.mutateAsync({
        items: [{ id, order: newOrder }],
      });
      refetch();
    } catch (error) {
      toast.error("Erro ao reordenar FAQ");
    }
  };

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  if (isLoading) {
    return <div className="text-center py-8">Carregando FAQs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar FAQs</h2>
        <Button
          onClick={() => {
            setFormData({ category: "", question: "", answer: "", order: 0 });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova FAQ
        </Button>
      </div>

      {showForm && (
        <Card className="bg-black/50 border-red-600/30 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Ex: Geral, Pagamentos, etc"
                className="bg-black/50 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pergunta
              </label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Digite a pergunta"
                className="bg-black/50 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resposta
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder="Digite a resposta"
                rows={5}
                className="w-full bg-black/50 border border-gray-600 rounded-md text-white p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordem
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                placeholder="0"
                className="bg-black/50 border-gray-600 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                {editingId ? "Atualizar" : "Criar"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-red-500 mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {faqs
                .filter((f) => f.category === category)
                .sort((a, b) => a.order - b.order)
                .map((faq) => (
                  <Card
                    key={faq.id}
                    className="bg-black/50 border-gray-700 p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">{faq.question}</p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReorder(faq.id, "up")}
                        className="text-gray-400 hover:text-white"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReorder(faq.id, "down")}
                        className="text-gray-400 hover:text-white"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(faq)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {faqs.length === 0 && (
        <Card className="bg-black/50 border-gray-700 p-8 text-center">
          <p className="text-gray-400">Nenhuma FAQ criada ainda</p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Criar primeira FAQ
          </Button>
        </Card>
      )}
    </div>
  );
}
