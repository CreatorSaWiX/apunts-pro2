import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/immersio_reverse/main.cpp?raw";

export const immersio_reverse: Simulation = {
    id: "immersio_reverse",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setVariables({ "text": "\"PRO2\"" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(15, "pro.immersio_reverse.step_1")
            
            .setActiveFile("main.cpp")
            .setVariables({ "text": "\"PRO2\"" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(16, "pro.immersio_reverse.step_2")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "0" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(11, "pro.immersio_reverse.step_3")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "0" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(6, "pro.immersio_reverse.step_4")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "0" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(7, "pro.immersio_reverse.step_5")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "1" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(6, "pro.immersio_reverse.step_6")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "1" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(7, "pro.immersio_reverse.step_7")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "2" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(6, "pro.immersio_reverse.step_8")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "2" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(7, "pro.immersio_reverse.step_9")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "3" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(6, "pro.immersio_reverse.step_10")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "3" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(7, "pro.immersio_reverse.step_11")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "i": "4 (size)" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(6, "pro.immersio_reverse.step_12")
            
            .setActiveFile("main.cpp")
            .setVariables({ "s": "\"PRO2\"", "retorn": "\"2ORP\"" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(7, "pro.immersio_reverse.step_13")
            
            .setActiveFile("main.cpp")
            .clearVariables()
            .setVariables({ "text": "\"PRO2\"", "res": "\"2ORP\"" })
            .setTerminalOutput(["pro.immersio_reverse.term_1"])
            .addStep(16, "pro.immersio_reverse.step_14")
            
            .setActiveFile("main.cpp")
            .setVariables({ "text": "\"PRO2\"", "res": "\"2ORP\"" })
            .setTerminalOutput(["pro.immersio_reverse.term_1", "2ORP"])
            .addStep(17, "pro.immersio_reverse.step_15")
            
            .setActiveFile("main.cpp")
            .setVariables({ "text": "\"PRO2\"", "res": "\"2ORP\"" })
            .setTerminalOutput(["pro.immersio_reverse.term_1", "2ORP", "pro.immersio_reverse.term_2"])
            .addStep(18, "pro.immersio_reverse.step_16");

        return builder.build();
    }
};
