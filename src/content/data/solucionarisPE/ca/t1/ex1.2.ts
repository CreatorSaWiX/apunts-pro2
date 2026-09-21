import type { Solution } from '../../../solutions';

export const ex1_2: Solution = {
  id: 'PE-T1-Ex1.2',
  title: 'Exercici 1.2: Taules de contingència i probabilitat condicionada (C++ vs Java)',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `En un jutge automàtic d'avaluació de codi s'analitza una mostra de $200$ programes enviats per estudiants d'informàtica. Els programes estan programats en dos llenguatges diferents (C++ i Java) i es registra si compilen correctament a la primera o fallen:

- De $120$ programes en **C++**, $72$ compilen correctament i $48$ no compilen.
- De $80$ programes en **Java**, $64$ compilen correctament i $16$ no compilen.

### Qüestions:
1. Construïu la taula de freqüències absolutes i les tres taules de probabilitat:
   - **Sobre el total** (probabilitats conjuntes $P(A \\cap B)$).
   - **Sobre la fila** (probabilitats condicionades pel llenguatge $P(\\text{Compila} \\mid \\text{Llenguatge})$).
   - **Sobre la columna** (probabilitats condicionades pel resultat $P(\\text{Llenguatge} \\mid \\text{Compila})$).
2. Quina és la probabilitat que un programa triat a l'atzar s'hagi executat en C++ i compili a la primera?
3. Quina és la probabilitat que compili un programa sabent que està escrit en C++?
4. Si un programa ha compilat a la primera, quina és la probabilitat que provingui de C++? I de Java?
5. Representeu el problema mitjançant un arbre de probabilitats i deduïu la fórmula de Bayes per a $P(\\text{Java} \\mid \\text{Compila})$.`,
  content: `## 1. Taules de contingència

### Taula de Freqüències Absolutes (Recompte de casos)
| Programa | Compila (OK) | No compila (KO) | **Total** |
| :--- | :---: | :---: | :---: |
| **C++** | $72$ | $48$ | **$120$** |
| **Java** | $64$ | $16$ | **$80$** |
| **Total** | **$136$** | **$64$** | **$200$** |

---

### A. Probabilitats Conjuntes (Sobre el Total, denominador $N = 200$)
Dividim cada casella entre el total general de programes ($200$):
$$
P(L \\cap C) = \\frac{n(L \\cap C)}{200}
$$

| Programa | Compila ($OK$) | No compila ($KO$) | **Marginal Llenguatge** |
| :--- | :---: | :---: | :---: |
| **C++** | $\\frac{72}{200} = 0.36$ | $\\frac{48}{200} = 0.24$ | **$0.60$** |
| **Java** | $\\frac{64}{200} = 0.32$ | $\\frac{16}{200} = 0.08$ | **$0.40$** |
| **Marginal Compilació** | **$0.68$** | **$0.32$** | **$1.00$** |

---

### B. Probabilitats Condicionades sobre la Fila (denominadors $120$ i $80$)
Indica la probabilitat de compilació **donat el llenguatge escollit**:
$$
P(C \\mid L) = \\frac{P(L \\cap C)}{P(L)}
$$

| Programa | Compila ($OK$) | No compila ($KO$) | **Total Fila** |
| :--- | :---: | :---: | :---: |
| **C++** | $\\frac{72}{120} = 0.60$ ($60\\%$) | $\\frac{48}{120} = 0.40$ ($40\\%$) | **$1.00$** |
| **Java** | $\\frac{64}{80} = 0.80$ ($80\\%$) | $\\frac{16}{80} = 0.20$ ($20\\%$) | **$1.00$** |

---

### C. Probabilitats Condicionades sobre la Columna (denominadors $136$ i $64$)
Indica la probabilitat que provingui d'un llenguatge **donat el resultat de compilació**:
$$
P(L \\mid C) = \\frac{P(L \\cap C)}{P(C)}
$$

| Programa | Compila ($OK$) | No compila ($KO$) |
| :--- | :---: | :---: |
| **C++** | $\\frac{72}{136} \\approx 0.5294$ ($53\\%$) | $\\frac{48}{64} = 0.75$ ($75\\%$) |
| **Java** | $\\frac{64}{136} \\approx 0.4706$ ($47\\%$) | $\\frac{16}{64} = 0.25$ ($25\\%$) |
| **Total Columna** | **$1.00$** | **$1.00$** |

---

## 2. Resolució de les preguntes

### 2.1. Probabilitat que s'executi en C++ i compili ($P(\\text{C++} \\cap \\text{OK})$)
Es tracta d'una probabilitat conjunta (intersecció) sobre el total d'envis:
$$
P(\\text{C++} \\cap \\text{OK}) = \\frac{72}{200} = 0.36 \\quad (36\\%)
$$

### 2.2. Probabilitat que compili un programa si és en C++ ($P(\\text{OK} \\mid \\text{C++})$)
És la probabilitat condicionada sobre la fila de C++:
$$
P(\\text{OK} \\mid \\text{C++}) = \\frac{P(\\text{C++} \\cap \\text{OK})}{P(\\text{C++})} = \\frac{0.36}{0.60} = \\frac{72}{120} = 0.60 \\quad (60\\%)
$$

### 2.3. Probabilitat que sigui de C++ si ha compilat ($P(\\text{C++} \\mid \\text{OK})$)
És la probabilitat inversa (sobre la columna de compilar):
$$
P(\\text{C++} \\mid \\text{OK}) = \\frac{72}{136} = \\frac{9}{17} \\approx 0.5294 \\quad (\\approx 53\\%)
$$

I per a Java:
$$
P(\\text{Java} \\mid \\text{OK}) = \\frac{64}{136} = \\frac{32}{68} = \\frac{8}{17} \\approx 0.4706 \\quad (\\approx 47\\%)
$$

---

## 3. Representació en arbre i Teorema de Bayes

En un arbre de decisió probabilístic:
1. El primer nivell conté les probabilitats a priori dels llenguatges:
   - $P(\\text{C++}) = 0.60$
   - $P(\\text{Java}) = 0.40$
2. El segon nivell conté les probabilitats condicionades en cada branca:
   - De C++:
     - Branca OK: $P(\\text{OK} \\mid \\text{C++}) = 0.60 \\implies P(\\text{C++} \\cap \\text{OK}) = 0.60 \\times 0.60 = 0.36$
     - Branca KO: $P(\\text{KO} \\mid \\text{C++}) = 0.40 \\implies P(\\text{C++} \\cap \\text{KO}) = 0.60 \\times 0.40 = 0.24$
   - De Java:
     - Branca OK: $P(\\text{OK} \\mid \\text{Java}) = 0.80 \\implies P(\\text{Java} \\cap \\text{OK}) = 0.40 \\times 0.80 = 0.32$
     - Branca KO: $P(\\text{KO} \\mid \\text{Java}) = 0.20 \\implies P(\\text{Java} \\cap \\text{KO}) = 0.40 \\times 0.20 = 0.08$

### Aplicació del Teorema de Bayes
El $80\\%$ dels programes en Java compilen a la primera ($P(\\text{OK} \\mid \\text{Java}) = 0.80$). Però quin percentatge dels programes que compilen a la primera són en realitat de Java?

$$
P(\\text{Java} \\mid \\text{OK}) = \\frac{P(\\text{Java}) \\cdot P(\\text{OK} \\mid \\text{Java})}{P(\\text{OK})}
$$
On pel **Teorema de la Probabilitat Total**:
$$
P(\\text{OK}) = P(\\text{C++}) \\cdot P(\\text{OK} \\mid \\text{C++}) + P(\\text{Java}) \\cdot P(\\text{OK} \\mid \\text{Java}) = 0.36 + 0.32 = 0.68
$$
Substituint:
$$
P(\\text{Java} \\mid \\text{OK}) = \\frac{0.32}{0.68} = \\frac{32}{68} = \\frac{8}{17} \\approx 0.4706 \\quad (47.06\\%)
$$

> **Reflexió clau**: Encara que Java té una taxa d'èxit individual més alta ($80\\%$ vs $60\\%$), C++ té un volum d'enviaments més elevat ($60\\%$ del total). Per això, entre els programes aprovats hi ha més programes de C++ ($53\\%$) que de Java ($47\\%$).`
};
