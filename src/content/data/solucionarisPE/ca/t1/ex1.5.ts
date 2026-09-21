import type { Solution } from '../../../solutions';

export const ex1_5: Solution = {
  id: 'PE-T1-Ex1.5',
  title: 'Exercici 1.5: Llançament de 3 monedes i espai mostral equiprobable',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Estudiarem l'experiència aleatòria de **llençar una moneda equilibrada tres vegades** consecutives de manera independent.

Abans de dur a terme cap realització física de l'experiment i basant-nos en les propietats teòriques de l'atzar:

1. Construïu l'arbre complet de probabilitats de l'experiment i descriviu cadascun dels esdeveniments elementals $\\omega_i$ que componen l'espai mostral $\\Omega$.
2. Calculeu la probabilitat teòrica de cada esdeveniment elemental justificant per què tots són equiprobables.
3. Calculeu $P(A)$ per a l'esdeveniment $A = \\text{"obtenir exactament dues cares"}$.
4. Calculeu $P(B)$ per a l'esdeveniment $B = \\text{"obtenir almenys dues cares"}$.
5. Si repetim l'experiment $1000$ vegades, què podem esperar de les freqüències relatives observades? Quina diferència hi ha entre la probabilitat teòrica i la mitjana o freqüència mostral?`,
  content: `## 1. Arbre de probabilitats i espai mostral ($\\Omega$)

Com que la moneda és equilibrada, a cada tirada la probabilitat d'obtenir cara ($c$) o creu ($+$) és idèntica:
$$
P(c) = 0.5, \\quad P(+) = 0.5
$$

A més, els llançaments successius són físicament **independents**. Per tant, la probabilitat de qualsevol seqüència de tres resultats és el producte de les probabilitats individuals:
$$
P(R_1, R_2, R_3) = P(R_1) \\cdot P(R_2) \\cdot P(R_3) = 0.5 \\times 0.5 \\times 0.5 = \\frac{1}{8} = 0.125
$$

### Esdeveniments elementals de $\\Omega$:
L'espai mostral consta de $2^3 = 8$ esdeveniments elementals equiprobables:

| Índex | Resultat (Tirades 1, 2, 3) | Nombre de Cares | Probabilitat $P(\\omega_i)$ |
| :---: | :---: | :---: | :---: |
| $\\omega_1$ | $(\\text{cara}, \\text{cara}, \\text{cara}) = ccc$ | $3$ | $1/8$ |
| $\\omega_2$ | $(\\text{cara}, \\text{cara}, \\text{creu}) = cc+$ | $2$ | $1/8$ |
| $\\omega_3$ | $(\\text{cara}, \\text{creu}, \\text{cara}) = c+c$ | $2$ | $1/8$ |
| $\\omega_4$ | $(\\text{cara}, \\text{creu}, \\text{creu}) = c++$ | $1$ | $1/8$ |
| $\\omega_5$ | $(\\text{creu}, \\text{cara}, \\text{cara}) = +cc$ | $2$ | $1/8$ |
| $\\omega_6$ | $(\\text{creu}, \\text{cara}, \\text{creu}) = +c+$ | $1$ | $1/8$ |
| $\\omega_7$ | $(\\text{creu}, \\text{creu}, \\text{cara}) = ++c$ | $1$ | $1/8$ |
| $\\omega_8$ | $(\\text{creu}, \\text{creu}, \\text{creu}) = +++$ | $0$ | $1/8$ |

Com que els $\\omega_i$ són mútuament excloents i recobreixen tot l'espai mostral:
$$
\\sum_{i=1}^8 P(\\omega_i) = 8 \\times \\frac{1}{8} = 1.00
$$

---

## 2. Càlcul de probabilitats d'esdeveniments compostos

Quan es coneixen tots els resultats elementals i les seves probabilitats, la probabilitat de qualsevol esdeveniment compost és simplement la **suma de les probabilitats dels esdeveniments elementals que el formen** (Axioma III de Kolmogórov).

### 2.1. Esdeveniment $A = \\text{"obtenir exactament 2 cares"}$
Identifiquem els camins que contenen exactament dues cares:
$$
A = \\{\\omega_2, \\omega_3, \\omega_5\\} = \\{cc+, c+c, +cc\\}
$$
Com que hi ha $3$ casos favorables:
$$
P(A) = P(\\omega_2) + P(\\omega_3) + P(\\omega_5) = \\frac{1}{8} + \\frac{1}{8} + \\frac{1}{8} = \\frac{3}{8} = 0.375 \\quad (37.5\\%)
$$

### 2.2. Esdeveniment $B = \\text{"obtenir almenys 2 cares"}$
"Almenys dues cares" significa treure $2$ cares o $3$ cares:
$$
B = \\{\\omega_1, \\omega_2, \\omega_3, \\omega_5\\} = \\{ccc, cc+, c+c, +cc\\}
$$
Com que hi ha $4$ casos favorables:
$$
P(B) = P(\\omega_1) + P(A) = \\frac{1}{8} + \\frac{3}{8} = \\frac{4}{8} = \\frac{1}{2} = 0.500 \\quad (50\\%)
$$

---

## 3. Probabilitat teòrica vs. Freqüència mostral

- **Probabilitat teòrica ($P$)**: És un valor matemàtic immutable deduït del model a priori abans de realitzar cap tirada ($P(B) = 0.5$).
- **Freqüència relativa mostral ($f_N$)**: És el valor empíric obtingut en realitzar l'experiment físicament $N$ vegades:
$$
f_N(A) = \\frac{\\text{vegades que ocorre } A}{N}
$$
- Segons la **Llei dels Grans Nombres**, a mesura que el nombre d'experiments creix cap a infinit ($N \\to \\infty$), la freqüència relativa mostral convergeix a la probabilitat teòrica:
$$
\\lim_{N \\to \\infty} P(|f_N(A) - P(A)| < \\varepsilon) = 1
$$
- En una mostra real de $1000$ tirades (com la de l'experiment amb $50$ voluntaris del tema), podem observar recomptes com $374$ cares per a $2$ cares (freqüència $0.374 \\approx 0.375$) o $130$ zeros ($0.130 \\approx 0.125$).
- **Conclusió**: La mitjana mostral varia entre diferents mostres o voluntaris; l'esperança i la probabilitat teòrica són constants fixes.`
};
