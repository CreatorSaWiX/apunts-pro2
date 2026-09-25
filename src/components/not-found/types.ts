export type PresetMode = 'lava' | 'ice';

export interface SphereParticles404Params {
  mode: PresetMode;
  emissiveColor: string;
  baseColor: string;
  ambientColor: string;
  ambientIntensity: number;
  directionalIntensity: number;
  bloomThreshold: number;
  bloomStrength: number;
  cursorRadius: number;
  cursorStrength: number;
  gravityStrength: number;
  generalDamping: number;
  heatDamping: number;
  showStats: boolean;
}

export const PRESETS: Record<PresetMode, Partial<SphereParticles404Params>> = {
  lava: {
    mode: 'lava',
    emissiveColor: '#ff3f0f',
    baseColor: '#ffffff',
    ambientColor: '#38bdf8',
    ambientIntensity: 0.12,
    directionalIntensity: 0.35,
  },
  ice: {
    mode: 'ice',
    emissiveColor: '#23639f',
    baseColor: '#cce1ea',
    ambientColor: '#00aaff',
    ambientIntensity: 0.14,
    directionalIntensity: 0.45,
  },
};

export const DEFAULT_404_PARAMS: SphereParticles404Params = {
  mode: 'ice',
  emissiveColor: '#23639f', // Ice default
  baseColor: '#cce1ea',
  ambientColor: '#00aaff',
  ambientIntensity: 0.14,
  directionalIntensity: 0.45,
  bloomThreshold: 0.4,
  bloomStrength: 0.25,
  cursorRadius: 1.75,
  cursorStrength: 0.05,
  gravityStrength: 0.04,
  generalDamping: 0.4,
  heatDamping: 3.0,
  showStats: false,
};

export interface SphereParticles404API {
  params: SphereParticles404Params;
  updateParam: <K extends keyof SphereParticles404Params>(key: K, value: SphereParticles404Params[K]) => void;
  triggerShockwave: () => void;
  resetCamera: () => void;
  isWebGPU: boolean;
}
