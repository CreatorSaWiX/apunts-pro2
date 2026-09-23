import type { Simulation } from "../../engine/types";
import { pin_gpio } from "./implementations/pin_gpio";

export const ci: Record<string, Simulation> = {
    pin_gpio
};
