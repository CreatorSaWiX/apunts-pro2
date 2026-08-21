import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/iteradors_reversos/main.cpp?raw";

export const iteradors_reversos: Simulation = {
    id: "iteradors_reversos",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, 20, 30]" })
            .setTerminalOutput(["pro.iteradors_reversos.term_1"])
            .addStep(6, "pro.iteradors_reversos.step_1")
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, 20, 30] ∅", "it": "0xNULL (Fora de rang)" })
            .setTerminalOutput(["pro.iteradors_reversos.term_2"])
            .addStep(9, "pro.iteradors_reversos.step_2")
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, 20, 30]", "it": "-> 30 (0x7ffe1A)" })
            .setTerminalOutput(["pro.iteradors_reversos.term_3"])
            .addStep(10, "pro.iteradors_reversos.step_3")
            .setActiveFile("main.cpp")
            .setVariables({ "L_virtual_inv": "[30, 20, 10]", "rit": "-> 30 (0x7ffe1A)" })
            .setTerminalOutput(["pro.iteradors_reversos.term_4"])
            .addStep(13, "pro.iteradors_reversos.step_4")
            .setActiveFile("main.cpp")
            .setVariables({ "L_virtual_inv": "[30, 20, 10]", "rit": "-> 30 (0x7ffe1A)" })
            .setTerminalOutput(["pro.iteradors_reversos.term_5"])
            .addStep(14, "pro.iteradors_reversos.step_5")
            .setActiveFile("main.cpp")
            .setVariables({ "L_virtual_inv": "[35, 20, 10]", "rit": "-> 35 (0x7ffe1A)", "L_real": "[10, 20, 35]" })
            .setTerminalOutput(["pro.iteradors_reversos.term_6"])
            .addStep(15, "pro.iteradors_reversos.step_6")
            .setActiveFile("main.cpp")
            .setVariables({ "L_virtual_inv": "[35, 20, 10]", "rit": "-> 20 (0x7ffe2C)", "L_real": "[10, 20, 35]" })
            .setTerminalOutput(["pro.iteradors_reversos.term_7"])
            .addStep(16, "pro.iteradors_reversos.step_7")
            .setActiveFile("main.cpp")
            .setVariables({ "L_virtual_inv": "[35, 25, 10]", "rit": "-> 25 (0x7ffe2C)", "L_real": "[10, 25, 35]" })
            .setTerminalOutput(["pro.iteradors_reversos.term_8"])
            .addStep(15, "pro.iteradors_reversos.step_8")
            .setActiveFile("main.cpp")
            .setVariables({ "L_virtual_inv": "[35, 25, 15]", "rit": "-> 15 (0x7ffe3F)", "L_real": "[15, 25, 35]" })
            .setTerminalOutput(["pro.iteradors_reversos.term_9"])
            .addStep(15, "pro.iteradors_reversos.step_9")
            .setActiveFile("main.cpp")
            .setVariables({ "L_real": "[15, 25, 35]" })
            .setTerminalOutput(["pro.iteradors_reversos.term_10", "pro.iteradors_reversos.term_11"])
            .addStep(20, "pro.iteradors_reversos.step_10");

        return builder.build();
    }
};
