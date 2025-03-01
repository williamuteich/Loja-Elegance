"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PagamentoBrickProps {
  publicKey: string;
  preferenceId: string;
}

export default function PagamentoBrick({ publicKey, preferenceId }: PagamentoBrickProps) {
  const scriptAdded = useRef(false);
  const brickController = useRef<any>(null);

  useEffect(() => {
    const initializeBrick = async () => {
      const mp = new window.MercadoPago(publicKey, { locale: "es" });
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
          onSubmit: ({ formData }: { formData: any }) => {
            console.log("Dados enviados:", formData);
            
            return fetch("/process_payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            })
            
              .then((response) => response.json())
              .catch(() => {});
          },
          onError: (error: any) => console.error(error),
        },
      };

      brickController.current = await bricksBuilder.create(
        "payment",
        "paymentBrick_container",
        settings
      );
    };

    if (!window.MercadoPago && !scriptAdded.current) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = () => {
        initializeBrick();
      };
      document.body.appendChild(script);
      scriptAdded.current = true;
    } else if (window.MercadoPago && !brickController.current) {
      initializeBrick();
    }

    return () => {
      if (brickController.current) {
        brickController.current.unmount();
        brickController.current = null;
      }
    };
  }, [publicKey, preferenceId]);

  return <div id="paymentBrick_container" className="p-0"></div>;
}