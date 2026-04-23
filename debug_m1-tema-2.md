---
title: "Solucionari: Tema 2: Recorreguts i Connexió"
author: "Apunts"
---

# Solucionari: Tema 2: Recorreguts i Connexió

*DFS, BFS, components connexos i distàncies.*

---

## Exercici 2.1: Trobar camins i cicles

### Enunciat

Trobeu en els grafs següents, si és possible, camins de longitud 9 i 11, i cicles de longitud 5, 6, 8 i 9.

### Solució


Recordem: un **camí** té longitud màxima $ n-1 $ i un **cicle** longitud màxima $ n $.

### Graf $ G_1 $ (Petersen, $ n = 10 $)


*[Gràfic interactiu disponible a la versió web de l'apunt]*


| Pregunta | Resposta |
|---|---|
| **Camí long. 9** | [OK] $ 1-2-3-4-5-10-8-6-9-7 $ |
| **Camí long. 11** | [X] Necessitaria 12 vèrtexs, només en tenim 10 |
| **Cicle long. 5** | [OK] $ 1-2-3-4-5-1 $ |
| **Cicle long. 6** | [OK] $ 1-2-3-4-9-6-1 $ |
| **Cicle long. 8** | [OK] $ 1-2-3-4-5-10-8-6-1 $ |
| **Cicle long. 9** | [OK] $ 1-2-7-10-5-4-3-8-6-1 $ |

### Graf $ G_2 $ ($ n = 11 $)


*[Gràfic interactiu disponible a la versió web de l'apunt]*


| Pregunta | Resposta |
|---|---|
| **Camí long. 9** | [OK] $ 1-2-3-4-9-8-7-11-6-10 $ |
| **Camí long. 11** | [X] Necessitaria 12 vèrtexs, només en tenim 11. Longitud màxima possible = 10 |
| **Cicle long. 5** | [OK] $ 1-2-3-4-5-1 $ |
| **Cicle long. 6** | [OK] $ 6-7-8-9-10-6 $ (anell interior sense el node 11) |
| **Cicle long. 8** | [OK] $ 1-2-7-11-6-10-5-4-3-8 $ → buscar combinant exterior i interior |
| **Cicle long. 9** | [OK] $ 1-2-3-8-9-4-5-10-6-1 $ |


> **Clau de l'exercici**
>
> La limitació és purament d'ordre: un camí simple no pot superar longitud $ n-1 $ ni un cicle longitud $ n $, independentment de com d'enrevessat sigui el graf.

  

---

## Exercici 2.2: Camí en Graf de Grau Mínim

### Enunciat

Demostreu que si $ G $ és un graf de grau mínim $ d $, aleshores $ G $ conté un camí de longitud $ d $.

### Solució


Sigui $ P = v_0 v_1 \dots v_k $ un **camí de longitud màxima** dins $ G $.

1. Com que $ P $ és màxim, **tots els veïns de $ v_k $ pertanyen a $ P $**. Si existís un veí $ x \notin P $, podríem allargar $ P $ amb $ x $, contradient que és màxim.

2. Per hipòtesi, $\text{grau}(G) = d $, és a dir $ v_k $ té com a mínim $ d $ veïns. Tots dins $\{v_0, \dots, v_{k-1}\}$.

3. Per tant, $ k \ge d $, i $ P $ té longitud $\ge d $. $\square $


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">v$_{k}$ no pot sortir de P → tots els seus $\geq$d veïns estan dins el camí → longitud $\geq$ d.</div>
  

---

## Exercici 2.3: Components Connexos i Vèrtexs

### Enunciat

Un graf té ordre 13 i 3 components connexos. Demostreu que un dels components té un mínim de 5 vèrtexs.

### Solució


Ho demostrarem per **reducció a l'absurd**. Siguin $ n_1, n_2, n_3 $ els ordres dels 3 components, amb $ n_1 + n_2 + n_3 = 13 $. Suposem que **cap** component té 5 o més vèrtexs, és a dir, $ n_i \le 4 $ per a tot $ i $.

Llavors:
$$
n_1 + n_2 + n_3 \le 4 + 4 + 4 = 12
$$

Però sabem que $ n_1 + n_2 + n_3 = 13 > 12 $. **Contradicció!**

Per tant, almenys un dels components ha de tenir $\ge 5 $ vèrtexs. $\square $
  

---

## Exercici 2.4: Algorisme DFS

### Enunciat

Useu l'algorisme DFS per esbrinar si els grafs següents, representats mitjançant la seva llista d'adjacències, són connexos, i en cas contrari determineu-ne els components connexos. Considereu que el conjunt de vèrtexs està ordenat alfabèticament.

### Solució


**Regla del DFS:** des del vèrtex actual, saltem al veí **no visitat** de menor ordre alfabètic. Quan tots els veïns estan visitats, fem *backtrack*.

### Graf 1


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**DFS des de $ a $:**

$ a \to d \to b \to g \to i $ (backtrack) $\to j $ (backtrack fins a $ d $) $\to e $ (backtrack) $\to f $

**Component 1 (blau):** $\{a, b, d, e, f, g, i, j\}$

Queden $ c $ i $ h $ sense visitar. Nou DFS des de $ c $: $ c \to h $.

**Component 2 (vermell):** $\{c, h\}$

**Conclusió:** Graf **NO connex**. 2 components connexos.

---

### Graf 2


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**DFS des de $ a $:**

$ a \to b \to d \to h $ (backtrack fins a $ b $) $\to e \to g \to m $ (backtrack fins a $ b $) $\to j $

**Component 1 (blau):** $\{a, b, d, e, g, h, j, m\}$

Queden $ c, f, i, k, l $. Nou DFS des de $ c $: $ c \to f \to k \to i \to l $.

**Component 2 (vermell):** $\{c, f, i, k, l\}$

**Conclusió:** Graf **NO connex**. 2 components connexos. $\square $
  

---

## Exercici 2.5: Dos Vèrtexs Senars connectats per un Camí

### Enunciat

Demostreu que si un graf té exactament dos vèrtexs de grau senar, aleshores existeix un camí que va d'un a l'altre.

### Solució


Sigui $ G $ un graf amb exactament dos vèrtexs de grau senar: $ x $ i $ y $. Demostrem per **reducció a l'absurd** que estan connectats.

**Suposem que $ x $ i $ y $ estan en components diferents:**


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Suposició: x (grau 3, senar) i y (grau 3, senar) en components separats.</div>

Mirem el component $ C_x $ (blau) on viu $ x $:

*   $ x $ té grau **3 (senar)**.
*   Tots els altres nodes de $ C_x $ ($ a, b, c $) haurien de tenir grau **parell** (en el dibuix en tenen 3 per la mateixa paradoxa: **és impossible** dibuixar un component amb un sol node senar!).

Sumem els graus dins $ C_x $:
$$
\underbrace{3}_{x} + \underbrace{\text{Parell} + \dots}_{\text{resta}} = \textbf{Senar}
$$

Però pel **Lema de les Encaixades de Mans**, la suma de graus ha de ser **parella**.

$$
\textbf{Senar} \neq \textbf{Parell} \implies \text{Contradicció!}
$$

La suposició era falsa: $ x $ i $ y $ **han de viure al mateix component**, per tant existeix un camí entre ells. $\square $
  

---

## Exercici 2.6: Mida en Dos Components Complets

### Enunciat

Sigui $ G $ un graf d'ordre $ n $ que té exactament dos components connexos i tots dos són grafs complets. Demostreu que la mida de $ G $ és, almenys, $(n^2 - 2n)/4 $.

### Solució


Tenim un graf $ G $ amb $ n $ vèrtexs format per dos components complets: $ K_{n_1}$ i $ K_{n_2}$, amb $ n_1 + n_2 = n $.

**Intuïció:** La mida (arestes) es minimitza quan els dos components són el més iguals possible (equilibri $ n/2, n/2 $). Si desequilibrem, la mida creix.

<div class="flex flex-row gap-4 justify-center">
<div class="flex-1">


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Cas equilibrat (n=6): K$_{3}$ + K$_{3}$ = 6 arestes (mínim)</div>

</div>
<div class="flex-1">


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Cas desequilibrat (n=6): K$_{5}$ + K$_{1}$ = 10 arestes</div>

</div>
</div>

**1. Mida total en funció de $ n_1 $**

La suma d'arestes és la combinació de les arestes de $ K_{n_1}$ i $ K_{n_2}$:

$$
m = \frac{n_1(n_1-1)}{2} + \frac{n_2(n_2-1)}{2}
$$

Substituïm $ n_2 = n - n_1 $:

$$
m(n_1) = \frac{n_1^2 - n_1 + (n-n_1)(n-n_1-1)}{2} = \frac{n_1^2 - n_1 + (n^2 - 2nn_1 + n_1^2 - n + n_1)}{2}
$$

Si agrupem termes, la fórmula es simplifica en una funció quadràtica:

$$
m(n_1) = \frac{2n_1^2 - 2n \cdot n_1 + n^2 - n}{2}
$$

**2. El mínim**

L'enunciat ens demana demostrar que la mida $ m $ és **almenys** un valor determinat. Per provar que $ m \ge \text{fita}$ per a qualsevol combinació de $ n_1 $ i $ n_2 $, només ens cal trobar el cas que dóna menys arestes (el mínim global) i veure que fins i tot aquest cas compleix la condició.

La funció $ m(n_1) = \frac{1}{2}(2n_1^2 - 2nn_1 + n^2 - n)$ és una **paràbola** amb el coeficient de $ n_1^2 $ positiu, el que significa que té forma de "U" i el seu vèrtex és el punt mínim. Podem trobar-lo de dues maneres:

*   **Pel vèrtex d'una paràbola:** En una equació $ ax^2 + bx + c $, el vèrtex és a $ x = -b/2a $. Aquí, $ n_1 = \frac{-(-2n)}{2(2)} = \frac{2n}{4} = \frac{n}{2}$.
*   **Per la derivada:** Si derivem respecte a $ n_1 $ i igualem a zero:
    $ m'(n_1) = \frac{1}{2}(4n_1 - 2n) = 0 \implies 4n_1 = 2n \implies n_1 = \frac{n}{2}$.

Ambdós mètodes confirmen que el mínim es dóna quan els dos components estan **equilibrats** ($ n_1 = n_2 = n/2 $).

**3. Avaluem al mínim** ($ n_1 = n/2 $):

$$
m_{min} = \frac{ 2(\frac{n}{2})^2 - 2n(\frac{n}{2}) + n^2 - n }{2} = \frac{ \frac{n^2}{2} - n^2 + n^2 - n }{2}
$$
$$
m_{min} = \frac{ \frac{n^2}{2} - n }{2} = \frac{n^2 - 2n}{4}
$$

Com que el mínim de la funció és $\frac{n^2 - 2n}{4}$, qualsevol repartiment de $ n_1, n_2 $ compleix $ m \ge \frac{n^2 - 2n}{4}$. $\square $
  

---

## Exercici 2.7: Extrems de Mida segons Components Connexos i Arbres

### Enunciat

Sigui $ G $ un graf d'ordre $ n $ amb exactament $ k $ components connexos. Demostreu que la mida de $ G $ és més gran o igual que $ n - k $.

### Solució


Aquest és un teorema clàssic que es demostra en dos simples passos analitzant el graf des de l'estructura més minimalista possible: els arbres.

**Intuïció visual:** Per connectar un component amb la mínima despesa d'arestes possible (sense cicles), formem un **arbre**, que sempre requereix exactament tantes arestes com vèrtexs menys u ($ n_i - 1 $).


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Exemple amb n=8 i k=3. Mínim d'arestes = (3-1) + (4-1) + (1-1) = 2 + 3 + 0 = 5. I efectivament 8 - 3 = 5.</div>

**1. L'estructura mínima d'un component**
Un component connex d'ordre $ n_i $ assoleix el **mínim nombre d'arestes possible** únicament quan no té cicles, és a dir, quan adopta la forma d'un **arbre**.
Si el component és un arbre, la seva mida és exactament:
$$
m_i \ge n_i - 1
$$

**2. Sumatori sobre els $ k $ components**
Sigui $ G $ desglossat en $ k $ components independents d'ordres $ n_1, n_2, \dots, n_k $.
Sabem que la suma de tots els vèrtexs ens dona l'ordre total del graf: $\sum_{i=1}^k n_i = n $.

Si sumem les arestes mínimes requerides per tots i cadascun dels components:
$$
m(G) = \sum_{i=1}^k m_i \ge \sum_{i=1}^k (n_i - 1)
$$

Si expandim el sumatori partint el parèntesi:
$$
m(G) \ge \left( \sum_{i=1}^k n_i \right) - \left( \sum_{i=1}^k 1 \right)
$$

Substituint el primer bloc per $ n $ i el segon per sumar `1` exactament $ k $ vegades:
$$
m(G) \ge n - k
$$
$\square $
  

---

## Exercici 2.8: Construcció Fita Superior (Mida i Connexió)

### Enunciat

Sigui $ G $ un graf d'ordre $ n $ amb exactament $ k+1 $ components connexos. En aquest exercici volem trobar una fita superior per la mida de $ G $. Per a fer-ho definim el graf auxiliar $ H $ d'ordre $ n $ amb $ k+1 $ components connexos, $ k \ge 1 $: $ k $ són isomorfs a $ K_1 $ i un component és isomorf a $ K_{n-k}$.

1) Calculeu la mida de $ H $.
2) Demostreu que la mida de $ H $ és més gran o igual que la mida de $ G $.

### Solució


L'objectiu és descobrir la fita superior matemàtica d'arestes. Per maximitzar les arestes d'un graf desconnectat, ens convé que les illes de vèrtexs estiguin totalment polaritzades: components minúsculs buits, en contraposició a un únic component gegantí del tot farcit on el creixement quadràtic de $ K_n $ s'apliqui amb el pes més gran possible.

Aquest "cas límit" on es concentra el màxim poblacional idealitzat és el **Graf $ H $**.

### 1) Calculeu la mida associada d'$ H $

El graf auxiliar $ H $ està dividit en $ k+1 $ components:
*   **$ k $ components idèntics a $ K_1 $**: Això són $ k $ vèrtexs completament aïllats (0 arestes cadascun).
*   **1 component isomorf a $ K_{n-k}$**: Un sol "blob" completament connectat on hem empilat tots els nodes restants $(n-k)$.

Atès que només un grup conté arestes, calcular la mida $ m(H)$ resideix solament en extreure la mida d'aquest enorme graf complet $ K_{n-k}$:
$$
m(H) = m(K_{n-k}) = \frac{(n-k)(n-k-1)}{2}
$$

---

### 2) Demostreu que $ m(H) \ge m(G)$

Suposem que $ G $ i $ H $ actuen tots dos complint el límit de $ k+1 $ components. Volem provar que la fragmentació d'arestes de qualsevol $ G $ sempre surt perdent (o empatant) contra la polarització ideal d'$ H $.

**Intuïció visual:** Moure vèrtexs cap al component més gros **sempre fa guanyar arestes**.


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Graf G (Repartit): K$_{3}$ (3 arestes) + K$_{4}$ (6 arestes) = <b>9 arestes</b></div>


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Si transvasem un node per polaritzar: K$_{2}$ (1 ar) + K$_{5}$ (10 ar) = <b>11 arestes!</b> Hem guanyat arestes (+2).</div>

**Demostració matemàtica:**
Ho demostrem observant què passa si prenem dos components complets de $ G $ ($ K_a $ i $ K_b $) on $ a \ge b \ge 2 $ i extraiem un vèrtex del grup petit per transferir-lo al grup més gran.

Si movem **un vèrtex** del component de mida $ b $ cap al d'$ a $:
*   Arestes afegides al component nou gran: hi ha un nou complet $ K_{a+1}$, guanyant $+a $ arestes.
*   Arestes perdudes al component minvat: deixem un $ K_{b-1}$, perdent $-(b-1)$ arestes.

L'increment net ($\Delta m $) a la mida total serà:
$$
\Delta m = a - (b - 1) = a - b + 1
$$

Atès que $ a \ge b $, tenim que **$\Delta m > 0 $**.
Això demostra que concentrar vèrtexs d'un grup petit a un grup més gran **sempre guanya arestes**.

Aplicant transvasaments successivament, el màxim absolut insuperable s'aconseguirà quan hàgim buidat els grupets deixant-los a 1 sol vèrtex ($ K_1 $), acumulant absolutament tot el volum a la bossa central gros ($ K_{n-k}$). Aquest estat final és **exactament el graf $ H $**.

Llavors concloem que per a qualsevol graf $ G $:
$$
m(G) \le m(H) = \frac{(n-k)(n-k-1)}{2}
$$
$\square $
  

---

## Exercici 2.9: Vèrtexs de tall i arestes pont

### Enunciat

Trobeu tots els vèrtexs de tall i arestes pont dels grafs següents.

### Solució


**Foto exercici**

  | Graf | Vèrtexs de tall | Arestes pont |
| :---: | :---: | :---: |
| **$ G_1 $** | $\emptyset $ | $\emptyset $ |
| **$ G_2 $** | $\emptyset $ | $\emptyset $ |
| **$ G_3 $** | $\{3, 6\}$ | $(3, 6)$ |

<br/>

**Exercici mal fet**


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Graf G$_{3}$: El node 3 i 6 són vitals (colls d'ampolla) encadenats pel pont letal (3,6)</div>
  

---

## Exercici 2.10: Graf estrella adherent G+z

### Enunciat

Sigui $ G = (V, A)$ un graf connex d'ordre almenys 2. Prenem $ z \notin V $ i definim $ G + z $ com el graf que té $ V \cup \{z\}$ com a conjunt de vèrtexs i $ A \cup \{zv : v \in V\}$ com a conjunt d'arestes. Demostreu que $ G + z $ no té vèrtexs de tall.

### Solució


$ G+z $ s'obté afegint un súper-node $ z $ connectat a **tots** els vèrtexs del graf original.


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Exemple: Node z assoleix enllaç amb tothom simultàniament.</div>

Anem a veure que cap eliminació aïllada i concreta no desconnecta el mapa final:
1. **Borrem $ z $:** Ens quedem amb $ G $. Com que l'enunciat assegura que $ G $ és connex, no s'ha desconnectat res.
2. **Borrem un $ v \in V $:** Resten d'altres nodes de pas. Com tots estan lligats a $ z $, qualsevol parell de nodes sobreviurà connectat pel camí exprés garantit de redundància absoluta: $ x \to z \to y $.

**Conclusió:** No hi ha forma de desconnectar-ho traient 1 sol element. Sense talls! $\square $
  

---

## Exercici 2.11: Graf regular més petit amb pont

### Enunciat

Trobeu el més petit $ n $ tal que existeix un graf 3-regular d'ordre $ n $ que té una aresta pont.

### Solució


Si tallem el pont, el graf es divideix en dos components (posem $ C_1 $ i $ C_2 $).
Dins de $ C_1 $, l'extrem del pont $ u $ passa a tenir **grau 2**. L'altre $ k-1 $ vèrtexs de dins mantenen **grau 3** inicial.

Pel **Lema de les Encaixades** a dins de $ C_1 $, la suma és sempre parella:
$$
\sum = 2 + 3(k-1) = \textbf{Parell} \implies 3(k-1) \text{ és Parell}  \implies k-1 \text{ és Parell} \implies k \text{ és Senar}
$$

Provem valors de $ k $ (mida d'escamot o components separats per pont):
*   $ k=1,3 $: Impossible aconseguir les suficients arestes internes ($ 3 $-regular dins de $ k=3 $ no dóna el pes). 
*   **$ k=5 $**: Funciona perfectament formant un sub-cicle intern ple amb una cruïlla menys d'on extreu un node amb grau restant 2, que tancarà amb el contrincant $ v $. 


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-xs text-center text-slate-400 mt-1 mb-4">Graf solució amb n = 10 vèrtexs (5 esquerra, 5 dreta reunits pel pont verd) on cadascun llança 3 línies (3-regular) exactament.</div>

**Mínim $ n $ total:** $ 5 + 5 = \textbf{10}$. $\square $
  

---

## Exercici 2.12: Ponts i Talls dependents als regulars

### Enunciat

Demostreu que un graf 3-regular té un vèrtex de tall si, i només si, té alguna aresta pont.

### Solució


Demostració de doble via ($\iff $):

**1) Pont $\implies $ Tall**  
Sabem que els extrems d'un pont són vèrtexs de tall, **a menys** que el vèrtex tingui grau 1 (sigui una fulla). Com que el nostre graf és **3-regular**, cada vèrtex té grau 3. Per tant, l'excepció no es pot donar i qualsevol extrem d'un pont serà un vèrtex de tall.

**2) Tall $\implies $ Pont**  
Aquesta part és més subtil. Si $ v $ és un vèrtex de tall, la seva eliminació desconnecta el graf en $ k \ge 2 $ components.



**Raonament algebraic:**
1. Sigui $ v $ el vèrtex de tall. Com que el graf és 3-regular, d'ell surten exactament **3 arestes** cap als seus veïns $ x, y, z $.
2. En eliminar $ v $, aquestes 3 arestes desapareixen i el graf queda dividit en components connexos (per exemple, $ C_1 $ i $ C_2 $).
3. Els vèrtexs $ x, y, z $ han de quedar repartits entre aquests components. Pel principi del colomar (3 veïns a repartir en $\ge 2 $ components), algun component (diguem $ C_1 $) ha de contenir **exactament un** d'aquests veïns (diguem $ x $).
4. Si $ x $ és l'únic vèrtex de $ C_1 $ que estava connectat a $ v $, llavors l'aresta $ xv $ era l'única connexió entre $ C_1 $ i la resta del graf.
5. Si una aresta és l'única connexió entre un component i el vèrtex $ v $, la seva eliminació desconnectarà el graf. Per tant, **$ xv $ és una aresta pont**. $\square $
  

---

## Exercici 2.13: Propietats del Complementari i els talls

### Enunciat

Siguin $ G = (V, A)$ un graf i $ v $ un vèrtex de $ G $. Proveu que:  
1) si $ G $ és no connex, aleshores $ G^c $ és connex;  
2) $(G - v)^c = G^c - v $;  
3) si $ G $ és connex i $ v $ és un vèrtex de tall de $ G $, aleshores $ v $ no és un vèrtex de tall de $ G^c $.

### Solució


Aquest exercici es resol utilitzant les conclusions d'un apartat per resoldre el següent.

### 1) Si $ G $ és no connex $\implies G^c $ és connex

Si $ G $ és no connex, té com a mínim dos components connexos, $ C_1 $ i $ C_2 $. 
*   A $ G^c $, qualsevol vèrtex de $ C_1 $ estarà connectat amb **tots** els vèrtexs de $ C_2 $ (perquè a $ G $ no hi havia cap aresta entre ells).
*   Això permet anar de qualsevol vèrtex $ u $ a qualsevol vèrtex $ v $ en un màxim de 2 passos (si $ u, v $ són del mateix component, pots anar de $ u \to (\text{node de l'altre component}) \to v $).
*   Per tant, $ G^c $ sempre és connex.

### 2) Identitat del complementari: $(G - v)^c = G^c - v $

Aquesta és una propietat d'estructures de conjunts molt intuïtiva:
*   $(G - v)^c $: Primer eliminem el vèrtex $ v $ (i les seves arestes) i després invertim la resta del graf.
*   $ G^c - v $: Primer invertim tot el graf i després eliminem el vèrtex $ v $.
En ambdós casos, el conjunt de vèrtexs resultants és $ V \setminus {v}$ i el conjunt d'arestes és el mateix: totes les parelles de vèrtexs restants que NO tenien aresta al graf original.

### 3) El vèrtex de tall al complementari

Ara combinem els dos resultats anteriors per demostrar que si $ v $ és de tall a $ G $, no ho pot ser a $ G^c $:

1.  Si $ v $ és un **vèrtex de tall** de $ G $, per definició el graf restant **$ G - v $ és no connex**.
2.  Pel punt **(1)**, sabem que si un graf és no connex, el seu complementari és connex. Per tant, **$(G - v)^c $ és connex**.
3.  Pel punt **(2)**, sabem que $(G - v)^c $ és exactament el mateix que **$ G^c - v $**.
4.  Així doncs, hem demostrat que **$ G^c - v $ és connex**.
5.  Com que treure el vèrtex $ v $ del graf $ G^c $ **no** l'ha desconnectat, $ v $ **no pot ser un vèrtex de tall** de $ G^c $. $ square $
  

---

## Exercici 2.14: Distàncies amb algorisme BFS

### Enunciat

Considereu els grafs de l'exercici 2.4. Doneu la distància dels vèrtexs $ a $ i $ b $ a tots els vèrtexs del component connex on es troben aplicant l'algorisme BFS.

### Solució


L'algorisme **BFS** divideix el graf en **capes expansives** que representen directament la distància al destí respectiu iteratiu de manera més visual:

### Distàncies pel Graf 1
El component original que conté `a` i `b` només agrupa a $\{a,b,d,e,f,g,i,j\}$.

| Inici | Nivell 0 $(d=0)$ | Nivell 1 $(d=1)$ | Nivell 2 $(d=2)$ | Nivell 3 $(d=3)$ |
|:---:|:---:|:---:|:---:|:---:|
| **$ d(a, \cdot)$** | $ a $ | $ d, e, f $ | $ b $ | $ g, i, j $ |
| **$ d(b, \cdot)$** | $ b $ | $ d, g, i, j $ | $ a, e, f $ | *(no hi ha)* |

<br/>

**Taula de resultats exactes individuals**:
| Vèrtex $ v $ | a | b | d | e | f | g | i | j |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$ d(a, v)$** | 0 | 2 | 1 | 1 | 1 | 3 | 3 | 3 |
| **$ d(b, v)$** | 2 | 0 | 1 | 2 | 2 | 1 | 1 | 1 |

---

### Distàncies pel Graf 2
El component principal on habiten només té $\{a, b, d, e, g, h, j, m\}$.

| Inici | Nivell 0 $(d=0)$ | Nivell 1 $(d=1)$ | Nivell 2 $(d=2)$ | Nivell 3 $(d=3)$ |
|:---:|:---:|:---:|:---:|:---:|
| **$ d(a, \cdot)$** | $ a $ | $ b, j $ | $ d, e, g, h $ | $ m $ |
| **$ d(b, \cdot)$** | $ b $ | $ a, d, e, g, h, j $ | $ m $ | *(no hi ha)* |

<br/>

**Taula de resultats exactes individuals**:
| Vèrtex $ v $ | a | b | d | e | g | h | j | m |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$ d(a, v)$** | 0 | 1 | 2 | 2 | 2 | 2 | 1 | 3 |
| **$ d(b, v)$** | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 2 |

  

---

## Exercici 2.15: Càlcul de Diàmetres

### Enunciat

Trobeu el diàmetre dels grafs següents: $ K_n $, Grafs de 2.1, $ K_{r,s}$, $ C_n $, $ W_n $, $ T_n $.

### Solució


| Família de Graf | Diàmetre $ D(G)$ | Raonament visual intuïtiu |
| :--- | :---: | :--- |
| **1) Complet $ K_n $** | $ 1 $ | Tots els vèrtexs estan interconnectats; viatges on viatges, costa una aresta.<br/>*(Per $ n=1 $ el diàmetre tècnic és 0)*. |
| **2) Ex 2.1 (Petersen)** | $ 2 $ | Al graf de Petersen tothom dista un màxim pur de dos passos per assolir qualsevol objectiu. |
| **2.2) Ex 2.1 ($ G_2 $)** | $ 4 $ | És un disseny on moure's des d'un extrem de l'anell exterior limitat passant cap a sota i travessant suposa un gran volt. La distància màxima es fixa en $ 4 $. |
| **3) Bipartit $ K_{r,s}$** | $ 2 $ | Entre cantons oposats ja estàs a dist $ 1 $. Entre gent del *mateix costat*, només has de fer escala en l'altre grup: $ a \to x \to b $ (dist $ 2 $).<br/>*(Excepcions: l'estrella $ K_{1,1}$ té dist. 1).* |
| **4) Cicle $ C_n $** | $\lfloor \frac{n}{2} \rfloor $ | Ets a l'anell central: per anar a l'invers del rellotge l'oponent més reculat queda certament a la meitat perfecta del rotatori geomètric descrit. |
| **5) Roda $ W_n $** | $ 2 $ | Un anell farcit on tothom té drecera i està connectat a l'"eix central" al mig matemàtic absolut. Així que per anar on sigui utilitzes el central: pujo (1) i baixo cap a on preteníem (2).<br/>*(Assumint base de mida suficient $ n \ge 4 $)*. |
| **6) Arbre Nul o Tornejos** $ T_n $ | Variable |  Si s'assumeix l'**Arbre Trivial** (null graph de l'anglès), $\infty $ per estar fragmentat totalment en el no-res. |
  

---

## Exercici 2.16: Impacte del tall al Diàmetre

### Enunciat

Per a cadascuna de les relacions següents sobre el diàmetre, doneu un graf $ G = (V, A)$ connex i un vèrtex $ u \in V $ que les satisfacin:
1) $ D(G) = D(G - u)$.
2) $ D(G) < D(G - u)$.
3) $ D(G) > D(G - u)$.

### Solució


L'eliminació d'un vèrtex pot afectar el diàmetre del graf depenent de si aquest vèrtex formava part dels camins més llargs o si servia de "drecera" entre els altres nodes.

**1) El diàmetre es manté igual**: $ D(G) = D(G - u)$
*   **Exemple:** Un graf complet $ G = K_4 $ i qualsevol vèrtex $ u $.
*   **Raonament:** En $ K_4 $, la distància entre qualsevol parell és $ 1 $. Si eliminem $ u $, ens queda $ K_3 $, on la distància segueix sent $ 1 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**2) El diàmetre augmenta**: $ D(G) < D(G - u)$
*   **Exemple:** El graf roda $ G = W_7 $ i el vèrtex central $ u $.
*   **Raonament:** El vèrtex $ u $ connecta a tothom ($ D=2 $). Sense ell, queda $ C_6 $ on el diàmetre puja a $ 3 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**3) El diàmetre disminueix**: $ D(G) > D(G - u)$
*   **Exemple:** Un camí $ G = P_4 $ i un vèrtex extrem $ u $.
*   **Raonament:** En $ P_4 $, la distància màxima és $ 3 $. Si eliminem un extrem, el camí $ P_3 $ resultant té diàmetre $ 2 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*

  

---

## Exercici 2.17: Centre, Radi i Diàmetre

### Enunciat

1) Trobeu l'excentricitat de tots els vèrtexs, el radi, els vèrtexs centrals i el centre:
&nbsp;&nbsp;&nbsp;&nbsp;a) dels grafs de l'ex 2.1
&nbsp;&nbsp;&nbsp;&nbsp;b) del graf $ G = ([8], \{12, 14, 15, 23, 34, 38, 46, 47, 56, 67, 78\})$
2) Doneu un exemple d'un graf connex amb el radi i el diàmetre iguals.
3) Doneu un exemple d'un graf connex tal que el diàmetre sigui el doble del radi.

### Solució


Recordem les definicions clau:
*   **Excentricitat $ e(v)$:** La distància més gran entre $ v $ i qualsevol altre vèrtex de $ G $.
*   **Radi $ Rad(G)$:** La mínima de les excentricitats de $ G $.
*   **Diàmetre $ D(G)$:** La màxima de les excentricitats de $ G $.
*   **Centre:** El conjunt de vèrtexs que tenen excentricitat mínima ($ e(v) = Rad(G)$).

### 1) a) Grafs de l'Exercici 2.1

És un graf altament simètric (vèrtex-transitiu), el que implica que tots els vèrtexs tenen la mateixa excentricitat.

*[Gràfic interactiu disponible a la versió web de l'apunt]*


*   **Excentricitat:** $\forall v, e(v) = 2 $.
*   **Radi:** $ Rad(G) = 2 $.
*   **Diàmetre:** $ D(G) = 2 $.
*   **Centre:** $ V(G)$ (tots els 10 vèrtexs).

Aquest graf té un node unificat a l'anell interior ($ 11 $), el que trenca la simetria.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


*   **Radi:** $ 2 $ / **Diàmetre:** $ 3 $.
*   **Vèrtexs centrals:** Nodes com el $ 6 $, $ 7 $ o $ 11 $ que estan ben comunicats amb ambdós anells.

### 1) b) Graf $ G = ([8], A)$

Calculant les distàncies més llargues de cada node:


*[Gràfic interactiu disponible a la versió web de l'apunt]*


| Vèrtex $ v $ | 1 | 2 | 3 | **4** | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Excentricitat $ e(v)$** | 3 | 3 | 3 | **2** | 3 | 3 | 3 | 3 |

*   **Radi:** $ Rad(G) = 2 $
*   **Diàmetre:** $ D(G) = 3 $
*   **Centre:** ${ 4 }$

### 2) Exemple de $ Radi = Diàmetre $

Qualsevol graf complet o graf vèrtex-transitiu compleix aquesta condició.
*   **Exemple:** $ G = K_3 $.
*   **Càlcul:** Tots els vèrtexs estan a distància $ 1 $ de tots els altres. $ e(v)=1 $ per a tothom. $ Rad = 1, Diam = 1 $.

### 3) Exemple de $ Diàmetre = 2 \times Radi $

Aquesta relació se sol donar en camins llargs on el centre és el punt mitjà.
*   **Exemple:** $ G = P_5 $ ($ 1-2-3-4-5 $).
*   **Càlcul:** 
    *   Vèrtex central **3**: $ e(3) = 2 $ (distància cap a 1 o 5). Per tant, $ Rad(G) = 2 $.
    *   Vèrtexs extrems **1** o **5**: $ e(1) = e(5) = 4 $ (distància entre ells). Per tant, $ D(G) = 4 $.
    *   Efectivament, $ 4 = 2 \cdot 2 $. $\square $
  

---

## Exercici 2.18: Diàmetre Mínim per Densitat Alta

### Enunciat

Sigui $ G $ un graf d'ordre $ 1001 $ tal que cada vèrtex té grau $\ge 500 $. Demostreu que $ G $ té diàmetre $\le 2 $.

### Solució


Aquest exercici es resol mitjançant una **reducció a l'absurd**. L'objectiu és demostrar que la densitat del graf (que cada node estigui connectat a gairebé la meitat dels altres) força que qualsevol parell de vèrtexs estigui a distància màxima 2.



### Resum de la demostració:

1.  **Suposició per absurd:** Suposem que el diàmetre és $ ge 3 $. Això implica que existeixen dos vèrtexs $ u $ i $ v $ tals que la seva distància mínima és 3 ($ d(u,v) ge 3 $).
2.  **Conseqüències de la distància:**
    *   $ u $ i $ v $ no són adjacents ($ d=1 $).
    *   $ u $ i $ v $ no tenen cap veí en comú ($ d=2 $). És a dir, $ N(u) cap N(v) = emptyset $.
3.  **Recompte de vèrtexs:**
    *   Tenim el propi vèrtex ${u}$.
    *   Tenim els seus veïns $ N(u)$, que són com a mínim $ 500 $.
    *   Tenim el propi vèrtex ${v}$.
    *   Tenim els seus veïns $ N(v)$, que són com a mínim $ 500 $.
4.  **Càlcul de l'ordre mínim:**
    Com que tots aquests conjunts són disjunts, el nombre total de vèrtexs $ n $ ha de ser:
    $$
n ge |{u}| + |{v}| + |N(u)| + |N(v)| ge 1 + 1 + 500 + 500 = 1002
$$
5.  **Contradicció:**
    L'enunciat ens diu que $ n = 1001 $. Com que $ 1002 > 1001 $, la nostra suposició inicial era falsa.

**Conclusió:** Per tant, no poden existir dos vèrtexs a distància 3 o superior. El diàmetre ha de ser $ D(G) le 2 $. $ square $
  

---

