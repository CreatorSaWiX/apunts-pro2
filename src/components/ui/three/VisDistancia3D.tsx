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



const VisDistancia3D = () => {
    return (
        <>
            <Point position={[-2, 1, -2]} color="#ff4444" />
            <Point position={[3, 4, 3]} color="#ff4444" />
            <Line points={[[-2, 1, -2], [3, 4, 3]]} color="#ff8888" lineWidth={2} />
            <Text position={[0.5, 3, 0.5]} color="white" fontSize={0.4}>
                Distància en R³
            </Text>
        </>
    );
};


export default VisDistancia3D;
