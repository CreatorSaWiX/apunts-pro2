import type { Solution } from '../../../solutions';

export const ex1_15: Solution = {
  id: 'PE-T1-Ex1.15',
  title: 'Exercici 1.15: Anàlisi de covariància i coeficient de correlació de Pearson',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Suposem dues variables aleatòries discretes $X$ i $Y$ que prenen valors en el conjunt $\\{1, 2, 3, 4\\}$ i la funció de probabilitat conjunta de les quals ve representada a la següent taula:

| $X$ \\ $Y$ | **1** | **2** | **3** | **4** | **Marginal $p_X(x)$** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | $0.150$ | $0.025$ | $0.000$ | $0.025$ | **$0.200$** |
| **2** | $0.025$ | $0.125$ | $0.050$ | $0.025$ | **$0.225$** |
| **3** | $0.050$ | $0.075$ | $0.125$ | $0.075$ | **$0.325$** |
| **4** | $0.025$ | $0.025$ | $0.050$ | $0.150$ | **$0.250$** |
| **Marginal $p_Y(y)$** | **$0.250$** | **$0.250$** | **$0.225$** | **$0.275$** | **$1.000$** |

### Qüestions:
1. Calculeu les esperances marginals $\\mu_X = E[X]$ i $\\mu_Y = E[Y]$.
2. Calculeu les desviacions estàndard marginals $\\sigma_X$ i $\\sigma_Y$.
3. Calculeu el valor esperat del producte creuat $E[XY]$.
4. Determineu la covariància $\\text{Cov}(X, Y)$ i interpreteu el seu signe.
5. Trobeu el coeficient de correlació lineal de Pearson $\\rho_{X,Y}$ i interpreteu la seva magnitud geomètrica i estadística.`,
  content: `## 1. Càlcul de les esperances marginals ($\\mu_X$ i $\\mu_Y$)

### Esperança de $X$ ($E[X]$):
$$
\\mu_X = E[X] = \\sum_{x=1}^4 x \\cdot p_X(x)
$$
$$
\\mu_X = 1(0.200) + 2(0.225) + 3(0.325) + 4(0.250)
$$
$$
\\mu_X = 0.200 + 0.450 + 0.975 + 1.000 = 2.625
$$

### Esperança de $Y$ ($E[Y]$):
$$
\\mu_Y = E[Y] = \\sum_{y=1}^4 y \\cdot p_Y(y)
$$
$$
\\mu_Y = 1(0.250) + 2(0.250) + 3(0.225) + 4(0.275)
$$
$$
\\mu_Y = 0.250 + 0.500 + 0.675 + 1.100 = 2.525
$$

---

## 2. Càlcul de les variàncies i desviacions estàndard

### Per a la variable $X$:
1. Segon moment:
$$
E[X^2] = 1^2(0.200) + 2^2(0.225) + 3^2(0.325) + 4^2(0.250)
$$
$$
E[X^2] = 0.200 + 4(0.225) + 9(0.325) + 16(0.250) = 0.200 + 0.900 + 2.925 + 4.000 = 8.025
$$
2. Variància:
$$
V[X] = E[X^2] - (\\mu_X)^2 = 8.025 - (2.625)^2 = 8.025 - 6.890625 = 1.134375
$$
3. Desviació estàndard:
$$
\\sigma_X = \\sqrt{1.134375} \\approx 1.06507 \\approx 1.065
$$

---

### Per a la variable $Y$:
1. Segon moment:
$$
E[Y^2] = 1^2(0.250) + 2^2(0.250) + 3^2(0.225) + 4^2(0.275)
$$
$$
E[Y^2] = 0.250 + 4(0.250) + 9(0.225) + 16(0.275) = 0.250 + 1.000 + 2.025 + 4.400 = 7.675
$$
2. Variància:
$$
V[Y] = E[Y^2] - (\\mu_Y)^2 = 7.675 - (2.525)^2 = 7.675 - 6.375625 = 1.299375
$$
3. Desviació estàndard:
$$
\\sigma_Y = \\sqrt{1.299375} \\approx 1.13990 \\approx 1.140
$$

---

## 3. Càlcul de $E[XY]$

Sumem tots els productes $x \\cdot y \\cdot P(X=x, Y=y)$:
$$
E[XY] = \\sum_{x=1}^4 \\sum_{y=1}^4 x \\cdot y \\cdot p(x,y)
$$

Desenvolupament fila a fila:
- **Fila $X=1$**:
  $1(1)(0.150) + 1(2)(0.025) + 1(3)(0.000) + 1(4)(0.025) = 0.150 + 0.050 + 0 + 0.100 = 0.300$
- **Fila $X=2$**:
  $2(1)(0.025) + 2(2)(0.125) + 2(3)(0.050) + 2(4)(0.025) = 0.050 + 0.500 + 0.300 + 0.200 = 1.050$
- **Fila $X=3$**:
  $3(1)(0.050) + 3(2)(0.075) + 3(3)(0.125) + 3(4)(0.075) = 0.150 + 0.450 + 1.125 + 0.900 = 2.625$
- **Fila $X=4$**:
  $4(1)(0.025) + 4(2)(0.025) + 4(3)(0.050) + 4(4)(0.150) = 0.100 + 0.200 + 0.600 + 2.400 = 3.300$

Sumant totes les files:
$$
E[XY] = 0.300 + 1.050 + 2.625 + 3.300 = 7.275
$$

---

## 4. Covariància ($\\text{Cov}(X, Y)$)

Apliquem la definició mitjançant la fórmula dels moments:
$$
\\text{Cov}(X, Y) = E[XY] - \\mu_X \\cdot \\mu_Y
$$
$$
\\text{Cov}(X, Y) = 7.275 - (2.625 \\times 2.525) = 7.275 - 6.628125 = 0.646875 \\approx 0.647
$$

> **Interpretació del signe**: La covariància és estrictament positiva ($\\text{Cov} > 0$). Això reflecteix una **relació directa**: quan $X$ pren valors per sobre de la seva mitjana, $Y$ tendeix també a prendre valors superiors a la seva mitjana.

---

## 5. Coeficient de correlació de Pearson ($\\rho_{X,Y}$)

Normalitzem la covariància dividint pel producte de les desviacions típiques:
$$
\\rho_{X, Y} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\cdot \\sigma_Y}
$$
Substituint els valors exactes:
$$
\\rho_{X, Y} = \\frac{0.646875}{1.06507 \\times 1.13990} = \\frac{0.646875}{1.21407} \\approx 0.532816 \\approx 0.533
$$

> **Interpretació de la magnitud**:
> - Sabem que sempre $-1 \\leq \\rho_{X,Y} \\leq 1$.
> - El valor $\\rho = 0.533$ indica una **correlació lineal positiva moderada-alta**.
> - En el gràfic tridimensional de la distribució conjunta s'observa clarament una diagonalització: la massa de probabilitat es concentra en la línia $Y \\approx X$, encara que no és una relació determinista.`
};
