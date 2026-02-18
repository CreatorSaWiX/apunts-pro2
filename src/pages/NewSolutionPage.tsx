import React, { useState } from 'react';
import { ArrowLeft, Save, Code, FileText, Layout, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { allPersonalNotes } from 'content-collections';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CodeEditor from '../components/ui/CodeEditor';

const NewSolutionPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [topicId, setTopicId] = useState('');
    const [problemId, setProblemId] = useState('');
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [statement, setStatement] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user) throw new Error('No user logged in');

            await addDoc(collection(db, 'solutions'), {
                topicId,
                problemId: problemId.toUpperCase(),
                title,
                code,
                statement,
                authorId: user.id,
                authorName: user.username,
                createdAt: serverTimestamp(),
                status: 'pending'
            });

            navigate(`/tema/${topicId}/solucionaris`);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error al guardar la solució. Comprova la consola.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 px-4">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Necessites iniciar sessió per pujar solucions.</p>
                    <Link to="/login" className="px-6 py-2 bg-sky-500 rounded-lg text-white font-medium hover:bg-sky-400 transition-colors">
                        Iniciar Sessió
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24 px-4 max-w-[900px] mx-auto relative z-10">

            <div className="flex items-center gap-4 mb-8">
                <Link to="/" className="p-2 rounded-full bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white">Nova Solució</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                {/* Section 1: Basic Info */}
                <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Layout size={120} />
                    </div>

                    <h2 className="text-lg font-medium text-white border-b border-white/5 pb-4 flex items-center gap-2">
                        <Info size={18} className="text-sky-400" />
                        Informació del Problema
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Tema</label>
                            <select
                                value={topicId}
                                onChange={(e) => setTopicId(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all appearance-none"
                                required
                            >
                                <option value="" disabled>Selecciona un tema</option>
                                {allPersonalNotes.sort((a, b) => a.order - b.order).map(t => (
                                    <option key={t.slug} value={t.slug}>{t.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">ID Problema</label>
                            <input
                                type="text"
                                value={problemId}
                                onChange={(e) => setProblemId(e.target.value)}
                                placeholder="ex: P37500"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 hidden md:block">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Títol del Problema</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ex: Primers nombres"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Section 2: Code */}
                <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                    <h2 className="text-lg font-medium text-white border-b border-white/5 pb-4 flex items-center gap-2">
                        <Code size={18} className="text-emerald-400" />
                        Codi C++
                    </h2>

                    <div className="relative h-96">
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            height="100%"
                            className="bg-slate-950/50"
                            placeholder="#include <iostream>..."
                        />
                    </div>
                </div>

                {/* Section 3: Statement (Optional) */}
                <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                    <h2 className="text-lg font-medium text-white border-b border-white/5 pb-4 flex items-center gap-2">
                        <FileText size={18} className="text-indigo-400" />
                        Enunciat (HTML)
                        <span className="text-xs font-normal text-slate-500 ml-auto uppercase tracking-wider bg-white/5 px-2 py-1 rounded">Opcional</span>
                    </h2>

                    <div className="relative">
                        <textarea
                            value={statement}
                            onChange={(e) => setStatement(e.target.value)}
                            className="w-full h-40 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none leading-relaxed"
                            placeholder="<p>Descripció del problema...</p>"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            'Pujant...'
                        ) : (
                            <>
                                <Save size={18} />
                                Publicar Solució
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default NewSolutionPage;
