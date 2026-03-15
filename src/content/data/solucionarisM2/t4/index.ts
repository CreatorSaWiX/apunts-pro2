import type { Solution } from '../../solutions';

export const m2t4Solutions: Solution[] = [
    {
        id: "M2-T4-Ex2",
        title: "Problema 2: Unicitat de solució per 3^{-x} = x",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Demostreu que l'equació $3^{-x} = x$ té una única solució. Quina és la part entera d'aquesta solució?`,
        content: `Definim la funció auxiliar $f(x) = 3^{-x} - x$. 
        
Com que $f$ és la resta d'una funció exponencial i un polinomi, $f$ és **contínua i derivable** en tot $\mathbb{R}$.

**1. Existència de solució (Teorema de Bolzano):**
Busquem un interval on la funció canviï de signe:
* $f(0) = 3^{-0} - 0 = 1 - 0 = 1 > 0$
* $f(1) = 3^{-1} - 1 = \frac{1}{3} - 1 = -\frac{2}{3} < 0$

Pel Teorema de Bolzano, en ser contínua en $[0, 1]$ i tenir signes oposats als extrems, existeix almenys un punt $c \in (0, 1)$ tal que $f(c) = 0$. Per tant, la part entera de l'arrel és **0**.

**2. Unicitat (Derivada):**
Calculem la derivada de la funció:
$$f'(x) = -3^{-x} \ln(3) - 1$$

Observem que:
* $3^{-x}$ és sempre positiu per a qualsevol $x$.
* $\ln(3) \approx 1.098$ és positiu.
* Per tant, el terme $-3^{-x} \ln(3)$ és sempre negatiu.
* En restar-li $1$, $f'(x) < 0$ per a tot $x \in \mathbb{R}$.

Com que la derivada és **sempre negativa**, la funció és **estrictament decreixent** en tot el seu domini. Una funció estrictament monòtona pot tallar l'eix d'abscisses com a màxim una vegada. Això demostra que la solució trobada és única.`
    },
    {
        id: "M2-T4-Ex4",
        title: "Problema 4: Equació e^{-x} = ln x",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Considerem l'equació $e^{-x} = \ln x$.
a) Doneu un interval de longitud 0.1 que la contingui.
b) Raoneu per què no pot tenir dues solucions.
c) Apliqueu Newton-Raphson amb $x_0 = 1$ (tolerància $10^{-4}$).`,
        content: `Definim la funció $f(x) = e^{-x} - \ln x$. El seu domini és $(0, +\infty)$.

**a) Interval de longitud 0.1:**
Avaluem punts propers fins a detectar canvi de signe:
* $f(1.3) = e^{-1.3} - \ln(1.3) \approx 0.2725 - 0.2623 = 0.0102 > 0$
* $f(1.4) = e^{-1.4} - \ln(1.4) \approx 0.2465 - 0.3364 = -0.0899 < 0$
Per Bolzano, l'arrel es troba a l'interval **$[1.3, 1.4]$**.

**b) Raonament de la unicitat:**
Derivem la funció:
$$f'(x) = -e^{-x} - \frac{1}{x}$$
A l'interval $[1, +\infty)$, tant $e^{-x}$ com $1/x$ són valors positius. En tenir el signe negatiu davant, $f'(x) < 0$ per a tot el domini. La funció és estrictament decreixent, per tant no pot tallar l'eix més d'un cop.

**c) Newton-Raphson ($x_0 = 1$):**
La fórmula iterativa és:
$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)} = x_n - \frac{e^{-x_n} - \ln x_n}{-e^{-x_n} - 1/x_n}$$

* $x_0 = 1$: $x_1 = 1 - \frac{e^{-1} - 0}{-e^{-1} - 1} \approx 1.26894$
* $x_2 \approx 1.3091$
* $x_3 \approx 1.30979$
* $x_4 \approx 1.3097996$ (Assolim error $< 10^{-4}$ en 4 iteracions).`
    }
];
