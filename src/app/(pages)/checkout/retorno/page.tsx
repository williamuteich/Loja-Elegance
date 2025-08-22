'use client'
import Link from "next/link";
import { useSearchParams } from 'next/navigation'

export default function RetornoPage() {
  const searchParams = useSearchParams();

  console.log("searchParams>>>>>>>>>>>>>>>>>:", searchParams);
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-700 px-3 py-1 text-xs font-medium text-white">
            {/*badge.icon}
            {badge.label*/}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-pink-700">{/*info.title*/}</h1>
        <p className="mt-2 text-sm text-black/70">{/*info.desc*/}</p>

        <div className="mt-6 rounded-md border border-black/10 bg-white p-4">
          <h3 className="mb-2 text-sm font-medium text-black">Detalhes da transação</h3>
          <div className="space-y-1 text-xs">
            {/*preferenceId && (
              <div className="flex justify-between">
                <span className="text-black/60">Preference ID:</span>
                <span className="max-w-[200px] truncate font-medium text-black">{preferenceId}</span>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-black/60">Pagamento:</span>
                <span className="max-w-[200px] truncate font-medium text-black">{paymentId}</span>
              </div>
            )}
            {merchantOrderId && (
              <div className="flex justify-between">
                <span className="text-black/60">Merchant Order:</span>
                <span className="max-w-[200px] truncate font-medium text-black">{merchantOrderId}</span>
              </div>
            )*/}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/profile" className="inline-flex items-center justify-center rounded-md bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800">
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