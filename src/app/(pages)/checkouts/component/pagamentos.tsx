"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    MercadoPago: any;
    paymentBrickController: any;
  }
}

interface PagamentoBrickProps {
  publicKey: string;
  preferenceId: string;
}

export default function PagamentoBrick({ publicKey, preferenceId }: PagamentoBrickProps) {
  useEffect(() => {
    if (!window.MercadoPago) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = () => initializeBrick();
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeBrick();
    }
  }, []);

  const initializeBrick = async () => {
    const mp = new window.MercadoPago(publicKey || "YOUR_PUBLIC_KEY", { locale: "es" });
    const bricksBuilder = mp.bricks();

    const settings = {
      initialization: {
        amount: 10000,
        preferenceId,
        payer: {
          firstName: "william",
          lastName: "uteich",
          email: "williamuteich14@gmail.com",
        },
      },
      customization: {
        visual: { style: { theme: "default" } },
        paymentMethods: {
          creditCard: "all",
          atm: "all",
          bankTransfer: "all",
          maxInstallments: 12,
        },
      },
      
      callbacks: {
        onReady: () => {},
        onSubmit: ({ selectedPaymentMethod, formData }: { selectedPaymentMethod: any; formData: any }) => {
          return fetch("/process_payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
            .then((response) => response.json())
            .then(() => {})
            .catch(() => {});
        },
        onError: (error: any) => console.error(error),
      },
    };

    window.paymentBrickController = await bricksBuilder.create(
      "payment",
      "paymentBrick_container",
      settings
    );
  };

  return <div className="p-0" id="paymentBrick_container"></div>;
}
