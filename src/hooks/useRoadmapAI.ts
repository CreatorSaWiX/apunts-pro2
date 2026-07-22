import { useState, useEffect, useRef } from 'react';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    changes?: { type: 'add' | 'remove'; subject: string }[];
    attachmentName?: string;
    attachmentType?: 'image' | 'pdf';
}

export type StreamPhase = 'idle' | 'connecting' | 'thinking' | 'writing' | 'done';

export const useRoadmapAI = (
    aiSettings: any,
    nodes: any[],
    addSubjectNode: (subject: string, status: string) => void
) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = sessionStorage.getItem('roadmap-ai-messages');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
    const [thoughtText, setThoughtText] = useState('');
    
    // Attachment State
    const [attachedFile, setAttachedFile] = useState<{ mimeType: string, data: string, name: string } | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup de l'stream quan es desmunta el component
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            sessionStorage.setItem('roadmap-ai-messages', JSON.stringify(messages));
        }, 500);
        return () => clearTimeout(timeout);
    }, [messages]);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Només es permeten imatges o PDFs.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("L'arxiu és massa gran. Màxim 5MB.");
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = (e.target?.result as string).split(',')[1];
            setAttachedFile({ mimeType: file.type, data: base64, name: file.name });
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async (promptText: string) => {
        if ((!promptText.trim() && !attachedFile) || isGenerating) return;

        const userMsg = promptText.trim();
        setError(null);
        setIsGenerating(true);
        
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const newMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMsg,
            ...(attachedFile && {
                attachmentName: attachedFile.name,
                attachmentType: attachedFile.mimeType.startsWith('image/') ? 'image' : 'pdf'
            })
        };
        setMessages(prev => [...prev, newMsg]);
        setAttachedFile(null);

        const activeNodes = nodes
            .map(n => ({ 
                id: n.id, 
                status: n.data.status,
                credits: n.data.credits,
                semester: n.data.semester,
                ...(n.data.status === 'passed' && n.data.grade !== undefined && { grade: n.data.grade })
            }));

        try {
            const { auth, db } = await import('../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            const uid = auth.currentUser?.uid;

            let memory = {};
            if (uid) {
                try {
                    const memoryDoc = await getDoc(doc(db, 'ai_memory', uid));
                    if (memoryDoc.exists()) {
                        memory = memoryDoc.data();
                    }
                } catch (e) {
                    console.error("No s'ha pogut carregar la memòria", e);
                }
            }

            const history = messages.slice(-10).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: m.content
            }));

            const userName = auth.currentUser?.displayName || 'Estudiant';

            const response = await fetch('/api/roadmap-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: userMsg,
                    currentNodes: activeNodes,
                    history,
                    memory,
                    aiSettings,
                    userName,
                    attachedFile
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al comunicar amb la IA');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No s'ha pogut iniciar l'stream");
            const decoder = new TextDecoder();
            let aiResponse = "";
            let changes: any[] = [];
            let sseBuffer = "";
            const aiMsgId = (Date.now() + 1).toString();

            // Afegim el missatge buit abans de començar l'streaming
            setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: "", changes: [] }]);
            setStreamPhase('connecting');
            setThoughtText('');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                sseBuffer += decoder.decode(value, { stream: true });
                const events = sseBuffer.split('\n\n');
                sseBuffer = events.pop() || '';

                for (const eventBlock of events) {
                    if (!eventBlock.trim()) continue;

                    let eventType = 'message';
                    let eventData = '';

                    for (const line of eventBlock.split('\n')) {
                        if (line.startsWith('event: ')) {
                            eventType = line.substring(7).trim();
                        } else if (line.startsWith('data: ')) {
                            eventData = line.substring(6);
                        }
                    }

                    if (!eventData || eventData.trim() === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(eventData);

                        switch (eventType) {
                            case 'status':
                                if (parsed.phase === 'thinking') setStreamPhase('thinking');
                                else if (parsed.phase === 'writing') setStreamPhase('writing');
                                break;
                            case 'thought':
                                setThoughtText(prev => prev + parsed.text);
                                break;
                            case 'message':
                                aiResponse += parsed.text;
                                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiResponse } : m));
                                break;
                            case 'actions':
                                changes = parsed.actions || [];
                                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, changes } : m));
                                for (const change of changes) {
                                    if (change.type === 'add' && change.subject) {
                                        addSubjectNode(change.subject, 'optional');
                                    }
                                }
                                break;
                            case 'error':
                                setError(parsed.message || parsed.content);
                                break;
                        }
                    } catch (e) {
                        // Ignorar chunks mal formats
                    }
                }
            }

            window.dispatchEvent(new CustomEvent('ai-magic-done'));

        } catch (err: any) {
            if (err.name === 'AbortError') {
                return;
            }
            console.error(err);
            setError(err.message || 'Error comunicant amb la IA');
        } finally {
            setIsGenerating(false);
            setStreamPhase('done');
        }
    };

    return {
        messages,
        setMessages,
        isGenerating,
        error,
        streamPhase,
        thoughtText,
        attachedFile,
        setAttachedFile,
        processFile,
        handleGenerate
    };
};
