import type { CircuitVisualState, CircuitRegisterItem } from "../../engine/types";

export interface CircuitPinVisualState extends CircuitVisualState {
    latValue: 0 | 1;
    trisValue: 0 | 1;
    triStateEnabled: boolean;
    pinState: '0' | '1' | 'Z';
    externalPinInput?: 0 | 1;
    activeLines?: {
        dataBusToLat?: boolean;
        dataBusToTris?: boolean;
        latToTristate?: boolean;
        trisToTristate?: boolean;
        tristateToPin?: boolean;
        pinToPortRead?: boolean;
        portReadToBus?: boolean;
        wrLat?: boolean;
        wrTris?: boolean;
        rdPort?: boolean;
        [key: string]: boolean | undefined;
    };
    registers?: {
        W?: string;
        TRISA?: string;
        LATA?: string;
        PORTA?: string;
        [key: string]: string | CircuitRegisterItem | undefined;
    };
}
