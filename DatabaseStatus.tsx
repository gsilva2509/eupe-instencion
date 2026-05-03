import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/trpc/system.dbStatus');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({ error: String(error) });
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  if (loading) return <div className="p-8">Carregando status...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Status do Banco de Dados</h1>
        
        <Card className="bg-gray-900 border-red-500 p-6">
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(status, null, 2)}
          </pre>
        </Card>

        <div className="mt-8 p-4 bg-yellow-900 border border-yellow-500 rounded">
          <p className="text-yellow-200">
            Se você vê um erro aqui, copie a mensagem de erro e envie para o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
