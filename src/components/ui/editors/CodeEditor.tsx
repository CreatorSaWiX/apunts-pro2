import { lazy, Suspense, forwardRef } from 'react';
import Spinner from '../Spinner';

const CodeEditorImpl = lazy(() => import('./CodeEditorImpl'));

interface CodeEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    height?: string;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    variant?: 'default' | 'minimal';
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>((props, ref) => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center bg-[#1e1e1e] text-slate-500 rounded-xl border border-white/5 shadow-lg min-h-[200px]" style={{ height: props.height || '100%' }}><Spinner size="sm" variant="slate" /></div>}>
            <CodeEditorImpl ref={ref} {...props} />
        </Suspense>
    );
});

CodeEditor.displayName = 'CodeEditor';
export default CodeEditor;
