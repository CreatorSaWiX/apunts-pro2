import type { Solution } from '../../../solutions';

export const ex9_7: Solution = {
  id: 'M2-T9-Ex7',
  title: 'Exercici 7: Polinomi de Taylor amb integrals (TFC)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f: [-1,1] \\times [-1,1] \\to \\mathbb{R}$ definida per:
$$f(x,y) = 1 + x^3 + y^2 + 2 \\int_0^{3x} \\sqrt{1+t^2} dt + x \\int_0^{y^2} e^{t^2/2} dt$$
Calculeu el polinomi de Taylor de segon grau de $f$ en $(0,0)$.`,
  content: `### 1. Valor de la funció en el punt
Avaluem la funció en el punt $P(0,0)$:

$$f(0,0) = 1 + 0^3 + 0^2 + 2 \\int_0^{0} \\sqrt{1+t^2} dt + 0 \\int_0^{0} e^{t^2/2} dt = 1 + 0 + 0 + 0 + 0 = \\mathbf{1}$$

### 2. Càlcul de les derivades de primer ordre
Per derivar les funcions definides mitjançant integrals, utilitzem el **Teorema Fonamental del Càlcul (TFC)** combinat amb la regla de la cadena:

$$ \\frac{\\partial}{\\partial x_i} \\int_{u(x_i)}^{v(x_i)} f(t) dt = f(v(x_i)) \\cdot \\frac{\\partial v}{\\partial x_i} - f(u(x_i)) \\cdot \\frac{\\partial u}{\\partial x_i} $$

$$\\frac{\\partial f}{\\partial x} = 3x^2 + 0 + 2 \\left[ \\sqrt{1+(3x)^2} \\cdot 3 - 0 \\right] + \\left( 1 \\cdot \\int_0^{y^2} e^{t^2/2} dt + x \\cdot 0 \\right)$$

$$\\frac{\\partial f}{\\partial x} = 3x^2 + 6 \\sqrt{1+9x^2} + \\int_0^{y^2} e^{t^2/2} dt$$

Avaluem en $P(0,0)$: $\\frac{\\partial f}{\\partial x}(0,0) = 0 + 6\\sqrt{1} + 0 = \\mathbf{6}$

$$\\frac{\\partial f}{\\partial y} = 0 + 2y + x \\left[ e^{(y^2)^2/2} \\cdot 2y - 0 \\right] = 2y + 2xy e^{y^4/2}$$

Avaluem en $P(0,0)$: $\\frac{\\partial f}{\\partial y}(0,0) = 0 + 0 = \\mathbf{0}$

### 3. Càlcul de les derivades de segon ordre
$$\\frac{\\partial^2 f}{\\partial x^2} = 6x + 6 \\cdot \\frac{18x}{2\\sqrt{1+9x^2}} + 0$$

Avaluem en $P(0,0)$: $\\frac{\\partial^2 f}{\\partial x^2}(0,0) = 0 + 0 = \\mathbf{0}$

$$\\frac{\\partial^2 f}{\\partial y^2} = 2 + 2x e^{y^4/2} + 2xy \\cdot e^{y^4/2} \\cdot \\frac{4y^3}{2}$$

Avaluem en $P(0,0)$: $\\frac{\\partial^2 f}{\\partial y^2}(0,0) = 2 + 0 + 0 = \\mathbf{2}$

$$\\frac{\\partial^2 f}{\\partial y \\partial x} = 0 + 0 + e^{(y^2)^2/2} \\cdot 2y = 2y e^{y^4/2}$$

Avaluem en $P(0,0)$: $\\frac{\\partial^2 f}{\\partial y \\partial x}(0,0) = \\mathbf{0}$

### 4. Polinomi de Taylor de grau 2
La fórmula del polinomi de Taylor en $(0,0)$ és:

$$P_2(x,y) = 1 + 6x + 0y + \\frac{1}{2} [ 0x^2 + 2(0)xy + 2y^2 ]$$

$$P_2(x,y) = \\mathbf{1 + 6x + y^2}$$`,
  availableLanguages: ['ca']
};
