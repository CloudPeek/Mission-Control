import React, { useEffect, useState } from 'react';
import { useStep } from '../StepContext';  // Ensure correct import path

function DetailedView() {
  const { currentStep } = useStep();
  const [details, setDetails] = useState([]);

  // Updated keys to match currentStep directly without prefix for simplicity
  const detailedData = {
    'Overview': [
      { resourceId: 'res-001', resourceType: 'S3', metric: '450 TB', cost: '$120/day', issuesFound: 'None', details: 'More Info' },
      { resourceId: 'res-002', resourceType: 'EC2', metric: '150 Instances', cost: '$300/day', issuesFound: '2', details: 'More Info' },
    ],
    'Storage': [
      { resourceId: 'res-010', resourceType: 'S3', metric: '500 TB', cost: '$130/day', issuesFound: 'None', details: 'More Info' },
      { resourceId: 'res-011', resourceType: 'EBS', metric: '200 TB', cost: '$90/day', issuesFound: '1', details: 'More Info' },
    ],
    'Compute': [
      { resourceId: 'res-020', resourceType: 'EC2', metric: '250 Instances', cost: '$400/day', issuesFound: '3', details: 'More Info' },
      { resourceId: 'res-021', resourceType: 'Lambda', metric: '1000 Functions', cost: '$50/day', issuesFound: '0', details: 'More Info' },
    ],
    // Additional steps can be defined similarly
  };

  useEffect(() => {
    setDetails(detailedData[currentStep] || []);
  }, [currentStep, detailedData]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Resource ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Resource Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Metric</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Issues Found</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">More Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {details.map((detail, index) => (
                  <tr key={index}>  
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{detail.resourceId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.resourceType}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.metric}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.cost}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.issuesFound}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedView;
