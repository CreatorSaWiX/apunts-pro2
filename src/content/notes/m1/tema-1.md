---
title: "Tema 1: Conceptes bàsics de grafs"
description: "Introducció a la teoria de grafs: vèrtexs, arestes, graus i representacions."
readTime: "15 Min"
order: 1
---

Benvinguts al món dels **Grafs**! 🕸️

A FM, potser estem acostumats a notacions feixugues. Aquí la cosa canvia. La Teoria de Grafs és **visual**, és **tàngible** i és la base de tot: des de com Instagram et suggereix amics fins a com Google Maps troba el camí més ràpid a casa.

## 1. Què és, realment, un graf?

Un graf és simplement un conjunt de **punts** connectats per **línies**.

*   Els punts es diuen **vèrtexs** ($V$).
*   Les línies es diuen **arestes** ($A$).

Prova de moure els vèrtexs d'aquí sota. Veus com les connexions es mantenen encara que els moguis? Això és l'essència d'un graf: no importa *on* estan dibuixats els punts, sinó *com* estan connectats.

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "Tu" },
    { "id": "B", "label": "Amic 1" },
    { "id": "C", "label": "Amic 2" },
    { "id": "D", "label": "Conegut" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "B", "target": "C" },
    { "source": "C", "target": "D" }
  ]
}
```
:::

Un graf $G$ és una parella $(V, A)$ on $V$ és el conjunt de vèrtexs (no buit) i $A$ és el conjunt d'arestes.

- **Ordre ($n$)**: El nombre de vèrtexs, $n = |V|$.
- **Mida ($m$)**: El nombre d'arestes, $m = |A|$.

## 2. Relacions: veïns i incidència

Quan dos vèrtexs estan units per una aresta, diem que són **adjacents** (o veïns). 

*   Si $u$ i $v$ estan connectats, escrivim: $u \sim v$
*   L'aresta que ens uneix diem que és **incident** en nosaltres.

:::graph
```json
{
  "nodes": [
    { "id": 1, "label": "u", "color": "#ef4444" },
    { "id": 2, "label": "v", "color": "#3b82f6" },
    { "id": 3, "label": "No adjacent", "color": "#9ca3af" }
  ],
  "links": [
    { "source": 1, "target": 2, "label": "u ~ v" }
  ]
}
```
:::

Al graf de dalt, $u$ i $v$ són adjacents. El vèrtex gris està sol i no és adjacent a ningú.

## 3. Com ho veu l'ordinador?

Tenim dues grans maneres de guardar un graf a la memòria:

### A. Llista d'adjacències
Per a cada persona, tenim una llista dels seus amics. Ideal per grafs amb poques arestes ja que estalvia memòria. **Exemple**: "L'usuari u és amic de [v, w, z]".

### B. Matriu d'adjacències
Una taula ($n \times n$) de 0 i 1. Si la matriu té un $1$ a la posició $(i, j)$, el vèrtex $i$ està connectat amb el $j$. 

$$
M_A = \begin{pmatrix}
0 & \mathbf{1} & 0 \\
\mathbf{1} & 0 & 1 \\
0 & 1 & 0
\end{pmatrix}
$$

*   $1$ si hi ha aresta (connexió).
*   $0$ si no n'hi ha.

Veiem que com les amistats són mútues, la matriu és **simètrica**. I la diagonal tot zeros, perquè ningú és amic d'ell mateix (no hi ha llaços).

:::tip{title="Graus a la Matriu"}
La suma numèrica dels valors d'una fila $i$ (o columna) és **exactament el grau** d'aquell vèrtex.
$$ \sum_{j=1}^n (M_A)_{ij} = g(v_i) $$
*Si a l'examen et diuen: "Tenim una matriu d'adjacència on cada fila suma 5", t'estan dient que estem davant d'un graf **5-regular**.*
:::

## 4. Graus i el "lema de les encaixades"

El **grau** d'un vèrtex $g(v)$ és el nombre d'arestes que hi toquen. O sigui, el nombre d'amics que té.

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "Grau 3" },
    { "id": "B", "label": "Grau 1" },
    { "id": "C", "label": "Grau 1" },
    { "id": "D", "label": "Grau 1" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "A", "target": "D" }
  ]
}
```
:::

Al graf de dalt, el vèrtex central té grau 3. Els altres, grau 1.

**Si sumem els graus de TOTS els vèrtexs, què ens dóna?**

Imaginem una festa. Cada vegada que dues persones es donen la mà (una aresta), hi ha **dues** mans implicades. Si al final comptem quantes mans ha donat cadascú i ho sumem tot, estarem comptant **el doble** de les encaixades reals. Això és el **lema de les encaixades**:

$$
\sum g(v) = 2m
$$

> **Seqüència de graus**:
> És simplement fer una llista amb els graus de tots els vèrtexs, endreçada generalment de més gran a més petit.
> Ex: Un graf "triangle amb una cua penjant" té llista de graus $S = (3, 2, 2, 1)$.

Com que $2|A|$ sempre és un nombre PARELL, la suma dels graus ha de ser parella. Això vol dir que és **impossible** que hi hagi un nombre senar de gent amb un nombre senar d'amics.

## 5. Isomorfisme

Dos grafs són **isomorfs** si tenen la mateixa estructura interna, encara que tinguin etiquetes diferents o estiguin dibuixats de forma diferent. En aquests dos grafs, el de la dreta és un cicle (un pentàgon) i l'esquerre és una estrella.

::::grid{cols=2}
:::graph{height=220}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 5 },
    { "source": 5, "target": 1 }
  ]
}
```
:::

:::graph{height=220}
```json
{
  "nodes": [ { "id": "A" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" } ],
  "links": [
    { "source": "A", "target": "C" }, { "source": "C", "target": "E" },
    { "source": "E", "target": "B" }, { "source": "B", "target": "D" },
    { "source": "D", "target": "A" }
  ]
}
```
:::
::::

**Són el mateix graf?** La resposta és **sí**. Són isomorfs. Perquè podem trobar un **diccionari de traducció** (una bijecció) que converteix un en l'altre sense trencar cap connexió.

**El diccionari**:
*   $1 \to A$
*   $2 \to C$
*   $3 \to E$
*   $4 \to B$
*   $5 \to D$

Comprovem: al primer graf **1** toca **2**. Al segon, la traducció de 1 (**A**) toca la traducció de 2 (**C**)? Sí. I així amb tots.

Un isomorfisme és simplement **reetiquetar** els vèrtexs. Si canviant els noms dels vèrtexs d'un graf puc obtenir exactament l'altre, són isomorfs. No importa com dibuixi (la forma visual enganya), importa qui està connectat amb qui.

## 6. Tipus de grafs

A continuació es detallen els grafs fonamentals que s'utilitzen contínuament i cal dominar per als problemes teòrics:

::::::grid{cols=5 class="gap-3 mb-8"}

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Nul ($N_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#525252" }, { "id": 2, "color":"#525252" }, { "id": 3, "color":"#525252" } ], "links": [] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Trajecte ($T_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#3b82f6" }, { "id": 2, "color":"#3b82f6" }, { "id": 3, "color":"#3b82f6" }, { "id": 4, "color":"#3b82f6" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Cicle ($C_5$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#3b82f6" }, { "id": 2, "color":"#3b82f6" }, { "id": 3, "color":"#3b82f6" }, { "id": 4, "color":"#3b82f6" }, { "id": 5, "color":"#3b82f6" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 1 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Complet ($K_5$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#a855f7" }, { "id": 2, "color":"#a855f7" }, { "id": 3, "color":"#a855f7" }, { "id": 4, "color":"#a855f7" }, { "id": 5, "color":"#a855f7" } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 4, "target": 5 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### $r$-Regular

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#ec4899" }, { "id": 2, "color":"#ec4899" }, { "id": 3, "color":"#ec4899" }, { "id": 4, "color":"#ec4899" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": 1, "target": 3 }, { "source": 2, "target": 4 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Bipartit

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A1", "target": "B2" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Bip. com. ($K_{3,2}$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" }, { "id": "B3", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "B3" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### $r$-Partit

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" }, { "id": "C1", "color": "#3b82f6" }, { "id": "C2", "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "C1" }, { "source": "A1", "target": "C2" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "C1" }, { "source": "A2", "target": "C2" }, { "source": "B1", "target": "C1" }, { "source": "B1", "target": "C2" }, { "source": "B2", "target": "C1" }, { "source": "B2", "target": "C2" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Estrella ($S_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": "1", "color": "#3b82f6" }, { "id": "2", "color": "#3b82f6" }, { "id": "3", "color": "#3b82f6" } ], "links": [ { "source": "C", "target": "1" }, { "source": "C", "target": "2" }, { "source": "C", "target": "3" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Roda ($W_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": 1, "color":"#a8a29e" }, { "id": 2, "color":"#a8a29e" }, { "id": 3, "color":"#a8a29e" }, { "id": 4, "color":"#a8a29e" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }, { "source": "C", "target": 4 } ] }
```
:::
:::::

::::::

| Tipus de graf | Notació | Propietats i definicions | Mida | Grau |
| --- | :---: | --- | --- | --- |
| **Nul** | $N_n$ | El conjunt d'arestes és buit. Els vèrtexs estan totalment aïllats a l'espai. | $0$ | $0$ |
| **Trivial** | $N_1$ | Graf que conté 1 vèrtex i 0 arestes. | $0$ | $0$ |
| **Trajecte** | $T_n$ | Seqüència simple on la llista d'adjacència és oberta. No tanca cap cicle de relació. | $n-1$ | Extrems: 1<br/>Int: 2 |
| **Cicle** | $C_n$ | Subgraf tancat sense interseccions diagonals on l'ordre cardinal i la mida són idèntics. | $n$ | $2$ |
| **Complet** | $K_n$ | El conjunt d'arestes $A$ conté absolutament tots els parells possibles. | $\frac{n(n-1)}{2}$ | $n-1$ |
| **$r$-Regular** | - | La totalitat dels integrants forcen un grau paramètric idèntic. | $\frac{rn}{2}$ | $r$ |
| **Bipartit** | - | $V = V_1 \cup V_2$ amb $V_1 \cap V_2 = \emptyset$. Exigeix absència de cicles de longitud senar internament. | $\le \frac{n^2}{4}$ | Limitades |
| **Bip. Complet** | $K_{r,s}$ | Màxima existència teòrica de lligams creuats incondicionals entre ambdues faccions formals. | $r \cdot s$ | $r$ i $s$ |
| **Estrella** | $K_{1,s}$ | El cas particular clàssic del bipartit complet previ asimètric on un extrem de la partició val u. | $s$ | $1$ i $s$ |
| **Roda** | $W_n$ | Composició pura formativa per subgraf $C_{n-1}$ unit amb un vèrtex de tipus nexe exterior. | $2(n-1)$ | $3$ i $n-1$ |
| **$r$-Partit** | $G(V_1 \dots V_r)$ | Partició de $V$ en $r$ conjunts estables $V_i$ tals que no hi ha arestes entre vèrtexs del mateix grup. | - | Limitades |

## 7. Subgrafs

Abans d'entrar en detalls, entenguem la diferència entre estar "sencer" i que et faltin peces.

:::::grid{cols=2 class="gap-4"}



:::graph{height=120}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 3, "target": 4 } ] }
```
:::


:::graph{height=120}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 3, "target": 4 } ] }
```
:::

:::::

Si tenim un graf $G$, un **subgraf** és qualsevol resultat d'eliminar vèrtexs o arestes. Mai podem afegir res nou!

Hi ha dos tipus de "retalls" especials:

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Subgraf generador**
Mantenim **TOTS els vèrtexs**, però esborrem algunes arestes.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3, "color": "#ef4444" } ],
  "links": [ { "source": 1, "target": 2 } ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2">Original era un triangle. El vèrtex 3 (vermell) segueix allà, sol.</div>
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Subgraf induït ($G[S]$)**
Triem un "equip" de vèrtexs $S$ i ens quedem amb **TOTES** les seves arestes internes.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2">Retallem un tros de la xarxa, mantenint les connexions locals.</div>
::::

:::::

## 8. El graf complementari ($G^c$)

Imagineu l'univers paral·lel del graf. És el **negatiu** de la foto. Hi ha grafs que són **autocomplementaris**: són idèntics al seu "negatiu" ($G \cong G^c$). El pentàgon ($C_5$) n'és un.

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Graf original ($G$)**
Dos vèrtexs connectats (Amics).

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [ { "source": 1, "target": 2 }, { "source": 3, "target": 4 } ]
}
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Graf complementari ($G^c$)**
Ara els amics es barallen, i els desconeguts es fan amics.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [
    { "source": 1, "target": 3 }, { "source": 1, "target": 4 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 },
    { "source": 1, "target": 4 }, { "source": 2, "target": 3 }
  ]
}
```
:::

::::

:::::

:::tip{title="Àlgebra del complementari"}
No intentis dibuixar el complementari si a l'examen et demanen números. L'ordinador de la teva ment ha d'usar aquestes 3 regles d'or:
1.  **Ordre igual:** $n_{G^c} = n$
2.  **Mida invertida:** $m_{G^c} = \frac{n(n-1)}{2} - m$  (Són les arestes totals possibles menys les que ja tens a $G$).
3.  **Grau invertit (Imprescindible):** El nou grau d'un vèrtex és tot allò amb el que no estava connectat a la teva xarxa original. Aquesta fórmula s'usa contínuament:
    $$ g_{G^c}(v) = (n - 1) - g_G(v) $$
:::


- **Conjunt independent**: Subconjunt de vèrtexs $S \subseteq V$ on **cap parell** de vèrtexs és adjacent (0 arestes internes). A $G$ és un subgraf complet (tros que forma un graf complet) al graf complementari $G^c$.
- **Nombre d'independència $\alpha(G)$**: Mida del conjunt independent més gran del graf.


## 9. Operacions amb grafs

### Graf reunió ($G \cup G'$)
És la unió disjunta de dos grafs. Simplement els dibuixem un al costat de l'altre.
- **Vèrtex i Arestes**: $V_{total} = V \cup V'$ i $A_{total} = A \cup A'$.
- Si $V \cap V' = \emptyset$ (no comparteixen nodes), l'ordre total és exactament $n + n'$.

**Exemple**: $C_3 \cup C_3$
:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#3b82f6" }, { "id": 2, "color": "#3b82f6" }, { "id": 3, "color": "#3b82f6" },
    { "id": 4, "color": "#ef4444" }, { "id": 5, "color": "#ef4444" }, { "id": 6, "color": "#ef4444" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 4 }
  ]
}
```
:::

### Potència de Grafs ($G^k$)
- **Definició ($G^2$):** Manté els nodes de $G$. Dos nodes són adjacents si la seva distància original a $G$ és **$\le 2$**.
- **Regla general ($G^k$):** $u \sim v$ si $dist_G(u, v) \le k$.
- **Examen:** Si $G$ és connex (tema 2), $G^2$ també ho és i el seu diàmetre es redueix (més "dreceres").

**Exemple**: $P_4^2$ (Nodes distància $\le 2$ connectats)
:::graph{height=150}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [
    { "source": 1, "target": 2, "color": "#94a3b8" }, { "source": 2, "target": 3, "color": "#94a3b8" }, { "source": 3, "target": 4, "color": "#94a3b8" },
    { "source": 1, "target": 3, "color": "#f43f5e", "name": "Dist 2" }, { "source": 2, "target": 4, "color": "#f43f5e", "name": "Dist 2" }
  ]
}
```
:::

### Graf producte ($G \times H$)
El **producte cartesià** genera estructures tipus "reixa". Substituïm cada vèrtex de $G$ per una còpia de $H$ i els connectem seguint l'estructura de $G$.

**Exemple**: $P_3 \times P_2$ (una escala)

:::graph
```json
{
  "nodes": [
    { "id": "1A", "label": "1A", "group": 1 }, { "id": "1B", "label": "1B", "group": 1 },
    { "id": "2A", "label": "2A", "group": 2 }, { "id": "2B", "label": "2B", "group": 2 },
    { "id": "3A", "label": "3A", "group": 3 }, { "id": "3B", "label": "3B", "group": 3 }
  ],
  "links": [
    { "source": "1A", "target": "1B" }, { "source": "2A", "target": "2B" }, { "source": "3A", "target": "3B" },
    { "source": "1A", "target": "2A" }, { "source": "2A", "target": "3A" },
    { "source": "1B", "target": "2B" }, { "source": "2B", "target": "3B" }
  ]
}
```
:::

- **Ordre**: $n_{G \times H} = n_G \cdot n_H$
- **Mida**: $m_{G \times H} = n_G \cdot m_H + n_H \cdot m_G$

:::tip{title="Distàncies al Producte"}
La distància al producte és la suma de les distàncies:
$$ d_{G \times H}((u_1, v_1), (u_2, v_2)) = d_G(u_1, u_2) + d_H(v_1, v_2) $$
$$ \text{Diàmetre}(G \times H) = \text{Diàmetre}(G) + \text{Diàmetre}(H) $$
:::

### Producte coronal ($G \circ H$)
Es construeix agafant una còpia de $G$ i $n_G$ còpies de $H$, i connectant cada vèrtex $i$ de $G$ amb **tots** els vèrtexs de la seva còpia corresponent de $H$.
- **Ordre**: $n_{G \circ H} = n_G(1 + n_H)$
- **Grau d'un vèrtex $v \in G$**: $g_{original}(v) + n_H$
- **Mida**: $m_{G \circ H} = m_G + n_G(m_H + n_H)$

**Exemple**: $K_2 \circ N_2$ (Cada node de $K_2$ es connecta a una parella de nodes nous)
:::graph{height=200}
```json
{
  "nodes": [
    { "id": "G1", "color": "#facc15" }, { "id": "G2", "color": "#facc15" },
    { "id": "H1_1", "color": "#3b82f6" }, { "id": "H1_2", "color": "#3b82f6" },
    { "id": "H2_1", "color": "#ef4444" }, { "id": "H2_2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "G1", "target": "G2" },
    { "source": "G1", "target": "H1_1" }, { "source": "G1", "target": "H1_2" },
    { "source": "G2", "target": "H2_1" }, { "source": "G2", "target": "H2_2" }
  ]
}
```
:::