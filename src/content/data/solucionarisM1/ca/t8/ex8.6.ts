import type { Solution } from '../../../solutions';

export const ex8_6: Solution = {
  id: 'M1-T8-Ex8.6',
  title: 'Exercici 8.6: Propietats bàsiques dels vectors propis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $f$ un endomorfisme d'un $\\mathbb{R}$-espai vectorial $E$ i $u \\in E$ un vector propi de $f$ de valor propi $\\lambda \\in \\mathbb{R}$. Demostreu que:
1. $-u$ és un vector propi de $f$ de valor propi $\\lambda$;
2. $u$ és un vector propi de $f^2$ de valor propi $\\lambda^2$.`,
  content: `
### Demostració

Partim de la definició de vector propi: si $u$ és un vector propi de $f$ associat al valor propi $\\lambda$, llavors:
1. $u \\neq \\vec{0}$
2. $f(u) = \\lambda u$

---

#### 1) Demostració per a $-u$
Volem veure si $f(-u) = \\lambda (-u)$ i si $-u \\neq \\vec{0}$.

- Com que $f$ és un endomorfisme (aplicació lineal), es compleix que $f(\\alpha u) = \\alpha f(u)$ per a tot escalar $\\alpha$. Triant $\\alpha = -1$:
  $f(-u) = f((-1)u) = -1 \\cdot f(u)$
- Substituint la condició de vector propi $f(u) = \\lambda u$:
  $f(-u) = -1 \\cdot (\\lambda u) = \\lambda (-u)$
- Finalment, com que $u \\neq \\vec{0}$, és obvi que $-u \\neq \\vec{0}$.

Per tant, **$-u$ és un vector propi de $f$ amb valor propi $\\lambda$**.

---

#### 2) Demostració per a $f^2$ i $\\lambda^2$
Volem veure si $f^2(u) = \\lambda^2 u$.

- Per definició de composició d'aplicacions:
  $f^2(u) = (f \\circ f)(u) = f(f(u))$
- Substituïm la primera vegada $f(u) = \\lambda u$:
  $f(f(u)) = f(\\lambda u)$
- Aplicant la linealitat de $f$:
  $f(\\lambda u) = \\lambda f(u)$
- Substituïm la segona vegada $f(u) = \\lambda u$:
  $\\lambda f(u) = \\lambda (\\lambda u) = \\lambda^2 u$
- Atès que $u \\neq \\vec{0}$, es compleix la definició.

Així doncs, **$u$ és un vector propi de $f^2$ amb valor propi $\\lambda^2$**.
`,
  availableLanguages: ['ca']
};
