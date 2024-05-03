import React, { useEffect, useState } from 'react';

function DetailedView() {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/operations/aws/s3');
        const data = await response.json();
        console.log("Fetched data:", data);
        const dataObject = JSON.parse(data);

        // Convert the object of objects into an array of objects, including the name
        const detailArray = Object.entries(dataObject).map(([key, value]) => ({
          Name: key,
          TotalSizeGB: value.TotalSizeGB || 'No data',
          ServerAccessLogging: value.ServerAccessLogging || 'No data',
          EncryptionAlgorithm: value.SSEAlgorithm || 'None', // Accessing the SSEAlgorithm directly
          AccountID: value.AccountID || 'No data',
          CreationDate: value.CreationDate || 'No data',
        }));
        console.log("Processed detailArray:", detailArray); // Log to debug and ensure data structure is as expected
        setDetails(detailArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Bucket Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Size (GB)</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Server Access Logging</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Encryption Algorithm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {details.map((detail, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{detail.Name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.TotalSizeGB}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.ServerAccessLogging}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{detail.EncryptionAlgorithm}</td>
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
