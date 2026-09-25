import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { DEFAULT_404_PARAMS, type SphereParticles404API, type SphereParticles404Params } from './types';

export interface SphereParticles404Handle {
  triggerShockwave: () => void;
}

interface SphereParticles404Props {
  className?: string;
  onReady?: (api: SphereParticles404API) => void;
  showStats?: boolean;
}

/**
 * Generate 2D pixel coordinates for "404" text, returning them as normalised
 * 3D world-space target positions distributed across 3 depth layers.
 */
function sampleText404Points(count: number, sphereRadius: number): Float32Array {
  const result = new Float32Array(count * 3);
  const validPixels: { x: number; y: number }[] = [];

  try {
    const canvas = document.createElement('canvas');
    const width = 1000;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 240px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('404', width / 2, height / 2);

      const imgData = ctx.getImageData(0, 0, width, height).data;

      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          const idx = (y * width + x) * 4;
          if (imgData[idx] > 100) {
            validPixels.push({ x, y });
          }
        }
      }
    }
  } catch (e) {
    console.warn('Canvas 2D sampling error:', e);
  }

  // Fallback: Generate parametric 404 strokes if canvas sampling is empty
  if (validPixels.length < 50) {
    const strokes: [number, number, number, number][] = [
      [-5.5, 2.2, -5.5, 0.0],
      [-5.5, 0.0, -3.2, 0.0],
      [-3.2, 2.2, -3.2, -2.2],
      [-1.8, 2.2, 1.8, 2.2],
      [1.8, 2.2, 1.8, -2.2],
      [1.8, -2.2, -1.8, -2.2],
      [-1.8, -2.2, -1.8, 2.2],
      [3.2, 2.2, 3.2, 0.0],
      [3.2, 0.0, 5.5, 0.0],
      [5.5, 2.2, 5.5, -2.2],
    ];
    for (let i = 0; i < count; i++) {
      const stroke = strokes[i % strokes.length];
      const t = Math.random();
      const x = stroke[0] + (stroke[2] - stroke[0]) * t + (Math.random() - 0.5) * 0.35;
      const y = stroke[1] + (stroke[3] - stroke[1]) * t + (Math.random() - 0.5) * 0.35;
      const layer = (i % 3) - 1;
      const z = layer * (sphereRadius * 1.55) + (Math.random() - 0.5) * 0.05;
      result[i * 3 + 0] = x;
      result[i * 3 + 1] = y;
      result[i * 3 + 2] = z;
    }
    return result;
  }

  let minX = 1000, maxX = 0, minY = 400, maxY = 0;
  for (const p of validPixels) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const worldWidth = 14.0;
  const worldHeight = (spanY / spanX) * worldWidth;

  const step = validPixels.length / count;
  for (let i = 0; i < count; i++) {
    const pIndex = Math.min(validPixels.length - 1, Math.floor(i * step));
    const p = validPixels[pIndex];

    const nx = (p.x - centerX) / spanX;
    const ny = -(p.y - centerY) / spanY;

    const layer = (i % 3) - 1;
    const z = layer * (sphereRadius * 1.55) + (Math.random() - 0.5) * 0.04;
    const jx = (Math.random() - 0.5) * 0.06;
    const jy = (Math.random() - 0.5) * 0.06;

    result[i * 3 + 0] = nx * worldWidth + jx;
    result[i * 3 + 1] = ny * worldHeight + jy;
    result[i * 3 + 2] = z;
  }

  return result;
}

export const SphereParticles404 = forwardRef<SphereParticles404Handle, SphereParticles404Props>(
  ({ className = '', onReady, showStats = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shockwaveRef = useRef<(() => void) | null>(null);
    const statsRef = useRef<any>(null);
    const showStatsRef = useRef(showStats);
    showStatsRef.current = showStats;

    useEffect(() => {
      if (statsRef.current?.domElement) {
        statsRef.current.domElement.style.display = showStats ? 'block' : 'none';
      }
    }, [showStats]);

    useImperativeHandle(ref, () => ({
      triggerShockwave: () => {
        shockwaveRef.current?.();
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const count = 2200;
      const sphereRadiusValue = 0.14;
      const targetPoints = sampleText404Points(count, sphereRadiusValue);

      let isDisposed = false;
      let cleanupFn: (() => void) | null = null;

      const initSimulation = async () => {
        const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;

        if (hasWebGPU) {
          try {
            const webgpuCleanup = await initWebGPUMode(
              container,
              count,
              sphereRadiusValue,
              targetPoints
            );
            if (isDisposed) {
              webgpuCleanup();
              return;
            }
            cleanupFn = webgpuCleanup;
            return;
          } catch (err) {
            console.warn('WebGPU init error, switching to WebGL fallback:', err);
            container.innerHTML = '';
          }
        }

        if (!isDisposed) {
          cleanupFn = await initWebGLFallbackMode(
            container,
            count,
            sphereRadiusValue,
            targetPoints
          );
        }
      };

      // -------------------------------------------------------------
      // WebGPU Mode
      // -------------------------------------------------------------
      async function initWebGPUMode(
        parent: HTMLDivElement,
        particleCount: number,
        sRadius: number,
        targets: Float32Array
      ): Promise<() => void> {
        const THREE_WEBGPU = await import('three/webgpu');
        const TSL = await import('three/tsl');
        const { bloom } = await import('three/examples/jsm/tsl/display/BloomNode.js');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const { default: Stats } = await import('stats-gl');

        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;
        const isMobile = width < 768;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.outline = 'none';
        parent.appendChild(canvas);

        const scene = new THREE_WEBGPU.Scene();

        // Camera
        const camera = new THREE_WEBGPU.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0, isMobile ? 22 : 16);
        scene.add(camera);

        // OrbitControls
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        // Renderer with transparency
        const renderer = new THREE_WEBGPU.WebGPURenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.toneMapping = THREE_WEBGPU.CineonToneMapping;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE_WEBGPU.PCFShadowMap;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        await renderer.init();
        if (isDisposed) {
          renderer.dispose();
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          return () => {};
        }

        // Performance Monitor (stats-gl)
        const stats = new Stats({
          trackGPU: true,
          horizontal: true,
        });
        await stats.init(renderer);
        statsRef.current = stats;
        stats.domElement.style.position = 'fixed';
        stats.domElement.style.bottom = '16px';
        stats.domElement.style.left = '16px';
        stats.domElement.style.top = 'auto';
        stats.domElement.style.zIndex = '9999';
        stats.domElement.style.borderRadius = '8px';
        stats.domElement.style.backdropFilter = 'blur(8px)';
        stats.domElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.45)';
        stats.domElement.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        stats.domElement.style.display = showStatsRef.current ? 'block' : 'none';
        document.body.appendChild(stats.domElement);

        // Post processing Bloom
        const renderPipeline = new THREE_WEBGPU.RenderPipeline(renderer);
        (renderPipeline as any)._quadMesh.material.transparent = true;
        const scenePass = TSL.pass(scene, camera);
        const scenePassColor = scenePass.getTextureNode('output');
        const bloomPass = bloom(scenePassColor);
        bloomPass.threshold.value = DEFAULT_404_PARAMS.bloomThreshold;
        bloomPass.strength.value = DEFAULT_404_PARAMS.bloomStrength;
        renderPipeline.outputNode = TSL.vec4(scenePassColor.rgb.add(bloomPass.rgb), scenePassColor.a);

        // Lights
        const directionalLight = new THREE_WEBGPU.DirectionalLight(0xffffff, DEFAULT_404_PARAMS.directionalIntensity);
        directionalLight.castShadow = true;
        directionalLight.position.set(1, 1, 0.75).normalize().multiplyScalar(8);
        directionalLight.shadow.camera.far = 16;
        directionalLight.shadow.camera.top = 8;
        directionalLight.shadow.camera.right = 8;
        directionalLight.shadow.camera.bottom = -8;
        directionalLight.shadow.camera.left = -8;
        directionalLight.shadow.mapSize.set(2048, 2048);
        directionalLight.shadow.radius = 30;
        directionalLight.shadow.normalBias = -0.1;
        scene.add(directionalLight);

        const ambientLight = new THREE_WEBGPU.AmbientLight(
          new THREE.Color(DEFAULT_404_PARAMS.ambientColor),
          DEFAULT_404_PARAMS.ambientIntensity
        );
        scene.add(ambientLight);

        // Cursor & Raycasting
        const raycaster = new THREE_WEBGPU.Raycaster();
        const cursor = new THREE_WEBGPU.Vector2(999, 999);
        const cursorPosition = TSL.uniform(TSL.vec3(999, 999, 0));
        const cursorVelocity = TSL.uniform(TSL.vec3(0, 0, 0));
        const cursorRadius = TSL.uniform(DEFAULT_404_PARAMS.cursorRadius);
        const cursorStrength = TSL.uniform(DEFAULT_404_PARAMS.cursorStrength);
        const shockwaveStrength = TSL.uniform(0.0);

        const onPointerMove = (event: PointerEvent) => {
          const rect = canvas.getBoundingClientRect();
          cursor.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          cursor.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onPointerLeave = () => {
          cursor.set(999, 999);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerleave', onPointerLeave);

        // --- GPU Buffers ---
        const positionsBuffer = TSL.instancedArray(particleCount, 'vec3');
        const velocitiesBuffer = TSL.instancedArray(particleCount, 'vec3');
        const targetsBuffer = TSL.instancedArray(particleCount, 'vec3');
        const heatBuffer = TSL.instancedArray(particleCount, 'float');

        // Uniforms
        const radius = TSL.uniform(sRadius);
        const gravityStrength = TSL.uniform(DEFAULT_404_PARAMS.gravityStrength);
        const generalDamping = TSL.uniform(DEFAULT_404_PARAMS.generalDamping);
        const impactDamping = TSL.uniform(0.05);
        const heatDamping = TSL.uniform(DEFAULT_404_PARAMS.heatDamping);
        const heatImpactStrength = TSL.uniform(30.0);

        // Motion Color (default: original fire red-orange #ff3f0f)
        const emissiveColor = TSL.uniform(TSL.color(new THREE.Color(DEFAULT_404_PARAMS.emissiveColor)));
        const baseColorUniform = TSL.uniform(TSL.color(new THREE.Color(DEFAULT_404_PARAMS.baseColor)));

        // Init compute
        const initCompute = TSL.Fn(() => {
          const position = positionsBuffer.element(TSL.instanceIndex);
          const target = targetsBuffer.element(TSL.instanceIndex);

          const randomPos = TSL.vec3(
            TSL.hash(TSL.instanceIndex),
            TSL.hash(TSL.instanceIndex.add(12).mul(2)),
            TSL.hash(TSL.instanceIndex.add(23).mul(3))
          ).sub(0.5).mul(10);

          position.assign(randomPos);
          target.assign(randomPos);
        })().compute(particleCount);

        renderer.compute(initCompute);

        // Target upload
        const tarArray = new Float32Array(targets);
        const tarBufferAttr = new (THREE_WEBGPU as any).StorageInstancedBufferAttribute(tarArray, 3);
        const targetsUploadBuffer = TSL.storage(tarBufferAttr, 'vec3', particleCount);

        const uploadTargetsCompute = TSL.Fn(() => {
          const position = positionsBuffer.element(TSL.instanceIndex);
          const target = targetsBuffer.element(TSL.instanceIndex);
          const uploadedTarget = targetsUploadBuffer.element(TSL.instanceIndex);
          target.assign(uploadedTarget);

          const jitter = TSL.vec3(
            TSL.hash(TSL.instanceIndex),
            TSL.hash(TSL.instanceIndex.add(12).mul(2)),
            TSL.hash(TSL.instanceIndex.add(23).mul(3))
          ).sub(0.5).mul(0.3);

          position.assign(uploadedTarget.add(jitter));
        })().compute(particleCount);

        renderer.compute(uploadTargetsCompute);

        // Physics Compute
        const updateCompute = TSL.Fn(() => {
          const clampedDeltaTime = TSL.deltaTime.min(1 / 30);

          const aPosition = positionsBuffer.element(TSL.instanceIndex);
          const aVelocity = velocitiesBuffer.element(TSL.instanceIndex);
          const aTarget = targetsBuffer.element(TSL.instanceIndex);
          const aHeat = heatBuffer.element(TSL.instanceIndex);

          // 1. Cursor interaction
          const cursorDistance = aPosition.distance(cursorPosition);
          const cursorDistanceRatio = cursorDistance.div(cursorRadius).oneMinus().max(0);
          const _cursorVelocity = cursorVelocity.mul(cursorDistanceRatio).mul(cursorStrength);
          aVelocity.addAssign(_cursorVelocity);
          aHeat.addAssign(_cursorVelocity.length().mul(50.0));

          // 2. Shockwave explosion force
          TSL.If(shockwaveStrength.greaterThan(0.001), () => {
            const shockDir = aPosition.div(aPosition.length().max(TSL.EPSILON));
            aVelocity.addAssign(shockDir.mul(shockwaveStrength).mul(0.12));
            aHeat.addAssign(shockwaveStrength.mul(1.5));
          });

          // 3. Attraction towards target 404 position
          const toTarget = aTarget.sub(aPosition);
          const targetDist = toTarget.length();
          const targetDir = toTarget.div(targetDist.max(TSL.EPSILON));
          const gravityVelocity = targetDir
            .mul(targetDist.min(2.0))
            .mul(gravityStrength)
            .mul(clampedDeltaTime);
          aVelocity.addAssign(gravityVelocity);

          // 4. Sphere collision (squared-distance early-out to skip sqrt for distant pairs)
          const radius2 = radius.mul(2);
          const radius2Sq = radius2.mul(radius2);

          TSL.Loop(
            { start: TSL.instanceIndex.add(1), end: particleCount, condition: '<', name: 'i' },
            ({ i }: any) => {
              const bPosition = positionsBuffer.element(i);
              const delta = bPosition.sub(aPosition);
              const distSq = delta.dot(delta);

              TSL.If(distSq.lessThan(radius2Sq), () => {
                const bVelocity = velocitiesBuffer.element(i);
                const bHeat = heatBuffer.element(i);

                const distance = distSq.sqrt();
                const direction = delta.div(distance.max(TSL.EPSILON));

                const overlap = radius2.sub(distance);
                const avoidance = direction.mul(overlap.div(2));
                aPosition.subAssign(avoidance);
                bPosition.addAssign(avoidance);

                const relativeVelocity = aVelocity.sub(bVelocity);
                const impactStrength = TSL.dot(relativeVelocity, direction);
                const impactVelocity = direction
                  .mul(impactStrength)
                  .mul(impactDamping.oneMinus());
                aVelocity.subAssign(impactVelocity);
                bVelocity.addAssign(impactVelocity);

                const heat = impactStrength.sub(0.01).max(0).mul(heatImpactStrength);
                aHeat.addAssign(heat);
                bHeat.addAssign(heat);
              });
            }
          );

          // 5. Apply velocity
          aPosition.addAssign(aVelocity);

          // 6. Velocity damping
          aVelocity.mulAssign(generalDamping.mul(clampedDeltaTime).oneMinus());

          // 7. Heat damping
          aHeat.mulAssign(heatDamping.mul(clampedDeltaTime).oneMinus());
        })().compute(particleCount);

        // Geometry & Material
        const geometry = new THREE_WEBGPU.IcosahedronGeometry(1, 2);
        const material = new THREE_WEBGPU.MeshLambertNodeMaterial({ color: 0xffffff });
        material.colorNode = baseColorUniform;

        material.positionNode = TSL.Fn(() => {
          TSL.positionLocal.mulAssign(radius);
          TSL.positionLocal.addAssign(positionsBuffer.element(TSL.instanceIndex));
          return TSL.positionLocal;
        })();

        const heat = heatBuffer.element(TSL.instanceIndex);
        material.emissiveNode = emissiveColor.mul(heat);

        const mesh = new THREE_WEBGPU.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        (mesh as any).count = particleCount;
        scene.add(mesh);

        // Shockwave trigger
        const triggerShockwave = () => {
          shockwaveStrength.value = 1.0;
        };
        shockwaveRef.current = triggerShockwave;

        const resetCamera = () => {
          camera.position.set(0, 0, isMobile ? 22 : 16);
          controls.target.set(0, 0, 0);
          controls.update();
        };

        // Notify external API
        const currentParams: SphereParticles404Params = {
          ...DEFAULT_404_PARAMS,
          showStats: showStatsRef.current,
        };

        const updateParam = <K extends keyof SphereParticles404Params>(key: K, value: SphereParticles404Params[K]) => {
          currentParams[key] = value;
          switch (key) {
            case 'emissiveColor':
              emissiveColor.value.set(value as string);
              break;
            case 'baseColor':
              baseColorUniform.value.set(value as string);
              break;
            case 'ambientColor':
              ambientLight.color.set(value as string);
              break;
            case 'ambientIntensity':
              ambientLight.intensity = value as number;
              break;
            case 'directionalIntensity':
              directionalLight.intensity = value as number;
              break;
            case 'bloomThreshold':
              bloomPass.threshold.value = value as number;
              break;
            case 'bloomStrength':
              bloomPass.strength.value = value as number;
              break;
            case 'cursorRadius':
              cursorRadius.value = value as number;
              break;
            case 'cursorStrength':
              cursorStrength.value = value as number;
              break;
            case 'gravityStrength':
              gravityStrength.value = value as number;
              break;
            case 'generalDamping':
              generalDamping.value = value as number;
              break;
            case 'heatDamping':
              heatDamping.value = value as number;
              break;
            case 'showStats':
              if (stats.domElement) {
                stats.domElement.style.display = value ? 'block' : 'none';
              }
              break;
          }
        };

        if (onReady) {
          onReady({
            params: currentParams,
            updateParam,
            triggerShockwave,
            resetCamera,
            isWebGPU: true,
          });
        }

        // Raycasting
        const intersect = new THREE_WEBGPU.Vector3();
        const _plane = new THREE_WEBGPU.Plane(new THREE_WEBGPU.Vector3(0, 0, 1), 0);

        const onResize = () => {
          const w = parent.clientWidth || window.innerWidth;
          const h = parent.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.position.z = w < 768 ? 22 : 16;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', onResize);

        // Animation Loop
        renderer.setAnimationLoop(() => {
          if (isDisposed) return;

          stats.begin();

          controls.update();

          if (shockwaveStrength.value > 0.001) {
            shockwaveStrength.value *= 0.93;
          }

          if (cursor.x !== 999) {
            raycaster.setFromCamera(cursor, camera);
            _plane.normal.copy(camera.position).normalize();
            _plane.constant = 0;

            if (raycaster.ray.intersectPlane(_plane, intersect)) {
              cursorVelocity.value.copy(intersect).sub(cursorPosition.value);
              cursorPosition.value.copy(intersect);
            }
          }

          renderer.compute(updateCompute);
          renderPipeline.render();

          stats.end();
          stats.update();
        });

        return () => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerleave', onPointerLeave);
          window.removeEventListener('resize', onResize);
          renderer.setAnimationLoop(null);
          stats.domElement?.remove();
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        };
      }

      // -------------------------------------------------------------
      // WebGL Fallback Mode
      // -------------------------------------------------------------
      async function initWebGLFallbackMode(
        parent: HTMLDivElement,
        particleCount: number,
        sRadius: number,
        targets: Float32Array
      ): Promise<() => void> {
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const { default: Stats } = await import('stats-gl');

        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;
        const isMobile = width < 768;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.outline = 'none';
        parent.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0, isMobile ? 22 : 16);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.toneMapping = THREE.CineonToneMapping;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Performance Monitor (stats-gl)
        const stats = new Stats({
          trackGPU: true,
          horizontal: true,
        });
        await stats.init(renderer);
        statsRef.current = stats;
        stats.domElement.style.position = 'fixed';
        stats.domElement.style.bottom = '16px';
        stats.domElement.style.left = '16px';
        stats.domElement.style.top = 'auto';
        stats.domElement.style.zIndex = '9999';
        stats.domElement.style.borderRadius = '8px';
        stats.domElement.style.backdropFilter = 'blur(8px)';
        stats.domElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.45)';
        stats.domElement.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        stats.domElement.style.display = showStatsRef.current ? 'block' : 'none';
        document.body.appendChild(stats.domElement);

        // Lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, DEFAULT_404_PARAMS.directionalIntensity);
        directionalLight.castShadow = true;
        directionalLight.position.set(1, 1, 0.75).normalize().multiplyScalar(8);
        directionalLight.shadow.camera.far = 16;
        directionalLight.shadow.camera.top = 8;
        directionalLight.shadow.camera.right = 8;
        directionalLight.shadow.camera.bottom = -8;
        directionalLight.shadow.camera.left = -8;
        directionalLight.shadow.mapSize.set(2048, 2048);
        directionalLight.shadow.radius = 30;
        directionalLight.shadow.normalBias = -0.1;
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(
          new THREE.Color(DEFAULT_404_PARAMS.ambientColor),
          DEFAULT_404_PARAMS.ambientIntensity
        );
        scene.add(ambientLight);

        const geo = new THREE.IcosahedronGeometry(sRadius, 2);
        const mat = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          emissive: 0x000000,
        });

        const instancedMesh = new THREE.InstancedMesh(geo, mat, particleCount);
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;
        scene.add(instancedMesh);

        // Pre-initialize identity matrices so per-frame loop only updates translation
        {
          const mArr = instancedMesh.instanceMatrix.array as Float32Array;
          for (let j = 0; j < particleCount; j++) {
            const o = j * 16;
            mArr[o] = 1; mArr[o + 5] = 1; mArr[o + 10] = 1; mArr[o + 15] = 1;
          }
        }

        // CPU Arrays
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        const heat = new Float32Array(particleCount);

        pos.set(targets);

        const baseColor = new THREE.Color(DEFAULT_404_PARAMS.baseColor);
        const emissiveFire = new THREE.Color(DEFAULT_404_PARAMS.emissiveColor);
        const currentColor = new THREE.Color();

        // Tweaks state
        let cursorRadiusVal = DEFAULT_404_PARAMS.cursorRadius;
        let cursorStrengthVal = DEFAULT_404_PARAMS.cursorStrength;
        let gravityVal = DEFAULT_404_PARAMS.gravityStrength;
        let dampingVal = DEFAULT_404_PARAMS.generalDamping;
        let heatDampingVal = DEFAULT_404_PARAMS.heatDamping;

        const triggerShockwave = () => {
          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const px = pos[idx];
            const py = pos[idx + 1];
            const pz = pos[idx + 2];
            const d = Math.hypot(px, py, pz) + 0.01;
            vel[idx] += (px / d) * (0.2 + Math.random() * 0.35);
            vel[idx + 1] += (py / d) * (0.2 + Math.random() * 0.35);
            vel[idx + 2] += (pz / d) * (0.2 + Math.random() * 0.35);
            heat[i] = 1.5;
          }
        };
        shockwaveRef.current = triggerShockwave;

        const resetCamera = () => {
          camera.position.set(0, 0, isMobile ? 22 : 16);
          controls.target.set(0, 0, 0);
          controls.update();
        };

        const currentParams: SphereParticles404Params = {
          ...DEFAULT_404_PARAMS,
          showStats: showStatsRef.current,
        };

        const updateParam = <K extends keyof SphereParticles404Params>(key: K, value: SphereParticles404Params[K]) => {
          currentParams[key] = value;
          switch (key) {
            case 'emissiveColor':
              emissiveFire.set(value as string);
              break;
            case 'baseColor':
              baseColor.set(value as string);
              break;
            case 'ambientColor':
              ambientLight.color.set(value as string);
              break;
            case 'ambientIntensity':
              ambientLight.intensity = value as number;
              break;
            case 'directionalIntensity':
              directionalLight.intensity = value as number;
              break;
            case 'cursorRadius':
              cursorRadiusVal = value as number;
              break;
            case 'cursorStrength':
              cursorStrengthVal = value as number;
              break;
            case 'gravityStrength':
              gravityVal = value as number;
              break;
            case 'generalDamping':
              dampingVal = value as number;
              break;
            case 'heatDamping':
              heatDampingVal = value as number;
              break;
            case 'showStats':
              if (stats.domElement) {
                stats.domElement.style.display = value ? 'block' : 'none';
              }
              break;
          }
        };

        if (onReady) {
          onReady({
            params: currentParams,
            updateParam,
            triggerShockwave,
            resetCamera,
            isWebGPU: false,
          });
        }

        // Raycasting
        const raycaster = new THREE.Raycaster();
        const cursor = new THREE.Vector2(999, 999);
        const cursorWorld = new THREE.Vector3(999, 999, 0);
        const prevCursorWorld = new THREE.Vector3(999, 999, 0);
        const cursorVel = new THREE.Vector3();

        const onPointerMove = (e: PointerEvent) => {
          const rect = canvas.getBoundingClientRect();
          cursor.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          cursor.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onPointerLeave = () => {
          cursor.set(999, 999);
          cursorWorld.set(999, 999, 0);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerleave', onPointerLeave);

        const onResize = () => {
          const w = parent.clientWidth || window.innerWidth;
          const h = parent.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.position.z = w < 768 ? 22 : 16;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', onResize);

        const _wglPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const _wglHit = new THREE.Vector3();
        const instanceMatArr = instancedMesh.instanceMatrix.array as Float32Array;

        let animationFrameId: number;
        let lastTime = performance.now();

        const tick = () => {
          if (isDisposed) return;

          stats.begin();

          controls.update();

          const now = performance.now();
          const dt = Math.min((now - lastTime) / 1000, 1 / 30);
          lastTime = now;

          if (cursor.x !== 999) {
            raycaster.setFromCamera(cursor, camera);
            _wglPlane.normal.copy(camera.position).normalize();
            _wglPlane.constant = 0;
            if (raycaster.ray.intersectPlane(_wglPlane, _wglHit)) {
              cursorVel.copy(_wglHit).sub(prevCursorWorld);
              cursorWorld.copy(_wglHit);
              prevCursorWorld.copy(_wglHit);
            }
          }

          const cRadSq = cursorRadiusVal * cursorRadiusVal;
          const damp = Math.max(0, 1 - dampingVal * dt);
          const hDamp = Math.max(0, 1 - heatDampingVal * dt);

          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const px = pos[idx + 0];
            const py = pos[idx + 1];
            const pz = pos[idx + 2];

            // Attraction to target
            const dx = targets[idx + 0] - px;
            const dy = targets[idx + 1] - py;
            const dz = targets[idx + 2] - pz;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001;

            vel[idx + 0] += (dx / dist) * Math.min(dist, 2.0) * gravityVal * dt;
            vel[idx + 1] += (dy / dist) * Math.min(dist, 2.0) * gravityVal * dt;
            vel[idx + 2] += (dz / dist) * Math.min(dist, 2.0) * gravityVal * dt;

            // Cursor push
            if (cursorWorld.x !== 999) {
              const cdx = px - cursorWorld.x;
              const cdy = py - cursorWorld.y;
              const cdz = pz - cursorWorld.z;
              const cDistSq = cdx * cdx + cdy * cdy + cdz * cdz;

              if (cDistSq < cRadSq) {
                const cDist = Math.sqrt(cDistSq);
                const ratio = 1 - cDist / cursorRadiusVal;
                vel[idx + 0] += cursorVel.x * ratio * cursorStrengthVal;
                vel[idx + 1] += cursorVel.y * ratio * cursorStrengthVal;
                vel[idx + 2] += cursorVel.z * ratio * cursorStrengthVal;
                heat[i] = Math.min(heat[i] + cursorVel.length() * 0.8, 1.5);
              }
            }

            // Integrate & damp
            pos[idx + 0] += vel[idx + 0];
            pos[idx + 1] += vel[idx + 1];
            pos[idx + 2] += vel[idx + 2];

            vel[idx + 0] *= damp;
            vel[idx + 1] *= damp;
            vel[idx + 2] *= damp;
            heat[i] *= hDamp;

            // Direct translation-only write (skips quaternion/scale recomputation)
            const matOff = i * 16;
            instanceMatArr[matOff + 12] = pos[idx + 0];
            instanceMatArr[matOff + 13] = pos[idx + 1];
            instanceMatArr[matOff + 14] = pos[idx + 2];

            // Interpolate color with motion heat
            currentColor.copy(baseColor).lerp(emissiveFire, Math.min(heat[i], 1.0));
            instancedMesh.setColorAt(i, currentColor);
          }

          instancedMesh.instanceMatrix.needsUpdate = true;
          if (instancedMesh.instanceColor) {
            instancedMesh.instanceColor.needsUpdate = true;
          }

          renderer.render(scene, camera);

          stats.end();
          stats.update();

          animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);

        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerleave', onPointerLeave);
          window.removeEventListener('resize', onResize);
          stats.domElement?.remove();
          geo.dispose();
          mat.dispose();
          instancedMesh.dispose();
          renderer.dispose();
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        };
      }

      initSimulation();

      return () => {
        isDisposed = true;
        if (cleanupFn) {
          cleanupFn();
        }
      };
    }, [onReady]);

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden select-none ${className}`}
      />
    );
  }
);

SphereParticles404.displayName = 'SphereParticles404';
export default SphereParticles404;
