import React from 'react';

export const InputField = ({ label, value, onChange, placeholder, type = "text", subLabel = "" }: any) => (
    <div className="space-y-2 w-full">
        <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-slate-200">{label}</label>
            {subLabel && <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{subLabel}</span>}
        </div>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all"
            placeholder={placeholder}
        />
    </div>
);

export const TextAreaField = ({ label, value, onChange, placeholder, minHeight = "100px" }: any) => (
    <div className="space-y-2 w-full">
        {label && <label className="block text-sm font-semibold text-slate-200">{label}</label>}
        <textarea
            value={value}
            onChange={onChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all resize-y custom-scrollbar"
            style={{ minHeight }}
            placeholder={placeholder}
        />
    </div>
);
