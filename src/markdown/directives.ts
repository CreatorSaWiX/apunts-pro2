import type { ContainerDirective, LeafDirective, TextDirective, } from "mdast-util-directive";

export type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;
export type DirectiveName = "grid" | "graph" | "algoviz" | "oopviz" | "stackviz" | "queueviz" | "heapviz" | "bstviz" | "vectorviz" | "linkedlistviz" | "pointerviz" | "listviz" | "bintreeviz" | "proofviz" | "mafs" | "threeviz" | "three" | "videoviz" | "linkedinviz" | "youtubeviz" | "note" | "tip" | "warning" | "info" | "accordion";

export type DirectiveHandler = (node: DirectiveNode) => void;

function toInt(value: unknown, fallback: number): number {
  const n = typeof value === "string" ? Number.parseInt(value) : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Factory for directives that simply pass all attributes through to a
 * custom HTML element. Eliminates the previous 18 copy-pasted handlers.
 */
function makePassthrough(hName: string): DirectiveHandler {
  return (node: DirectiveNode): void => {
    const data = (node.data ??= {});
    data.hName = hName;
    data.hProperties = { ...(node.attributes ?? {}) };
  };
}

function handleCallout(node: DirectiveNode, type: string) {
  const data = (node.data ??= {});
  const attrs = node.attributes || {};

  data.hName = "callout";
  data.hProperties = {
    type,
    title: attrs.title
  };
}

export const directiveHandlers: Record<DirectiveName, DirectiveHandler> = {
  // --- Custom handlers (unique logic) ---
  grid: function (node: DirectiveNode): void {
    const attrs = node.attributes ?? {};
    const cols = toInt(attrs["cols"], 2);

    //Responsive grid
    let className = "grid gap-4 grid-cols-1";

    if (cols === 2) className += " md:grid-cols-2";
    else if (cols === 3) className += " md:grid-cols-3";
    else if (cols === 4) className += " md:grid-cols-4";
    else if (cols === 5) className += " md:grid-cols-3 lg:grid-cols-5";
    else if (cols > 1) className += " md:grid-cols-2";

    if (attrs.class) className += ` ${attrs.class}`;

    const data = (node.data ??= {});

    data.hName = "div";
    data.hProperties = {
      className,
    };
  },

  note: (node) => handleCallout(node, 'note'),
  tip: (node) => handleCallout(node, 'tip'),
  warning: (node) => handleCallout(node, 'warning'),
  info: (node) => handleCallout(node, 'info'),

  accordion: makePassthrough("accordion"),

  // --- Passthrough handlers (all share the same logic) ---
  graph:          makePassthrough("graph"),
  algoviz:        makePassthrough("algoviz"),
  oopviz:         makePassthrough("oopviz"),
  stackviz:       makePassthrough("stackviz"),
  queueviz:       makePassthrough("queueviz"),
  vectorviz:      makePassthrough("vectorviz"),
  linkedlistviz:  makePassthrough("linkedlistviz"),
  pointerviz:     makePassthrough("pointerviz"),
  listviz:        makePassthrough("listviz"),
  bintreeviz:     makePassthrough("bintreeviz"),
  heapviz:        makePassthrough("heapviz"),
  bstviz:         makePassthrough("bstviz"),
  proofviz:       makePassthrough("proofviz"),
  mafs:           makePassthrough("mafs"),
  videoviz:       makePassthrough("videoviz"),
  linkedinviz:    makePassthrough("linkedinviz"),
  youtubeviz:     makePassthrough("youtubeviz"),
  threeviz:       makePassthrough("threeviz"),
  three:          makePassthrough("threeviz"), // Alias → maps to same component
};