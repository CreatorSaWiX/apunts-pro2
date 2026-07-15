import React, { useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { Mafs, Coordinates, Plot, Theme, LaTeX as MafsLaTeX, Circle, Polygon, MovablePoint, Line as MafsLine, Vector } from "mafs";
import { InlineMath } from 'react-katex';
import "mafs/core.css";
import { InteractionLock } from "../InteractionLock";
import { useInteraction } from '../../../contexts/InteractionContext';

interface ThreeVisualizerProps {
    type: string;
}

import { Arrow, DirectionalCurvePoints, hasWebGL, ThreeErrorBoundary, FunctionSurface, Point } from './utils3d';



const VisEx76c = () => {
    const center = new THREE.Vector3(1 / 3, 1 / 3, 1 / 3);
    const radius = Math.sqrt(2 / 3);
    const normal = new THREE.Vector3(1, 1, 1).normalize();

    return (
        <group>
            {/* Unit Sphere (Transparent) */}
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
            </mesh>

            {/* Plane x + y + z = 1 (Cutout) */}
            <mesh position={center} onUpdate={(self) => self.lookAt(center.clone().add(normal))}>
                <planeGeometry args={[4, 4]} />
                <meshStandardMaterial color="#8b5cf6" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Intersection Disk (The set C) */}
            <mesh position={center} onUpdate={(self) => self.lookAt(center.clone().add(normal))}>
                <circleGeometry args={[radius, 64]} />
                <meshStandardMaterial color="#f43f5e" side={THREE.DoubleSide} emissive="#f43f5e" emissiveIntensity={0.2} />
            </mesh>

            {/* Labels */}
            <Point position={[1, 0, 0]} color="white" />
            <Point position={[0, 1, 0]} color="white" />
            <Point position={[0, 0, 1]} color="white" />

            <Text position={[1.2, 0, 0]} color="white" fontSize={0.2}>(1,0,0)</Text>
            <Text position={[0, 1.2, 0]} color="white" fontSize={0.2}>(0,1,0)</Text>
            <Text position={[0, 0, 1.2]} color="white" fontSize={0.2}>(0,0,1)</Text>
        </group>
    );
};



export default VisEx76c;
