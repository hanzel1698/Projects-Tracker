'use client';

import { Project, DesignStatus, DESIGN_STATUS_COLORS } from '@/types/project';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardChartProps {
  projects: Project[];
}

export function DashboardChart({ projects }: DashboardChartProps) {
  // Count projects by design status
  const statusCounts = Object.values(DesignStatus).map((status) => {
    const count = projects.filter((p) => p.designStatus === status).length;
    return {
      status: status.replace(/^\d+\s/, ''), // Remove number prefix for display
      fullStatus: status,
      count,
      color: DESIGN_STATUS_COLORS[status],
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.fullStatus}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} {payload[0].value === 1 ? 'project' : 'projects'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="min-w-[800px] h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusCounts}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="status"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {statusCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
