import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_c_raw from "../code/fork_alarm_timeout/source.c?raw";

export const fork_alarm_timeout: Simulation = {
    id: "fork_alarm_timeout",
    renderer: "oop",
    files: {
        "source.c": source_c_raw,
    },
    generateSteps: (): SimulationStep[] => {
        const T_FORK_0 = "pro.fork_alarm_timeout.term_fork";
        const T_HIJO_HELLO = "pro.fork_alarm_timeout.term_hijo_hello";
        const T_ALARM_OFF = "pro.fork_alarm_timeout.term_alarm_off";
        const T_HIJO_EXIT = "pro.fork_alarm_timeout.term_hijo_exit";
        const T_FINAL = "pro.fork_alarm_timeout.term_final";

        const builder = new OOPBuilder()
            .setActiveFile("source.c")

            // 1. Inici de variables
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "contador": "0",
                "hijos": "0",
                "estat": "Iniciant main()"
            })
            .setTerminalOutput([])
            .addStep(29, "pro.fork_alarm_timeout.step_1")

            // 2. sigemptyset
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "mask": "{}"
            })
            .addStep(35, "pro.fork_alarm_timeout.step_2")

            // 3. sigaddset
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "mask": "{SIGALRM}"
            })
            .addStep(36, "pro.fork_alarm_timeout.step_3")

            // 4. sigprocmask BLOCK
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "mask_bloqueig": "{SIGALRM}",
                "estat_senyal": "SIGALRM BLOQUEJAT (Evita curses abans del fork)"
            })
            .addStep(37, "pro.fork_alarm_timeout.step_4")

            // 5. for (hijos = 0)
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "hijos": "0",
                "bucle": "Iteració 0 de 10"
            })
            .addStep(40, "pro.fork_alarm_timeout.step_5")

            // 6. write creando hijo 0
            .setVariables({
                "buff": "\"Creando el hijo numero 0\\n\""
            })
            .setTerminalOutput([T_FORK_0])
            .addStep(42, "pro.fork_alarm_timeout.step_6")

            // 7. fork()
            .setVariables({
                "acció": "fork()",
                "pare_rep": "pid = 2041 (PID del fill)",
                "fill_rep": "pid = 0 (Indica que és el fill)"
            })
            .addStep(44, "pro.fork_alarm_timeout.step_7")

            // 8. Fill entra a if (pid == 0)
            .clearVariables()
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "pid": "0",
                "condició": "pid == 0 (CERT)"
            })
            .addStep(45, "pro.fork_alarm_timeout.step_8")

            // 9. Fill assigna sa_handler
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "sa.sa_handler": "&trata_alarma (Funció buida)"
            })
            .addStep(46, "pro.fork_alarm_timeout.step_9")

            // 10. Fill activa SA_RESTART
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "sa.sa_flags": "SA_RESTART (Auto-reprendre syscalls)"
            })
            .addStep(47, "pro.fork_alarm_timeout.step_10")

            // 11. Fill registra sigaction
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "Kernel_handler": "SIGALRM associat a &trata_alarma"
            })
            .addStep(49, "pro.fork_alarm_timeout.step_11")

            // 12. Fill saluda pel terminal
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "buff": "\"Hola, soy 2041\\n\""
            })
            .setTerminalOutput([T_FORK_0, T_HIJO_HELLO])
            .addStep(52, "pro.fork_alarm_timeout.step_12")

            // 13. Fill programa alarm(1)
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "Kernel_timer": "alarm(1) -> SIGALRM d'aquí a 1 segon"
            })
            .addStep(54, "pro.fork_alarm_timeout.step_13")

            // 14. Fill prepara màscara per suspendre
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "mask_suspend": "Bloqueja tot EXCEPTE SIGALRM i SIGINT"
            })
            .addStep(56, "pro.fork_alarm_timeout.step_14")

            // 15. Fill s'adorm a sigsuspend
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "estat_fill": "BLOCAT A SIGSUSPEND (Consum 0% CPU)"
            })
            .addStep(58, "pro.fork_alarm_timeout.step_15")

            // 16. Pare avalua else if (pid > 0)
            .clearVariables()
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "pid": "2041",
                "condició": "pid > 0 (CERT)"
            })
            .addStep(61, "pro.fork_alarm_timeout.step_16")

            // 17. Pare desa PID a pids_hijos[0]
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "pids_hijos[0]": "2041"
            })
            .addStep(62, "pro.fork_alarm_timeout.step_17")

            // 18. Pare completa els 10 fills
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "hijos_creats": "10",
                "pids_hijos": "[2041, 2042, 2043, ..., 2050]",
                "estat_dels_fills": "10 fills dormint a sigsuspend (1s)"
            })
            .addStep(40, "pro.fork_alarm_timeout.step_18")

            // 19. Pare prepara el seu handler
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "sa.sa_handler": "&trata_alarma_padre"
            })
            .addStep(69, "pro.fork_alarm_timeout.step_19")

            // 20. Pare sa_flags = 0 (Sense SA_RESTART)
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "sa.sa_flags": "0 (SENSE SA_RESTART - Interromp waitpid)"
            })
            .addStep(70, "pro.fork_alarm_timeout.step_20")

            // 21. Pare registra sigaction
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "Kernel_handler": "SIGALRM del Pare associat"
            })
            .addStep(72, "pro.fork_alarm_timeout.step_21")

            // 22. Pare desbloqueja SIGALRM
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "SIGALRM_pare": "DESBLOQUEJAT (Llest per rebre el seu timeout)"
            })
            .addStep(76, "pro.fork_alarm_timeout.step_22")

            // 23. while (hijos > 0)
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "hijos": "10",
                "condició": "10 > 0 (CERT)"
            })
            .addStep(79, "pro.fork_alarm_timeout.step_23")

            // 24. Pare posa alarm(2)
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "cronòmetre_pare": "alarm(2) -> 2 segons límit màxim"
            })
            .addStep(80, "pro.fork_alarm_timeout.step_24")

            // 25. Pare s'espera a waitpid
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "estat_pare": "BLOCAT A WAITPID(-1, &res, 0)",
                "timeout_pendent": "2 segons comptant al Kernel"
            })
            .addStep(81, "pro.fork_alarm_timeout.step_25")

            // 26. Fill 2041: Passa 1s i rep l'alarma!
            .clearVariables()
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "esdeveniment": "Passa 1 segon! Kernel envia SIGALRM",
                "estat": "Es desperta de sigsuspend"
            })
            .addStep(58, "pro.fork_alarm_timeout.step_26")

            // 27. Fill 2041: exit(0)
            .setVariables({
                "procés_actiu": "Fill 0 (PID 2041)",
                "acció": "exit(0)",
                "estat_post_mort": "ZOMBIE (PCB pendent de recollida)"
            })
            .addStep(60, "pro.fork_alarm_timeout.step_27")

            // 28. Pare: waitpid es desperta!
            .clearVariables()
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "waitpid_retorna": "pid = 2041",
                "temps_passat": "1s (< 2s del Pare)",
                "res": "0x0000"
            })
            .addStep(81, "pro.fork_alarm_timeout.step_28")

            // 29. if (pid > 0)
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "pid": "2041",
                "condició": "2041 > 0 (CERT)"
            })
            .addStep(83, "pro.fork_alarm_timeout.step_29")

            // 30. alarm(0) atura el timeout
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "alarm(0)": "TEMPORITZADOR ATURAT",
                "segons_restants": "1"
            })
            .addStep(84, "pro.fork_alarm_timeout.step_30")

            // 31. Pare escriu el temps restant
            .setVariables({
                "buff": "\"Faltaven 1 segons per a l'alarma\\n\""
            })
            .setTerminalOutput([T_FORK_0, T_HIJO_HELLO, T_ALARM_OFF])
            .addStep(86, "pro.fork_alarm_timeout.step_31")

            // 32. Pare esborra de pids_hijos
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "pids_hijos[0]": "0 (Fill recollit)",
                "PCB_fill": "Eliminat del Kernel"
            })
            .addStep(89, "pro.fork_alarm_timeout.step_32")

            // 33. WIFEXITED(res)
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "WIFEXITED(res)": "CERT (Ha acabat amb exit)",
                "WEXITSTATUS(res)": "0"
            })
            .addStep(92, "pro.fork_alarm_timeout.step_33")

            // 34. write confirmació de sortida
            .setVariables({
                "buff": "\"Termina el proceso 2041 con exit(0)\\n\""
            })
            .setTerminalOutput([T_FORK_0, T_HIJO_HELLO, T_ALARM_OFF, T_HIJO_EXIT])
            .addStep(94, "pro.fork_alarm_timeout.step_34")

            // 35. hijos--; contador++
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "hijos": "9",
                "contador": "1"
            })
            .addStep(100, "pro.fork_alarm_timeout.step_35")

            // 36. Branca else: Què passaria si triguessin > 2s?
            .setVariables({
                "hipòtesi": "Si un fill es pengés més de 2s",
                "Kernel": "Enviaria SIGALRM al Pare",
                "reacció": "trata_alarma_padre() s'executa",
                "waitpid": "Retornaria pid = -1 (EINTR)",
                "emergència": "kill(pids_hijos[i], SIGKILL)"
            })
            .addStep(103, "pro.fork_alarm_timeout.step_36")

            // 37. Recollits tots els fills
            .clearVariables()
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "hijos": "0",
                "contador": "10",
                "estat_fills": "Tots 10 fills recollits en temps (< 2s)"
            })
            .addStep(79, "pro.fork_alarm_timeout.step_37")

            // 38. Impressió final i fi
            .setVariables({
                "procés_actiu": "Pare (PID 2040)",
                "buff": "\"Valor del contador 10\\n\"",
                "return": "0"
            })
            .setTerminalOutput([T_FORK_0, T_HIJO_HELLO, T_ALARM_OFF, T_HIJO_EXIT, T_FINAL])
            .addStep(111, "pro.fork_alarm_timeout.step_38");

        return builder.build();
    }
};
