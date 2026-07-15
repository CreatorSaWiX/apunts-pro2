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



const VisTaylor3d = () => {
    const f = (x: number, y: number) => Math.cos(x / 2) * Math.sin(y / 2) * 2;
    const p1 = (_: number, y: number) => y * 0.5;

    return (
        <>
            <FunctionSurface f={f} showWireframe />
            <group position={[0, 0.1, 0]}>
                <FunctionSurface f={p1} showWireframe colorScale={3} />
            </group>
            <Text position={[0, 4, 0]} color="white" fontSize={0.4} textAlign="center">
                Aproximació de Taylor: Superfície vs Pla Tangent
            </Text>
        </>
    );
};



export default VisTaylor3d;
