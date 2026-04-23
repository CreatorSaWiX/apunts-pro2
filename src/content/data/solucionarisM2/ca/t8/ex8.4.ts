import type { Solution } from '../../../solutions';

export const ex8_4: Solution = {
  id: 'M2-T8-Ex4',
  title: 'Exercici 4: Determinació de paràmetres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu els valors de $a, b, c$ tals que la derivada direccional de la funció $f(x,y,z) = axy^2 + byz + cz^2x^3$ en el punt $(1, 2, -1)$ tingui un valor màxim de 64 en una direcció paral·lela a l'eix $OZ$.`,
  content: `### 1. Anàlisi del problema
Sabem dues coses fonamentals sobre la derivada direccional màxima:
1. S'assoleix en la direcció del **gradient** $\\nabla f(1,2,-1)$.
2. El seu valor és el **mòdul del gradient**: $\|\nabla f(P)\| = 64$.

Si la direcció ha de ser paral·lela a l'eix $OZ$, el gradient ha de ser de la forma $(0, 0, k)$. Per tant:
* $f_x(1, 2, -1) = 0$
* $f_y(1, 2, -1) = 0$
* $|f_z(1, 2, -1)| = 64$

### 2. Càlcul de les parcials a $P(1, 2, -1)$
* $f_x = ay^2 + 3cz^2x^2 \\implies f_x(P) = 4a + 3c = 0$
* $f_y = 2axy + bz \\implies f_y(P) = 4a - b = 0$
* $f_z = by + 2czx^3 \\implies f_z(P) = 2b - 2c = \\pm 64$

### 3. Resolució del sistema
De les dues primeres equacions obtenim $c = -4a/3$ i $b = 4a$. Substituïm en la tercera:
$$2(4a) - 2(-4a/3) = \\pm 64 \\implies 8a + \\frac{8a}{3} = \\pm 64$$
$$\\frac{32a}{3} = \\pm 64 \\implies a = \\pm 6$$

### 4. Solucions
Tenim dues combinacions possibles:
1. **Solució 1**: $a = 6, b = 24, c = -8$
2. **Solució 2**: $a = -6, b = -24, c = 8$
`,
  availableLanguages: ['ca']
};
