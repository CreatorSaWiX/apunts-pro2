---
title: "Solucionari: Tema 4: Arbres i arbres generadors"
author: "Apunts"
---

# Solucionari: Tema 4: Arbres i arbres generadors

*L'estructura estrella. Caracterització i la seqüència de Prüfer.*

---

## Exercici 4.2: Arbre és Bipartit

### Enunciat

Proveu que tot arbre d'ordre $ n \ge 2 $ és un graf bipartit.

### Solució


Recordem dues definicions clau del Tema 4:
1.  **Arbre**: Un graf **connex** i **acíclic** (que no conté cap cicle).
2.  **Graf bipartit**: Un graf és bipartit si, i només si, **no conté cap cicle de longitud senar**.

Com que un arbre és acíclic per definició, no conté **cap cicle** (ni parell, ni senar). 

Per tant:
- Si no té cap cicle, en particular no té cicles de longitud senar.
- Si no té cicles de longitud senar, compleix el criteri necessari i suficient per ser un graf bipartit. $\square $


*[Gràfic interactiu disponible a la versió web de l'apunt]*



---

## Exercici 4.3: Ordre i Mida d'Arbres

### Enunciat

Sigui $ T_1 $ un arbre d'ordre $ n $ i mida 17 i $ T_2 $ un arbre d'ordre $ 2n $. Calculeu $ n $ i l'ordre i la mida de $ T_2 $.

### Solució


Per resoldre aquest exercici utilitzem una de les caracteritzacions fonamentals d'un arbre d'ordre $ n $ i mida $ m $:
$$
m = n - 1
$$

### 1. Càlcul de $ n $ (a partir de $ T_1 $)
Sabem que $ T_1 $ és un arbre d'ordre $ n $ i mida $ m_1 = 17 $:
$$
m_1 = n - 1
$$

$$
17 = n - 1 \implies n = 18
$$

### 2. Ordre i mida de $ T_2 $
Segons l'enunciat, l'arbre $ T_2 $ té un ordre $ n_2 = 2n $:
$$
n_2 = 2 \times 18 = 36
$$

Com que $ T_2 $ també és un arbre, la seva mida $ m_2 $ ha de seguir la relació $ m_2 = n_2 - 1 $:
$$
m_2 = 36 - 1 = 35
$$

**Conclusió:**
- $ n = 18 $
- Ordre de $ T_2 $: 36
- Mida de $ T_2 $: 35


---

## Exercici 4.5: Seqüència de Graus i Arbres No Isomorfs

### Enunciat

Sigui $ T $ un arbre d'ordre 12 que té exactament 3 vèrtexs de grau 3 i exactament un vèrtex de grau 2.
1) Trobeu la seqüència de graus de $ T $.
2) Trobeu dos arbres no isomorfs amb aquesta seqüència de graus.

### Solució


### 1) Trobeu la seqüència de graus de $ T $

Sabem que $ T $ és un arbre d'ordre $ n=12 $. Per tant, el nombre d'arestes és $ m = n - 1 = 11 $.
Utilitzant el lema de les encaixades, la suma dels graus dels vèrtexs és igual a $ 2m $:
$$
\sum_{v \in V} d(v) = 2 \times 11 = 22
$$

Aleshores, és obvi que la **seqüència de graus** és:
$$
(4, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1)
$$

---

### 2) Trobeu dos arbres no isomorfs

Per trobar dos arbres no isomorfs amb aquesta seqüència de graus, podem canviar com es connecten els vèrtexs de grau $>1 $ entre ells.

### Arbre A: Estel·lar (Centrat en el vèrtex de grau 4)
En aquest cas, el vèrtex de grau 4 connecta directament amb els tres de grau 3 i el de grau 2.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### Arbre B: Cadena central (Vèrtexs de grau > 1 alineats)
En aquest cas, formem un camí amb els vèrtexs de grau $>1 $: $ V_2 - V_3 - V_4 - V_3 - V_3 $.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


Aquests dos arbres **no són isomorfs** (per exemple, a l'Arbre A el vèrtex de grau 4 està a distància 1 del de grau 2, mentre que a l'Arbre B estan a distància 2).


---

## Exercici 4.6: Graf no arbre amb vèrtexs de tall

### Enunciat

Trobeu un graf connex tal que tot vèrtex de grau $\ge 2 $ sigui de tall però no sigui arbre.

### Solució


Perquè un graf **no sigui un arbre**, ha de contenir almenys un cicle. 

Tanmateix, en un cicle simple ($ C_n $), cap vèrtex és de tall (si n'eliminem un, la resta segueix connectada per un camí). Per aconseguir que els vèrtexs del cicle siguin de tall, hem d'afegir-hi vèrtexs "penjants" (fulles).

Un exemple és un **triangle ($ C_3 $) on cada vèrtex té una fulla adjacent**:


*[Gràfic interactiu disponible a la versió web de l'apunt]*


**Comprovació:**
1.  **Connex**: Sí, ho és.
2.  **No és arbre**: Conté el cicle ${v_0, v_1, v_2}$.
3.  **Vèrtexs de grau $\ge 2 $**: Són $ v_0, v_1, v_2 $ (tots de grau 3).
4.  **Tots són de tall**: Sí, si eliminem $ v_0 $, la fulla $ l_0 $ queda aïllada. El mateix passa amb $ v_1 $ i $ l_1 $, i $ v_2 $ i $ l_2 $.


---

## Exercici 4.7: Fórmula de les Fulles

### Enunciat

1) Sigui $ T $ un arbre d'ordre $ n \ge 2 $. Proveu que el nombre de fulles de $ T $ és:
$$
n_1 = 2 + \sum_{g(u) \ge 3} (g(u) - 2)
$$
2) Sigui $\Delta $ el grau màxim de $ T $ i $ n_i $ el nombre de vèrtexs de grau $ i $. Vegeu que la fórmula anterior es pot escriure com:
$$
n_1 = 2 + \sum_{i=2}^{\Delta} (i - 2) n_i
$$
3) Sigui $ G $ un graf connex on es compleix aquesta igualtat. Demostreu que $ G $ és un arbre.

### Solució


### 1) Demostració de la fórmula de les fulles

En un arbre d'ordre $ n $ i mida $ m = n - 1 $, usem les dues sumes bàsiques:
1.  **Ordre del graf ($ n $)**: És el nombre total de vèrtexs, $ n = |V|$.
2.  **Lema de les encaixades**: $\sum_{u \in V} g(u) = 2m = 2(n - 1) = 2n - 2 $

Com que $ 2n $ és el mateix que sumar un 2 per cada vèrtex, podem escriure: $ 2n = \sum_{u \in V} 2 $.

$$
\sum_{u \in V} g(u) - \sum_{u \in V} 2 = -2 \implies
$$
$$
\sum_{u \in V} (g(u) - 2) = -2
$$

Ara separem el sumatori segons el grau dels vèrtexs:
- Per a les **fulles**: $ g(u) - 2 = 1 - 2 = -1 $.
- Per als **vèrtexs de grau 2**: $ g(u) - 2 = 2 - 2 = 0 $.
- Per als **vèrtexs de grau $\ge 3 $**: mantenim el terme $(g(u) - 2)$.

L'equació esdevé:
$$
\sum_{g(u)=1} (-1) + \sum_{g(u)=2} (0) + \sum_{g(u) \ge 3} (g(u) - 2) = -2
$$

Si $ n_1 = n_{g(u)=1}$ (nombre de fulles, grau = 1):

$$
\underbrace{(-1) + (-1) + \dots + (-1)}_{n_1 \text{ vegades}} + \sum_{g(u)=2} (0) + \sum_{g(u) \ge 3} (g(u) - 2) = -2 \implies
$$

$$
-n_1 + 0 + \sum_{g(u) \ge 3} (g(u) - 2) = -2 \implies
$$
$$
n_1 = 2 + \sum_{g(u) \ge 3} (g(u) - 2) \quad \square
$$

---

### 2) Notació amb la suma de graus $ n_i $

Podem reescriure el sumatori anterior utilitzant $ n_i $ (nombre de vèrtexs de grau $ i $):

$$
\sum_{g(u) \ge 3} (g(u) - 2) = \sum_{i=3}^{\Delta} (i - 2) n_i
$$

A més, com que el terme per $ i=2 $ és $(2 - 2) n_2 = 0 $, podem incloure'l sense variar el resultat:

$$
n_1 = 2 + \sum_{i=2}^{\Delta} (i - 2) n_i \quad \square
$$

---

### 3) Demostració que $ G $ és un arbre

Si el graf $ G $ és connex i compleix la igualtat $ n_1 = 2 + \sum_{i=2}^{\Delta} (i - 2) n_i $, podem desfer els passos anteriors:

$$
n_1 - \sum_{i=2}^{\Delta} (i - 2) n_i = 2
$$

$$
n_1 + \sum_{i=2}^{\Delta} 2 n_i - \sum_{i=2}^{\Delta} i \cdot n_i = 2
$$

$$
2(n_1 + \sum_{i=2}^{\Delta} n_i) - (n_1 + \sum_{i=2}^{\Delta} i \cdot n_i) = 2
$$

$$
2n - \sum_{v \in V} d(v) = 2
$$

Per tant, la suma de graus és $\sum d(v) = 2n - 2 $. 
Com que en qualsevol graf $\sum d(v) = 2m $, tenim que $ 2m = 2n - 2 $, és a dir, **$ m = n - 1 $**.

Un graf **connex** amb **$ n - 1 $ arestes** és, per definició, un **arbre**. $\square $


---

## Exercici 4.8: Condició per ser Arbre (Graus 1 i 5)

### Enunciat

Sigui $ G $ un graf connex que només té vèrtexs de grau 1 i de grau 5. Sigui $ k $ el nombre de vèrtexs de grau 5. Demostreu que $ G $ és un arbre si, i només si, el nombre de fulles és $ 3k + 2 $.

### Solució

Volem demostrar l'equivalència: $ G $ és arbre $\iff n_1 = 3k + 2 $.
Com que el graf és connex, $ G $ és un arbre si, i només si, $(\sum d(v) = 2n - 2)$.

Dades del graf:
- $ n $ vèrtexs en total.
- $ k $ vèrtexs de grau 5.
- $ n_1 $ vèrtexs de grau 1 (fulles).
- No hi ha vèrtexs de cap altre grau $\implies n = k + n_1 $.

### 1. Càlcul de la suma de graus
$$
\sum d(v) = (5 \cdot k) + (1 \cdot n_1) = 5k + n_1
$$

### 2. Condició per ser arbre
$ G $ és un arbre $\iff \sum d(v) = 2n - 2 $.
Substituïm els valors:
$$
5k + n_1 = 2(k + n_1) - 2 \implies
$$
$$
5k + n_1 = 2k + 2n_1 - 2 \implies
$$
$$
5k - 2k + 2 = 2n_1 - n_1 \implies
$$
$$
3k + 2 = n_1
$$

Per tant, $ G $ és un arbre si, i només si, el nombre de fulles és exactament **$ 3k + 2 $**. $ square $


---

## Exercici 4.9: Grau Màxim i Nombre de Fulles

### Enunciat

Sigui $ T $ un arbre d'ordre $ n \ge 2 $ i de grau màxim $\Delta $. Proveu que $ T $ té un mínim de $\Delta $ fulles.

### Solució

Utilitzarem la fórmula de les fulles demostrada a l'exercici 4.7:
$$
n_1 = 2 + \sum_{i=3}^{\Delta} (i - 2) n_i
$$

Sabem que el grau màxim de l'arbre és $\Delta $. Això implica que existeix, almenys, un vèrtex de grau $\Delta $. Per tant, el nombre de vèrtexs de grau $\Delta $ és **$ n_{\Delta} \ge 1 $**.
Separem el terme corresponent a $ i = \Delta $ del sumatori:
$$
n_1 = 2 + (\Delta - 2) n_{\Delta} + \sum_{i=3}^{\Delta - 1} (i - 2) n_i
$$

Com que tots els $ n_i $ són enters no negatius ($ n_i \ge 0 $) i els coeficients $(i-2)$ són positius ($ i \ge 3 $), el sumatori restant és $\ge 0 $. A més, sabem que $ n_{\Delta} \ge 1 $:

$$
n_1 \ge 2 + (\Delta - 2) \cdot 1
$$
$$
n_1 \ge 2 + \Delta - 2
$$
$$
n_1 \ge \Delta
$$

Per tant, qualsevol arbre amb grau màxim $\Delta $ ha de tenir, com a mínim, **$\Delta $ fulles**. $\square $


---

## Exercici 4.10: Caracteritzacions del Graf Estrella

### Enunciat

Demostreu que les afirmacions següents són equivalents per a un arbre $ T $ d'ordre $ n \ge 3 $:

  a) $ T $ és isomorf al graf estrella $ K_{1,n-1}$.

  b) $ T $ té exactament $ n - 1 $ fulles.

  c) $ T $ té grau màxim $ n - 1 $.

  d) $ T $ té diàmetre igual a 2.

### Solució


Per demostrar l'equivalència, provarem la seqüència: $ a \implies b \implies c \implies d \implies a $.

### a) $\implies $ b)
Si $ T \cong K_{1,n-1}$, tenim un vèrtex central connectat a tot la resta. La resta de $ n-1 $ vèrtexs només tenen una aresta (la que va al centre), per tant, tots ells són fulles (grau 1). Llavors, hi ha exactament **$ n-1 $ fulles**.

### b) $\implies $ c)
Si l'arbre té $ n-1 $ fulles, només queda $ 1 $ vèrtex que no és fulla ($ n - (n-1) = 1 $). Anomenem-lo $ v $.
Sabem que la suma de graus és $ 2n - 2 $. Sumem els graus:
$$
(n-1) \cdot 1 + g(v) = 2n - 2 \implies g(v) = (2n - 2) - (n - 1) = n - 1
$$
Així, el **grau màxim és $ n - 1 $**.

### c) $\implies $ d)
Sia $ v $ el vèrtex de grau $ n-1 $. Com que el graf té $ n $ vèrtexs, $ v $ ha d'estar connectat a tots els altres vèrtexs de l'arbre.
- La distància de $ v $ a qualsevol altre vèrtex és 1.
- La distància entre qualsevol parell de vèrtexs que no són $ v $ és 2 (passant per $ v $). Com que $ n \ge 3 $, existeixen almenys dos vèrtexs d'aquest tipus.
El **diàmetre** (distància màxima) és, per tant, **2**.

### d) $\implies $ a)
Si el diàmetre és 2, no pot haver-hi cap camí de longitud 3 ($ u-v-w-z $). En un arbre, això només és possible si hi ha un únic vèrtex "central" connectat a tota la resta (fulles), o si fos un $ K_2 $ (però $ n \ge 3 $). Si hi hagués dos vèrtexs de grau $\ge 2 $ connectats entre ells, el diàmetre seria com a mínim 3. Per tant, $ T $ ha de ser un **graf estrella $ K_{1,n-1}$**. $\square $


---

## Exercici 4.11: Grafs Unicíclics

### Enunciat

Sigui $ G $ un graf d'ordre $ n $ i mida $ m $. Demostreu que les propietats següents són equivalents:
a) El graf $ G $ és connex i té un únic cicle.
b) Existeix una aresta $ a $ de $ G $ tal que $ G - a $ és un arbre.
c) El graf $ G $ és connex i $ n = m $.

### Solució


Probarem l'equivalència mitjançant la cadena: $ a \implies b \implies c \implies a $.

### a) $\implies $ b)
Si $ G $ és connex i té un **únic cicle**, qualsevol aresta $ a $ que formi part d'aquest cicle no és un pont (eliminar-la no desconnecta el graf). Per tant, $ G - a $ segueix sent connex. Com que hem trencat l'únic cicle que existia, $ G - a $ passa a ser acíclic. Un graf connex i acíclic és, per definició, un **arbre**.

### b) $\implies $ c)
Si existeix una aresta $ a $ tal que $ G - a $ és un arbre:
- L'arbre $ G - a $ té ordre $ n $ (els vèrtexs no canvien) i mida $ m - 1 $ (hem tret una aresta).
- Per la propietat dels arbres, $(m - 1) = n - 1 \implies \mathbf{m = n}$.
- Com que l'arbre $ G - a $ és connex, el graf original $ G $ també ha de ser **connex**.

### c) $\implies $ a)
Si $ G $ és connex i $ n = m $:
- Sabem que un graf connex necessita com a mínim $ n - 1 $ arestes per ser acíclic (arbre). En tenir $ n $ arestes (una més del compte), el graf **ha de contenir almenys un cicle**.
- Si eliminem una aresta $ a $ d'aquest cicle, obtenim un graf connex amb $ n $ vèrtexs i $ n - 1 $ arestes. Aquest subgraf ha de ser un arbre (i per tant, acíclic).
- Si el graf original tingués més d'un cicle, el subgraf encara contindria algun cicle i no seria un arbre. Per tant, el cicle inicial ha de ser **únic**. $\square $


---

## Exercici 4.12: Arbres generadors de C_n i K_{2,r}

### Enunciat

1) Calculeu el nombre d'arbres generadors diferents del graf cicle $ C_n $. Quants n'hi ha llevat isomorfismes?
2) Calculeu el nombre d'arbres generadors diferents del graf bipartit complet $ K_{2,r}$. Quants n'hi ha llevat isomorfismes?

### Solució


### 1) Graf Cicle $ C_n $

- **Nombre d'arbres generadors diferents**:
Un graf cicle $ C_n $ té $ n $ vèrtexs i $ n $ arestes. Un arbre generador ha de tenir $ n - 1 $ arestes i no tenir cicles. Per tant, l'única manera d'obtenir un arbre generador és eliminant exactament **una aresta** del cicle. Com que hi ha $ n $ arestes possibles per triar, hi ha **$ n $ arbres generadors diferents**.

- **Llevat isomorfismes**:
Qualsevol arbre obtingut eliminant una aresta d'un cicle $ C_n $ és un graf camí $ P_n $ d'ordre $ n $. Com que tots els vèrtexs d'un cicle són equivalents per simetria, tots aquests arbres són isomorfs entre si. Per tant, només hi ha **1** arbre generador llevat isomorfismes.

---

### 2) Graf Bipartit Complet $ K_{2,r}$

- **Nombre d'arbres generadors diferents**:
Podem utilitzar la fòrmula general per al nombre d'arbres generadors d'un graf bipartit complet $ K_{n_1, n_2}$, que és $ n_1^{n_2-1} \cdot n_2^{n_1-1}$.
En aquest cas, $ n_1 = 2 $ i $ n_2 = r $:
$$
\tau(K_{2,r}) = 2^{r-1} \cdot r^{2-1} = \mathbf{r \cdot 2^{r-1}}
$$

- **Llevat isomorfismes**:
Siguin $ A, B $ els dos vèrtexs de la partició de mida 2, i ${v_1, \dots, v_r}$ els vèrtexs de la partició de mida $ r $. Qualsevol arbre generador ha de connectar $ A $ i $ B $ a través d'exactament un vèrtex $ v_i $ (si es connectessin per més d'un, hi hauria un cicle).
Els altres $ r-1 $ vèrtexs de la partició de mida $ r $ han d'estar connectats a $ A $ o a $ B $ com a fulles (només una aresta per no crear cicles).
Un arbre estarà determinat per quants d'aquests $ r-1 $ vèrtexs pengen d'un costat o de l'altre. Siga $ k $ el nombre de vèrtexs fulla connectats a $ A $, llavors hi haurà $(r-1-k)$ vèrtexs fulla connectats a $ B $.
Dos arbres són isomorfs si tenen els mateixos graus per als vèrtexs $ A $ i $ B $ (que són intercanviables). Això equival a comptar quantes combinacions no ordenades del tipus ${k, r-1-k}$ podem fer, on $ k \in \{0, 1, \dots, r-1\}$.

El nombre de classes d'isomorfisme és **$\lceil r/2 \rceil $**.
*(Exemple per $ r=3 $: conjunts ${0, 2}$ i ${1, 1}$, total 2).*


---

## Exercici 4.15: Fulles del Spanning Tree i Vèrtexs de Tall

### Enunciat

Demostreu que si $ T $ és un arbre generador de $ G $, aleshores les fulles de $ T $ no són vèrtexs de tall de $ G $. Conclogueu que tot graf connex d'ordre $ n \ge 2 $ té almenys dos vèrtexs que no són vèrtexs de tall.

### Solució


Si $ T $ és un arbre generador d'un graf connex $ G $, i sia $ v $ una fulla de $ T $. Volem veure que $ G - v $ és connex (és a dir, que $ v $ no és un vèrtex de tall).


*[Gràfic interactiu disponible a la versió web de l'apunt]*


1.  Com que $ v $ és una fulla de l'arbre $ T $, sabem que el subgraf $ T - v $ és connex (eliminar una fulla d'un arbre sempre dóna lloc a un altre arbre).
2.  L'arbre generador $ T $ conté tots els vèrtexs de $ G $. Per tant, $ T - v $ conté tots els vèrtexs del graf $ G - v $.
3.  $ T - v $ és un subgraf de $ G - v $ (ja que les arestes de l'arbre són arestes del graf original).
4.  Si un subgraf ($ T-v $) que conté tots els vèrtexs és connex, llavors el graf que el conté ($ G-v $) també ha de ser **connex**.

En conseqüència, el vèrtex $ v $ **no és un vèrtex de tall** de $ G $.

### Conclusió

- Tot graf connex $ G $ d'ordre $ n \ge 2 $ té almenys un arbre generador $ T $.
- Qualsevol arbre d'ordre $ n \ge 2 $ té, com a mínim, **dues fulles**.
- Com hem demostrat, cada fulla d'un arbre generador és un vèrtex que no és de tall per al graf original.

Per tant, tot graf connex d'ordre $ n \ge 2 $ té **almenys dos vèrtexs** que no són vèrtexs de tall. $\square $


---

## Exercici 4.16: Seqüències de Prüfer

### Enunciat

Trobeu les seqüències de Prüfer dels arbres següents:
- $ T_1 = ([6], \{12, 13, 14, 15, 56\})$
- $ T_2 = ([8], \{12, 13, 14, 18, 25, 26, 27\})$
- $ T_3 = ([11], \{12, 13, 24, 25, 36, 37, 48, 49, 5 \: 10, 5 \: 11\})$

### Solució

### 1) $ T_1 = ([6], \{1,2, 1,3, 1,4, 1,5, 5,6\})$
1. Fulla més petita: **2**. Veí: **1**. Seq: $(1)$
2. Fulla més petita: **3**. Veí: **1**. Seq: $(1, 1)$
3. Fulla més petita: **4**. Veí: **1**. Seq: $(1, 1, 1)$
4. Fulla més petita: **1**. Veí: **5**. Seq: $(1, 1, 1, 5)$
5. Queden els vèrtexs 5 i 6. Final.

**Resultat**: $ P(T_1) = (1, 1, 1, 5)$


*[Vídeo interactiu disponible a la versió web]*


---

### 2) $ T_2 = ([8], \{1,2, 1,3, 1,4, 1,8, 2,5, 2,6, 2,7\})$
1. Fulla més petita: **3**. Veí: **1**. Seq: $(1)$
2. Fulla més petita: **4**. Veí: **1**. Seq: $(1, 1)$
3. Fulla més petita: **5**. Veí: **2**. Seq: $(1, 1, 2)$
4. Fulla més petita: **6**. Veí: **2**. Seq: $(1, 1, 2, 2)$
5. Fulla més petita: **7**. Veí: **2**. Seq: $(1, 1, 2, 2, 2)$
6. Fulla més petita: **2**. Veí: **1**. Seq: $(1, 1, 2, 2, 2, 1)$
7. Queden els vèrtexs 1 i 8. Final.

**Resultat**: $ P(T_2) = (1, 1, 2, 2, 2, 1)$


*[Vídeo interactiu disponible a la versió web]*


---

### 3) $ T_3 = ([11], \{1,2, 1,3, 2,4, 2,5, 3,6, 3,7, 4,8, 4,9, 5,10, 5,11\})$
1. Fulla més petita: **6**. Veí: **3**. Seq: $(3)$
2. Fulla més petita: **7**. Veí: **3**. Seq: $(3, 3)$
3. Fulla més petita: **3**. Veí: **1**. Seq: $(3, 3, 1)$
4. Fulla més petita: **1**. Veí: **2**. Seq: $(3, 3, 1, 2)$
5. Fulla més petita: **8**. Veí: **4**. Seq: $(3, 3, 1, 2, 4)$
6. Fulla més petita: **9**. Veí: **4**. Seq: $(3, 3, 1, 2, 4, 4)$
7. Fulla més petita: **4**. Veí: **2**. Seq: $(3, 3, 1, 2, 4, 4, 2)$
8. Fulla més petita: **2**. Veí: **5**. Seq: $(3, 3, 1, 2, 4, 4, 2, 5)$
9. Fulla més petita: **10**. Veí: **5**. Seq: $(3, 3, 1, 2, 4, 4, 2, 5, 5)$
10. Queden els vèrtexs 5 i 11. Final.

**Resultat**: $ P(T_3) = (3, 3, 1, 2, 4, 4, 2, 5, 5)$


*[Vídeo interactiu disponible a la versió web]*



---

## Exercici 4.17: Reconstrucció d'arbres des de seqüències de Prüfer

### Enunciat

Trobeu els arbres que tenen les seqüències de Prüfer següents:
1) $(4,4,3,1,1)$
2) $(6,5,6,5,1)$
3) $(1,8,1,5,2,5)$
4) $(4,5,7,2,1,1,6,6,7)$

### Solució

### 1) $(4,4,3,1,1) \rightarrow n = 7 $
- **Graus inicials**: $ g(1)=3, g(2)=1, g(3)=2, g(4)=3, g(5)=1, g(6)=1, g(7)=1 $
- **Tratament**:
  1. $ P[1]=4 \rightarrow $ fulla mín: **2**. Aresta: **(2,4)**. Graus: $ g(4)=2, g(2)=0 $
  2. $ P[2]=4 \rightarrow $ fulla mín: **5**. Aresta: **(5,4)**. Graus: $ g(4)=1, g(5)=0 $. Ara **4** és fulla.
  3. $ P[3]=3 \rightarrow $ fulla mín: **4**. Aresta: **(4,3)**. Graus: $ g(3)=1, g(4)=0 $. Ara **3** és fulla.
  4. $ P[4]=1 \rightarrow $ fulla mín: **3**. Aresta: **(3,1)**. Graus: $ g(1)=2, g(3)=0 $. Ara **1** és fulla... no, perdó, $ g(1)$ era 3, ara és 2.
  5. $ P[5]=1 \rightarrow $ fulla mín: **6**. Aresta: **(6,1)**. Graus: $ g(1)=1, g(6)=0 $. Ara **1** és fulla.
- **Aresta final**: Queden **1** i **7**. Aresta: **(1,7)**.

**Arestes**: $\{1,3, 1,6, 1,7, 2,4, 3,4, 4,5\}$


*[Vídeo interactiu disponible a la versió web]*


---

### 2) $(6,5,6,5,1) \rightarrow n = 7 $
- **Graus inicials**: $ g(1)=2, g(2)=1, g(3)=1, g(4)=1, g(5)=3, g(6)=3, g(7)=1 $
- **Tratament**:
  1. $ P[1]=6 \rightarrow $ fulla mín: **2**. Aresta: **(2,6)**. Graus: $ g(6)=2, g(2)=0 $
  2. $ P[2]=5 \rightarrow $ fulla mín: **3**. Aresta: **(3,5)**. Graus: $ g(5)=2, g(3)=0 $
  3. $ P[3]=6 \rightarrow $ fulla mín: **4**. Aresta: **(4,6)**. Graus: $ g(6)=1, g(4)=0 $. Ara **6** és fulla.
  4. $ P[4]=5 \rightarrow $ fulla mín: **6**. Aresta: **(6,5)**. Graus: $ g(5)=1, g(6)=0 $. Ara **5** és fulla.
  5. $ P[5]=1 \rightarrow $ fulla mín: **5**. Aresta: **(5,1)**. Graus: $ g(1)=1, g(5)=0 $. Ara **1** és fulla.
- **Aresta final**: Queden **1** i **7**. Aresta: **(1,7)**.

**Arestes**: $\{1,5, 1,7, 2,6, 3,5, 4,6, 5,6\}$


*[Vídeo interactiu disponible a la versió web]*


---

### 3) $(1,8,1,5,2,5) \rightarrow n = 8 $
- **Graus inicials**: $ g(1)=3, g(2)=2, g(3)=1, g(4)=1, g(5)=3, g(6)=1, g(7)=1, g(8)=2 $
- **Tratament**:
  1. $ P[1]=1 \rightarrow $ fulla mín: **3**. Aresta: **(3,1)**. $ g(1)=2, g(3)=0 $
  2. $ P[2]=8 \rightarrow $ fulla mín: **4**. Aresta: **(4,8)**. $ g(8)=1, g(4)=0 $. Ara **8** és fulla.
  3. $ P[3]=1 \rightarrow $ fulla mín: **6**. Aresta: **(6,1)**. $ g(1)=1, g(6)=0 $. Ara **1** és fulla.
  4. $ P[4]=5 \rightarrow $ fulla mín: **1**. Aresta: **(1,5)**. $ g(5)=2, g(1)=0 $.
  5. $ P[5]=2 \rightarrow $ fulla mín: **7**. Aresta: **(7,2)**. $ g(2)=1, g(7)=0 $. Ara **2** és fulla.
  6. $ P[6]=5 \rightarrow $ fulla mín: **2**. Aresta: **(2,5)**. $ g(5)=1, g(2)=0 $. Ara **5** és fulla.
- **Aresta final**: Queden **5** i **8**. Aresta: **(5,8)**.

**Arestes**: $\{1,3, 1,5, 1,6, 2,5, 2,7, 4,8, 5,8\}$


*[Vídeo interactiu disponible a la versió web]*


---

### 4) $(4,5,7,2,1,1,6,6,7) \rightarrow n = 11 $
- **Graus**: $ g(1)=3, g(2)=2, g(3)=1, g(4)=2, g(5)=2, g(6)=3, g(7)=3, g(8)=1, g(9)=1, g(10)=1, g(11)=1 $
- **Tratament**:
  1. $ P[1]=4, min=3 \rightarrow (3,4)$. $ g(4)=1 $
  2. $ P[2]=5, min=4 \rightarrow (4,5)$. $ g(5)=1 $
  3. $ P[3]=7, min=5 \rightarrow (5,7)$. $ g(7)=2 $
  4. $ P[4]=2, min=8 \rightarrow (8,2)$. $ g(2)=1 $
  5. $ P[5]=1, min=2 \rightarrow (2,1)$. $ g(1)=2 $
  6. $ P[6]=1, min=9 \rightarrow (9,1)$. $ g(1)=1 $
  7. $ P[7]=6, min=1 \rightarrow (1,6)$. $ g(6)=2 $
  8. $ P[8]=6, min=10 \rightarrow (10,6)$. $ g(6)=1 $
  9. $ P[9]=7, min=6 \rightarrow (6,7)$. $ g(7)=1 $
- **Aresta final**: Queden **7** i **11**. Aresta: **(7,11)**.

**Arestes**: $\{1,2, 1,6, 1,9, 2,8, 3,4, 4,5, 5,7, 6,7, 6,10, 7,11\}$


*[Vídeo interactiu disponible a la versió web]*



---

