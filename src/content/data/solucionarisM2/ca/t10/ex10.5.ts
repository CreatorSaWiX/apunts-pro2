import type { Solution } from '../../../solutions';

export const ex10_5: Solution = {
  id: 'M2-T10-Ex5',
  title: 'Exercici 5: Aplicació (Alarma Tèrmica)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `La temperatura en graus centígrads d'una placa en un punt qualsevol $(x,y)$ s'obté a partir de la funció $T(x,y) = 25 + 4x^2 - 4xy + y^2$. Una alarma tèrmica situada sobre els punts de la circumferència $x^2 + y^2 = 25$, es dispara quan la temperatura es superior a 180 graus o inferior a 20 graus. Es dispararà aquesta alarma?`,
  content: `Per saber si l'alarma es dispararà, hem de trobar els valors màxim i mínim de la temperatura $T(x,y)$ sobre la circumferència de radi 5.

### 1. Simplificació de la funció
Observem que la funció de temperatura es pot expressar com un quadrat perfecte:
$$T(x,y) = 25 + (2x - y)^2$$
Aquesta forma ens indica directament que el valor mínim de la funció és 25, sempre que existeixi algun punt de la circumferència que compleixi $2x - y = 0$.

### 2. Càlcul dels extrems condicionats
Usem Lagrange amb $g(x,y) = x^2 + y^2 - 25 = 0$:
$$\\nabla T = (8x - 4y, -4x + 2y), \\quad \\nabla g = (2x, 2y)$$
El sistema $\\nabla T = \\lambda \\nabla g$ ens dóna:
1. $4x - 2y = \\lambda x$
2. $-2x + y = \\lambda y \\implies y(1-\\lambda) = 2x$

Substituint (2) en (1):
$4x - 2\\left(\\frac{2x}{1-\\lambda}\\right) = \\lambda x \\implies 4 - \\frac{4}{1-\\lambda} = \\lambda \\quad (\\text{si } x \\neq 0)$
$4(1-\\lambda) - 4 = \\lambda(1-\\lambda) \\implies -4\\lambda = \\lambda - \\lambda^2 \\implies \\lambda^2 - 5\\lambda = 0$

Tenim dos casos per a $\\lambda$:
- **Cas $\\lambda = 0$**: Llavors $y = 2x$. Substituint a $x^2 + y^2 = 25$ obtenim $5x^2 = 25 \\implies x = \\pm \\sqrt{5}$. 
  En aquests punts, $2x-y = 0$, per tant **$T = 25$**.
- **Cas $\\lambda = 5$**: Llavors $y(1-5) = 2x \\implies x = -2y$. Substituint a $x^2 + y^2 = 25$ obtenim $5y^2 = 25 \\implies y = \\pm \\sqrt{5}$.
  En aquests punts, $(2x-y)^2 = (2(\\mp 2\\sqrt{5}) - (\\pm \\sqrt{5}))^2 = (-5\\sqrt{5})^2 = 125$.
  Per tant, $T = 25 + 125 = **150$**.

### 3. Conclusió
La temperatura sobre la circumferència oscil·la entre un mínim de **25 °C** i un màxim de **150 °C**.
- Com que $150 < 180$, la temperatura mai supera el llindar superior.
- Com que $25 > 20$, la temperatura mai baixa del llindar inferior.

**Resposta**: No, l'alarma no es dispararà.`,
  availableLanguages: ['ca']
};
