export const updateSolution = async (solutionId: string, solutionData: Record<string, unknown>): Promise<void> => {
    try {
        const [{ db }, { doc, setDoc }] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/firestore')
        ]);
        await setDoc(doc(db, 'solutions', solutionId), solutionData, { merge: true });
    } catch (error) {
        console.error("Error saving solution:", error);
        throw error;
    }
};
