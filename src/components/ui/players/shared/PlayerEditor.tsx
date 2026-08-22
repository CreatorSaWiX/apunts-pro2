import React, { useEffect, useRef, useMemo } from 'react';
import ReactCodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView, Decoration, type DecorationSet, GutterMarker, lineNumberMarkers } from '@codemirror/view';
import { Facet, StateField, RangeSet, RangeSetBuilder, EditorState } from '@codemirror/state';
import { cpp } from '@codemirror/lang-cpp';

// --- Shared CodeMirror Extensions for Execution Highlighting ---
export const executionLineFacet = Facet.define<number, number>({
    combine: values => values.length ? values[0] : 0
});

const executionLineDeco = Decoration.line({ class: "cm-execution-line" });
const executionGutterMarker = new class extends GutterMarker {
    elementClass = "cm-execution-gutter-element";
};

function createExecutionDecorations(state: EditorState): DecorationSet {
    const rawLine = state.facet(executionLineFacet);
    if (rawLine === 0) return Decoration.none;
    const lineNum = Math.min(Math.max(1, rawLine), state.doc.lines);
    const line = state.doc.line(lineNum);
    return Decoration.set([executionLineDeco.range(line.from)]);
}

function createExecutionMarkers(state: EditorState): RangeSet<GutterMarker> {
    const rawLine = state.facet(executionLineFacet);
    if (rawLine === 0) return RangeSet.empty;
    const lineNum = Math.min(Math.max(1, rawLine), state.doc.lines);
    const line = state.doc.line(lineNum);
    const builder = new RangeSetBuilder<GutterMarker>();
    builder.add(line.from, line.from, executionGutterMarker);
    return builder.finish();
}

export const executionHighlightField = StateField.define<DecorationSet>({
    create(state) { return createExecutionDecorations(state); },
    update(deco, tr) {
        if (tr.docChanged || tr.state.facet(executionLineFacet) !== tr.startState.facet(executionLineFacet)) {
            return createExecutionDecorations(tr.state);
        }
        return deco.map(tr.changes);
    },
    provide: f => EditorView.decorations.from(f)
});

export const executionGutterField = StateField.define<RangeSet<GutterMarker>>({
    create(state) { return createExecutionMarkers(state); },
    update(markers, tr) {
        if (tr.docChanged || tr.state.facet(executionLineFacet) !== tr.startState.facet(executionLineFacet)) {
            return createExecutionMarkers(tr.state);
        }
        return markers.map(tr.changes);
    },
    provide: f => lineNumberMarkers.from(f)
});

interface PlayerEditorProps {
    code: string;
    executionLine: number;
}

export function PlayerEditor({ code, executionLine }: PlayerEditorProps) {
    const editorRef = useRef<ReactCodeMirrorRef | null>(null);

    const customTheme = useMemo(() => EditorView.theme({
        "&": { backgroundColor: "transparent !important", height: "100%" },
        ".cm-scroller": {
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
            overflowX: "auto !important",
            overflowY: "auto !important",
            scrollbarWidth: "none",
            overscrollBehavior: "contain",
        },
        ".cm-scroller::-webkit-scrollbar": {
            display: "none",
        },
        ".cm-gutters": {
            backgroundColor: "#0d1117 !important",
            borderRight: "1px solid rgba(255,255,255,0.06) !important",
            color: "rgba(148, 163, 184, 0.4)",
            marginRight: "0 !important",
            paddingRight: "0px",
            paddingLeft: "16px",
        },
        ".cm-lineNumbers .cm-gutterElement": {
            color: "rgba(148, 163, 184, 0.3)",
            fontSize: "12px",
            transition: "color 0.2s ease, background-color 0.2s ease",
            paddingLeft: "5px !important",
            paddingRight: "10px !important",
        },
        ".cm-execution-line": {
            backgroundColor: "transparent !important",
            backgroundImage: "linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 100%) !important",
            backgroundClip: "padding-box !important",
            backgroundOrigin: "padding-box !important",
        },
        ".cm-execution-line::before": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "-1px",
            width: "1px",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            zIndex: 300,
            pointerEvents: "none",
        },
        ".cm-execution-gutter-element": {
            backgroundColor: "rgba(16, 185, 129, 0.2) !important",
            color: "#34d399 !important",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(52, 211, 153, 0.5)",
            boxShadow: "inset 2px 0 0 0 #34d399",
        },
        ".cm-content": {
            padding: "4px 0",
            flex: "1",
            minWidth: "0",
            scrollbarWidth: "none",
        },
        ".cm-content::-webkit-scrollbar": {
            display: "none",
        },
        ".cm-line": {
            padding: "0 12px 0 12px !important",
            position: "relative",
        },
    }), []);

    useEffect(() => {
        if (editorRef.current?.view && executionLine > 0) {
            const view = editorRef.current.view;
            const lineNum = Math.min(Math.max(1, executionLine), view.state.doc.lines);

            requestAnimationFrame(() => {
                if (view.state.doc.lines >= lineNum) {
                    const line = view.state.doc.line(lineNum);
                    const savedScrollY = window.scrollY;

                    view.dispatch({
                        effects: EditorView.scrollIntoView(line.from, { y: "center" })
                    });

                    window.scrollTo({ top: savedScrollY, behavior: 'instant' as ScrollBehavior });
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: savedScrollY, behavior: 'instant' as ScrollBehavior });
                    });
                }
            });
        }
    }, [executionLine]);

    return (
        <div className="flex-1 relative overflow-hidden flex flex-col text-[12px] sm:text-[13px] pt-4 pb-6 h-full min-h-0 bg-[#0d1117]" style={{ overscrollBehavior: 'contain' }}>
            <ReactCodeMirror
                ref={editorRef}
                value={code}
                readOnly={true}
                editable={false}
                height="100%"
                theme={[vscodeDark, customTheme]}
                extensions={[cpp(), executionLineFacet.of(executionLine), executionHighlightField, executionGutterField]}
                className="flex-1 font-mono tracking-tight overflow-hidden min-h-0"
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: false,
                    highlightActiveLineGutter: false,
                    highlightSelectionMatches: false,
                    syntaxHighlighting: true,
                    drawSelection: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: false,
                    bracketMatching: true,
                    closeBrackets: false,
                    autocompletion: false,
                    rectangularSelection: false,
                    crosshairCursor: false,
                    closeBracketsKeymap: false,
                    searchKeymap: false,
                    foldKeymap: false,
                    completionKeymap: false,
                    lintKeymap: false,
                }}
            />
        </div>
    );
}
