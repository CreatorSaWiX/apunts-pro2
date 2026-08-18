import { lazy, Suspense } from 'react';
import Spinner from '../Spinner';

const CodeBlockImpl = lazy(() => import('./CodeBlockImpl'));

interface CodeBlockProps {
    code: string;
    title?: string;
    titleHref?: string;
    language?: string;
    className?: string;
    variant?: 'default' | 'minimal';
    showHeader?: boolean;
    headerActions?: React.ReactNode;
}

export default function CodeBlock(props: CodeBlockProps) {
    return (
        <Suspense fallback={<div className="p-4 bg-[#0d1117] rounded-xl flex justify-center border border-white/5"><Spinner size="sm" variant="slate" /></div>}>
            <CodeBlockImpl {...props} />
        </Suspense>
    );
}

