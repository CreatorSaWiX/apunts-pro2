import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/llista_iteradors/main.cpp?raw";

export const llista_iteradors: Simulation = {
    id: "llista_iteradors",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, -1, 30]" })
            .setTerminalOutput(["pro.llista_iteradors.term_1"])
            .addStep(23, "pro.llista_iteradors.step_1")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, -1, 30]" })
            .setTerminalOutput(["pro.llista_iteradors.term_2"])
            .addStep(24, "pro.llista_iteradors.step_2")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, -1, 30]", "it": "-> 10" })
            .setTerminalOutput(["pro.llista_iteradors.term_3"])
            .addStep(6, "pro.llista_iteradors.step_3")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, -1, 30]", "it": "-> 10" })
            .setTerminalOutput(["pro.llista_iteradors.term_4"])
            .addStep(8, "pro.llista_iteradors.step_4")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[10, -1, 30]", "it": "-> 10" })
            .setTerminalOutput(["pro.llista_iteradors.term_5"])
            .addStep(9, "pro.llista_iteradors.step_5")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[-1, 30]", "it": "-> -1" })
            .setTerminalOutput(["pro.llista_iteradors.term_6"])
            .addStep(10, "pro.llista_iteradors.step_6")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[-1, 30]", "it": "-> -1" })
            .setTerminalOutput(["pro.llista_iteradors.term_7"])
            .addStep(8, "pro.llista_iteradors.step_7")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[-1, 30]", "it": "-> -1" })
            .setTerminalOutput(["pro.llista_iteradors.term_8"])
            .addStep(9, "pro.llista_iteradors.step_8")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[-1, 30]", "it": "-> -1" })
            .setTerminalOutput(["pro.llista_iteradors.term_9"])
            .addStep(12, "pro.llista_iteradors.step_9")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "-> -1" })
            .setTerminalOutput(["pro.llista_iteradors.term_10"])
            .addStep(13, "pro.llista_iteradors.step_10")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "-> 30" })
            .setTerminalOutput(["pro.llista_iteradors.term_11"])
            .addStep(14, "pro.llista_iteradors.step_11")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "-> 30" })
            .setTerminalOutput(["pro.llista_iteradors.term_12"])
            .addStep(8, "pro.llista_iteradors.step_12")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "-> 30" })
            .setTerminalOutput(["pro.llista_iteradors.term_13"])
            .addStep(9, "pro.llista_iteradors.step_13")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "-> 30" })
            .setTerminalOutput(["pro.llista_iteradors.term_14"])
            .addStep(12, "pro.llista_iteradors.step_14")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "L.end() (fora de rang)" })
            .setTerminalOutput(["pro.llista_iteradors.term_15"])
            .addStep(17, "pro.llista_iteradors.step_15")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]", "it": "L.end() (fora de rang)" })
            .setTerminalOutput(["pro.llista_iteradors.term_16"])
            .addStep(8, "pro.llista_iteradors.step_16")
            
            .setActiveFile("main.cpp")
            .setVariables({ "L": "[0, -1, 30]" })
            .removeVariable("it")
            .setTerminalOutput(["pro.llista_iteradors.term_17"])
            .addStep(25, "pro.llista_iteradors.step_17");

        return builder.build();
    }
};
