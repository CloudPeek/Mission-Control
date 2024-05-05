import { useState } from 'react';

export default function ConfigPage() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [sessionToken, setSessionToken] = useState('');

  const handleSubmit = async () => {
    const apiUrl = 'http://127.0.0.1:8000/self/config/iam';
    const data = {
      access_key_id: accessKey,
      secret_access_key: secretKey,
      session_token: sessionToken
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log('Data submitted successfully:', data);
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

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
              <h2 className="text-base font-semibold leading-7 text-gray-900">IAM Role Input</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                This is where you put in the IAM role for CyberPeek Mission control to query an AWS Account. Please ensure that the role has the necessary permissions to query the account. For more information, please refer to the documentation.
              </p>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">AWS Access Key</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <input
                      type="text"
                      name="accesskey"
                      id="accesskey"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Enter AWS Access Key"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                    />
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">AWS Secret Access Key</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <input
                      type="text"
                      name="secretkey"
                      id="secretkey"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Enter AWS Secret Key"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                    />
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">AWS SESSION TOKEN</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <input
                      type="text"
                      name="sessiontoken"
                      id="sessiontoken"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Enter AWS Session Token"
                      value={sessionToken}
                      onChange={(e) => setSessionToken(e.target.value)}
                    />
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
          <button type="button" className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700" onClick={handleSubmit}>
            Confirm
          </button>
        </div>
          </div>
        </main>
      </div>
    </>
  );
}
