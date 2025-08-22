import Link from "next/link";

function mapStatus(statusRaw: string | null): { kind: "success" | "pending" | "failure"; title: string; desc: string } {
  const s = (statusRaw || "").toLowerCase();
  if (["success", "approved", "paid"].includes(s)) {
    return {
      kind: "success",
      title: "Pagamento aprovado!",
      desc: "Recebemos seu pagamento. Você verá o pedido em Meus pedidos e também receberá um e‑mail de confirmação.",
    };
  }
  if (["pending", "in_process"].includes(s)) {
    return {
      kind: "pending",
      title: "Pagamento em análise",
      desc: "Seu pagamento está sendo processado. Atualizaremos o status em breve e você poderá acompanhar em Meus pedidos.",
    };
  }
  return {
    kind: "failure",
    title: "Pagamento não concluído",
    desc: "Não foi possível concluir o pagamento. Você pode tentar novamente ou escolher outra forma de pagamento.",
  };
}

function getBadge(kind: "success" | "pending" | "failure") {
  if (kind === "success") {
    return {
      label: "Aprovado",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.59a.75.75 0 1 0-1.22-.86l-3.22 4.56-1.48-1.48a.75.75 0 1 0-1.06 1.06l2.1 2.1a.75.75 0 0 0 1.15-.09l3.79-5.29Z" clipRule="evenodd" />
        </svg>
      ),
    };
  }
  if (kind === "pending") {
    return {
      label: "Em análise",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .199.079.39.22.53l3.75 3.75a.75.75 0 1 0 1.06-1.06l-3.53-3.53V6Z" clipRule="evenodd" />
        </svg>
      ),
    };
  }
  return {
    label: "Reprovado",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm2.47 5.28a.75.75 0 0 1 0 1.06L13.06 10l1.41 1.41a.75.75 0 0 1-1.06 1.06L12 11.06l-1.41 1.41a.75.75 0 1 1-1.06-1.06L10.94 10 9.53 8.59a.75.75 0 1 1 1.06-1.06L12 8.94l1.41-1.41a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
      </svg>
    ),
  };
}

function getParam(searchParams: { [key: string]: string | string[] | undefined }, key: string): string | null {
  const v = searchParams[key];
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default function RetornoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const statusParam = getParam(searchParams, "status") || getParam(searchParams, "collection_status") || getParam(searchParams, "status_detail");
  const info = mapStatus(statusParam);

  const preferenceId = getParam(searchParams, "preference_id") || undefined;
  const paymentId = getParam(searchParams, "payment_id") || getParam(searchParams, "collection_id") || undefined;
  const merchantOrderId = getParam(searchParams, "merchant_order_id") || undefined;

  const badge = getBadge(info.kind);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-700 px-3 py-1 text-xs font-medium text-white">
            {badge.icon}
            {badge.label}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-pink-700">{info.title}</h1>
        <p className="mt-2 text-sm text-black/70">{info.desc}</p>

        <div className="mt-6 rounded-md border border-black/10 bg-white p-4">
          <h3 className="mb-2 text-sm font-medium text-black">Detalhes da transação</h3>
          <div className="space-y-1 text-xs">
            {preferenceId && (
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
            )}
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