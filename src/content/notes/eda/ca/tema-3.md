---
title: "Tema 3: Diccionaris"
description: "TAD diccionari, hash tables i col·lisions, BST i  AVL."
readTime: "35 min"
order: 3
draft: false
---

<!-- Un **diccionari** emmagatzema parelles **(clau, informació)** i permet cercar, inserir i esborrar elements per la seva clau. La taula compara totes les implementacions estudiades:

| Implementació | Cerca (mitjà / pitjor) | Inserció (mitjà / pitjor) | Esborrat (mitjà / pitjor) | Requisit | C++ STL |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Vector no ordenat** | $\Theta(n) / \Theta(n)$ | $\Theta(n) / \Theta(n)$ | $\Theta(n) / \Theta(n)$ | Igualtat (`==`) | `vector<pair<K,I>>` |
| **Vector ordenat** | $\Theta(\log n) / \Theta(\log n)$ | $\Theta(n) / \Theta(n)$ | $\Theta(n) / \Theta(n)$ | Ordre total (`<`) | Vector ordenat manual |
| **Hash (*Taula de dispersió*)** | $\Theta(1) / \Theta(n)$ | $\Theta(1) / \Theta(n)$ | $\Theta(1) / \Theta(n)$ | Hash + igualtat | `unordered_map<K,I>` |
| **Arbre Binari de Cerca (ABC)** | $\Theta(\log n) / \Theta(n)$ | $\Theta(\log n) / \Theta(n)$ | $\Theta(\log n) / \Theta(n)$ | Ordre total (`<`) | *(teòric)* |
| **Arbre AVL / RB** | $\Theta(\log n) / \Theta(\log n)$ | $\Theta(\log n) / \Theta(\log n)$ | $\Theta(\log n) / \Theta(\log n)$ | Ordre total (`<`) | `map<K,I>` | 

---
-->

## 3.1. Tipus Abstractes de Dades (TAD)

Un **TAD** especifica el *comportament* d'una estructura de dades de manera independent de la seva implementació: **saber el *què* sense saber el *com*.**
Formalment, un TAD es defineix per tres elements: els **valors** vàlids, les **operacions** (signatures), i les **propietats** (axiomes equacionals) que relacionen les operacions.

:::tadviz
:::
<!-- 
### Exemples d'especificació formal de TADs

**TAD Booleans** — Valors: $\text{Bool} = \{\text{cert}, \text{fals}\}$; Operacions: $\text{i}, \text{o}, \text{no}$; Axiomes:
$$\text{i}(\text{cert}, x) = x, \quad \text{i}(\text{fals}, x) = \text{fals}, \quad \text{o}(\text{cert}, x) = \text{cert}, \quad \text{no}(\text{cert}) = \text{fals}$$

**TAD Enters** — Valors: $\mathbb{Z}$ (en hardware, $[-2^{31}, 2^{31}-1]$ en 32 bits amb complement a 2); Operacions: $+, -, \times, /, \%$; Axiomes: $a + 0 = a$, $a \cdot 0 = 0$, definició del *overflow*, etc.

**TAD Naturals (Peano)** — Valors: $\mathbb{N}$ generat per $\text{zero}$ i $\text{suc}$; Axiomes:
$$\text{suma}(\text{zero}, x) = x, \quad \text{suma}(\text{suc}(x), y) = \text{suc}(\text{suma}(x, y))$$
$$\text{iguals?}(\text{zero}, \text{zero}) = \text{cert}, \quad \text{iguals?}(\text{suc}(x), \text{zero}) = \text{fals}, \quad \text{iguals?}(\text{suc}(x), \text{suc}(y)) = \text{iguals?}(x, y)$$

> Observa que cap axioma especifica com es representa el valor en memòria (1 bit, 1 byte, complement a 2...). -->

---

## 3.2. El TAD Diccionari

Un diccionari emmagatzema parelles **(clau, valor)** ($k \in K$, $i \in I$) i permet gestionar-les eficientment:

* **Claus úniques:** No pot haver-hi claus repetides; si s'assigna una clau existent, el valor se sobreescriu.
* **Accés per clau:** Totes les cerques i esborrats s'efectuen sempre per la clau, mai pel valor.
* **Múltiples claus poden tenir el mateix valor associat.**

:::dictviz
:::

### Operacions 
* **`assignar(k, v)` / `insert`:** Afegeix el parell $(k, v)$ o actualitza el valor si $k$ ja existeix.
* **`esborrar(k)` / `erase`:** Elimina l'element amb clau $k$.
* **`consultar(k)` / `find`:** Retorna el valor associat a $k$ (o indica que no existeix).
* **`present(k)` / `count`:** Comprova si la clau $k$ és al diccionari.
* **`talla()` / `size`:** Retorna el nombre d'elements.

---

## 3.3. Implementacions elementals del diccionari

Sobre una col·lecció de $n$ elements, les estructures lineals presenten colls d'ampolla inevitables:

| Estructura | Assignar | Esborrar | Consultar | Coll d'ampolla |
| :--- | :---: | :---: | :---: | :--- |
| **Vector no ordenat** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Cal recórrer tot el vector per verificar unicitat. |
| **Llista no ordenada** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Sense accés directe; cerca lineal obligatòria. |
| **Vector ordenat** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(\log n)$ | Cerca binària $\Theta(\log n)$, però inserir desplaça $\Theta(n)$ elements. |
| **Llista ordenada** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Ordenada però sense accés per índex; no admet cerca binària. |

**Truc d'esborrat en vector no ordenat ($\Theta(1)$):** copiar l'últim element al forat del node esborrat i fer `pop_back()`. Evita desplaçar elements però no preserva l'ordre.

---

## 3.4. Taules de dispersió (*Hash Tables*)

Les **taules de dispersió** assoleixen cerca, inserció i esborrat en **temps constant esperat $\Theta(1)$**, a canvi d'un cas pitjor $\Theta(n)$ (quan tot col·lisiona).

### Taules d'accés directe

La forma més simple de guardar dades és fer servir la clau directament com a índex d'un vector: `T[clau] = valor`. Això dona accés immediat en temps $\Theta(1)$.

Si les claus són números molt grans (com el DNI, fins a 8 dígits) i només tenim 300 usuaris, caldria reservar un vector de $10^8$ caselles (100 mil·lions!) a la memòria RAM per utilitzar-ne només 300. És un malbaratament inassumible.

:::directaddressviz
:::

### La funció de dispersió (*Hash function*)

Per solucionar-ho, fem una taula $T$ de mida raonable $m$ (proporcional al nombre d'elements reals que tenim) i usem una **funció hash $h$** per traduir qualsevol clau (sigui un número gran o una paraula) a una posició vàlida de la taula:

$$
\text{posició} = h(\text{clau}) \quad (\text{entre } 0 \text{ i } m-1)
$$

L'element es guarda a la casella `T[h(clau)]`.

:::hashviz
:::

Una bona funció hash ha de ser:
1. **Consistent (determinista):** Per a la mateixa clau, sempre ha de retornar el mateix índex.
2. **Ràpida:** Calcular $h(\text{clau})$ ha de costar temps constant $\Theta(1)$.
3. **Uniforme:** Ha de repartir els elements per tota la taula per evitar que s'acumulin a les mateixes caselles (per exemple, fer servir els últims dígits d'un codi en comptes dels primers, que solen repetir-se).

### Col·lisions

Com que tenim infinites claus possibles però la taula té un nombre limitat de caselles, és inevitable que tard o d'hora **dues claus diferents acabin donant el mateix índex** ($h(k_1) = h(k_2)$).

:::collisionviz
:::

Això s'anomena una **col·lisió**, i qualsevol taula de dispersió necessita un mètode per gestionar-les (com veurem amb l'encadenament i l'adreçament obert).

---

### Resolució de col·lisions per Encadenament (*Separate Chaining*)

Cada casella $T[j]$ és una **llista enllaçada** de tots els elements amb $h(k) = j$.

:::chainingviz
:::

El **factor de càrrega** $\alpha = n/m$ intueix el nombre mitjà d'elements per llista:

| Cas | Cost | Condició |
| :--- | :---: | :--- |
| **Pitjor** | $\Theta(n)$ | Totes les $n$ claus col·lisionen a la mateixa casella. |
| **Mitjà** (dispersió uniforme simple) | $\Theta(1 + \alpha)$ | Cada clau cau uniformement a qualsevol posició. |
| **Mitjà amb $m = \Theta(n)$** | $\Theta(1)$ | Si $m \propto n$, aleshores $\alpha = \mathcal{O}(1)$. |
<!-- 
---

### Mètodes de disseny de funcions de dispersió

**Conversió de cadenes a naturals:** Una cadena $s = c_0 c_1 \dots c_{L-1}$ s'interpreta com un nombre en base 128 (ASCII):

$$k = \sum_{j=0}^{L-1} c_j \cdot 128^{L-1-j} \qquad \text{Exemple: "CLRS"} \implies 67 \cdot 128^3 + 76 \cdot 128^2 + 82 \cdot 128 + 83 = 141{.}764{.}947$$

**Mètode de la divisió:**
$$h(k) = k \bmod m$$
Molt ràpid (una operació mòdul). Cal evitar que $m$ sigui potència de 2 (en tal cas $k \bmod 2^p$ ignora tots els bits excepte els $p$ menys significatius). **Bona pràctica:** triar $m$ com un primer allunyat de potències de 2. Per a $n = 2000$ elements amb $\alpha \approx 3$ ($m \approx 667$), usem $m = 701$.

**Mètode de la multiplicació:**
$$h(k) = \lfloor m \cdot (k \cdot A \bmod 1) \rfloor, \qquad A \approx \frac{\sqrt{5}-1}{2} \approx 0.6180339887 \quad \text{(Knuth)}$$
La tria de $m$ **no és crítica** (convenient $m = 2^p$ per usar *bit shifts*). Exemple: $k = 123$, $m = 1024$, $A = 0.61803399 \implies 123 \cdot A = 76.018 \implies \text{fracció} = 0.018 \implies h(123) = \lfloor 1024 \cdot 0.018 \rfloor = 18$. -->

---

### Resolució de col·lisions per Adreçament Obert (*Open Addressing*)

A diferència de l'encadenament, aquí **no fem servir llistes externes**: tots els elements es guarden directament a les caselles de la taula. Per tant, mai podem tenir més elements que caselles ($n \le m$).

Quan volem inserir una clau i la seva casella ja està ocupada (col·lisió), **busquem la següent casella buida** segons una estratègia de cerca (anomenada *sondeig*):

:::openaddressviz
:::

| Estratègia | Com busca una casella lliure? | Pros i contres |
| :--- | :--- | :--- |
| **Sondeig lineal** | Mira la casella adjacent: prova a $+1, +2, +3, \dots$ | **Molt simple**, però pateix d'**agrupaments primaris** (es formen blocs grans de caselles consecutives ocupades que alenteixen les cerques). |
| **Sondeig quadràtic** | Salta distàncies quadràtiques: prova a $+1^2, +2^2, +3^2, \dots$ | Evita els blocs d'elements consecutius, tot i que claus amb el mateix hash fan els mateixos salts. |
| **Doble dispersió** | La mida del salt la calcula una segona funció hash: $+1 \cdot h_2(k), +2 \cdot h_2(k), \dots$ | **La millor distribució**: fins i tot si dues claus col·lideixen d'entrada, exploraran camins completament diferents. |

---

## 3.5. Arbres: Definicions i terminologia

Un **arbre** és una estructura jeràrquica formada per nodes i arestes sense cicles. En un **arbre arrelat**, un node destacat actua com a **arrel** $r$.

:::treeterviz
:::

* **Arrel:** El node superior (sense pare).
* **Pare i fills:** Nodes connectats directament en relació descendent.
* **Fulles:** Nodes que no tenen fills.
* **Ancestres i descendents:** Nodes en el camí cap amunt (cap a l'arrel) o cap avall (cap a les fulles).
* **Alçada ($h$):** Distància màxima (en arestes) des de l'arrel fins a una fulla.

### Arbres binaris

Un **arbre binari** és aquell on cada node té com a màxim dos fills: **fill esquerre** (`fesq`) i **fill dret** (`fdre`).

---

## 3.6. Arbres Binaris de Cerca (ABC / BST)

Un **ABC** implementa el diccionari aprofitant un **ordre total** sobre les claus.

### La Propietat ABC

Per a qualsevol node $x$ amb clau $k_x$:
* Tot node del **subarbre esquerre** té clau $< k_x$.
* Tot node del **subarbre dret** té clau $> k_x$.

:::abcviz
:::

> **Propietat clau d'examen:** El **recorregut en inordre** (Esquerre → Arrel → Dret) d'un ABC sempre visita les claus en **ordre estrictament creixent**.

:::oopviz{simulation="diccionari_abc"}
:::

---

### Operacions bàsiques de l'ABC

* **Cerca ($\Theta(h)$):** Aprofita l'ordenació per comparar la clau amb l'arrel i descartar la meitat de l'arbre a cada pas (si és menor anem a l'esquerra, si és major a la dreta).
::algoviz{algorithm="abc_cerca"}

* **Inserció ($\Theta(h)$):** Es cerca la clau; si ja existeix s'actualitza la informació, i si s'arriba a un punter buit s'enllaça un nou node fulla.
::algoviz{algorithm="abc_assignar"}

* **Mínim i màxim ($\Theta(h)$):** El mínim és el node més a l'esquerra; el màxim és el més a la dreta.
::algoviz{algorithm="abc_minim_maxim"}

* **Esborrat ($\Theta(h)$):** Depèn de quants fills té el node a eliminar:

| Cas | Acció |
| :--- | :--- |
| **0 fills (fulla)** | S'elimina directament (el punter del pare passa a `nullptr`). |
| **1 fill** | El pare adopta directament l'únic fill existent. |
| **2 fills** | Se substitueix pel seu **successor inordre** (el mínim del subarbre dret, que té $\le 1$ fill). |

:::oopviz{simulation="diccionari_esborrar"}
:::

---

### La problemàtica de l'alçada en un ABC

El cost de totes les operacions d'un ABC depèn directament de la seva alçada:

$$
T_{\text{cerca}},\; T_{\text{inserir}},\; T_{\text{esborrar}} \in \Theta(h)
$$

* **Cas mitjà (ordre aleatori):** L'arbre creix balancejat amb $h = \Theta(\log n)$.
* **Cas pitjor (claus ordenades $1, 2, 3 \dots$):** L'arbre degenera en una llista d'alçada $h = n-1$, fent caure totes les operacions a temps lineal **$\Theta(n)$**.

:::abcdegenviz
:::

---

## 3.7. Arbres Equilibrats: Arbres AVL

Per evitar que un ABC degeneri a $\Theta(n)$, els **arbres AVL** imposen una condició d'equilibri que s'autoregula en cada inserció i esborrat.

### Definició d'Arbre AVL

Un **arbre AVL** és un ABC on, **per a cada node**, la diferència d'alçades entre els seus dos subarbres és com a màxim 1:

$$
|\text{alçada}(\text{fesq}) - \text{alçada}(\text{fdre})| \le 1
$$

> **Garantia d'alçada:** Aquesta propietat assegura que l'alçada màxima és $h \le 1.44 \log_2 n$. Per tant, l'alçada és sempre **$h = \Theta(\log n)$ en el cas pitjor**.

:::oopviz{simulation="diccionari_avl"}
:::

---

### Rotacions a l'Arbre AVL

Quan una inserció o un esborrat provoca un desequilibri ($\text{diferència} = \pm 2$), s'aplica una **rotació local en temps constant $\Theta(1)$** per restaurar l'equilibri sense trencar l'ordre de l'ABC:

| Cas | Situació del desequilibri | Rotació aplicada |
| :--- | :--- | :--- |
| **LL** | Inserció a l'esquerra del fill esquerre | **Simple a la dreta** (`LL`) |
| **RR** | Inserció a la dreta del fill dret | **Simple a l'esquerra** (`RR`) |
| **LR** | Inserció a la dreta del fill esquerre | **Doble:** `RR` al fill esquerre + `LL` al node |
| **RL** | Inserció a l'esquerra del fill dret | **Doble:** `LL` al fill dret + `RR` al node |

:::avlrotviz
:::

::algoviz{algorithm="avl_ll"}

::algoviz{algorithm="avl_rr"}

::algoviz{algorithm="avl_lr"}

---

### Inserció vs. Esborrat en AVL 
* **Inserció ($\Theta(\log n)$):** S'insereix el node com en un ABC i, en el retorn cap a l'arrel, es reequilibra si cal. **Com a màxim 1 rotació** (simple o doble) és necessària per reequilibrar tot l'arbre.
::algoviz{algorithm="avl_assignar"}

* **Esborrat ($\Theta(\log n)$):** S'elimina el node com en un ABC. En el retorn cap amunt, pot requerir **fins a $\mathcal{O}(\log n)$ rotacions** propagades cap a l'arrel.
::algoviz{algorithm="avl_esborrar"}

---

## 3.8. Taula comparativa final de complexitats

| Estructura de dades | Cerca | Inserció | Esborrat | Recorregut ordenat | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Vector no ordenat** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n \log n)$ | Útil per a col·leccions petites ($n < 20$). |
| **Vector ordenat** | $\Theta(\log n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Òptim si les dades són estàtiques i les cerques freqüents. |
| **Hash (*Taula de dispersió*)** | $\Theta(1)$\* | $\Theta(1)$\* | $\Theta(1)$\* | No disponible | La més ràpida a la pràctica si no cal ordre. \*Cas pitjor $\Theta(n)$. |
| **ABC (*BST*)** | $\Theta(\log n)$\* | $\Theta(\log n)$\* | $\Theta(\log n)$\* | $\Theta(n)$ | Pot degenerar a $\Theta(n)$ amb entrades ordenades. \*Cas mitjà. |
| **AVL / RB (`std::map`)** | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(n)$ | **Garanteix $\Theta(\log n)$ en el cas pitjor** i iteració en ordre creixent. |
