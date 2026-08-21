import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/punt_basic/main.cpp?raw";
import Punt_hpp_raw from "../code/punt_basic/Punt.hpp?raw";
import Punt_cpp_raw from "../code/punt_basic/Punt.cpp?raw";

export const punt_basic: Simulation = {
    id: "punt_basic",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
        "Punt.hpp": Punt_hpp_raw,
        "Punt.cpp": Punt_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.punt_basic.term_1"])
            .addStep(5, "pro.punt_basic.step_1")
            .setActiveFile("main.cpp")
            .setVariables({ "p": "Punt {x: -858993460, y: -858993460}" })
            .setTerminalOutput(["pro.punt_basic.term_2"])
            .addStep(6, "pro.punt_basic.step_2")
            .setActiveFile("Punt.cpp")
            .setVariables({ "p": "Punt {x: -858993460, y: -858993460}", "a": "1", "b": "2", "this": "0x7fffffffe410" })
            .setTerminalOutput(["pro.punt_basic.term_3"])
            .addStep(3, "pro.punt_basic.step_3")
            .setActiveFile("Punt.cpp")
            .setVariables({ "p": "Punt {x: 1, y: -858993460}", "a": "1", "b": "2", "this": "0x7fffffffe410" })
            .setTerminalOutput(["pro.punt_basic.term_4"])
            .addStep(4, "pro.punt_basic.step_4")
            .setActiveFile("Punt.cpp")
            .setVariables({ "p": "Punt {x: 1, y: 2}", "a": "1", "b": "2", "this": "0x7fffffffe410" })
            .setTerminalOutput(["pro.punt_basic.term_5"])
            .addStep(5, "pro.punt_basic.step_5")
            .setActiveFile("main.cpp")
            .setVariables({ "p": "Punt {x: 1, y: 2}" })
            .setTerminalOutput(["pro.punt_basic.term_6"])
            .addStep(6, "pro.punt_basic.step_6")
            .setActiveFile("main.cpp")
            .setVariables({ "p": "Punt {x: 1, y: 2}" })
            .setTerminalOutput(["pro.punt_basic.term_7"])
            .addStep(8, "pro.punt_basic.step_7")
            .setActiveFile("Punt.cpp")
            .setVariables({ "p": "Punt {x: 4, y: 2}", "dx": "3", "dy": "3", "this": "0x7fffffffe410" })
            .setTerminalOutput(["pro.punt_basic.term_8"])
            .addStep(9, "pro.punt_basic.step_8")
            .setActiveFile("Punt.cpp")
            .setVariables({ "p": "Punt {x: 4, y: 5}", "dx": "3", "dy": "3", "this": "0x7fffffffe410" })
            .setTerminalOutput(["pro.punt_basic.term_9"])
            .addStep(10, "pro.punt_basic.step_9")
            .setActiveFile("main.cpp")
            .setVariables({ "p": "Punt {x: 4, y: 5}" })
            .setTerminalOutput(["pro.punt_basic.term_10"])
            .addStep(10, "pro.punt_basic.step_10")
            .setActiveFile("Punt.cpp")
            .setVariables({ "p": "Punt {x: 4, y: 5}", "this": "0x7fffffffe410" })
            .setTerminalOutput(["pro.punt_basic.term_11"])
            .addStep(14, "pro.punt_basic.step_11")
            .setActiveFile("main.cpp")
            .setVariables({ "p": "Punt {x: 4, y: 5}" })
            .setTerminalOutput(["pro.punt_basic.term_12", "pro.punt_basic.term_13"])
            .addStep(10, "pro.punt_basic.step_12")
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.punt_basic.term_14", "pro.punt_basic.term_15", "pro.punt_basic.term_16"])
            .addStep(11, "pro.punt_basic.step_13");

        return builder.build();
    }
};
