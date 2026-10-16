"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";

type OperatorKey = "select" | "project" | "rename" | "union" | "diff" | "intersect" | "join" | "product";

interface OperatorMeta {
  key: OperatorKey;
  name: string;
  fib: string;
}

const OPERATORS: OperatorMeta[] = [
  { key: "select", name: "Selecció", fib: "T(c)" },
  { key: "project", name: "Projecció", fib: "T[A,B]" },
  { key: "rename", name: "Reanomenament", fib: "T{A→B}" },
  { key: "union", name: "Unió", fib: "T ∪ S" },
  { key: "diff", name: "Diferència", fib: "T − S" },
  { key: "intersect", name: "Intersecció", fib: "T ∩ S" },
  { key: "join", name: "Natural Join", fib: "T * S" },
  { key: "product", name: "Producte Cartesià", fib: "T × S" },
];

export default function RelationalAlgebraVisualizer() {
  const [activeOp, setActiveOp] = useState<OperatorKey>("select");

  return (
    <div className="w-full flex flex-col items-center my-8 font-mono select-none not-prose text-xs">
      {/* Selector minimalista de pastilles sense capçaleres ni títols */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
        {OPERATORS.map((op) => {
          const isSelected = activeOp === op.key;
          return (
            <button
              key={op.key}
              type="button"
              onClick={() => setActiveOp(op.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                  : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
              }`}
            >
              <span className={isSelected ? "text-sky-300/80 mr-1.5 font-normal" : "text-slate-500 mr-1.5 font-normal"}>
                {op.name}
              </span>
              <span>{op.fib}</span>
            </button>
          );
        })}
      </div>

      {/* Visualització integrada tipus imatge sense contenidor ni fons extern */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 py-2">
        <AnimatePresence mode="wait">
          {activeOp === "select" && <SelectViz key="select" />}
          {activeOp === "project" && <ProjectViz key="project" />}
          {activeOp === "rename" && <RenameViz key="rename" />}
          {activeOp === "union" && <SetOpViz key="union" op="union" />}
          {activeOp === "diff" && <SetOpViz key="diff" op="diff" />}
          {activeOp === "intersect" && <SetOpViz key="intersect" op="intersect" />}
          {activeOp === "join" && <JoinViz key="join" />}
          {activeOp === "product" && <ProductViz key="product" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. SELECCIÓ: FILTRE HORITZONTAL DE FILES
// -------------------------------------------------------------
function SelectViz() {
  const rows = [
    { id: 1, a: "1", b: "x", c: "α", match: true },
    { id: 2, a: "2", b: "y", c: "β", match: false },
    { id: 3, a: "3", b: "x", c: "γ", match: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full"
    >
      {/* Relació T */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-slate-500 font-bold self-start pl-1">T</span>
        <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
          <div className="grid grid-cols-3 bg-white/5 border-b border-white/10 text-[10px] text-slate-400 font-bold text-center">
            <span className="w-9 py-1">A</span>
            <span className="w-9 py-1 text-emerald-300">B</span>
            <span className="w-9 py-1">C</span>
          </div>
          {rows.map((r) => (
            <div
              key={r.id}
              className={`grid grid-cols-3 text-[11px] text-center transition-colors duration-200 ${
                r.match
                  ? "bg-emerald-500/15 text-emerald-200 font-semibold"
                  : "text-slate-600 opacity-35"
              }`}
            >
              <span className="w-9 py-1">{r.a}</span>
              <span className="w-9 py-1">{r.b}</span>
              <span className="w-9 py-1">{r.c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fletxa operació */}
      <ArrowConnector label="T(B = 'x')" color="emerald" />

      {/* Relació Resultat R */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-emerald-400 font-bold self-start pl-1">R</span>
        <div className="border border-emerald-500/30 rounded-lg overflow-hidden bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
          <div className="grid grid-cols-3 bg-emerald-500/10 border-b border-emerald-500/20 text-[10px] text-emerald-300 font-bold text-center">
            <span className="w-9 py-1">A</span>
            <span className="w-9 py-1">B</span>
            <span className="w-9 py-1">C</span>
          </div>
          {rows
            .filter((r) => r.match)
            .map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-3 text-[11px] text-center text-emerald-200 font-semibold"
              >
                <span className="w-9 py-1">{r.a}</span>
                <span className="w-9 py-1">{r.b}</span>
                <span className="w-9 py-1">{r.c}</span>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// 2. PROJECCIÓ: RETALL VERTICAL DE COLUMNES + SENSE DUPLICATS
// -------------------------------------------------------------
function ProjectViz() {
  const sourceRows = [
    { id: 1, a: "1", b: "x", c: "α" },
    { id: 2, a: "2", b: "y", c: "β" },
    { id: 3, a: "1", b: "x", c: "γ" }, // (1, x) és duplicat un cop eliminat C
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full"
    >
      {/* Relació T */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-slate-500 font-bold self-start pl-1">T</span>
        <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
          <div className="grid grid-cols-3 border-b border-white/10 text-[10px] text-center font-bold">
            <span className="w-9 py-1 bg-sky-500/20 text-sky-300">A</span>
            <span className="w-9 py-1 bg-sky-500/20 text-sky-300">B</span>
            <span className="w-9 py-1 text-slate-600 bg-white/5 opacity-40">C</span>
          </div>
          {sourceRows.map((r) => (
            <div key={r.id} className="grid grid-cols-3 text-[11px] text-center">
              <span className="w-9 py-1 bg-sky-500/10 text-sky-200 font-semibold">{r.a}</span>
              <span className="w-9 py-1 bg-sky-500/10 text-sky-200 font-semibold">{r.b}</span>
              <span className="w-9 py-1 text-slate-600 opacity-30">{r.c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fletxa operació */}
      <ArrowConnector label="T[A, B]" color="sky" />

      {/* Relació Resultat R */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-sky-400 font-bold self-start pl-1">R</span>
        <div className="border border-sky-500/30 rounded-lg overflow-hidden bg-sky-950/10 shadow-[0_0_15px_rgba(56,189,248,0.08)]">
          <div className="grid grid-cols-2 bg-sky-500/15 border-b border-sky-500/20 text-[10px] text-sky-300 font-bold text-center">
            <span className="w-9 py-1">A</span>
            <span className="w-9 py-1">B</span>
          </div>
          <div className="grid grid-cols-2 text-[11px] text-center text-sky-200 font-semibold">
            <span className="w-9 py-1">1</span>
            <span className="w-9 py-1">x</span>
          </div>
          <div className="grid grid-cols-2 text-[11px] text-center text-sky-200 font-semibold">
            <span className="w-9 py-1">2</span>
            <span className="w-9 py-1">y</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// 3. REANOMENAMENT: CANVI DE NOM D'ATRIBUTS (MATEIXA EXTENSIÓ)
// -------------------------------------------------------------
function RenameViz() {
  const rows = [
    { a: "1", b: "x", c: "α" },
    { a: "2", b: "y", c: "β" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full"
    >
      {/* Relació T */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-slate-500 font-bold self-start pl-1">T</span>
        <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
          <div className="grid grid-cols-3 border-b border-white/10 text-[10px] text-center font-bold">
            <span className="w-10 py-1 text-slate-400 bg-white/5">A</span>
            <span className="w-10 py-1 bg-cyan-500/20 text-cyan-300">B</span>
            <span className="w-10 py-1 text-slate-400 bg-white/5">C</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-3 text-[11px] text-center">
              <span className="w-10 py-1 text-slate-300">{r.a}</span>
              <span className="w-10 py-1 bg-cyan-500/10 text-cyan-200 font-semibold">{r.b}</span>
              <span className="w-10 py-1 text-slate-300">{r.c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fletxa operació */}
      <ArrowConnector label="T{B → NouB}" color="cyan" />

      {/* Relació Resultat R */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-cyan-400 font-bold self-start pl-1">R</span>
        <div className="border border-cyan-500/30 rounded-lg overflow-hidden bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
          <div className="grid grid-cols-3 bg-cyan-500/15 border-b border-cyan-500/20 text-[10px] text-cyan-300 font-bold text-center">
            <span className="w-10 py-1">A</span>
            <span className="w-10 py-1 text-cyan-200 font-bold">NouB</span>
            <span className="w-10 py-1">C</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-3 text-[11px] text-center text-cyan-100 font-semibold">
              <span className="w-10 py-1">{r.a}</span>
              <span className="w-10 py-1">{r.b}</span>
              <span className="w-10 py-1">{r.c}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// 3. OPERACIONS DE CONJUNTS: UNIÓ, DIFERÈNCIA, INTERSECCIÓ
// -------------------------------------------------------------
function SetOpViz({ op }: { op: "union" | "diff" | "intersect" }) {
  const rowsT = [
    { val: "1", inBoth: false },
    { val: "2", inBoth: true },
  ];
  const rowsS = [
    { val: "2", inBoth: true },
    { val: "3", inBoth: false },
  ];

  let resultRows: string[] = [];
  let symbol = "∪";
  let colorTheme: "violet" | "rose" | "emerald" = "violet";

  if (op === "union") {
    resultRows = ["1", "2", "3"];
    symbol = "∪";
    colorTheme = "violet";
  } else if (op === "diff") {
    resultRows = ["1"];
    symbol = "−";
    colorTheme = "rose";
  } else {
    resultRows = ["2"];
    symbol = "∩";
    colorTheme = "emerald";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full"
    >
      {/* T i S apilats o al costat */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold self-start pl-1">T</span>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
            <div className="bg-white/5 border-b border-white/10 text-[10px] text-slate-400 font-bold text-center px-3 py-0.5">
              A
            </div>
            {rowsT.map((r, i) => (
              <div
                key={i}
                className={`text-[11px] text-center px-3 py-0.5 transition-colors ${
                  op === "intersect"
                    ? r.inBoth
                      ? "bg-emerald-500/20 text-emerald-200 font-bold"
                      : "text-slate-600 opacity-40"
                    : op === "diff"
                    ? r.inBoth
                      ? "text-rose-400/50 line-through opacity-40"
                      : "bg-rose-500/15 text-rose-200 font-bold"
                    : "text-slate-300 font-medium"
                }`}
              >
                {r.val}
              </div>
            ))}
          </div>
        </div>

        <span className="text-slate-600 text-xs font-bold">{symbol}</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold self-start pl-1">S</span>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
            <div className="bg-white/5 border-b border-white/10 text-[10px] text-slate-400 font-bold text-center px-3 py-0.5">
              A
            </div>
            {rowsS.map((r, i) => (
              <div
                key={i}
                className={`text-[11px] text-center px-3 py-0.5 transition-colors ${
                  op === "intersect"
                    ? r.inBoth
                      ? "bg-emerald-500/20 text-emerald-200 font-bold"
                      : "text-slate-600 opacity-40"
                    : "text-slate-300 font-medium"
                }`}
              >
                {r.val}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fletxa operació */}
      <ArrowConnector label={op === "union" ? "T ∪ S" : op === "diff" ? "T − S" : "T ∩ S"} color={colorTheme} />

      {/* Relació Resultat R */}
      <div className="flex flex-col items-center gap-1">
        <span
          className={`text-[10px] font-bold self-start pl-1 ${
            colorTheme === "rose"
              ? "text-rose-400"
              : colorTheme === "emerald"
              ? "text-emerald-400"
              : "text-purple-400"
          }`}
        >
          R
        </span>
        <div
          className={`border rounded-lg overflow-hidden ${
            colorTheme === "rose"
              ? "border-rose-500/30 bg-rose-950/10 shadow-[0_0_15px_rgba(244,63,94,0.08)]"
              : colorTheme === "emerald"
              ? "border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
              : "border-purple-500/30 bg-purple-950/10 shadow-[0_0_15px_rgba(168,85,247,0.08)]"
          }`}
        >
          <div
            className={`border-b text-[10px] font-bold text-center px-4 py-0.5 ${
              colorTheme === "rose"
                ? "bg-rose-500/15 border-rose-500/20 text-rose-300"
                : colorTheme === "emerald"
                ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
                : "bg-purple-500/15 border-purple-500/20 text-purple-300"
            }`}
          >
            A
          </div>
          {resultRows.map((val) => (
            <div
              key={val}
              className={`text-[11px] text-center px-4 py-0.5 font-semibold ${
                colorTheme === "rose"
                  ? "text-rose-200"
                  : colorTheme === "emerald"
                  ? "text-emerald-200"
                  : "text-purple-200"
              }`}
            >
              {val}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// 4. NATURAL JOIN: CORRESPONDÈNCIA PER ATRIBUT COMÚ
// -------------------------------------------------------------
function JoinViz() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full"
    >
      <div className="flex items-center gap-2">
        {/* T (A, B) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold self-start pl-1">T</span>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
            <div className="grid grid-cols-2 bg-white/5 border-b border-white/10 text-[10px] text-center font-bold">
              <span className="w-8 py-0.5 text-slate-400">A</span>
              <span className="w-8 py-0.5 bg-amber-500/20 text-amber-300">B</span>
            </div>
            <div className="grid grid-cols-2 text-[11px] text-center">
              <span className="w-8 py-0.5 text-slate-300">1</span>
              <span className="w-8 py-0.5 bg-amber-500/10 text-amber-200 font-bold">x</span>
            </div>
            <div className="grid grid-cols-2 text-[11px] text-center">
              <span className="w-8 py-0.5 text-slate-300">2</span>
              <span className="w-8 py-0.5 bg-amber-500/10 text-amber-200 font-bold">y</span>
            </div>
          </div>
        </div>

        <span className="text-amber-500/70 text-xs font-bold">*</span>

        {/* S (B, C) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold self-start pl-1">S</span>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
            <div className="grid grid-cols-2 bg-white/5 border-b border-white/10 text-[10px] text-center font-bold">
              <span className="w-8 py-0.5 bg-amber-500/20 text-amber-300">B</span>
              <span className="w-8 py-0.5 text-slate-400">C</span>
            </div>
            <div className="grid grid-cols-2 text-[11px] text-center">
              <span className="w-8 py-0.5 bg-amber-500/10 text-amber-200 font-bold">x</span>
              <span className="w-8 py-0.5 text-slate-300">α</span>
            </div>
            <div className="grid grid-cols-2 text-[11px] text-center">
              <span className="w-8 py-0.5 bg-amber-500/10 text-amber-200 font-bold">y</span>
              <span className="w-8 py-0.5 text-slate-300">β</span>
            </div>
          </div>
        </div>
      </div>

      <ArrowConnector label="T * S" color="amber" />

      {/* R (A, B, C) */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-amber-400 font-bold self-start pl-1">R</span>
        <div className="border border-amber-500/30 rounded-lg overflow-hidden bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.08)]">
          <div className="grid grid-cols-3 bg-amber-500/15 border-b border-amber-500/20 text-[10px] text-amber-300 font-bold text-center">
            <span className="w-8 py-0.5">A</span>
            <span className="w-8 py-0.5 text-amber-200">B</span>
            <span className="w-8 py-0.5">C</span>
          </div>
          <div className="grid grid-cols-3 text-[11px] text-center text-amber-200 font-semibold">
            <span className="w-8 py-0.5">1</span>
            <span className="w-8 py-0.5 font-bold">x</span>
            <span className="w-8 py-0.5">α</span>
          </div>
          <div className="grid grid-cols-3 text-[11px] text-center text-amber-200 font-semibold">
            <span className="w-8 py-0.5">2</span>
            <span className="w-8 py-0.5 font-bold">y</span>
            <span className="w-8 py-0.5">β</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// 5. PRODUCTE CARTESIÀ: TOTES AMB TOTES
// -------------------------------------------------------------
function ProductViz() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full"
    >
      <div className="flex items-center gap-2">
        {/* T (A) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold self-start pl-1">T</span>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
            <div className="bg-white/5 border-b border-white/10 text-[10px] text-slate-400 font-bold text-center px-3 py-0.5">
              A
            </div>
            <div className="text-[11px] text-center px-3 py-0.5 text-slate-300">1</div>
            <div className="text-[11px] text-center px-3 py-0.5 text-slate-300">2</div>
          </div>
        </div>

        <span className="text-slate-600 text-xs font-bold">×</span>

        {/* S (B) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 font-bold self-start pl-1">S</span>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/40">
            <div className="bg-white/5 border-b border-white/10 text-[10px] text-slate-400 font-bold text-center px-3 py-0.5">
              B
            </div>
            <div className="text-[11px] text-center px-3 py-0.5 text-slate-300">x</div>
            <div className="text-[11px] text-center px-3 py-0.5 text-slate-300">y</div>
          </div>
        </div>
      </div>

      <ArrowConnector label="T × S" color="slate" />

      {/* R (A, B) */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-slate-400 font-bold self-start pl-1">R</span>
        <div className="border border-white/15 rounded-lg overflow-hidden bg-slate-950/40 shadow-[0_0_15px_rgba(255,255,255,0.03)]">
          <div className="grid grid-cols-2 bg-white/5 border-b border-white/10 text-[10px] text-slate-300 font-bold text-center">
            <span className="w-8 py-0.5">A</span>
            <span className="w-8 py-0.5">B</span>
          </div>
          {[
            { a: "1", b: "x" },
            { a: "1", b: "y" },
            { a: "2", b: "x" },
            { a: "2", b: "y" },
          ].map((pair, idx) => (
            <div key={idx} className="grid grid-cols-2 text-[11px] text-center text-slate-300">
              <span className="w-8 py-0.5">{pair.a}</span>
              <span className="w-8 py-0.5">{pair.b}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// FLETXA DE CONNEXIÓ SVG PURA I MINIMALISTA
// -------------------------------------------------------------
function ArrowConnector({
  symbol,
  label,
  color = "slate",
}: {
  symbol?: string;
  label?: string;
  color?: "emerald" | "sky" | "cyan" | "violet" | "rose" | "amber" | "slate";
}) {
  const colorMap = {
    emerald: "text-emerald-400 stroke-emerald-400",
    sky: "text-sky-400 stroke-sky-400",
    cyan: "text-cyan-400 stroke-cyan-400",
    violet: "text-purple-400 stroke-purple-400",
    rose: "text-rose-400 stroke-rose-400",
    amber: "text-amber-400 stroke-amber-400",
    slate: "text-slate-400 stroke-slate-500",
  };

  return (
    <div className="flex flex-col items-center justify-center py-1 sm:py-0">
      {label && <span className={`text-[10px] font-bold mb-1 ${colorMap[color]}`}>{label}</span>}
      <div className="flex items-center gap-1.5">
        <svg
          viewBox="0 0 42 16"
          className={`w-9 h-3.5 overflow-visible ${colorMap[color]}`}
          fill="none"
        >
          <line x1="0" y1="8" x2="36" y2="8" strokeWidth="1.5" stroke="currentColor" />
          <path
            d="M 32 4 L 38 8 L 32 12"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
          />
        </svg>
      </div>
      {symbol && !label && (
        <span className={`text-[11px] font-bold mt-1 ${colorMap[color]}`}>{symbol}</span>
      )}
    </div>
  );
}
