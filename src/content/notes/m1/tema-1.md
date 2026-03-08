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

Dos grafs són **isomorfs** si tenen la mateixa estructura interna, encara que tinguin etiquetes diferents o estiguin dibuixats de forma diferent. En aquests dos grafs, el de la dreta és un cicle (un pentàgon) i l'esquerre és una estrella. **Són el mateix graf?**

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

La resposta és **sí**. Són isomorfs. Perquè podem trobar un **diccionari de traducció** (una bijecció) que converteix un en l'altre sense trencar cap connexió.

**El diccionari**:
*   $1 \to A$
*   $2 \to C$
*   $3 \to E$
*   $4 \to B$
*   $5 \to D$

Comprovem: al primer graf **1** toca **2**. Al segon, la traducció de 1 (**A**) toca la traducció de 2 (**C**)? Sí. I així amb tots.

Un isomorfisme és simplement **reetiquetar** els vèrtexs. Si canviant els noms dels vèrtexs d'un graf puc obtenir exactament l'altre, són isomorfs. No importa com dibuixi (la forma visual enganya), importa qui està connectat amb qui.

## 6. Tipus de grafs

Hi ha certs grafs que surten tants cops que tenen nom propi:

::::::grid{cols=5 class="gap-3"}

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Nul $N_n$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 } ], "links": [] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = 0$ · Grau $0$</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Trajecte $T_n$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = n{-}1$ · Extrems 1, int. 2</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Cicle $C_n$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 1 } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = n$ · Grau $2$ (2-regular)</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Roda $W_n$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }, { "source": "C", "target": 4 } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = 2(n{-}1)$ · Hub $n{-}1$, ext. $3$</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Complet $K_n$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 4, "target": 5 } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = n(n{-}1)/2$ · Grau $n{-}1$</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">$r$-Regular</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": 1, "target": 3 }, { "source": 2, "target": 4 } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = rn/2$ · Tot grau $= r$</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Bipartit</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#3b82f6" }, { "id": "B2", "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A1", "target": "B2" } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">2 equips, arestes entre ells</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Bip. complet $K_{r,s}$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "B1", "color": "#3b82f6" }, { "id": "B2", "color": "#3b82f6" }, { "id": "B3", "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$m = r \cdot s$ · Si $r{=}1$: Estrella</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">$r$-Partit $G(r,k)$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#3b82f6" }, { "id": "B2", "color": "#3b82f6" }, { "id": "C1", "color": "#10b981" }, { "id": "C2", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "C1" }, { "source": "A1", "target": "C2" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "C1" }, { "source": "A2", "target": "C2" }, { "source": "B1", "target": "C1" }, { "source": "B1", "target": "C2" }, { "source": "B2", "target": "C1" }, { "source": "B2", "target": "C2" } ] }
```
:::
<div class="text-xs text-slate-400 mt-1">$p(G)$: mínim $r$. $p(K_n) = n$</div>
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-3 bg-slate-900/20"}
<div class="text-sm font-bold mb-1">Trivial $N_1$</div>

:::graph{height=100}
```json
{ "nodes": [ { "id": 1, "color": "#facc15" } ], "links": [] }
```
:::
<div class="text-xs text-slate-400 mt-1">$n = 1$, $m = 0$</div>
:::::

::::::

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

::::

:::::

:::tip{title="Curiositat"}
Hi ha grafs que són **autocomplementaris**: són idèntics al seu "negatiu" ($G \cong G^c$). El pentàgon ($C_5$) n'és un!
:::

:::tip{title="Truc d'Examen: Àlgebra del Complementari"}
No intentis dibuixar el complementari si a l'examen et demanen números. L'ordinador de la teva ment ha d'usar aquestes 3 regles d'or:
1.  **Ordre igual:** $n_{G^c} = n$
2.  **Mida invertida:** $m_{G^c} = \frac{n(n-1)}{2} - m$  (Són les arestes totals possibles menys les que ja tens a $G$).
3.  **Grau invertit (Imprescindible):** El nou grau d'un vèrtex és tot allò amb el que no estava connectat a la teva xarxa original. Aquesta fórmula s'usa contínuament:
    $$ g_{G^c}(v) = (n - 1) - g_G(v) $$
:::

:::note{title="Nombre d'Independència ind(G)"}
Un **conjunt independent** de vèrtexs és un grup on **CAP** d'ells és vèrtex adjacent de cap altre de l'equip (0 arestes entre ells, oposat diametral a una secta Completa).
El **nombre d'independència $ind(G)$** o $\alpha(G)$ és el càlcul pur de la mida del conjunt independent més gran possible d'aconseguir en aquell graf.
*(Fixa-t'hi bé: Un conjunt independent a $G$ correspon visualment a ser precisament un subgraf complet pur ($K_r$) a l'univers de $G^c$!)*
:::

## 9. Operacions amb grafs

Igual que sumem i multipliquem números, podem fer-ho amb grafs!

### Graf reunió ($G \cup G'$)
És la suma simple. Agafem dos grafs i els posem junts a la mateixa bossa.
*   **Vèrtexs**: Tots els que hi havia a $G$ més els de $G'$.
*   **Arestes**: Totes les que hi havia.

> Si els grafs no tenien cap vèrtex en comú ($V \cap V' = \emptyset$), l'ordre total és la suma dels ordres ($|V| + |V'|$).

### Potència de Grafs ($G^2$ al Quadrat)
L'estrella destructora dels parcials moderns i el gran filtre "P1" pur per notes.  Avaluar un Graf al Quadrat significa mantenir absolutament íntegre l'univers de nodes, conservar de regal les seves arestes originals i a més atorgar lligams propis nous exclusius referent als **amics dels amics!**  Dues vèrtexs se certifiquen a tenir aresta de xarxa nova si només es trobaven pur i oficialment visual separats a "distància de 2 línies d'aresta de viatge" a dins l'original G! 

:::tip{title="Truc d'Examen: Propietats directes i immediates de G²"}
No t'endinsis directament mai generadores a mà el dibuix genèric complet en paper excepte pur en bucles petits que sumis de rutes de pocs nens. Deduïu la sentència lògica prèvia:
*   **Connexió Indestructible:** Si a la prova diu genèrica "el pur gràfic $G$ de condició referent resultava ja per sí connex lligat en bloc", assegureu en tot pur honor a dita norma referent general d'opció de l'examen que l'estructura originada de cop resultada total de $G^2$ assoleix la certificada condició completament per igual referencial del disseny ser **Connex on tota llibertat genèrica real ho manté**. (Fins i tot acostumarà per si un sol cas atrevit, a reduir dràsticament on es de natural un gran valor alt en diàmetre abstracte en menors referents i àgils salts). 
:::

### Graf producte ($G \times G'$)
Aquesta és una mica més complexa, però visualment xulíssima. El **producte cartesià** de grafs genera estructures tipus "reixa" o "xarxa". Imaginem-ho així: **Substituïm cada vèrtex del primer graf per una còpia del segon.**

**Exemple**:
Si multipliquem una línia de 3 punts ($P_3$) per una línia de 2 punts ($P_2$), obtenim una escala!

 1.  Agafem $P_3$ (l'esquelet vertical vermell). <!-- A graf tot son vertexs lila, arestes blanques  -->
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

:::tip{title="Truc d'Examen: Distàncies al Producte Cartesià"}
Si et pregunten per radis o diàmetres de grafs cartesians ($G \times H$), mai no dibuixis l'estructura final per llarga i absurda! La distància viatjant per la "reixa" conformada és exactament l'addició lliure de les dimensions pures originals:
$$ d_{G \times H}((u_1, v_1), (u_2, v_2)) = d_G(u_1, u_2) + d_H(v_1, v_2) $$
Per tant, respostes de qüestionaris complexos esdevenen sumes de P3:
$$ \text{Diàmetre}(G \times H) = \text{Diàmetre}(G) + \text{Diàmetre}(H) $$
:::

### Combinació Estranya Coronal Mítica ($G \circ H$)
Només surt els pitjors dies plujosos (Examen P1, 2022/2021), a vegades presenten relacions on l'acció s'enuncia com **"Considerem penjar de cadascun pur vèrtex elemental pertanyent de la $G$ totalment una còpia natural i directa pura sota seu en la base totalment el cas de pur disseny genèric de resguards propis $H$"**. Literalment has posat pur a cadascú de l'$n$ element, l'exhibició pur referent on t'atrapen totes sota lligam genèric tots i absoluts.  No el demanaran que ho dibuixes si no us donar formatives variables equacions simples d'estadístiques: 
$$ |V_{G \circ H}| = |V_G| + |V_G| \cdot |V_H| $$  
Els graus pugen exponencialment! El nou absolut grau lligat assignat generalment al l'element original originat esdevé $\text{nou grau} = g_G(v) + |V_H|$. És brutal.