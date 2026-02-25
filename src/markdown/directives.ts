import type { ContainerDirective, LeafDirective, TextDirective, } from "mdast-util-directive";

export type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;
export type DirectiveName = "grid" | "graph" | "algoviz" | "oopviz" | "stackviz" | "queueviz" | "note" | "tip" | "warning" | "info";

export type DirectiveHandler = (node: DirectiveNode) => void;

function toInt(value: unknown, fallback: number): number {
  const n = typeof value === "string" ? Number.parseInt(value) : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const directiveHandlers: Record<DirectiveName, DirectiveHandler> = {
  grid: function (node: DirectiveNode): void {
    const attrs = node.attributes ?? {};
    const cols = toInt(attrs["cols"], 2);

    //Responsive grid
    let className = "grid gap-4 grid-cols-1";

    if (cols === 2) className += " md:grid-cols-2";
    else if (cols === 3) className += " md:grid-cols-3";
    else if (cols === 4) className += " md:grid-cols-4";
    else if (cols > 1) className += " md:grid-cols-2";

    if (attrs.class) className += ` ${attrs.class}`;

    const data = (node.data ??= {});

    data.hName = "div";
    data.hProperties = {
      className,
    };
  },
  graph: function (node: DirectiveNode): void {
    const data = (node.data ??= {});
    const attrs = node.attributes ?? {};

    data.hName = "graph";
    data.hProperties = {
      ...attrs,
      // Pass other props if needed
    };
  },
  algoviz: function (node: DirectiveNode): void {
    const data = (node.data ??= {});
    const attrs = node.attributes ?? {};

    data.hName = "algoviz";
    data.hProperties = {
      ...attrs,
    };
  },
  oopviz: function (node: DirectiveNode): void {
    const data = (node.data ??= {});
    const attrs = node.attributes ?? {};

    data.hName = "oopviz";
    data.hProperties = {
      ...attrs,
    };
  },
  stackviz: function (node: DirectiveNode): void {
    const data = (node.data ??= {});
    const attrs = node.attributes ?? {};

    data.hName = "stackviz";
    data.hProperties = {
      ...attrs,
    };
  },
  queueviz: function (node: DirectiveNode): void {
    const data = (node.data ??= {});
    const attrs = node.attributes ?? {};

    data.hName = "queueviz";
    data.hProperties = {
      ...attrs,
    };
  },
  note: (node) => handleCallout(node, 'note'),
  tip: (node) => handleCallout(node, 'tip'),
  warning: (node) => handleCallout(node, 'warning'),
  info: (node) => handleCallout(node, 'info'),
};

function handleCallout(node: DirectiveNode, type: string) {
  const data = (node.data ??= {});
  const attrs = node.attributes || {};

  data.hName = "callout";
  data.hProperties = {
    type,
    title: attrs.title
  };
}