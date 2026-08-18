import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { SuccessView } from '../components/auth/SuccessView';

const LoginPage = () => {
    const [view, setView] = useState<'login' | 'forgot-password' | 'success'>('login');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const customEasing: [number, number, number, number] = [0.16, 1, 0.3, 1]; // Premium smooth ease

    return (
        <AuthLayout variant="login">
            <AnimatePresence mode="wait">
                {view === 'login' && (
                    <LoginForm 
                        onForgotPassword={(email) => {
                            setForgotPasswordEmail(email);
                            setView('forgot-password');
                        }}
                        customEasing={customEasing}
                    />
                )}
                
                {view === 'forgot-password' && (
                    <ForgotPasswordForm
                        initialEmail={forgotPasswordEmail}
                        onBackToLogin={() => setView('login')}
                        onSuccess={(email) => {
                            setForgotPasswordEmail(email);
                            setView('success');
                        }}
                        customEasing={customEasing}
                    />
                )}
                
                {view === 'success' && (
                    <SuccessView
                        email={forgotPasswordEmail}
                        onBackToLogin={() => setView('login')}
                        customEasing={customEasing}
                    />
                )}
            </AnimatePresence>
        </AuthLayout>
    );
};

export default LoginPage;
