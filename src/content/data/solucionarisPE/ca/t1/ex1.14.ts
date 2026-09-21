import type { Solution } from '../../../solutions';

export const ex1_14: Solution = {
  id: 'PE-T1-Ex1.14',
  title: 'Exercici 1.14: Dos Daus - Suma, diferència absoluta i esperança condicionada',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `En l'experiment de llançar dues vegades un dau equilibrat de $6$ cares de manera independent, es registren els resultats $X$ (primer dau) i $Y$ (segon dau), ambdós amb valors equiprobables en $\\{1, 2, 3, 4, 5, 6\\}$.

A partir de $(X, Y)$ es defineixen dues noves variables aleatòries discretes:
- $S = X + Y$: **"suma dels dos resultats"** ($S \\in \\{2, 3, \\dots, 12\\}$).
- $D = |X - Y|$: **"diferència en valor absolut dels dos resultats"** ($D \\in \\{0, 1, \\dots, 5\\}$).

### Qüestions:
1. Obtingueu les funcions de probabilitat marginals $P_S(S = k)$ i $P_D(D = k)$.
2. Construïu la taula de probabilitat conjunta $P(S = s \\cap D = d)$ i deduïu la propietat de paritat que governa les cel·les amb probabilitat nul·la.
3. Demostreu formalment que les variables $S$ i $D$ **NO** són estocàsticament independents.
4. Calculeu les distribucions de probabilitat condicionades de la suma donada la diferència, $P_{S \\mid D}(s \\mid D = d)$, per a tots els valors $d \\in \\{0, 1, 2, 3, 4, 5\\}$.
5. Analitzeu l'evolució de l'esperança condicionada $\\mu_{S \\mid D}$ i de la desviació estàndard condicionada $\\sigma_{S \\mid D}$ a mesura que creix la diferència $D$. Com s'interpreta el resultat?`,
  content: `## 1. Distribucions marginals de la suma ($S$) i la diferència ($D$)

Com que els dos llançaments són independents i equiprobables, l'espai mostral consta de $6 \\times 6 = 36$ parells $(x, y)$ amb probabilitat $1/36$ cadascun.

### Distribució marginal de $S = X + Y$:
| $k$ | Resultats favorables $(x, y)$ | Nombre de casos | $P_S(S = k)$ |
| :---: | :--- | :---: | :---: |
| **2** | $(1,1)$ | $1$ | $1/36 \\approx 0.028$ |
| **3** | $(1,2), (2,1)$ | $2$ | $2/36 \\approx 0.056$ |
| **4** | $(1,3), (2,2), (3,1)$ | $3$ | $3/36 \\approx 0.083$ |
| **5** | $(1,4), (2,3), (3,2), (4,1)$ | $4$ | $4/36 \\approx 0.111$ |
| **6** | $(1,5), (2,4), (3,3), (4,2), (5,1)$ | $5$ | $5/36 \\approx 0.139$ |
| **7** | $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ | $6$ | $6/36 \\approx 0.167$ |
| **8** | $(2,6), (3,5), (4,4), (5,3), (6,2)$ | $5$ | $5/36 \\approx 0.139$ |
| **9** | $(3,6), (4,5), (5,4), (6,3)$ | $4$ | $4/36 \\approx 0.111$ |
| **10** | $(4,6), (5,5), (6,4)$ | $3$ | $3/36 \\approx 0.083$ |
| **11** | $(5,6), (6,5)$ | $2$ | $2/36 \\approx 0.056$ |
| **12** | $(6,6)$ | $1$ | $1/36 \\approx 0.028$ |

---

### Distribució marginal de $D = |X - Y|$:
- $D = 0$ (parells idèntics $(x, x)$): $6$ casos $\\implies P(D = 0) = \\frac{6}{36} \\approx 0.167$
- $D = 1$ ($|x - y| = 1$): $10$ casos $\\implies P(D = 1) = \\frac{10}{36} \\approx 0.278$
- $D = 2$ ($|x - y| = 2$): $8$ casos $\\implies P(D = 2) = \\frac{8}{36} \\approx 0.222$
- $D = 3$ ($|x - y| = 3$): $6$ casos $\\implies P(D = 3) = \\frac{6}{36} \\approx 0.167$
- $D = 4$ ($|x - y| = 4$): $4$ casos $\\implies P(D = 4) = \\frac{4}{36} \\approx 0.111$
- $D = 5$ ($|x - y| = 5$: $(1,6)$ i $(6,1)$): $2$ casos $\\implies P(D = 5) = \\frac{2}{36} \\approx 0.056$

---

## 2. Taula de probabilitat conjunta $P(S = s, D = d)$

Observem una propietat algebraica fonamental:
$$
S + D = (X + Y) + |X - Y| = 2 \\max(X, Y)
$$
Com que $2 \\max(X, Y)$ és sempre un nombre parell, **$S$ i $D$ han de tenir obligatòriament la mateixa paritat**:
- Si $D$ és parell ($0, 2, 4$), $S$ ha de ser parell ($2, 4, 6, 8, 10, 12$).
- Si $D$ és senar ($1, 3, 5$), $S$ ha de ser senar ($3, 5, 7, 9, 11$).
- Totes les combinacions amb diferent paritat tenen probabilitat exactament $0$.

### Taula Conjunta (Probabilitats sobre 36 i arrodoniments decimals):
| $S$ \\ $D$ | **0** | **1** | **2** | **3** | **4** | **5** | **Marginal $P_S(s)$** |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2** | $1/36$ ($0.028$) | $0$ | $0$ | $0$ | $0$ | $0$ | **$0.028$** |
| **3** | $0$ | $2/36$ ($0.056$) | $0$ | $0$ | $0$ | $0$ | **$0.056$** |
| **4** | $1/36$ ($0.028$) | $0$ | $2/36$ ($0.056$) | $0$ | $0$ | $0$ | **$0.083$** |
| **5** | $0$ | $2/36$ ($0.056$) | $0$ | $2/36$ ($0.056$) | $0$ | $0$ | **$0.111$** |
| **6** | $1/36$ ($0.028$) | $0$ | $2/36$ ($0.056$) | $0$ | $2/36$ ($0.056$) | $0$ | **$0.139$** |
| **7** | $0$ | $2/36$ ($0.056$) | $0$ | $2/36$ ($0.056$) | $0$ | $2/36$ ($0.056$) | **$0.167$** |
| **8** | $1/36$ ($0.028$) | $0$ | $2/36$ ($0.056$) | $0$ | $2/36$ ($0.056$) | $0$ | **$0.139$** |
| **9** | $0$ | $2/36$ ($0.056$) | $0$ | $2/36$ ($0.056$) | $0$ | $0$ | **$0.111$** |
| **10** | $1/36$ ($0.028$) | $0$ | $2/36$ ($0.056$) | $0$ | $0$ | $0$ | **$0.083$** |
| **11** | $0$ | $2/36$ ($0.056$) | $0$ | $0$ | $0$ | $0$ | **$0.056$** |
| **12** | $1/36$ ($0.028$) | $0$ | $0$ | $0$ | $0$ | $0$ | **$0.028$** |
| **Marginal $P_D(d)$** | **$0.167$** | **$0.278$** | **$0.222$** | **$0.167$** | **$0.111$** | **$0.056$** | **$1.000$** |

---

## 3. Demostració de No Independència

Per demostrar que dues variables NO són independents n'hi ha prou amb trobar un sol contraexemple que violi la regla del producte:
- Triem $S = 2$ i $D = 1$:
  - Probabilitat conjunta: $P(S = 2, D = 1) = 0$.
  - Producte de marginals: $P(S = 2) \\cdot P(D = 1) = \\frac{1}{36} \\times \\frac{10}{36} = \\frac{10}{1296} \\approx 0.0077 \\neq 0$.

Com que $P(S = 2, D = 1) \\neq P(S = 2)P(D = 1)$, **$S$ i $D$ NO són independents**.

---

## 4. Distribucions condicionades $P_{S \\mid D}(s \\mid D = d)$

Dividim cada cel·la de la taula conjunta per la marginal de la columna $P_D(d)$:

| $S$ | $P(S \\mid D=0)$ | $P(S \\mid D=1)$ | $P(S \\mid D=2)$ | $P(S \\mid D=3)$ | $P(S \\mid D=4)$ | $P(S \\mid D=5)$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2** | $1/6 \\approx 0.17$ | $0.00$ | $0.00$ | $0.00$ | $0.00$ | $0.00$ |
| **3** | $0.00$ | $2/10 = 0.20$ | $0.00$ | $0.00$ | $0.00$ | $0.00$ |
| **4** | $1/6 \\approx 0.17$ | $0.00$ | $2/8 = 0.25$ | $0.00$ | $0.00$ | $0.00$ |
| **5** | $0.00$ | $2/10 = 0.20$ | $0.00$ | $2/6 \\approx 0.33$ | $0.00$ | $0.00$ |
| **6** | $1/6 \\approx 0.17$ | $0.00$ | $2/8 = 0.25$ | $0.00$ | $2/4 = 0.50$ | $0.00$ |
| **7** | $0.00$ | $2/10 = 0.20$ | $0.00$ | $2/6 \\approx 0.33$ | $0.00$ | $2/2 = 1.00$ |
| **8** | $1/6 \\approx 0.17$ | $0.00$ | $2/8 = 0.25$ | $0.00$ | $2/4 = 0.50$ | $0.00$ |
| **9** | $0.00$ | $2/10 = 0.20$ | $0.00$ | $2/6 \\approx 0.33$ | $0.00$ | $0.00$ |
| **10** | $1/6 \\approx 0.17$ | $0.00$ | $2/8 = 0.25$ | $0.00$ | $0.00$ | $0.00$ |
| **11** | $0.00$ | $2/10 = 0.20$ | $0.00$ | $0.00$ | $0.00$ | $0.00$ |
| **12** | $1/6 \\approx 0.17$ | $0.00$ | $0.00$ | $0.00$ | $0.00$ | $0.00$ |
| **$\\mu$ (Esperança)** | **$7.00$** | **$7.00$** | **$7.00$** | **$7.00$** | **$7.00$** | **$7.00$** |
| **$\\sigma$ (Desviació)** | **$3.42$** | **$2.83$** | **$2.24$** | **$1.63$** | **$1.00$** | **$0.00$** |

---

## 5. Interpretació de l'esperança i variància condicionada

> **Conclusions fonamentals**:
> 1. **L'esperança condicionada és estrictament invariant**: $E[S \\mid D = d] = 7.00$ per a tots els valors de $d \\in \\{0, 1, 2, 3, 4, 5\\}$. Això és degut a la perfecta simetria dels possibles resultats respecte al valor central $7$.
> 2. **La dispersió disminueix dràsticament**: Quan $D = 0$ (dos daus iguals), la suma pot ser qualsevol parell entre $2$ i $12$, oferint la màxima desviació ($\\sigma = 3.42$). A mesura que la diferència creix ($D \\uparrow$), el ventall de sumes possibles es contrau sobre el $7$:
>    - Per a $D = 4$: la suma només pot ser $6$ o $8$ ($\\sigma = 1.00$).
>    - Per a $D = 5$: els únics resultats possibles són $(1,6)$ o $(6,1)$, on la suma és determinista: $S = 7$ amb probabilitat $1$ (variància nul·la, $\\sigma = 0.00$).`
};
