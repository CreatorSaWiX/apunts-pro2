import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import Makefile_raw from "../code/data_class/Makefile?raw";
import main_cc_raw from "../code/data_class/main.cc?raw";
import data_hh_raw from "../code/data_class/data.hh?raw";
import data_cc_raw from "../code/data_class/data.cc?raw";

export const data_class: Simulation = {
  id: "data_class",
  renderer: "oop",
  files: {
        "Makefile": Makefile_raw,
        "main.cc": main_cc_raw,
        "data.hh": data_hh_raw,
        "data.cc": data_cc_raw,
    },
  generateSteps: (): SimulationStep[] => {
    const builder = new OOPBuilder()
        .setActiveFile("Makefile")
        .setTerminalOutput(["pro.data_class.term_1"])
        .addStep(6, "pro.data_class.step_1")
        .setActiveFile("Makefile")
        .setTerminalOutput(["pro.data_class.term_2", "pro.data_class.term_3"])
        .addStep(11, "pro.data_class.step_2")
        .setActiveFile("Makefile")
        .setTerminalOutput(["pro.data_class.term_4", "pro.data_class.term_5", "pro.data_class.term_6"])
        .addStep(14, "pro.data_class.step_3")
        .setActiveFile("Makefile")
        .setTerminalOutput(["pro.data_class.term_7", "pro.data_class.term_8", "pro.data_class.term_9", "pro.data_class.term_10"])
        .addStep(9, "pro.data_class.step_4")
        .setActiveFile("main.cc")
        .setTerminalOutput(["pro.data_class.term_11"])
        .addStep(6, "pro.data_class.step_5")
        .setActiveFile("main.cc")
        .setVariables({ "d": "Data{?.?.?}" })
        .setTerminalOutput(["pro.data_class.term_12"])
        .addStep(7, "pro.data_class.step_6")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d" })
        .setTerminalOutput(["pro.data_class.term_13"])
        .addStep(6, "pro.data_class.step_7")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d", "dia": "1", "mes": "1", "any": "0" })
        .setTerminalOutput(["pro.data_class.term_14"])
        .addStep(7, "pro.data_class.step_8")
        .setActiveFile("main.cc")
        .setVariables({ "d": "1/1/0", "n": "?" })
        .setTerminalOutput(["pro.data_class.term_15"])
        .addStep(8, "pro.data_class.step_9")
        .setActiveFile("main.cc")
        .setVariables({ "d": "1/1/0", "n": "?" })
        .setTerminalOutput(["pro.data_class.term_16"])
        .addStep(10, "pro.data_class.step_10")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d" })
        .setTerminalOutput(["pro.data_class.term_17"])
        .addStep(21, "pro.data_class.step_11")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d", "dia": "28", "mes": "2", "any": "2024" })
        .setTerminalOutput(["pro.data_class.term_18"])
        .addStep(22, "pro.data_class.step_12")
        .setActiveFile("main.cc")
        .setVariables({ "d": "28/02/2024", "n": "1" })
        .setTerminalOutput(["pro.data_class.term_19"])
        .addStep(11, "pro.data_class.step_13")
        .setActiveFile("main.cc")
        .setVariables({ "d": "28/02/2024", "n": "1" })
        .setTerminalOutput(["pro.data_class.term_20"])
        .addStep(12, "pro.data_class.step_14")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d", "dies": "1", "res": "28/02/2024" })
        .setTerminalOutput(["pro.data_class.term_21"])
        .addStep(32, "pro.data_class.step_15")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d", "dies": "1", "res": "29/02/2024" })
        .setTerminalOutput(["pro.data_class.term_22"])
        .addStep(34, "pro.data_class.step_16")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->res", "res_retorn_dies": "29" })
        .setTerminalOutput(["pro.data_class.term_23"])
        .addStep(10, "pro.data_class.step_17")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d", "dies": "1", "res": "29/02/2024" })
        .setTerminalOutput(["pro.data_class.term_24"])
        .addStep(34, "pro.data_class.step_18")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->d", "res": "29/02/2024" })
        .setTerminalOutput(["pro.data_class.term_25"])
        .addStep(42, "pro.data_class.step_19")
        .setActiveFile("main.cc")
        .setVariables({ "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" })
        .setTerminalOutput(["pro.data_class.term_26"])
        .addStep(12, "pro.data_class.step_20")
        .setActiveFile("main.cc")
        .setVariables({ "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" })
        .setTerminalOutput(["pro.data_class.term_27"])
        .addStep(13, "pro.data_class.step_21")
        .setActiveFile("data.cc")
        .setVariables({ "this": "->resultat", "dia": "29" })
        .setTerminalOutput(["pro.data_class.term_28"])
        .addStep(25, "pro.data_class.step_22")
        .setActiveFile("main.cc")
        .setVariables({ "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" })
        .setTerminalOutput(["pro.data_class.term_29"])
        .addStep(16, "pro.data_class.step_23")
        .setActiveFile("main.cc")
        .setTerminalOutput(["pro.data_class.term_30", "pro.data_class.term_31"])
        .addStep(11, "pro.data_class.step_24");

    return builder.build();
  }
};
