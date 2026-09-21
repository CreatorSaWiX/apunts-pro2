import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

export interface SphereParticles404Handle {
  triggerShockwave: () => void;
}

interface SphereParticles404Props {
  className?: string;
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
      // First 4
      [-5.5, 2.2, -5.5, 0.0],
      [-5.5, 0.0, -3.2, 0.0],
      [-3.2, 2.2, -3.2, -2.2],
      // 0
      [-1.8, 2.2, 1.8, 2.2],
      [1.8, 2.2, 1.8, -2.2],
      [1.8, -2.2, -1.8, -2.2],
      [-1.8, -2.2, -1.8, 2.2],
      // Second 4
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

  // Standard sampled points normalized to 3D world space
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

    // Distribute across 3 clean depth layers so spheres don't crush into each other
    const layer = (i % 3) - 1; // -1, 0, 1
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
  ({ className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shockwaveRef = useRef<(() => void) | null>(null);

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
          cleanupFn = initWebGLFallbackMode(
            container,
            count,
            sphereRadiusValue,
            targetPoints
          );
        }
      };

      // -------------------------------------------------------------
      // WebGPU Mode — using instancedArray (matching reference project)
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

        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.outline = 'none';
        parent.appendChild(canvas);

        const scene = new THREE_WEBGPU.Scene();

        // Camera (matching reference)
        const isMobile = width < 768;
        const camera = new THREE_WEBGPU.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0, isMobile ? 22 : 16);
        scene.add(camera);

        // OrbitControls
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        // Renderer
        const renderer = new THREE_WEBGPU.WebGPURenderer({
          canvas,
          antialias: true,
        });
        renderer.toneMapping = THREE_WEBGPU.CineonToneMapping;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE_WEBGPU.PCFShadowMap;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x252028);

        await renderer.init();
        if (isDisposed) {
          renderer.dispose();
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          return () => {};
        }

        // Post processing Bloom (matching reference)
        const renderPipeline = new THREE_WEBGPU.RenderPipeline(renderer);
        const scenePass = TSL.pass(scene, camera);
        const scenePassColor = scenePass.getTextureNode('output');
        const bloomPass = bloom(scenePassColor);
        bloomPass.threshold.value = 0;
        bloomPass.strength.value = 0.15;
        renderPipeline.outputNode = scenePassColor.add(bloomPass);

        // Lights (matching reference project: 0.3 directional, 0.08 ambient)
        const directionalLight = new THREE_WEBGPU.DirectionalLight(0xffffff, 0.3);
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

        const ambientLight = new THREE_WEBGPU.AmbientLight(0xe8b8ff, 0.08);
        scene.add(ambientLight);

        // Cursor & Raycasting
        const raycaster = new THREE_WEBGPU.Raycaster();
        const cursor = new THREE_WEBGPU.Vector2(999, 999);
        const cursorPosition = TSL.uniform(TSL.vec3(999, 999, 0));
        const cursorVelocity = TSL.uniform(TSL.vec3(0, 0, 0));
        const cursorRadius = TSL.uniform(1.75);
        const cursorStrength = TSL.uniform(0.05);

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

        // --- GPU Buffers via instancedArray (matching reference project) ---
        const positionsBuffer = TSL.instancedArray(particleCount, 'vec3');
        const velocitiesBuffer = TSL.instancedArray(particleCount, 'vec3');
        const targetsBuffer = TSL.instancedArray(particleCount, 'vec3');
        const heatBuffer = TSL.instancedArray(particleCount, 'float');

        // Uniforms matching reference project
        const radius = TSL.uniform(sRadius);
        const gravityStrength = TSL.uniform(0.04);
        const impactDamping = TSL.uniform(0.05);
        const generalDamping = TSL.uniform(0.4);
        const heatDamping = TSL.uniform(3.0);
        const heatImpactStrength = TSL.uniform(30.0);
        const emissiveColor = TSL.uniform(TSL.color(0xff3f0f));

        // Upload target positions to GPU buffer via a uniform array
        const targetData: any[] = [];
        for (let i = 0; i < particleCount; i++) {
          targetData.push(new THREE.Vector3(
            targets[i * 3 + 0],
            targets[i * 3 + 1],
            targets[i * 3 + 2]
          ));
        }

        // Init compute: write target positions into targetsBuffer and
        // scatter initial positions randomly (like the reference project's hash init)
        const initCompute = TSL.Fn(() => {
          const position = positionsBuffer.element(TSL.instanceIndex);
          const target = targetsBuffer.element(TSL.instanceIndex);

          // Random initial positions (matching reference's cube volume)
          const randomPos = TSL.vec3(
            TSL.hash(TSL.instanceIndex),
            TSL.hash(TSL.instanceIndex.add(12).mul(2)),
            TSL.hash(TSL.instanceIndex.add(23).mul(3))
          ).sub(0.5).mul(10);

          position.assign(randomPos);

          // We need to set target positions from CPU data.
          // We do this by storing them in the velocity buffer temporarily,
          // then copying them. But instancedArray doesn't support direct CPU upload.
          // Instead we'll set targets from CPU after init.
          target.assign(randomPos); // Temporary, will be overridden
        })().compute(particleCount);

        renderer.compute(initCompute);

        // Upload target positions to targetsBuffer via StorageInstancedBufferAttribute
        // We create a separate buffer attribute to push CPU data into the targets storage
        const tarArray = new Float32Array(targets);
        const tarBufferAttr = new (THREE_WEBGPU as any).StorageInstancedBufferAttribute(tarArray, 3);
        const targetsUploadBuffer = TSL.storage(tarBufferAttr, 'vec3', particleCount);

        const uploadTargetsCompute = TSL.Fn(() => {
          const position = positionsBuffer.element(TSL.instanceIndex);
          const target = targetsBuffer.element(TSL.instanceIndex);
          const uploadedTarget = targetsUploadBuffer.element(TSL.instanceIndex);
          target.assign(uploadedTarget);

          // Start directly at target positions with a subtle organic jitter
          // so "404" is instantly readable from frame 0
          const jitter = TSL.vec3(
            TSL.hash(TSL.instanceIndex),
            TSL.hash(TSL.instanceIndex.add(12).mul(2)),
            TSL.hash(TSL.instanceIndex.add(23).mul(3))
          ).sub(0.5).mul(0.3);

          position.assign(uploadedTarget.add(jitter));
        })().compute(particleCount);

        renderer.compute(uploadTargetsCompute);

        // Physics Update compute (matching reference project structure)
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

          // 2. Attraction towards target 404 position
          const toTarget = aTarget.sub(aPosition);
          const targetDist = toTarget.length();
          const targetDir = toTarget.div(targetDist.max(TSL.EPSILON));
          const gravityVelocity = targetDir
            .mul(targetDist.min(2.0))
            .mul(gravityStrength)
            .mul(clampedDeltaTime);
          aVelocity.addAssign(gravityVelocity);

          // 3. Sphere collision
          TSL.Loop(
            { start: TSL.instanceIndex.add(1), end: particleCount, condition: '<', name: 'i' },
            ({ i }: any) => {
              const bPosition = positionsBuffer.element(i);
              const bVelocity = velocitiesBuffer.element(i);
              const bHeat = heatBuffer.element(i);

              const delta = bPosition.sub(aPosition);
              const distance = delta.length();
              const direction = delta.div(distance.max(TSL.EPSILON));

              const radius2 = radius.mul(2);
              TSL.If(distance.lessThan(radius2), () => {
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

          // 4. Apply velocity
          aPosition.addAssign(aVelocity);

          // 5. Velocity damping
          aVelocity.mulAssign(generalDamping.mul(clampedDeltaTime).oneMinus());

          // 6. Heat damping
          aHeat.mulAssign(heatDamping.mul(clampedDeltaTime).oneMinus());
        })().compute(particleCount);

        // Geometry & Material (matching reference)
        const geometry = new THREE_WEBGPU.IcosahedronGeometry(1, 2);
        const material = new THREE_WEBGPU.MeshLambertNodeMaterial({ color: 0xffffff });

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

        // Raycasting
        const intersect = new THREE_WEBGPU.Vector3();

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

          controls.update();

          if (cursor.x !== 999) {
            raycaster.setFromCamera(cursor, camera);
            const planeNormal = camera.position.clone().normalize();
            const plane = new THREE_WEBGPU.Plane(planeNormal, 0);

            if (raycaster.ray.intersectPlane(plane, intersect)) {
              cursorVelocity.value.copy(intersect).sub(cursorPosition.value);
              cursorPosition.value.copy(intersect);
            }
          }

          renderer.compute(updateCompute);
          renderPipeline.render();
        });

        return () => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerleave', onPointerLeave);
          window.removeEventListener('resize', onResize);
          renderer.setAnimationLoop(null);
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
      function initWebGLFallbackMode(
        parent: HTMLDivElement,
        particleCount: number,
        sRadius: number,
        targets: Float32Array
      ): () => void {
        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.outline = 'none';
        parent.appendChild(canvas);

        const scene = new THREE.Scene();
        const isMobile = width < 768;
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0, isMobile ? 22 : 16);

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
        });
        renderer.toneMapping = THREE.CineonToneMapping;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x252028);

        // Lights matching reference
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
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

        const ambientLight = new THREE.AmbientLight(0xe8b8ff, 0.08);
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

        // CPU Arrays
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        const heat = new Float32Array(particleCount);

        pos.set(targets);

        const dummy = new THREE.Object3D();
        const baseColor = new THREE.Color(0xd4d4d8);
        const emissiveFire = new THREE.Color(0xff3f0f);
        const currentColor = new THREE.Color();

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

        let animationFrameId: number;
        let lastTime = performance.now();

        const tick = () => {
          if (isDisposed) return;

          const now = performance.now();
          const dt = Math.min((now - lastTime) / 1000, 1 / 30);
          lastTime = now;

          if (cursor.x !== 999) {
            raycaster.setFromCamera(cursor, camera);
            const plane = new THREE.Plane(camera.position.clone().normalize(), 0);
            const hit = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(plane, hit)) {
              cursorVel.copy(hit).sub(prevCursorWorld);
              cursorWorld.copy(hit);
              prevCursorWorld.copy(hit);
            }
          }

          const cRadSq = 1.75 * 1.75;
          const damp = Math.max(0, 1 - 0.4 * dt);
          const hDamp = Math.max(0, 1 - 3.0 * dt);

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

            vel[idx + 0] += (dx / dist) * Math.min(dist, 2.0) * 0.04 * dt;
            vel[idx + 1] += (dy / dist) * Math.min(dist, 2.0) * 0.04 * dt;
            vel[idx + 2] += (dz / dist) * Math.min(dist, 2.0) * 0.04 * dt;

            // Cursor push
            if (cursorWorld.x !== 999) {
              const cdx = px - cursorWorld.x;
              const cdy = py - cursorWorld.y;
              const cdz = pz - cursorWorld.z;
              const cDistSq = cdx * cdx + cdy * cdy + cdz * cdz;

              if (cDistSq < cRadSq) {
                const cDist = Math.sqrt(cDistSq);
                const ratio = 1 - cDist / 1.75;
                vel[idx + 0] += cursorVel.x * ratio * 0.05;
                vel[idx + 1] += cursorVel.y * ratio * 0.05;
                vel[idx + 2] += cursorVel.z * ratio * 0.05;
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

            dummy.position.set(pos[idx + 0], pos[idx + 1], pos[idx + 2]);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);

            // Interpolate color with heat
            currentColor.copy(baseColor).lerp(emissiveFire, Math.min(heat[i], 1.0));
            instancedMesh.setColorAt(i, currentColor);
          }

          instancedMesh.instanceMatrix.needsUpdate = true;
          if (instancedMesh.instanceColor) {
            instancedMesh.instanceColor.needsUpdate = true;
          }

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);

        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerleave', onPointerLeave);
          window.removeEventListener('resize', onResize);
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
    }, []);

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden select-none bg-[#252028] ${className}`}
      />
    );
  }
);

SphereParticles404.displayName = 'SphereParticles404';
export default SphereParticles404;
