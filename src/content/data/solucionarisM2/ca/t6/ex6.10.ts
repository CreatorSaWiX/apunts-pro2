import type { Solution } from '../../../solutions';

export const ex6_10: Solution = {
  id: 'M2-T6-Ex10',
  title: 'Exercici 10: Àrea entre corbes i eix d\'abscisses',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Calculeu l'àrea de la regió tancada determinada per l'eix d'abscisses, les corbes $y = e^x$ i $y = e^{-x}$ i les rectes $x = 2$ i $x = -2$.`,
  content: `
Per calcular l'àrea d'aquesta regió, primer hem d'analitzar com es comporten les corbes en l'interval $[-2, 2]$.

### 1) Anàlisi de les funcions

Les corbes $y = e^x$ i $y = e^{-x}$ s'intersequen quan:
$e^x = e^{-x} \\implies x = -x \\implies 2x = 0 \\implies x = 0$

L'àrea demanada està tancada per l'eix d'abscisses ($y = 0$) i les dues corbes. Perquè la regió estigui realment "tancada" per ambdues corbes i l'eix, hem d'integrar sota la corba que queda més a prop de l'eix $x$ (la "inferior" de les dues corbes positives):

- En l'interval $[-2, 0]$: La funció "més baixa" és $y = e^x$ (per exemple, $e^{-1} \\approx 0.36 < e^{1} \\approx 2.71$ no, espera).
  *Correcció:* En $x = -1$, $e^{-1} \\approx 0.36$ i $e^1 \\approx 2.71$. La funció que queda sota és $e^x$ (ja que $e^{-1} < e^1$ és fals, $e^{-1}$ és $1/e$).
  Vegem: a l'esquerra de zero ($x < 0$), $e^x < 1$ i $e^{-x} > 1$. Per tant, $e^x$ és la que tanca la regió amb l'eix.
- En l'interval $[0, 2]$: Per a $x > 0$, $e^{-x} < 1$ i $e^x > 1$. Per tant, $e^{-x}$ és la que tanca la regió.

---

### 2) Càlcul de la integral

L'àrea total $A$ és la suma de dues integrals:
$A = \\int_{-2}^{0} e^x \\, dx + \\int_{0}^{2} e^{-x} \\, dx$

Aprofitant la simetria de les funcions respecte a l'eix $y$:
$A = 2 \\int_{0}^{2} e^{-x} \\, dx$

Calculem la integral definida:
$A = 2 \\left[ -e^{-x} \\right]_0^2 = 2 ( -e^{-2} - (-e^0) )$
$A = 2 ( -e^{-2} + 1 ) = 2 ( 1 - \\frac{1}{e^2} )$

L'àrea final és:
$\\mathbf{A = 2 - 2e^{-2}}$ unitats d'àrea.

*(Valor aproximat: $2 - 2(0.1353) \\approx 1.7294$)*
`,
  availableLanguages: ['ca']
};
