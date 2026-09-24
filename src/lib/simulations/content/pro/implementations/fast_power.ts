import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/fast_power/source.cpp?raw";

export const fast_power: Simulation = {
    id: "fast_power",
    renderer: "oop",
    files: {
        "source.cpp": source_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        // Line reference for source.cpp:
        //  1: #include <iostream>
        //  2: using namespace std;
        //  3:
        //  4: double potencia(double x, int n) {
        //  5:     if (n == 0) return 1;
        //  6:     double y = potencia(x, n / 2);
        //  7:     if (n % 2 == 0) return y * y;
        //  8:     else return y * y * x;
        //  9: }
        // 10:
        // 11: int main() {
        // 12:     double resultat = potencia(2.0, 10);
        // 13:     cout << "2^10 = " << resultat << endl;
        // 14: }

        const TERM_RUN = "pro.fast_power.term_run";
        const TERM_OUTPUT = "pro.fast_power.term_output";
        const TERM_END = "pro.fast_power.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // ══════════════════════════════════════════
            // main()
            // ══════════════════════════════════════════

            .setVariables({ "x": "2.0", "n": "10" })
            .setTerminalOutput([TERM_RUN])
            .addStep(12, "pro.fast_power.step_1")

            // ══════════════════════════════════════════
            // potencia(2, 10) — n parell
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "10" })
            .addStep(5, "pro.fast_power.step_2")

            .addStep(6, "pro.fast_power.step_3")

            // ══════════════════════════════════════════
            // potencia(2, 5) — n senar
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "5" })
            .addStep(5, "pro.fast_power.step_4")

            .addStep(6, "pro.fast_power.step_5")

            // ══════════════════════════════════════════
            // potencia(2, 2) — n parell
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "2" })
            .addStep(5, "pro.fast_power.step_6")

            .addStep(6, "pro.fast_power.step_7")

            // ══════════════════════════════════════════
            // potencia(2, 1) — n senar
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "1" })
            .addStep(5, "pro.fast_power.step_8")

            .addStep(6, "pro.fast_power.step_9")

            // ══════════════════════════════════════════
            // potencia(2, 0) — cas base
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "0" })
            .addStep(5, "pro.fast_power.step_10")

            // ══════════════════════════════════════════
            // Desapilament: torna a potencia(2, 1)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "1", "y": "1" })
            .addStep(8, "pro.fast_power.step_11")

            // ══════════════════════════════════════════
            // Desapilament: torna a potencia(2, 2)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "2", "y": "2" })
            .addStep(7, "pro.fast_power.step_12")

            // ══════════════════════════════════════════
            // Desapilament: torna a potencia(2, 5)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "5", "y": "4" })
            .addStep(8, "pro.fast_power.step_13")

            // ══════════════════════════════════════════
            // Desapilament: torna a potencia(2, 10)
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "x": "2", "n": "10", "y": "32" })
            .addStep(7, "pro.fast_power.step_14")

            // ══════════════════════════════════════════
            // Torna a main()
            // ══════════════════════════════════════════

            .clearVariables()
            .setVariables({ "resultat": "1024" })
            .addStep(12, "pro.fast_power.step_15")

            .setTerminalOutput([TERM_RUN, TERM_OUTPUT])
            .addStep(13, "pro.fast_power.step_16")

            .setTerminalOutput([TERM_RUN, TERM_OUTPUT, TERM_END])
            .addStep(14, "pro.fast_power.step_17");

        return builder.build();
    }
};
