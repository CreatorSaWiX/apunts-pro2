import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/diccionari_avl/source.cpp?raw";

export const diccionari_avl: Simulation = {
    id: "diccionari_avl",
    renderer: "oop",
    files: {
        "source.cpp": source_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const TERM_RUN = "pro.diccionari_avl.term_run";
        const TERM_OUT_1 = "pro.diccionari_avl.term_out_1";
        const TERM_OUT_2 = "pro.diccionari_avl.term_out_2";
        const TERM_OUT_3 = "pro.diccionari_avl.term_out_3";
        const TERM_END = "pro.diccionari_avl.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // 1. main(): DiccionariAVL<int, string> D
            .setVariables({ "D.n": "0", "D.arrel": "nullptr" })
            .setTerminalOutput([TERM_RUN])
            .addStep(123, "pro.diccionari_avl.step_1")

            // 2. Constructor DiccionariAVL(): n(0), arrel(nullptr)
            .addStep(100, "pro.diccionari_avl.step_2")

            // 3. main(): D.assigna(10, "deu")
            .setVariables({ "D.n": "0", "D.arrel": "nullptr", "clau": "10", "info": "\"deu\"" })
            .addStep(124, "pro.diccionari_avl.step_3")

            // 4. assigna -> assignar(arrel, 10, "deu", n)
            .addStep(118, "pro.diccionari_avl.step_4")

            // 5. assignar: p és nullptr -> else
            .setVariables({ "p": "nullptr", "clau": "10", "info": "\"deu\"" })
            .addStep(60, "pro.diccionari_avl.step_5")

            // 6. p = new Node(10, "deu", nullptr, nullptr, 0)
            .setVariables({ "p": "Node(10, alc:0)", "D.arrel": "Node(10, alc:0)" })
            .addStep(79, "pro.diccionari_avl.step_6")

            // 7. ++n
            .setVariables({ "D.n": "1", "D.arrel": "Node(10, alc:0)" })
            .addStep(80, "pro.diccionari_avl.step_7")

            // 8. main(): D.assigna(20, "vint")
            .setVariables({ "D.n": "1", "clau": "20", "info": "\"vint\"" })
            .addStep(125, "pro.diccionari_avl.step_8")

            // 9. assigna -> assignar(arrel, 20, "vint", n)
            .addStep(118, "pro.diccionari_avl.step_9")

            // 10. clau > p->clau (20 > 10) -> recursió a p->fdre
            .setVariables({ "p": "Node(10)", "20 > 10": "cert -> recursió a fdre" })
            .addStep(68, "pro.diccionari_avl.step_10")

            // 11. p->fdre era nullptr: new Node(20, "vint", nullptr, nullptr, 0)
            .setVariables({ "p": "Node(20, alc:0)", "10->fdre": "Node(20, alc:0)" })
            .addStep(79, "pro.diccionari_avl.step_11")

            // 12. ++n
            .setVariables({ "D.n": "2", "10->fdre": "Node(20, alc:0)" })
            .addStep(80, "pro.diccionari_avl.step_12")

            // 13. Retorn a Node 10: comprova equilibri: alc(fdre) - alc(fesq) = 0 - (-1) = 1 != 2
            .setVariables({ "p": "Node(10)", "Δ(10)": "alc(20) - alc(null) = 0 - (-1) = 1" })
            .addStep(70, "pro.diccionari_avl.step_13")

            // 14. actualitzar_alcada(p): 1 + max(-1, 0) = 1
            .setVariables({ "10.alc": "1", "20.alc": "0" })
            .addStep(74, "pro.diccionari_avl.step_14")

            // 15. main(): D.assigna(30, "trenta")
            .setVariables({ "D.n": "2", "clau": "30", "info": "\"trenta\"" })
            .addStep(126, "pro.diccionari_avl.step_15")

            // 16. assigna
            .addStep(118, "pro.diccionari_avl.step_16")

            // 17. 30 > 10 -> recursió fdre (Node 20)
            .setVariables({ "p": "Node(10)", "30 > 10": "baixa a 20" })
            .addStep(68, "pro.diccionari_avl.step_17")

            // 18. 30 > 20 -> recursió fdre (nullptr)
            .setVariables({ "p": "Node(20)", "30 > 20": "baixa a fdre de 20" })
            .addStep(68, "pro.diccionari_avl.step_18")

            // 19. new Node(30, "trenta", nullptr, nullptr, 0)
            .setVariables({ "p": "Node(30, alc:0)", "20->fdre": "Node(30, alc:0)" })
            .addStep(79, "pro.diccionari_avl.step_19")

            // 20. ++n
            .setVariables({ "D.n": "3", "20->fdre": "Node(30, alc:0)" })
            .addStep(80, "pro.diccionari_avl.step_20")

            // 21. Retorn a Node 20: actualitzar_alcada(20) -> alc = 1
            .setVariables({ "20.alc": "1", "30.alc": "0" })
            .addStep(74, "pro.diccionari_avl.step_21")

            // 22. Retorn a Node 10: alc(fdre) - alc(fesq) = alc(20) - alc(null) = 1 - (-1) = 2! DESEQUILIBRI!
            .setVariables({ "p": "Node(10)", "Δ(10)": "1 - (-1) = 2 (DESEQUILIBRI)" })
            .addStep(70, "pro.diccionari_avl.step_22")

            // 23. 30 > p->fdre->clau (30 > 20) -> Cas RR!
            .setVariables({ "p": "Node(10)", "cas": "RR (clau 30 > 20)" })
            .addStep(71, "pro.diccionari_avl.step_23")

            // 24. Crida a RR(p)
            .addStep(40, "pro.diccionari_avl.step_24")

            // 25. RR(): Node* q = p (q = 10); p = p->fdre (p = 20, l'arrel passa a ser 20!); q->fdre = p->fesq (null)
            .setVariables({ "q": "Node(10)", "p (nou arrel)": "Node(20)", "q->fdre": "nullptr" })
            .addStep(43, "pro.diccionari_avl.step_25")

            // 26. RR(): p->fesq = q (10 esdevé fill esquerre de 20!)
            .setVariables({ "20->fesq": "Node(10)", "20->fdre": "Node(30)" })
            .addStep(44, "pro.diccionari_avl.step_26")

            // 27. RR(): actualitzar_alcada(q) -> 10.alc = 0; actualitzar_alcada(p) -> 20.alc = 1
            .setVariables({ "10.alc": "0", "30.alc": "0", "20.alc": "1", "D.arrel": "Node(20)" })
            .addStep(46, "pro.diccionari_avl.step_27")

            // 28. Retorn a assignar: l'arbre ha quedat equilibrat!
            .setVariables({ "arbre": "(10) <- [20] -> (30)", "D.arrel": "Node(20, alc:1)" })
            .addStep(74, "pro.diccionari_avl.step_28")

            // 29. main(): D.present(20)
            .addStep(128, "pro.diccionari_avl.step_29")

            // 30. present() -> cerca(arrel, 20) -> trobat a l'arrel!
            .setVariables({ "p": "Node(20)", "trobat": "cert" })
            .addStep(88, "pro.diccionari_avl.step_30")

            // 31. Terminal: Present 20? Si
            .setTerminalOutput([TERM_RUN, TERM_OUT_1])
            .addStep(128, "pro.diccionari_avl.step_31")

            // 32. main(): D.consulta(10) -> cerca(arrel, 10) baixa a fesq -> troba 10
            .setVariables({ "p": "Node(10)", "retorn": "\"deu\"" })
            .addStep(113, "pro.diccionari_avl.step_32")

            // 33. Terminal: Consulta 10: deu
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2])
            .addStep(129, "pro.diccionari_avl.step_33")

            // 34. main(): D.talla() -> retorna n = 3
            .setVariables({ "D.n": "3" })
            .addStep(104, "pro.diccionari_avl.step_34")

            // 35. Terminal: Talla AVL: 3
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3])
            .addStep(130, "pro.diccionari_avl.step_35")

            // 36. return 0
            .setTerminalOutput([TERM_RUN, TERM_OUT_1, TERM_OUT_2, TERM_OUT_3, TERM_END])
            .addStep(132, "pro.diccionari_avl.step_36");

        return builder.build();
    }
};
