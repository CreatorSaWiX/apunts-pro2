import type { Solution } from '../../../solutions';

export const ex10_5: Solution = {
  id: 'M2-T10-Ex5',
  title: 'Exercici 5: Aplicació (Alarma Tèrmica)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `La temperatura en graus centígrads d'una placa en un punt qualsevol $(x,y)$ s'obté a partir de la funció $T(x,y) = 25 + 4x^2 - 4xy + y^2$. Una alarma tèrmica situada sobre els punts de la circumferència $x^2 + y^2 = 25$, es dispara quan la temperatura es superior a 180 graus o inferior a 20 graus. Es dispararà aquesta alarma?`,
  content: `Per saber si l'alarma es dispararà, hem de trobar els valors màxim i mínim de la temperatura $T(x,y)$ sobre la circumferència de radi 5 ($x^2 + y^2 = 25$).

### 1. Simplificació de la funció
Observem que la funció de temperatura es pot expressar com un quadrat perfecte:

$$
T(x,y) = 25 + 4x^2 - 4xy + y^2 = 25 + (2x - y)^2
$$

Aquesta forma ens indica que el valor mínim de la funció serà **25 °C**, que s'assolirà en els punts on $2x - y = 0$, sempre que aquests punts estiguin sobre la circumferència.

### 2. Mètode de Lagrange
Definim $f(x,y) = 25 + (2x - y)^2$ i la restricció $g(x,y) = x^2 + y^2 - 25 = 0$.
Construïm la funció de Lagrange $L(x,y,\\lambda) = f - \\lambda g$:

$$
L(x,y,\\lambda) = 25 + (2x - y)^2 - \\lambda(x^2 + y^2 - 25)
$$

Busquem els punts on el gradient és zero:
1.  $\\frac{\\partial L}{\\partial x} = 2(2x - y) \\cdot 2 - 2\\lambda x = 0 \\implies 4x - 2y = \\lambda x$
2.  $\\frac{\\partial L}{\\partial y} = 2(2x - y) \\cdot (-1) - 2\\lambda y = 0 \\implies -2x + y = \\lambda y$
3.  $x^2 + y^2 = 25$

De l'equació (2) aïllem $y$: $y(1 - \\lambda) = 2x \\implies y = \\frac{2x}{1 - \\lambda}$ (si $\\lambda \\neq 1$).

Substituïm a l'equació (1):

$$
4x - 2\\left(\\frac{2x}{1 - \\lambda}\\right) = \\lambda x \\implies 4 - \\frac{4}{1 - \\lambda} = \\lambda \\quad (\\text{dividint per } x \\neq 0)
$$

Multiplicant per $(1 - \\lambda)$:
$$
4(1 - \\lambda) - 4 = \\lambda(1 - \\lambda) \\implies 4 - 4\\lambda - 4 = \\lambda - \\lambda^2 \\implies \\mathbf{\\lambda^2 - 5\\lambda = 0}
$$

D'on obtenim **$\\lambda = 0$** o **$\\lambda = 5$**.

**Anàlisi dels casos:**
- **Cas $\\lambda = 0$**:
  De l'equació (2), $-2x + y = 0 \\implies \\mathbf{y = 2x}$.
  Substituint a la restricció: $x^2 + (2x)^2 = 25 \\implies 5x^2 = 25 \\implies x = \\pm \\sqrt{5}$.
  En aquests punts ($y=2x$), el terme $(2x-y)^2$ és zero.
  Valor: $T = 25 + 0 = \\mathbf{25}$ °C.

- **Cas $\\lambda = 5$**:
  De l'equació (2), $-2x + y = 5y \\implies -2x = 4y \\implies \\mathbf{x = -2y}$.
  Substituint a la restricció: $(-2y)^2 + y^2 = 25 \\implies 5y^2 = 25 \\implies y = \\pm \\sqrt{5}$.
  En aquests punts ($x=-2y$), el terme $(2x-y)^2$ val $(-4y-y)^2 = (-5y)^2 = 25y^2 = 25(5) = 125$.
  Valor: $T = 25 + 125 = \\mathbf{150}$ °C.

### 3. Conclusió
La temperatura sobre la circumferència oscil·la entre un mínim de **25 °C** i un màxim de **150 °C**.
- Com que el màxim (150 °C) és menor que 180 °C, l'alarma no es dispararà per excés de calor.
- Com que el mínim (25 °C) és major que 20 °C, l'alarma no es dispararà per fred.

**Resposta**: No, l'alarma no es dispararà.`,
  availableLanguages: ['ca']
};
