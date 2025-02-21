"use client"
import { useEffect, useState } from "react";

export default function PagamentoBrick() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Verifica se o script já foi carregado
    if (isScriptLoaded) return;

    // Inicializa o script MercadoPago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Marca que o script foi carregado
      setIsScriptLoaded(true);

      // Inicializa o MercadoPago SDK
      const mp = new window.MercadoPago('TEST-767d0973-fd90-4fda-8773-6af0531356e7', {
        locale: 'pt',
      });
      const bricksBuilder = mp.bricks();

      const renderPaymentBrick = async (bricksBuilder) => {
        const settings = {
          initialization: {
            amount: 10000,
            preferenceId: '<PREFERENCE_ID>',
            payer: {
              firstName: '',
              lastName: '',
              email: '',
            },
          },
          customization: {
            visual: {
              style: {
                theme: 'default',
              },
            },
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              atm: 'all',
              maxInstallments: 12,
            },
          },
          callbacks: {
            onReady: () => {
              // Callback chamado quando o Brick está pronto
            },
            onSubmit: ({ selectedPaymentMethod, formData }) => {
              // Callback chamado quando o usuário submete o pagamento
              return new Promise((resolve, reject) => {
                fetch('/process_payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                  .then((response) => response.json())
                  .then((response) => {
                    // Processa a resposta do pagamento
                    resolve();
                  })
                  .catch((error) => {
                    // Lida com a resposta de erro
                    reject();
                  });
              });
            },
            onError: (error) => {
              // Callback para todos os erros do Brick
              console.error(error);
            },
          },
        };

        // Cria e renderiza o Brick de pagamento
        window.paymentBrickController = await bricksBuilder.create(
          'payment',
          'paymentBrick_container',
          settings
        );
      };

      renderPaymentBrick(bricksBuilder);
    };

    // Limpeza do script quando o componente for desmontado
    return () => {
      document.body.removeChild(script);
    };
  }, [isScriptLoaded]); // Dependência do estado para garantir que o script seja carregado uma vez

  return (
    <div>
      <div id="paymentBrick_container"></div>
    </div>
  );
}
