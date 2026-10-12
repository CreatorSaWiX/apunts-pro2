import React from 'react';
import { AuthProvider } from './AuthContext';
import { SettingsSync } from '../components/ui/system/SettingsSync';
import { PWAProvider } from './PWAContext';

interface AppProvidersProps {
    children: React.ReactNode;
}

/**
 * AppProviders: Consolidated wrapper for all global contexts.
 * Prevents "Provider Hell" in App.tsx.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <PWAProvider>
            <AuthProvider>
                <SettingsSync />
                {children}
            </AuthProvider>
        </PWAProvider>
    );
};
