import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { allSolutions } from '../content/data/solutions';
import type { Solution } from '../content/data/solutions';

export const useSolutions = (topicId: string) => {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolutions = async () => {
            setLoading(true);
            try {
                // 1. Get static solutions
                const staticSolutions = allSolutions.find(t => t.topicId === topicId)?.solutions || [];

                // 2. Get Firestore solutions
                // HANDLE LEGACY IDs: If we are querying 'pro2-tema-1', we also want to catch 'tema-1'
                const idsToQuery = [topicId];
                if (topicId.startsWith('pro2-')) {
                    idsToQuery.push(topicId.replace('pro2-', ''));
                }

                const q = query(
                    collection(db, 'solutions'),
                    where('topicId', 'in', idsToQuery)
                    // You might want to enable indexing for this: orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const firestoreSolutions: Solution[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    firestoreSolutions.push({
                        id: data.problemId,
                        title: data.title,
                        author: data.authorName, // Mapping authorName to author
                        authorId: data.authorId,
                        code: data.code,
                        statement: data.statement
                    });
                });

                // 3. Merge (Firestore takes precedence if ID collision, or just append)
                // We use a Map to ensure unique by ID, preferring Firestore, then Static
                const solutionsMap = new Map<string, Solution>();

                // Add static first
                staticSolutions.forEach(s => solutionsMap.set(s.id, s));

                // Add firestore (overwriting static if exists, or adding new)
                firestoreSolutions.forEach(s => solutionsMap.set(s.id, s));

                setSolutions(Array.from(solutionsMap.values()));

            } catch (error) {
                console.error("Error fetching solutions:", error);
                // Fallback to static
                const staticSolutions = allSolutions.find(t => t.topicId === topicId)?.solutions || [];
                setSolutions(staticSolutions);
            } finally {
                setLoading(false);
            }
        };

        if (topicId) {
            fetchSolutions();
        }
    }, [topicId]);

    return { solutions, loading };
};

export const useSolution = (topicId: string, problemId: string, lang: string = 'ca') => {
    const [solution, setSolution] = useState<Solution | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolution = async () => {
            // ... logic ...
            setLoading(true);
            try {
                // ... (recuperar de firestore/estàtics) ...
                // Simplificació: Sempre intentem mirar l'API si l'idioma canvia o no tenim enunciat

                let foundSolution: Solution | null = null;
                // 1. Static
                const staticData = allSolutions.find(t => t.topicId === topicId)?.solutions.find(s => s.id === problemId);
                if (staticData) foundSolution = staticData;

                // 2. Firestore
                const { doc, getDoc } = await import('firebase/firestore');
                const { db } = await import('../lib/firebase');
                const docRef = doc(db, 'solutions', problemId);

                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Firestore data found for", problemId, data);
                        foundSolution = {
                            id: data.problemId,
                            title: data.title,
                            author: data.authorName, // Mapping
                            authorId: data.authorId,
                            code: data.code,
                            statement: data.statement || ''
                        };
                    } else {
                        console.log("No Firestore document found for", problemId);
                    }
                } catch (firestoreError) {
                    console.error("Error reading from Firestore:", firestoreError);
                }

                // 3. API Check (Sempre comprovem API si volem assegurar idioma, o si falta enunciat)
                // Optimització: Només si falta enunciat O si l'usuari ha demanat explícitament un idioma (tot i que aquí lang sempre té valor)
                // Millor: Sempre demanem a l'API l'enunciat en l'idioma 'lang' i ho barregem.

                const { fetchJutgeProblem } = await import('../lib/jutge');
                const jutgeData = await fetchJutgeProblem(problemId, lang);

                if (jutgeData) {
                    const base = foundSolution || {
                        id: problemId,
                        title: jutgeData.title,
                        author: 'Jutge.org',
                        authorId: '',
                        code: '// Solució no disponible encara.\n// Pots contribuir-hi afegint la teva!',
                        statement: ''
                    };

                    foundSolution = {
                        ...base,
                        title: jutgeData.title, // Actualitzem títol per si de cas
                        statement: jutgeData.statement,
                        availableLanguages: jutgeData.availableLanguages // Now storing available languages
                    };
                }

                setSolution(foundSolution);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (topicId && problemId) fetchSolution();
    }, [topicId, problemId, lang]);

    return { solution, loading };
};

export const useUserSolutions = (userId: string) => {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserSolutions = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'solutions'),
                    where('authorId', '==', userId)
                );

                const querySnapshot = await getDocs(q);
                const userSolutions: Solution[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    userSolutions.push({
                        id: data.problemId,
                        title: data.title,
                        author: data.authorName,
                        code: data.code,
                        statement: data.statement,
                        // Add status if needed for profile
                        status: data.status || 'pending',
                        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'
                    } as any);
                });

                setSolutions(userSolutions);
            } catch (error) {
                console.error("Error fetching user solutions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserSolutions();
        }
    }, [userId]);

    return { solutions, loading };
};
