import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { allSolutions } from '../data/solutions';
import type { Solution } from '../data/solutions';

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
                const q = query(
                    collection(db, 'solutions'),
                    where('topicId', '==', topicId)
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
                // Let's append Firestore ones to static ones for now
                setSolutions([...staticSolutions, ...firestoreSolutions]);

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

export const useSolution = (topicId: string, problemId: string) => {
    const [solution, setSolution] = useState<Solution | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolution = async () => {
            setLoading(true);
            try {
                // 1. Check static first (fastest)
                const staticData = allSolutions.find(t => t.topicId === topicId)?.solutions.find(s => s.id === problemId);

                if (staticData) {
                    setSolution(staticData);
                    setLoading(false);
                    return;
                }

                // 2. Check Firestore
                const q = query(
                    collection(db, 'solutions'),
                    where('problemId', '==', problemId),
                    where('topicId', '==', topicId)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setSolution({
                        id: data.problemId,
                        title: data.title,
                        author: data.authorName,
                        authorId: data.authorId,
                        code: data.code,
                        statement: data.statement
                    });
                } else {
                    setSolution(null);
                }

            } catch (error) {
                console.error("Error fetching solution:", error);
                setSolution(null);
            } finally {
                setLoading(false);
            }
        };

        if (topicId && problemId) {
            fetchSolution();
        }
    }, [topicId, problemId]);

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
