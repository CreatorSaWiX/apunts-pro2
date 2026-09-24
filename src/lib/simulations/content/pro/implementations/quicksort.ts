import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/quicksort/source.cpp?raw";

export const quicksort: Simulation = {
    id: "quicksort",
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
        //  5: int partition(vector<int>& T, int e, int d) {
        //  6:     int x = T[e];
        //  7:     int i = e - 1;
        //  8:     int j = d + 1;
        //  9:     for (;;) {
        // 10:         while (x < T[--j]);
        // 11:         while (T[++i] < x);
        // 12:         if (i >= j) return j;
        // 13:         swap(T[i], T[j]);
        // 14:     }
        // 15: }
        // 16:
        // 17: void quicksort(vector<int>& T, int e, int d) {
        // 18:     if (e < d) {
        // 19:         int q = partition(T, e, d);
        // 20:         quicksort(T, e, q);
        // 21:         quicksort(T, q + 1, d);
        // 22:     }
        // 23: }
        // 24:
        // 25: int main() {
        // 26:     vector<int> T = {5, 3, 1, 4};
        // 27:     quicksort(T, 0, T.size() - 1);
        // 28:     for (int x : T) cout << x << " ";
        // 29:     cout << endl;
        // 30: }

        const TERM_RUN = "pro.quicksort.term_run";
        const TERM_OUTPUT = "pro.quicksort.term_output";
        const TERM_END = "pro.quicksort.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // ══════════════════════════════════════════
            // main()
            // ══════════════════════════════════════════

            .setVariables({ "T": "[5, 3, 1, 4]" })
            .setTerminalOutput([TERM_RUN])
            .addStep(26, "pro.quicksort.step_1")

            .addStep(27, "pro.quicksort.step_2")

            // ══════════════════════════════════════════
            // quicksort(T, 0, 3)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "d": "3" })
            .addStep(18, "pro.quicksort.step_3")

            // ── partition(T, 0, 3) ──

            .clearVariables()
            .setVariables({ "x": "5", "i": "-1", "j": "4" })
            .addStep(6, "pro.quicksort.step_4")

            // Iter 1: while j
            .setVariables({ "x": "5", "i": "-1", "j": "3", "T[j]": "4" })
            .addStep(10, "pro.quicksort.step_5")

            // Iter 1: while i
            .setVariables({ "x": "5", "i": "0", "j": "3", "T[i]": "5" })
            .addStep(11, "pro.quicksort.step_6")

            // swap(T[0], T[3])
            .setVariables({ "T": "[4, 3, 1, 5]", "x": "5", "i": "0", "j": "3" })
            .addStep(13, "pro.quicksort.step_7")

            // Iter 2: while j
            .setVariables({ "x": "5", "i": "0", "j": "2", "T[j]": "1" })
            .addStep(10, "pro.quicksort.step_8")

            // Iter 2: while i (avança 3 posicions)
            .setVariables({ "x": "5", "i": "3", "j": "2", "T[i]": "5" })
            .addStep(11, "pro.quicksort.step_9")

            // i >= j → return j=2
            .clearVariables()
            .setVariables({ "i": "3", "j": "2", "retorn": "2" })
            .addStep(12, "pro.quicksort.step_10")

            // Torna a quicksort(0,3): q=2
            .clearVariables()
            .setVariables({ "e": "0", "d": "3", "q": "2", "T": "[4, 3, 1, 5]" })
            .addStep(19, "pro.quicksort.step_11")

            // Crida quicksort(0, 2)
            .addStep(20, "pro.quicksort.step_12")

            // ══════════════════════════════════════════
            // quicksort(T, 0, 2)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "d": "2" })
            .addStep(18, "pro.quicksort.step_13")

            // ── partition(T, 0, 2) ──

            .clearVariables()
            .setVariables({ "x": "4", "i": "-1", "j": "3" })
            .addStep(6, "pro.quicksort.step_14")

            // while j
            .setVariables({ "x": "4", "i": "-1", "j": "2", "T[j]": "1" })
            .addStep(10, "pro.quicksort.step_15")

            // while i
            .setVariables({ "x": "4", "i": "0", "j": "2", "T[i]": "4" })
            .addStep(11, "pro.quicksort.step_16")

            // swap(T[0], T[2])
            .setVariables({ "T": "[1, 3, 4, 5]", "x": "4", "i": "0", "j": "2" })
            .addStep(13, "pro.quicksort.step_17")

            // while j
            .setVariables({ "x": "4", "i": "0", "j": "1", "T[j]": "3" })
            .addStep(10, "pro.quicksort.step_18")

            // while i (avança 2 posicions)
            .setVariables({ "x": "4", "i": "2", "j": "1", "T[i]": "4" })
            .addStep(11, "pro.quicksort.step_19")

            // i >= j → return j=1
            .clearVariables()
            .setVariables({ "i": "2", "j": "1", "retorn": "1" })
            .addStep(12, "pro.quicksort.step_20")

            // Torna a quicksort(0,2): q=1
            .clearVariables()
            .setVariables({ "e": "0", "d": "2", "q": "1", "T": "[1, 3, 4, 5]" })
            .addStep(19, "pro.quicksort.step_21")

            // ══════════════════════════════════════════
            // quicksort(T, 0, 1)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "e": "0", "d": "1" })
            .addStep(18, "pro.quicksort.step_22")

            // ── partition(T, 0, 1) ──

            .clearVariables()
            .setVariables({ "x": "1", "i": "-1", "j": "2" })
            .addStep(6, "pro.quicksort.step_23")

            // while j (avança 2: j=1→T[1]=3,1<3✓; j=0→T[0]=1)
            .setVariables({ "x": "1", "i": "-1", "j": "0", "T[j]": "1" })
            .addStep(10, "pro.quicksort.step_24")

            // while i
            .setVariables({ "x": "1", "i": "0", "j": "0", "T[i]": "1" })
            .addStep(11, "pro.quicksort.step_25")

            // i >= j → return j=0
            .clearVariables()
            .setVariables({ "i": "0", "j": "0", "retorn": "0" })
            .addStep(12, "pro.quicksort.step_26")

            // q=0 → quicksort(0,0) i quicksort(1,1): base cases
            .clearVariables()
            .setVariables({ "e": "0", "d": "1", "q": "0" })
            .addStep(19, "pro.quicksort.step_27")

            // Torna a quicksort(0,2): quicksort(2,2) base case
            .clearVariables()
            .setVariables({ "e": "2", "d": "2" })
            .addStep(18, "pro.quicksort.step_28")

            // Torna a quicksort(0,3): quicksort(3,3) base case
            .clearVariables()
            .setVariables({ "e": "3", "d": "3" })
            .addStep(18, "pro.quicksort.step_29")

            // ══════════════════════════════════════════
            // Torna a main(): cout
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "T": "[1, 3, 4, 5]" })
            .setTerminalOutput([TERM_RUN, TERM_OUTPUT])
            .addStep(28, "pro.quicksort.step_30")

            .setTerminalOutput([TERM_RUN, TERM_OUTPUT, TERM_END])
            .addStep(30, "pro.quicksort.step_31");

        return builder.build();
    }
};
