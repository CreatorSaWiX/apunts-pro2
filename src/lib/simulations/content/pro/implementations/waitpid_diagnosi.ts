import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_c_raw from "../code/waitpid_diagnosi/source.c?raw";

export const waitpid_diagnosi: Simulation = {
    id: "waitpid_diagnosi",
    renderer: "oop",
    files: {
        "source.c": source_c_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const TERM_RUN = "pro.waitpid_diagnosi.term_run";
        const TERM_OUT1 = "pro.waitpid_diagnosi.term_out1";
        const TERM_OUT2 = "pro.waitpid_diagnosi.term_out2";
        const TERM_END = "pro.waitpid_diagnosi.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.c")

            // 1. fork() -> Fill 1
            .setVariables({ "p1": "3421 (PID fill 1)" })
            .setTerminalOutput([TERM_RUN])
            .addStep(11, "pro.waitpid_diagnosi.step_1")

            // 2. Fill 1 executa exit(0)
            .setVariables({ "p1": "3421", "Fill 3421": "ZOMBIE (codi sortida 0)" })
            .addStep(13, "pro.waitpid_diagnosi.step_2")

            // 3. fork() -> Fill 2
            .setVariables({ "p1": "3421", "p2": "3422 (PID fill 2)", "Fill 3421": "ZOMBIE (codi sortida 0)" })
            .addStep(16, "pro.waitpid_diagnosi.step_3")

            // 4. Fill 2 rep senyal 9
            .setVariables({ "p1": "3421", "p2": "3422", "Fill 3421": "ZOMBIE (codi 0)", "Fill 3422": "ZOMBIE (senyal 9)" })
            .addStep(18, "pro.waitpid_diagnosi.step_4")

            // 5. Pare entra al bucle i = 0
            .clearVariables()
            .setVariables({ "i": "0", "p1": "3421", "p2": "3422" })
            .addStep(22, "pro.waitpid_diagnosi.step_5")

            // 6. waitpid(-1, &status, 0) recull Fill 1
            .setVariables({ "i": "0", "pid_fill": "3421", "status": "0x0000 (PCB 3421 esborrat)" })
            .addStep(23, "pro.waitpid_diagnosi.step_6")

            // 7. WIFEXITED(status) -> true
            .setVariables({ "i": "0", "pid_fill": "3421", "status": "0x0000", "WIFEXITED": "cert" })
            .addStep(25, "pro.waitpid_diagnosi.step_7")

            // 8. WEXITSTATUS(status) -> 0
            .setVariables({ "i": "0", "pid_fill": "3421", "status": "0x0000", "codi": "0" })
            .addStep(26, "pro.waitpid_diagnosi.step_8")

            // 9. sprintf(buf, ...)
            .setVariables({ "i": "0", "pid_fill": "3421", "codi": "0", "buf": "\"Fill 3421 ha acabat be amb codi 0\\n\"" })
            .addStep(27, "pro.waitpid_diagnosi.step_9")

            // 10. write(1, buf, ...) -> sortida terminal
            .setTerminalOutput([TERM_RUN, TERM_OUT1])
            .addStep(28, "pro.waitpid_diagnosi.step_10")

            // 11. Bucle i = 1
            .clearVariables()
            .setVariables({ "i": "1", "Fill 3422": "ZOMBIE (senyal 9 pendent)" })
            .addStep(22, "pro.waitpid_diagnosi.step_11")

            // 12. waitpid(-1, &status, 0) recull Fill 2
            .setVariables({ "i": "1", "pid_fill": "3422", "status": "0x0009 (PCB 3422 esborrat)" })
            .addStep(23, "pro.waitpid_diagnosi.step_12")

            // 13. WIFEXITED(status) -> false
            .setVariables({ "i": "1", "pid_fill": "3422", "status": "0x0009", "WIFEXITED": "fals" })
            .addStep(25, "pro.waitpid_diagnosi.step_13")

            // 14. WIFSIGNALED(status) -> true
            .setVariables({ "i": "1", "pid_fill": "3422", "status": "0x0009", "WIFSIGNALED": "cert" })
            .addStep(29, "pro.waitpid_diagnosi.step_14")

            // 15. WTERMSIG(status) -> 9
            .setVariables({ "i": "1", "pid_fill": "3422", "status": "0x0009", "senyal": "9 (SIGKILL)" })
            .addStep(30, "pro.waitpid_diagnosi.step_15")

            // 16. sprintf(buf, ...)
            .setVariables({ "i": "1", "pid_fill": "3422", "senyal": "9", "buf": "\"Fill 3422 ha mort pel senyal 9\\n\"" })
            .addStep(31, "pro.waitpid_diagnosi.step_16")

            // 17. write(1, buf, ...) -> sortida terminal
            .setTerminalOutput([TERM_RUN, TERM_OUT1, TERM_OUT2])
            .addStep(32, "pro.waitpid_diagnosi.step_17")

            // 18. Fi del programa
            .clearVariables()
            .setVariables({ "fills_recollits": "2", "estat": "Tots els zombies eliminats" })
            .setTerminalOutput([TERM_RUN, TERM_OUT1, TERM_OUT2, TERM_END])
            .addStep(35, "pro.waitpid_diagnosi.step_18");

        return builder.build();
    }
};
