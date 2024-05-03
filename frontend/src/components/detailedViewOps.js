import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { useStep } from '../StepContext';
import { fetchStorageCombinedDetails, fetchS3Details, fetchEbsDetails } from './dataparsers/storage';
import { fetchComputeCombinedDetails, fetchEC2Details } from './dataparsers/compute';
import {typography}  from '@tailwindcss/typography';

function DetailedView() {
    const { currentStep } = useStep();
    const [details, setDetails] = useState([]);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [detailedInfo, setDetailedInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            let data;
            switch (currentStep) {
                case 'Storage':
                    data = await fetchStorageCombinedDetails();
                    break;
                case 'Compute':
                    data = await fetchComputeCombinedDetails();
                    break;
                default:
                    data = []; // No data for other tabs
            }
            setDetails(data);
        }
        loadData();
    }, [currentStep]);

    const handleOpenModal = async (detail) => {
        setSelectedDetail(detail);
        let info;
        if (detail.Service === 'S3') {
            info = await fetchS3Details();
        } else if (detail.Service === 'EBS') {
            info = await fetchEbsDetails();
        } else if (detail.Service === 'EC2') {
            info = await fetchEC2Details();
        }
        console.log("Fetched details for modal:", info); // Check what is being fetched
        const foundDetail = info.find(d => d.Name === detail.ResourceName) || {};
        console.log("Found detail for modal:", foundDetail); // Check what is being found
        setDetailedInfo(foundDetail);
        setIsModalOpen(true);
    };
    
    

    const renderTable = (details) => {
        if (!details.length) return <p>No data available for this section.</p>;
        const headers = details[0] ? Object.keys(details[0]).filter(key => key !== 'Service') : [];
        return (
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{header.replace(/([A-Z])/g, ' $1').trim()}</th>
                        ))}
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">More Info</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {details.map((detail, index) => (
                        <tr key={index}>
                            {headers.map(header => (
                                <td key={header} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{detail[header]}</td>
                            ))}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <button onClick={() => handleOpenModal(detail)}>More Info</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8">
                {renderTable(details)}
            </div>
            {isModalOpen && (
                <Transition.Root show={isModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
                        <div className="fixed inset-0 overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                        <Dialog.Panel className="pointer-events-auto w-screen max-w-fit ml-auto">
                                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                                <div className="px-4 py-6 sm:px-6">
                                                    <Dialog.Title className="text-lg font-medium text-gray-900 whitespace-wrap">Detailed Info</Dialog.Title>
                                                    <div className="mt-2">
                                                        {selectedDetail ? (
                                                            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                                                <div className="px-4 py-6 sm:px-6">
                                                                    <h3 className="text-base font-semibold leading-7 text-gray-900 whitespace-wrap">{setDetailedInfo.Service} Information</h3>
                                                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 whitespace-wrap">Details of the selected {selectedDetail.Service} resource.</p>
                                                                </div>
                                                                <div className="border-t border-gray-100">
                                                                    <dl className="divide-y divide-gray-100">
                                                                        {Object.entries(detailedInfo).map(([key, value], index) => (
                                                                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-wrap" key={index}>
                                                                                <dt className="text-sm font-medium text-gray-900 text-pretty whitespace-wrap">{key}</dt>
                                                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-wrap text-pretty whitespace-wrap">{typeof value === 'object' ? JSON.stringify(value) : value}</dd>
                                                                            </div>
                                                                        ))}
                                                                    </dl>
                                                                </div>
                                                            </div>
                                                        ) : <p>No detail selected.</p>}
                                                    </div>
                                                    <div className="mt-4">
                                                        <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" onClick={() => setIsModalOpen(false)}>
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dialog.Panel>


                                </Transition.Child>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            )}
        </div>
    );
}

export default DetailedView;
