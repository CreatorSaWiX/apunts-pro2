import type { Solution } from '../../../solutions';

export const ex6_11: Solution = {
  id: 'M2-T6-Ex11',
  title: 'Exercici 11: Àrea en el quart quadrant',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu l'àrea de la regió del quart quadrant limitada per la corba $y = (x^2 - x)e^{-x}$ i el semieix positiu d'abscisses.`,
  content: `
Per calcular l'àrea de la regió en el quart quadrant ($x > 0, y < 0$), primer hem de trobar els punts d'intersecció amb l'eix d'abscisses.

### 1) Punts d'intersecció i anàlisi de signe

Busquem on $y = 0$:
$(x^2 - x)e^{-x} = 0 \\implies x(x - 1)e^{-x} = 0$
Atès que $e^{-x} \\neq 0$ sempre, les arrels són $x = 0$ i $x = 1$.

En l'interval $(0, 1)$:
Si agafem $x = 0.5$, $y = (0.25 - 0.5)e^{-0.5} = -0.25 e^{-0.5}$, que és **negatiu**.
Per tant, la corba es troba efectivament en el quart quadrant entre $x=0$ i $x=1$.

---

### 2) Càlcul de la integral

L'àrea $A$ és la integral de la funció canviada de signe (perquè $y < 0$):
$A = \\int_{0}^{1} - (x^2 - x)e^{-x} \\, dx = \\int_{0}^{1} (x - x^2)e^{-x} \\, dx$

Primer trobem la primitiva integrant per parts dues vegades (o utilitzant el mètode de les derivades successives per a $P(x)e^{ax}$):
Hi ha una fórmula general: $\\int (ax^2+bx+c)e^{rx} \\, dx = \\left( \\frac{ax^2+bx+c}{r} - \\frac{2ax+b}{r^2} + \\frac{2a}{r^3} \\right) e^{rx}$

En el nostre cas per $\\int (x^2 - x)e^{-x} \\, dx$: $a=1, b=-1, c=0, r=-1$.
$F(x) = \\left( \\frac{x^2-x}{-1} - \\frac{2x-1}{1} + \\frac{2}{-1} \\right) e^{-x}$
$F(x) = (-x^2 + x - 2x + 1 - 2) e^{-x} = (-x^2 - x - 1) e^{-x}$

Comprovem la derivada:
$F'(x) = (-2x - 1)e^{-x} - (-x^2 - x - 1)e^{-x} = (-2x - 1 + x^2 + x + 1) e^{-x} = (x^2 - x) e^{-x}$ (Correcte)

---

### 3) Aplicació de la Regla de Barrow

L'àrea és:
$A = - [F(x)]_0^1 = - [ (-x^2 - x - 1) e^{-x} ]_0^1 = [ (x^2 + x + 1) e^{-x} ]_0^1$
$A = (1^2 + 1 + 1)e^{-1} - (0^2 + 0 + 1)e^{-0}$
$A = 3e^{-1} - 1$

L'àrea final és:
$\\mathbf{A = \\frac{3}{e} - 1}$ unitats d'àrea.

*(Valor aproximat: $1.1036 - 1 = 0.1036$)*
`,
  availableLanguages: ['ca']
};
