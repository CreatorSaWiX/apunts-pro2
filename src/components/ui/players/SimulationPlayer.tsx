import React, { lazy, Suspense } from 'react';
import Spinner from '../Spinner';

const AlgoPlayer = lazy(() => import('./variants/AlgoPlayer'));
const OOPPlayer = lazy(() => import('./variants/OOPPlayer'));
const ProofPlayer = lazy(() => import('./variants/ProofPlayer'));
const VideoPlayer = lazy(() => import('./variants/VideoPlayer'));

interface SimulationPlayerProps {
    type: 'algo' | 'oop' | 'proof' | 'video';
    [key: string]: any;
}

export default function SimulationPlayer({ type, ...props }: SimulationPlayerProps) {
    let PlayerComponent: any = null;

    switch (type) {
        case 'algo':
            PlayerComponent = AlgoPlayer;
            break;
        case 'oop':
            PlayerComponent = OOPPlayer;
            break;
        case 'proof':
            PlayerComponent = ProofPlayer;
            break;
        case 'video':
            PlayerComponent = VideoPlayer;
            break;
        default:
            return <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">Player type not supported: {type}</div>;
    }

    return (
        <Suspense fallback={
            <div className="h-125 bg-[#0d1117] rounded-xl flex items-center justify-center border border-white/5 shadow-2xl my-12">
                <Spinner size="lg" variant="sky" />
            </div>
        }>
            <PlayerComponent {...props} />
        </Suspense>
    );
}
