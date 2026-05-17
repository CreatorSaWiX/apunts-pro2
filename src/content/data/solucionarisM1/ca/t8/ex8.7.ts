import type { Solution } from '../../../solutions';

export const ex8_7: Solution = {
  id: 'M1-T8-Ex8.7',
  title: 'Exercici 8.7: Bijectivitat i valor propi zero',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $E$ un $\\mathbb{R}$-espai vectorial i $f$ un endomorfisme de $E$. Demostreu que $f$ és bijectiu si i només si 0 no és valor propi d'$f$.`,
  content: `Volem demostrar la doble implicació: **$f$ bijectiu $\\iff 0$ no és valor propi**. Recordem que un endomorfisme en un espai de dimensió finita és bijectiu si i només si és injectiu ($\\ker(f) = \\{\\vec{0}\\}$).

### $\\implies$) Si $f$ és bijectiu, llavors 0 no és valor propi
1. Suposem que $f$ és bijectiu. Per tant, $f$ és injectiu.
2. Per definició d'injectivitat, l'únic vector que va a parar al zero és el propi vector zero: $\\ker(f) = \\{\\vec{0}\\}$.
3. Un escalar $\\lambda$ és un valor propi si existeix un vector $u \\neq \\vec{0}$ tal que $f(u) = \\lambda u$.
4. Si $\\lambda = 0$ fos valor propi, existiria un $u \\neq \\vec{0}$ tal que $f(u) = 0 \\cdot u = \\vec{0}$.
5. Però això voldria dir que $u \\in \\ker(f)$, contradient que $\\ker(f) = \\{\\vec{0}\\}$.
6. Per tant, 0 no pot ser valor propi.

### $\\impliedby$) Si 0 no és valor propi, llavors $f$ és bijectiu
1. Suposem que 0 no és valor propi d'$f$.
2. Això vol dir que **no existeix** cap vector $u \\neq \\vec{0}$ tal que $f(u) = 0 \\cdot u = \\vec{0}$.
3. Dit d'una altra manera, si $f(u) = \\vec{0}$, llavors necessàriament $u = \\vec{0}$.
4. Això és precisament la definició de que el nucli és trivial: $\\ker(f) = \\{\\vec{0}\\}$.
5. Si el nucli és trivial, $f$ és injectiu.
6. En espais de dimensió finita, un endomorfisme injectiu és automàticament bijectiu (pel teorema de la dimensió: $\\dim E = \\dim \\ker f + \\dim \\text{Im } f$).

Així queda demostrada la bijectivitat.
`,
  availableLanguages: ['ca']
};
