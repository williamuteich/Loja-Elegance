"use client"
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

type DashboardOrder = { status?: string; items?: Array<{ name?: string; quantity?: number } | null | undefined> };

export default function GraficoDashboard({ pedidos }: { pedidos: DashboardOrder[] }) {
    const safePedidos = Array.isArray(pedidos) ? pedidos : [];
    let chartData: { name: string; value: number }[] = [];
    try {
        const validOrders = safePedidos.filter(order => !['cancelled', 'pending'].includes(order?.status || ''));
        const productCount = validOrders
            .flatMap(p => (Array.isArray(p?.items) ? p!.items as any[] : []))
            .filter(Boolean)
            .reduce((acc, item: any) => {
                const key = (item && typeof item === 'object' && 'name' in item && item.name) ? String(item.name) : 'Produto';
                const qty = Number((item && typeof item === 'object' && 'quantity' in item) ? item.quantity : 0) || 0;
                acc[key] = (acc[key] || 0) + qty;
                return acc;
            }, {} as Record<string, number>);
        chartData = Object.entries(productCount)
            .map(([name, value]) => ({ name, value: Number(value) || 0 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    } catch (e) {
        if (typeof window !== 'undefined') {
            console.error('Erro ao montar gráfico de produtos mais comprados:', e);
        }
        chartData = [];
    }

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