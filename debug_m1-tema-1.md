---
title: "Solucionari: Tema 1: Conceptes bàsics de grafs"
author: "Apunts"
---

# Solucionari: Tema 1: Conceptes bàsics de grafs

*Introducció a la teoria de grafs: vèrtexs, arestes, graus i representacions.*

---

## Exercici 1.1: Famílies de Grafs

### Enunciat

Per a cadascun dels grafs $ N_n $, $ K_n $, $ T_n $, $ C_n $ i $ W_n $, doneu-ne:

1. Una representació gràfica per a $ n=4 $ i $ n=6 $.
2. La matriu d'adjacència per a $ n=5 $.
3. L'ordre, la mida, el grau màxim i el grau mínim en funció de $ n $.

### Solució



  ### 1. Representacions i Matrius ($ n=4, 5, 6 $)

### $ N_n $ (Graf Nul)


*[Gràfic interactiu disponible a la versió web de l'apunt]*



*[Gràfic interactiu disponible a la versió web de l'apunt]*


$$
\begin{pmatrix} 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix}
$$


### $ K_n $ (Graf Complet)


*[Gràfic interactiu disponible a la versió web de l'apunt]*



*[Gràfic interactiu disponible a la versió web de l'apunt]*


$$
\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\ 1 & 0 & 1 & 1 & 1 \\ 1 & 1 & 0 & 1 & 1 \\ 1 & 1 & 1 & 0 & 1 \\ 1 & 1 & 1 & 1 & 0 \end{pmatrix}
$$


### $ T_n $ (Trajecte)


*[Gràfic interactiu disponible a la versió web de l'apunt]*



*[Gràfic interactiu disponible a la versió web de l'apunt]*


$$
\begin{pmatrix} 0 & 1 & 0 & 0 & 0 \\ 1 & 0 & 1 & 0 & 0 \\ 0 & 1 & 0 & 1 & 0 \\ 0 & 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 1 & 0 \end{pmatrix}
$$


### $ C_n $ (Cicle)


*[Gràfic interactiu disponible a la versió web de l'apunt]*



*[Gràfic interactiu disponible a la versió web de l'apunt]*


$$
\begin{pmatrix} 0 & 1 & 0 & 0 & 1 \\ 1 & 0 & 1 & 0 & 0 \\ 0 & 1 & 0 & 1 & 0 \\ 0 & 0 & 1 & 0 & 1 \\ 1 & 0 & 0 & 1 & 0 \end{pmatrix}
$$


### $ W_n $ (Roda)


*[Gràfic interactiu disponible a la versió web de l'apunt]*



*[Gràfic interactiu disponible a la versió web de l'apunt]*


$$
\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\ 1 & 0 & 1 & 0 & 1 \\ 1 & 1 & 0 & 1 & 0 \\ 1 & 0 & 1 & 0 & 1 \\ 1 & 1 & 0 & 1 & 0 \end{pmatrix}
$$



### 3. Propietats en funció de $ n $

| Graf | Ordre ($ n $) | Mida ($ m $) | $\delta(G)$ (min) | $\Delta(G)$ (màx) |
|---|---|---|---|---|
| $ N_n $ | $ n $ | $ 0 $ | $ 0 $ | $ 0 $ |
| $ K_n $ | $ n $ | $\frac{n(n-1)}{2}$ | $ n-1 $ | $ n-1 $ |
| $ T_n $ | $ n $ | $ n-1 $ | $ 1 $ (extrems) | $ 2 $ (interiors) |
| $ C_n $ | $ n $ ($ n \ge 3 $) | $ n $ | $ 2 $ | $ 2 $ |
| $ W_n $ | $ n $ ($ n \ge 4 $) | $ 2(n-1)$ | $ 3 $ (perifèria) | $ n-1 $ (centre) |



---

## Exercici 1.2: Construcció de Grafs

### Enunciat

Doneu un graf amb la propietat que es demana, explicitant-ne la llista d'adjacències i una representació gràfica.

### Solució


### 1) Graf 3-regular d'ordre com a mínim 5

Un graf és $ r $-regular si tots els vèrtexs tenen grau $ r $. Busquem que tothom tingui 3 amics.
El cas més senzill amb $ n \ge 5 $ és el **Prisma Triangular** ($ n=6 $).

**Llista d'adjacències**:
*   1: [2, 3, 4]
*   2: [1, 3, 5]
*   3: [1, 2, 6]
*   4: [1, 5, 6]
*   5: [2, 4, 6]
*   6: [3, 4, 5]


*[Gràfic interactiu disponible a la versió web de l'apunt]*

*Nota: També es coneix com el graf $ K_3 \times K_2 $.*

### 2) Graf bipartit d'ordre 6

Volem dividir els 6 vèrtexs en dos equips (per exemple, 3 a cada costat, o 2 vs 4) i només connectar equips diferents.
Un exemple senzill: $ C_6 $ (l'hexàgon) és bipartit!
Equip A: {1, 3, 5}, Equip B: {2, 4, 6}.

**Llista d'adjacències**:
*   1: [2, 6]
*   2: [1, 3]
*   3: [2, 4]
*   4: [3, 5]
*   5: [4, 6]
*   6: [5, 1]


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 3) Graf bipartit complet d'ordre 7 ($ K_{3,4}$)

Dos conjunts $ V_1 $ (3 vèrtexs) i $ V_2 $ (4 vèrtexs). Tots els de $ V_1 $ connectats a tots els de $ V_2 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 4) Graf estrella d'ordre 7 ($ K_{1,6}$)

Un cas particular de bipartit complet on un conjunt té només 1 vèrtex (el centre).


*[Gràfic interactiu disponible a la versió web de l'apunt]*

        

---

## Exercici 1.3: Regularitat i Bipartició

### Enunciat

Esbrineu si els grafs complet ($ K_n $), trajecte ($ T_n $) i cicle ($ C_n $) d'ordre $ n $, amb $ n \ge 1 $ o $ n \ge 3 $ segons el cas, són bipartits i/o regulars.

### Solució


#### 1. Graf Complet ($ K_n $)
*   **Regular?** **SÍ**. Tothom està connectat a tothom. Grau $ n-1 $ per a tots.
*   **Bipartit?**
    *   Si $ n=1 $: Sí (sense arestes).
    *   Si $ n=2 $: Sí ($ 1-2 $, un a cada equip).
    *   Si $ n \ge 3 $: **NO**. Perquè $ K_3 $ és un triangle (cicle de longitud 3), i un graf amb un cicle senar mai pot ser bipartit. (Si jo sóc de l'equip A, el meu veí és del B, el seu veí de l'A... i si ens toquem jo i l'últim, hi ha conflicte!).

#### 2. Graf Trajecte ($ T_n $)
*   **Regular?**
    *   Si $ n=1 $: Sí (grau 0).
    *   Si $ n=2 $: Sí (grau 1).
    *   Si $ n \ge 3 $: **NO**. Els extrems tenen grau 1 i els interiors grau 2. No hi ha igualtat.
*   **Bipartit?** **SÍ, SEMPRE**.
    Podem pintar els vèrtexs alternativament: Blanc - Negre - Blanc - Negre... Mai es toquen dos del mateix color.

#### 3. Graf Cicle ($ C_n, n \ge 3 $)
*   **Regular?** **SÍ**. Tots tenen exactament 2 veïns. És 2-regular.
*   **Bipartit?** Depèn de la paritat de $ n $.
    *   Si $ n $ és **parell** (ex: quadrat, hexàgon): **SÍ**. Podem alternar colors.
    *   Si $ n $ és **senar** (ex: triangle, pentàgon): **NO**. Quan tornem a l'inici del cicle, els colors xoquin.
        

---

## Exercici 1.4: Càlcul de Mides

### Enunciat

Doneu la mida de:
        
1. Un graf $ r $-regular d'ordre $ n $.
2. Del graf bipartit complet $ K_{r,s}$.

### Solució


### 1) Graf $ r $-regular d'ordre $ n $

Recordem el **Lema de les Encaixades**: $\sum g(v) = 2m $.
En un graf $ r $-regular, tots els $ n $ vèrtexs tenen grau $ r $.
Per tant, la suma de graus és $ n \cdot r $.

$$
n \cdot r = 2m \implies m = \frac{n \cdot r}{2}
$$


> **Nota Principal**
>
> Per això, si $ n \cdot r $ és senar, el graf no pot existir! (El lema diu que la suma ha de ser parella).


### 2) Graf bipartit complet $ K_{r,s}$

Tenim $ r $ vèrtexs a l'Equip A i $ s $ vèrtexs a l'Equip B.
Cada vèrtex de l'Equip A tira un cable a **cadascun** dels $ s $ vèrtexs de l'Equip B.
Total de cables (arestes): $ r $ vegades $ s $.

$$
m = r \cdot s
$$

També ho pots veure sumant graus:
*   Els $ r $ vèrtexs tenen grau $ s $. Suma: $ r \cdot s $.
*   Els $ s $ vèrtexs tenen grau $ r $. Suma: $ s \cdot r $.
*   Total suma: $ 2rs $. Dividit per 2: $ rs $.
        

---

## Exercici 1.5: Cerca de Subgrafs

### Enunciat

Siguin $ V = \{a,b,c,d,e,f\}$ i $ A = \{ab, af, ad, be, de, ef\}$. Determineu tots els subgrafs de $ G $ d'ordre 4 i mida 4.

### Solució


Primer, dibuixem el graf per veure què tenim.

*   $ a $ connectat a: $ b, f, d $ (Grau 3)
*   $ b $ connectat a: $ a, e $ (Grau 2)
*   $ c $ connectat a: ... **ningú!** $ c $ és un vèrtex aïllat.
*   $ d $ connectat a: $ a, e $ (Grau 2)
*   $ e $ connectat a: $ b, d, f $ (Grau 3)
*   $ f $ connectat a: $ a, e $ (Grau 2)


*[Gràfic interactiu disponible a la versió web de l'apunt]*


*Nota: $ c $ és un vèrtex aïllat (grau 0), pintat en gris.*

És com un cicle de 5 ($ a-b-e-f-a $) amb una corda $ a-d-e $. 

**Solució**: Hi ha **3** subgrafs. Són els induïts pels conjunts de vèrtexs:
1.  $\{a, b, d, e\}$
2.  $\{a, d, e, f\}$
3.  $\{a, b, e, f\}$
        

---

## Exercici 1.6: Subgrafs Induïts

### Enunciat

El graf $ G $ té vèrtexs $ V = \{0..8\}$. $ u \sim v \iff |u-v| \in \{1, 4, 5, 8\}$. Determineu ordre i mida de:

1. El subgraf induït pels parells.
2. El subgraf induït pels senars.
3. El subgraf induït per $\{0, 1, 2, 3, 4\}$.
4. Un subgraf generador amb màxim d'arestes sense cicles.

### Solució


Traduïm l'enunciat: Tenim graf $ G $ amb vèrtexs de 0 a 8 (9 en total). Dos vèrtexs estan connectats si la distància és de 1, 4, 5 o 8. Primer, llistem les adjacències.

*   0: 1, 4, 5, 8
*   1: 0, 2, 5, 6
*   2: 1, 3, 6, 7
*   3: 2, 4, 7, 8
*   4: 0, 3, 5, 8
*   5: 0, 1, 4, 6
*   6: 1, 2, 5, 7
*   7: 2, 3, 6, 8
*   8: 0, 3, 4, 7


*[Gràfic interactiu disponible a la versió web de l'apunt]*


#### 1) Subgraf induït pels vèrtexs PARELLS $\{0, 2, 4, 6, 8\}$


*[Gràfic interactiu disponible a la versió web de l'apunt]*



**Ordre**: 5 (són 5 números).
**Mida**: Comptem les arestes on *tots dos* siguin parells.
Arestes: (0,4), (0,8), (2,6), (4,8) → Total: 4 arestes.
**Resultat: Ordre 5, Mida 4.**

#### 2) Subgraf induït pels vèrtexs SENARS $\{1, 3, 5, 7\}$


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**Ordre**: 4.
**Mida**: Diferències 4 o 8.
*   (1,5) (dif 4)
*   (3,7) (dif 4)
Total: 2 arestes.
**Resultat: Ordre 4, Mida 2.**

#### 3) Subgraf induït per $\{0, 1, 2, 3, 4\}$


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**Ordre**: 5.
**Mida**: Busquem arestes on $ u,v \in \{0,1,2,3,4\}$. Diferències 1 o 4 (5 i 8 massa grans per aquest conjunt petit).
*   Dif 1: (0,1), (1,2), (2,3), (3,4) $\to $ 4 arestes.
*   Dif 4: (0,4) $\to $ 1 aresta.
Total: 5 arestes.
**Resultat: Ordre 5, Mida 5.**
*(Forma un cicle $ 0-1-2-3-4-0 $).*

#### 4) Subgraf generador, màxim d'arestes, sense cicles
Això té un nom: **Arbre generador**.
Un arbre amb $ n $ vèrtexs sempre té **$ n-1 $ arestes**.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


Com que $ G $ original té $ n=9 $ vèrtexs, qualsevol subgraf generador tindrà ordre 9.
Si volem el màxim d'arestes sense fer cicles, hem de connectar-ho tot sense tancar camins.
Mida màxima = $ 9 - 1 = 8 $.

**Resultat: Ordre 9, Mida 8.**
        

---

## Exercici 1.7: Operacions amb Grafs

### Enunciat

Considereu un graf $ G = (V, A)$ amb $ V = \{1, 2, 3, 4, 5\}$ i $ A = \{12, 13, 23, 24, 34, 45\}$. Doneu el conjunt d'arestes, la matriu d'adjacència i una representació gràfica dels grafs $ G^c $, $ G - 4 $, $ G - 45 $ i $ G + 25 $.

### Solució


Anem a construir els grafs demanats pas a pas.

**El graf original $ G $:**
*   Arestes: $(1,2), (1,3), (2,3)$ (Triangle), $(2,4), (3,4)$ (node 4 connectat a 2 i 3), $(4,5)$ (node 5 penja del 4).
*   Ordre $ n=5 $, Mida $ m=6 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 1. Graf Complementari ($ G^c $)
Té les arestes que *li falten* a $ G $ per ser complet.
En $ K_5 $ hi ha $\binom{5}{2} = 10 $ arestes possibles. $ G $ en té 6. $ G^c $ en tindrà 4.


> **Nota Principal**
>
> **$\binom{5}{2} = 10 $**: el nombre de parelles possibles entre 5 vèrtexs (4+3+2+1):
> 
> *   Fixant el 1: {1,2} {1,3} {1,4} {1,5} → **4**
> *   Fixant el 2: {2,3} {2,4} {2,5} → **3**
> *   Fixant el 3: {3,4} {3,5} → **2**
> *   Fixant el 4: {4,5} → **1**


$$
A(G^c) = \{14, 15, 25, 35\}
$$


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 2. $ G - 4 $ (Eliminar vèrtex 4)
Eliminem el vèrtex 4 i totes les arestes que el toquen: $(2,4), (3,4), (4,5)$.
Ens queda el triangle $ 1-2-3 $ i el vèrtex 5 aïllat.

$$
A(G-4) = \{12, 13, 23\}
$$


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 3. $ G - 45 $ (Eliminar l'aresta 4-5)
Només treiem l'enllaç entre 4 i 5. El vèrtex 5 es queda sol, però encara existeix.

$$
A(G-45) = \{12, 13, 23, 24, 34\}
$$


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 4. $ G + 25 $ (Afegir aresta 2-5)
Afegim un cable nou entre el 2 i el 5.

$$
A(G+25) = \{12, 13, 23, 24, 34, 45, \mathbf{25}\}
$$


*[Gràfic interactiu disponible a la versió web de l'apunt]*

        

---

## Exercici 1.8: Ordre i mida

### Enunciat

Considereu un graf $ G = (V, A)$ d'ordre $ n $ i mida $ m $. Siguin $ v $ un vèrtex i $ a $ una aresta de $ G $. Doneu l'ordre i la mida de $ G^c $, $ G - v $ i $ G - a $.

### Solució


*Notació: $ n $ = nombre de vèrtexs (ordre), $ m $ = nombre d'arestes (mida).*

#### 1. Complementari ($ G^c $)
*   **Ordre**: $ n $ (Manté els mateixos vèrtexs).
*   **Mida**: $\binom{n}{2} - m $ (Té totes les arestes que NO té $ G $).
    *   Recorda que $\binom{n}{2} = \frac{n(n-1)}{2}$ és la mida del graf complet $ K_n $.

#### 2. Eliminar un vèrtex ($ G - v $)
Quan mates un vèrtex, també mates totes les arestes que hi estan connectades (el seu grau).
*   **Ordre**: $ n - 1 $ (Hem tret un vèrtex).
*   **Mida**: $ m - \text{grau}(v)$ (Hem tret les arestes incidents a $ v $).

#### 3. Eliminar una aresta ($ G - a $)
Només tallem un cable. Els vèrtexs es queden igual.
*   **Ordre**: $ n $ (Intacte).
*   **Mida**: $ m - 1 $ (Una aresta menys).
        

---

## Exercici 1.9: Complementaris Regulars i Bipartits

### Enunciat

Esbrineu si el complementari d'un graf regular és regular, i si el complementari d'un graf bipartit és bipartit. En cas afirmatiu, demostreu-ho; en cas negatiu, doneu un contraexemple.

### Solució


### 1. El complementari d'un graf regular... és regular?

**Sí**. Si tots els vèrtexs tenen el mateix nombre d'amics en $ G $, tots tindran el mateix nombre de *no-amics* en $ G^c $. Com que tots perden el mateix, tots guanyen el mateix.

**Exemple concret** — Agafem el prisma triangular (6 vèrtexs, 3-regular):


*[Gràfic interactiu disponible a la versió web de l'apunt]*


Cada vèrtex té grau 3. En $ K_6 $ cada vèrtex té grau 5. Per tant, en $ G^c $ cada vèrtex tindrà grau $ 5 - 3 = 2 $. Tots igual → **$ G^c $ és 2-regular**

**Fórmula general:** Si $ G $ és $ k $-regular d'ordre $ n $:
$$
\text{grau en } G^c = (n-1) - k
$$

---

### 2. El complementari d'un graf bipartit... és bipartit?

**No necessàriament.**

**Contraexemple:** Agafem $ K_{3,3}$: dos grups de 3 (A = {1,2,3}, B = {4,5,6}), tots connectats entre grups, ningú dins el mateix grup.

$ G = K_{3,3}$ (bipartit):

*[Gràfic interactiu disponible a la versió web de l'apunt]*


Ara calculem $ G^c $ (les arestes que **falten** a $ K_{3,3}$ per ser $ K_6 $):
- Dins del grup A (1,2,3): cap aresta en $ G $ → **totes apareixen** en $ G^c $: (1,2), (1,3), (2,3)
- Dins del grup B (4,5,6): cap aresta en $ G $ → **totes apareixen** en $ G^c $: (4,5), (4,6), (5,6)
- Entre A i B: totes hi eren a $ G $ → **cap queda** en $ G^c $

$ G^c = K_3 \cup K_3 $ (dos triangles sense connexió entre ells):

*[Gràfic interactiu disponible a la versió web de l'apunt]*


Un triangle ($ K_3 $) **no és bipartit** perquè té un cicle de longitud 3 (senar). Per ser bipartit cal no tenir cicles senars. Per tant, $ G^c $ **no és bipartit**. [X]
        

---

## Exercici 1.10: Unió i Producte

### Enunciat

Doneu el conjunt d'arestes i una representació gràfica dels grafs $ K_3 \cup T_3 $ i $ T_3 \times K_3 $, suposant que els conjunts de vèrtexs de $ K_3 $ i de $ T_3 $ són disjunts.

### Solució


Definim els nostres jugadors:
*   $ K_3 $ (Triangle): Vèrtexs $\{1,2,3\}$, Arestes $\{12, 23, 31\}$.
*   $ T_3 $ (Trajecte/Camí 3): Vèrtexs $\{a,b,c\}$, Arestes $\{ab, bc\}$.

### 1. Unió ($ K_3 \cup T_3 $)
Simplement els posem costat a costat. No hi ha connexions entre ells.
**Arestes**: $\{12, 23, 31, ab, bc\}$.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 2. Producte Cartesià ($ T_3 \times K_3 $)
El graf resultant tindrà $ 3 \times 3 = 9 $ vèrtexs.
Imagineu que agafem el $ T_3 $ (carril $ a-b-c $) i a cada estació hi posem una còpia de $ K_3 $ (triangle).
Vèrtexs: $(a,1), (a,2), (a,3), (b,1)...$ etc.

**Estructura:**
*   3 Triangles verticals (còpies de $ K_3 $ a cada posició de $ T_3 $).
*   Connexions horitzontals seguint el camí $ a-b-c $ (exemple: el punt 1 del triangle $ a $ es connecta al punt 1 del triangle $ b $).


*[Gràfic interactiu disponible a la versió web de l'apunt]*

        

---

## Exercici 1.11: Propietats del Producte

### Enunciat

Considereu els grafs $ G_1 = (V_1, A_1)$ i $ G_2 = (V_2, A_2)$. Doneu l'ordre, el grau dels vèrtexs i la mida de $ G_1 \times G_2 $ en funció dels de $ G_1 $ i $ G_2 $.

### Solució


Siguin:
*   $ G_1 $: Ordre $ n_1 $, Mida $ m_1 $.
*   $ G_2 $: Ordre $ n_2 $, Mida $ m_2 $.

### 1. Ordre (Vèrtexs)
El conjunt de vèrtexs és el producte cartesià $ V_1 \times V_2 $.
Per tant, l'ordre és simplement el producte:
$$
N = n_1 \cdot n_2
$$

### 2. Grau d'un vèrtex $(u, v)$
En el producte, un vèrtex $(u,v)$ està connectat a:
*   Veïns de $ u $ en $ G_1 $ (fixant $ v $). Aquests són $ g_{G_1}(u)$ veïns.
*   Veïns de $ v $ en $ G_2 $ (fixant $ u $). Aquests són $ g_{G_2}(v)$ veïns.

Total:
$$
g(u, v) = g_{G_1}(u) + g_{G_2}(v)
$$

### 3. Mida (Arestes)

**Idea:** ja sabem el grau de cada vèrtex (apartat 2). La mida és la meitat de la suma de tots els graus (Lema de les Encaixades: $\sum \text{grau} = 2M $).

**Exemple concret** — $ K_2 \times K_3 $:
*   $ K_2 $: 2 vèrtexs {A, B}, 1 aresta, tots de grau 1.
*   $ K_3 $: 3 vèrtexs {1, 2, 3}, 3 arestes, tots de grau 2.
*   Producte: $ 2 \times 3 = 6 $ vèrtexs: (A,1), (A,2), (A,3), (B,1), (B,2), (B,3).

Grau de cada vèrtex (per l'apartat 2):

| Vèrtex | Grau $ G_1 $ + Grau $ G_2 $ | Total |
|--------|------------------------|-------|
| (A,1)  | 1 + 2 | 3 |
| (A,2)  | 1 + 2 | 3 |
| (A,3)  | 1 + 2 | 3 |
| (B,1)  | 1 + 2 | 3 |
| (B,2)  | 1 + 2 | 3 |
| (B,3)  | 1 + 2 | 3 |

Suma de tots els graus = $ 6 \times 3 = 18 $. Mida $= 18 / 2 = \mathbf{9}$.

Comprovació amb la fórmula: $ M = n_2 m_1 + n_1 m_2 = 3 \cdot 1 + 2 \cdot 3 = 3 + 6 = 9 $ [OK]

**Com s'arriba a la fórmula general?**

Fem exactament el mateix que a l'exemple, però amb lletres.

Sumem els graus de tots els vèrtexs $(u,v)$ — *a l'exemple, sumàvem els 6 valors de la taula*:
$$
\sum_{(u,v)} \bigl(\text{grau}_{G_1}(u) + \text{grau}_{G_2}(v)\bigr)
$$

Ho separem en dues parts:

1. **Part de $ G_1 $** — *a l'exemple: fixem cada $ v \in \{1,2,3\}$ i sumem els graus d'A i B en $ K_2 $. Sumen $ 2m_1 = 2 $, i ho fem $ n_2 = 3 $ vegades:*
$$
n_2 \cdot 2m_1 = 3 \cdot 2 \cdot 1 = 6
$$

2. **Part de $ G_2 $** — *a l'exemple: fixem cada $ u \in \{A,B\}$ i sumem els graus de 1, 2, 3 en $ K_3 $. Sumen $ 2m_2 = 6 $, i ho fem $ n_1 = 2 $ vegades:*
$$
n_1 \cdot 2m_2 = 2 \cdot 2 \cdot 3 = 12
$$

Suma total de graus: $ 6 + 12 = 18 $ — *coincideix amb la taula!* Dividim per 2:
$$
\boxed{M = n_2 m_1 + n_1 m_2 = 3 \cdot 1 + 2 \cdot 3 = 9}
$$
        

---

## Exercici 1.12: Teoria de Productes

### Enunciat

Proveu o refuteu les afirmacions següents:

1. Si $ G_1 $ i $ G_2 $ són grafs regulars, aleshores $ G_1 \times G_2 $ és regular.
2. Si $ G_1 $ i $ G_2 $ són grafs bipartits, aleshores $ G_1 \times G_2 $ és bipartit.

### Solució


### 1) $ G_1, G_2 $ regular $\implies G_1 \times G_2 $ regular?

**Sí. Demostració:**
*   Si $ G_1 $ és $ r_1 $-regular, $\forall u \in V_1: \text{grau}(u) = r_1 $.
*   Si $ G_2 $ és $ r_2 $-regular, $\forall v \in V_2: \text{grau}(v) = r_2 $.
*   El grau en el producte: $\text{grau}(u,v) = r_1 + r_2 $ (constant per a tots els vèrtexs).
*   El producte és $(r_1+r_2)$-regular. $\square $

**Exemple Visual ($ K_3 \times K_2 $):**
A $ K_3 $ cada vèrtex té grau 2. A $ K_2 $ cada vèrtex té grau 1. El producte és un prisma triangular on cada vèrtex té grau $ 2+1=3 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 2) $ G_1, G_2 $ bipartit $\implies G_1 \times G_2 $ bipartit?

**Sí. Demostració:**




Com $ G_1 $ és bipartit, existeix una partició $ V_1 = X_1 \cup Y_1 $ tal que totes les arestes de $ G_1 $ van de $ X_1 $ a $ Y_1 $.
Com $ G_2 $ és bipartit, existeix una partició $ V_2 = X_2 \cup Y_2 $ tal que totes les arestes de $ G_2 $ van de $ X_2 $ a $ Y_2 $.

Definim la partició de $ V_1 \times V_2 $:
$$
A = (X_1 \times X_2) \cup (Y_1 \times Y_2), \quad B = (X_1 \times Y_2) \cup (Y_1 \times X_2)
$$

Sigui $\{(u,v),(u',v')\}$ una aresta del producte. Per definició, o bé $ u \sim u'$ amb $ v = v'$, o bé $ v \sim v'$ amb $ u = u'$:

*   **Cas 1** ($ u \sim u'$ en $ G_1 $, $ v = v'$): Com $ G_1 $ és bipartit, $ u \in X_1 $ i $ u' \in Y_1 $ (o viceversa). Com $ v = v'$, tots dos pertanyen a la mateixa part de $ V_2 $. Per tant, $(u,v)$ i $(u',v')$ pertanyen a parts oposades de $\{A, B\}$.
*   **Cas 2** ($ v \sim v'$ en $ G_2 $, $ u = u'$): Simètricament, $ v $ i $ v'$ estan en parts oposades de $ V_2 $ i $ u = u'$ no canvia. Per tant, $(u,v)$ i $(u',v')$ pertanyen a parts oposades.

En ambdós casos, els extrems de cada aresta pertanyen a parts distintes de $\{A, B\}$. Per tant, $ G_1 \times G_2 $ és bipartit. $\square $
        

---

## Exercici 1.13: Grafs d'ordre 3

### Enunciat

Doneu tots els grafs que tenen $ V = \{a, b, c\}$ com a conjunt de vèrtexs i representeu-los gràficament.

### Solució


Tenim $ n=3 $ vèrtexs: $ a, b, c $.
El nombre màxim d'arestes és $\binom{3}{2} = 3 $. Les possibles arestes són $ ab, ac, bc $.
Podem classificar els grafs pel nombre d'arestes ($ m $):

### 1) $ m=0 $ (Cap aresta)
El graf nul $ N_3 $.
*   Arestes: $\emptyset $


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 2) $ m=1 $ (Una aresta)
Hi ha 3 opcions depenent de quina aresta triem ($ ab $, $ ac $ o $ bc $). Són isomorfs, però com a grafs etiquetats són diferents.
*   $ G_1 $: $\{ab\}$
*   $ G_2 $: $\{ac\}$
*   $ G_3 $: $\{bc\}$


*[Gràfic interactiu disponible a la versió web de l'apunt]*

*(Mostrem només el cas $ ab $, els altres són equivalents girant el triangle)*

### 3) $ m=2 $ (Dues arestes)
És equivalent a triar quina aresta *no* hi és (o quin parell no està connectat). 3 opcions.
Es formen camins de longitud 2 ($ P_3 $).
*   $ G_4 $: $\{ab, bc\}$ (falta $ ac $). Camí $ a-b-c $.
*   $ G_5 $: $\{ab, ac\}$ (falta $ bc $). Camí $ b-a-c $.
*   $ G_6 $: $\{ac, bc\}$ (falta $ ab $). Camí $ a-c-b $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### 4) $ m=3 $ (Tres arestes)
El graf complet $ K_3 $ (Triangle). Només n'hi ha 1.
*   $ G_7 $: $\{ab, ac, bc\}$


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**Total**: $ 1 + 3 + 3 + 1 = 8 $ grafs etiquetats.
        

---

## Exercici 1.14: Comptant Grafs

### Enunciat

Considereu els grafs que tenen conjunt de vèrtexs $[7] = \{1, 2, 3, 4, 5, 6, 7\}$. Calculeu quants grafs n'hi ha ...

1. ... amb exactament 20 arestes.
2. ... en total.

### Solució


El conjunt de vèrtexs té mida $ n=7 $.
El nombre total de possibles arestes (parelles de vèrtexs) és:
$$
M_{max} = \binom{n}{2} = \binom{7}{2} = \frac{7 \cdot 6}{2} = 21
$$
Pots imaginar que tenim 21 interruptors, un per cada possible aresta. Cada interruptor pot estar encès (aresta existeix) o apagat (no existeix).

### 1) Amb exactament 20 arestes
Hem de triar quines 20 arestes activar de les 21 possibles.
Això és el mateix que triar *quina aresta deixar fora*.
$$
\binom{21}{20} = \binom{21}{1} = 21
$$

Hi ha **21** grafs amb 20 arestes. (Tots isomorfs a $ K_7 $ menys una aresta).


> **Nota Principal**
>
> **Visualització amb $ K_3 $** (versió petita del mateix problema)
> 
> $ K_3 $ té $\binom{3}{2} = 3 $ arestes possibles: {12, 13, 23}. Quants grafs d'ordre 3 tenen **exactament 2** arestes?
> 
> | Graf | 12 | 13 | 23 | 0 eliminat |
> |------|----|----|----|------------|
> | 1    |  1 |  1 |  0 | fora el 23 |
> | 2    |  1 |  0 |  1 | fora el 13 |
> | 3    |  0 |  1 |  1 | fora el 12 |
> 
> La **mateixa taula** demostra la igualtat $\binom{3}{2} = \binom{3}{1}$:
> 
> *   Llegint les columnes **12, 13, 23** → estàs **triant 2** per incloure = $\binom{3}{2}$
> *   Llegint la columna **"0 eliminat"** → estàs **triant 1** per excloure = $\binom{3}{1}$
> 
> Són dos punts de vista sobre la **mateixa decisió** → la resposta ha de ser la mateixa: **3**.
> 
> **Al problema original**: 21 arestes, 20 activades → l'únic que canvia entre grafs és **quin 0 hi ha** → **21 grafs**.


### 2) En total
Cada possible aresta pot estar present o no (2 opcions).
Com que tenim 21 possibles arestes, el nombre total de grafs és:
$$
2^{21} = 2.097.152
$$
Són més de 2 milions de grafs!
        

---

## Exercici 1.15: Seqüències de Graus

### Enunciat

Per a cadascuna de les seqüències següents, esbrineu si existeixen grafs d'ordre 5 de forma que els graus dels vèrtexs siguin els valors donats. Si existeixen, doneu-ne un exemple.

1.  3, 3, 2, 2, 2
2.  4, 4, 3, 2, 1
3.  4, 3, 3, 2, 2
4.  3, 3, 3, 2, 2
5.  3, 3, 3, 3, 2
6.  5, 3, 2, 2, 2

### Solució


Per verificar si una seqüència és gràfica, usem dues regles d'or:
1.  **Lema de les Encaixades**: La suma dels graus ha de ser **PARELLA** ($ 2m $).
2.  **Grau màxim**: Cap grau pot ser $\ge n $ (si és simple). En aquest cas, $ n=5 $, així que graus han de ser $\le 4 $.
3.  **Teorema de Havel-Hakimi** (si calgués, per casos difícils).

Analitzem cas per cas ($ n=5 $):

**1) 3, 3, 2, 2, 2**
*   Suma: $ 3+3+2+2+2 = 12 $ (Parell). OK.
*   Exemple: Un cicle $ C_5 $ té graus 2,2,2,2,2. Afegim una corda (aresta extra) entre dos vèrtexs no adjacents. Aquests dos passen a grau 3. Els altres es queden amb 2.
    *   **EXISTEIX**. ($ C_5 +$ corda).

**2) 4, 4, 3, 2, 1**
*   Suma: $ 4+4+3+2+1 = 14 $ (Parell). OK.
*   Exemple: Havel-Hakimi.
    *   Ordenem. 4,4,3,2,1.
    *   Trec 4 $\to $ (resta 1 a 4,3,2,1) $\to $ 3, 2, 1, 0.
    *   De 3,2,1,0 $\to $ Trec 3 $\to $ (resta 1 a 2,1,0) $\to $ 1, 0, -1. **IMPOSSIBLE**.
    *   **NO EXISTEIX**.

**3) 4, 3, 3, 2, 2**
*   Suma: $ 4+3+3+2+2 = 14 $ (Parell). OK.
*   Exemple: Vèrtex central connectat a tots 4 ($ K_{1,4}$, graus 4,1,1,1,1). Afegim arestes als de fora.
    *   Connectem dos de fora (graus passen a 2,2).
    *   Connectem els altres dos de fora (graus passen a 2,2). Tenim 4, 2,2, 2,2. Encara falta.
    *   Havel-Hakimi: $ 4, 3, 3, 2, 2 \xrightarrow{-4} 2, 2, 1, 1 $. (Treu el 4, resta 1 als altres).
    *   $ 2, 2, 1, 1 \xrightarrow{-2} 1, 0, 1 \to $ Ordenat $ 1, 1, 0 $.
    *   $ 1, 1, 0 \xrightarrow{-1} 0, 0 $. Possible!
    *   **EXISTEIX**.

**4) 3, 3, 3, 2, 2**
*   Suma: $ 3+3+3+2+2 = 13 $. **IMPARELL**.
*   **NO EXISTEIX** (pel Lema de les Encaixades).

**5) 3, 3, 3, 3, 2**
*   Suma: $ 3+3+3+3+2 = 14 $. (Parell). OK.
*   Exemple: Havel-Hakimi: $ 3, 3, 3, 3, 2 \xrightarrow{-3} 2, 2, 2, 2 $. (Trec un 3, en queden tres 2 i el 2 final).
    *   $ 2, 2, 2, 2 $ és un cicle $ C_4 $. Existeix.
    *   **EXISTEIX**.

**6) 5, 3, 2, 2, 2**
*   Grau màxim 5 en un graf d'ordre 5?
*   Impossible. Com a molt pots tenir 4 veïns (els altres 4 vèrtexs). Graf simple no té llaços ni multiarestes.
*   **NO EXISTEIX** (Grau $\ge n $).
        

---

## Exercici 1.16: Regularitat i Paritat

### Enunciat

Demostreu que si un graf és regular de grau senar, aleshores té ordre parell.

### Solució


Sigui $ G $ un graf $ r $-regular d'ordre $ n $.
Sabem pel **Lema de les Encaixades** que:
$$
\sum_{v \in V} g(v) = 2m
$$
Com que és $ r $-regular, la suma de graus és $ n \cdot r $.
$$
n \cdot r = 2m
$$
El costat dret ($ 2m $) és sempre un nombre **parell**.
Per tant, el costat esquerre ($ n \cdot r $) ha de ser **parell**.

Si $ r $ (el grau) és **senar**, l'única manera que el producte $ n \cdot r $ sigui parell és que $ n $ (l'ordre) sigui **parell**.
*(Perquè Senar $\times $ Senar = Senar. Només Parell $\times $ Senar = Parell).*

**Q.E.D.**
        

---

## Exercici 1.17: Bipartit Regular

### Enunciat

Sigui $ G $ un graf bipartit d'ordre $ n $ i regular de grau $ d \ge 1 $. Quina és la mida de $ G $? Pot ser que l'ordre de $ G $ sigui senar?

### Solució


Sigui un graf bipartit amb partició $(V_1, V_2)$.
Com que és regular de grau $ d $:
*   Cada vèrtex de $ V_1 $ té $ d $ arestes. Totes van cap a $ V_2 $.
*   Cada vèrtex de $ V_2 $ té $ d $ arestes. Totes venen de $ V_1 $.

El nombre total d'arestes ($ m $) es pot comptar sumant els graus de $ V_1 $ (són exactament les arestes que surten de $ V_1 $):
$$
m = |V_1| \cdot d
$$
I també sumant els graus de $ V_2 $:
$$
m = |V_2| \cdot d
$$

Per tant:
$$
|V_1| \cdot d = |V_2| \cdot d
$$
Com que $ d \ge 1 $, podem dividir per $ d $:
$$
|V_1| = |V_2|
$$
Això vol dir que **les dues parts del graf bipartit tenen la mateixa mida**.

L'ordre total del graf és $ n = |V_1| + |V_2| = |V_1| + |V_1| = 2|V_1|$.
Per tant, **$ n $ ha de ser parell**.

**Respostes:**
1.  **Quina és la mida?** $ m = \frac{n}{2} \cdot d $. (La meitat dels vèrtexs tenen grau $ d $).
2.  **Pot ser l'ordre senar?** **No**. Ha de ser parell, perquè $ V_1 $ i $ V_2 $ han de tenir els mateixos vèrtexs per mantenir la regularitat.
        

---

## Exercici 1.18: Fita de la Mida

### Enunciat

Demostreu que en un graf bipartit d'ordre $ n $ la mida és menor o igual que $ n^2/4 $.

### Solució


### Pas 1: Quin graf bipartit té més arestes?

Sigui $ G $ un graf bipartit amb particions $ V_1 $ i $ V_2 $, amb $|V_1| = n_1 $ i $|V_2| = n_2 $.
La condició és $ n_1 + n_2 = n $.

El nombre d'arestes és **màxim** quan $ G $ és el graf bipartit **complet** $ K_{n_1, n_2}$
(tots de $ V_1 $ connectats a tots de $ V_2 $). En aquest cas:
$$
m = n_1 \cdot n_2
$$

Per tant, n'hi ha prou amb demostrar que $ n_1 \cdot n_2 \le \frac{n^2}{4}$ per a qualsevol $ n_1, n_2 \ge 0 $ amb $ n_1 + n_2 = n $.

---

### Pas 2: Maximitzar $ f(n_1) = n_1 \cdot n_2 $

Substituïm $ n_2 = n - n_1 $:
$$
f(n_1) = n_1 \cdot (n - n_1) = n \cdot n_1 - n_1^2
$$

Aquesta funció és una **paràbola invertida** en $ n_1 $ (el coeficient de $ n_1^2 $ és $-1 < 0 $).

---

### Pas 3: Trobar el màxim

Tenim **dues maneres** de trobar on s'assoleix el màxim:

#### Mètode 1 — Derivada igual a zero
$$
f'(n_1) = n - 2n_1 = 0 \implies n_1 = \frac{n}{2}
$$

Com que la paràbola és invertida, aquest únic punt crític és un **màxim**.

#### Mètode 2 — Identitat algebraica
Usem la identitat $(a-b)^2 \ge 0 $:
$$
\left(\frac{n}{2} - n_1\right)^2 \ge 0
$$
$$
\frac{n^2}{4} - n \cdot n_1 + n_1^2 \ge 0
$$
$$
\frac{n^2}{4} \ge n \cdot n_1 - n_1^2 = f(n_1)
$$

Directament: $ f(n_1) \le \frac{n^2}{4}$ [OK] (sense necessitat de derivades)

---

### Pas 4: Verificar el valor màxim

Substituint $ n_1 = n/2 $ (i per tant $ n_2 = n/2 $):
$$
f\left(\frac{n}{2}\right) = \frac{n}{2} \cdot \frac{n}{2} = \frac{n^2}{4}
$$

*   Si $ n $ és **parell**: $ n_1 = n_2 = n/2 $ (enters). Màxim exacte: $\frac{n^2}{4}$.
*   Si $ n $ és **senar**: $ n_1 = \frac{n-1}{2}$, $ n_2 = \frac{n+1}{2}$ (els enters més propers). Màxim: $\frac{n^2 - 1}{4} < \frac{n^2}{4}$.

---

### Conclusió

Per a tot graf bipartit d'ordre $ n $:
$$
m \le n_1 \cdot n_2 \le \frac{n^2}{4} \qquad \square
$$

El màxim s'assoleix únicament al graf $ K_{n/2,\, n/2}$ (quan $ n $ és parell).
        

---

## Exercici 1.19: Graus i Ordre

### Enunciat

Sigui $ G $ un graf d'ordre 9 tal que tots els vèrtexs tenen grau 5 o 6. Proveu que hi ha un mínim de 5 vèrtexs de grau 6 o un mínim de 6 vèrtexs de grau 5.

### Solució


Sabem que $ n = 9 $ i $ g(v) \in \{5, 6\}$. 
Sigui $ x $ el nombre de vèrtexs de grau 5, i $ y $ el nombre de vèrtexs de grau 6.
Llavors tenim el següent sistema d'equacions:

1. **Total de vèrtexs:**
$ x + y = 9 \implies y = 9 - x $

2. **Suma de graus (ha de ser parell):**
$ 5x + 6y = 2m $

Substituint $ y $ a la segona equació:
$ 5x + 6(9 - x) = 2m \implies 54 - x = 2m $

Com que $ 2m $ és parell i $ 54 $ també, **$ x $ ha de ser un nombre parell**.
Els valors possibles per $ x $ (sent $ x \le 9 $) són: $ x \in \{0, 2, 4, 6, 8\}$.

**Anàlisi de casos:**
* Si $ x = 0 $, $ 2, 4 \implies y = 9, 7, 5 $. Tenim **almenys 5 vèrtexs de grau 6**.
* Si $ x = 6, 8 \implies x \ge 6 $. Tenim **almenys 6 vèrtexs de grau 5**.

Es demostra que sempre es compleix una de les dues condicions.


---

## Exercici 1.20: Festa i Salutacions

### Enunciat

L'Aran i la seva parella organitzen una festa on es reuneixen un total de 5 parelles. Es produeixen un cert nombre de salutacions però, com és natural, ningú no saluda la pròpia parella. A la sortida l'Aran pregunta a tothom quantes persones ha saludat i rep nou respostes diferents. Quantes persones ha saludat l'Aran i quantes la seva parella?
_Indicació_: Descriviu un graf que modeli la situació. Esbrineu quantes salutacions fa cada membre d'una parella.

### Solució


Modelem el problema amb un graf $ G=(V, A)$ on els vèrtexs són les 10 persones (5 parelles) i les arestes representen salutacions.

**Restriccions del grau:**
* Ningú es saluda a si mateix ni a la seva parella.
* El grau màxim possible és $\Delta(G) = 10 - 2 = 8 $.
* Com que l'Aran rep 9 respostes diferents (valors entre 0 i 8), els graus dels altres assistents són exactament $\{0, 1, 2, 3, 4, 5, 6, 7, 8\}$.

Diguem-los $ v_0, v_1, \dots, v_8 $ on $ g(v_i) = i $. 

**Aparellament lògic:**
1. $ v_8 $ ha saludat a tothom excepte a la seva parella. Com que $ v_0 $ no ha saludat a ningú, l'única opció és que **$ v_8 $ i $ v_0 $ siguin parella**.
2. Si ignorem $ v_8 $ i $ v_0 $, la resta de graus es redueixen en 1 (tots passen a tenir de 0 a 6 salutacions restants).
3. Repetint el procés recursivament:
   * **$ v_7 $ i $ v_1 $** són parella.
   * **$ v_6 $ i $ v_2 $** són parella.
   * **$ v_5 $ i $ v_3 $** són parella.

**Conclusió:**
L'única persona que queda sense emparellar en aquesta deducció és $ v_4 $. Per tant, l'Aran ha de ser la parella de $ v_4 $.

Com que la regla de sumes de parelles es manté constant i simètrica en aquest graf, l'Aran també ha de tenir grau 4.
**Resposta**: L'Aran ha saludat a **4 persones**, i la seva parella també a **4**.


*[Gràfic interactiu disponible a la versió web de l'apunt]*



---

## Exercici 1.21: Isomorfismes (Ordre 4, Mida 2)

### Enunciat

Determineu, llevat d'isomorfismes, tots els grafs d'ordre quatre i mida dos.

### Solució


Busquem grafs no isomorfs amb $ n=4 $ i $ m=2 $.


> **Estratègia**
>
> Amb poques arestes, podem simplement llistar les configuracions de connexió possibles sense formar isomorfismes.


Tenim només 2 arestes. Hi ha exactament dues formes d'ubicar-les respecte l'adjacència:

1. **Arestes adjacents**
   Es forma un camí de 3 vèrtexs i ens queda sempre un vèrtex aïllat.
   **Classe isomorfa:** $ T_3 \cup K_1 $ (Trajecte de longitud 2 i un vèrtex isolat).


*[Gràfic interactiu disponible a la versió web de l'apunt]*


2. **Arestes independents**
   Són dues parelles de vèrtexs connectats separadament.
   **Classe isomorfa:** $ 2K_2 $ (Dues còpies del graf complet de 2 vèrtexs).


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**Resultat:**
Llevat d'isomorfismes, només hi ha **2** grafs d'ordre 4 i mida 2.


---

## Exercici 1.22: Subgrafs i Isomorfia

### Enunciat

Sigui $ V = \{a, b, c, d\}$ i $ A = \{ab, ac, ad, dc\}$. Determineu, llevat d'isomorfismes, tots els subgrafs del graf $ G = (V, A)$

### Solució


Analitzem el graf $ G=(V,A)$ donat: $ V = \{a,b,c,d\}$ i $ A = \{ab, ac, ad, dc\}$.
$ G $ és essencialment un triangle ($ a, c, d $) amb una aresta penjant ($ a, b $).


*[Gràfic interactiu disponible a la versió web de l'apunt]*


Un subgraf $ H \subseteq G $ s'obté eliminant arestes (o vèrtexs). Anem a classificar els subgrafs segons la seva mida $ m $:

* **$ m=0 $**: Cap aresta. Forma **$ 4K_1 $** (1 classe).
* **$ m=1 $**: Una única aresta. Tota aresta forma **$ K_2 \cup 2K_1 $** (1 classe).
* **$ m=2 $**: 
   * Arestes que es toquen: Forma un **$ P_3 \cup K_1 $**.
   * Arestes independents: Només la combinació $ ab $ i $ cd $ ho permet. Forma **$ 2K_2 $**.
   *(2 classes)*
* **$ m=3 $**:
   * Si eliminem $ ab $: Ens queda el triangle, **$ K_3 \cup K_1 $**.
   * Si eliminem $ cd $: El vèrtex $ a $ connecta als altres tres, formant una estrella, **$ K_{1,3}$**.
   * Si eliminem $ ac $ o $ ad $: Es trenca el triangle i queda un sender. Forma el trajecte de 4 vèrtexs, **$ P_4 $**.
   *(3 classes)*
* **$ m=4 $**: El graf sencer, **$ G $** original (1 classe).

**Classes d'isomorfisme generades:** $ 4K_1 $, $ K_2 \cup 2K_1 $, $ P_3 \cup K_1 $, $ 2K_2 $, $ K_3 \cup K_1 $, $ K_{1,3}$, $ P_4 $, $ G $.


---

## Exercici 1.23: Classes Isomorfia

### Enunciat

Classifiqueu per classes d'isomorfia els grafs de la figura 1.1.

### Solució


Agrupem els grafs analitzant el seu ordre, mida, regularitat i l'existència de cicles característics.

1. **Classe 1: $ K_4 $**
   * **$ G_1, G_2 $**: Són grafs del tipus Complet d'ordre 4. Grau 3 a tots els vèrtexs.
2. **Classe 2: $ C_5 $**
   * **$ G_3, G_4 $**: Ambdós són grafs 2-regulars d'ordre 5, que equivalen al cicle invariant $ C_5 $.
3. **Classe 3: $ K_{3,3}$**
   * **$ G_5, G_6 $**: Grafs d'ordre 6, 3-regulars i bipartits. $ G_5 $ permet l'alternança de color als vèrtexs de l'hexàgon per demostrar la bipartició.
4. **Classe 4: Prisma d'ordre 6**
   * **$ G_7 $**: Un graf geomètric pla 3-regular però que conté cicles de longitud menor (triangles) diferents dels de Petersen i $ K_{3,3}$. 
5. **Classe 5: Graf de Petersen**
   * **$ G_8, G_9 $**: Tots dos són representacions isomorfes del mític graf 3-regular d'ordre 10 que no conté cicles de longitud $< 5 $.
6. **Classe 6: Desargues o Möbius inferior**
   * **$ G_{10}$**: Encara que té ordre 10 i grau regular 3 com el Petersen, té arestes creuades que **formen cicles de 4**. Això el descarta de l'isomorfisme amb $ G_8, G_9 $.
7. **Classe 7: Arbre no regular d'ordre 6**
   * **$ G_{11}, G_{12}, G_{13}$**: Pertanyen a la mateixa classe arbòria on tenim un vèrtex central de grau 3 i rames simples; només varia la representació plana.


---

## Exercici 1.24: Isomorfismes de Complementaris

### Enunciat

Sigui $ G=(V,A)$ i $ H=(W,B)$ dos grafs. Demostreu que $ G $ i $ H $ són isomorfs, si i només si, $ G^c $ i $ H^c $ són isomorfs.

### Solució


**Recordatori:** Dos grafs $ G $ i $ H $ són **isomorfs** ($ G \cong H $) si existeix una bijecció $ f: V \to W $ que preserva les arestes:
$$
uv \in A \iff f(u)f(v) \in B
$$

En altres paraules: $ f $ reanomena els vèrtexs de $ G $ i el resultat és exactament $ H $.

---

### Demostració $(\implies)$: Si $ G \cong H $, llavors $ G^c \cong H^c $

**Suposem** que $ G \cong H $. Existeix una bijecció $ f: V \to W $ tal que:
$$
uv \in A \iff f(u)f(v) \in B \quad (*)
$$

**Volem veure** que la **mateixa $ f $** és un isomorfisme entre $ G^c $ i $ H^c $.

Prenem qualsevol parell de vèrtexs $ u, v \in V $ (distincts). Per definició del complementari:
$$
uv \in A^c \iff uv \notin A
$$

Aplicant la condició $(*)$ de l'isomorfisme (pel bicondicional):
$$
uv \notin A \iff f(u)f(v) \notin B
$$

I per definició del complementari de $ H $:
$$
f(u)f(v) \notin B \iff f(u)f(v) \in B^c
$$

Encadenant: $ uv \in A^c \iff f(u)f(v) \in B^c $.

Per tant, la mateixa $ f $ és isomorfisme de $ G^c $ a $ H^c $. $\square $

---

### Demostració $(\impliedby)$: Si $ G^c \cong H^c $, llavors $ G \cong H $

**Suposem** que $ G^c \cong H^c $.

Apliquem el resultat anterior (la implicació $\implies $) als grafs $ G^c $ i $ H^c $:
- Sabem: $ G^c \cong H^c $
- Aplicant $\implies $: $(G^c)^c \cong (H^c)^c $
- Però $(G^c)^c = G $ i $(H^c)^c = H $ (el complementari del complementari és el graf original)
- Per tant: $ G \cong H $ $\square $

---


> **Nota Principal**
>
> **Idea clau**: un isomorfisme és un reanomenat de vèrtexs. Si reanomenes els vèrtexs de $ G $ per obtenir $ H $, el **mateix reanomenat** transforma $ G^c $ en $ H^c $, perquè les arestes que *no hi havia* a $ G $ tampoc n'hi havia a $ H $ (el bicondicional és simètric).

  

---

## Exercici 1.25: Comptants Grafs No Isomorfs

### Enunciat

Determineu el nombre de grafs no isomorfs d'ordre 20 i mida 188.

### Solució


Volem calcular grafs amb $ n=20 $ i $ m=188 $. Cercar configuracions amb tantes arestes és molt costós combinatòriament.

Utilitzarem la propietat demostrada a l'**Ex 1.24**: _Diferenciar classes d'isomorfia a la base equival a fer-ho en el seu complementari_.

1. **Mida màxima ($ K_{20}$):**
$ m_{K_{20}} = \frac{20 \cdot 19}{2} = 190 \text{ arestes}$

2. **Càlcul per al graf complementari $ G^c $:**
$ m(G^c) = 190 - 188 = 2 \text{ arestes}$

L'enunciat es redueix ara a una qüestió senzilla: _Quants grafs no isomorfs hi ha d'ordre 20 i mida 2?_
Recordant l'exercici 1.21 on analitzàvem 2 arestes en un ordre obert, només ens poden aparèixer dues estructures autònomes i dissociades independentment del nombre de vèrtexs aïllats en total:
*   Ambdós arestes compartint 1 vèrtex: **$ P_3 \cup 17K_1 $**
*   Les arestes es troben aïllades respecte elles: **$ 2K_2 \cup 16K_1 $**

**Resposta:**
Només hi ha **2** grafs no isomorfs.


---

## Exercici 1.26: Grafs Autocomplementaris (Ordres Petits)

### Enunciat

Un graf és *autocomplementari* si és isomorf al seu graf complementari. Demostreu que no hi ha grafs autocomplementaris d'ordre 3, però sí d'ordres 4 i 5.

### Solució


**Definició:** 
Un graf $ G=(V, A)$ és autocomplementari si $ G \cong G^c $. Aquesta isomorfia requereix obligatòriament que tinguin exactament el mateix nombre d'arestes.

$ m(G) = m(G^c) = \frac{1}{2} m_{K_n} = \frac{n(n-1)}{4}$

*(La mida ha de ser un nombre enter estrictament)*.

**Casos a avaluar:**

1. **Ordre 3 ($ n=3 $):**
   $ m = \frac{3(2)}{4} = 1.5 $
   El resultat és fraccional, ergo, **no existeix** cap graf autocomplementari per a $ n=3 $.

2. **Ordre 4 ($ n=4 $):**
   $ m = \frac{4(3)}{4} = 3 \text{ arestes}$
   Això s'assoleix amb el trajecte lineal: **$ P_4 $**.

3. **Ordre 5 ($ n=5 $):**
   $ m = \frac{5(4)}{4} = 5 \text{ arestes}$
   El polígon estrellat ho compleix on tot vèrtex actua amb grau de paral·lel equivalent i complementari. Model formatiu: el Cicle pur **$ C_5 $**.


---

## Exercici 1.27: Grafs Autocomplementaris (General)

### Enunciat

Un graf és *autocomplementari* si és isomorf al seu graf complementari.

1) Quantes arestes té un graf autocomplementari d'ordre $ n $?
2) Demostreu que si $ n $ és l'ordre d'un graf autocomplementari, aleshores $ n $ és congruent amb 0 o amb 1 mòdul 4.
3) Comproveu que si $ n = 4k $ per $ k \ge 1 $, la construcció següent dona un graf autocomplementari: prenem $ V = V_1 \cup V_2 \cup V_3 \cup V_4 $, on cada $ V_i $ conté $ k $ vèrtexs; els vèrtexs de $ V_1 $ i de $ V_2 $ indueixen grafs complets; a més, tenim totes les arestes entre $ V_1 $ i $ V_3 $, entre $ V_3 $ i $ V_4 $, i entre $ V_4 $ i $ V_2 $.
4) Com podem modificar la construcció anterior per obtenir un graf autocomplementari amb $ n = 4k + 1 $ vèrtexs?

### Solució


**1) Arestes d'un graf autocomplementari**
Com $ G \cong G^c $, cadascun ha de tenir exactament la meitat de les arestes del graf complet:
$ m = \frac{n(n-1)}{4}$

**2) Limitacions mòdul 4**
Com que l'equació anterior ha de retornar forçosament un valor enter positiu i real:
El producte del numerador $ n(n-1)$ ha de ser múltiple de 4. Com que $ n $ i $(n-1)$ formen una seqüència intersecant consecutiva, el múltiple comú cau sobre només un bloc:
* Cas factor a $ n $: $ n \equiv 0 \pmod 4 $
* Cas factor a $ n-1 $: $ n-1 \equiv 0 \pmod 4 \implies n \equiv 1 \pmod 4 $

**3) Comprovació de la construcció particional ($ n=4k $)**
Prenent: $ V_1, V_2 $ (cliques complets) i $ V_3, V_4 $ (conjunts estables de nodes no unificats de la mateixa fracció proporcional $ k $). Les vinculacions establint conjunts només amb adjacències creuades formals demostren com el Complementari d'aquest fa l'invers perfecte i bijectable per:
$ V_1^c \to V_3, \, V_2^c \to V_4 $
La inversió s'ajusta purament generant isomorfismes en base general i demostrant les seqüències automàtiques d'apropiació de patrons a qualsevol bloc base gran parell autocomplementari.

**4) Modificació en funció de restes senars ($ 4k+1 $)**
L'únic pas procedimental i resolutiu és integrar un vèrtex extern "$ v $" aliè als conjunts prèviament isomorfs com a node cèntric d'associació amb dos únics costats de la base particional autocomplementària descrita en paritat de forces asimètriques amb elements passats. El reflex sobre el "node zero $ v $" traspassarà a l'espai oposat intacte l'extensió i respectarà purament la clàusula inicial de la funció bijectiva $ f $.


---

## Exercici 1.28: Cicles en Grafs Grans

### Enunciat

Sigui $ G $ un graf d'ordre $ n \ge 6 $.

1) Demostreu que $ G $ o $ G^c $ conté un vèrtex $ v $ de grau almenys 3.
2) Demostreu que $ G $ o $ G^c $ conté un cicle de longitud 3. (Considereu les adjacències entre els veïns del vèrtex $ v $ del primer apartat.)
3) Demostreu que en una reunió de $ n \ge 6 $ persones, sempre n'hi ha 3 que es coneixen dos a dos o 3 que no es coneixen dos a dos.

### Solució


**1) La regla del grau $ v $ per $ n \ge 6 $**
Prenem un vèrtex determinat i particular de tota la festa com a mostra central, anomenat $ v $. Hi ha $ n-1 \ge 5 $ altres assistents a la sala directes.
Es classifiquen tots sota només dues caixes per al node focal (les condicions complementàries binàries):
*  O hi ha dret a una **Aresta** ("es coneixen", graf $ G $).
*  O **No hi ha connexió** ("no es coneixen", graf $ G^c $).

A l'aplicar el Principi de les caixes de Dirichlet pel mínim present sobre aquest objectiu i situacions:
$\lceil 5 / 2 \rceil = 3 $
Existeix indiscutiblement per al graf (comú o reflex del complementari general objectiu) almenys un grup de 3 veïns en relació directa del mateix escenari cap a nosaltres. El qual demostra que efectivament **grau mínim associat** $\ge 3 $ comença en l'entorn definit.

**2) Comprovació de Triangles Formatius Isomorfs $ C_3 $**
Siguin $ v_1, v_2, v_3 $ aquests tres nodes vinculats prèviament al Node general esmentat referent actiu:
*   Si existeix una aresta base al pla actual al voltant de les connexions d'un en relació purament als altres, i ho vinculen (ex. vinculació respecte a $ v_1 v_2 $): Formem el nostre primer cicle $ C_3 $ (Triangle) directament amb els components $ v $, lligant cicles per primer pla base real!
*   Però; ¿I si NO estan interconnectats en absolut cap amb cap i s'aïllen entre ells? Llavors al fer la imatge respectiva visual inversa cap el terreny complementari total base (canvi oposicional pla $ G^c $), apareixeran connectats obligatòriament formatius junts conformant ells base lligada del triangle $ C_3 $. Llei Universal resolta garantint Cicle final $ C_3 $ Tancat Trilogia!

**3) Equivalència Sociocultural Estadística de l'Efecte Ramsey**
La conclusió demostra teòricament la **Llei de Ramsey** general sobre formació d'entorns d'estabilitat i teoria del Caos respectiu relatiu al model de la base estadística R(3,3)=6! En conjunts grans com sales superant elements com en 6 s'unifiquen sempre 3 amb elements compartits que es repelen els mateixos amb elements d'unificació paral·lela sense res.


---

