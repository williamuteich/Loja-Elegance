'use client'
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatusInfo {
  kind: "success" | "pending" | "failure";
  title: string;
  desc: string;
  badge: {
    icon: string;
    label: string;
  };
}

interface TransactionDetails {
  paymentId: string;
  preferenceId: string;
  merchantOrderId: string;
  status: string;
}

interface OrderDetails {
  id: string;
  total: number;
  subtotal: number;
  shippingPrice: number;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    imageUrl?: string;
  }>;
}

interface ValidationResponse {
  canView: boolean;
  statusInfo?: StatusInfo;
  order?: OrderDetails;
  transactionDetails?: TransactionDetails;
  error?: string;
  message?: string;
}

export default function RetornoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [validationData, setValidationData] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateReturn = async () => {
      try {
        setLoading(true);
        
        // Construir URL com todos os parâmetros recebidos
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const response = await fetch(`/api/valida-retorno?${params.toString()}`);
        const data: ValidationResponse = await response.json();

        if (!response.ok) {
          // Se já foi visualizado ou erro, redirecionar para /order
          if (response.status === 403 || !data.canView) {
            router.push('/order');
            return;
          }
          setError(data.message || data.error || 'Erro ao validar pagamento');
          return;
        }

        setValidationData(data);
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error('Erro na validação:', err);
      } finally {
        setLoading(false);
      }
    };

    validateReturn();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-700"></div>
            <span className="ml-3 text-gray-600">Validando pagamento...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-red-700">Erro</h1>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/order" className="inline-flex items-center justify-center rounded-md bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800">
              Ver meus pedidos
            </Link>
            <Link href="/" className="inline-flex items-center justify-center rounded-md border border-black px-5 py-2.5 text-sm font-medium text-black hover:bg-black/5">
              Voltar à loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!validationData) {
    return null;
  }

  const { statusInfo, order, transactionDetails } = validationData;

  // Cor do badge baseada no status
  const getBadgeColor = (kind: string) => {
    switch (kind) {
      case 'success': return 'bg-green-600';
      case 'failure': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white ${getBadgeColor(statusInfo?.kind || 'pending')}`}>
            {statusInfo?.badge.icon} {statusInfo?.badge.label}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-pink-700">{statusInfo?.title}</h1>
        <p className="mt-2 text-sm text-black/70">{statusInfo?.desc}</p>

        {order && (
          <div className="mt-6 rounded-md border border-black/10 bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-black">Resumo do Pedido</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-black/60">Pedido:</span>
                <span className="font-medium text-black">#{order.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Subtotal:</span>
                <span className="font-medium text-black">R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Frete:</span>
                <span className="font-medium text-black">R$ {order.shippingPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-black font-semibold">Total:</span>
                <span className="font-bold text-black">R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        )}

        {transactionDetails && (
          <div className="mt-4 rounded-md border border-black/10 bg-white p-4">
            <h3 className="mb-2 text-sm font-medium text-black">Detalhes da transação</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-black/60">Preference ID:</span>
                <span className="max-w-[200px] truncate font-medium text-black">{transactionDetails.preferenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Pagamento:</span>
                <span className="max-w-[200px] truncate font-medium text-black">{transactionDetails.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Merchant Order:</span>
                <span className="max-w-[200px] truncate font-medium text-black">{transactionDetails.merchantOrderId}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/order" className="inline-flex items-center justify-center rounded-md bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800">
            Meus pedidos
          </Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-md border border-black px-5 py-2.5 text-sm font-medium text-black hover:bg-black/5">
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  );
}