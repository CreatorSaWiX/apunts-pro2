import type { Solution } from '../../../solutions';

export const ex1_10: Solution = {
  id: 'PE-T1-Ex1.10',
  title: "Exercici 1.10: Aeroport III - VAD de flux d'arribada de viatgers",
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Continuant amb l'estudi de l'eficiència a l'aeroport, ens plantegem modelar determinades variables aleatòries per obtenir informació sobre el seu funcionament.

S'ha establert que la distribució de la variable aleatòria discreta $X$: **"nombre de viatgers que arriben a un punt de facturació per minut"** ve donada per la següent taula:

| $k$ | $p_X(k) = P(X = k)$ | $F_X(k) = P(X \\leq k)$ |
| :---: | :---: | :---: |
| **5** | $0.12$ | $0.12$ |
| **6** | $0.32$ | $0.44$ |
| **7** | $0.48$ | $0.92$ |
| **8** | $0.08$ | $1.00$ |

### Qüestions:
1. Calculeu la probabilitat que en un minut determinat arribin:
   - Exactament $7$ viatgers.
   - Menys de $7$ viatgers.
   - Més de $7$ viatgers.
   - Entre $7$ i $8$ viatgers (ambdós inclosos).
2. Trobeu l'esperança matemàtica $E[X]$.
3. Trobeu la variància $V[X]$ i la desviació típica $\\sigma_X$.`,
  content: `## 1. Càlcul de probabilitats d'arribada

A partir de la funció de massa $p_X(k)$ i de la funció de distribució acumulada $F_X(k)$:

### 1.1. Arribin exactament 7 viatgers ($P(X = 7)$)
Llegim directament de la taula de probabilitat puntual:
$$
P(X = 7) = p_X(7) = 0.48 \\quad (48\\%)
$$

---

### 1.2. Arribin menys de 7 viatgers ($P(X < 7)$)
Com que $X$ és una variable discreta que pren valors enters, "menys de $7$" equival estrictament a "$X \\leq 6$":
$$
P(X < 7) = P(X \\leq 6) = F_X(6)
$$
Sumant els valors o observant la funció acumulada:
$$
P(X \\leq 6) = p_X(5) + p_X(6) = 0.12 + 0.32 = 0.44 \\quad (44\\%)
$$

---

### 1.3. Arribin més de 7 viatgers ($P(X > 7)$)
"Més de $7$" en el recorregut $\\{5, 6, 7, 8\\}$ només inclou el valor $k = 8$:
$$
P(X > 7) = P(X = 8) = 0.08 \\quad (8\\%)
$$
També es pot calcular mitjançant el complementari de la funció acumulada:
$$
P(X > 7) = 1 - P(X \\leq 7) = 1 - F_X(7) = 1 - 0.92 = 0.08
$$

---

### 1.4. Arribin entre 7 i 8 viatgers ($P(7 \\leq X \\leq 8)$)
Sumant les probabilitats puntuals corresponents:
$$
P(7 \\leq X \\leq 8) = P(X = 7) + P(X = 8) = 0.48 + 0.08 = 0.56 \\quad (56\\%)
$$
O mitjançant la resta d'acumulades:
$$
P(7 \\leq X \\leq 8) = F_X(8) - F_X(6) = 1.00 - 0.44 = 0.56
$$

---

## 2. Càlcul de l'esperança matemàtica ($E[X]$)

L'esperança matemàtica mesura el nombre mitjà de viatgers que arriben per minut a llarg termini:
$$
E[X] = \\sum_{k=5}^8 k \\cdot p_X(k)
$$
Desenvolupant la suma ponderada:
$$
E[X] = 5(0.12) + 6(0.32) + 7(0.48) + 8(0.08)
$$
$$
E[X] = 0.60 + 1.92 + 3.36 + 0.64 = 6.52 \\text{ viatgers/minut}
$$

---

## 3. Càlcul de la variància ($V[X]$) i la desviació típica ($\\sigma_X$)

Utilitzem la fórmula de Steiner $V[X] = E[X^2] - (E[X])^2$.

### Pas 1: Càlcul del segon moment $E[X^2]$
$$
E[X^2] = \\sum_{k=5}^8 k^2 \\cdot p_X(k)
$$
$$
E[X^2] = 5^2(0.12) + 6^2(0.32) + 7^2(0.48) + 8^2(0.08)
$$
$$
E[X^2] = 25(0.12) + 36(0.32) + 49(0.48) + 64(0.08)
$$
$$
E[X^2] = 3.00 + 11.52 + 23.52 + 5.12 = 43.16
$$

### Pas 2: Variància
$$
V[X] = E[X^2] - (E[X])^2 = 43.16 - (6.52)^2
$$
$$
(6.52)^2 = 42.5104
$$
$$
V[X] = 43.16 - 42.5104 = 0.6496 \\approx 0.65 \\text{ viatgers}^2/\\text{minut}^2
$$

### Pas 3: Desviació típica ($\\sigma_X$)
Prenem l'arrel quadrada de la variància per recuperar les unitats originals de la variable:
$$
\\sigma_X = \\sqrt{V[X]} = \\sqrt{0.6496} \\approx 0.80598 \\approx 0.81 \\text{ viatgers/minut}
$$

> **Resum de resultats**:
> - $E[X] = 6.52$
> - $V[X] = 0.65$
> - $\\sigma_X = 0.81$`
};
