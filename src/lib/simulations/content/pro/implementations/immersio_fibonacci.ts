import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/immersio_fibonacci/main.cpp?raw";

export const immersio_fibonacci: Simulation = {
    id: "immersio_fibonacci",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(14, "pro.immersio_fibonacci.step_1")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(15, "pro.immersio_fibonacci.step_2")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4", "a": "0", "b": "1" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(10, "pro.immersio_fibonacci.step_3")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4", "a": "0", "b": "1" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(5, "pro.immersio_fibonacci.step_4")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4", "a": "0", "b": "1" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(6, "pro.immersio_fibonacci.step_5")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "3", "a": "1", "b": "1" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(5, "pro.immersio_fibonacci.step_6")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "3", "a": "1", "b": "1" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(6, "pro.immersio_fibonacci.step_7")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "2", "a": "1", "b": "2" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(5, "pro.immersio_fibonacci.step_8")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "2", "a": "1", "b": "2" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(6, "pro.immersio_fibonacci.step_9")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "1", "a": "2", "b": "3" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(5, "pro.immersio_fibonacci.step_10")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "1", "a": "2", "b": "3" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(6, "pro.immersio_fibonacci.step_11")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "0", "a": "3", "b": "5" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(5, "pro.immersio_fibonacci.step_12")
            
            .setActiveFile("main.cpp")
            .clearVariables()
            .setVariables({ "n": "4", "res": "3" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1"])
            .addStep(15, "pro.immersio_fibonacci.step_13")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4", "res": "3" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1", "3"])
            .addStep(16, "pro.immersio_fibonacci.step_14")
            
            .setActiveFile("main.cpp")
            .setVariables({ "n": "4", "res": "3" })
            .setTerminalOutput(["pro.immersio_fibonacci.term_1", "3", "pro.immersio_fibonacci.term_2"])
            .addStep(17, "pro.immersio_fibonacci.step_15");

        return builder.build();
    }
};
