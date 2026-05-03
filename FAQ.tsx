import { useState } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // Geral
  {
    id: "general-1",
    category: "Geral",
    question: "O que é a Eupe Instencion?",
    answer:
      "Eupe Instencion é uma plataforma premium que conecta desenvolvedores brasileiros selecionados com clientes europeus. Oferecemos uma solução segura, confiável e exclusiva para venda de sistemas digitais de alta qualidade.",
  },
  {
    id: "general-2",
    category: "Geral",
    question: "Como funciona a plataforma?",
    answer:
      "A plataforma funciona como um marketplace: desenvolvedores cadastram seus sistemas, clientes navegam pelo catálogo, adicionam produtos ao carrinho e realizam checkout com segurança. Oferecemos suporte completo durante todo o processo.",
  },
  {
    id: "general-3",
    category: "Geral",
    question: "Quem pode usar a Eupe Instencion?",
    answer:
      "Desenvolvedores brasileiros selecionados podem vender seus sistemas. Clientes europeus podem comprar produtos. Todos os usuários devem estar registrados e verificados na plataforma.",
  },

  // Cadastro e Autenticação
  {
    id: "auth-1",
    category: "Cadastro e Autenticação",
    question: "Como me cadastro na plataforma?",
    answer:
      "Clique em 'Login' no header, selecione 'Criar Conta' e preencha seus dados. Você receberá um email de confirmação. Após confirmar, sua conta estará ativa.",
  },
  {
    id: "auth-2",
    category: "Cadastro e Autenticação",
    question: "Esqueci minha senha. Como recupero?",
    answer:
      "Na página de login, clique em 'Esqueci a Senha'. Informe seu email e você receberá um link de recuperação. Clique no link e defina uma nova senha.",
  },
  {
    id: "auth-3",
    category: "Cadastro e Autenticação",
    question: "Posso ter múltiplas contas?",
    answer:
      "Não. Cada usuário pode ter apenas uma conta. Se você tentar criar uma segunda conta com o mesmo email, receberá uma mensagem de erro.",
  },
  {
    id: "auth-4",
    category: "Cadastro e Autenticação",
    question: "Como altero meus dados de perfil?",
    answer:
      "Clique em 'Perfil' no header. Você pode editar nome, bio, telefone, endereço e foto. Clique em 'Salvar' para confirmar as alterações.",
  },

  // Compras e Pagamentos
  {
    id: "purchase-1",
    category: "Compras e Pagamentos",
    question: "Quais são os métodos de pagamento?",
    answer:
      "Oferecemos 3 métodos: PIX (com QR Code gerado automaticamente), Cartão de Crédito (via gateway seguro) e PayPal. Escolha o que preferir no checkout.",
  },
  {
    id: "purchase-2",
    category: "Compras e Pagamentos",
    question: "Meu pagamento foi processado. Quando recebo o produto?",
    answer:
      "Após confirmação do pagamento, você receberá um email com acesso ao produto. O prazo de entrega varia conforme o sistema (exibido na página do produto). Você pode acompanhar no histórico de pedidos.",
  },
  {
    id: "purchase-3",
    category: "Compras e Pagamentos",
    question: "É seguro pagar na Eupe Instencion?",
    answer:
      "Sim! Usamos criptografia HTTPS, gateways de pagamento certificados e não armazenamos dados de cartão. Todos os dados sensíveis são protegidos conforme padrões internacionais.",
  },
  {
    id: "purchase-4",
    category: "Compras e Pagamentos",
    question: "Posso usar cupons de desconto?",
    answer:
      "Sim! Se você tiver um código de cupom, aplique-o no carrinho antes de finalizar a compra. O desconto será calculado automaticamente.",
  },

  // Pedidos
  {
    id: "orders-1",
    category: "Pedidos",
    question: "Como acompanho meu pedido?",
    answer:
      "Acesse 'Meus Pedidos' no header. Você verá todos os seus pedidos com status em tempo real: Pendente, Pago, Enviado, Entregue ou Cancelado.",
  },
  {
    id: "orders-2",
    category: "Pedidos",
    question: "Posso cancelar um pedido?",
    answer:
      "Sim! Você pode cancelar pedidos com status 'Pendente'. Acesse 'Meus Pedidos', clique no pedido e selecione 'Cancelar'. Informe um motivo e confirme. O reembolso será processado automaticamente.",
  },
  {
    id: "orders-3",
    category: "Pedidos",
    question: "Quanto tempo leva para receber meu pedido?",
    answer:
      "O prazo varia conforme o sistema. Você verá o tempo médio de entrega na página do produto e no seu pedido. A maioria dos sistemas é entregue em até 7 dias úteis.",
  },
  {
    id: "orders-4",
    category: "Pedidos",
    question: "Posso fazer pedidos personalizados?",
    answer:
      "Sim! Você pode solicitar customizações durante o checkout. Descreva suas necessidades e a equipe entrará em contato para discutir os detalhes e prazos.",
  },

  // Reembolsos
  {
    id: "refund-1",
    category: "Reembolsos",
    question: "Como funciona o reembolso?",
    answer:
      "Se você cancelar um pedido, o reembolso é processado automaticamente para o método de pagamento original. O valor retorna em 3-5 dias úteis.",
  },
  {
    id: "refund-2",
    category: "Reembolsos",
    question: "Há taxa de reembolso?",
    answer:
      "Não! Reembolsos são 100% gratuitos. Você recebe o valor total de volta sem descontos.",
  },
  {
    id: "refund-3",
    category: "Reembolsos",
    question: "Posso solicitar reembolso após receber o produto?",
    answer:
      "Reembolsos só são processados para pedidos cancelados antes da entrega. Se você recebeu o produto e não está satisfeito, entre em contato com o suporte para discutir alternativas.",
  },

  // Avaliações
  {
    id: "reviews-1",
    category: "Avaliações",
    question: "Como avalio um produto?",
    answer:
      "Após receber um produto, acesse 'Meus Pedidos' e clique em 'Avaliar'. Selecione uma nota (1-5 estrelas), escreva um comentário e opcionalmente adicione uma foto. Clique em 'Enviar'.",
  },
  {
    id: "reviews-2",
    category: "Avaliações",
    question: "Posso editar ou deletar minha avaliação?",
    answer:
      "Sim! Você pode editar sua avaliação a qualquer momento. Acesse 'Meus Pedidos', encontre a avaliação e clique em 'Editar' ou 'Deletar'.",
  },
  {
    id: "reviews-3",
    category: "Avaliações",
    question: "Minha avaliação foi deletada. Por quê?",
    answer:
      "Avaliações com conteúdo inadequado, ofensivo ou violento são automaticamente removidas. Se acredita que foi um erro, entre em contato com o suporte.",
  },

  // Suporte
  {
    id: "support-1",
    category: "Suporte",
    question: "Como entro em contato com o suporte?",
    answer:
      "Clique em 'Suporte' no header. Você pode enviar mensagens, fazer perguntas e acompanhar respostas em tempo real. Respondemos em até 24 horas.",
  },
  {
    id: "support-2",
    category: "Suporte",
    question: "Qual é o horário de atendimento?",
    answer:
      "Oferecemos suporte 24/7 via chat. Respostas são enviadas dentro de 24 horas. Para assuntos urgentes, mencione na mensagem.",
  },
  {
    id: "support-3",
    category: "Suporte",
    question: "Como reporto um problema?",
    answer:
      "Use o chat de suporte para descrever o problema. Forneça detalhes como: número do pedido, data, o que aconteceu e screenshots se possível. Nossa equipe investigará e resolverá.",
  },

  // Segurança
  {
    id: "security-1",
    category: "Segurança",
    question: "Meus dados estão seguros?",
    answer:
      "Sim! Usamos criptografia de ponta a ponta, servidores seguros e conformidade com padrões internacionais de proteção de dados. Seus dados nunca são compartilhados com terceiros.",
  },
  {
    id: "security-2",
    category: "Segurança",
    question: "Como protejo minha conta?",
    answer:
      "Use uma senha forte (maiúsculas, números, símbolos), não a compartilhe com ninguém e faça logout após usar em computadores públicos. Ative a autenticação de dois fatores se disponível.",
  },
  {
    id: "security-3",
    category: "Segurança",
    question: "Minha conta foi hackeada. O que faço?",
    answer:
      "Mude sua senha imediatamente. Entre em contato com o suporte informando o ocorrido. Nossa equipe investigará e protegerá sua conta.",
  },
];

const categories = Array.from(new Set(faqData.map((item) => item.category)));

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-amber-500/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <HelpCircle className="w-8 h-8 text-red-500" />
            <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">
              Ajuda e Suporte
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Perguntas <span className="text-red-500">Frequentes</span>
          </h1>

          <p className="text-lg text-foreground/70 text-center max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre a Eupe Instencion. Se não
            encontrar o que procura, entre em contato com nosso suporte.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 md:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <Input
              type="text"
              placeholder="Buscar pergunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-foreground/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === null
                  ? "bg-red-500 text-white"
                  : "bg-card text-foreground hover:bg-card/80 border border-border"
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-card text-foreground hover:bg-card/80 border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {filteredFAQ.length > 0 ? (
            <div className="space-y-3">
              {filteredFAQ.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border border-border rounded-lg overflow-hidden bg-card hover:border-red-500/50 transition-colors"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-card/80 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">
                        {item.question}
                      </h3>
                      <p className="text-sm text-foreground/50 mt-1">
                        {item.category}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <ChevronDown className="w-5 h-5 text-red-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border"
                      >
                        <div className="px-6 py-4 text-foreground/80 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma pergunta encontrada
              </h3>
              <p className="text-foreground/60">
                Tente ajustar sua busca ou entre em contato com o suporte.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-r from-red-500/10 to-amber-500/10 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-foreground/70 mb-8">
            Nossa equipe de suporte está disponível 24/7 para ajudá-lo. Entre em contato
            conosco via chat ou email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/suporte"
              className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Contatar Suporte
            </a>
            <a
              href="/"
              className="px-8 py-3 bg-card text-foreground border border-border rounded-lg font-semibold hover:bg-card/80 transition-colors"
            >
              Voltar para Home
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
