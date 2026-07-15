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



const VisPuntsSella = () => {
    const f = (x: number, y: number) => (x * x - y * y) * 0.1;
    return (
        <>
            <FunctionSurface f={f} />
            <Text position={[0, 2, 0]} color="white" fontSize={0.5} maxWidth={200} textAlign="center">
                Punt de Sella (f(x,y) = x² - y²)
            </Text>
        </>
    );
};


export default VisPuntsSella;
