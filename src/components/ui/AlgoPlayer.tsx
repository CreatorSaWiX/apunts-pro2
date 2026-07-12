import { lazy, Suspense } from 'react';
import Spinner from './Spinner';

const AlgoPlayerImpl = lazy(() => import('./AlgoPlayerImpl'));

export default function AlgoPlayer(props: any) {
    return (
        <Suspense fallback={<div className="h-[500px] bg-[#0d1117] rounded-xl flex items-center justify-center border border-white/5"><Spinner size="lg" variant="emerald" /></div>}>
            <AlgoPlayerImpl {...props} />
        </Suspense>
    );
}
