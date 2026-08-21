import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import Makefile_raw from "../code/stack_parentesis/Makefile?raw";
import test_parentesis_cc_raw from "../code/stack_parentesis/test_parentesis.cc?raw";
import parentesis_cc_raw from "../code/stack_parentesis/parentesis.cc?raw";

export const stack_parentesis: Simulation = {
    id: "stack_parentesis",
    renderer: "oop",
    files: {
        "Makefile": Makefile_raw,
        "test_parentesis.cc": test_parentesis_cc_raw,
        "parentesis.cc": parentesis_cc_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("Makefile")
            .setTerminalOutput(["pro.stack_parentesis.term_1", "pro.stack_parentesis.term_2"])
            .addStep(4, "pro.stack_parentesis.step_1")
            .setActiveFile("test_parentesis.cc")
            .setTerminalOutput(["pro.stack_parentesis.term_3", "pro.stack_parentesis.term_4", "[doctest] doctest version is 2.4.11"])
            .addStep(10, "pro.stack_parentesis.step_2")
            .setActiveFile("test_parentesis.cc")
            .setVariables({ "sin": "istringstream", "sout": "ostringstream" })
            .addStep(11, "pro.stack_parentesis.step_3")
            .setActiveFile("test_parentesis.cc")
            .addStep(14, "pro.stack_parentesis.step_4")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]", "pos": "1" })
            .addStep(7, "pro.stack_parentesis.step_5")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]", "c": "(", "pos": "1" })
            .addStep(11, "pro.stack_parentesis.step_6")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]", "c": "(", "pos": "1" })
            .addStep(12, "pro.stack_parentesis.step_7")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(] <- top", "c": "(", "pos": "1" })
            .addStep(13, "pro.stack_parentesis.step_8")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(]", "c": "(", "pos": "2" })
            .addStep(28, "pro.stack_parentesis.step_9")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(]", "c": "(", "pos": "2" })
            .addStep(11, "pro.stack_parentesis.step_10")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(, (] <- top", "c": "(", "pos": "2" })
            .addStep(13, "pro.stack_parentesis.step_11")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(, (]", "c": "(", "pos": "3" })
            .addStep(28, "pro.stack_parentesis.step_12")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(, (] <- top", "c": ")", "pos": "3" })
            .addStep(11, "pro.stack_parentesis.step_13")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(, (] <- top", "c": ")" })
            .addStep(16, "pro.stack_parentesis.step_14")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(, (] <- top", "c": ")" })
            .addStep(17, "pro.stack_parentesis.step_15")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(, (] <- top", "top": "(" })
            .addStep(21, "pro.stack_parentesis.step_16")
            .setActiveFile("parentesis.cc")
            .setVariables({ "c": ")", "top": "(" })
            .addStep(22, "pro.stack_parentesis.step_17")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(] <- top" })
            .addStep(23, "pro.stack_parentesis.step_18")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(] <- top", "pos": "4" })
            .addStep(28, "pro.stack_parentesis.step_19")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(] <- top", "pos": "8", "c": "]" })
            .setTerminalOutput(["pro.stack_parentesis.custom_1"])
            .addStep(11, "pro.stack_parentesis.step_20")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[(] <- top", "pos": "9", "c": ")" })
            .setTerminalOutput(["pro.stack_parentesis.term_8"])
            .addStep(11, "pro.stack_parentesis.step_21")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]", "pos": "9" })
            .addStep(23, "pro.stack_parentesis.step_22")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]", "c": "." })
            .addStep(11, "pro.stack_parentesis.step_23")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]" })
            .addStep(31, "pro.stack_parentesis.step_24")
            .setActiveFile("parentesis.cc")
            .setVariables({ "s": "[]" })
            .setTerminalOutput(["pro.stack_parentesis.term_9"])
            .addStep(31, "pro.stack_parentesis.step_25")
            .setActiveFile("test_parentesis.cc")
            .setVariables({ "sout.str()": "Correcte\\n" })
            .addStep(16, "pro.stack_parentesis.step_26")
            .setActiveFile("test_parentesis.cc")
            .setTerminalOutput(["pro.stack_parentesis.term_10", "pro.stack_parentesis.term_11", "[doctest] Status: SUCCESS!"])
            .addStep(17, "pro.stack_parentesis.step_27");

        return builder.build();
    }
};
