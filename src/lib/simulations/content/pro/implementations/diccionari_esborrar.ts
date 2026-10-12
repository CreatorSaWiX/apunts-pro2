import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/diccionari_esborrar/source.cpp?raw";

export const diccionari_esborrar: Simulation = {
    id: "diccionari_esborrar",
    renderer: "oop",
    files: {
        "source.cpp": source_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const TERM_RUN = "pro.diccionari_esborrar.term_run";
        const TERM_OUT_1 = "pro.diccionari_esborrar.term_out_1";
        const TERM_OUT_2 = "pro.diccionari_esborrar.term_out_2";
        const TERM_OUT_3 = "pro.diccionari_esborrar.term_out_3";
        const TERM_OUT_4 = "pro.diccionari_esborrar.term_out_4";
        const TERM_END = "pro.diccionari_esborrar.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // 1. main(): Instanciació de Diccionari<int, string> D
            .setVariables({ "D.n": "0", "D.arrel": "nullptr" })
            .setTerminalOutput([TERM_RUN])
            .addStep(101, "pro.diccionari_esborrar.step_1")

            // 2. Constructor Diccionari(): n(0), arrel(nullptr)
            .addStep(74, "pro.diccionari_esborrar.step_2")

            // 3. Inserció dels 5 elements inicials
            .setVariables({
                "D.n": "5",
                "arbre": "(2) <- [5] -> ((6) <- (8) -> (9))",
                "arrel": "Node(5)"
            })
            .addStep(106, "pro.diccionari_esborrar.step_3")

            // 4. cout << "Talla inicial: 5"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1])
            .addStep(108, "pro.diccionari_esborrar.step_4")

            // 5. main(): D.esborra(5) -> Esborrar l'arrel que té 2 fills
            .setVariables({ "clau_a_esborrar": "5", "p": "arrel (Node 5)" })
            .addStep(111, "pro.diccionari_esborrar.step_5")

            // 6. esborra() delega en esborrar(arrel, 5, n)
            .addStep(96, "pro.diccionari_esborrar.step_6")

            // 7. esborrar: comprova if (!p) -> p no és nul
            .addStep(40, "pro.diccionari_esborrar.step_7")

            // 8. clau == p->clau (5 == 5) -> entrem a l'else: hem trobat el node!
            .setVariables({ "p": "Node(5)", "clau": "5", "coincidència": "cert" })
            .addStep(43, "pro.diccionari_esborrar.step_8")

            // 9. Node* q = p (guardem 5 per alliberar-lo més tard)
            .setVariables({ "q": "Node(5) [a eliminar]", "p": "Node(5)" })
            .addStep(44, "pro.diccionari_esborrar.step_9")

            // 10. if (!p->fesq) -> fals (té fill esquerre 2)
            .addStep(45, "pro.diccionari_esborrar.step_10")

            // 11. else if (!p->fdre) -> fals (té fill dret 8)
            .addStep(46, "pro.diccionari_esborrar.step_11")

            // 12. else: Cas de 2 fills! Cal buscar el successor inordre al subarbre dret
            .addStep(47, "pro.diccionari_esborrar.step_12")

            // 13. Crida a esborrar_minim(p->fdre) on p->fdre és el node 8
            .setVariables({ "subarbre_dret": "Node(8)", "q": "Node(5)" })
            .addStep(48, "pro.diccionari_esborrar.step_13")

            // 14. esborrar_minim(p): p és el node 8. Comprova if (p->fesq)
            .setVariables({ "p": "Node(8)", "p->fesq": "Node(6)" })
            .addStep(32, "pro.diccionari_esborrar.step_14")

            // 15. Com que 8 té fill esquerre 6, crida recursiva a esborrar_minim(8->fesq)
            .addStep(33, "pro.diccionari_esborrar.step_15")

            // 16. esborrar_minim(p): ara p és el node 6 (referència a 8->fesq)
            .setVariables({ "p": "Node(6)", "p->fesq": "nullptr" })
            .addStep(32, "pro.diccionari_esborrar.step_16")

            // 17. 6 no té fill esquerre (!p->fesq): HEM TROBAT EL MÍNIM (successor inordre)!
            .setVariables({ "successor": "Node(6)", "p": "Node(6)" })
            .addStep(33, "pro.diccionari_esborrar.step_17")

            // 18. Node* q_min = p (q_min = 6)
            .setVariables({ "q_min": "Node(6)", "p": "Node(6)" })
            .addStep(34, "pro.diccionari_esborrar.step_18")

            // 19. p = p->fdre: com que 6->fdre és nullptr, 8->fesq passa a ser nullptr!
            .setVariables({ "8->fesq": "nullptr (desconnectat el 6)", "q_min": "Node(6)" })
            .addStep(35, "pro.diccionari_esborrar.step_19")

            // 20. return q: es retorna el node 6
            .addStep(36, "pro.diccionari_esborrar.step_20")

            // 21. De tornada a esborrar: m = 6 (node mínim extret)
            .setVariables({ "m": "Node(6)", "p": "Node(5) [arrel vella]" })
            .addStep(48, "pro.diccionari_esborrar.step_21")

            // 22. m->fesq = p->fesq: el node 6 adopta el fill esquerre de 5 (node 2)
            .setVariables({ "m->fesq": "Node(2)", "m": "Node(6)" })
            .addStep(49, "pro.diccionari_esborrar.step_22")

            // 23. m->fdre = p->fdre: el node 6 adopta el fill dret de 5 (node 8, sense el 6)
            .setVariables({ "m->fdre": "Node(8)", "m": "Node(6)" })
            .addStep(50, "pro.diccionari_esborrar.step_23")

            // 24. p = m: per referència, la nova arrel passa a ser el node 6!
            .setVariables({ "D.arrel": "Node(6) [nova arrel]", "nou_arbre": "(2) <- [6] -> (8 -> (9))" })
            .addStep(51, "pro.diccionari_esborrar.step_24")

            // 25. delete q: s'allibera la memòria del node original 5
            .setVariables({ "q": "alliberat (delete)" })
            .addStep(53, "pro.diccionari_esborrar.step_25")

            // 26. --n: la mida decrementa a 4
            .setVariables({ "D.n": "4", "D.arrel": "Node(6)" })
            .addStep(54, "pro.diccionari_esborrar.step_26")

            // 27. main(): comprovem D.present(5)
            .addStep(113, "pro.diccionari_esborrar.step_27")

            // 28. cerca(arrel, 5): 5 < 6 -> busca a 2 -> no trobat -> retorna false
            .setVariables({ "cerca": "5 < 6 -> busca a fesq(2) -> no trobat" })
            .addStep(81, "pro.diccionari_esborrar.step_28")

            // 29. cout << "Present 5? No"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2])
            .addStep(113, "pro.diccionari_esborrar.step_29")

            // 30. main(): D.consulta(6) -> troba 6 directament a la nova arrel!
            .setVariables({ "arrel": "Node(6)", "retorn": "\"sis\"" })
            .addStep(86, "pro.diccionari_esborrar.step_30")

            // 31. cout << "Nova arrel: sis"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3])
            .addStep(114, "pro.diccionari_esborrar.step_31")

            // 32. main(): D.talla() -> retorna 4
            .setVariables({ "D.n": "4" })
            .addStep(78, "pro.diccionari_esborrar.step_32")

            // 33. cout << "Talla final: 4"
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3, TERM_OUT_4])
            .addStep(115, "pro.diccionari_esborrar.step_33")

            // 34. return 0
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3, TERM_OUT_4, TERM_END])
            .addStep(117, "pro.diccionari_esborrar.step_34");

        return builder.build();
    }
};
