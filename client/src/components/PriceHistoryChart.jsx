import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PriceHistoryChart({ data, height = 200 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No price history available
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((point, index) => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    yesProbability: Math.round(point.yes_probability * 100),
    yesPool: point.yes_pool,
    noPool: point.no_pool,
    totalPool: point.yes_pool + point.no_pool
  }));

  return (
    <div className="w-full">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Probability Over Time</h4>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value}%`, 
              name === 'yesProbability' ? 'YES Probability' : name
            ]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="yesProbability" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Pool sizes: YES {data[data.length - 1]?.yes_pool || 0} | NO {data[data.length - 1]?.no_pool || 0}
      </div>
    </div>
  );
}

export default PriceHistoryChart;
