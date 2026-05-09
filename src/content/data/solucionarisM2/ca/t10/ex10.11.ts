import type { Solution } from '../../../solutions';

export const ex10_11: Solution = {
  id: 'M2-T10-Ex11',
  title: 'Exercici 11: Aplicació d\'extrems condicionats (Repartiment d\'herència)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Tres germans de 40, 45 i 50 anys respectivament han de repartir-se una herència de 20.000.000 euros. La llei de successions del país diu que els impostos a pagar per cada germà són proporcionals a la seva edat i al quadrat de la quantitat rebuda.

Obteniu la part de l'herència que ha de rebre cada germà per tal que la quantitat conjunta pagada a hisenda pels tres germans sigui mínima.`,
  content: `### 1. Modelització del problema
Anomenem $x, y, z$ a les quantitats que rep cada germà. Sabem que la suma total és l'herència:
**Restricció**: $x + y + z = 20.000.000$

Els impostos de cada germà són proporcionals ($k$) a la seva edat i al quadrat de la quantitat:
*   $T_1 = k \\cdot 40 \\cdot x^2$
*   $T_2 = k \\cdot 45 \\cdot y^2$
*   $T_3 = k \\cdot 50 \\cdot z^2$

Volem minimitzar la suma total d'impostos $T = T_1 + T_2 + T_3$. Com que $k$ és una constant positiva, minimitzar $T$ equival a minimitzar la funció:
**Funció objectiu**: $f(x,y,z) = 40x^2 + 45y^2 + 50z^2$

### 2. Mètode dels Multiplicadors de Lagrange
Definim la funció de Lagrange:
$$L(x, y, z, \\lambda) = 40x^2 + 45y^2 + 50z^2 - \\lambda(x + y + z - 20.000.000)$$

Calculem les derivades parcials i igualem a zero:
1.  $\\frac{\\partial L}{\\partial x} = 80x - \\lambda = 0 \\implies x = \\frac{\\lambda}{80}$
2.  $\\frac{\\partial L}{\\partial y} = 90y - \\lambda = 0 \\implies y = \\frac{\\lambda}{90}$
3.  $\\frac{\\partial L}{\\partial z} = 100z - \\lambda = 0 \\implies z = \\frac{\\lambda}{100}$

### 3. Resolució del sistema
Substituïm $x, y, z$ en la restricció:
$$\\frac{\\lambda}{80} + \\frac{\\lambda}{90} + \\frac{\\lambda}{100} = 20.000.000$$
Busquem el mínim comú múltiple de 80, 90 i 100, que és **3600**:
$$\\lambda \\left( \\frac{45 + 40 + 36}{3600} \\right) = 20.000.000$$
$$\\lambda \\left( \\frac{121}{3600} \\right) = 20.000.000 \\implies \\lambda = \\frac{72.000.000.000}{121}$$

### 4. Càlcul de les quantitats
Ara trobem el valor de cada part:
*   **Germà de 40 anys**: $x = \\frac{\\lambda}{80} = \\frac{900.000.000}{121} \\approx \\mathbf{7.438.016,53}$ €
*   **Germà de 45 anys**: $y = \\frac{\\lambda}{90} = \\frac{800.000.000}{121} \\approx \\mathbf{6.611.570,25}$ €
*   **Germà de 50 anys**: $z = \\frac{\\lambda}{100} = \\frac{720.000.000}{121} \\approx \\mathbf{5.950.413,22}$ €

### 5. Conclusió
El germà més jove rep la part més gran de l'herència per compensar que el seu coeficient d'impostos ($40$) és el més baix, mentre que el més gran rep la part més petita ja que el seu impost creix més ràpidament ($50$). La suma de les tres parts és exactament $20.000.000$ €.`,
  availableLanguages: ['ca']
};
