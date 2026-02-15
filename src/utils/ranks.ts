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
    let rankTier = ranks[0];
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (solutionsCount >= ranks[i].minSolutions) {
            rankTier = ranks[i];
            break;
        }
    }

    if (rankTier.name === 'SSL') return { ...rankTier };

    const currentTierIndex = ranks.findIndex(r => r.name === rankTier.name);
    const nextTier = ranks[currentTierIndex + 1];

    let division: 'I' | 'II' | 'III' = 'I';

    if (nextTier) {
        const range = nextTier.minSolutions - rankTier.minSolutions;
        const progress = solutionsCount - rankTier.minSolutions;

        if (progress >= (range * 2 / 3)) division = 'III';
        else if (progress >= (range / 3)) division = 'II';
    } else {
        return { ...rankTier };
    }

    return { ...rankTier, division };
};
