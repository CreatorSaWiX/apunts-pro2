import type { Solution } from '../../../solutions';

export const ex1_11: Solution = {
  id: 'PE-T1-Ex1.11',
  title: "Exercici 1.11: Aeroport IV - VAC de temps de facturació exponencial",
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `D'una altra banda, quan s'ha estudiat el temps que un viatger roman al taulell de facturació d'un aeroport, s'ha determinat que la funció de densitat:
$$f_T(t) = 0.2 \\cdot e^{-0.2t} \\quad \\text{per a } t > 0$$
és un model adequat per a representar la variable aleatòria contínua $T$ de **"temps d'espera i atenció (en minuts)"**.

### Qüestions:
1. Calculeu la funció de distribució acumulada $F_T(t) = P(T \\leq t)$.
2. Calculeu la probabilitat que el temps d'un viatger:
   - Sigui exactament de $7$ minuts ($P(T = 7)$).
   - Sigui de menys de $7$ minuts ($P(T < 7)$).
   - Sigui de més de $7$ minuts ($P(T > 7)$).
   - Estigui comprès entre $7$ i $8$ minuts ($P(7 \\leq T \\leq 8)$).
3. Com podem saber quin és el temps que, en mitjana, un viatger roman a facturació? Quant val aquest temps mitjà?
4. Reflexió: La paraula "mitjana" pot referir-se tant a l'esperança com a la mitjana mostral comuna. En quin context s'està aplicant aquí?`,
  content: `## 1. Modelització i Funció de Distribució Acumulada ($F_T$)

La funció de densitat correspon a una **distribució Exponencial** de paràmetre de taxa $\\lambda = 0.2 \\text{ min}^{-1}$:
$$
f_T(t) = \\lambda e^{-\\lambda t} = 0.2 e^{-0.2t}, \\quad t > 0
$$

Per a qualsevol valor $t > 0$, la funció de distribució acumulada s'obté integrant la densitat des de $0$ fins a $t$:
$$
F_T(t) = P(T \\leq t) = \\int_0^t f_T(u) \\, du = \\int_0^t 0.2 e^{-0.2u} \\, du
$$
Integrem de forma immediata:
$$
F_T(t) = \\left[ -e^{-0.2u} \\right]_0^t = -e^{-0.2t} - (-e^0) = 1 - e^{-0.2t}
$$

Així mateix, la funció de supervivència (probabilitat de cua dreta) és:
$$
P(T > t) = 1 - F_T(t) = e^{-0.2t}
$$

---

## 2. Càlcul de probabilitats d'intervals

### 2.1. El temps sigui exactament de 7 minuts ($P(T = 7)$)
En qualsevol variable aleatòria contínua (VAC), la probabilitat d'un punt aïllat és sempre exactament **zero**:
$$
P(T = 7) = \\int_7^7 f_T(u) \\, du = 0
$$
*(En variables contínues només tenen probabilitat no nul·la els intervals de longitud positiva).*

---

### 2.2. El temps sigui de menys de 7 minuts ($P(T < 7)$)
Avaluem la funció de distribució acumulada a $t = 7$:
$$
P(T < 7) = F_T(7) = 1 - e^{-0.2 \\times 7} = 1 - e^{-1.4}
$$
Com que $e^{-1.4} \\approx 0.246597$:
$$
P(T < 7) = 1 - 0.246597 = 0.753403 \\approx 0.753 \\quad (75.3\\%)
$$

---

### 2.3. El temps sigui de més de 7 minuts ($P(T > 7)$)
És el complementari de l'apartat anterior:
$$
P(T > 7) = 1 - P(T \\leq 7) = e^{-1.4} \\approx 0.246597 \\approx 0.247 \\quad (24.7\\%)
$$

---

### 2.4. El temps estigui entre 7 i 8 minuts ($P(7 \\leq T \\leq 8)$)
Restem les probabilitats acumulades (o integrem entre $7$ i $8$):
$$
P(7 \\leq T \\leq 8) = F_T(8) - F_T(7) = (1 - e^{-0.2 \\times 8}) - (1 - e^{-0.2 \\times 7}) = e^{-1.4} - e^{-1.6}
$$
Calculem les exponencials:
- $e^{-1.4} \\approx 0.246597$
- $e^{-1.6} \\approx 0.201897$
$$
P(7 \\leq T \\leq 8) = 0.246597 - 0.201897 = 0.044700 \\approx 0.045 \\quad (4.47\\%)
$$

---

## 3. Temps mitjà de permanència a facturació

Per a una distribució contínua, el "temps mitjà teòric" és l'**esperança matemàtica** $E[T]$:
$$
E[T] = \\int_0^\\infty t \\cdot f_T(t) \\, dt = \\int_0^\\infty t \\cdot (0.2 e^{-0.2t}) \\, dt
$$
Integrant per parts amb $u = t \\implies du = dt$ i $dv = 0.2 e^{-0.2t} dt \\implies v = -e^{-0.2t}$:
$$
E[T] = \\left[ -t e^{-0.2t} \\right]_0^\\infty + \\int_0^\\infty e^{-0.2t} \\, dt = 0 + \\left[ -\\frac{e^{-0.2t}}{0.2} \\right]_0^\\infty = \\frac{1}{0.2} = 5 \\text{ minuts}
$$

> **Regla general de la distribució Exponencial**:
> $$E[T] = \\frac{1}{\\lambda} = \\frac{1}{0.2} = 5 \\text{ minuts}$$
> En mitjana, un viatger roman exactament **$5$ minuts** al taulell de facturació.

---

## 4. Reflexió: Esperança vs. Mitjana mostral

- En aquest context, la paraula "mitjana" fa referència a l'**esperança matemàtica teòrica** del model probabilístic ($E[T] = 5$ minuts). És el paràmetre poblacional que governa el procés físic.
- Si en canvi registréssim el temps de $100$ viatgers concrets un dimarts al matí i calculéssim la seva mitjana aritmètica $\\overline{t} = \\frac{1}{100}\\sum t_i$, aquesta seria la **mitjana mostral** (que podria donar, per exemple, $4.82$ minuts o $5.31$ minuts degut a la variabilitat aleatòria).`
};
