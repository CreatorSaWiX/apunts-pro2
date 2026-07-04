import React, { useState } from 'react';
import PrivacyModal from '../ui/PrivacyModal';

export const PrivacySection = () => {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <div className="w-full pt-4 pb-6 border-b border-white/10">
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Privacitat i Condicions</h2>
                    <p className="text-slate-400 text-sm font-medium">Revisa la política de tractament de les teves dades.</p>
                </div>

                <button
                    onClick={() => setIsPrivacyOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium rounded-xl transition-colors border border-white/10 whitespace-nowrap"
                >
                    Llegir documentació
                </button>
            </div>
            <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        </div>
    );
};
