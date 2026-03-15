import type { Solution } from '../../solutions';

export const m2t5Solutions: Solution[] = [
    {
        id: "M2-T5-Ex1",
        title: "Problema 1: Polinomi de Taylor i resta de Lagrange",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu el polinomi de Taylor de grau 3 de la funció $f(x) = \ln(x)$ centrat a $a=1$. Escriviu també el resta de Lagrange.`,
        content: `**1. Càlcul de les derivades en $a=1$:**
* $f(x) = \ln(x) \implies f(1) = 0$
* $f'(x) = \frac{1}{x} \implies f'(1) = 1$
* $f''(x) = -\frac{1}{x^2} \implies f''(1) = -1$
* $f'''(x) = \frac{2}{x^3} \implies f'''(1) = 2$

**2. Construcció del polinomi $P_3$:**
$$P_3(x) = f(a) + \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f'''(a)}{3!}(x-a)^3$$
$$P_3(x) = 0 + 1(x-1) - \frac{1}{2}(x-1)^2 + \frac{2}{6}(x-1)^3$$
$$P_3(x) = (x-1) - \frac{1}{2}(x-1)^2 + \frac{1}{3}(x-1)^3$$

**3. Resta de Lagrange:**
Necessitem la quarta derivada: $f^{(4)}(x) = -\frac{6}{x^4}$.
El resta per a un $c$ entre 1 i $x$ és:
$$R_3(x) = \frac{f^{(4)}(c)}{4!}(x-1)^4 = \frac{-6/c^4}{24}(x-1)^4 = -\frac{1}{4c^4}(x-1)^4$$`
    },
    {
        id: "M2-T5-Ex2",
        title: "Problema 2: Aproximació de valors i acotació de l'error",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Aproximu el valor de $\sqrt{e}$ usant un polinomi de Taylor de grau 2 per a $f(x) = e^x$ en $a=0$. Acoteu l'error comès.`,
        content: `**1. Polinomi de Taylor de $e^x$ en $a=0$:**
Sabem que per a $e^x$, totes les derivades en 0 valen 1.
$$P_2(x) = 1 + x + \frac{x^2}{2}$$

**2. Aproximació de $\sqrt{e}$:**
$\sqrt{e} = e^{0.5}$, per tant substituïm $x = 0.5$:
$$\sqrt{e} \approx P_2(0.5) = 1 + 0.5 + \frac{0.5^2}{2} = 1 + 0.5 + 0.125 = 1.625$$

**3. Acotació de l'error (Resta de Lagrange):**
$R_2(0.5) = \frac{f^{(3)}(c)}{3!}(0.5)^3 = \frac{e^c}{6} \cdot 0.125$ per a algun $c \in (0, 0.5)$.
Com que $e^x$ és creixent, el valor màxim de $e^c$ en l'interval és $e^{0.5} < \sqrt{4} = 2$ (sabem que $e < 4$).
$$|R_2(0.5)| \leq \frac{e^{0.5}}{6} \cdot 0.125 < \frac{2}{6} \cdot 0.125 \approx 0.0416$$
L'error és menor que $0.0416$. El valor real és $\approx 1.6487$, així que $1.6487 - 1.625 = 0.0237$ (dins de la fita).`
    }
];
