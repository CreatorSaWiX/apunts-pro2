import React, { createContext, useContext } from 'react';

interface InteractionContextType {
    isFullScreen: boolean;
    setIsFullScreen: (value: boolean) => void;
    resizeKey: number;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider: React.FC<{ children: React.ReactNode, value: InteractionContextType }> = ({ children, value }) => {
    return (
        <InteractionContext.Provider value={value}>
            {children}
        </InteractionContext.Provider>
    );
};

export const useInteraction = () => {
    const context = useContext(InteractionContext);
    if (!context) {
        // Fallback for cases where the component is used outside InteractionLock (e.g. desktop)
        return { isFullScreen: false, setIsFullScreen: () => {}, resizeKey: 0 };
    }
    return context;
};
