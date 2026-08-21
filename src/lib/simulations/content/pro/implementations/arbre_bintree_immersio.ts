import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import i18n from "../../../../../i18n/config";
import main_cpp_raw from "../code/arbre_bintree_immersio/main.cpp?raw";

export const arbre_bintree_immersio: Simulation = {
    id: "arbre_bintree_immersio",
    renderer: "oop",
    files: {
        "main.cpp": main_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const builder = new OOPBuilder()
            .setActiveFile("main.cpp");
        const emptyText = i18n.t("algo.common.empty")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_1"])
            .addStep(26, "pro.arbre_bintree_immersio.step_1")
            .setVariables({ "ArbreTotal": "  1  \\n / \\ \\n2   3" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_2"])
            .addStep(28, "pro.arbre_bintree_immersio.step_2")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_3"])
            .addStep(29, "pro.arbre_bintree_immersio.step_3")
            .setVariables({ "t": "[1]" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_4", "pro.arbre_bintree_immersio.term_5"])
            .addStep(8, "pro.arbre_bintree_immersio.step_4")
            .setVariables({ "t": "[2]" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_6", "pro.arbre_bintree_immersio.term_7"])
            .addStep(9, "pro.arbre_bintree_immersio.step_5")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_8", "pro.arbre_bintree_immersio.term_9"])
            .addStep(7, "pro.arbre_bintree_immersio.step_6")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_10", "pro.arbre_bintree_immersio.term_11"])
            .addStep(9, "pro.arbre_bintree_immersio.step_7")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_12", "pro.arbre_bintree_immersio.term_13"])
            .addStep(10, "pro.arbre_bintree_immersio.step_8")
            .setVariables({ "t": "[3]" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_14", "pro.arbre_bintree_immersio.term_15"])
            .addStep(10, "pro.arbre_bintree_immersio.step_9")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_16", "pro.arbre_bintree_immersio.term_17"])
            .addStep(8, "pro.arbre_bintree_immersio.step_10")
            .setVariables({ "ArbreTotal": "  1  \\n / \\ \\n2   3" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_18", "pro.arbre_bintree_immersio.term_19"])
            .addStep(30, "pro.arbre_bintree_immersio.step_11")
            .setVariables({ "ArbreTotal": "  1  \\n / \\ \\n2   3", "cua": "->|[1]|->" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_20", "pro.arbre_bintree_immersio.term_21"])
            .addStep(17, "pro.arbre_bintree_immersio.step_12")
            .setVariables({ "curr": "[1]", "cua": emptyText })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_22", "pro.arbre_bintree_immersio.term_23"])
            .addStep(19, "pro.arbre_bintree_immersio.step_13")
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_24", "pro.arbre_bintree_immersio.term_25", "pro.arbre_bintree_immersio.term_26"])
            .addStep(20, "pro.arbre_bintree_immersio.step_14")
            .setVariables({ "curr": "[1]", "cua": "->|[3], [2]|->" })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_27", "pro.arbre_bintree_immersio.term_28", "pro.arbre_bintree_immersio.term_29"])
            .addStep(21, "pro.arbre_bintree_immersio.step_15")
            .setVariables({ "cua": emptyText })
            .setTerminalOutput(["pro.arbre_bintree_immersio.term_30", "pro.arbre_bintree_immersio.term_31", "pro.arbre_bintree_immersio.term_32", "pro.arbre_bintree_immersio.term_33"])
            .addStep(18, "pro.arbre_bintree_immersio.step_16");

        return builder.build();
    }
};
