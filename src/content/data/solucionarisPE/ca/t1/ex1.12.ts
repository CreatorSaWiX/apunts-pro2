import type { Solution } from '../../../solutions';

export const ex1_12: Solution = {
  id: 'PE-T1-Ex1.12',
  title: 'Exercici 1.12: Càlcul i interpretació de quantils en VAD i VAC',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Un **quantil d'ordre $p$** ($0 < p < 1$) d'una variable aleatòria és el valor $x_p$ per sota del qual s'acumula una fracció $p$ de la massa total de probabilitat. Quan $p$ s'expressa en percentatge ($100p\\%$), s'anomena **percentil**.

---

### Part 1: Càlcul de quantils en una Variable Aleatòria Contínua (VAC)
La variable aleatòria $X$ mesura **"l'esforç requerit per desenvolupar un projecte de programari"** (en persones/mes). Presenta una funció de densitat triangular en l'interval $[0, 10]$ amb vèrtex superior a $x = 5$:
$$
f_X(x) = \\begin{cases}
\\frac{x}{25}, & \\text{si } 0 \\leq x \\leq 5 \\\\[6pt]
\\frac{10 - x}{25} = \\frac{2}{5} - \\frac{x}{25}, & \\text{si } 5 < x \\leq 10 \\\\[6pt]
0, & \\text{en qualsevol altre cas}
\\end{cases}
$$

**Pregunta**: Quantes persones/mes són necessàries per cobrir el $90\\%$ dels projectes? És a dir, trobeu el quantil $q_{0.9}$ tal que $F_X(q_{0.9}) = 0.90$.

---

### Part 2: Càlcul de quantils en una Variable Aleatòria Discreta (VAD)
Considerem una variable discreta amb la següent funció de distribució acumulada empírica $F_X(k)$:

| Interval de $k$ | $F_X(k) = P(X \\leq k)$ |
| :---: | :---: |
| $(-\\infty, 0)$ | $0.00000$ |
| $[0, 1)$ | $0.10144$ |
| $[1, 2)$ | $0.12448$ |
| $[2, 3)$ | $0.26272$ |
| $[3, 4)$ | $0.63136$ |
| $[4, +\\infty)$ | $1.00000$ |

**Pregunta**: Quin és el quantil de $0.25$ (percentil $25\\%$ o primer quartil $Q_1$)? Indiqueu el criteri normatiu emprat per resoldre l'ambigüitat en variables discretes.`,
  content: `## 1. Càlcul del quantil $0.90$ en la VAC (Esforç de Projecte)

Volem trobar el punt $x_p$ tal que l'àrea acumulada a l'esquerra sigui $0.90$:
$$
F_X(x_p) = \\int_0^{x_p} f_X(t) \\, dt = 0.90 \\iff P(X > x_p) = 1 - 0.90 = 0.10
$$

Com que la distribució és simètrica al voltant de $x = 5$, la mediana és exactament $x_{0.5} = 5$ (on $F_X(5) = 0.50$).
Atès que busquem el quantil $0.90 > 0.50$, sabem amb certesa que $x_p > 5$ i se situa en el tram descendent de la densitat.

### Mètode geomètric (Àrea de la cua dreta)
La regió a la dreta de $x_p$ sota la corba de densitat forma un **triangle rectangle**:
- **Base del triangle**: $b = 10 - x_p$
- **Alçada del triangle**: $h = f_X(x_p) = \\frac{10 - x_p}{25}$

L'àrea d'aquest triangle ha de ser igual a la probabilitat restant ($0.10$):
$$
\\text{Àrea} = \\frac{1}{2} \\cdot \\text{base} \\cdot \\text{alçada} = \\frac{1}{2} \\cdot (10 - x_p) \\cdot \\frac{10 - x_p}{25} = \\frac{(10 - x_p)^2}{50}
$$
Igualem a $0.10$:
$$
\\frac{(10 - x_p)^2}{50} = 0.10 \\implies (10 - x_p)^2 = 5
$$
Prenem l'arrel quadrada positiva (ja que $x_p \\leq 10$):
$$
10 - x_p = \\sqrt{5} \\approx 2.23607
$$
Aïllem $x_p$:
$$
x_p = 10 - \\sqrt{5} = 10 - 2.23607 \\approx 7.76393 \\approx 7.76 \\text{ persones/mes}
$$

> **Solució**: Es requereixen **$7.76$ persones/mes** (homes/mes) per cobrir amb èxit el $90\\%$ dels projectes de desenvolupament.

---

## 2. Càlcul del quantil en VAD (Funció Esglaonada)

En una variable aleatòria discreta, la funció de distribució $F_X(k)$ és una funció en escala (*step function*) discontínua, per la qual cosa en general no existeix cap punt exacte on $F_X(x) = p$.

### Criteri formal de quantils en VAD
S'adopta el criteri universal:
$$
x_p = \\min \\{ k \\in \\mathbb{R} : F_X(k) \\geq p \\}
$$
És a dir: **s'agafa el primer valor $k$ tal que la funció de distribució acumulada superi o iguali la probabilitat desitjada $p$**.

### Avaluació per a $p = 0.25$ (Primer Quartil $Q_1$):
Analitzem els salts de $F_X(k)$:
- Per a $k = 0$: $F_X(0) = 0.10144 < 0.25$
- Per a $k = 1$: $F_X(1) = 0.12448 < 0.25$
- Per a $k = 2$: $F_X(2) = 0.26272 \\geq 0.25$

Com que a $k = 2$ la funció acumulada supera per primera vegada el llindar de $0.25$:
$$
Q_1 = x_{0.25} = 2
$$

---

## 3. Relació amb els percentils i estadística descriptiva

| Notació de Quantil | Percentil equivalent | Significat estadístic |
| :---: | :---: | :--- |
| **$q_{0.25} = Q_1$** | **Percentil 25 (P25)** | Primer quartil: el $25\\%$ de les observacions estan per sota |
| **$q_{0.50} = Q_2$** | **Percentil 50 (Mediana, Me)** | Mediana: divideix la distribució en dues meitats iguals ($50\\%$) |
| **$q_{0.75} = Q_3$** | **Percentil 75 (P75)** | Tercer quartil: el $75\\%$ de les observacions estan per sota |
| **$q_{0.90}$** | **Percentil 90 (P90)** | El $90\\%$ de les observacions estan per sota (valor límit superior típic) |

*(Exemple mostral: si un sistema té mitjana $11.5$ usuaris, la mediana pot indicar que el $50\\%$ del temps hi ha com a molt $9$ usuaris, i el rang interquartílic reflecteix la dispersió central del servei).*`
};
