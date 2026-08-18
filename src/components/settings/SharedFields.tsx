
import React from 'react';

interface InputFieldProps {
    label: string;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    type?: string;
    subLabel?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, type = "text", subLabel = "" }) => (
    <div className="space-y-2 w-full">
        <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-slate-200">{label}</label>
            {subLabel && <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{subLabel}</span>}
        </div>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition"
            placeholder={placeholder}
        />
    </div>
);

interface TextAreaFieldProps {
    label?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    minHeight?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, placeholder, minHeight = "100px" }) => (
    <div className="space-y-2 w-full">
        {label && <label className="block text-sm font-semibold text-slate-200">{label}</label>}
        <textarea
            value={value}
            onChange={onChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition resize-y custom-scrollbar"
            style={{ minHeight }}
            placeholder={placeholder}
        />
    </div>
);
