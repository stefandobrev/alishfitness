import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const colorScheme = {
  grayBg: '#4a5565 ',
  grayText: '#0d0d0d',
};

export const ViewTrendsModal = ({ onClose, heading, trendsData }) => {
  // Format data for the chart
  const chartData = trendsData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    maxWeight: item.maxWeight,
    volume: item.volume,
    reps: item.reps,
  }));

  console.log({ trendsData });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Get the reps from the first payload item
      const repsData = payload[0]?.payload?.reps;

      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold text-black'>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className='text-sm'>
              {entry.name}: {entry.value}
              {entry.name === 'Max Weight' && ` kg × ${repsData} reps`}
              {entry.name === 'Volume' && ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={true} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
        <DialogPanel
          className={`w-full max-w-4xl transform space-y-6 rounded-xl border border-gray-200 bg-white shadow-2xl transition-all`}
        >
          <DialogTitle className='mb-6 flex justify-center truncate p-8 text-2xl font-bold text-gray-900'>
            {heading}
          </DialogTitle>

          <div className='mb-6 h-96 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposedChart
                data={chartData}
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis
                  dataKey='date'
                  tick={{ fontSize: 12, fill: '#000000' }}
                  axisLine={{ stroke: colorScheme.grayBg }}
                  tickLine={{ stroke: colorScheme.grayBg }}
                />
                <YAxis
                  yAxisId='left'
                  orientation='left'
                  tick={{ fontSize: 12, fill: 'var(--logored-hover)' }}
                  axisLine={{ stroke: 'var(--logored)' }}
                  tickLine={{ stroke: 'var(--logored)' }}
                  label={{
                    value: 'Weight (kg)',
                    angle: -90,
                    position: 'insideLeft',
                    style: {
                      textAnchor: 'middle',
                      fill: 'var(--logored-hover)',
                    },
                  }}
                />
                <YAxis
                  yAxisId='right'
                  orientation='right'
                  tick={{ fontSize: 12, fill: colorScheme.grayBg }}
                  axisLine={{ stroke: colorScheme.grayBg }}
                  tickLine={{ stroke: colorScheme.grayBg }}
                  label={{
                    value: 'Volume (kg)',
                    angle: 90,
                    position: 'insideRight',
                    style: { textAnchor: 'middle', fill: colorScheme.grayBg },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Volume bars */}
                <Bar
                  yAxisId='right'
                  dataKey='volume'
                  fill={colorScheme.grayBg}
                  name='Volume'
                  opacity={0.8}
                  radius={[0, 0, 0, 0]}
                />

                {/* Weight progression line */}
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey='maxWeight'
                  stroke='var(--logored)'
                  strokeWidth={2}
                  dot={{ fill: 'var(--logored)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'var(--logored-hover)' }}
                  name='Max Weight'
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Summary stats */}
          <div className='grid grid-cols-3 gap-4 p-2'>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='text-logored font-bold'>
                {Math.max(...trendsData.map((d) => d.maxWeight)) + ' kg'}
              </div>
              <div className='text-sm text-gray-600'>Peak Weight</div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='font-bold text-gray-600'>
                {Math.max(...trendsData.map((d) => d.volume)) + ' kg'}
              </div>
              <div className='text-sm text-gray-600'>Peak Volume</div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='font-bold text-black'>{trendsData.length}</div>
              <div className='text-sm text-gray-600'>
                {trendsData.length === 1 ? 'Workout' : 'Workouts'}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
