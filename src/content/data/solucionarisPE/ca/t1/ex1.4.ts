import type { Solution } from '../../../solutions';

export const ex1_4: Solution = {
  id: 'PE-T1-Ex1.4',
  title: "Exercici 1.4: Taules de probabilitats i anàlisi d'independència",
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `S'estudia la relació entre el gènere ($M$: masculí, $F$: femení) i tres intervals d'edat ($1$: jove, $2$: mitjana edat, $3$: avançada) en dues mostres de $100$ individus (o dues poblacions estadístiques). En ambdós casos, les distribucions marginals són idèntiques:
- Marginals de Gènere: $P(M) = 0.60$, $P(F) = 0.40$.
- Marginals d'Edat: $P(E_1) = 0.10$, $P(E_2) = 0.40$, $P(E_3) = 0.50$.

Les distribucions de probabilitat conjunta observades són:

### Població 1:
| Gènere \\ Edat | 1 | 2 | 3 | **Total** |
| :--- | :---: | :---: | :---: | :---: |
| **Masc.** | $0.06$ | $0.24$ | $0.30$ | **$0.60$** |
| **Fem.** | $0.04$ | $0.16$ | $0.20$ | **$0.40$** |
| **Total** | **$0.10$** | **$0.40$** | **$0.50$** | **$1.00$** |

### Població 2:
| Gènere \\ Edat | 1 | 2 | 3 | **Total** |
| :--- | :---: | :---: | :---: | :---: |
| **Masc.** | $0.05$ | $0.30$ | $0.25$ | **$0.60$** |
| **Fem.** | $0.05$ | $0.10$ | $0.25$ | **$0.40$** |
| **Total** | **$0.10$** | **$0.40$** | **$0.50$** | **$1.00$** |

### Qüestions:
1. Enuncieu les condicions formals d'independència estocàstica entre dues variables aleatòries o atributs categòrics.
2. Calculeu per a cada població la taula de probabilitats condicionades per columnes $P(G \\mid E_j)$.
3. Determineu raonadament si a la Població 1 hi ha independència entre el gènere i l'edat.
4. Determineu si a la Població 2 hi ha independència o dependència. En cas de dependència, interpreteu com varia la proporció d'homes i dones segons l'edat.`,
  content: `## 1. Condicions teòriques d'independència estocàstica

Dos esdeveniments $A$ i $B$ són **estocàsticament independents** si i només si es compleix qualsevol de les següents propietats equivalents:
1. **Regla del producte per a la probabilitat conjunta**:
$$
P(A \\cap B) = P(A) \\cdot P(B)
$$
2. **Invariància de les probabilitats condicionades**:
$$
P(A \\mid B) = P(A) \\quad \\text{i} \\quad P(B \\mid A) = P(B)
$$

Per a taules de contingència bidimensionals, la condició d'independència implica que la distribució de probabilitats condicionades en cada columna ha de coincidir exactament amb la distribució marginal de les files:
$$
P(M \\mid E_j) = P(M) = 0.60 \\quad \\text{i} \\quad P(F \\mid E_j) = P(F) = 0.40 \\quad \\forall j \\in \\{1, 2, 3\\}
$$

---

## 2. Anàlisi de la Població 1

### Càlcul de les probabilitats condicionades per columna
Dividim cada cel·la pel total marginal de la seva respectiva columna:

- Per a l'edat $1$ ($P(E_1) = 0.10$):
  $$P(M \\mid E_1) = \\frac{0.06}{0.10} = 0.60, \\quad P(F \\mid E_1) = \\frac{0.04}{0.10} = 0.40$$
- Per a l'edat $2$ ($P(E_2) = 0.40$):
  $$P(M \\mid E_2) = \\frac{0.24}{0.40} = 0.60, \\quad P(F \\mid E_2) = \\frac{0.16}{0.40} = 0.40$$
- Per a l'edat $3$ ($P(E_3) = 0.50$):
  $$P(M \\mid E_3) = \\frac{0.30}{0.50} = 0.60, \\quad P(F \\mid E_3) = \\frac{0.20}{0.50} = 0.40$$

### Taula Condicionada per Columna (Població 1):
| Gènere \\ Edat | 1 | 2 | 3 | **Marginal Gènere** |
| :--- | :---: | :---: | :---: | :---: |
| **Masc.** | $0.60$ | $0.60$ | $0.60$ | **$0.60$** |
| **Fem.** | $0.40$ | $0.40$ | $0.40$ | **$0.40$** |
| **Total** | **$1.00$** | **$1.00$** | **$1.00$** | **$1.00$** |

### Comprovació del producte de marginals
- $P(M \\cap E_1) = 0.06 = 0.60 \\times 0.10 = P(M)P(E_1)$
- $P(M \\cap E_2) = 0.24 = 0.60 \\times 0.40 = P(M)P(E_2)$
- $P(M \\cap E_3) = 0.30 = 0.60 \\times 0.50 = P(M)P(E_3)$
- $P(F \\cap E_1) = 0.04 = 0.40 \\times 0.10 = P(F)P(E_1)$
- $P(F \\cap E_2) = 0.16 = 0.40 \\times 0.40 = P(F)P(E_2)$
- $P(F \\cap E_3) = 0.20 = 0.40 \\times 0.50 = P(F)P(E_3)$

> **Veredicte**: **SÍ HI HA INDEPENDÈNCIA**. Saber l'edat d'una persona no altera en absolut la probabilitat que sigui home ($60\\%$) o dona ($40\\%$).

---

## 3. Anàlisi de la Població 2

### Càlcul de les probabilitats condicionades per columna
- Per a l'edat $1$ ($P(E_1) = 0.10$):
  $$P(M \\mid E_1) = \\frac{0.05}{0.10} = 0.50, \\quad P(F \\mid E_1) = \\frac{0.05}{0.10} = 0.50$$
- Per a l'edat $2$ ($P(E_2) = 0.40$):
  $$P(M \\mid E_2) = \\frac{0.30}{0.40} = 0.75, \\quad P(F \\mid E_2) = \\frac{0.10}{0.40} = 0.25$$
- Per a l'edat $3$ ($P(E_3) = 0.50$):
  $$P(M \\mid E_3) = \\frac{0.25}{0.50} = 0.50, \\quad P(F \\mid E_3) = \\frac{0.25}{0.50} = 0.50$$

### Taula Condicionada per Columna (Població 2):
| Gènere \\ Edat | 1 | 2 | 3 | **Marginal Gènere** |
| :--- | :---: | :---: | :---: | :---: |
| **Masc.** | $0.50$ | $0.75$ | $0.50$ | **$0.60$** |
| **Fem.** | $0.50$ | $0.25$ | $0.50$ | **$0.40$** |
| **Total** | **$1.00$** | **$1.00$** | **$1.00$** | **$1.00$** |

### Comprovació del producte de marginals (contraexemple):
Prenem la casella $(M, E_2)$:
- $P(M \\cap E_2) = 0.30$
- $P(M) \\times P(E_2) = 0.60 \\times 0.40 = 0.24 \\neq 0.30$

Com que $P(M \\cap E_2) \\neq P(M)P(E_2)$, la condició d'independència falla.

> **Veredicte**: **NO HI HA INDEPENDÈNCIA (DEPENDÈNCIA)**.
> - A l'edat $2$ (mitjana edat), la proporció d'homes puja significativament fins al $75\\%$ (mentre que la marginal global és del $60\\%$).
> - A les edats jove i avançada ($1$ i $3$), la proporció d'homes i dones s'iguala al $50\\%$.
> - Per tant, conèixer l'edat d'un individu aporta informació rellevant sobre la distribució del seu gènere.`
};
