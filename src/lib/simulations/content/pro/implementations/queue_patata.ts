import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import Makefile_raw from "../code/queue_patata/Makefile?raw";
import test_patata_calenta_cc_raw from "../code/queue_patata/test_patata_calenta.cc?raw";
import patata_cc_raw from "../code/queue_patata/patata.cc?raw";

export const queue_patata: Simulation = {
    id: "queue_patata",
    renderer: "oop",
    files: {
        "Makefile": Makefile_raw,
        "test_patata_calenta.cc": test_patata_calenta_cc_raw,
        "patata.cc": patata_cc_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.queue_patata.term_1", "pro.queue_patata.term_2"])
            .addStep(4, "pro.queue_patata.step_1")
            .setActiveFile("test_patata_calenta.cc")
            .setTerminalOutput(["pro.queue_patata.term_3", "pro.queue_patata.term_4", "[doctest] doctest version is 2.4.11"])
            .addStep(8, "pro.queue_patata.step_2")
            .setActiveFile("test_patata_calenta.cc")
            .setVariables({ "sin": "istringstream", "sout": "ostringstream" })
            .addStep(9, "pro.queue_patata.step_3")
            .setActiveFile("test_patata_calenta.cc")
            .addStep(12, "pro.queue_patata.step_4")
            .setActiveFile("patata.cc")
            .setVariables({ "N": "3", "k": "1", "q": "front [] back" })
            .addStep(7, "pro.queue_patata.step_5")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [1, 2, 3] back", "N": "3", "k": "1" })
            .addStep(10, "pro.queue_patata.step_6")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [1, 2, 3] back" })
            .addStep(14, "pro.queue_patata.step_7")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [1, 2, 3] back" })
            .addStep(16, "pro.queue_patata.step_8")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [2, 3] back", "front": "1" })
            .addStep(17, "pro.queue_patata.step_9")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [2, 3, 1] back" })
            .setTerminalOutput(["pro.queue_patata.term_5"])
            .addStep(19, "pro.queue_patata.step_10")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [2, 3, 1] back" })
            .addStep(25, "pro.queue_patata.step_11")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [2, 3, 1] back" })
            .setTerminalOutput(["pro.queue_patata.term_6"])
            .addStep(26, "pro.queue_patata.step_12")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [3, 1] back" })
            .addStep(27, "pro.queue_patata.step_13")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [3, 1] back" })
            .addStep(14, "pro.queue_patata.step_14")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [3, 1] back" })
            .addStep(16, "pro.queue_patata.step_15")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [1] back", "front": "3" })
            .addStep(17, "pro.queue_patata.step_16")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [1, 3] back" })
            .addStep(19, "pro.queue_patata.step_17")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [1, 3] back" })
            .setTerminalOutput(["pro.queue_patata.term_7"])
            .addStep(25, "pro.queue_patata.step_18")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [3] back" })
            .addStep(27, "pro.queue_patata.step_19")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [3] back" })
            .setTerminalOutput(["pro.queue_patata.term_8"])
            .addStep(14, "pro.queue_patata.step_20")
            .setActiveFile("patata.cc")
            .setVariables({ "q": "front [3]" })
            .setTerminalOutput(["pro.queue_patata.term_9", "pro.queue_patata.term_10"])
            .addStep(31, "pro.queue_patata.step_21")
            .setActiveFile("test_patata_calenta.cc")
            .setTerminalOutput(["pro.queue_patata.term_11", "pro.queue_patata.term_12", "[doctest] Status: SUCCESS!"])
            .addStep(14, "pro.queue_patata.step_22");

        return builder.build();
    }
};
