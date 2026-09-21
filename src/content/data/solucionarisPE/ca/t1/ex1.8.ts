import type { Solution } from '../../../solutions';

export const ex1_8: Solution = {
  id: 'PE-T1-Ex1.8',
  title: 'Exercici 1.8: Memòria cau i models de fiabilitat de sistemes',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `### Part 1: Conflicte d'accessos en memòria cau multi-banc
Alguns processadors utilitzen una arquitectura de memòria cau (*cache*) on la memòria està distribuïda físicament en **quatre bancs independents** ($B_1, B_2, B_3, B_4$).
Aquests processadors són capaços d'atendre dos accessos a memòria simultàniament, sempre que no hagin d'accedir al mateix banc alhora (en cas contrari es produeix un **conflicte de banc**).

1. **Cas Independent i Uniforme**: Suposem que no hi ha cap relació entre el banc sol·licitat pel primer accés i el del segon, i que els quatre bancs són equiprobables ($P(B_i) = 1/4$). Calculeu la probabilitat de conflicte.
2. **Cas amb Dependència (Propensió seqüencial)**: A la pràctica, el comportament del codi presenta localitat espacial, amb una certa propensió a accedir al banc següent en el segon accés. La matriu de probabilitats conjuntes és:

| Accés #1 \\ Accés #2 | $B_1$ | $B_2$ | $B_3$ | $B_4$ |
| :---: | :---: | :---: | :---: | :---: |
| **$B_1$** | $0.05$ | $0.10$ | $0.05$ | $0.05$ |
| **$B_2$** | $0.05$ | $0.05$ | $0.10$ | $0.05$ |
| **$B_3$** | $0.05$ | $0.05$ | $0.05$ | $0.10$ |
| **$B_4$** | $0.10$ | $0.05$ | $0.05$ | $0.05$ |

Calculeu la probabilitat de conflicte sota aquest model més realista.

### Part 2: Aplicacions de la probabilitat a l'Enginyeria Informàtica
Expliqueu com es modela formalment la probabilitat en:
1. **Diagnòstic de fallades de maquinari (*Hardware Fault Diagnosis*)** mitjançant la regla de Bayes.
2. **Fiabilitat de sistemes (*System Reliability*)**: deduïu les fórmules de fiabilitat per a sistemes de $n$ components independents connectats en **sèrie** i en **paral·lel**.`,
  content: `## 1. Probabilitat de conflicte a la memòria cau

Un conflicte es produeix si i només si ambdós accessos concurrents demanen el mateix banc de memòria. L'esdeveniment conflicte és:
$$
C = \\bigcup_{i=1}^4 \\{A_1 = B_i \\cap A_2 = B_i\\}
$$
Com que els accessos a diferents bancs són mútuament excloents:
$$
P(C) = \\sum_{i=1}^4 P(A_1 = B_i \\cap A_2 = B_i)
$$

---

### 1.1. Cas d'independència i equiprobabilitat
- Per a cada accés $k \\in \\{1, 2\\}$, la probabilitat d'adreçar-se al banc $B_i$ és $P(A_k = B_i) = \\frac{1}{4}$.
- Per independència:
$$
P(A_1 = B_i \\cap A_2 = B_i) = P(A_1 = B_i) \\cdot P(A_2 = B_i) = \\frac{1}{4} \\times \\frac{1}{4} = \\frac{1}{16}
$$
- Com que hi ha 4 bancs possibles (la diagonal principal d'una matriu $4 \\times 4$ equiprobable):
$$
P(\\text{Conflicte}) = 4 \\times \\frac{1}{16} = \\frac{4}{16} = \\frac{1}{4} = 0.25 \\quad (25\\%)
$$

---

### 1.2. Cas amb dependència (matriu de propensió)
Observem la diagonal principal de la matriu de probabilitats conjuntes, on ambdós accessos coincideixen ($A_1 = A_2$):
- $P(A_1 = B_1 \\cap A_2 = B_1) = 0.05$
- $P(A_1 = B_2 \\cap A_2 = B_2) = 0.05$
- $P(A_1 = B_3 \\cap A_2 = B_3) = 0.05$
- $P(A_1 = B_4 \\cap A_2 = B_4) = 0.05$

Sumem les probabilitats de la diagonal:
$$
P(\\text{Conflicte}) = 0.05 + 0.05 + 0.05 + 0.05 = 0.20 \\quad (20\\%)
$$

> **Conclusió**: Gràcies a la propensió a accedir al següent banc cíclic ($P(\\text{següent banc}) = 0.10$ fora de la diagonal), la taxa de conflictes disminueix del $25\\%$ al $20\\%$, augmentant el rendiment efectiu del processador.

---

## 2. Aplicacions avançades de la probabilitat

### 2.1. Diagnòstic de fallades de maquinari (*Bayesian Fault Diagnosis*)
Quan un sistema informàtic manifesta un error o fallada $F$, volem saber quina de les múltiples causes potencials $A_1, A_2, \\dots, A_k$ ha estat la responsable.
Coneixent:
- Les taxes a priori de cada avaria: $P(A_i)$
- La probabilitat que l'avaria $A_i$ desencadeni el símptoma $F$: $P(F \\mid A_i)$

Apliquem el Teorema de Bayes per calcular la probabilitat a posteriori:
$$
P(A_i \\mid F) = \\frac{P(A_i) \\cdot P(F \\mid A_i)}{\\sum_{j=1}^k P(A_j) \\cdot P(F \\mid A_j)}
$$
El component amb $\\max_{i} P(A_i \\mid F)$ serà diagnosticat com el causant més probable de l'avaria. Aquest és també el principi subjacent del classificador **Naive Bayes** en Machine Learning.

---

### 2.2. Fiabilitat de sistemes (*System Reliability*)

Sigui un sistema amb $n$ components independents on cadascun funciona amb probabilitat $p_i = P(C_i \\text{ funciona})$.

#### A. Sistema en Sèrie (Sense redundància)
El sistema funciona si i només si **tots** els components funcionen simultàniament:
$$
R_{\\text{sèrie}} = P\\left(\\bigcap_{i=1}^n C_i\\right) = \\prod_{i=1}^n P(C_i) = \\prod_{i=1}^n p_i
$$
*(La fiabilitat global és estrictament inferior a la fiabilitat del component més feble).*

#### B. Sistema en Paral·lel (Amb redundància total)
El sistema funciona sempre que **com a mínim un** component continuï operatiu. Només falla si fallen tots alhora:
$$
P(\\text{Falla sistema}) = \\prod_{i=1}^n P(\\neg C_i) = \\prod_{i=1}^n (1 - p_i)
$$
Per tant, la fiabilitat del sistema paral·lel és:
$$
R_{\\text{paral·lel}} = 1 - \\prod_{i=1}^n (1 - p_i)
$$
*(La fiabilitat d'un sistema redundant en paral·lel és superior a la de qualsevol dels components individuals).*`
};
