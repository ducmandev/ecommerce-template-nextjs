import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    number: number;
    title: string;
    subtitle?: string;
  }[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-12">
      <div className="flex items-start justify-center relative max-w-2xl mx-auto">
        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isPending = step.number > currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-base transition-all duration-300 border-4 ${
                      isCompleted || isCurrent
                        ? 'bg-blue border-blue text-white'
                        : 'bg-white border-gray-3 text-dark-4'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                </div>

                {/* Step Title */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${
                      isCompleted || isCurrent ? 'text-blue' : 'text-dark-4'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 flex items-start pt-5 px-4 sm:px-8">
                  <div
                    className={`h-1 w-full rounded transition-all duration-500 ${
                      step.number < currentStep ? 'bg-blue' : 'bg-gray-3'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
