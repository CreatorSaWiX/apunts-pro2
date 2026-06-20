import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, ChevronRight, Menu } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { CommunityPost } from '../../types/community';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NotesView = () => {
    const [notes, setNotes] = useState<CommunityPost[]>([]);
    const [selectedNote, setSelectedNote] = useState<CommunityPost | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch only posts that are more text-heavy or specifically notes (e.g., resources without images, or we can just fetch all resources)
        const q = query(
            collection(db, 'community_posts'),
            where('type', '==', 'resource'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];
            setNotes(rawNotes);
            if (rawNotes.length > 0 && !selectedNote) {
                setSelectedNote(rawNotes[0]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredNotes = notes.filter(note => 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex w-full h-[calc(100vh-80px)] mt-20 max-w-[1600px] mx-auto px-4 sm:px-6">
            
            {/* Sidebar */}
            <motion.div 
                initial={false}
                animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="h-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shrink-0"
            >
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Cercar apunts..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    {loading ? (
                        <div className="p-4 text-center text-slate-500 text-sm">Carregant apunts...</div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">Cap resultat.</div>
                    ) : (
                        filteredNotes.map(note => (
                            <button
                                key={note.id}
                                onClick={() => setSelectedNote(note)}
                                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors mb-1 ${selectedNote?.id === note.id ? 'bg-primary/20 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                            >
                                <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${selectedNote?.id === note.id ? 'text-primary' : 'text-slate-500'}`} />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{note.content.split('\n')[0] || 'Sense títol'}</h4>
                                    <p className="text-xs opacity-70 truncate mt-1">per {note.username}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 h-full flex flex-col bg-[#050505] rounded-2xl sm:ml-6 relative border border-white/5 overflow-hidden shadow-2xl">
                
                {/* Header Navbar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 shrink-0 bg-slate-900/30 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        
                        {selectedNote && (
                            <div className="flex items-center text-sm text-slate-400 gap-2">
                                <span>{selectedNote.subject}</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-slate-200 truncate max-w-[200px]">{selectedNote.content.split('\n')[0]}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notion-like Editor/Reader */}
                <div className="flex-1 overflow-y-auto px-6 py-12 md:px-20 lg:px-32 xl:px-48 scrollbar-thin scrollbar-thumb-white/10">
                    {selectedNote ? (
                        <motion.div 
                            key={selectedNote.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto pb-20"
                        >
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tight">
                                {selectedNote.content.split('\n')[0] || 'Apunts Sense Títol'}
                            </h1>
                            
                            <div className="flex items-center gap-3 mb-12 pb-6 border-b border-white/10">
                                <img src={selectedNote.userAvatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-800" />
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{selectedNote.username}</p>
                                    <p className="text-xs text-slate-500">{new Date(selectedNote.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {selectedNote.content.substring(selectedNote.content.indexOf('\n') + 1) || '*No hi ha més contingut a mostrar.*'}
                                </ReactMarkdown>
                            </div>

                            {selectedNote.attachments && selectedNote.attachments.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4">Fitxers Adjunts</h3>
                                    <div className="grid gap-3">
                                        {selectedNote.attachments.map((att, i) => (
                                            <a 
                                                key={i} 
                                                href={att.url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                                            >
                                                <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary mr-4" />
                                                <span className="font-medium text-slate-200">{att.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Selecciona uns apunts del menú lateral.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesView;
