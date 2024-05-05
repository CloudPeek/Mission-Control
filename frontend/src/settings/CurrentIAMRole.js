import React, { useEffect, useState } from 'react';

export function CurrentIAMRole() {
  // State to store IAM details
  const [details, setDetails] = useState(null);

  // Effect to fetch data on component mount
  useEffect(() => {
    async function fetchIAMData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/self/config/getiam');
        const data = await response.json();
        console.log("Fetched IAM data:", data);
        
        // Set the data directly into the state
        setDetails(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchIAMData();
  }, []);

  if (!details) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">IAM Role Details</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                This page details the IAM Role used to access your cloud resources.
              </p>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">AWS Account Accessed</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {details.Account}
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">User Name</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {details.UserId}
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">ARN</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {details.Arn}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
