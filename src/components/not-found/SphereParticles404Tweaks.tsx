import { useEffect } from 'react';
import GUI from 'lil-gui';
import { PRESETS, type PresetMode, type SphereParticles404API } from './types';

interface SphereParticles404TweaksProps {
  api: SphereParticles404API;
}

export const SphereParticles404Tweaks = ({ api }: SphereParticles404TweaksProps) => {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const gui = new GUI({ title: `404 Tweaks (${api.isWebGPU ? 'WebGPU' : 'WebGL'})` });

    gui.domElement.style.position = 'fixed';
    gui.domElement.style.top = '72px';
    gui.domElement.style.right = '16px';
    gui.domElement.style.zIndex = '9999';
    gui.domElement.style.borderRadius = '8px';
    gui.domElement.style.overflow = 'hidden';
    gui.domElement.style.backdropFilter = 'blur(12px)';
    gui.domElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.45)';
    gui.domElement.style.border = '1px solid rgba(255, 255, 255, 0.15)';

    if (isMobile) {
      gui.close();
    }

    const state = { ...api.params };

    // Mode Presets (lava & ice)
    const fPresets = gui.addFolder('Presets');
    fPresets.add(state, 'mode', ['lava', 'ice']).name('Preset Mode').onChange((selectedMode: PresetMode) => {
      const preset = PRESETS[selectedMode];
      Object.assign(state, preset);

      if (preset.emissiveColor) api.updateParam('emissiveColor', preset.emissiveColor);
      if (preset.baseColor) api.updateParam('baseColor', preset.baseColor);
      if (preset.ambientColor) api.updateParam('ambientColor', preset.ambientColor);
      if (preset.ambientIntensity !== undefined) api.updateParam('ambientIntensity', preset.ambientIntensity);
      if (preset.directionalIntensity !== undefined) api.updateParam('directionalIntensity', preset.directionalIntensity);

      // Refresh GUI controller display values
      gui.controllersRecursive().forEach(controller => controller.updateDisplay());
    });

    // Colors & Light
    const fColors = gui.addFolder('Colors & Light');
    fColors.addColor(state, 'emissiveColor').name('Motion Glow Color').onChange((val: string) => {
      api.updateParam('emissiveColor', val);
    });
    fColors.addColor(state, 'baseColor').name('Base Spheres').onChange((val: string) => {
      api.updateParam('baseColor', val);
    });
    fColors.addColor(state, 'ambientColor').name('Ambient Color').onChange((val: string) => {
      api.updateParam('ambientColor', val);
    });
    fColors.add(state, 'ambientIntensity', 0, 0.5, 0.01).name('Ambient Light').onChange((val: number) => {
      api.updateParam('ambientIntensity', val);
    });
    fColors.add(state, 'directionalIntensity', 0, 1.5, 0.05).name('Direct Light').onChange((val: number) => {
      api.updateParam('directionalIntensity', val);
    });

    // Bloom (WebGPU only)
    if (api.isWebGPU) {
      const fBloom = gui.addFolder('Bloom Post-FX');
      fBloom.add(state, 'bloomThreshold', 0, 1, 0.02).name('Threshold').onChange((val: number) => {
        api.updateParam('bloomThreshold', val);
      });
      fBloom.add(state, 'bloomStrength', 0, 1.5, 0.05).name('Strength').onChange((val: number) => {
        api.updateParam('bloomStrength', val);
      });
    }

    // Physics
    const fPhysics = gui.addFolder('Physics');
    fPhysics.add(state, 'cursorRadius', 0.5, 4.0, 0.1).name('Cursor Radius').onChange((val: number) => {
      api.updateParam('cursorRadius', val);
    });
    fPhysics.add(state, 'cursorStrength', 0.01, 0.2, 0.01).name('Push Force').onChange((val: number) => {
      api.updateParam('cursorStrength', val);
    });
    fPhysics.add(state, 'gravityStrength', 0.01, 0.15, 0.005).name('Return Spring').onChange((val: number) => {
      api.updateParam('gravityStrength', val);
    });
    fPhysics.add(state, 'generalDamping', 0.1, 0.9, 0.05).name('Friction Damping').onChange((val: number) => {
      api.updateParam('generalDamping', val);
    });
    fPhysics.add(state, 'heatDamping', 0.5, 8.0, 0.2).name('Cooling Speed').onChange((val: number) => {
      api.updateParam('heatDamping', val);
    });

    // Actions & HUD
    const fActions = gui.addFolder('Actions & HUD');
    fActions.add(api, 'triggerShockwave').name('Trigger Shockwave');
    fActions.add(api, 'resetCamera').name('Reset Camera');
    fActions.add(state, 'showStats').name('Show Monitor').onChange((visible: boolean) => {
      api.updateParam('showStats', visible);
    });

    return () => {
      gui.destroy();
    };
  }, [api]);

  return null;
};

export default SphereParticles404Tweaks;
