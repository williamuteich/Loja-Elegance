"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dayOfWeekMap = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

type DashboardOrder = { createdAt: string | Date; status: string; total: number };
interface Props { pedidos: DashboardOrder[] }

export default function OrderDashboard({ pedidos }: Props) {
  const processData = () => {
  const validOrders = pedidos.filter((order) => !["cancelled", "pending"].includes(order.status));

    const dailyData = validOrders.reduce((acc, order) => {
      const dayIndex = new Date(order.createdAt).getDay();
      const day = dayOfWeekMap[dayIndex];

      if (!acc[day]) {
        acc[day] = { total: 0, count: 0 };
      }

  acc[day].total += Number(order.total || 0);
      acc[day].count += 1;

      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return dayOfWeekMap.map((day) => ({
      name: day,
      total: dailyData[day]?.total || 0,
      orders: dailyData[day]?.count || 0,
    }));
  };

  const data = processData();

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-600 mb-4">Vendas por Dia da Semana</h2>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === "Valor Total") {
                return [
                  Number(value).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }),
                  name,
                ];
              }
              return [value, name];
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Valor Total"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#8884d8"
            fill="#8884d8"
            name="Número de Pedidos"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
