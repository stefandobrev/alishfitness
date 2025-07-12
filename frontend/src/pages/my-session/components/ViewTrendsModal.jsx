import { XMarkIcon } from '@heroicons/react/24/outline';

import { ActionButton, ButtonVariant } from '@/components/buttons';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { useState, useMemo } from 'react';
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
import { useIsMobile } from '@/common/constants';

const colorScheme = {
  grayBg: '#4a5565 ',
  grayText: '#0d0d0d',
};

export const ViewTrendsModal = ({ onClose, heading, trendsData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');
  const isMobile = useIsMobile();

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoffDate;

    switch (selectedPeriod) {
      case '30 Days':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3 Months':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6 Months':
        cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1 Year':
      default:
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    return trendsData.filter((item) => new Date(item.date) >= cutoffDate);
  }, [trendsData, selectedPeriod]);

  // Format data for the chart
  const chartData = filteredData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    maxWeight: item.maxWeight,
    volume: item.volume,
    reps: item.reps,
  }));

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
        <DialogPanel className='max-h-[80vh] w-full max-w-4xl transform space-y-6 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl transition-all'>
          <div className='flex items-center justify-between p-8 pb-2'>
            <DialogTitle className='truncate text-2xl font-bold text-gray-900'>
              {heading}
            </DialogTitle>
            <button
              onClick={onClose}
              className='text-logored hover:text-logored-hover cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>

          <div
            className={`mx-2 flex ${isMobile ? 'justify-between' : 'justify-center gap-4'} gap-2`}
          >
            {['1 Year', '6 Months', '3 Months', '30 Days'].map((period) => (
              <ActionButton
                key={period}
                className='text-sm'
                variant={
                  selectedPeriod === period
                    ? ButtonVariant.GRAY_DARK
                    : ButtonVariant.WHITE
                }
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </ActionButton>
            ))}
          </div>

          <div className='mb-4 h-96 w-full'>
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
          <div className='grid grid-cols-3 gap-2 p-2'>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='text-logored font-bold'>
                {filteredData.length > 0
                  ? Math.max(...filteredData.map((d) => d.maxWeight)) + ' kg'
                  : '0 kg'}
              </div>
              <div className='text-sm text-gray-600'>Peak Weight</div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='font-bold text-gray-600'>
                {filteredData.length > 0
                  ? Math.max(...filteredData.map((d) => d.volume)) + ' kg'
                  : '0 kg'}
              </div>
              <div className='text-sm text-gray-600'>Peak Volume</div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='font-bold text-black'>{filteredData.length}</div>
              <div className='text-sm text-gray-600'>
                {filteredData.length === 1 ? 'Workout' : 'Workouts'}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
