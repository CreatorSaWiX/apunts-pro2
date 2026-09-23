import { StepBuilder } from "../../engine/StepBuilder";
import type { CircuitPinVisualState } from "./types";

export class CircuitBuilder extends StepBuilder<CircuitPinVisualState> {
    constructor() {
        super();
        this.visual = {
            latValue: 0,
            trisValue: 1, // Default reset state: TRIS = 1 (Input / High-Z)
            triStateEnabled: false,
            pinState: 'Z',
            externalPinInput: undefined,
            activeLines: {},
            registers: {
                W: '0x00',
                TRISA: '0xFF (Tots 1)',
                LATA: '0x00',
                PORTA: 'Z (Flotant)'
            }
        };
    }

    setLat(val: 0 | 1): this {
        this.visual.latValue = val;
        this.recomputePinState();
        return this;
    }

    setTris(val: 0 | 1): this {
        this.visual.trisValue = val;
        this.recomputePinState();
        return this;
    }

    setExternalInput(val?: 0 | 1): this {
        this.visual.externalPinInput = val;
        this.recomputePinState();
        return this;
    }

    setActiveLines(lines: Partial<NonNullable<CircuitPinVisualState['activeLines']>>): this {
        this.visual.activeLines = { ...lines };
        return this;
    }

    setRegisters(regs: Partial<NonNullable<CircuitPinVisualState['registers']>>): this {
        this.visual.registers = {
            ...this.visual.registers,
            ...regs
        } as NonNullable<CircuitPinVisualState['registers']>;
        return this;
    }

    private recomputePinState() {
        // TRIS = 0 -> Output mode (tri-state enabled via inverted input)
        // TRIS = 1 -> Input mode (tri-state disabled -> High Impedance 'Z')
        const enabled = this.visual.trisValue === 0;
        this.visual.triStateEnabled = enabled;

        if (enabled) {
            this.visual.pinState = this.visual.latValue === 1 ? '1' : '0';
        } else {
            this.visual.pinState = 'Z';
        }

        // Compute PORTA read value
        if (enabled) {
            this.visual.registers!.PORTA = this.visual.latValue === 1 ? '1 (5V sortida)' : '0 (0V sortida)';
        } else if (this.visual.externalPinInput !== undefined) {
            this.visual.registers!.PORTA = `${this.visual.externalPinInput} (${this.visual.externalPinInput === 1 ? '5V extern' : '0V extern'})`;
        } else {
            this.visual.registers!.PORTA = 'Z (Flotant / Indeterminat)';
        }
    }

    addCircuitStep(line: number, description: string, overrideVars: Record<string, string> = {}): this {
        this.addStep(line, description, {}, overrideVars);
        return this;
    }
}
