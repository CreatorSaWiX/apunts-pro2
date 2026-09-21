import type { Solution } from '../../../solutions';

export const ex1_16: Solution = {
  id: 'PE-T1-Ex1.16',
  title: 'Exercici 1.16: Parell de VADs: Memòria RAM i bloquejos mensuals',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Es disposa de la distribució de probabilitat conjunta entre la capacitat de memòria d'un conjunt de servidors $M \\in \\{1, 2, 3, 4, 6\\}$ (en gigabytes, GB) i el nombre mensual de fallades o incidències $B \\in \\{0, 1, 2, 3, 4, 5\\}$:

| $M$ (GB) \\ $B$ (Bloquejos) | **0** | **1** | **2** | **3** | **4** | **5** | **Marginal $P_M(m)$** |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1 GB** | $0.000$ | $0.020$ | $0.030$ | $0.050$ | $0.060$ | $0.080$ | **$0.240$** |
| **2 GB** | $0.000$ | $0.015$ | $0.015$ | $0.035$ | $0.045$ | $0.030$ | **$0.140$** |
| **3 GB** | $0.000$ | $0.030$ | $0.060$ | $0.050$ | $0.030$ | $0.030$ | **$0.200$** |
| **4 GB** | $0.060$ | $0.050$ | $0.045$ | $0.030$ | $0.030$ | $0.000$ | **$0.215$** |
| **6 GB** | $0.100$ | $0.075$ | $0.030$ | $0.000$ | $0.000$ | $0.000$ | **$0.205$** |
| **Marginal $P_B(b)$** | **$0.160$** | **$0.190$** | **$0.180$** | **$0.165$** | **$0.165$** | **$0.140$** | **$1.000$** |

Dades conegudes de la població:
- $\\mu_M = 3.21$ GB, $\\sigma_M = 1.765$ GB
- $\\mu_B = 2.405$ incidències/mes, $\\sigma_B = 1.660$ incidències/mes

### Qüestions:
1. Calculeu les probabilitats condicionades $P_{M \\mid B=3}(m)$ i $P_{M \\mid B=4}(m)$. Què se'n dedueix?
2. Calculeu les probabilitats condicionades $P_{B \\mid M=2}(b)$ i $P_{B \\mid M=4}(b)$. Què se'n dedueix?
3. Calculeu la probabilitat que un ordinador tingui menys de $3$ GB i més de $2$ incidències ($P(M < 3 \\cap B > 2)$).
4. Calculeu la probabilitat que tingui més de $2$ incidències si se sap que té menys de $3$ GB ($P(B > 2 \\mid M < 3)$).
5. Calculeu la probabilitat que tingui més de $3$ GB si ha tingut menys de $2$ incidències ($P(M > 3 \\mid B < 2)$).
6. Calculeu la covariància $\\text{Cov}(M, B)$ i el coeficient de correlació $\\text{Corr}(M, B) = \\rho_{M,B}$. Com canviarien aquests valors si la memòria s'expressés en Megabytes (MB)?`,
  content: `## 1. Distribucions condicionades de memòria donat el nombre d'incidències

Dividim els valors de les columnes $B = 3$ i $B = 4$ per la seva respectiva marginal $P(B = 3) = 0.165$ i $P(B = 4) = 0.165$:

$$
P(M = m \\mid B = b) = \\frac{P(M = m, B = b)}{P(B = b)}
$$

| $M$ (GB) | $P(M \\mid B = 3)$ | $P(M \\mid B = 4)$ |
| :---: | :---: | :---: |
| **1** | $\\frac{0.050}{0.165} \\approx 0.303$ | $\\frac{0.060}{0.165} \\approx 0.364$ |
| **2** | $\\frac{0.035}{0.165} \\approx 0.212$ | $\\frac{0.045}{0.165} \\approx 0.273$ |
| **3** | $\\frac{0.050}{0.165} \\approx 0.303$ | $\\frac{0.030}{0.165} \\approx 0.182$ |
| **4** | $\\frac{0.030}{0.165} \\approx 0.182$ | $\\frac{0.030}{0.165} \\approx 0.182$ |
| **6** | $\\frac{0.000}{0.165} = 0.000$ | $\\frac{0.000}{0.165} = 0.000$ |
| **Total** | **$1.000$** | **$1.000$** |

> **Deducció**: A mesura que el nombre d'incidències creix ($B = 4$ respecte a $B = 3$), la distribució es desplaça cap a memòries més petites ($1$ i $2$ GB pugen de $51.5\\%$ a $63.7\\%$), mentre que cap ordinador de $6$ GB arriba a patir $3$ o $4$ incidències.

---

## 2. Distribucions condicionades d'incidències donada la memòria

Dividim les files $M = 2$ i $M = 4$ per les seves respectives marginals $P(M = 2) = 0.140$ i $P(M = 4) = 0.215$:

| $B$ (Incidències) | $P(B \\mid M = 2)$ | $P(B \\mid M = 4)$ |
| :---: | :---: | :---: |
| **0** | $\\frac{0.000}{0.140} = 0.000$ | $\\frac{0.060}{0.215} \\approx 0.279$ |
| **1** | $\\frac{0.015}{0.140} \\approx 0.107$ | $\\frac{0.050}{0.215} \\approx 0.233$ |
| **2** | $\\frac{0.015}{0.140} \\approx 0.107$ | $\\frac{0.045}{0.215} \\approx 0.209$ |
| **3** | $\\frac{0.035}{0.140} = 0.250$ | $\\frac{0.030}{0.215} \\approx 0.140$ |
| **4** | $\\frac{0.045}{0.140} \\approx 0.321$ | $\\frac{0.030}{0.215} \\approx 0.140$ |
| **5** | $\\frac{0.030}{0.140} \\approx 0.214$ | $\\frac{0.000}{0.215} = 0.000$ |
| **Total** | **$1.000$** | **$1.000$** |

> **Deducció**:
> - Per a un ordinador amb poca memòria ($M = 2$ GB), el $78.5\\%$ de les incidències es concentren a $3, 4$ o $5$ bloquejos mensuals.
> - Per a un ordinador amb bona memòria ($M = 4$ GB), més del $72\\%$ dels casos presenten $0, 1$ o $2$ bloquejos, i mai assoleix $5$ fallades.

---

## 3. Càlcul de $P(M < 3 \\cap B > 2)$

Els ordinadors amb menys de $3$ GB són $M \\in \\{1, 2\\}$. Els bloquejos amb més de $2$ incidències són $B \\in \\{3, 4, 5\\}$.
Sumem les $6$ caselles d'aquest subconjunt:
$$
P(M < 3 \\cap B > 2) = \\sum_{m \\in \\{1,2\\}} \\sum_{b \\in \\{3,4,5\\}} P(M = m, B = b)
$$
- Per a $M = 1$: $0.050 + 0.060 + 0.080 = 0.190$
- Per a $M = 2$: $0.035 + 0.045 + 0.030 = 0.110$
$$
P(M < 3 \\cap B > 2) = 0.190 + 0.110 = 0.300 \\quad (30\\%)
$$

---

## 4. Càlcul de $P(B > 2 \\mid M < 3)$

Apliquem la definició de probabilitat condicionada:
$$
P(B > 2 \\mid M < 3) = \\frac{P(M < 3 \\cap B > 2)}{P(M < 3)}
$$
Calculem el denominador $P(M < 3)$:
$$
P(M < 3) = P(M = 1) + P(M = 2) = 0.240 + 0.140 = 0.380
$$
Substituint:
$$
P(B > 2 \\mid M < 3) = \\frac{0.300}{0.380} = \\frac{30}{38} = \\frac{15}{19} \\approx 0.78947 \\approx 0.79 \\quad (78.95\\%)
$$

---

## 5. Càlcul de $P(M > 3 \\mid B < 2)$

Volem avaluar la probabilitat que un servidor tingui més de $3$ GB ($M \\in \\{4, 6\\}$) sabent que ha tingut un funcionament excel·lent amb menys de $2$ bloquejos ($B \\in \\{0, 1\\}$):
$$
P(M > 3 \\mid B < 2) = \\frac{P(M > 3 \\cap B < 2)}{P(B < 2)}
$$
1. **Denominador** $P(B < 2)$:
$$
P(B < 2) = P(B = 0) + P(B = 1) = 0.160 + 0.190 = 0.350
$$
2. **Numerador** $P(M > 3 \\cap B < 2)$:
- Per a $M = 4$: $0.060 + 0.050 = 0.110$
- Per a $M = 6$: $0.100 + 0.075 = 0.175$
$$
\\text{Suma} = 0.110 + 0.175 = 0.285
$$
3. **Quocient**:
$$
P(M > 3 \\mid B < 2) = \\frac{0.285}{0.350} = \\frac{57}{70} \\approx 0.81428 \\approx 0.81 \\quad (81.43\\%)
$$

---

## 6. Covariància, correlació i canvi d'unitats

### Càlcul de $E[MB]$
Multipliquem totes les cel·les $m \\cdot b \\cdot p(m,b)$:
$$
E[MB] = 5.750
$$

### Covariància ($\\text{Cov}(M, B)$)
$$
\\text{Cov}(M, B) = E[MB] - \\mu_M \\cdot \\mu_B = 5.750 - (3.21 \\times 2.405) = 5.750 - 7.72005 = -1.97005 \\approx -1.97 \\text{ GB}\\cdot\\text{inc}
$$

### Coeficient de Correlació ($\\rho_{M, B}$)
$$
\\rho_{M, B} = \\frac{\\text{Cov}(M, B)}{\\sigma_M \\cdot \\sigma_B} = \\frac{-1.97005}{1.765 \\times 1.660} = \\frac{-1.97005}{2.9299} \\approx -0.672395 \\approx -0.673
$$

### Efecte del canvi d'unitats a Megabytes ($M' = 1024 M$)
- **Covariància**: Com que $\\text{Cov}(aX, Y) = a \\cdot \\text{Cov}(X, Y)$:
$$
\\text{Cov}(M', B) = 1024 \\times (-1.97005) \\approx -2017.33 \\approx -2017 \\text{ MB}\\cdot\\text{inc}
$$
  *(La covariància depèn directament de l'escala i unitats de mesura).*
- **Correlació**: Com que $\\sigma_{M'} = 1024 \\sigma_M$:
$$
\\rho_{M', B} = \\frac{1024 \\text{Cov}(M, B)}{1024 \\sigma_M \\cdot \\sigma_B} = \\rho_{M, B} = -0.673
$$
  *(La correlació és un nombre pur adimensional, insensible a canvis d'escala lineals).*

> **Conclusió d'enginyeria**: L'alta correlació negativa ($-0.673$) demostra que dotar els servidors de més memòria RAM redueix de forma dràstica el nombre de bloquejos mensuals i estabilitza notablement el sistema.`
};
