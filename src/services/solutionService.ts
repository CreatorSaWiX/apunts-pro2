import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const updateSolution = async (solutionId: string, solutionData: Record<string, unknown>): Promise<void> => {
    try {
        await setDoc(doc(db, 'solutions', solutionId), solutionData, { merge: true });
    } catch (error) {
        console.error("Error saving solution:", error);
        throw error;
    }
};
