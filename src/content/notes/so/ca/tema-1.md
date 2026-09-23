---
title: "Tema 1: Introducció al Sistema Operatiu i Crides a Sistema"
description: "Definició, cicle de vida, modes d'execució de la CPU (usuari vs. kernel), frontera de seguretat, interrupcions HW, excepcions SW i mecanisme intern de les crides a sistema (syscalls)."
readTime: "12 min"
order: 1
draft: false
---

# 1. Introducció al sistema operatiu i crides a sistema

::callout[type="info" title="Objectiu del Tema"]
Aquest tema estableix els fonaments de baix nivell de com el programari interactua amb el maquinari físic: el rol del sistema operatiu, els mecanismes hardware de protecció de la CPU, els tipus d'esdeveniments que donen el control al kernel i el camí complet d'execució d'una crida a sistema (*system call*).
::

---

## 1.1. Definició, rol i objectius del SO

El **Sistema Operatiu (SO)** és el software base que controla i administra els recursos de maquinari (*hardware*) disponibles a la màquina i actua d'intermediari transparent entre les aplicacions d'usuari i els circuits físics.

* **Perspectiva interna:** Defineix estructures de dades internes per gestionar els recursos (CPU, memòria RAM, dispositius d'E/S) i algorismes per decidir com compartir-los de forma òptima i equitativa.
* **Perspectiva externa:** Ofereix una interfície homogènia de serveis i funcions (les **crides a sistema**) perquè les aplicacions puguin accedir als recursos amb seguretat i sense haver de conèixer els detalls d'enginyeria electrònica del hardware.

### Els tres objectius principals del SO

1. ==Usabilitat==: Abstreu la complexitat i les peculiaritats de cada perifèric o processador oferint una interfície uniforme, coherent i intuïtiva per als desenvolupadors i usuaris.
2. ==Seguretat i protecció==: Protegeix el maquinari d'accessos no autoritzats o erronis i garanteix un aïllament estricte entre processos d'usuaris diferents per evitar interferències mútues.
3. ==Eficiència==: Maximitza el rendiment dels recursos compartits mitjançant tècniques de multiprogramació, oferint a cada usuari la il·lusió de disposar de la màquina en exclusiva.

---

## 1.2. Cicle de vida del Sistema Operatiu

El funcionament d'un sistema operatiu des que s'encén l'ordinador fins que s'apaga passa per tres fases consecutives:

1. ==Arrencada (*Boot / Startup*)==:
   * El firmware de la placa base (**BIOS / UEFI**) realitza el test de diagnòstic (*POST*) i carrega el gestor d'arrencada (*bootloader*).
   * Es copia la imatge del nucli del SO des del disc secundari cap a la memòria principal (RAM).
   * El kernel inicialitza les seves estructures internes, programa els controladors de dispositius físics i captura els **vectors d'interrupció**.
   * Finalment, engega el procés inicial arrel (`init` o `systemd`, PID 1), el servei de login i la primera intèrpret d'ordres (*shell*).
2. ==Fase d'ús (*Runtime*)==:
   * Proporciona l'entorn d'execució de processos d'usuari i gestiona el repartiment just del temps de CPU.
   * Ofereix serveis de desenvolupament (compiladors, editors de text, shells).
   * Atén contínuament les crides a sistema dels programes i els esdeveniments asíncrons del maquinari.
3. ==Finalització (*Shutdown*)==:
   * Atura ordenadament tots els processos actius enviant senyals de terminació.
   * Força el buidat de memòries cau cap al disc físic (**sync / flush**) per evitar pèrdua de dades.
   * Desmunta amb seguretat els sistemes de fitxers (*filesystems*).
   * Desconnecta el subministrament elèctric del maquinari de manera segura.

```text
┌────────────────────────────────┐                 ┌────────────────────────────────┐                 ┌────────────────────────────────┐
│      1. ARRENCADA (Boot)       │                 │      2. FASE D'ÚS (Runtime)    │                 │    3. FINALITZACIÓ (Shutdown)  │
├────────────────────────────────┤                 ├────────────────────────────────┤                 ├────────────────────────────────┤
│ • BIOS/UEFI arrenca el HW.     │   SO preparat   │ • Entorn d'execució de procs.  │   Petició fi    │ • Atura processos ordenadament.│
│ • Copia SO de disc a RAM.      ├────────────────►│ • Repartiment just de CPU.     ├────────────────►│ • Buidat de memòries cau (sync)│
│ • Inicialitza estructures.     │                 │ • Shell, editors, compiladors. │                 │ • Desmunta fitxers i apaga HW. │
│ • Captura vectors interrupció. │                 │ • Atenció a syscalls i esdevs. │                 │                                │
│ • Engega procés inicial (init).│                 │                                │                 │                                │
└────────────────────────────────┘                 └────────────────────────────────┘                 └────────────────────────────────┘
```

---

## 1.3. Modes d'execució de la CPU i protecció del maquinari

Per garantir la supervivència i estabilitat del sistema davant d'errors de programari o atacs maliciosos, el processador físic disposa d'un mecanisme hardware de protecció basat en nivells de privilegi (*rings*):

* ==Mode usuari (*User Mode* / Ring 3 / No privilegiat)==:
  * S'hi executen els programes ordinaris de l'usuari (navegadors, editors, jocs, compiladors).
  * Determinades instruccions màquina estan estrictament prohibides (**instruccions privilegiades**, com canviar els registres de la MMU, aturar la CPU o manipular els vectors d'interrupció).
  * L'espai d'adreces de memòria accessible està restringit a la pròpia àrea de l'aplicació.
* ==Mode sistema (*Kernel Mode* / Ring 0 / Privilegiat)==:
  * S'hi executa exclusivament el nucli (*kernel*) del sistema operatiu.
  * Té accés il·limitat a tot l'espai físic de memòria RAM i als ports de comunicació.
  * Pot executar totes les instruccions màquina de l'arquitectura de la CPU.

### Arquitectura de capes i frontera de seguretat

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MODE USUARI (Ring 3 / No privilegiat)                           │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌───────────────────────┐   │
│   │   Editors    │   │ Compiladors  │   │    Shell     │   │ Aplicacions C / BBDD  │   │
│   │ (vim, code)  │   │ (gcc, make)  │   │ (bash, zsh)  │   │  (codi d'usuari)      │   │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────────┬────────────┘   │
└──────────┼──────────────────┼──────────────────┼──────────────────────┼────────────────┘
           ▼                  ▼                  ▼                      ▼
══════════════════════════════════════════════════════════════════════════════════════════
       FRONTERA DE SEGURETAT HW: Crides a sistema (syscall / TRAP / sysenter)
══════════════════════════════════════════════════════════════════════════════════════════
           │
           ▼  (Canvi de mode protegit per Hardware)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MODE KERNEL (Ring 0 / Privilegiat)                              │
│   ┌───────────────────┬───────────────────┬────────────────────┬───────────────────┐   │
│   │  Processos i CPU  │  Memòria Virtual  │ Sistema de Fitxers │    Drivers E/S    │   │
│   │  Planif, PCB, IPC │  MMU, paginació   │ VFS, inodes, cau   │ Disc, xarxa, tty  │   │
│   └───────────────────┴───────────────────┴────────────────────┴───────────────────┘   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │  ▲
              Instruccions privilegiades   │  │  Interrupcions HW (IRQ)
                                           ▼  │
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MAQUINARI FÍSIC                                        │
│   ┌───────────────────┬───────────────────┬────────────────────┬───────────────────┐   │
│   │ Processador (CPU) │   Memòria RAM     │  Controladors E/S  │  Targetes de Xarxa│   │
│   │ Registres, Timer  │ Espai físic bytes │  Disc, USB, teclat │   Ethernet, WiFi  │   │
│   └───────────────────┴───────────────────┴────────────────────┴───────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

::callout[type="warning" title="Pregunta d'examen clau [Parcial Teoria QT 2024-2025, Ex. 1.f]"]
**Per què no podem invocar directament les rutines del kernel com si fossin funcions normals de C?**

1. **Aïllament d'espai lògic:** Les rutines del nucli resideixen a l'espai d'adreces de memòria del kernel, que està totalment protegit i resulta completament invisible i inaccessible per al codi d'usuari.
2. **Violació de privilegis:** Les funcions del kernel contenen instruccions privilegiades. Si s'intentessin executar estant la CPU en mode usuari, el maquinari llançaria immediatament una excepció per violació de privilegis. Cal forçar un canvi de privilegi controlat pel processador mitjançant una instrucció especial de trap (`syscall`).
::

---

## 1.4. Formes d'accedir al codi del kernel

El nucli del sistema operatiu no està en execució contínua; només pren el control de la CPU quan un esdeveniment específic interromp el flux del programa d'usuari.

### Classificació d'esdeveniments

* **Síncron (lligat a la instrucció actual):** Es produeix com a conseqüència directa de la instrucció que la CPU està processant en aquell instant exacte. Si repetim l'execució pas a pas amb les mateixes dades, saltarà **sempre en el mateix cicle**. Exemples: divisió per zero, referència a memòria invàlida o una crida `write()`.
* **Asíncron (arriba de forma externa):** És generat per un dispositiu físic extern (teclat, rellotge intern, disc dur, targeta de xarxa). Arriba de sobte **entre dues instruccions qualssevol**, sense que la línia de codi actual en tingui cap culpa.
* **Voluntari vs. Involuntari:** És **voluntari** si el programa d'usuari demana entrar expressament al kernel mitjançant una crida a sistema; és **involuntari** si el canvi és forçat per una fallada de codi o un avís del maquinari.

### Els tres mecanismes hardware d'accés

Existeixen exactament tres vies hardware per transferir el control al nucli (*Parcial 2023-2024 Ex. 1.a i Parcial 2025-2026 Ex. 1*):

| Mecanisme | Voluntarietat | Sincronisme | Causa / Origen | Exemples típics |
| :--- | :---: | :---: | :--- | :--- |
| **Interrupció HW** | Involuntari | **Asíncron** | Dispositiu físic extern de maquinari. Arriba entre dues instruccions. | Rellotge del sistema (*timer*), prémer una tecla, recepció de paquet de xarxa, fi de lectura de disc. |
| **Excepció SW** | Involuntari | **Síncron** | Error greu o condició anòmala generada per la instrucció que s'executa. | Divisió per zero (`x / 0`), adreçament de punter invàlid (`SIGSEGV`), instrucció no permesa. |
| **Crida al sistema (*trap*)** | **Voluntari** | **Síncron** | Petició intencionada del procés per demanar un servei al kernel. | Invocacions a `write()`, `fork()`, `waitpid()`, `sigsuspend()`. |

---

## 1.5. El rellotge del sistema (*timer interrupt*)

Si cap aplicació provoqués excepcions de codi ni realitzés crides a sistema voluntàries, un bucle infinit en mode usuari (`while(1);`) podria monopolitzar la CPU de manera indefinida, penjant tot l'ordinador.

Per evitar-ho, el sistema operatiu programa a l'inici un temporitzador físic (*hardware timer*) perquè emeti una **interrupció de rellotge periòdica** (típicament cada 10 ms):

1. El maquinari suspèn automàticament l'execució del procés d'usuari.
2. Commuta la CPU a mode kernel i salta a la **Rutina de Servei d'Interrupció (RSI)** del rellotge.
3. El nucli crida al **planificador (*scheduler*)**, que actualitza els comptadors de temps i decideix si és el moment de retirar la CPU al procés actual per cedir-la a un altre procés preparat.

```text
Eix temporal:
────────────────────────────────────────────────────────────────────────────────────────────► Temps
┌──────────────────────┐ ┌──────────┐ ┌──────────────────────┐ ┌──────────┐ ┌──────────────┐
│  Procés A (usuari)   │ │Scheduler │ │  Procés B (usuari)   │ │Scheduler │ │  Procés A    │
└──────────────────────┘ └──────────┘ └──────────────────────┘ └──────────┘ └──────────────┘
                         ▲                                     ▲
                    Tick 10 ms                            Tick 20 ms
              (Interrupció HW del timer)            (Interrupció HW del timer)
```

---

## 1.6. Mecanisme intern de les crides a sistema i llibreries

### Com es genera un executable en C

El codi font que escrivim passa per dues etapes principals abans de poder ser executat pel sistema operatiu:

```text
┌──────────────┐                  ┌──────────────┐                  ┌──────────────┐
│ Codi font C  │   Compilació     │ Codi objecte │    Enllaçat      │  Executable  │
│ (programa.c) ├─────────────────►│ (programa.o) ├─────────────────►│ (binari ELF) │
└──────────────┘   (gcc -c)       └──────┬───────┘   (linker / ld)  └──────────────┘
                                         ▲
                                         │ Combina rutines
                                  ┌──────┴───────┐
                                  │ Llibreries   │
                                  │ (libc.a / .so│
                                  └──────────────┘
```

### El paper de la llibreria estàndard (`libc` / `libso`)

Les aplicacions d'usuari no executen directament instruccions màquina de canvi de mode, sinó que invoquen funcions embolcalladores (**wrappers**) de la llibreria de sistema estàndard (`libc`), que s'executa en **mode usuari**:

1. **Ubicació d'arguments:** La funció wrapper col·loca els paràmetres als registres de la CPU segons el conveni de la plataforma (**ABI**, *Application Binary Interface*, com `rdi`, `rsi`, `rdx` en x86-64).
2. **Càrrega de l'identificador:** Carrega el número únic de la crida a sistema en un registre reservat (ex: `rax = SYS_write`). Per desacoblar les aplicacions de les adreces internes del kernel, aquests nombres indexen la **taula de crides a sistema** (`sys_call_table`).
3. **Instrucció de canvi de mode:** Executa la instrucció que commuta el processador a mode privilegiat (`syscall`, `sysenter` o la clàssica `int 0x80`).
4. **Tractament de retorn:** Quan el kernel finalitza i retorna a mode usuari, la funció wrapper recull el valor de retorn. Si hi ha hagut error (valor negatiu), copia el codi d'error a la variable global `errno` i retorna un valor homogeni `-1` a l'aplicació.

::callout[type="info" title="Dependència del Maquinari [Parcial QP 2021-2022 / QP 2022-2023, Ex. 1.a]"]
La llibreria de sistema estàndard és **fortament dependent del maquinari** perquè ha de conèixer les instruccions específiques de la CPU per al salt a kernel, la distribució exacta dels registres de l'arquitectura i el format de pas de paràmetres per la pila o registres.
::

---

## 1.7. Traça pas a pas d'una crida: `write(1, buf, 5)`

L'esquema següent detalla exactament tot el que succeeix al computador des que invoquem `write()` fins que la funció retorna el control al nostre codi:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    MODE USUARI (Ring 3 · Espai d'adreces de l'aplicació)                        │
│                                                                                                 │
│  ┌──────────────────────────────┐                         ┌──────────────────────────────────┐  │
│  │ 1. Codi d'usuari (main.c)    │                         │ 2. Wrapper libc (write.c)        │  │
│  │                              │    1. Invocació C       │                                  │  │
│  │   char buf[5] = "hola";      ├────────────────────────►│ • Posa args a rdi, rsi, rdx      │  │
│  │   write(1, buf, 5);          │                         │ • Carrega rax = SYS_write        │  │
│  │   ...                        │◄────────────────────────┤ • Executa syscall / TRAP         │  │
│  │   (procés suspès)            │    5. Retorn (bytes / -1│ • Si error: posa errno i -1      │  │
│  └──────────────────────────────┘                         └───────────────┬──────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┼─────────────────────┘
                                                                            │  ▲
════════════════════════════════════════════════════════════════════════════┼══┼═══════════════════
       FRONTERA DE SEGURETAT HW: Canvi de mode de privilegi de la CPU       │  │
════════════════════════════════════════════════════════════════════════════┼══┼═══════════════════
                                                                            │  │
                                            2. Instrucció syscall (Ring 0)  │  │ 4. sysexit / sysret
                                                                            ▼  │    (torna a Ring 3)
┌──────────────────────────────────────────────────────────────────────────────┴──────────────────┐
│                    MODE KERNEL (Ring 0 · Espai d'adreces protegit del nucli)                    │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. Nucli del Sistema Operatiu (Kernel)                                                    │  │
│  │                                                                                           │  │
│  │  • La CPU commuta per maquinari a mode kernel.                                            │  │
│  │  • Salva el context del procés d'usuari (tots els registres) a la pila de kernel / PCB.  │  │
│  │  • Indexa sys_call_table[SYS_write] i invoca la rutina interna sys_write(1, buf, 5).     │  │
│  │  • El driver del maquinari gestiona el buffer del controlador físic d'E/S.               │  │
│  │  • Desa el resultat a rax i executa la instrucció sysexit / sysret / iret.               │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Taula comparativa: Funció ordinària de C vs. Crida a sistema

| Fase de l'execució | Funció ordinària de C (usuari) | Crida al sistema (*syscall*) |
| :--- | :--- | :--- |
| **Pas de paràmetres** | Pila d'usuari (`push`) o registres generals segons ABI de C. | Registres específics acordats per l'arquitectura i el kernel. |
| **Instrucció de crida** | `call` (es manté sempre el mateix mode de privilegi). | `syscall`, `sysenter` o `int 0x80` (canvi hardware a mode kernel). |
| **Salvat de context** | Salva només els registres que el conveni obliga a preservar (*callee-saved*). | El kernel salva **tots** els registres de l'usuari a la pila de kernel / PCB. |
| **Espai d'adreces** | Sempre dins de l'espai de memòria de la pròpia aplicació. | Transició a l'espai de memòria protegit del kernel. |
| **Instrucció de retorn** | `ret` (continua en mode usuari sense canvis de privilegis). | `sysexit`, `sysret`, `iret` (restaura el mode usuari per hardware). |
