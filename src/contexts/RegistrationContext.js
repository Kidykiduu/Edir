import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationDataState] = useState(null); // Start with null instead of empty object
  const [hasSubmitted, setHasSubmittedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data from AsyncStorage on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const [data, submitted] = await Promise.all([
          AsyncStorage.getItem('registrationData'),
          AsyncStorage.getItem('hasSubmitted')
        ]);
        
        setRegistrationDataState(data ? JSON.parse(data) : null);
        setHasSubmittedState(submitted === 'true');
        
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPersistedData();
  }, []);

  // Set registration data with validation and persistence
  const setRegistrationData = async (data) => {
    if (!data?.username || !data?.password) {
      throw new Error('Username and password required');
    }
    
    setRegistrationDataState(data);
    await AsyncStorage.setItem('registrationData', JSON.stringify(data));
  };

  // Clear registration data and remove from AsyncStorage
  const clearRegistrationData = async () => {
    setRegistrationDataState(null);
    await AsyncStorage.removeItem('registrationData');
  };

  // Set submission status with persistence
  const setSubmissionStatus = async (status) => {
    setHasSubmittedState(status);
    await AsyncStorage.setItem('hasSubmitted', status.toString());
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        hasSubmitted,
        isLoading,
        setRegistrationData,
        clearRegistrationData,
        setSubmissionStatus
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistrationContext must be used within a RegistrationProvider');
  }
  return context;
};