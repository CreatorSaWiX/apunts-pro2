import type { Solution } from './solutions';

export const m1Solutions: Solution[] = [
    {
        id: 'M1-T1-Ex1.1',
        title: 'Exercici 1.1: Famílies de Grafs',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Per a cadascun dels grafs $N_n$, $K_n$, $T_n$, $C_n$ i $W_n$, doneu-ne:

1. Una representació gràfica per a $n=4$ i $n=6$.
2. La matriu d'adjacència per a $n=5$.
3. L'ordre, la mida, el grau màxim i el grau mínim en funció de $n$.`,
        content: `
### 1. Representació Gràfica ($n=4$ i $n=6$)

Aquí teniu com es veuen aquestes famílies. Fixeu-vos en com creixen!

#### $N_n$ (Graf Nul)
Només vèrtexs, cap aresta. La soledat absoluta.

:::graph
\`\`\`json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": []
}
\`\`\`
:::

#### $K_n$ (Graf Complet)
Tothom connectat amb tothom. El màxim d'arestes possible.

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 3, "target": 4 }
  ]
}
\`\`\`
:::

#### $T_n$ (Trajecte)
Una línia simple.

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }
  ]
}
\`\`\`
:::

#### $C_n$ (Cicle)
Un cercle tancat.

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 1 }
  ]
}
\`\`\`
:::

#### $W_n$ (Roda)
Un cicle de $n-1$ vèrtexs més un centre connectat a tots. (Per $n=4$: triangle + centre).

:::graph{height=200}
\`\`\`json
{
  "nodes": [{ "id": "C", "color": "#facc15" }, { "id": 1 }, { "id": 2 }, { "id": 3 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }
  ]
}
\`\`\`
:::

---

### 2. Matriu d'Adjacència ($n=5$)

Recordeu: $1$ si hi ha aresta, $0$ si no.

**$N_5$ (Nul)**: Tot zeros.
$$
\\begin{pmatrix} 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{pmatrix}
$$

**$K_5$ (Complet)**: Tot uns excepte la diagonal.
$$
\\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 0 & 1 & 1 & 1 \\\\ 1 & 1 & 0 & 1 & 1 \\\\ 1 & 1 & 1 & 0 & 1 \\\\ 1 & 1 & 1 & 1 & 0 \\end{pmatrix}
$$

**$T_5$ (Trajecte)**: Una línia just sobre i sota la diagonal principal.
$$
\\begin{pmatrix} 0 & 1 & 0 & 0 & 0 \\\\ 1 & 0 & 1 & 0 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 0 & 0 & 0 & 1 & 0 \\end{pmatrix}
$$

**$C_5$ (Cicle)**: Com $T_5$ però amb les cantonades $(1,5)$ i $(5,1)$ a 1.
$$
\\begin{pmatrix} 0 & 1 & 0 & 0 & 1 \\\\ 1 & 0 & 1 & 0 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 1 & 0 & 0 & 1 & 0 \\end{pmatrix}
$$

**$W_5$ (Roda)**: Centre connectat a tots (fila/cal 1 plena d'uns), i la resta un cicle $C_4$.
*Assumim vèrtex 1 és el centre*.
$$
\\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 0 & 1 & 0 & 1 \\\\ 1 & 1 & 0 & 1 & 0 \\\\ 1 & 0 & 1 & 0 & 1 \\\\ 1 & 1 & 0 & 1 & 0 \\end{pmatrix}
$$

---

### 3. Propietats en funció de $n$

| Graf | Ordre ($n$) | Mida ($m$) | $\\delta(G)$ (min) | $\\Delta(G)$ (màx) |
|---|---|---|---|---|
| $N_n$ | $n$ | $0$ | $0$ | $0$ |
| $K_n$ | $n$ | $\\frac{n(n-1)}{2}$ | $n-1$ | $n-1$ |
| $T_n$ | $n$ | $n-1$ | $1$ (extrems) | $2$ (interiors) |
| $C_n$ | $n$ ($n \\ge 3$) | $n$ | $2$ | $2$ |
| $W_n$ | $n$ ($n \\ge 4$) | $2(n-1)$ | $3$ (perifèria) | $n-1$ (centre) |

`,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.2',
        title: 'Exercici 1.2: Construcció de Grafs',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Doneu un graf amb la propietat que es demana, explicitant-ne la llista d'adjacències i una representació gràfica.`,
        content: `
### 1) Graf 3-regular d'ordre com a mínim 5

Un graf és $r$-regular si tots els vèrtexs tenen grau $r$. Busquem que tothom tingui 3 amics.
El cas més senzill amb $n \\ge 5$ és el **Prisma Triangular** ($n=6$).

**Llista d'adjacències**:
*   1: [2, 3, 4]
*   2: [1, 3, 5]
*   3: [1, 2, 6]
*   4: [1, 5, 6]
*   5: [2, 4, 6]
*   6: [3, 4, 5]

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 4 },
    { "source": 1, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 6 }
  ]
}
\`\`\`
:::
*Nota: També es coneix com el graf $K_3 \\times K_2$.*

### 2) Graf bipartit d'ordre 6

Volem dividir els 6 vèrtexs en dos equips (per exemple, 3 a cada costat, o 2 vs 4) i només connectar equips diferents.
Un exemple senzill: $C_6$ (l'hexàgon) és bipartit!
Equip A: {1, 3, 5}, Equip B: {2, 4, 6}.

**Llista d'adjacències**:
*   1: [2, 6]
*   2: [1, 3]
*   3: [2, 4]
*   4: [3, 5]
*   5: [4, 6]
*   6: [5, 1]

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 1, "group": 1 }, { "id": 2, "group": 2 }, { "id": 3, "group": 1 },
    { "id": 4, "group": 2 }, { "id": 5, "group": 1 }, { "id": 6, "group": 2 }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 1 }
  ]
}
\`\`\`
:::

### 3) Graf bipartit complet d'ordre 7 ($K_{3,4}$)

Dos conjunts $V_1$ (3 vèrtexs) i $V_2$ (4 vèrtexs). Tots els de $V_1$ connectats a tots els de $V_2$.

:::graph{height=250}
\`\`\`json
{
  "nodes": [
    { "id": "A1", "group": 1, "color": "#ef4444" }, { "id": "A2", "group": 1, "color": "#ef4444" }, { "id": "A3", "group": 1, "color": "#ef4444" },
    { "id": "B1", "group": 2, "color": "#3b82f6" }, { "id": "B2", "group": 2, "color": "#3b82f6" }, { "id": "B3", "group": 2, "color": "#3b82f6" }, { "id": "B4", "group": 2, "color": "#3b82f6" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" }, { "source": "A1", "target": "B4" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "B3" }, { "source": "A2", "target": "B4" },
    { "source": "A3", "target": "B1" }, { "source": "A3", "target": "B2" }, { "source": "A3", "target": "B3" }, { "source": "A3", "target": "B4" }
  ]
}
\`\`\`
:::

### 4) Graf estrella d'ordre 7 ($K_{1,6}$)

Un cas particular de bipartit complet on un conjunt té només 1 vèrtex (el centre).

:::graph
\`\`\`json
{
  "nodes": [
    { "id": "Centre", "color": "#facc15" },
    { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }
  ],
  "links": [
    { "source": "Centre", "target": 1 }, { "source": "Centre", "target": 2 }, { "source": "Centre", "target": 3 },
    { "source": "Centre", "target": 4 }, { "source": "Centre", "target": 5 }, { "source": "Centre", "target": 6 }
  ]
}
\`\`\`
:::
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.3',
        title: 'Exercici 1.3: Regularitat i Bipartició',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Esbrineu si els grafs complet ($K_n$), trajecte ($T_n$) i cicle ($C_n$) d'ordre $n$, amb $n \\ge 1$ o $n \\ge 3$ segons el cas, són bipartits i/o regulars.`,
        content: `
Anem a analitzar cada cas com si fóssim detectius.

#### 1. Graf Complet ($K_n$)
*   **Regular?** **SÍ**. Tothom està connectat a tothom. Grau $n-1$ per a tots.
*   **Bipartit?**
    *   Si $n=1$: Sí (sense arestes).
    *   Si $n=2$: Sí ($1-2$, un a cada equip).
    *   Si $n \ge 3$: **NO**. Perquè $K_3$ és un triangle (cicle de longitud 3), i un graf amb un cicle senar mai pot ser bipartit. (Si jo sóc de l'equip A, el meu veí és del B, el seu veí de l'A... i si ens toquem jo i l'últim, hi ha conflicte!).

#### 2. Graf Trajecte ($T_n$)
*   **Regular?**
    *   Si $n=1$: Sí (grau 0).
    *   Si $n=2$: Sí (grau 1).
    *   Si $n \ge 3$: **NO**. Els extrems tenen grau 1 i els interiors grau 2. No hi ha igualtat.
*   **Bipartit?** **SÍ, SEMPRE**.
    Podem pintar els vèrtexs alternativament: Blanc - Negre - Blanc - Negre... Mai es toquen dos del mateix color.

#### 3. Graf Cicle ($C_n, n \ge 3$)
*   **Regular?** **SÍ**. Tots tenen exactament 2 veïns. És 2-regular.
*   **Bipartit?** Depèn de la paritat de $n$.
    *   Si $n$ és **parell** (ex: quadrat, hexàgon): **SÍ**. Podem alternar colors.
    *   Si $n$ és **senar** (ex: triangle, pentàgon): **NO**. Quan tornem a l'inici del cicle, els colors xoquin.
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.4',
        title: 'Exercici 1.4: Càlcul de Mides',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Doneu la mida de:
        
1. Un graf $r$-regular d'ordre $n$.
2. Del graf bipartit complet $K_{r,s}$.`,
        content: `
### 1) Graf $r$-regular d'ordre $n$

Recordem el **Lema de les Encaixades**: $\\sum g(v) = 2m$.
En un graf $r$-regular, tots els $n$ vèrtexs tenen grau $r$.
Per tant, la suma de graus és $n \cdot r$.

$$
n \cdot r = 2m \implies m = \\frac{n \cdot r}{2}
$$

:::tip
Per això, si $n \cdot r$ és senar, el graf no pot existir! (El lema diu que la suma ha de ser parella).
:::

### 2) Graf bipartit complet $K_{r,s}$

Tenim $r$ vèrtexs a l'Equip A i $s$ vèrtexs a l'Equip B.
Cada vèrtex de l'Equip A tira un cable a **cadascun** dels $s$ vèrtexs de l'Equip B.
Total de cables (arestes): $r$ vegades $s$.

$$
m = r \cdot s
$$

També ho pots veure sumant graus:
*   Els $r$ vèrtexs tenen grau $s$. Suma: $r \cdot s$.
*   Els $s$ vèrtexs tenen grau $r$. Suma: $s \cdot r$.
*   Total suma: $2rs$. Dividit per 2: $rs$.
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.5',
        title: 'Exercici 1.5: Cerca de Subgrafs',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Siguin $V = \{a,b,c,d,e,f\}$ i $A = \{ab, af, ad, be, de, ef\}$. Determineu tots els subgrafs de $G$ d'ordre 4 i mida 4.`,
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
Per tant, hem de triar 4 vèrtexs del conjunt $S = \{a, b, d, e, f\}$.

Les combinacions possibles de 4 vèrtexs de $S$ són (n'hi ha 5):

1.  **$\{a, b, d, e\}$**:
    Arestes disponibles: $ab, ad, be, de$.
    Quantes n'hi ha? 4!
    Formen el cicle $a-b-e-d-a$.
    $\\implies$ **Subgraf vàlid 1**.

2.  **$\{a, f, d, e\}$**:
    Arestes disponibles: $af, ad, de, ef$.
    Quantes n'hi ha? 4!
    Formen el cicle $a-f-e-d-a$.
    $\\implies$ **Subgraf vàlid 2**.

3.  **$\{a, b, e, f\}$**:
    Arestes disponibles: $ab, be, ef, af$.
    Quantes n'hi ha? 4!
    Formen el cicle $a-b-e-f-a$.
    $\\implies$ **Subgraf vàlid 3**.

*Què passa amb les altres combinacions?*
*   $\{b, d, e, f\}$: Arestes $be, de, ef$. Només 3. No val.
*   $\{a, b, d, f\}$: Arestes $ab, ad, af$. Només 3 (l'estrella amb centre $a$). No val.

**Solució**: Hi ha **3** subgrafs. Són els induïts pels conjunts de vèrtexs:
1.  $\{a, b, d, e\}$
2.  $\{a, d, e, f\}$
3.  $\{a, b, e, f\}$
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.6',
        title: 'Exercici 1.6: Subgrafs Induïts',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `El graf $G$ té vèrtexs $V = \{0..8\}$. $u \\sim v \\iff |u-v| \\in \\{1, 4, 5, 8\\}$. Determineu ordre i mida de:

1. El subgraf induït pels parells.
2. El subgraf induït pels senars.
3. El subgraf induït per $\{0, 1, 2, 3, 4\}$.
4. Un subgraf generador amb màxim d'arestes sense cicles.`,
        content: `
Primer, llistem les adjacències. Dos números són amics si la seva diferència és 1, 4, 5 o 8.

*   0: 1, 4, 5, 8
*   1: 0, 2, 5, 6
*   2: 1, 3, 6, 7
*   3: 2, 4, 7, 8
*   4: 0, 3, 5, 8
*   5: 0, 1, 4, 6
*   6: 1, 2, 5, 7
*   7: 2, 3, 6, 8
*   8: 0, 3, 4, 7

#### 1) Subgraf induït pels vèrtexs PARELLS $\{0, 2, 4, 6, 8\}$
**Ordre**: 5 (són 5 números).
**Mida**: Comptem les arestes on *tots dos* siguin parells.
Mirem les diferències:
*   Diferència 1? Mai (parell - parell = parell).
*   Diferència 5? Mai.
*   Diferència 4? Sí. $4-0$, $6-2$, $8-4$.
*   Diferència 8? Sí. $8-0$.

Arestes:
*   (0,4), (0,8)
*   (2,6)
*   (4,8)
Total: 4 arestes.
**Resultat: Ordre 5, Mida 4.**

#### 2) Subgraf induït pels vèrtexs SENARS $\{1, 3, 5, 7\}$
**Ordre**: 4.
**Mida**: Diferències 4 o 8.
*   (1,5) (dif 4)
*   (3,7) (dif 4)
*   (5, ...9 no hi és)
Total: 2 arestes.
**Resultat: Ordre 4, Mida 2.**

#### 3) Subgraf induït per $\{0, 1, 2, 3, 4\}$
**Ordre**: 5.
**Mida**: Busquem arestes on $u,v \in \{0,1,2,3,4\}$. Diferències 1 o 4 (5 i 8 massa grans per aquest conjunt petit).
*   Dif 1: (0,1), (1,2), (2,3), (3,4) $\\to$ 4 arestes.
*   Dif 4: (0,4) $\\to$ 1 aresta.
Total: 5 arestes.
**Resultat: Ordre 5, Mida 5.**
*(Forma un cicle $0-1-2-3-4-0$).*

#### 4) Subgraf generador, màxim d'arestes, sense cicles
Això té un nom: **Arbre generador**.
Un arbre amb $n$ vèrtexs sempre té **$n-1$ arestes**.
Com que $G$ original té $n=9$ vèrtexs, qualsevol subgraf generador tindrà ordre 9.
Si volem el màxim d'arestes sense fer cicles, hem de connectar-ho tot sense tancar camins.
Mida màxima = $9 - 1 = 8$.

**Resultat: Ordre 9, Mida 8.**
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.7',
        title: 'Exercici 1.7: Operacions amb Grafs',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Considereu un graf $G = (V, A)$ amb $V = \{1, 2, 3, 4, 5\}$ i $A = \{12, 13, 23, 24, 34, 45\}$. Doneu el conjunt d'arestes, la matriu d'adjacència i una representació gràfica dels grafs $G^c$, $G - 4$, $G - 45$ i $G + 25$.`,
        content: `
Anem a construir els grafs demanats pas a pas.

**El graf original $G$:**
*   Arestes: $(1,2), (1,3), (2,3)$ (Triangle), $(2,4), (3,4)$ (node 4 connectat a 2 i 3), $(4,5)$ (node 5 penja del 4).
*   Ordre $n=5$, Mida $m=6$.

### 1. Graf Complementari ($G^c$)
Té les arestes que *li falten* a $G$ per ser complet.
En $K_5$ hi ha $\\binom{5}{2} = 10$ arestes possibles. $G$ en té 6. $G^c$ en tindrà 4.
**Arestes**:
*   De 1: $(1,4), (1,5)$ (no està connectat a 4 ni 5 en G).
*   De 2: $(2,5)$ (no connectat a 5).
*   De 3: $(3,5)$ (no connectat a 5).
*   De 4: Cap (connectat a tots excepte 5, però a 5 sí, falta 1, que ja tenim).

$$A(G^c) = \\{14, 15, 25, 35\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}],
  "links": [{"source":1,"target":4}, {"source":1,"target":5}, {"source":2,"target":5}, {"source":3,"target":5}]
}
\`\`\`
:::

### 2. $G - 4$ (Eliminar vèrtex 4)
Eliminem el vèrtex 4 i totes les arestes que el toquen: $(2,4), (3,4), (4,5)$.
Ens queda el triangle $1-2-3$ i el vèrtex 5 aïllat.

$$A(G-4) = \\{12, 13, 23\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":5}],
  "links": [{"source":1,"target":2}, {"source":1,"target":3}, {"source":2,"target":3}]
}
\`\`\`
:::

### 3. $G - 45$ (Eliminar l'aresta 4-5)
Només treiem l'enllaç entre 4 i 5. El vèrtex 5 es queda sol, però encara existeix. (Nota: $45$ aquí es refereix a l'aresta $e=\{4,5\}$).

$$A(G-45) = \\{12, 13, 23, 24, 34\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}],
  "links": [{"source":1,"target":2}, {"source":1,"target":3}, {"source":2,"target":3}, {"source":2,"target":4}, {"source":3,"target":4}]
}
\`\`\`
:::

### 4. $G + 25$ (Afegir aresta 2-5)
Afegim un cable nou entre el 2 i el 5.

$$A(G+25) = \\{12, 13, 23, 24, 34, 45, \\mathbf{25}\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}],
  "links": [{"source":1,"target":2}, {"source":1,"target":3}, {"source":2,"target":3}, {"source":2,"target":4}, {"source":3,"target":4}, {"source":4,"target":5}, {"source":2,"target":5, "color": "orange"}]
}
\`\`\`
:::
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.8',
        title: 'Exercici 1.8: Ordre i Mida',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Considereu un graf $G = (V, A)$ d'ordre $n$ i mida $m$. Siguin $v$ un vèrtex i $a$ una aresta de $G$. Doneu l'ordre i la mida de $G^c$, $G - v$ i $G - a$.`,
        content: `
Aquí tenim les fórmules generals per com canvien l'ordre (vèrtexs) i la mida (arestes) amb operacions bàsiques.

#### 1. Complementari ($G^c$)
*   **Ordre**: $n$ (Manté els mateixos vèrtexs).
*   **Mida**: $\\binom{n}{2} - m$ (Té totes les arestes que NO té $G$).
    *   Recorda que $\\binom{n}{2} = \\frac{n(n-1)}{2}$ és la mida del graf complet $K_n$.

#### 2. Eliminar un vèrtex ($G - v$)
Quan mates un vèrtex, també mates totes les arestes que hi estan connectades (el seu grau).
*   **Ordre**: $n - 1$ (Hem tret un vèrtex).
*   **Mida**: $m - \\text{grau}(v)$ (Hem tret les arestes incidents a $v$).

#### 3. Eliminar una aresta ($G - a$)
Només tallem un cable. Els vèrtexs es queden igual.
*   **Ordre**: $n$ (Intacte).
*   **Mida**: $m - 1$ (Una aresta menys).
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.9',
        title: 'Exercici 1.9: Complementaris Regulars i Bipartits',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Esbrineu si el complementari d'un graf regular és regular, i si el complementari d'un graf bipartit és bipartit. En cas afirmatiu, demostreu-ho; en cas negatiu, doneu un contraexemple.`,
        content: `
#### 1. El complementari d'un graf regular... és regular?
**RESPOSTA: SÍ.**

**Demostració:**
Si $G$ és $k$-regular d'ordre $n$, cada vèrtex té grau $k$.
En el graf complet $K_n$, cada vèrtex té grau $n-1$.
El grau d'un vèrtex $v$ en el complementari $G^c$ és:
$$
\\deg_{G^c}(v) = \\deg_{K_n}(v) - \\deg_{G}(v) = (n-1) - k
$$
Com que $n$, $1$ i $k$ són constants per a tots els vèrtexs, el nou grau és constant per a tothom.
Per tant, $G^c$ és $(n-1-k)$-regular.

---

#### 2. El complementari d'un graf bipartit... és bipartit?
**RESPOSTA: NO necessàriament.**

**Contraexemple ($K_{3,3}$):**
*   $G = K_{3,3}$ és bipartit (per definició).
*   El seu complementari $G^c$ consisteix en les arestes que falten.
    *   En $K_{3,3}$, els del grup A no es toquen entre ells. En $G^c$, SÍ que es tocaran (formaran un $K_3$).
    *   Els del grup B no es toquen entre ells. En $G^c$, SÍ que es tocaran (formaran un altre $K_3$).
*   Per tant, $G^c = K_3 \\cup K_3$ (dos triangles disjunts).
*   Un triangle ($K_3$) NO és bipartit (té cicle senar 3).
*   Per tant, $G^c$ no és bipartit.
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.10',
        title: 'Exercici 1.10: Unió i Producte',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Doneu el conjunt d'arestes i una representació gràfica dels grafs $K_3 \\cup T_3$ i $T_3 \\times K_3$, suposant que els conjunts de vèrtexs de $K_3$ i de $T_3$ són disjunts.`,
        content: `
Definim els nostres jugadors:
*   $K_3$ (Triangle): Vèrtexs $\{1,2,3\}$, Arestes $\{12, 23, 31\}$.
*   $T_3$ (Trajecte/Camí 3): Vèrtexs $\{a,b,c\}$, Arestes $\{ab, bc\}$.

### 1. Unió ($K_3 \\cup T_3$)
Simplement els posem costat a costat. No hi ha connexions entre ells.
**Arestes**: $\{12, 23, 31, ab, bc\}$.

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":"a"}, {"id":"b"}, {"id":"c"}],
  "links": [{"source":1,"target":2}, {"source":2,"target":3}, {"source":3,"target":1}, {"source":"a","target":"b"}, {"source":"b","target":"c"}]
}
\`\`\`
:::

### 2. Producte Cartesià ($T_3 \\times K_3$)
El graf resultant tindrà $3 \\times 3 = 9$ vèrtexs.
Imagineu que agafem el $T_3$ (carril $a-b-c$) i a cada estació hi posem una còpia de $K_3$ (triangle).
Vèrtexs: $(a,1), (a,2), (a,3), (b,1)...$ etc.

**Estructura:**
*   3 Triangles verticals (còpies de $K_3$ a cada posició de $T_3$).
*   Connexions horitzontals seguint el camí $a-b-c$ (exemple: el punt 1 del triangle $a$ es connecta al punt 1 del triangle $b$).

:::graph{height=300}
\`\`\`json
{
  "nodes": [
    {"id":"a1", "group":1}, {"id":"a2", "group":1}, {"id":"a3", "group":1},
    {"id":"b1", "group":2}, {"id":"b2", "group":2}, {"id":"b3", "group":2},
    {"id":"c1", "group":3}, {"id":"c2", "group":3}, {"id":"c3", "group":3}
  ],
  "links": [
    {"source":"a1","target":"a2"}, {"source":"a2","target":"a3"}, {"source":"a3","target":"a1"},
    {"source":"b1","target":"b2"}, {"source":"b2","target":"b3"}, {"source":"b3","target":"b1"},
    {"source":"c1","target":"c2"}, {"source":"c2","target":"c3"}, {"source":"c3","target":"c1"},
    
    {"source":"a1","target":"b1", "color":"#666"}, {"source":"b1","target":"c1", "color":"#666"},
    {"source":"a2","target":"b2", "color":"#666"}, {"source":"b2","target":"c2", "color":"#666"},
    {"source":"a3","target":"b3", "color":"#666"}, {"source":"b3","target":"c3", "color":"#666"}
  ]
}
\`\`\`
:::
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.11',
        title: 'Exercici 1.11: Propietats del Producte',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Considereu els grafs $G_1 = (V_1, A_1)$ i $G_2 = (V_2, A_2)$. Doneu l’ordre, el grau dels vèrtexs i la mida de $G_1 \\times G_2$ en funció dels de $G_1$ i $G_2$.`,
        content: `
Siguin:
*   $G_1$: Ordre $n_1$, Mida $m_1$.
*   $G_2$: Ordre $n_2$, Mida $m_2$.

### 1. Ordre (Vèrtexs)
El conjunt de vèrtexs és el producte cartesià $V_1 \\times V_2$.
Per tant, l'ordre és simplement el producte:
$$N = n_1 \\cdot n_2$$

### 2. Grau d'un vèrtex $(u, v)$
En el producte, un vèrtex $(u,v)$ està connectat a:
*   Veïns de $u$ en $G_1$ (fixant $v$). Aquests són $\\deg_{G_1}(u)$ veïns.
*   Veïns de $v$ en $G_2$ (fixant $u$). Aquests són $\\deg_{G_2}(v)$ veïns.

Total:
$$\\deg(u, v) = \\deg_{G_1}(u) + \\deg_{G_2}(v)$$

### 3. Mida (Arestes)
Podem usar el Lema de les Encaixades: $\\sum \\deg = 2M$.
Sumem els graus de tots els $n_1 n_2$ vèrtexs del producte:

$$
\\sum_{(u,v)} (\\deg_{G_1}(u) + \\deg_{G_2}(v))
$$

Això es trenca en dues sumes:
1.  Per a cada $v \\in V_2$ (n'hi ha $n_2$), sumem tots els graus de $G_1$ (que sumen $2m_1$). $\\to n_2 \\cdot 2m_1$.
2.  Per a cada $u \\in V_1$ (n'hi ha $n_1$), sumem tots els graus de $G_2$ (que sumen $2m_2$). $\\to n_1 \\cdot 2m_2$.

Total suma graus: $2 n_2 m_1 + 2 n_1 m_2$.
La mida $M$ és la meitat:
$$M = n_2 m_1 + n_1 m_2$$
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.12',
        title: 'Exercici 1.12: Teoria de Productes',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Proveu o refuteu les afirmacions següents:

1. Si $G_1$ i $G_2$ són grafs regulars, aleshores $G_1 \\times G_2$ és regular.
2. Si $G_1$ i $G_2$ són grafs bipartits, aleshores $G_1 \\times G_2$ és bipartit.`,
        content: `
#### 1) $G_1, G_2$ regular $\\implies G_1 \\times G_2$ regular?
**VERTADER.**

**Demostració:**
*   Si $G_1$ és $r_1$-regular, $\\forall u, \\deg(u) = r_1$.
*   Si $G_2$ és $r_2$-regular, $\\forall v, \\deg(v) = r_2$.
*   El grau en el producte és la suma: $\\deg(u,v) = r_1 + r_2$.
*   Com que $r_1$ i $r_2$ són constants, la suma també ho és.
*   El producte és $(r_1+r_2)$-regular.

---

#### 2) $G_1, G_2$ bipartit $\\implies G_1 \\times G_2$ bipartit?
**VERTADER.**

**Intuïció:**
En un graf bipartit, podem pintar els vèrtexs de blanc (0) i negre (1) de forma que les arestes només van de 0 a 1.
Definim el color d'un vèrtex $(u,v)$ al producte com la suma de paritats:
$$Color(u,v) = (Color_1(u) + Color_2(v)) \\pmod 2$$

**Vegem si funciona:**
Una aresta en el producte connecta $(u,v)$ amb $(u',v')$. Hi ha dos casos:
1.  **Aresta de tipus G1**: $u \\sim u'$ i $v=v'$.
    *   Com $G_1$ és bipartit, $Color_1(u) \\neq Color_1(u')$.
    *   Com $v=v'$, $Color_2(v) = Color_2(v')$.
    *   Per tant, la suma canvia de paritat. Els colors finals seran diferents.
2.  **Aresta de tipus G2**: $u=u'$ i $v \\sim v'$.
    *   Similarment, $Color_1$ es manté, $Color_2$ canvia. La suma canvia de paritat.

En tots els casos, els veïns tenen colors (paritats) diferents. Per tant, $G_1 \\times G_2$ és bipartit.
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.13',
        title: 'Exercici 1.13: Grafs d\'ordre 3',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Doneu tots els grafs que tenen $V = \{a, b, c\}$ com a conjunt de vèrtexs i representeu-los gràficament.`,
        content: `
Tenim $n=3$ vèrtexs: $a, b, c$.
El nombre màxim d'arestes és $\\binom{3}{2} = 3$. Les possibles arestes són $ab, ac, bc$.
Podem classificar els grafs pel nombre d'arestes ($m$):

### 1) $m=0$ (Cap aresta)
El graf nul $N_3$.
*   Arestes: $\\emptyset$

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [] }
\`\`\`
:::

### 2) $m=1$ (Una aresta)
Hi ha 3 opcions depenent de quina aresta triem ($ab$, $ac$ o $bc$). Són isomorfs, però com a grafs etiquetats són diferents.
*   $G_1$: $\{ab\}$
*   $G_2$: $\{ac\}$
*   $G_3$: $\{bc\}$

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [{"source":"a","target":"b"}] }
\`\`\`
:::
*(Mostrem només el cas $ab$, els altres són equivalents girant el triangle)*

### 3) $m=2$ (Dues arestes)
És equivalent a triar quina aresta *no* hi és (o quin parell no està connectat). 3 opcions.
Es formen camins de longitud 2 ($P_3$).
*   $G_4$: $\{ab, bc\}$ (falta $ac$). Camí $a-b-c$.
*   $G_5$: $\{ab, ac\}$ (falta $bc$). Camí $b-a-c$.
*   $G_6$: $\{ac, bc\}$ (falta $ab$). Camí $a-c-b$.

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [{"source":"a","target":"b"}, {"source":"b","target":"c"}] }
\`\`\`
:::

### 4) $m=3$ (Tres arestes)
El graf complet $K_3$ (Triangle). Només n'hi ha 1.
*   $G_7$: $\{ab, ac, bc\}$

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [{"source":"a","target":"b"}, {"source":"b","target":"c"}, {"source":"c","target":"a"}] }
\`\`\`
:::

**Total**: $1 + 3 + 3 + 1 = 8$ grafs etiquetats.
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.14',
        title: 'Exercici 1.14: Comptant Grafs',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Considereu els grafs que tenen conjunt de vèrtexs $[7] = \{1, 2, 3, 4, 5, 6, 7\}$. Calculeu quants grafs n'hi ha ...

1. ... amb exactament 20 arestes.
2. ... en total.`,
        content: `
El conjunt de vèrtexs té mida $n=7$.
El nombre total de possibles arestes (parelles de vèrtexs) és:
$$
M_{max} = \\binom{n}{2} = \\binom{7}{2} = \\frac{7 \\cdot 6}{2} = 21
$$
Pots imaginar que tenim 21 interruptors, un per cada possible aresta. Cada interruptor pot estar encès (aresta existeix) o apagat (no existeix).

#### 1) Amb exactament 20 arestes
Hem de triar quines 20 arestes activar de les 21 possibles.
Això és el mateix que triar *quina aresta deixar fora*.
$$
\\binom{21}{20} = \\binom{21}{1} = 21
$$
Hi ha **21** grafs amb 20 arestes. (Són tots els grafs isomorfs a $K_7$ menys una aresta).

#### 2) En total
Cada possible aresta pot estar present o no (2 opcions).
Com que tenim 21 possibles arestes, el nombre total de grafs és:
$$
2^{21} = 2.097.152
$$
Són més de 2 milions de grafs!
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.15',
        title: 'Exercici 1.15: Seqüències de Graus',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Per a cadascuna de les seqüències següents, esbrineu si existeixen grafs d'ordre 5 de forma que els graus dels vèrtexs siguin els valors donats. Si existeixen, doneu-ne un exemple.

1.  3, 3, 2, 2, 2
2.  4, 4, 3, 2, 1
3.  4, 3, 3, 2, 2
4.  3, 3, 3, 2, 2
5.  3, 3, 3, 3, 2
6.  5, 3, 2, 2, 2`,
        content: `
Per verificar si una seqüència és gràfica, usem dues regles d'or:
1.  **Lema de les Encaixades**: La suma dels graus ha de ser **PARELLA** ($2m$).
2.  **Grau màxim**: Cap grau pot ser $\\ge n$ (si és simple). En aquest cas, $n=5$, així que graus han de ser $\\le 4$.
3.  **Teorema de Havel-Hakimi** (si calgués, per casos difícils).

Analitzem cas per cas ($n=5$):

**1) 3, 3, 2, 2, 2**
*   Suma: $3+3+2+2+2 = 12$ (Parell). OK.
*   Exemple: Un cicle $C_5$ té graus 2,2,2,2,2. Afegim una corda (aresta extra) entre dos vèrtexs no adjacents. Aquests dos passen a grau 3. Els altres es queden amb 2.
    *   **EXISTEIX**. ($C_5 +$ corda).

**2) 4, 4, 3, 2, 1**
*   Suma: $4+4+3+2+1 = 14$ (Parell). OK.
*   Exemple: Havel-Hakimi.
    *   Trec 4: resta 1 als 4 següents $\\to$ 3, 2, 1, 0.
    *   Seqüència 3, 2, 1, 0. Suma $6$. Prova de treure 3: resta 1 als 3 següents $\\to$ 1, 0, 0.
    *   Seqüència 1, 0, 0. Suma imparella? No, 1. Wait. Un graf amb un node de grau 1 i dos de grau 0 no pot ser (suma imparella 1).
    *   *Correcció*: En Havel-Hakimi ordenem. 4,4,3,2,1.
    *   Trec 4 $\\to$ (resta 1 a 4,3,2,1) $\\to$ 3, 2, 1, 0.
    *   De 3,2,1,0 $\\to$ Trec 3 $\\to$ (resta 1 a 2,1,0) $\\to$ 1, 0, -1. **IMPOSSIBLE**.
    *   **NO EXISTEIX**.

**3) 4, 3, 3, 2, 2**
*   Suma: $4+3+3+2+2 = 14$ (Parell). OK.
*   Exemple: Vèrtex central connectat a tots 4 ($K_{1,4}$, graus 4,1,1,1,1). Afegim arestes als de fora.
    *   Connectem dos de fora (graus passen a 2,2).
    *   Connectem els altres dos de fora (graus passen a 2,2). Tenim 4, 2,2, 2,2. Encara falta.
    *   Havel-Hakimi: $4, 3, 3, 2, 2 \\xrightarrow{-4} 2, 2, 1, 1$. (Treu el 4, resta 1 als altres).
    *   $2, 2, 1, 1 \\xrightarrow{-2} 1, 0, 1 \\to$ Ordenat $1, 1, 0$.
    *   $1, 1, 0 \\xrightarrow{-1} 0, 0$. Possible!
    *   **EXISTEIX**.

**4) 3, 3, 3, 2, 2**
*   Suma: $3+3+3+2+2 = 13$. **IMPARELL**.
*   **NO EXISTEIX** (pel Lema de les Encaixades).

**5) 3, 3, 3, 3, 2**
*   Suma: $3+3+3+3+2 = 14$. (Parell). OK.
*   Exemple: $K_5$ menys algunes arestes? $K_5$ és 4,4,4,4,4.
    *   Trec una aresta: 4,4,4,3,3. No.
    *   Això sembla un graf quasi-regular.
    *   Havel-Hakimi: $3, 3, 3, 3, 2 \\xrightarrow{-3} 2, 2, 2, 2$. (Trec un 3, en queden tres 2 i el 2 final).
    *   $2, 2, 2, 2$ és un cicle $C_4$. Existeix.
    *   **EXISTEIX**.

**6) 5, 3, 2, 2, 2**
*   Grau màxim 5 en un graf d'ordre 5?
*   Impossible. Com a molt pots tenir 4 veïns (els altres 4 vèrtexs). Graf simple no té llaços ni multiarestes.
*   **NO EXISTEIX** (Grau $\\ge n$).
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.16',
        title: 'Exercici 1.16: Regularitat i Paritat',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Demostreu que si un graf és regular de grau senar, aleshores té ordre parell.`,
        content: `
Sigui $G$ un graf $r$-regular d'ordre $n$.
Sabem pel **Lema de les Encaixades** que:
$$
\\sum_{v \\in V} \\deg(v) = 2m
$$
Com que és $r$-regular, la suma de graus és $n \\cdot r$.
$$
n \\cdot r = 2m
$$
El costat dret ($2m$) és sempre un nombre **parell**.
Per tant, el costat esquerre ($n \\cdot r$) ha de ser **parell**.

Si $r$ (el grau) és **senar**, l'única manera que el producte $n \\cdot r$ sigui parell és que $n$ (l'ordre) sigui **parell**.
*(Perquè Senar $\\times$ Senar = Senar. Només Parell $\\times$ Senar = Parell).*

**Q.E.D.**
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.17',
        title: 'Exercici 1.17: Bipartit Regular',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Sigui $G$ un graf bipartit d'ordre $n$ i regular de grau $d \\ge 1$. Quina és la mida de $G$? Pot ser que l'ordre de $G$ sigui senar?`,
        content: `
Sigui un graf bipartit amb partició $(V_1, V_2)$.
Com que és regular de grau $d$:
*   Cada vèrtex de $V_1$ té $d$ arestes. Totes van cap a $V_2$.
*   Cada vèrtex de $V_2$ té $d$ arestes. Totes venen de $V_1$.

El nombre total d'arestes ($m$) es pot comptar sumant els graus de $V_1$ (són exactament les arestes que surten de $V_1$):
$$m = |V_1| \\cdot d$$
I també sumant els graus de $V_2$:
$$m = |V_2| \\cdot d$$

Per tant:
$$|V_1| \\cdot d = |V_2| \\cdot d$$
Com que $d \ge 1$, podem dividir per $d$:
$$|V_1| = |V_2|$$
Això vol dir que **les dues parts del graf bipartit tenen la mateixa mida**.

L'ordre total del graf és $n = |V_1| + |V_2| = |V_1| + |V_1| = 2|V_1|$.
Per tant, **$n$ ha de ser parell**.

**Respostes:**
1.  **Quina és la mida?** $m = \\frac{n}{2} \\cdot d$. (La meitat dels vèrtexs tenen grau $d$).
2.  **Pot ser l'ordre senar?** **No**. Ha de ser parell, perquè $V_1$ i $V_2$ han de tenir els mateixos vèrtexs per mantenir la regularitat.
        `,
        availableLanguages: ['ca']
    },
    {
        id: 'M1-T1-Ex1.18',
        title: 'Exercici 1.18: Fita de la Mida',
        author: 'Profe',
        code: '',
        type: 'notebook',
        statement: `Demostreu que en un graf bipartit d'ordre $n$ la mida és menor o igual que $n^2/4$.`,
        content: `
Sigui un graf bipartit complet $K_{n_1, n_2}$ amb $n_1 + n_2 = n$.
La mida d'un graf bipartit és màxima quan és complet ($K_{n_1, n_2}$).
En aquest cas, la mida és $m = n_1 \\cdot n_2$.

Volem maximitzar el producte $n_1 \\cdot n_2$ subjecte a $n_1 + n_2 = n$.
Substituint $n_2 = n - n_1$:
$$f(n_1) = n_1 (n - n_1) = n \\cdot n_1 - n_1^2$$
Aquesta és una paràbola invertida. El màxim s'assoleix quan $n_1 = n/2$.

*   Si $n$ és parell, $n_1 = n_2 = n/2$.
    *   Màxima mida: $(n/2) \\cdot (n/2) = n^2 / 4$.
*   Si $n$ és senar, $n_1 = (n-1)/2$ i $n_2 = (n+1)/2$ (els enters més propers a $n/2$).
    *   Màxima mida: $\\frac{n-1}{2} \\cdot \\frac{n+1}{2} = \\frac{n^2 - 1}{4}$.
    *   Com que $\\frac{n^2 - 1}{4} < \\frac{n^2}{4}$, la desigualtat $m \\le n^2/4$ es compleix sempre.

**Conclusió:**
La mida màxima d'un graf bipartit es dóna quan les dues particions són el més equilibrades possible. En qualsevol cas, mai supera $n^2/4$.
        `,
        availableLanguages: ['ca']
    }
];
