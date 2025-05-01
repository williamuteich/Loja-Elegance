"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  SaveIcon,
} from "lucide-react";
import Flag from "react-world-flags";
import Link from "next/link";
import ConfirmPayment from "./confirmPayment";
import ResumoPedido from "../../component/resumoPedido";
import CarrinhoVazio from "../../component/carrinhoVazio";
import { CartItem, useCart } from "@/context/cartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { PickupLocation } from "../../../../../../types/pickupLocation";

type Props = {
  cart: CartItem[];
  pagamento: string;
  finalCashInfo: { cashInHand: string; change: number };
  pagamentoDetalhado: string;
  pickupLocation: PickupLocation;
};

type Country = {
  code: string;
  name: string;
  dial: string;
};

const COUNTRIES: Country[] = [
  { code: "BR", name: "Brasil", dial: "+55" },
  { code: "UY", name: "Uruguay", dial: "+598" },
  { code: "AR", name: "Argentina", dial: "+54" },
];

export default function ConfirmOrderLayout({
  cart,
  pagamento,
  finalCashInfo,
  pagamentoDetalhado,
  pickupLocation,
}: Props) {
  const { data: session } = useSession();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("UY");
  const [editPhone, setEditPhone] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessLayout, setShowSuccessLayout] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.userID) return; // só faz a chamada se tiver o id
      try {
        const response = await fetch(`/api/privada/addresses?userID=${session.user.userID}`, { credentials: "include" });
        const data = await response.json();

        if (data) {
          setUserData({ name: data.name || "", email: data.email || "" });

          if (data.telefone) {
            const tel = data.telefone.replace(/\s/g, "");
            const foundCountry = COUNTRIES.find((country) =>
              tel.startsWith(country.dial.replace(/\s/g, ""))
            );

            if (foundCountry) {
              setPhone(tel.slice(foundCountry.dial.length));
              setCountryCode(foundCountry.code);
            } else {
              setPhone(tel);
              setCountryCode("UY");
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [session]);

  const handleToggleEdit = async () => {
    if (editPhone) {
      setSavingPhone(true);
      try {
        const dial = COUNTRIES.find((c) => c.code === countryCode)!.dial.replace(/\s/g, "");
        const cleanPhone = phone.replace(/\D/g, "");
        const full = `${dial}${cleanPhone}`;

        const response = await fetch("/api/privada/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            telefone: full,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al guardar número");
        }

        toast.success("¡Número actualizado con éxito!");
      } catch (error) {
        console.error("Error al guardar número:", error);
        toast.error((error as Error).message || "Error al guardar número");
      } finally {
        setSavingPhone(false);
      }
    }
    setEditPhone(!editPhone);
  };

  const handleSubmitOrder = async () => {
    if (!phone) {
      toast.error("Por favor, ingresa un número de teléfono válido");
      return;
    }

    setIsLoading(true);

    try {
      if (editPhone) await handleToggleEdit();

      const dial = COUNTRIES.find((c) => c.code === countryCode)!.dial.replace(/\s/g, "");
      const cleanPhone = phone.replace(/\D/g, "");
      const fullPhone = `${dial}${cleanPhone}`;

      const body: any = {
        cart,
        pagamento,
        pickupLocation,
        telefone: fullPhone,
        userID: session?.user?.userID || "",
        email: userData.email || "",
      };

      if (pagamentoDetalhado) {
        body.pagamentoDetalhado = pagamentoDetalhado;
      } else {
        body.finalCashInfo = finalCashInfo;
      }

      const orderResponse = await fetch("/api/privada/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Error al procesar el pedido");
      }

      setOrderStatus("¡Pedido confirmado! Está siendo procesado.");
      localStorage.removeItem("cart");
      clearCart();
      setShowSuccessLayout(true);
    } catch (error) {
      console.error("Error en el pedido:", error);
      setOrderStatus(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccessLayout) return <ConfirmPayment />;
  if (cart.length === 0) return <CarrinhoVazio />;

  const totalPedido = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-pink-600 mb-6 border-b pb-4">
          Confirmación Final del Pedido
        </h2>

        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
            <PhoneIcon className="w-5 h-5 text-pink-600" /> Número de Teléfono
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative w-full sm:w-2/2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={!editPhone}
                className={`appearance-none pr-8 pl-10 py-2 border rounded-lg bg-white w-full ${editPhone ? "cursor-pointer" : "cursor-not-allowed bg-gray-100"
                  }`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute left-2 top-2">
                <Flag code={countryCode} className="w-6 h-4 rounded-sm border" />
              </div>
            </div>
            <div className="relative w-full">
              <input
                type="tel"
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 ${editPhone
                    ? "border-pink-400 focus:ring-pink-400 bg-white"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
                placeholder="Ej: 099123456"
                value={phone}
                disabled={!editPhone || savingPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 15);
                  setPhone(value);
                }}
              />
              <button
                onClick={handleToggleEdit}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                title={editPhone ? "Guardar número" : "Editar número"}
              >
                {savingPhone ? (
                  <span className="animate-spin">⌛</span>
                ) : editPhone ? (
                  <SaveIcon className="w-5 h-5" />
                ) : (
                  <PencilIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
            <CreditCardIcon className="w-5 h-5 text-pink-600" /> Método de Pago
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <strong className="text-pink-700">
                {pagamento === "dinheiro" ? "Efectivo" : pagamentoDetalhado}
              </strong>
            </div>
            {pagamento === "dinheiro" && (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">
                    {totalPedido.toLocaleString("es-UY", {
                      style: "currency",
                      currency: "UYU",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Entregado:</span>
                  <span className="font-medium">
                    {Math.max(totalPedido, Number(finalCashInfo.cashInHand)).toLocaleString(
                      "es-UY",
                      { style: "currency", currency: "UYU" }
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Vuelto:</span>
                  <span className="font-semibold">
                  {totalPedido > Number(finalCashInfo.cashInHand) ? (
                    <span>0</span>
                  ) : (
                    Math.max(0, Number(finalCashInfo.change || 0)).toLocaleString("es-UY", {
                      style: "currency",
                      currency: "UYU",
                    })
                  )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
            <MapPinIcon className="w-5 h-5 text-pink-600" /> Lugar de Retiro
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-800">{pickupLocation.title}</p>
            <p className="text-sm text-gray-500 mt-1">{pickupLocation.description}</p>
          </div>
        </div>

        {orderStatus && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700 font-medium">{orderStatus}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 border-t border-gray-100 pt-6">
          <Link href="/checkouts" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg">
              <ArrowLeftIcon className="w-5 h-5" /> Modificar Pedido
            </button>
          </Link>
          <button
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleSubmitOrder}
            disabled={isLoading || !phone}
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Confirmar Pedido
              </>
            )}
          </button>
        </div>
      </div>

      <div className="md:sticky md:top-8 flex-1">
        <ResumoPedido cart={cart} />
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}