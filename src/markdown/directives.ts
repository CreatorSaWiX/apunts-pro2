import type { ContainerDirective, LeafDirective, TextDirective, } from "mdast-util-directive";

export type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;
export type DirectiveName = "grid";

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
    
    const data = (node.data ??= {});

    data.hName = "div";
    data.hProperties = {
      className: className,
    };
  },
};