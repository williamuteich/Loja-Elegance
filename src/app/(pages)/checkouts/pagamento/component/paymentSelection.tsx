import { Wallet, CreditCard, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSelectionProps {
  pagamento: string;
  setPagamento: (value: string) => void;
}

export default function PaymentSelection({ pagamento, setPagamento }: PaymentSelectionProps) {
  return (
    <Card className="mb-6 border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-pink-600 text-xl font-bold">Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {["dinheiro", "outros"].map((tipo) => (
            <label
              key={tipo}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                pagamento === tipo
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-200 hover:border-pink-200"
              }`}
              onClick={() => setPagamento(tipo)}
            >
              <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  pagamento === tipo ? "border-pink-600 bg-pink-600" : "border-gray-400"
                }`}>
                {pagamento === tipo && <Check className="w-4 h-4 text-white" />}
              </div>
              <div className="flex items-center gap-3">
                {tipo === "dinheiro" ? <Wallet className="w-6 h-6 text-pink-600" /> : <CreditCard className="w-6 h-6 text-pink-600" />}
                <span className="text-lg font-medium">{tipo === "dinheiro" ? "Dinheiro" : "Outras Formas"}</span>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
