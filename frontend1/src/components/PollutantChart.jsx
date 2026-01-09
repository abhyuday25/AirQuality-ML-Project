import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PollutantChart({ data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name, value: parseFloat((value * 100).toFixed(2))
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9ca3af'}} />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}