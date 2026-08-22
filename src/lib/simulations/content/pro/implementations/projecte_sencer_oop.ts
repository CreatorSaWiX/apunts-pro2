import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import Makefile_raw from "../code/projecte_sencer_oop/Makefile?raw";
import main_cc_raw from "../code/projecte_sencer_oop/main.cc?raw";
import Punt_hpp_raw from "../code/projecte_sencer_oop/Punt.hpp?raw";
import Punt_cpp_raw from "../code/projecte_sencer_oop/Punt.cpp?raw";

export const projecte_sencer_oop: Simulation = {
    id: "projecte_sencer_oop",
    renderer: "oop",
    files: {
        "Makefile": Makefile_raw,
        "main.cc": main_cc_raw,
        "Punt.hpp": Punt_hpp_raw,
        "Punt.cpp": Punt_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.projecte_sencer_oop.term_1"])
            .addStep(4, "pro.projecte_sencer_oop.step_1")
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.projecte_sencer_oop.term_2", "pro.projecte_sencer_oop.term_3"])
            .addStep(11, "pro.projecte_sencer_oop.step_2")
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.projecte_sencer_oop.term_4", "pro.projecte_sencer_oop.term_5", "pro.projecte_sencer_oop.term_6"])
            .addStep(8, "pro.projecte_sencer_oop.step_3")
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.projecte_sencer_oop.term_7", "pro.projecte_sencer_oop.term_8", "pro.projecte_sencer_oop.term_9", "pro.projecte_sencer_oop.term_10"])
            .addStep(5, "pro.projecte_sencer_oop.step_4")
            .setActiveFile("main.cc")
            .clearVariables()
            .setTerminalOutput(["pro.projecte_sencer_oop.term_11"])
            .addStep(5, "pro.projecte_sencer_oop.step_5")
            .setActiveFile("main.cc")
            .clearVariables()
            .setTerminalOutput(["pro.projecte_sencer_oop.term_12"])
            .addStep(6, "pro.projecte_sencer_oop.step_6")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "0" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_13"])
            .addStep(4, "pro.projecte_sencer_oop.step_7")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "0", "p1": "Punt {x: -858993460, y: -858993460}", "this": "0x7ffe1020" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_13"])
            .addStep(6, "pro.projecte_sencer_oop.step_19")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "this": "0x7ffe1020" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_14"])
            .addStep(9, "pro.projecte_sencer_oop.step_8")
            .setActiveFile("main.cc")
            .setVariables({ "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: -858993460, y: -858993460}" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_15"])
            .addStep(7, "pro.projecte_sencer_oop.step_9")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: -858993460, y: -858993460}", "this": "0x7ffe1030" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_16"])
            .addStep(6, "pro.projecte_sencer_oop.step_10")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: 5, y: 5}", "this": "0x7ffe1030" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_17"])
            .addStep(9, "pro.projecte_sencer_oop.step_11")
            .setActiveFile("main.cc")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: 5, y: 5}" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_18"])
            .addStep(9, "pro.projecte_sencer_oop.step_12")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}", "dx": "2", "dy": "2", "this": "0x7ffe1020" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_19"])
            .addStep(14, "pro.projecte_sencer_oop.step_13")
            .setActiveFile("main.cc")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_20"])
            .addStep(11, "pro.projecte_sencer_oop.step_14")
            .setActiveFile("Punt.hpp")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}", "this": "0x7ffe1020" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_21"])
            .addStep(11, "pro.projecte_sencer_oop.step_15")
            .setActiveFile("main.cc")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_22", "pro.projecte_sencer_oop.term_23"])
            .addStep(12, "pro.projecte_sencer_oop.step_16")
            .setActiveFile("Punt.cpp")
            .setVariables({ "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" })
            .setTerminalOutput(["pro.projecte_sencer_oop.term_24", "pro.projecte_sencer_oop.term_25"])
            .addStep(19, "pro.projecte_sencer_oop.step_17")
            .setActiveFile("main.cc")
            .clearVariables()
            .setTerminalOutput(["pro.projecte_sencer_oop.term_26", "pro.projecte_sencer_oop.term_27", "pro.projecte_sencer_oop.term_28", "pro.projecte_sencer_oop.term_29"])
            .addStep(15, "pro.projecte_sencer_oop.step_18");

        return builder.build();
    }
};
