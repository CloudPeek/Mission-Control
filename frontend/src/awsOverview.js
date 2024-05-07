
import React, { useState, useEffect } from 'react';
import { fetchBillingDetails } from './components/dataparsers/billing'; // Adjust the import path as necessary

export default function Home() {
  const [stats, setStats] = useState([
    { id: 1, name: 'Number of accounts monitored', value: '1' },
    { id: 3, name: 'Number of Services Used', value: 'Loading...' },
    { id: 4, name: 'Best Practice & Secruity improvements detected', value: '43' },
    { id: 6, name: 'Total Cost', value: 'Loading...' }, // Added Total Cost stat
  ]);

  useEffect(() => {
    async function loadBillingStats() {
      const billingDetails = await fetchBillingDetails();
      const numberOfServices = billingDetails.length;
      const totalCost = billingDetails.reduce((acc, detail) => acc + parseFloat(detail.TotalCost), 0).toFixed(2);

      // Update the stats with real data
      setStats(prevStats => prevStats.map(stat => {
        if (stat.name === 'Number of Services Used') {
          return { ...stat, value: numberOfServices.toString() };
        } else if (stat.name === 'Total Cost') {
          return { ...stat, value: `$${totalCost}` }; // Format as currency
        }
        return stat;
      }));
    }

    loadBillingStats();
  }, []);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Cloud Peek Mission Control Platform
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              The platform teams front door into there AWS environment.
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Your environment at a glance.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
