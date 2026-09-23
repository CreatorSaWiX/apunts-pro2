import type { Simulation } from "../../../engine/types";
import { CircuitBuilder } from "../CircuitBuilder";

const code = `; --- Codi Assembler PIC18 (GPIO: TRIS, LAT, PORT) ---
; Estat inicial de Reset: TRISA = 0xFF (Mode Entrada / Hi-Z)

; 1. Configurar el pin RA0 com a SORTIDA
BCF     TRISA, 0        ; TRISA<0> = 0 -> Habilita buffer Tri-state

; 2. Escriure nivell lògic alt '1' (5V)
BSF     LATA, 0         ; LATA<0> = 1  -> Pin treu '1' (5V / Source)

; 3. Escriure nivell lògic baix '0' (0V)
BCF     LATA, 0         ; LATA<0> = 0  -> Pin treu '0' (0V / Sink)

; 4. Reconfigurar com a ENTRADA (Alta Impedància 'Z')
BSF     TRISA, 0        ; TRISA<0> = 1 -> Buffer tallat (Estat 'Z')

; 5. Lectura de l'estat extern del pin (PORTA)
MOVF    PORTA, W        ; Llegeix el valor físic del pin cap a W
`;

export const pin_gpio: Simulation = {
    id: "pin_gpio",
    renderer: "circuit",
    code,
    generateSteps: () => {
        const builder = new CircuitBuilder();

        // Step 0: Reset State
        builder
            .setTris(1)
            .setLat(0)
            .setActiveLines({})
            .setRegisters({
                W: "0x00",
                TRISA: "0x01 (TRIS0 = 1)",
                LATA: "0x00 (LAT0 = 0)",
                PORTA: "Z (Alta Impedància)"
            })
            .addCircuitStep(
                2,
                "Estat de Reset: Tots els pins del PIC18 arrenquen per defecte com a entrades (TRIS = 1) per seguretat. El buffer tri-state està tallat (desconnectat) i el pin es troba en Alta Impedància ('Z')."
            );

        // Step 1: BCF TRISA, 0
        builder
            .setTris(0)
            .setActiveLines({
                dataBusToTris: true,
                wrTris: true,
                trisToTristate: true,
                tristateToPin: true
            })
            .setRegisters({
                TRISA: "0x00 (TRIS0 = 0 -> SORTIDA)",
                PORTA: "0 (Sortida activa 0V)"
            })
            .addCircuitStep(
                5,
                "Execució de 'BCF TRISA, 0': S'escriu un '0' al biestable TRIS. Com que la porta tri-state té bombolla d'inversió a l'habilitació, el '0' l'activa! El pin passa a mode SORTIDA i treu el valor actual de LAT ('0' / 0V)."
            );

        // Step 2: BSF LATA, 0
        builder
            .setLat(1)
            .setActiveLines({
                dataBusToLat: true,
                wrLat: true,
                latToTristate: true,
                tristateToPin: true
            })
            .setRegisters({
                LATA: "0x01 (LAT0 = 1)",
                PORTA: "1 (Sortida activa 5V)"
            })
            .addCircuitStep(
                8,
                "Execució de 'BSF LATA, 0': S'escriu un '1' al biestable LATA. Com que el tri-state està habilitat, el transistor intern condueix i connecta el pin a 5V (VDD). El pin treu un nivell lògic '1' (Source)."
            );

        // Step 3: BCF LATA, 0
        builder
            .setLat(0)
            .setActiveLines({
                dataBusToLat: true,
                wrLat: true,
                latToTristate: true,
                tristateToPin: true
            })
            .setRegisters({
                LATA: "0x00 (LAT0 = 0)",
                PORTA: "0 (Sortida activa 0V)"
            })
            .addCircuitStep(
                11,
                "Execució de 'BCF LATA, 0': S'escriu un '0' a LATA. El transistor intern connecta el pin a 0V (VSS / massa). El pin treu un nivell lògic '0' (Sink)."
            );

        // Step 4: BSF TRISA, 0 (High Impedance 'Z')
        builder
            .setTris(1)
            .setActiveLines({
                dataBusToTris: true,
                wrTris: true,
                trisToTristate: true
            })
            .setRegisters({
                TRISA: "0x01 (TRIS0 = 1 -> ENTRADA)",
                PORTA: "Z (Flotant / Alta Impedància)"
            })
            .addCircuitStep(
                14,
                "Execució de 'BSF TRISA, 0': Es torna a posar TRISA<0> a '1'. L'habilitació del buffer tri-state cau a 0: tots dos transistors interns queden en tall (circuit obert). El pin queda en Alta Impedància ('Z') i passa a mode ENTRADA."
            );

        // Step 5: External Input Applied (5V)
        builder
            .setExternalInput(1)
            .setActiveLines({
                pinToPortRead: true
            })
            .setRegisters({
                PORTA: "1 (5V extern detectat)"
            })
            .addCircuitStep(
                14,
                "Connexió d'un senyal extern (5V) al pin: Com que el circuit intern està en alta impedància ('Z'), no hi ha curtcircuit. La tensió externa de 5V arriba a l'entrada del buffer Schmitt Trigger de lectura."
            );

        // Step 6: MOVF PORTA, W
        builder
            .setActiveLines({
                pinToPortRead: true,
                rdPort: true,
                portReadToBus: true
            })
            .setRegisters({
                W: "0x01",
                PORTA: "1 (Llegit pel bus)"
            })
            .addCircuitStep(
                17,
                "Execució de 'MOVF PORTA, W': S'activa el senyal RD PORT. El buffer d'entrada bolca l'estat del pin (nivell lògic '1') al Bus de Dades intern, i el valor 0x01 es carrega al registre de treball W."
            );

        return builder.build();
    }
};
