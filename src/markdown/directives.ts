import type {ContainerDirective, LeafDirective, TextDirective,} from "mdast-util-directive";

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
    const cols = toInt(attrs["cols"], 1);

    const data = (node.data ??= {});

    data.hName = "div";
    data.hProperties = {
      className: "grid gap-4",
      style: `grid-template-columns: repeat(${cols}, minmax(0, 1fr))`
    };
  },
};