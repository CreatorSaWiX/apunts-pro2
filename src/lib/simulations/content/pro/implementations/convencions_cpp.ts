import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import main_cpp_raw from "../code/convencions_cpp/main.cpp?raw";
import Caixa_hh_raw from "../code/convencions_cpp/Caixa.hh?raw";
import Caixa_cpp_raw from "../code/convencions_cpp/Caixa.cpp?raw";

export const convencions_cpp: Simulation = {
    id: "convencions_cpp",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
        "Caixa.hh": Caixa_hh_raw,
        "Caixa.cpp": Caixa_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.convencions_cpp.term_1"])
            .addStep(6, "pro.convencions_cpp.step_1")
            .setActiveFile("Caixa.cpp")
            .setVariables({ "valor_inicial": "10", "c.valor_": "10" })
            .setTerminalOutput(["pro.convencions_cpp.term_2"])
            .addStep(5, "pro.convencions_cpp.step_2")
            .setTerminalOutput(["pro.convencions_cpp.term_3"])
            .addStep(6, "pro.convencions_cpp.step_3")
            .setActiveFile("Caixa.hh")
            .setVariables({ "c.valor_": "10" })
            .setTerminalOutput(["pro.convencions_cpp.term_4"])
            .addStep(5, "pro.convencions_cpp.step_4")
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.convencions_cpp.term_5"])
            .addStep(8, "pro.convencions_cpp.step_5")
            .setActiveFile("Caixa.cpp")
            .setVariables({ "c.valor_": "10", "extra": "5" })
            .setTerminalOutput(["pro.convencions_cpp.term_6"])
            .addStep(11, "pro.convencions_cpp.step_6")
            .setVariables({ "c.valor_": "15" })
            .setTerminalOutput(["pro.convencions_cpp.term_7"])
            .addStep(12, "pro.convencions_cpp.step_7")
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.convencions_cpp.term_8"])
            .addStep(10, "pro.convencions_cpp.step_8")
            .setActiveFile("Caixa.hh")
            .setTerminalOutput(["pro.convencions_cpp.term_9"])
            .addStep(12, "pro.convencions_cpp.step_9")
            .setActiveFile("main.cpp")
            .setTerminalOutput(["pro.convencions_cpp.term_10", "pro.convencions_cpp.term_11"])
            .addStep(10, "pro.convencions_cpp.step_10");

        return builder.build();
    }
};
