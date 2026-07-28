import { useSettings } from '../contexts/SettingsContext';

export interface MobilePerformanceState {
    isMobile: boolean;
    isSlowNetwork: boolean;
    isLowEndHardware: boolean;
    isLiteMode: boolean;
}

export function useMobilePerformance(): MobilePerformanceState {
    const {
        isMobile,
        isSlowNetwork,
        isLowEndHardware,
        isLiteMode,
    } = useSettings();

    return {
        isMobile,
        isSlowNetwork,
        isLowEndHardware,
        isLiteMode,
    };
}
