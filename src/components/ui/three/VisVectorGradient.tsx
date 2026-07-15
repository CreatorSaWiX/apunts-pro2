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



const VisVectorGradient = () => {
    const f = (x: number, y: number) => 3 * Math.sin(0.3 * x) * Math.cos(0.3 * y);

    // Memoize the arrows to avoid creating thousands of Three.js objects on every render
    const arrows = useMemo(() => {
        return [[-3, -3], [0, 0], [3, 0], [0, 3]].map(([px, py]) => {
            const z = f(px, py);
            const gx = 3 * 0.3 * Math.cos(0.3 * px) * Math.cos(0.3 * py);
            const gy = -3 * 0.3 * Math.sin(0.3 * px) * Math.sin(0.3 * py);
            const dir = new THREE.Vector3(gx, 0, gy).normalize();
            return {
                position: [px, z, py] as [number, number, number],
                helper: new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 1.5, "#ff4400", 0.3, 0.2)
            };
        });
    }, []);

    return (
        <group>
            <FunctionSurface f={f} />
            {arrows.map((arrow, i) => (
                <group key={i} position={arrow.position}>
                    <primitive object={arrow.helper} />
                    <Point position={[0, 0, 0]} color="white" />
                </group>
            ))}
            <Text position={[0, 4, 0]} color="white" fontSize={0.5} textAlign="center">
                Camps de Vectors: El Gradient (∇f)
            </Text>
        </group>
    );
};


export default VisVectorGradient;
