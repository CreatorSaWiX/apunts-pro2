/**
 * Centralized Haptics Engine for Mobile Web
 * 
 * Provides native-like physical feedback using the Vibration API.
 * Gracefully degrades on unsupported devices (e.g., iOS Safari or Desktop).
 */

const canVibrate = () => {
    return typeof window !== 'undefined' && 'vibrate' in navigator;
};

export const hapticSelection = () => {
    if (canVibrate()) {
        // Very light tick, like scrolling a picker or wheel
        navigator.vibrate(8);
    }
};

export const hapticLight = () => {
    if (canVibrate()) {
        // Standard button tap
        navigator.vibrate(15);
    }
};

export const hapticMedium = () => {
    if (canVibrate()) {
        // More significant action (e.g. deleting an item, opening modal)
        navigator.vibrate(30);
    }
};

export const hapticHeavy = () => {
    if (canVibrate()) {
        // Long press threshold reached or critical action
        navigator.vibrate(50);
    }
};

export const hapticSuccess = () => {
    if (canVibrate()) {
        // Double pulse for success
        navigator.vibrate([20, 40, 20]);
    }
};

export const hapticError = () => {
    if (canVibrate()) {
        // Rapid triple pulse for error
        navigator.vibrate([30, 40, 30, 40, 30]);
    }
};
