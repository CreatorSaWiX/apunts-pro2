import type React from 'react';
import { PinCircuitCanvas } from './PinCircuitCanvas';

export type CircuitCanvasComponent = React.ComponentType<{ visual?: any }>;

const CIRCUIT_CANVAS_REGISTRY: Record<string, CircuitCanvasComponent> = {
    pin_gpio: PinCircuitCanvas
};

/**
 * Returns the Canvas component registered for the given simulation ID or circuit type.
 * Falls back to PinCircuitCanvas if not specifically registered.
 */
export function getCircuitCanvas(circuitIdOrType?: string): CircuitCanvasComponent {
    if (circuitIdOrType && CIRCUIT_CANVAS_REGISTRY[circuitIdOrType]) {
        return CIRCUIT_CANVAS_REGISTRY[circuitIdOrType];
    }
    return PinCircuitCanvas;
}

/**
 * Register a new circuit canvas dynamically (e.g. for Timer0, ADC, UART, ALU, etc.)
 */
export function registerCircuitCanvas(idOrType: string, component: CircuitCanvasComponent): void {
    CIRCUIT_CANVAS_REGISTRY[idOrType] = component;
}
