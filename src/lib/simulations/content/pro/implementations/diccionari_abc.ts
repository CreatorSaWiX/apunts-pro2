import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/diccionari_abc/source.cpp?raw";

export const diccionari_abc: Simulation = {
    id: "diccionari_abc",
    renderer: "oop",
    files: {
        "source.cpp": source_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const TERM_RUN = "pro.diccionari_abc.term_run";
        const TERM_OUT_1 = "pro.diccionari_abc.term_out_1";
        const TERM_OUT_2 = "pro.diccionari_abc.term_out_2";
        const TERM_OUT_3 = "pro.diccionari_abc.term_out_3";
        const TERM_END = "pro.diccionari_abc.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // 1. main(): Instanciació de Diccionari<int, string> D
            .setVariables({ "D.n": "0", "D.arrel": "nullptr" })
            .setTerminalOutput([TERM_RUN])
            .addStep(70, "pro.diccionari_abc.step_1")

            // 2. Constructor Diccionari(): n(0), arrel(nullptr)
            .addStep(47, "pro.diccionari_abc.step_2")

            // 3. main(): D.assigna(8, "vuit")
            .setVariables({ "D.n": "0", "D.arrel": "nullptr", "clau": "8", "info": "\"vuit\"" })
            .addStep(71, "pro.diccionari_abc.step_3")

            // 4. assigna -> crida assignar(arrel, clau, info, n)
            .addStep(64, "pro.diccionari_abc.step_4")

            // 5. assignar: if (p) -> p és nul (arrel buida)
            .setVariables({ "p": "nullptr (arrel)", "clau": "8", "info": "\"vuit\"" })
            .addStep(28, "pro.diccionari_abc.step_5")

            // 6. assignar: else -> p = new Node(clau, info)
            .setVariables({ "p": "Node(8: 'vuit')", "D.arrel": "Node(8: 'vuit')" })
            .addStep(33, "pro.diccionari_abc.step_6")

            // 7. assignar: ++n
            .setVariables({ "D.n": "1", "D.arrel": "Node(8: 'vuit')" })
            .addStep(34, "pro.diccionari_abc.step_7")

            // 8. main(): D.assigna(3, "tres")
            .setVariables({ "D.n": "1", "D.arrel": "Node(8)", "clau": "3", "info": "\"tres\"" })
            .addStep(72, "pro.diccionari_abc.step_8")

            // 9. assigna -> assignar(arrel, 3, "tres", n)
            .addStep(64, "pro.diccionari_abc.step_9")

            // 10. assignar: clau < p->clau (3 < 8) -> recursió a p->fesq
            .setVariables({ "p": "Node(8)", "clau": "3", "3 < 8": "cert -> fesq" })
            .addStep(29, "pro.diccionari_abc.step_10")

            // 11. assignar recursiu (p = p->fesq és nullptr): new Node(3, "tres")
            .setVariables({ "p": "Node(3: 'tres')", "8->fesq": "Node(3: 'tres')" })
            .addStep(33, "pro.diccionari_abc.step_11")

            // 12. ++n
            .setVariables({ "D.n": "2", "8->fesq": "Node(3)", "D.arrel": "Node(8)" })
            .addStep(34, "pro.diccionari_abc.step_12")

            // 13. main(): D.assigna(10, "deu")
            .setVariables({ "D.n": "2", "clau": "10", "info": "\"deu\"" })
            .addStep(73, "pro.diccionari_abc.step_13")

            // 14. assigna -> assignar(arrel, 10, "deu", n)
            .addStep(64, "pro.diccionari_abc.step_14")

            // 15. assignar: clau > p->clau (10 > 8) -> recursió a p->fdre
            .setVariables({ "p": "Node(8)", "clau": "10", "10 > 8": "cert -> fdre" })
            .addStep(30, "pro.diccionari_abc.step_15")

            // 16. assignar recursiu: new Node(10, "deu")
            .setVariables({ "p": "Node(10: 'deu')", "8->fdre": "Node(10: 'deu')" })
            .addStep(33, "pro.diccionari_abc.step_16")

            // 17. ++n
            .setVariables({ "D.n": "3", "arbre": "[ (3) <- (8) -> (10) ]" })
            .addStep(34, "pro.diccionari_abc.step_17")

            // 18. main(): D.present(3)
            .setVariables({ "clau": "3", "arbre": "[ (3) <- (8) -> (10) ]" })
            .addStep(75, "pro.diccionari_abc.step_18")

            // 19. present() -> cerca(arrel, 3)
            .addStep(50, "pro.diccionari_abc.step_19")

            // 20. cerca(): 3 < 8 -> cerca(p->fesq, 3)
            .setVariables({ "p": "Node(8)", "3 < 8": "baixa a fesq" })
            .addStep(22, "pro.diccionari_abc.step_20")

            // 21. cerca(): p->clau == 3 -> trobat! retorna p
            .setVariables({ "p": "Node(3)", "trobat": "cert (retorna p)" })
            .addStep(24, "pro.diccionari_abc.step_21")

            // 22. cout << "Present 3? Si"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1])
            .addStep(75, "pro.diccionari_abc.step_22")

            // 23. main(): D.consulta(8)
            .addStep(76, "pro.diccionari_abc.step_23")

            // 24. consulta() -> cerca(arrel, 8) troba arrel -> retorna p->info ("vuit")
            .setVariables({ "p": "Node(8)", "retorn": "\"vuit\"" })
            .addStep(59, "pro.diccionari_abc.step_24")

            // 25. cout << "Consulta 8: vuit"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2])
            .addStep(76, "pro.diccionari_abc.step_25")

            // 26. main(): D.talla() -> retorna n (3)
            .setVariables({ "D.n": "3" })
            .addStep(54, "pro.diccionari_abc.step_26")

            // 27. cout << "Talla total: 3"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3])
            .addStep(77, "pro.diccionari_abc.step_27")

            // 28. return 0
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3, TERM_END])
            .addStep(79, "pro.diccionari_abc.step_28");

        return builder.build();
    }
};
