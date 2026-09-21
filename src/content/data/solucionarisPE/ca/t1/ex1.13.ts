import type { Solution } from '../../../solutions';

export const ex1_13: Solution = {
  id: 'PE-T1-Ex1.13',
  title: 'Exercici 1.13: Paquets de 3 bits - Parell de VADs, Covariància i Correlació',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Considerem el conjunt de tots els paquets de $3$ bits que es poden transmetre per una línia de comunicació digital:
$$\\Omega = \\{000, 001, 010, 011, 100, 101, 110, 111\\}$$
Suposem que els bits són transmesos de manera independent i equilibrada, per la qual cosa les $8$ seqüències són equiprobables ($P(\\omega_i) = 1/8$).

Es defineixen dues variables aleatòries sobre aquest experiment:
- $X$: **"suma dels 3 bits"** (pes de Hamming, $\\Omega_X = \\{0, 1, 2, 3\\}$).
- $Y$: **"nombre d'alternances en la seqüència"** (nombre de vegades que dos bits consecutius difereixen, $\\Omega_Y = \\{0, 1, 2\\}$).

### Qüestions:
1. Construïu la taula amb les $8$ possibilitats indicant els valors de $(X, Y)$ corresponents a cada paquet.
2. Definiu les funcions de probabilitat marginals $p_X(x)$ i $p_Y(y)$.
3. Calculeu els valors esperats $E[X]$, $E[Y]$ i les variàncies $V[X]$, $V[Y]$.
4. Construïu la taula de probabilitat conjunta $P_{X,Y}(x, y)$.
5. Calculeu la covariància $\\text{Cov}(X, Y)$ i el coeficient de correlació lineal $\\text{Cor}(X, Y)$. Són $X$ i $Y$ estocàsticament independents?
6. Considereu la variable condicionada $Y \\mid X = 0$ i calculeu la seva esperança $E[Y \\mid X = 0]$ i variància $V[Y \\mid X = 0]$.
7. Calculeu l'esperança del quadrat de la suma, $E[X^2]$.`,
  content: `## 1. Mapatge dels paquets de 3 bits

Per a cada paraula de codi de longitud 3:
- $X = b_1 + b_2 + b_3$
- $Y = \\mathbb{I}(b_1 \\neq b_2) + \\mathbb{I}(b_2 \\neq b_3)$ (transicions de bit)

| Paquet | $X$ (Suma) | Transicions | $Y$ (Alternances) | Probabilitat |
| :---: | :---: | :---: | :---: | :---: |
| **000** | $0$ | Cap | $0$ | $1/8$ |
| **001** | $1$ | $0 \\to 1$ al 3r bit | $1$ | $1/8$ |
| **010** | $1$ | $0 \\to 1$ i $1 \\to 0$ | $2$ | $1/8$ |
| **011** | $2$ | $0 \\to 1$ al 2n bit | $1$ | $1/8$ |
| **100** | $1$ | $1 \\to 0$ al 2n bit | $1$ | $1/8$ |
| **101** | $2$ | $1 \\to 0$ i $0 \\to 1$ | $2$ | $1/8$ |
| **110** | $2$ | $1 \\to 0$ al 3r bit | $1$ | $1/8$ |
| **111** | $3$ | Cap | $0$ | $1/8$ |

---

## 2. Distribucions marginals de probabilitat

### Distribució marginal de $X$ (Suma)
- $P(X = 0) = P(000) = 1/8$
- $P(X = 1) = P(001) + P(010) + P(100) = 3/8$
- $P(X = 2) = P(011) + P(101) + P(110) = 3/8$
- $P(X = 3) = P(111) = 1/8$

*(Distribució Binomial $X \\sim \\text{Bin}(3, 0.5)$).*

### Distribució marginal de $Y$ (Alternances)
- $P(Y = 0) = P(000) + P(111) = 2/8 = 1/4$
- $P(Y = 1) = P(001) + P(011) + P(100) + P(110) = 4/8 = 1/2$
- $P(Y = 2) = P(010) + P(101) = 2/8 = 1/4$

*(Distribució Binomial $Y \\sim \\text{Bin}(2, 0.5)$, ja que hi ha 2 posicions de possible transició independents).*

---

## 3. Esperances i variàncies marginals

### Per a la variable $X$:
$$
E[X] = 0(1/8) + 1(3/8) + 2(3/8) + 3(1/8) = \\frac{12}{8} = 1.5
$$
$$
E[X^2] = 0^2(1/8) + 1^2(3/8) + 2^2(3/8) + 3^2(1/8) = \\frac{0 + 3 + 12 + 9}{8} = \\frac{24}{8} = 3
$$
$$
V[X] = E[X^2] - (E[X])^2 = 3 - (1.5)^2 = 3 - 2.25 = 0.75
$$

### Per a la variable $Y$:
$$
E[Y] = 0(1/4) + 1(1/2) + 2(1/4) = 0 + 0.5 + 0.5 = 1.0
$$
$$
E[Y^2] = 0^2(1/4) + 1^2(1/2) + 2^2(1/4) = 0 + 0.5 + 1.0 = 1.5
$$
$$
V[Y] = E[Y^2] - (E[Y])^2 = 1.5 - 1.0^2 = 0.50
$$

---

## 4. Taula de probabilitat conjunta $P_{X,Y}(x, y)$

Comptabilitzem la freqüència de cada parell ordenat $(x, y)$:

| $Y$ \\ $X$ | **$X = 0$** | **$X = 1$** | **$X = 2$** | **$X = 3$** | **Marginal $p_Y(y)$** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **$Y = 0$** | $1/8$ | $0$ | $0$ | $1/8$ | **$2/8 = 1/4$** |
| **$Y = 1$** | $0$ | $2/8$ | $2/8$ | $0$ | **$4/8 = 1/2$** |
| **$Y = 2$** | $0$ | $1/8$ | $1/8$ | $0$ | **$2/8 = 1/4$** |
| **Marginal $p_X(x)$** | **$1/8$** | **$3/8$** | **$3/8$** | **$1/8$** | **$1.00$** |

---

## 5. Covariància, correlació i anàlisi d'independència

### Càlcul de l'esperança del producte $E[XY]$
Sumem únicament les cel·les on ni $x$ ni $y$ són zero:
$$
E[XY] = \\sum_{x} \\sum_{y} x \\cdot y \\cdot P(X=x, Y=y)
$$
- $(X=1, Y=1): 1 \\cdot 1 \\cdot (2/8) = 2/8$
- $(X=1, Y=2): 1 \\cdot 2 \\cdot (1/8) = 2/8$
- $(X=2, Y=1): 2 \\cdot 1 \\cdot (2/8) = 4/8$
- $(X=2, Y=2): 2 \\cdot 2 \\cdot (1/8) = 4/8$
$$
E[XY] = \\frac{2 + 2 + 4 + 4}{8} = \\frac{12}{8} = 1.5
$$

### Càlcul de la Covariància
$$
\\text{Cov}(X, Y) = E[XY] - E[X] \\cdot E[Y] = 1.5 - (1.5 \\cdot 1.0) = 0
$$

### Càlcul de la Correlació
$$
\\text{Cor}(X, Y) = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{0}{\\sqrt{0.75} \\cdot \\sqrt{0.5}} = 0
$$

> **PREGUNTA TRAMPA CLÀSSICA**: Són $X$ i $Y$ independents pel fet de tenir correlació zero?
> **RESPOSTA: NO**.
> La correlació mesura exclusivament dependència **lineal**. Dues variables poden ser incorrelades ($\\text{Cov} = 0$) i ser fortament **dependents estocàsticament**:
> $$P(X = 0, Y = 1) = 0 \\neq P(X = 0) \\cdot P(Y = 1) = \\frac{1}{8} \\times \\frac{1}{2} = \\frac{1}{16}$$
> Com que $0 \\neq \\frac{1}{16}$, $X$ i $Y$ **NO són independents**. De fet, si $X = 0$, sabem amb certesa del $100\\%$ que $Y$ ha de ser necessàriament $0$.

---

## 6. Distribució condicionada $Y \\mid X = 0$

Quan $X = 0$, l'únic paquet possible és el $000$:
$$
P(Y = 0 \\mid X = 0) = 1.00, \\quad P(Y = 1 \\mid X = 0) = 0, \\quad P(Y = 2 \\mid X = 0) = 0
$$
Com que la variable condicionada és constant ($Y = 0$ amb probabilitat 1):
$$
E[Y \\mid X = 0] = 0 \\cdot 1 + 1 \\cdot 0 + 2 \\cdot 0 = 0
$$
$$
V[Y \\mid X = 0] = (0 - 0)^2 \\cdot 1 = 0
$$

---

## 7. Càlcul de $E[X^2]$

Ja l'hem obtingut en calcular la variància de $X$:
$$
E[X^2] = 0^2 \\cdot \\frac{1}{8} + 1^2 \\cdot \\frac{3}{8} + 2^2 \\cdot \\frac{3}{8} + 3^2 \\cdot \\frac{1}{8} = \\frac{0 + 3 + 12 + 9}{8} = \\frac{24}{8} = 3
$$`
};
