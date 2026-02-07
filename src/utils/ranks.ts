export type Rank = {
    name: string;
    division?: 'I' | 'II' | 'III';
    color: string;
    minSolutions: number;
    icon?: string; // We can add specific icons later
};

const ranks: Omit<Rank, 'division'>[] = [
    { name: 'Bronze', color: 'text-orange-600', minSolutions: 0 },
    { name: 'Plata', color: 'text-slate-400', minSolutions: 5 },
    { name: 'Or', color: 'text-yellow-400', minSolutions: 10 },
    { name: 'Platí', color: 'text-cyan-400', minSolutions: 15 },
    { name: 'Diamant', color: 'text-blue-500', minSolutions: 20 },
    { name: 'Campió', color: 'text-purple-500', minSolutions: 25 },
    { name: 'Gran Campió', color: 'text-red-500', minSolutions: 35 },
    { name: 'SSL', color: 'text-pink-500 bg-clip-text bg-gradient-to-r from-pink-500 to-white', minSolutions: 50 },
];

export const getRank = (solutionsCount: number): Rank => {
    // 1. Find the main rank tier
    let rankTier = ranks[0];
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (solutionsCount >= ranks[i].minSolutions) {
            rankTier = ranks[i];
            break;
        }
    }

    if (rankTier.name === 'SSL') {
        return { ...rankTier };
    }

    // 2. Calculate Division (I, II, III) within the tier
    // Logic: Divide the progress within the tier into 3 parts
    // Note: This is a simplified logic. Can be adjusted.
    // Example: Bronze (0-4 solutions). 
    // Bronze I: 0-1, Bronze II: 2, Bronze III: 3-4? 
    // Let's simplified: just return Tier + Division based on modulo or small steps if range allows.

    // For now, let's keep it simple: simpler progression
    // Bronze I (0), Bronze II (1-2), Bronze III (3-4)
    // Next tier starts at 5.

    // Actually, user asked for explicit I, II, III.
    // Let's calculate division based on progress to next rank.

    const currentTierIndex = ranks.findIndex(r => r.name === rankTier.name);
    const nextTier = ranks[currentTierIndex + 1];

    let division: 'I' | 'II' | 'III' = 'I';

    if (nextTier) {
        const range = nextTier.minSolutions - rankTier.minSolutions;
        const progress = solutionsCount - rankTier.minSolutions;

        if (progress >= (range * 2 / 3)) division = 'III';
        else if (progress >= (range / 3)) division = 'II';
    } else {
        // Top rank (SSL) usually doesn't have divisions or is just SSL
        return { ...rankTier };
    }

    return { ...rankTier, division };
};
