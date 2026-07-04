import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { SettingsProvider } from './SettingsContext';
import { SubjectProvider } from './SubjectContext';

interface AppProvidersProps {
    children: React.ReactNode;
}

/**
 * AppProviders: Consolidated wrapper for all global contexts.
 * Prevents "Provider Hell" in App.tsx.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <SettingsProvider>
                    <SubjectProvider>
                        {children}
                    </SubjectProvider>
                </SettingsProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};
