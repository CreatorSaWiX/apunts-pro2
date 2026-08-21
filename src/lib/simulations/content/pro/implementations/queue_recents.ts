import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import Makefile_raw from "../code/queue_recents/Makefile?raw";
import test_compta_recents_cc_raw from "../code/queue_recents/test_compta_recents.cc?raw";
import recents_cc_raw from "../code/queue_recents/recents.cc?raw";

export const queue_recents: Simulation = {
    id: "queue_recents",
    renderer: "oop",
    files: {
        "Makefile": Makefile_raw,
        "test_compta_recents.cc": test_compta_recents_cc_raw,
        "recents.cc": recents_cc_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.queue_recents.term_1", "pro.queue_recents.term_2"])
            .addStep(4, "pro.queue_recents.step_1")
            .setActiveFile("test_compta_recents.cc")
            .setTerminalOutput(["pro.queue_recents.term_3", "pro.queue_recents.term_4", "[doctest] doctest version is 2.4.11"])
            .addStep(8, "pro.queue_recents.step_2")
            .setActiveFile("test_compta_recents.cc")
            .setVariables({ "sin": "istringstream", "sout": "ostringstream" })
            .addStep(9, "pro.queue_recents.step_3")
            .setActiveFile("test_compta_recents.cc")
            .addStep(12, "pro.queue_recents.step_4")
            .setActiveFile("recents.cc")
            .setVariables({ "N": "3", "T": "10", "q": "front [] back" })
            .addStep(7, "pro.queue_recents.step_5")
            .setActiveFile("recents.cc")
            .setVariables({ "N": "3", "T": "10", "q": "front [] back" })
            .addStep(12, "pro.queue_recents.step_6")
            .setActiveFile("recents.cc")
            .setVariables({ "t": "0", "q": "front [0] back" })
            .setTerminalOutput(["pro.queue_recents.term_5"])
            .addStep(14, "pro.queue_recents.step_7")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0] back" })
            .addStep(18, "pro.queue_recents.step_8")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0] back" })
            .setTerminalOutput(["pro.queue_recents.term_6"])
            .addStep(23, "pro.queue_recents.step_9")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0] back" })
            .addStep(12, "pro.queue_recents.step_10")
            .setActiveFile("recents.cc")
            .setVariables({ "t": "10", "q": "front [0, 10] back" })
            .setTerminalOutput(["pro.queue_recents.term_7"])
            .addStep(14, "pro.queue_recents.step_11")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0, 10] back" })
            .addStep(18, "pro.queue_recents.step_12")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0, 10] back" })
            .setTerminalOutput(["pro.queue_recents.term_8"])
            .addStep(23, "pro.queue_recents.step_13")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0, 10] back" })
            .addStep(12, "pro.queue_recents.step_14")
            .setActiveFile("recents.cc")
            .setVariables({ "t": "20", "q": "front [0, 10, 20] back" })
            .setTerminalOutput(["pro.queue_recents.term_9"])
            .addStep(14, "pro.queue_recents.step_15")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [0, 10, 20] back" })
            .setTerminalOutput(["pro.queue_recents.term_10"])
            .addStep(18, "pro.queue_recents.step_16")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [10, 20] back" })
            .setTerminalOutput(["pro.queue_recents.term_11"])
            .addStep(19, "pro.queue_recents.step_17")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [10, 20] back" })
            .addStep(18, "pro.queue_recents.step_18")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [10, 20] back" })
            .setTerminalOutput(["pro.queue_recents.term_12"])
            .addStep(23, "pro.queue_recents.step_19")
            .setActiveFile("recents.cc")
            .setVariables({ "q": "front [10, 20] back" })
            .setTerminalOutput(["pro.queue_recents.term_13"])
            .addStep(26, "pro.queue_recents.step_20")
            .setActiveFile("test_compta_recents.cc")
            .setTerminalOutput(["pro.queue_recents.term_14", "pro.queue_recents.term_15", "[doctest] Status: SUCCESS!"])
            .addStep(14, "pro.queue_recents.step_21");

        return builder.build();
    }
};
