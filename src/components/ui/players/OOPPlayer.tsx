import { lazy, Suspense } from 'react';
import Spinner from '../Spinner';

const OOPPlayerImpl = lazy(() => import('./OOPPlayerImpl'));

interface OOPPlayerProps {
    simulation: string;
}

export default function OOPPlayer(props: OOPPlayerProps) {
    return (
        <Suspense fallback={<div className="h-125 bg-[#0d1117] rounded-xl flex items-center justify-center border border-white/5"><Spinner size="lg" variant="sky" /></div>}>
            <OOPPlayerImpl {...props} />
        </Suspense>
    );
}
