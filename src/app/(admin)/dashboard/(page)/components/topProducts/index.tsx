'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface ProductView {
  productId: string;
  productName: string;
  views: number;
}

export default function TopProducts() {
  const [topProducts, setTopProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('/api/analytics/product-views');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro na API');
        }

        const data = await response.json();

        const sortedProducts = data
          .map((p: any) => ({
            productId: p.productId,
            productName: p.productName,
            views: p.count
          }))
          .sort((a: any, b: any) => b.views - a.views)
          .slice(0, 5);

        setTopProducts(sortedProducts);
      } catch (error) {
        console.error('Erro no fetchTopProducts:', error);
        setError('Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Produtos Mais Acessados</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Produtos Mais Acessados</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Produtos Mais Acessados</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProducts}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="productName"
              type="category"
              width={95}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => [`${value} visualizações`, '']} />
            <Bar
              dataKey="views"
              name="Visualizações"
              fill="#4f46e5"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}