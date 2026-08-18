'use client';

import { TransactionItem } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/pricing';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryBreakdownChartProps {
  items: TransactionItem[];
}

const COLORS = ['#16301F', '#C7F13B', '#E0733A', '#20402E', '#EAFAC4', '#12210C'];

export function CategoryBreakdownChart({ items }: CategoryBreakdownChartProps) {
  const aggregated: Record<string, { weight: number; total: number }> = {};

  items.forEach((item) => {
    const catName = item.category?.name || 'Lainnya';
    const shortName = catName.split(' (')[0];

    if (!aggregated[shortName]) {
      aggregated[shortName] = { weight: 0, total: 0 };
    }
    aggregated[shortName].weight += Number(item.weight_kg);
    aggregated[shortName].total += Number(item.subtotal);
  });

  const chartData = Object.entries(aggregated).map(([name, val]) => ({
    name,
    weight: val.weight,
    value: val.total,
  }));

  if (chartData.length === 0) {
    return (
      <div className="card-kraft p-6 text-center flex flex-col items-center justify-center min-h-[260px]">
        <p className="text-sm font-semibold text-gray-500">Belum Ada Data Kategori</p>
        <p className="text-xs text-gray-400 mt-1">
          Lakukan setoran sampah untuk melihat komposisi daur ulang kopi Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="card-kraft p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-display font-extrabold text-forest-900">
            Komposisi Pendapatan Sampah
          </h3>
          <p className="text-xs text-gray-600 font-sans">
            Breakdown berdasarkan kategori jenis kemasan yang disetor
          </p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any, props: any) => [
                `${formatRupiah(Number(value))} (${props.payload.weight} kg)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: '#16301F',
                borderRadius: '12px',
                color: '#F6F2E7',
                fontSize: '12px',
                border: '1px solid #C7F13B',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
