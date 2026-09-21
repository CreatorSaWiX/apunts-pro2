import type { Solution } from '../../../solutions';

export const ex1_3: Solution = {
  id: 'PE-T1-Ex1.3',
  title: "Exercici 1.3: Reconstrucció de taules de probabilitat a partir d'arbres",
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `### Part 1: Bidireccionalitat entre Arbres i Taules
Considereu dos esdeveniments $A$ i $B$ en un col·lectiu de $n = 100$ individus amb la següent distribució:
- $P(A \\cap B) = 0.20$, $P(A \\cap \\neg B) = 0.30$
- $P(\\neg A \\cap B) = 0.40$, $P(\\neg A \\cap \\neg B) = 0.10$

Mostreu com a partir d'aquesta taula es poden construir dos arbres de probabilitat diferents (primer condicionant per $A$, i després condicionant per $B$).

### Part 2: Reconstrucció d'una taula a partir d'un arbre donat
Es disposa d'un arbre de decisió per a un total de $n = 100$ observacions amb els següents paràmetres:
- $P(A) = 0.20$ i $P(\\neg A) = 0.80$.
- Donat $A$: $P(B \\mid A) = 0.25$ i $P(\\neg B \\mid A) = 0.75$.
- Donat $\\neg A$: $P(B \\mid \\neg A) = 1.00$ i $P(\\neg B \\mid \\neg A) = 0.00$.

1. Calculeu les probabilitats conjuntes associades als quatre camins de l'arbre.
2. Construïu la taula de contingència completa amb freqüències absolutes i probabilitats marginals.
3. Trobeu les probabilitats marginals $P(B)$ i $P(\\neg B)$.
4. Invertiu l'arbre: calculeu les probabilitats condicionades a posteriori $P(A \\mid B)$ i $P(A \\mid \\neg B)$.`,
  content: `## 1. Bidireccionalitat entre taules i arbres

Donada la taula amb $n = 100$:

| | $B$ | $\\neg B$ | **Total** |
| :--- | :---: | :---: | :---: |
| **$A$** | $20$ | $30$ | **$50$** |
| **$\\neg A$** | $40$ | $10$ | **$50$** |
| **Total** | **$60$** | **$40$** | **$100$** |

### Arbre 1: Condicionat primer per $A$ (arrels $A$ i $\\neg A$)
1. **Nivell 1**:
   - $P(A) = \\frac{50}{100} = 0.50$
   - $P(\\neg A) = \\frac{50}{100} = 0.50$
2. **Nivell 2 (branques condicionades)**:
   - Des de $A$:
     - $P(B \\mid A) = \\frac{20}{50} = 0.40 \\implies P(A \\cap B) = 0.50 \\times 0.40 = 0.20$
     - $P(\\neg B \\mid A) = \\frac{30}{50} = 0.60 \\implies P(A \\cap \\neg B) = 0.50 \\times 0.60 = 0.30$
   - Des de $\\neg A$:
     - $P(B \\mid \\neg A) = \\frac{40}{50} = 0.80 \\implies P(\\neg A \\cap B) = 0.50 \\times 0.80 = 0.40$
     - $P(\\neg B \\mid \\neg A) = \\frac{10}{50} = 0.20 \\implies P(\\neg A \\cap \\neg B) = 0.50 \\times 0.20 = 0.10$

### Arbre 2: Condicionat primer per $B$ (arrels $B$ i $\\neg B$)
1. **Nivell 1**:
   - $P(B) = \\frac{60}{100} = 0.60$
   - $P(\\neg B) = \\frac{40}{100} = 0.40$
2. **Nivell 2 (branques condicionades)**:
   - Des de $B$:
     - $P(A \\mid B) = \\frac{20}{60} = \\frac{1}{3} \\approx 0.333 \\implies P(B \\cap A) = 0.60 \\times 0.333 = 0.20$
     - $P(\\neg A \\mid B) = \\frac{40}{60} = \\frac{2}{3} \\approx 0.667 \\implies P(B \\cap \\neg A) = 0.60 \\times 0.667 = 0.40$
   - Des de $\\neg B$:
     - $P(A \\mid \\neg B) = \\frac{30}{40} = 0.75 \\implies P(\\neg B \\cap A) = 0.40 \\times 0.75 = 0.30$
     - $P(\\neg A \\mid \\neg B) = \\frac{10}{40} = 0.25 \\implies P(\\neg B \\cap \\neg A) = 0.40 \\times 0.25 = 0.10$

---

## 2. Resolució de l'exercici (Reconstrucció de la taula)

### Pas 1: Càlcul de les probabilitats de cada camí de l'arbre
Multipliquem les probabilitats de cada branca seqüencial:
$$
P(A \\cap B) = P(A) \\cdot P(B \\mid A) = 0.20 \\times 0.25 = 0.05
$$
$$
P(A \\cap \\neg B) = P(A) \\cdot P(\\neg B \\mid A) = 0.20 \\times 0.75 = 0.15
$$
$$
P(\\neg A \\cap B) = P(\\neg A) \\cdot P(B \\mid \\neg A) = 0.80 \\times 1.00 = 0.80
$$
$$
P(\\neg A \\cap \\neg B) = P(\\neg A) \\cdot P(\\neg B \\mid \\neg A) = 0.80 \\times 0.00 = 0.00
$$

La suma total dels quatre camins elementals és:
$$
0.05 + 0.15 + 0.80 + 0.00 = 1.00
$$

---

### Pas 2: Obtenció dels recomptes absoluts ($n = 100$)
Multipliquem cada probabilitat conjunta per la mida total $n = 100$:
- Nombre de casos $(A \\cap B) = 100 \\times 0.05 = 5$
- Nombre de casos $(A \\cap \\neg B) = 100 \\times 0.15 = 15$
- Nombre de casos $(\\neg A \\cap B) = 100 \\times 0.80 = 80$
- Nombre de casos $(\\neg A \\cap \\neg B) = 100 \\times 0.00 = 0$

### Taula de Contingència Reconstruïda
| | $B$ | $\\neg B$ | **Total Fila** |
| :--- | :---: | :---: | :---: |
| **$A$** | $5$ | $15$ | **$20$** ($0.20$) |
| **$\\neg A$** | $80$ | $0$ | **$80$** ($0.80$) |
| **Total Columna** | **$85$** ($0.85$) | **$15$** ($0.15$) | **$100$** ($1.00$) |

---

### Pas 3: Probabilitats marginals de $B$ i $\\neg B$
Aplicant el teorema de la probabilitat total:
$$
P(B) = P(A \\cap B) + P(\\neg A \\cap B) = 0.05 + 0.80 = 0.85 \\quad (85\\%)
$$
$$
P(\\neg B) = P(A \\cap \\neg B) + P(\\neg A \\cap \\neg B) = 0.15 + 0.00 = 0.15 \\quad (15\\%)
$$

---

### Pas 4: Inversió de l'arbre (Probabilitats a posteriori)
1. Probabilitat que hagi passat $A$ donat que s'observa $B$:
$$
P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.05}{0.85} = \\frac{5}{85} = \\frac{1}{17} \\approx 0.0588 \\quad (\\approx 5.88\\%)
$$
2. Probabilitat que hagi passat $A$ donat que s'observa $\\neg B$:
$$
P(A \\mid \\neg B) = \\frac{P(A \\cap \\neg B)}{P(\\neg B)} = \\frac{0.15}{0.15} = 1.00 \\quad (100\\%)
$$

> **Observació fonamental**: Donat que $P(\\neg A \\cap \\neg B) = 0$, sempre que no s'esdevé $B$ tenim la certesa absoluta que prové de $A$ ($P(A \\mid \\neg B) = 1$).`
};
