import React, { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';
import PrivacyModal from '../components/ui/modals/PrivacyModal';

const RegisterPage = () => {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const customEasing: [number, number, number, number] = [0.16, 1, 0.3, 1]; // Premium smooth ease

    return (
        <>
            <AuthLayout variant="register">
                <RegisterForm 
                    onOpenPrivacy={() => setIsPrivacyOpen(true)} 
                    customEasing={customEasing} 
                />
            </AuthLayout>
            <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        </>
    );
};

export default RegisterPage;