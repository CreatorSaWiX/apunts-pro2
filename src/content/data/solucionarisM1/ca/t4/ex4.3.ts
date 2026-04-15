import type { Solution } from '../../../solutions';

export const ex4_3: Solution = {
  id: 'M1-T4-Ex4.3',
  title: 'Exercici 4.3: Ordre i Mida d\'Arbres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $T_1$ un arbre d'ordre $n$ i mida 17 i $T_2$ un arbre d'ordre $2n$. Calculeu $n$ i l'ordre i la mida de $T_2$.`,
  content: `
Per resoldre aquest exercici utilitzem una de les caracteritzacions fonamentals d'un arbre d'ordre $n$ i mida $m$:
$$m = n - 1$$

### 1. Càlcul de $n$ (a partir de $T_1$)
Sabem que $T_1$ és un arbre d'ordre $n$ i mida $m_1 = 17$:
$$m_1 = n - 1$$

$$17 = n - 1 \\implies n = 18$$

### 2. Ordre i mida de $T_2$
Segons l'enunciat, l'arbre $T_2$ té un ordre $n_2 = 2n$:
$$n_2 = 2 \\times 18 = 36$$

Com que $T_2$ també és un arbre, la seva mida $m_2$ ha de seguir la relació $m_2 = n_2 - 1$:
$$m_2 = 36 - 1 = 35$$

**Conclusió:**
- $n = 18$
- Ordre de $T_2$: 36
- Mida de $T_2$: 35
`,
  availableLanguages: ['ca']
};
