// Ambient type declarations for Three.js WebGPU and TSL (Three Shading Language).
// We export `any` here because WebGPU and TSL in Three.js are rapidly evolving APIs,
// and @types/three definitions for TSL contain complex recursive types that cause
// TS2590 ("Expression produces a union type that is too complex to represent")
// and omit dynamic node properties (e.g. emissiveNode, storage, etc.).

declare module 'three/webgpu' {
  const content: any;
  export = content;
}

declare module 'three/tsl' {
  const content: any;
  export = content;
}

declare module 'three/examples/jsm/tsl/display/BloomNode.js' {
  export const bloom: any;
}

