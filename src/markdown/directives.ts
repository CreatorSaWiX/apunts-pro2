import type { ContainerDirective, LeafDirective, TextDirective, } from "mdast-util-directive";

export type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;
export type DirectiveName = "grid" | "graph" | "algoviz" | "oopviz" | "sqlviz" | "distinctviz" | "groupbyviz" | "aggregateviz" | "naturaljoinviz" | "unionviz" | "joinaggviz" | "extractviz" | "intervalviz" | "relalgviz" | "umlviz" | "uml2relviz" | "dmlviz" | "deleteviz" | "updateviz" | "dacviz" | "viewviz" | "viewupdviz" | "dbhierarchyviz" | "sessionviz" | "txviz" | "acidviz" | "interferencesviz" | "recoverviz" | "granuleviz" | "precedenceviz" | "lockviz" | "pr2fviz" | "isolationviz" | "deadlockviz" | "logviz" | "plpgsqlviz" | "returnviz" | "setofviz" | "varviz" | "foundviz" | "forloopviz" | "exceptionviz" | "ecaviz" | "triggerviz" | "tgvarsviz" | "trigretviz" | "incrtriggerviz" | "stmtguardviz" | "beforemodviz" | "beforefkviz" | "jdbcviz" | "jdbcconnviz" | "jdbcstmtviz" | "resultsetviz" | "sqlexceptionviz" | "storagearchviz" | "slottedpageviz" | "evviz" | "bplusviz" | "bplussizingviz" | "indexcostviz" | "multiindexviz" | "strategyviz" | "domainviz" | "assertionviz" | "stackviz" | "queueviz" | "heapviz" | "bstviz" | "abcviz" | "vectorviz" | "linkedlistviz" | "pointerviz" | "listviz" | "bintreeviz" | "proofviz" | "mafs" | "threeviz" | "three" | "videoviz" | "linkedinviz" | "youtubeviz" | "note" | "tip" | "warning" | "info" | "accordion" | "download" | "dictviz" | "tadviz" | "directaddressviz" | "hashviz" | "collisionviz" | "chainingviz" | "openaddressviz" | "treeterviz" | "abcdegenviz" | "avlrotviz" | "avlinsertviz" | "avldeleteviz" | "asymptoticviz" | "growthviz" | "dncviz" | "selectionsortviz" | "insertionsortviz" | "mergeviz" | "mergequeueviz" | "quicksortviz" | "hoarepartviz" | "fastpowerviz" | "mergerecviz" | "binarysearchviz" | "hybridmergeviz" | "mergebottomupviz" | "karatsubaviz" | "naivemultviz" | "naivematmultviz" | "strassenmatmultviz" | "hanoiviz" | "medianviz" | "bfprtviz" | "pqcompareviz" | "treetopoviz" | "minmaxheapviz" | "surarviz" | "enfonsarviz" | "ternaryheapviz" | "heapbuildviz" | "heapsortviz" | "dfsviz" | "bfsviz" | "dijkstraviz" | "graphrepviz" | "toposortviz" | "mstviz" | "gridbfsviz" | "jugsviz" | "backtrackviz" | "subsetsviz" | "subsetskviz" | "permutationsviz" | "nqueensviz" | "backtrack2dviz" | "derangementsviz" | "hamiltonviz" | "knapsackviz" | "shellviz" | "osmediatorviz" | "compileviz" | "processviz" | "procoverviewviz" | "processoverviewviz" | "signalpcbviz" | "killviz" | "sigactionviz" | "sigprocmaskviz" | "sigmaskviz" | "sigsuspendviz" | "alarmviz" | "forkviz" | "execviz" | "blockedviz" | "zombieviz" | "stoppedviz" | "contextswitchviz" | "schedulerviz" | "roundrobinviz" | "cfsviz" | "mmuviz" | "tlbviz" | "pagetableviz" | "pagingviz" | "memlayoutviz" | "sbrkviz" | "mallocviz" | "mmapviz" | "thrashingviz" | "pagefaultviz" | "cowviz" | "sharedlibviz" | "demandpagingviz";

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
  download:       makePassthrough("download"),
  graph:          makePassthrough("graph"),
  algoviz:        makePassthrough("algoviz"),
  oopviz:         makePassthrough("oopviz"),
  sqlviz:         makePassthrough("sqlviz"),
  distinctviz:    makePassthrough("distinctviz"),
  groupbyviz:     makePassthrough("groupbyviz"),
  aggregateviz:   makePassthrough("aggregateviz"),
  naturaljoinviz: makePassthrough("naturaljoinviz"),
  unionviz:       makePassthrough("unionviz"),
  joinaggviz:     makePassthrough("joinaggviz"),
  extractviz:     makePassthrough("extractviz"),
  intervalviz:    makePassthrough("intervalviz"),
  relalgviz:      makePassthrough("relalgviz"),
  umlviz:         makePassthrough("umlviz"),
  uml2relviz:     makePassthrough("uml2relviz"),
  dmlviz:         makePassthrough("dmlviz"),
  deleteviz:      makePassthrough("deleteviz"),
  updateviz:      makePassthrough("updateviz"),
  dacviz:         makePassthrough("dacviz"),
  viewviz:        makePassthrough("viewviz"),
  viewupdviz:     makePassthrough("viewupdviz"),
  dbhierarchyviz: makePassthrough("dbhierarchyviz"),
  sessionviz:     makePassthrough("sessionviz"),
  txviz:          makePassthrough("sessionviz"),
  acidviz:        makePassthrough("acidviz"),
  interferencesviz: makePassthrough("interferencesviz"),
  recoverviz:     makePassthrough("recoverviz"),
  granuleviz:     makePassthrough("granuleviz"),
  precedenceviz:  makePassthrough("precedenceviz"),
  lockviz:        makePassthrough("lockviz"),
  pr2fviz:        makePassthrough("pr2fviz"),
  isolationviz:   makePassthrough("isolationviz"),
  deadlockviz:    makePassthrough("deadlockviz"),
  logviz:         makePassthrough("logviz"),
  plpgsqlviz:     makePassthrough("plpgsqlviz"),
  returnviz:      makePassthrough("returnviz"),
  setofviz:       makePassthrough("setofviz"),
  varviz:         makePassthrough("varviz"),
  foundviz:       makePassthrough("foundviz"),
  forloopviz:     makePassthrough("forloopviz"),
  exceptionviz:   makePassthrough("exceptionviz"),
  ecaviz:         makePassthrough("ecaviz"),
  triggerviz:     makePassthrough("triggerviz"),
  tgvarsviz:      makePassthrough("tgvarsviz"),
  trigretviz:     makePassthrough("trigretviz"),
  incrtriggerviz: makePassthrough("incrtriggerviz"),
  stmtguardviz:   makePassthrough("stmtguardviz"),
  beforemodviz:   makePassthrough("beforemodviz"),
  beforefkviz:    makePassthrough("beforefkviz"),
  jdbcviz:        makePassthrough("jdbcviz"),
  jdbcconnviz:    makePassthrough("jdbcconnviz"),
  jdbcstmtviz:    makePassthrough("jdbcstmtviz"),
  resultsetviz:   makePassthrough("resultsetviz"),
  sqlexceptionviz: makePassthrough("sqlexceptionviz"),
  storagearchviz:  makePassthrough("storagearchviz"),
  slottedpageviz:  makePassthrough("slottedpageviz"),
  evviz:          makePassthrough("evviz"),
  bplusviz:       makePassthrough("bplusviz"),
  bplussizingviz: makePassthrough("bplussizingviz"),
  indexcostviz:   makePassthrough("indexcostviz"),
  multiindexviz:  makePassthrough("multiindexviz"),
  strategyviz:    makePassthrough("strategyviz"),
  domainviz:      makePassthrough("domainviz"),
  assertionviz:   makePassthrough("assertionviz"),
  stackviz:       makePassthrough("stackviz"),
  queueviz:       makePassthrough("queueviz"),
  vectorviz:      makePassthrough("vectorviz"),
  linkedlistviz:  makePassthrough("linkedlistviz"),
  pointerviz:     makePassthrough("pointerviz"),
  listviz:        makePassthrough("listviz"),
  bintreeviz:     makePassthrough("bintreeviz"),
  heapviz:        makePassthrough("heapviz"),
  bstviz:         makePassthrough("bstviz"),
  abcviz:         makePassthrough("abcviz"),
  proofviz:       makePassthrough("proofviz"),
  mafs:           makePassthrough("mafs"),
  videoviz:       makePassthrough("videoviz"),
  linkedinviz:    makePassthrough("linkedinviz"),
  youtubeviz:     makePassthrough("youtubeviz"),
  threeviz:       makePassthrough("threeviz"),
  three:          makePassthrough("threeviz"), // Alias → maps to same component
  dictviz:        makePassthrough("dictviz"),
  tadviz:         makePassthrough("tadviz"),
  directaddressviz: makePassthrough("directaddressviz"),
  hashviz:        makePassthrough("hashviz"),
  collisionviz:   makePassthrough("collisionviz"),
  chainingviz:    makePassthrough("chainingviz"),
  openaddressviz: makePassthrough("openaddressviz"),
  treeterviz:     makePassthrough("treeterviz"),
  abcdegenviz:    makePassthrough("abcdegenviz"),
  avlrotviz:      makePassthrough("avlrotviz"),
  avlinsertviz:   makePassthrough("avlinsertviz"),
  avldeleteviz:   makePassthrough("avldeleteviz"),
  asymptoticviz:  makePassthrough("asymptoticviz"),
  growthviz:      makePassthrough("growthviz"),
  dncviz:         makePassthrough("dncviz"),
  selectionsortviz: makePassthrough("selectionsortviz"),
  insertionsortviz: makePassthrough("insertionsortviz"),
  mergeviz:         makePassthrough("mergeviz"),
  mergequeueviz:    makePassthrough("mergequeueviz"),
  quicksortviz:     makePassthrough("quicksortviz"),
  hoarepartviz:     makePassthrough("hoarepartviz"),
  fastpowerviz:     makePassthrough("fastpowerviz"),
  mergerecviz:      makePassthrough("mergerecviz"),
  binarysearchviz:  makePassthrough("binarysearchviz"),
  hybridmergeviz:   makePassthrough("hybridmergeviz"),
  mergebottomupviz: makePassthrough("mergebottomupviz"),
  karatsubaviz:     makePassthrough("karatsubaviz"),
  naivemultviz:     makePassthrough("naivemultviz"),
  naivematmultviz:    makePassthrough("naivematmultviz"),
  strassenmatmultviz: makePassthrough("strassenmatmultviz"),
  hanoiviz:           makePassthrough("hanoiviz"),
  medianviz:          makePassthrough("medianviz"),
  bfprtviz:           makePassthrough("bfprtviz"),
  pqcompareviz:       makePassthrough("pqcompareviz"),
  treetopoviz:        makePassthrough("treetopoviz"),
  minmaxheapviz:      makePassthrough("minmaxheapviz"),
  surarviz:           makePassthrough("surarviz"),
  enfonsarviz:        makePassthrough("enfonsarviz"),
  ternaryheapviz:     makePassthrough("ternaryheapviz"),
  heapbuildviz:       makePassthrough("heapbuildviz"),
  heapsortviz:        makePassthrough("heapsortviz"),
  dfsviz:             makePassthrough("dfsviz"),
  bfsviz:             makePassthrough("bfsviz"),
  dijkstraviz:        makePassthrough("dijkstraviz"),
  graphrepviz:        makePassthrough("graphrepviz"),
  toposortviz:        makePassthrough("toposortviz"),
  mstviz:             makePassthrough("mstviz"),
  gridbfsviz:         makePassthrough("gridbfsviz"),
  jugsviz:            makePassthrough("jugsviz"),
  backtrackviz:       makePassthrough("backtrackviz"),
  subsetsviz:         makePassthrough("subsetsviz"),
  subsetskviz:        makePassthrough("subsetskviz"),
  permutationsviz:    makePassthrough("permutationsviz"),
  nqueensviz:         makePassthrough("nqueensviz"),
  backtrack2dviz:     makePassthrough("backtrack2dviz"),
  derangementsviz:    makePassthrough("derangementsviz"),
  hamiltonviz:        makePassthrough("hamiltonviz"),
  knapsackviz:        makePassthrough("knapsackviz"),
  shellviz:           makePassthrough("shellviz"),
  osmediatorviz:      makePassthrough("osmediatorviz"),
  compileviz:         makePassthrough("compileviz"),
  processviz:         makePassthrough("processviz"),
  procoverviewviz:    makePassthrough("procoverviewviz"),
  processoverviewviz: makePassthrough("processoverviewviz"),
  signalpcbviz:       makePassthrough("signalpcbviz"),
  killviz:            makePassthrough("killviz"),
  sigactionviz:       makePassthrough("sigactionviz"),
  sigprocmaskviz:     makePassthrough("sigprocmaskviz"),
  sigmaskviz:         makePassthrough("sigprocmaskviz"),
  sigsuspendviz:      makePassthrough("sigsuspendviz"),
  alarmviz:           makePassthrough("alarmviz"),
  forkviz:            makePassthrough("forkviz"),
  execviz:            makePassthrough("execviz"),
  blockedviz:         makePassthrough("blockedviz"),
  zombieviz:          makePassthrough("zombieviz"),
  stoppedviz:         makePassthrough("stoppedviz"),
  contextswitchviz:   makePassthrough("contextswitchviz"),
  schedulerviz:       makePassthrough("schedulerviz"),
  roundrobinviz:      makePassthrough("roundrobinviz"),
  cfsviz:             makePassthrough("cfsviz"),
  mmuviz:             makePassthrough("mmuviz"),
  tlbviz:             makePassthrough("tlbviz"),
  pagetableviz:       makePassthrough("pagetableviz"),
  pagingviz:          makePassthrough("pagingviz"),
  memlayoutviz:       makePassthrough("memlayoutviz"),
  sbrkviz:            makePassthrough("sbrkviz"),
  mallocviz:          makePassthrough("mallocviz"),
  mmapviz:            makePassthrough("mmapviz"),
  thrashingviz:       makePassthrough("thrashingviz"),
  pagefaultviz:       makePassthrough("pagefaultviz"),
  cowviz:             makePassthrough("cowviz"),
  sharedlibviz:       makePassthrough("sharedlibviz"),
  demandpagingviz:    makePassthrough("demandpagingviz"),
};