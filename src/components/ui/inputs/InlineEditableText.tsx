import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import Spinner from '../Spinner';

interface InlineEditableTextProps {
    value: string;
    onSave: (val: string) => Promise<void>;
    className?: string;
    placeholder?: string;
    isEditable: boolean;
    multiline?: boolean;
    inputClassName?: string;
    externalLink?: string;
}

const InlineEditableText = ({
    value,
    onSave,
    className = '',
    placeholder,
    isEditable,
    multiline = false,
    inputClassName = '',
    externalLink
}: InlineEditableTextProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const save = async () => {
        if (tempValue !== value) {
            setIsSaving(true);
            try {
                await onSave(tempValue);
            } finally {
                setIsSaving(false);
            }
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            save();
        } else if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (!isEditable) {
        return <span className={className}>{value || placeholder}</span>;
    }

    if (isEditing) {
        return (
            <div className="relative inline-block w-full max-w-full">
                {multiline ? (
                    <textarea
                        autoFocus
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className={`${className} bg-transparent border-none p-0 m-0 outline-none w-full resize-none focus:ring-0 ${inputClassName}`}
                        rows={3}
                        disabled={isSaving}
                    />
                ) : (
                    <input
                        autoFocus
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className={`${className} bg-transparent border-none p-0 m-0 outline-none w-full focus:ring-0 ${inputClassName}`}
                        disabled={isSaving}
                    />
                )}
                {isSaving && <div className="absolute right-0 top-1/2 -translate-y-1/2"><Spinner size="sm" /></div>}
            </div>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5">
            <span
                onClick={() => setIsEditing(true)}
                className={`${className} cursor-text group/inline relative inline-flex items-center`}
                title={t('common.clickToEdit', 'Fes clic per editar')}
            >
                <span className="line-clamp-2">{value || <span className="text-slate-500 italic">{placeholder}</span>}</span>
            </span>
            {externalLink && value && (
                <a href={externalLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors cursor-pointer" title="Visitar" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={14} strokeWidth={2.5} />
                </a>
            )}
        </span>
    );
};

export default InlineEditableText;
