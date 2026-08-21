import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/cua_cpp/main.cpp?raw";

export const cua_cpp: Simulation = {
    id: "cua_cpp",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.cua_cpp.term_1"])
            .addStep(5, "pro.cua_cpp.step_1")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "[]", "Q.size()": "0" })
            .setTerminalOutput(["pro.cua_cpp.term_2"])
            .addStep(6, "pro.cua_cpp.step_2")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "[10]", "Q.size()": "1" })
            .setTerminalOutput(["pro.cua_cpp.term_3"])
            .addStep(8, "pro.cua_cpp.step_3")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "dav[10, 20]dar", "Q.size()": "2" })
            .setTerminalOutput(["pro.cua_cpp.term_4"])
            .addStep(9, "pro.cua_cpp.step_4")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "dav[10, 20, 30]dar", "Q.size()": "3" })
            .setTerminalOutput(["pro.cua_cpp.term_5"])
            .addStep(10, "pro.cua_cpp.step_5")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "dav[10, 20, 30]dar", "processar": "10" })
            .setTerminalOutput(["pro.cua_cpp.term_6"])
            .addStep(12, "pro.cua_cpp.step_6")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "dav[10, 20, 30]dar", "processar": "10" })
            .setTerminalOutput(["pro.cua_cpp.term_7", "pro.cua_cpp.term_8"])
            .addStep(13, "pro.cua_cpp.step_7")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "dav[20, 30]dar", "processar": "10" })
            .setTerminalOutput(["pro.cua_cpp.term_9", "pro.cua_cpp.term_10"])
            .addStep(15, "pro.cua_cpp.step_8")
            .setActiveFile("main.cpp")
            .setVariables({ "Q": "dav[20, 30]dar", "processar": "10" })
            .setTerminalOutput(["pro.cua_cpp.term_11", "pro.cua_cpp.term_12", "pro.cua_cpp.term_13"])
            .addStep(16, "pro.cua_cpp.step_9")
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.cua_cpp.term_14", "pro.cua_cpp.term_15", "pro.cua_cpp.term_16", "pro.cua_cpp.term_17"])
            .addStep(18, "pro.cua_cpp.step_10");

        return builder.build();
    }
};
