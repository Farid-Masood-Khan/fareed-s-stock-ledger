
import { useState, useCallback, createContext, useContext } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  isLoading: (state: string) => boolean;
  startLoading: (state: string) => void;
  stopLoading: (state: string) => void;
  loadingStates: LoadingState;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: () => false,
  startLoading: () => {},
  stopLoading: () => {},
  loadingStates: {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const isLoading = useCallback((state: string) => {
    return !!loadingStates[state];
  }, [loadingStates]);

  const startLoading = useCallback((state: string) => {
    setLoadingStates(prev => ({ ...prev, [state]: true }));
  }, []);

  const stopLoading = useCallback((state: string) => {
    setLoadingStates(prev => ({ ...prev, [state]: false }));
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, loadingStates }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingState = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingState must be used within a LoadingProvider');
  }
  return context;
};

// Hook for component-specific loading states
export const useComponentLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  
  const withLoading = useCallback(
    <T,>(promise: Promise<T>): Promise<T> => {
      setIsLoading(true);
      return promise
        .finally(() => setIsLoading(false));
    },
    []
  );
  
  return { isLoading, startLoading, stopLoading, withLoading };
};

export default useLoadingState;
