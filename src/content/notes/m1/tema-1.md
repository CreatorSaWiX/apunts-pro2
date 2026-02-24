---
title: "Tema 1: Conceptes bàsics de grafs"
description: "Introducció a la teoria de grafs: vèrtexs, arestes, graus i representacions. Aprèn els fonaments sense adormir-te."
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

Ara la pregunta clau: **Si sumem els graus de TOTS els vèrtexs, què ens dóna?**

Imaginem una festa. Cada vegada que dues persones es donen la mà (una aresta), hi ha **dues** mans implicades. Si al final comptem quantes mans ha donat cadascú i ho sumem tot, estarem comptant **el doble** de les encaixades reals (una vegada per cada persona).

Això és el **lema de les encaixades**:

$$
\sum g(v) = 2m
$$

<!-- :::tip{title="Nota"}
En aquest curs, tret que es digui el contrari, treballarem amb **Grafs Simples**:
1.  Sense llaços (arestes d'un vèrtex a ell mateix).
2.  Sense arestes múltiples (només una línia entre dos punts).
::: -->

> **Corol·lari**
>
> Com que $2|A|$ sempre és un nombre PARELL, la suma dels graus ha de ser parella.
> Això vol dir que és **impossible** que hi hagi un nombre senar de gent amb un nombre senar d'amics.

## 5. Isomorfisme

Dos grafs són **isomorfs** si tenen la mateixa estructura interna, encara que tinguin etiquetes diferents o estiguin dibuixats de forma diferent.

En aquests dos grafs, el de la dreta és un cicle (un pentàgon) i l'esquerre és una estrella. **Són el mateix graf?**

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

La resposta és **SÍ**. Són isomorfs. Per què? Perquè podem trobar un **diccionari de traducció** (una bijecció) que converteix un en l'altre sense trencar cap connexió.

**El diccionari**:
*   $1 \to A$
*   $2 \to C$
*   $3 \to E$
*   $4 \to B$
*   $5 \to D$

Si comprovem les arestes: al primer graf **1** toca **2**. Al segon, la traducció de 1 (**A**) toca la traducció de 2 (**C**)? Sí! I així amb tots.

**Definició pràctica**: Un isomorfisme és simplement **reetiquetar** els vèrtexs. Si canviant els noms dels vèrtexs d'un graf puc obtenir exactament l'altre, són isomorfs. No importa com els dibuixi (la forma visual enganya), importa qui està connectat amb qui.

## 6. Tipus de grafs

Hi ha certs grafs que surten tants cops que tenen nom propi.

:::::grid{cols=2 class="gap-6"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **1. Graf nul ($N_n$)**
El graf minimalista. Té $n$ vèrtexs i **0 arestes**. Està buit de relacions.

*   **Mida**: 0.
*   **Grau**: 0 (0-regular).

:::graph{height=150}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 } ], "links": [] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **2. Graf trivial ($N_1$)**
El cas més simple possible. Un sol punt a l'univers.
*   **Ordre**: 1.
*   **Mida**: 0.
*   És la "partícula elemental" dels grafs.

:::graph{height=150}
```json
{ "nodes": [ { "id": 1, "label": "Jo sol", "color": "#facc15" } ], "links": [] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **3. Graf trajecte ($T_n$)**
Una línia de punts, sense tancar. Com una cua del supermercat.
*   **Mida**: $n-1$.
*   **Grau**: Extrems 1, Interiors 2.

:::graph{height=150}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **4. Graf cicle ($C_n$)**
Una rotllana tancada ($n \ge 3$).
*   **Mida**: $n$.
*   **Grau**: 2 (2-regular). Tothom té un veí a esquerra i dreta.

:::graph{height=150}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 1 } ] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **5. Graf roda ($W_n$)**
Un cicle ($n-1$) més un centre connectat a tots ("The Hub").
*   **Mida**: $2n-2$.
*   **Graus**: Centre $n-1$, Perifèria 3.

:::graph{height=150}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }, { "source": "C", "target": 4 } ] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **6. Graf complet ($K_n$)**
La "festa perfecta". **Tothom** és amic de **tothom**.
*   **Mida**: $n(n-1)/2$. (Màxim possible).
*   **Grau**: $n-1$ ($(n-1)$-regular).

:::graph{height=150}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 4, "target": 5 } ] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **7. Graf $r$-Regular**
L'equitat total: tots els vèrtexs tenen exactament el mateix grau $r$.
*   $K_n$ i $C_n$ en són exemples.
*   Aquí sota, un graf **3-regular** (Cúbic).

:::graph{height=150}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": 1, "target": 3 }, { "source": 2, "target": 4 } ] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **8. Graf bipartit**
Els vèrtexs es divideixen en dos equips ($V_1, V_2$). Les arestes només van d'un equip a l'altre. **Mai** entre membres del mateix equip.

:::graph{height=150}
```json
{ "nodes": [ { "id": "A1", "group": 1, "color": "#ef4444" }, { "id": "A2", "group": 1, "color": "#ef4444" }, { "id": "B1", "group": 2, "color": "#3b82f6" }, { "id": "B2", "group": 2, "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A1", "target": "B2" } ] }
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-2xl p-6 bg-slate-900/20 hover:bg-slate-900/40 transition-all"}
#### **9. Bipartit complet ($K_{r,s}$)**
Dos equips on **tots** els de l'equip A juguen contra **tots** els de l'equip B.
*   **Mida**: $r \cdot s$.
*   Si $r=1$, és un **Graf Estrella**.

:::graph{height=150}
```json
{ "nodes": [ { "id": "A1", "group": 1, "color": "#ef4444" }, { "id": "B1", "group": 2, "color": "#3b82f6" }, { "id": "B2", "group": 2, "color": "#3b82f6" }, { "id": "B3", "group": 2, "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" } ] }
```
:::
::::

:::::

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

## 8. El Graf complementari ($G^c$)

Imagineu l'univers paral·lel del graf. És el **negatiu** de la foto.

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
<div class="text-xs text-center text-slate-400 mt-2">Les arestes d'aquí són les que <b>faltaven</b> a l'esquerra.</div>
::::

:::::

:::tip{title="Curiositat"}
Hi ha grafs que són **autocomplementaris**: són idèntics al seu "negatiu" ($G \cong G^c$). El pentàgon ($C_5$) n'és un!
:::

## 9. Operacions amb grafs

Igual que sumem i multipliquem números, podem fer-ho amb grafs!

### Graf reunió ($G \cup G'$)
És la suma simple. Agafem dos grafs i els posem junts a la mateixa bossa.
*   **Vèrtexs**: Tots els que hi havia a $G$ més els de $G'$.
*   **Arestes**: Totes les que hi havia.

> Si els grafs no tenien cap vèrtex en comú ($V \cap V' = \emptyset$), l'ordre total és la suma dels ordres ($|V| + |V'|$).

### Graf producte ($G \times G'$)
Aquesta és una mica més complexa, però visualment xulíssima. El **Producte Cartesià** de grafs genera estructures tipus "reixa" o "xarxa". Imaginem-ho així: **Substituïm cada vèrtex del primer graf per una còpia del segon.**

**Exemple**:
Si multipliquem una línia de 3 punts ($P_3$) per una línia de 2 punts ($P_2$), obtenim una escala!

1.  Agafem $P_3$ (l'esquelet vertical vermell).
2.  A cada pis posem una còpia de $P_2$ (horitzontal blau).
3.  Connectem els pisos seguint l'esquelet.

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

Els vèrtexs del producte $G \times G'$ són parelles $(u, v)$, on $u \in V_G$ i $v \in V_{G'}$.
Dos vèrtexs $(u_1, v_1)$ i $(u_2, v_2)$ són adjacents si:

1.  $u_1 = u_2$ i $v_1 \sim v_2$ (mateix vèrtex a $G$, veïns a $G'$).
2.  **O BÉ**: $u_1 \sim u_2$ i $v_1 = v_2$ (veïns a $G$, mateix vèrtex a $G'$).

$$
\text{Ordre Total} = |V| \cdot |V'|
$$
$$
\text{Mida Total} = |V| \cdot |A'| + |V'| \cdot |A|
$$
