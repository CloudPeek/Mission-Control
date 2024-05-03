import React, { useState } from 'react';
import {
  AcademicCapIcon,
  BanknotesIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import './output.css'; // Ensure your CSS files are correctly linked

// Helper function for conditional class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AWSServiceView() {
  // Define steps and their state
 


  // Data for action tiles, which might depend on the current step
  const actions = [
    {
      title: 'AWS S3 Data Bucket',
      href: '#', // Consider using real links or functions for navigation
      icon: AcademicCapIcon,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-50',
      description: 'AWS S3 storage services for data management and storage solutions.'
    },
    {
      title: 'AWS EC2 Instance Info',
      href: '#',
      icon: ClockIcon,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
      description: 'Manage your EC2 instances including configurations, monitoring, and performance.'
    },
    {
      title: 'AWS EBS Volume Details',
      href: '#',
      icon: BanknotesIcon,
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
      description: 'Explore the block storage options with EBS for high-performance needs.'
    },
    {
      title: 'AWS VPC Configuration',
      href: '#',
      icon: UsersIcon,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-50',
      description: 'Setup and manage your virtual private clouds to enhance network solutions.'
    },
  ];

  return (
    <div>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {actions.map((action, index) => (
          <div
            key={action.title}
            className={classNames(
              index === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
              index === 1 ? 'sm:rounded-tr-lg' : '',
              index === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
              index === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
              'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBackground,
                  action.iconForeground,
                  'inline-flex rounded-lg p-3 ring-4 ring-white'
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                <a href={action.href} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
