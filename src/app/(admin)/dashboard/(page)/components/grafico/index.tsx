"use client"
import { Order } from '@/utils/types/order';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = [
    '#4E79A7', // Azul suave
    '#F28E2B', // Laranja queimado
    '#E15759', // Vermelho coral
    '#76B7B2', // Verde água
    '#59A14F'  // Verde vibrante
  ];
  

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: { cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number, index: number }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function GraficoDashboard({pedidos}: {pedidos: Order[]}) {
    const validOrders = pedidos.filter(order => 
        !['cancelled', 'pending'].includes(order.status)
    );

    const productCount = validOrders
        .flatMap(p => p.items)
        .reduce((acc, item) => {
            const key = item.product.name;
            acc[key] = (acc[key] || 0) + item.quantity;
            return acc;
        }, {} as Record<string, number>);

    const chartData = Object.entries(productCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return (
        <div>
            <h2 className="text-lg font-bold text-gray-600 mb-4">Mais Comprados</h2>

            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-col gap-2">
                {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm">
                            {entry.name} - {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}