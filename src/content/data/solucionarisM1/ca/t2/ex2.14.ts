import type { Solution } from '../../../solutions';

export const ex2_14: Solution = {
    id: 'M1-T2-Ex2.14',
    title: 'Exercici 2.14: Distàncies amb algorisme BFS',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Considereu els grafs de l'exercici 2.4. Doneu la distància dels vèrtexs $a$ i $b$ a tots els vèrtexs del component connex on es troben aplicant l'algorisme BFS.`,
    content: `
L'algorisme **BFS** divideix el graf en **capes expansives** que representen directament la distància al destí respectiu iteratiu de manera més visual:

### Distàncies pel Graf 1
El component original que conté \`a\` i \`b\` només agrupa a $\\{a,b,d,e,f,g,i,j\\}$.

| Inici | Nivell 0 $(d=0)$ | Nivell 1 $(d=1)$ | Nivell 2 $(d=2)$ | Nivell 3 $(d=3)$ |
|:---:|:---:|:---:|:---:|:---:|
| **$d(a, \\cdot)$** | $a$ | $d, e, f$ | $b$ | $g, i, j$ |
| **$d(b, \\cdot)$** | $b$ | $d, g, i, j$ | $a, e, f$ | *(no hi ha)* |

<br/>

**Taula de resultats exactes individuals**:
| Vèrtex $v$ | a | b | d | e | f | g | i | j |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$d(a, v)$** | 0 | 2 | 1 | 1 | 1 | 3 | 3 | 3 |
| **$d(b, v)$** | 2 | 0 | 1 | 2 | 2 | 1 | 1 | 1 |

---

### Distàncies pel Graf 2
El component principal on habiten només té $\\{a, b, d, e, g, h, j, m\\}$.

| Inici | Nivell 0 $(d=0)$ | Nivell 1 $(d=1)$ | Nivell 2 $(d=2)$ | Nivell 3 $(d=3)$ |
|:---:|:---:|:---:|:---:|:---:|
| **$d(a, \\cdot)$** | $a$ | $b, j$ | $d, e, g, h$ | $m$ |
| **$d(b, \\cdot)$** | $b$ | $a, d, e, g, h, j$ | $m$ | *(no hi ha)* |

<br/>

**Taula de resultats exactes individuals**:
| Vèrtex $v$ | a | b | d | e | g | h | j | m |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$d(a, v)$** | 0 | 1 | 2 | 2 | 2 | 2 | 1 | 3 |
| **$d(b, v)$** | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 2 |

  `,
    availableLanguages: ['ca']
};
