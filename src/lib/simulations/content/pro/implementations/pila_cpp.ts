import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/pila_cpp/main.cpp?raw";

export const pila_cpp: Simulation = {
    id: "pila_cpp",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.pila_cpp.term_1"])
            .addStep(5, "pro.pila_cpp.step_1")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[]", "S.size()": "0" })
            .setTerminalOutput(["pro.pila_cpp.term_2"])
            .addStep(6, "pro.pila_cpp.step_2")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10] <- dalt", "S.size()": "1" })
            .setTerminalOutput(["pro.pila_cpp.term_3"])
            .addStep(8, "pro.pila_cpp.step_3")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10, 20] <- dalt", "S.size()": "2" })
            .setTerminalOutput(["pro.pila_cpp.term_4"])
            .addStep(9, "pro.pila_cpp.step_4")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10, 20, 30] <- dalt", "S.size()": "3" })
            .setTerminalOutput(["pro.pila_cpp.term_5"])
            .addStep(10, "pro.pila_cpp.step_5")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10, 20, 30] <- dalt", "top": "30" })
            .setTerminalOutput(["pro.pila_cpp.term_6"])
            .addStep(12, "pro.pila_cpp.step_6")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10, 20, 30] <- dalt", "top": "30" })
            .setTerminalOutput(["pro.pila_cpp.term_7", "pro.pila_cpp.term_8"])
            .addStep(13, "pro.pila_cpp.step_7")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10, 20] <- dalt", "top": "30" })
            .setTerminalOutput(["pro.pila_cpp.term_9", "pro.pila_cpp.term_10"])
            .addStep(15, "pro.pila_cpp.step_8")
            .setActiveFile("main.cpp")
            .setVariables({ "S": "[10, 20] <- dalt", "top": "30" })
            .setTerminalOutput(["pro.pila_cpp.term_11", "pro.pila_cpp.term_12", "pro.pila_cpp.term_13"])
            .addStep(16, "pro.pila_cpp.step_9")
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.pila_cpp.term_14", "pro.pila_cpp.term_15", "pro.pila_cpp.term_16", "pro.pila_cpp.term_17"])
            .addStep(18, "pro.pila_cpp.step_10");

        return builder.build();
    }
};
