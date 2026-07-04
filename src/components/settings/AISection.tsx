import React, { useState } from 'react';
import { Bot, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import FileUploader from '../ui/FileUploader';
import { Modal } from '../ui/Modal';
import { InputField, TextAreaField } from './SharedFields';

export const AISection = () => {
    const { user } = useAuth();
    const { aiSettings, setAiSettings } = useSettings();
    const [editingSoulField, setEditingSoulField] = useState<'rules' | 'boundaries' | 'customDirectives' | null>(null);

    return (
        <div id="ai" className="flex flex-col gap-10 w-full pt-4 pb-16">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Assistent IA</h2>
                    <p className="text-slate-400 text-sm font-medium">Configura la personalitat i el comportament del teu copilot. Aquesta funcionalitat està inspirat en <a href="https://openclaw.ai">OpenClaw</a>.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* IDENTITY GROUP */}
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">1</div>
                        <h3 className="text-lg font-bold text-white">Identitat (Qui soc)</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-end gap-6">
                            <div className="relative w-24 h-24 rounded-[32px] border border-white/10 overflow-hidden bg-white/[0.03] flex-shrink-0 flex items-center justify-center group shadow-lg">
                                {aiSettings.identity.avatarUrl ? (
                                    <img src={aiSettings.identity.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <Bot size={36} className="text-slate-500 group-hover:text-sky-400 transition-colors duration-300" />
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-1">Canviar</span>
                                </div>

                                <FileUploader
                                    maxFiles={1}
                                    variant="avatar"
                                    onUploadComplete={(atts) => {
                                        if (atts.length > 0) {
                                            setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, avatarUrl: atts[0].url } })
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex-1">
                                <InputField
                                    label="Nom de la IA"
                                    value={aiSettings.identity.name || ''}
                                    onChange={(e: any) => setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, name: e.target.value } })}
                                    placeholder="ex: Cloufy"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Pronoms"
                                value={aiSettings.identity.pronouns || ''}
                                onChange={(e: any) => setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, pronouns: e.target.value } })}
                                placeholder="ex: he, she, they"
                            />

                            <div className="space-y-2 w-full">
                                <div className="flex items-baseline justify-between">
                                    <label className="text-sm font-semibold text-slate-200">Com vols que et digui?</label>
                                    <button
                                        onClick={() => setAiSettings({ ...aiSettings, userContext: { ...aiSettings.userContext, userPreferredName: user?.username || 'Estudiant' } })}
                                        className="text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Usar nom d'usuari
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={aiSettings.userContext?.userPreferredName || ''}
                                    onChange={(e) => setAiSettings({ ...aiSettings, userContext: { ...aiSettings.userContext, userPreferredName: e.target.value } })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all"
                                    placeholder="ex: mestre, cap..."
                                />
                            </div>
                        </div>

                        <TextAreaField
                            label="Personalitat (Vibe)"
                            value={aiSettings.identity.vibe || ''}
                            onChange={(e: any) => setAiSettings({ ...aiSettings, identity: { ...aiSettings.identity, vibe: e.target.value } })}
                            placeholder="Defineix el to general, l'estil de conversa i com et farà sentir la IA..."
                            minHeight="80px"
                        />
                    </div>
                </div>

                {/* SOUL GROUP */}
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">2</div>
                        <h3 className="text-lg font-bold text-white">Ànima (Regles de comportament)</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        {[
                            { id: 'rules', label: 'Regles (Rules)', placeholder: 'Ex: Respon sempre en català, sigues breu, utilitza format markdown...', minHeight: '120px' },
                            { id: 'boundaries', label: 'Límits (Boundaries)', placeholder: "Ex: No facis els exercicis per mi, guia'm. No responguis sobre temes fora d'informàtica...", minHeight: '100px' },
                            { id: 'customDirectives', label: 'Directrius Personalitzades', placeholder: 'Qualsevol altra indicació crítica per a la IA.', minHeight: '80px' }
                        ].map(field => (
                            <div key={field.id} className="space-y-2 w-full relative">
                                <label className="block text-sm font-semibold text-slate-200">{field.label}</label>
                                <div className="relative w-full rounded-xl overflow-hidden group border border-white/5">
                                    <textarea
                                        readOnly
                                        value={aiSettings.soul[field.id as keyof typeof aiSettings.soul] || ''}
                                        className="w-full bg-slate-900/40 px-4 py-3 text-white placeholder-slate-600 transition-all resize-y custom-scrollbar filter blur-[4px] opacity-60 select-none pointer-events-none"
                                        style={{ minHeight: field.minHeight }}
                                        placeholder={field.placeholder}
                                    />
                                    {/* Overlay center button */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0d16]/40 group-hover:bg-[#0a0d16]/60 transition-colors z-10">
                                        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider mb-3 drop-shadow-md">Això ho gestiona l'IA autònomament</p>
                                        <button
                                            onClick={() => setEditingSoulField(field.id as any)}
                                            className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl text-xs transition-all backdrop-blur-md"
                                        >
                                            Forçar Modificació
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MEMORIES GROUP */}
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">3</div>
                            <h3 className="text-lg font-bold text-white">Memòria a Llarg Termini</h3>
                        </div>
                        <p className="text-sm text-slate-400">
                            Aquests són els detalls que la IA ha aprendut sobre tu per personalitzar la teva experiència.
                        </p>
                    </div>

                    <div>
                        {(!aiSettings.userContext?.memories || aiSettings.userContext.memories.length === 0) ? (
                            <div className="p-6 bg-white/[0.03] rounded-xl border border-white/5 text-slate-500 text-sm font-medium flex justify-center items-center">
                                La IA encara no té memòries guardades.
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {aiSettings.userContext.memories.map((mem, idx) => (
                                    <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                                        <span className="text-sm text-slate-300 font-medium leading-relaxed">{mem}</span>
                                        <button
                                            onClick={() => {
                                                const newMems = [...(aiSettings.userContext?.memories || [])];
                                                newMems.splice(idx, 1);
                                                setAiSettings({
                                                    ...aiSettings,
                                                    userContext: { ...aiSettings.userContext, userPreferredName: aiSettings.userContext?.userPreferredName || '', memories: newMems }
                                                });
                                            }}
                                            className="shrink-0 text-slate-500 hover:text-rose-500 transition-colors p-1 bg-white/5 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                                            title="Esborrar memòria"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Soul Edit Modal */}
            <Modal
                isOpen={!!editingSoulField}
                onClose={() => setEditingSoulField(null)}
                size="3xl"
                overlayVariant="transparent"
            >
                <div className="p-8 flex flex-col h-full">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Modificant {editingSoulField === 'rules' ? 'Regles (Rules)' : editingSoulField === 'boundaries' ? 'Límits (Boundaries)' : 'Directrius Personalitzades'}
                        </h2>
                        <p className="text-sm text-slate-400">
                            Aquests canvis seran apresos immediatament i passaran a formar part de l'ànima de l'assistent.
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 space-y-3">

                        <textarea
                            value={aiSettings.soul[editingSoulField as keyof typeof aiSettings.soul] || ''}
                            onChange={(e) => setAiSettings({
                                ...aiSettings,
                                soul: { ...aiSettings.soul, [editingSoulField as string]: e.target.value }
                            })}
                            className="w-full flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all resize-none custom-scrollbar text-sm leading-relaxed"
                            placeholder="Escriu aquí les instruccions..."
                        />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setEditingSoulField(null)}
                            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 px-10 rounded-2xl transition-colors text-base flex justify-center items-center gap-2"
                        >
                            <Save size={20} />
                            Desar a l'ànima
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
