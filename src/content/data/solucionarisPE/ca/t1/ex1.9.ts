import type { Solution } from '../../../solutions';

export const ex1_9: Solution = {
  id: 'PE-T1-Ex1.9',
  title: 'Exercici 1.9: Variable aleatòria discreta: nombre de cares en 3 monedes',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `En l'experiència aleatòria de llençar una moneda equilibrada tres cops de manera independent, definim la variable aleatòria discreta:
$$X = \\text{"nombre de cares obtingudes"}$$

### Qüestions:
1. Relacioneu els $8$ esdeveniments elementals de l'arbre de probabilitats $\\Omega = \\{\\omega_1, \\dots, \\omega_8\\}$ amb els valors corresponents de la variable aleatòria $X$.
2. Determineu la funció de probabilitat o de massa $p_X(k) = P(X = k)$ i la funció de distribució acumulada $F_X(k) = P(X \\leq k)$.
3. Calculeu mitjançant la variable aleatòria:
   - $P(A)$ per a $A = \\text{"obtenir exactament dues cares"}$.
   - $P(B)$ per a $B = \\text{"obtenir almenys dues cares"}$, emprant tant $p_X$ com $F_X$.
4. Calculeu l'esperança matemàtica $E[X]$ i la variància $V[X]$ de la variable.
5. Quina diferència conceptual existeix entre l'esperança matemàtica d'una variable aleatòria i la mitjana mostral $\\overline{X}$ d'un experiment repetit? Pot variar l'esperança teòrica?`,
  content: `## 1. Mapatge entre l'espai mostral i la variable aleatòria $X$

Una variable aleatòria és una funció $X: \\Omega \\to \\mathbb{R}$ que assigna un nombre real a cada esdeveniment elemental $\\omega \\in \\Omega$:

| Resultat $\\omega_i$ | Seqüència | $P(\\omega_i)$ | Valor de $X$ ($n^\\circ$ cares) |
| :---: | :---: | :---: | :---: |
| $\\omega_1$ | $ccc$ | $1/8$ | $X = 3$ |
| $\\omega_2$ | $cc+$ | $1/8$ | $X = 2$ |
| $\\omega_3$ | $c+c$ | $1/8$ | $X = 2$ |
| $\\omega_4$ | $c++$ | $1/8$ | $X = 1$ |
| $\\omega_5$ | $+cc$ | $1/8$ | $X = 2$ |
| $\\omega_6$ | $+c+$ | $1/8$ | $X = 1$ |
| $\\omega_7$ | $++c$ | $1/8$ | $X = 1$ |
| $\\omega_8$ | $+++$ | $1/8$ | $X = 0$ |

El recorregut de la variable és $\\Omega_X = \\{0, 1, 2, 3\\}$.

---

## 2. Funció de probabilitat i de distribució acumulada

Agrupant els esdeveniments elementals segons el valor de $X$:
- $p_X(0) = P(X = 0) = P(\\omega_8) = \\frac{1}{8}$
- $p_X(1) = P(X = 1) = P(\\{\\omega_4, \\omega_6, \\omega_7\\}) = \\frac{3}{8}$
- $p_X(2) = P(X = 2) = P(\\{\\omega_2, \\omega_3, \\omega_5\\}) = \\frac{3}{8}$
- $p_X(3) = P(X = 3) = P(\\omega_1) = \\frac{1}{8}$

*(Aquesta distribució correspon a una distribució Binomial $X \\sim \\text{Bin}(n=3, p=0.5)$).*

### Taula de probabilitat i funció de distribució:
| $k$ | $p_X(k) = P(X = k)$ | $F_X(k) = P(X \\leq k)$ |
| :---: | :---: | :---: |
| **0** | $1/8 = 0.125$ | $1/8 = 0.125$ |
| **1** | $3/8 = 0.375$ | $4/8 = 0.500$ |
| **2** | $3/8 = 0.375$ | $7/8 = 0.875$ |
| **3** | $1/8 = 0.125$ | $8/8 = 1.000$ |

---

## 3. Càlcul de probabilitats d'esdeveniments

### Esdeveniment $A = \\text{"obtenir dues cares"}$
$$
P(A) = P(X = 2) = p_X(2) = \\frac{3}{8} = 0.375 \\quad (37.5\\%)
$$

### Esdeveniment $B = \\text{"obtenir almenys dues cares"}$ ($X \\geq 2$)
Podem calcular-ho de dues maneres equivalents:
1. **Sumant la funció de massa**:
$$
P(X \\geq 2) = p_X(2) + p_X(3) = \\frac{3}{8} + \\frac{1}{8} = \\frac{4}{8} = \\frac{1}{2} = 0.50
$$
2. **Mitjançant la funció de distribució acumulada $F_X$**:
$$
P(X \\geq 2) = 1 - P(X < 2) = 1 - P(X \\leq 1) = 1 - F_X(1)
$$
$$
P(X \\geq 2) = 1 - \\frac{4}{8} = \\frac{4}{8} = 0.50
$$

---

## 4. Càlcul d'esperança i variància

### Esperança matemàtica ($E[X]$ o $\\mu$)
L'esperança és la mitjana ponderada dels valors possibles segons la seva probabilitat:
$$
E[X] = \\sum_{k=0}^3 k \\cdot p_X(k)
$$
$$
E[X] = 0 \\cdot \\frac{1}{8} + 1 \\cdot \\frac{3}{8} + 2 \\cdot \\frac{3}{8} + 3 \\cdot \\frac{1}{8} = \\frac{0 + 3 + 6 + 3}{8} = \\frac{12}{8} = 1.5
$$
*(En una distribució Binomial: $E[X] = n \\cdot p = 3 \\times 0.5 = 1.5$).*

---

### Variància ($V[X]$ o $\\sigma^2$)
#### Mètode 1: Aplicant la definició directa $\\sum (k - \\mu)^2 p_X(k)$
$$
V[X] = (0 - 1.5)^2 \\cdot \\frac{1}{8} + (1 - 1.5)^2 \\cdot \\frac{3}{8} + (2 - 1.5)^2 \\cdot \\frac{3}{8} + (3 - 1.5)^2 \\cdot \\frac{1}{8}
$$
$$
V[X] = 2.25 \\cdot \\frac{1}{8} + 0.25 \\cdot \\frac{3}{8} + 0.25 \\cdot \\frac{3}{8} + 2.25 \\cdot \\frac{1}{8} = \\frac{2.25 + 0.75 + 0.75 + 2.25}{8} = \\frac{6}{8} = 0.75
$$

#### Mètode 2: Fórmula abreujada de Steiner $V[X] = E[X^2] - (E[X])^2$
$$
E[X^2] = \\sum_{k=0}^3 k^2 \\cdot p_X(k) = 0^2 \\cdot \\frac{1}{8} + 1^2 \\cdot \\frac{3}{8} + 2^2 \\cdot \\frac{3}{8} + 3^2 \\cdot \\frac{1}{8} = \\frac{0 + 3 + 12 + 9}{8} = \\frac{24}{8} = 3
$$
$$
V[X] = 3 - (1.5)^2 = 3 - 2.25 = 0.75
$$
*(Per a una Binomial: $V[X] = n \\cdot p \\cdot (1 - p) = 3 \\times 0.5 \\times 0.5 = 0.75$).*

La desviació estàndard és $\\sigma = \\sqrt{0.75} \\approx 0.866$.

---

## 5. Esperança teòrica vs. Mitjana mostral

> **Distinció clau**:
> - **Esperança matemàtica $E[X]$**: És una propietat intrínseca del model probabilístic de la població. És una **constant fixa** ($E[X] = 1.5$) que no depèn de cap mostra ni d'experiments físics.
> - **Mitjana mostral $\\overline{X}$**: És un indicador estadístic calculat a partir de les observacions d'una mostra finita de dades:
>   $$\\overline{X} = \\frac{1}{N} \\sum_{i=1}^N x_i$$
>   La mitjana mostral és ella mateixa una variable aleatòria: varia d'una mostra a una altra (per exemple, un voluntari que fa 8 tandes pot obtenir una mitjana de $1.375$ cares i un altre voluntari $2.125$ cares).
> - **Conclusió**: **La mitjana mostral pot variar; l'esperança no**.`
};
