import { lazy, Suspense } from 'react';
import Spinner from './Spinner';

const CodeBlockImpl = lazy(() => import('./CodeBlockImpl'));

export default function CodeBlock(props: any) {
    return (
        <Suspense fallback={<div className="p-4 bg-[#0d1117] rounded-xl flex justify-center border border-white/5"><Spinner size="sm" variant="slate" /></div>}>
            <CodeBlockImpl {...props} />
        </Suspense>
    );
}

