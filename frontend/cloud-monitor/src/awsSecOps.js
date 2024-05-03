import React, { Suspense } from 'react';
import { useStep } from './StepContext';
import { UsersIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';

const MetricView = React.lazy(() => import('./components/metricViewSec'));
const DetailedView = React.lazy(() => import('./components/detailedViewSec'));

function AWSSecOps() {
  const { currentStep, setCurrentStep } = useStep();

  const steps = [
    { id: 'Overview', icon: UsersIcon },
    { id: 'Storage', icon: AcademicCapIcon },
    { id: 'Compute', icon: ClockIcon },
    { id: 'IAM', icon: ClockIcon },
  ];

  // Render tabs instead of a list for step navigation
  return (
    <div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${currentStep === step.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
              aria-current={currentStep === step.id ? 'page' : undefined}
            >
              {step.id}
            </button>
          ))}
        </nav>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <MetricView key={"metric-" + currentStep} />
        <DetailedView key={"detail-" + currentStep} />
      </Suspense>

    </div>
  );
}

export default AWSSecOps;
