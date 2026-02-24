import type { Solution } from '../../solutions';

export const ex1_5: Solution = {
    id: 'M1-T1-Ex1.5',
    title: 'Exercici 1.5: Cerca de Subgrafs',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Siguin $V = \\{a,b,c,d,e,f\\}$ i $A = \\{ab, af, ad, be, de, ef\\}$. Determineu tots els subgrafs de $G$ d'ordre 4 i mida 4.`,
    content: `
Primer, dibuixem el graf per veure què tenim.

*   $a$ connectat a: $b, f, d$ (Grau 3)
*   $b$ connectat a: $a, e$ (Grau 2)
*   $c$ connectat a: ... **ningú!** $c$ és un vèrtex aïllat.
*   $d$ connectat a: $a, e$ (Grau 2)
*   $e$ connectat a: $b, d, f$ (Grau 3)
*   $f$ connectat a: $a, e$ (Grau 2)

És com un cicle de 5 ($a-b-e-f-a$) amb una corda $a-d-e$ o millor dit, són dos cicles $C_4$ enganxats per l'aresta $ae$... un moment, $ae$ no existeix.
Mirem les connexions:
$a-b-e-d-a$ és un cicle $C_4$.
$a-f-e-d-a$ és un cicle $C_4$.
$a-b-e-f-a$ és un cicle $C_4$.

Busquem subgrafs d'**Ordre 4** (triar 4 vèrtexs) i **Mida 4** (4 arestes d'entre les que hi ha).
Un graf d'ordre 4 i mida 4 sol ser un **Cicle $C_4$** o un **Triangle amb una cua**.

Si volem arestes, hem d'evitar $c$, ja que no en té cap. Si triem $c$, ens queden 3 vèrtexs amb arestes, i el màxim d'arestes en 3 vèrtexs és 3 ($K_3$). Impossible arribar a 4 arestes.
$\\implies$ **El vèrtex $c$ no pot ser al subgraf**.
Per tant, hem de triar 4 vèrtexs del conjunt $S = \\{a, b, d, e, f\\}$.

Les combinacions possibles de 4 vèrtexs de $S$ són (n'hi ha 5):

1.  **$\\{a, b, d, e\\}$**:
    Arestes disponibles: $ab, ad, be, de$.
    Quantes n'hi ha? 4!
    Formen el cicle $a-b-e-d-a$.
    $\\implies$ **Subgraf vàlid 1**.

2.  **$\\{a, f, d, e\\}$**:
    Arestes disponibles: $af, ad, de, ef$.
    Quantes n'hi ha? 4!
    Formen el cicle $a-f-e-d-a$.
    $\\implies$ **Subgraf vàlid 2**.

3.  **$\\{a, b, e, f\\}$**:
    Arestes disponibles: $ab, be, ef, af$.
    Quantes n'hi ha? 4!
    Formen el cicle $a-b-e-f-a$.
    $\\implies$ **Subgraf vàlid 3**.

*Què passa amb les altres combinacions?*
*   $\\{b, d, e, f\\}$: Arestes $be, de, ef$. Només 3. No val.
*   $\\{a, b, d, f\\}$: Arestes $ab, ad, af$. Només 3 (l'estrella amb centre $a$). No val.

**Solució**: Hi ha **3** subgrafs. Són els induïts pels conjunts de vèrtexs:
1.  $\\{a, b, d, e\\}$
2.  $\\{a, d, e, f\\}$
3.  $\\{a, b, e, f\\}$
        `,
    availableLanguages: ['ca']
  };
