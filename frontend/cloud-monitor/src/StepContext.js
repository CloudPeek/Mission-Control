import React, { createContext, useContext, useState } from 'react';

const StepContext = createContext();

export const useStep = () => useContext(StepContext);

export const StepProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState('Overview');

  return (
    <StepContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </StepContext.Provider>
  );
};
