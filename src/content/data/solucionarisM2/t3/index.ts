import type { Solution } from '../../solutions';

export const m2t3Solutions: Solution[] = [
    {
        id: "M2-T3-Ex8",
        title: "Problema 8: Aproximació d'arrels múltiples mètodes",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Considereu la funció $f(x) = x^3 - x + 5$.
a) Trobeu un interval on s'asseguri l'existència d'una arrel.
b) Calculeu l'arrel amb el mètode de la bissecció ($\eta = 0.05$).
c) Calculeu l'arrel amb el mètode de la secant.
d) Calculeu l'arrel amb el mètode de Newton-Raphson.`,
        content: `Aquest problema està detalladament resolt a les animacions de la teoria.

**a) Existència d'arrel:**
$f(-2) = -1$ i $f(-1) = 5$. Com que $f(-2) \cdot f(-1) < 0$ i la funció és contínua, pel Teorema de Bolzano existeix almenys una arrel a l'interval $(-2, -1)$.

**b) Mètode de la Bissecció:**
Iterant dividint l'interval a la meitat, arribem a $x \approx -1.9063$ en 5 iteracions per assolir l'error $\eta < 0.05$.

**c) Mètode de la Secant:**
Usant els punts inicials $-2$ i $-1$, arribem a $x \approx -1.9041$ en 4 iteracions.

**d) Mètode de Newton-Raphson:**
Amb $x_0 = -2$ i la derivada $f'(x) = 3x^2 - 1$, la convergència és molt ràpida: $x \approx -1.9041$ en només 2 iteracions.`
    }
];
