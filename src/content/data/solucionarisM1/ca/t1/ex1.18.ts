import type { Solution } from '../../solutions';

export const ex1_18: Solution = {
    id: 'M1-T1-Ex1.18',
    title: 'Exercici 1.18: Fita de la Mida',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Demostreu que en un graf bipartit d'ordre $n$ la mida és menor o igual que $n^2/4$.`,
    content: `
### Pas 1: Quin graf bipartit té més arestes?

Sigui $G$ un graf bipartit amb particions $V_1$ i $V_2$, amb $|V_1| = n_1$ i $|V_2| = n_2$.
La condició és $n_1 + n_2 = n$.

El nombre d'arestes és **màxim** quan $G$ és el graf bipartit **complet** $K_{n_1, n_2}$
(tots de $V_1$ connectats a tots de $V_2$). En aquest cas:
$$m = n_1 \\cdot n_2$$

Per tant, n'hi ha prou amb demostrar que $n_1 \\cdot n_2 \\le \\frac{n^2}{4}$ per a qualsevol $n_1, n_2 \\ge 0$ amb $n_1 + n_2 = n$.

---

### Pas 2: Maximitzar $f(n_1) = n_1 \\cdot n_2$

Substituïm $n_2 = n - n_1$:
$$f(n_1) = n_1 \\cdot (n - n_1) = n \\cdot n_1 - n_1^2$$

Aquesta funció és una **paràbola invertida** en $n_1$ (el coeficient de $n_1^2$ és $-1 < 0$).

---

### Pas 3: Trobar el màxim

Tenim **dues maneres** de trobar on s'assoleix el màxim:

#### Mètode 1 — Derivada igual a zero
$$f'(n_1) = n - 2n_1 = 0 \\implies n_1 = \\frac{n}{2}$$

Com que la paràbola és invertida, aquest únic punt crític és un **màxim**.

#### Mètode 2 — Identitat algebraica
Usem la identitat $(a-b)^2 \\ge 0$:
$$\\left(\\frac{n}{2} - n_1\\right)^2 \\ge 0$$
$$\\frac{n^2}{4} - n \\cdot n_1 + n_1^2 \\ge 0$$
$$\\frac{n^2}{4} \\ge n \\cdot n_1 - n_1^2 = f(n_1)$$

Directament: $f(n_1) \\le \\frac{n^2}{4}$ ✓ (sense necessitat de derivades)

---

### Pas 4: Verificar el valor màxim

Substituint $n_1 = n/2$ (i per tant $n_2 = n/2$):
$$f\\left(\\frac{n}{2}\\right) = \\frac{n}{2} \\cdot \\frac{n}{2} = \\frac{n^2}{4}$$

*   Si $n$ és **parell**: $n_1 = n_2 = n/2$ (enters). Màxim exacte: $\\frac{n^2}{4}$.
*   Si $n$ és **senar**: $n_1 = \\frac{n-1}{2}$, $n_2 = \\frac{n+1}{2}$ (els enters més propers). Màxim: $\\frac{n^2 - 1}{4} < \\frac{n^2}{4}$.

---

### Conclusió

Per a tot graf bipartit d'ordre $n$:
$$m \\le n_1 \\cdot n_2 \\le \\frac{n^2}{4} \\qquad \\square$$

El màxim s'assoleix únicament al graf $K_{n/2,\\, n/2}$ (quan $n$ és parell).
        `,
    availableLanguages: ['ca']
};
