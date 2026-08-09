import React from 'react';
import { AuthProvider } from './AuthContext';
import { SettingsSync } from '../components/ui/system/SettingsSync';

interface AppProvidersProps {
    children: React.ReactNode;
}

/**
 * AppProviders: Consolidated wrapper for all global contexts.
 * Prevents "Provider Hell" in App.tsx.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <AuthProvider>
            <SettingsSync />
            {children}
        </AuthProvider>
    );
};
