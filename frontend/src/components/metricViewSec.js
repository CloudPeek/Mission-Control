import React, { useEffect, useState } from 'react';
import { useStep } from '../StepContext';  // Adjust the import path as necessary

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function MetricView() {
  const { currentStep } = useStep();
  const [data, setData] = useState([]);

  // Update with your actual API or data fetching logic
  const metricsData = {
    'Overview': [
      { name: 'Total Resources', value: '120', change: '+5%', changeType: 'positive' },
      { name: 'Total Cost', value: '$350 per day', change: '-1%', changeType: 'negative' },
    ],
    'Storage': [
      { name: 'Storage Used', value: '450 TB', change: '+2.5%', changeType: 'positive' },
      { name: 'Cost Per Month', value: '$85', change: '+0.5%', changeType: 'positive' },
    ],
    'Compute': [
      { name: 'Compute Units', value: '1500 vCPUs', change: '+10%', changeType: 'positive' },
      { name: 'Monthly Compute Cost', value: '$200', change: '-2%', changeType: 'negative' },
    ],
    // Add other steps as necessary
  };

  useEffect(() => {
    // Simulate data fetching
    setData(metricsData[currentStep] || []);
  }, [currentStep]);

  return (
    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((stat, index) => (
        <div
          key={index}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
          <dd
            className={classNames(
              stat.changeType === 'negative' ? 'text-rose-600' : 'text-green-600',
              'text-xs font-medium'
            )}
          >
            {stat.change}
          </dd>
          <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default MetricView;
