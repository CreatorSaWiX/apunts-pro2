import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import Makefile_raw from "../code/stack_reverse/Makefile?raw";
import test_reverse_cc_raw from "../code/stack_reverse/test_reverse.cc?raw";
import reverse_cc_raw from "../code/stack_reverse/reverse.cc?raw";

export const stack_reverse: Simulation = {
    id: "stack_reverse",
    renderer: "oop",
    files: {
        "Makefile": Makefile_raw,
        "test_reverse.cc": test_reverse_cc_raw,
        "reverse.cc": reverse_cc_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
        .setActiveFile("Makefile")
        .setTerminalOutput(["pro.stack_reverse.term_1", "pro.stack_reverse.term_2"])
        .addStep(4, "pro.stack_reverse.step_1")
        .setActiveFile("test_reverse.cc")
        .setTerminalOutput(["pro.stack_reverse.term_3", "pro.stack_reverse.term_4", "[doctest] doctest version is 2.4.11"])
        .addStep(8, "pro.stack_reverse.step_2")
        .setActiveFile("test_reverse.cc")
        .setVariables({ "sin": "istringstream", "sout": "ostringstream" })
        .addStep(9, "pro.stack_reverse.step_3")
        .setActiveFile("test_reverse.cc")
        .addStep(12, "pro.stack_reverse.step_4")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[]", "n": "?" })
        .addStep(7, "pro.stack_reverse.step_5")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[]", "n": "7" })
        .addStep(9, "pro.stack_reverse.step_6")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7] <- top", "n": "7" })
        .addStep(10, "pro.stack_reverse.step_7")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7] <- top", "n": "3" })
        .addStep(9, "pro.stack_reverse.step_8")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7, 3] <- top", "n": "3" })
        .addStep(10, "pro.stack_reverse.step_9")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7, 3] <- top", "n": "3" })
        .addStep(9, "pro.stack_reverse.step_10")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7, 3] <- top" })
        .addStep(14, "pro.stack_reverse.step_11")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7, 3] <- top" })
        .setTerminalOutput(["pro.stack_reverse.term_5"])
        .addStep(15, "pro.stack_reverse.step_12")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7] <- top" })
        .addStep(16, "pro.stack_reverse.step_13")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7] <- top" })
        .addStep(14, "pro.stack_reverse.step_14")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[7] <- top" })
        .setTerminalOutput(["pro.stack_reverse.term_6"])
        .addStep(15, "pro.stack_reverse.step_15")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[]" })
        .addStep(16, "pro.stack_reverse.step_16")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[]" })
        .addStep(14, "pro.stack_reverse.step_17")
        .setActiveFile("reverse.cc")
        .setVariables({ "s": "[]" })
        .setTerminalOutput(["pro.stack_reverse.term_7"])
        .addStep(19, "pro.stack_reverse.step_18")
        .setActiveFile("test_reverse.cc")
        .setVariables({ "sout.str()": "3 7\\n" })
        .addStep(14, "pro.stack_reverse.step_19")
        .setActiveFile("test_reverse.cc")
        .setTerminalOutput(["pro.stack_reverse.term_8", "pro.stack_reverse.term_9", "[doctest] Status: SUCCESS!"])
        .addStep(15, "pro.stack_reverse.step_20");

        return builder.build();
    }
};
