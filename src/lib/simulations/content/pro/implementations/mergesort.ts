import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/mergesort/source.cpp?raw";

export const mergesort: Simulation = {
    id: "mergesort",
    renderer: "oop",
    files: {
        "source.cpp": source_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        // Line reference for source.cpp:
        //  1: #include <iostream>
        //  2: #include <vector>
        //  3: using namespace std;
        //  4:
        //  5: void merge(vector<int>& T, int e, int m, int d) {
        //  6:     vector<int> B(d - e + 1);
        //  7:     int i = e, j = m + 1, k = 0;
        //  8:     while (i <= m and j <= d) {
        //  9:         if (T[i] <= T[j]) B[k++] = T[i++];
        // 10:         else B[k++] = T[j++];
        // 11:     }
        // 12:     while (i <= m) B[k++] = T[i++];
        // 13:     while (j <= d) B[k++] = T[j++];
        // 14:     for (k = 0; k <= d - e; ++k) T[e + k] = B[k];
        // 15: }
        // 16:
        // 17: void mergesort(vector<int>& T, int e, int d) {
        // 18:     if (e < d) {
        // 19:         int m = (e + d) / 2;
        // 20:         mergesort(T, e, m);
        // 21:         mergesort(T, m + 1, d);
        // 22:         merge(T, e, m, d);
        // 23:     }
        // 24: }
        // 25:
        // 26: int main() {
        // 27:     vector<int> T = {8, 2, 5, 1};
        // 28:     mergesort(T, 0, T.size() - 1);
        // 29:     for (int x : T) cout << x << " ";
        // 30:     cout << endl;
        // 31: }

        const TERM_RUN = "pro.mergesort.term_run";
        const TERM_OUTPUT = "pro.mergesort.term_output";
        const TERM_END = "pro.mergesort.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // ══════════════════════════════════════════
            // main()
            // ══════════════════════════════════════════

            .setVariables({ "T": "[8, 2, 5, 1]" })
            .setTerminalOutput([TERM_RUN])
            .addStep(27, "pro.mergesort.step_1")

            .addStep(28, "pro.mergesort.step_2")

            // ══════════════════════════════════════════
            // mergesort(T, 0, 3)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "d": "3" })
            .addStep(18, "pro.mergesort.step_3")

            .setVariables({ "e": "0", "d": "3", "m": "1" })
            .addStep(19, "pro.mergesort.step_4")

            // ── mergesort(T, 0, 1) ──

            .clearVariables()
            .setVariables({ "e": "0", "d": "1" })
            .addStep(18, "pro.mergesort.step_5")

            .setVariables({ "e": "0", "d": "1", "m": "0" })
            .addStep(19, "pro.mergesort.step_6")

            // ── mergesort(T, 0, 0) → cas base ──

            .clearVariables()
            .setVariables({ "e": "0", "d": "0" })
            .addStep(18, "pro.mergesort.step_7")

            // ── mergesort(T, 1, 1) → cas base ──

            .clearVariables()
            .setVariables({ "e": "1", "d": "1" })
            .addStep(18, "pro.mergesort.step_8")

            // ══════════════════════════════════════════
            // merge(T, 0, 0, 1) — fusiona [8] i [2]
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "m": "0", "d": "1" })
            .addStep(22, "pro.mergesort.step_9")

            .setVariables({ "e": "0", "m": "0", "d": "1", "B": "[_, _]", "i": "0", "j": "1", "k": "0" })
            .addStep(7, "pro.mergesort.step_10")

            // while: T[0]=8 > T[1]=2 → B[0]=2
            .setVariables({ "e": "0", "m": "0", "d": "1", "T": "[8, 2, 5, 1]", "B": "[2, _]", "i": "0", "j": "2", "k": "1" })
            .addStep(10, "pro.mergesort.step_11")

            // j=2 > d=1 → surt. Residual: B[1]=T[0]=8
            .setVariables({ "e": "0", "m": "0", "d": "1", "B": "[2, 8]", "i": "1", "k": "2" })
            .addStep(12, "pro.mergesort.step_12")

            // Bolcat: T[0..1] = [2, 8]
            .clearVariables()
            .setVariables({ "T": "[2, 8, 5, 1]" })
            .addStep(14, "pro.mergesort.step_13")

            // ══════════════════════════════════════════
            // Torna a mergesort(0, 3) → crida mergesort(2, 3)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "d": "3", "m": "1" })
            .addStep(21, "pro.mergesort.step_14")

            // ── mergesort(T, 2, 3) ──

            .clearVariables()
            .setVariables({ "e": "2", "d": "3" })
            .addStep(18, "pro.mergesort.step_15")

            .setVariables({ "e": "2", "d": "3", "m": "2" })
            .addStep(19, "pro.mergesort.step_16")

            // ── mergesort(T, 2, 2) → cas base ──

            .clearVariables()
            .setVariables({ "e": "2", "d": "2" })
            .addStep(18, "pro.mergesort.step_17")

            // ── mergesort(T, 3, 3) → cas base ──

            .clearVariables()
            .setVariables({ "e": "3", "d": "3" })
            .addStep(18, "pro.mergesort.step_18")

            // ══════════════════════════════════════════
            // merge(T, 2, 2, 3) — fusiona [5] i [1]
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "2", "m": "2", "d": "3" })
            .addStep(22, "pro.mergesort.step_19")

            .setVariables({ "e": "2", "m": "2", "d": "3", "B": "[_, _]", "i": "2", "j": "3", "k": "0" })
            .addStep(7, "pro.mergesort.step_20")

            // while: T[2]=5 > T[3]=1 → B[0]=1
            .setVariables({ "e": "2", "m": "2", "d": "3", "T": "[2, 8, 5, 1]", "B": "[1, _]", "i": "2", "j": "4", "k": "1" })
            .addStep(10, "pro.mergesort.step_21")

            // j=4 > d=3 → surt. Residual: B[1]=T[2]=5
            .setVariables({ "e": "2", "m": "2", "d": "3", "B": "[1, 5]", "i": "3", "k": "2" })
            .addStep(12, "pro.mergesort.step_22")

            // Bolcat: T[2..3] = [1, 5]
            .clearVariables()
            .setVariables({ "T": "[2, 8, 1, 5]" })
            .addStep(14, "pro.mergesort.step_23")

            // ══════════════════════════════════════════
            // merge(T, 0, 1, 3) — fusió FINAL [2,8] i [1,5]
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "m": "1", "d": "3" })
            .addStep(22, "pro.mergesort.step_24")

            .setVariables({ "e": "0", "m": "1", "d": "3", "B": "[_, _, _, _]", "i": "0", "j": "2", "k": "0" })
            .addStep(7, "pro.mergesort.step_25")

            // while iter 1: T[0]=2 > T[2]=1 → B[0]=1
            .setVariables({ "e": "0", "m": "1", "d": "3", "T": "[2, 8, 1, 5]", "B": "[1, _, _, _]", "i": "0", "j": "3", "k": "1" })
            .addStep(10, "pro.mergesort.step_26")

            // while iter 2: T[0]=2 ≤ T[3]=5 → B[1]=2
            .setVariables({ "e": "0", "m": "1", "d": "3", "T": "[2, 8, 1, 5]", "B": "[1, 2, _, _]", "i": "1", "j": "3", "k": "2" })
            .addStep(9, "pro.mergesort.step_27")

            // while iter 3: T[1]=8 > T[3]=5 → B[2]=5
            .setVariables({ "e": "0", "m": "1", "d": "3", "T": "[2, 8, 1, 5]", "B": "[1, 2, 5, _]", "i": "1", "j": "4", "k": "3" })
            .addStep(10, "pro.mergesort.step_28")

            // j=4 > d=3 → surt. Residual: B[3]=T[1]=8
            .setVariables({ "e": "0", "m": "1", "d": "3", "B": "[1, 2, 5, 8]", "i": "2", "k": "4" })
            .addStep(12, "pro.mergesort.step_29")

            // Bolcat final: T=[1,2,5,8]
            .clearVariables()
            .setVariables({ "T": "[1, 2, 5, 8]" })
            .addStep(14, "pro.mergesort.step_30")

            // ══════════════════════════════════════════
            // Torna a main(): cout
            // ══════════════════════════════════════════

            .setTerminalOutput([TERM_RUN, TERM_OUTPUT])
            .addStep(29, "pro.mergesort.step_31")

            .setTerminalOutput([TERM_RUN, TERM_OUTPUT, TERM_END])
            .addStep(31, "pro.mergesort.step_32");

        return builder.build();
    }
};
