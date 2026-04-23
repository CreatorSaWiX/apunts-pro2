---
title: "Solucionari: Tema 3: Grafs Eulerians i Hamiltonians"
author: "Apunts"
---

# Solucionari: Tema 3: Grafs Eulerians i Hamiltonians

*Camins i cicles eulerians i hamiltonians.*

---

## Exercici 3.1: Existència de Circuits Eulerians

### Enunciat

Per a cadascun dels grafs següents, trobeu-ne un circuit eulerià, o demostreu-ne la no existència.
  
  <img src="/src/assets/apunts/m1/T3Ex1.png" className="w-full max-w-2xl mx-auto rounded-2xl border border-white/10 shadow-xl my-6" />

### Solució


Recordem el **Teorema d'Euler**: Un graf connex té un circuit eulerià si i només si **tots els seus vèrtexs tenen grau parell**.

### Anàlisi de Graus

Per demostrar que un graf NO és eulerià, n'hi ha prou amb trobar un sol vèrtex de grau senar.

| Graf | Connex? | Graus dels vèrtexs | Eulerià? | Raonament |
| :--- | :---: | :--- | :---: | :--- |
| **$ G_1 $** | Sí | Conté vèrtexs de grau 3 | **NO** | Exemple: els vèrtexs de les cantonades superiors. |
| **$ G_2 $** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | És un graf 3-regular (Prisma quadrangular). |
| **$ G_3 $** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | També és un graf 3-regular. |
| **$ G_4 $** | Sí | Conté vèrtexs de grau 3 | **NO** | Els vèrtexs inferiors tenen grau senar. |
| **$ G_5 $** | Sí | Tots els vèrtexs tenen grau 4 o 6 | **SÍ** | Tots els graus són parells. |
| **$ G_6 $** | Sí | Tots els vèrtexs tenen grau 4 | **SÍ** | És l'octaedre (4-regular). |
| **$ G_7 $** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | Graf 3-regular. |
| **$ G_8 $** | Sí | Centre (8), d'altres (4 i 2) | **SÍ** | Tots els graus són parells. |
| **$ G_9 $** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | El dodecaedre és 3-regular. |
| **$ G_{10}$** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | El graf de Petersen és 3-regular. |
  

---

## Exercici 3.4: Eulerianitat en Bipartits Complets

### Enunciat

Trobeu els valors de $ r $ i $ s $ tals que el graf bipartit complet $ K_{r,s}$ és eulerià.

### Solució


Per resoldre aquest exercici, hem d'aplicar el **Teorema d'Euler**: Un graf connex és eulerià si i només si tots els seus vèrtexs tenen grau parell.

En un graf bipartit complet $ K_{r,s}$, tenim dos conjunts de vèrtexs, $ V_1 $ i $ V_2 $, amb $|V_1| = r $ i $|V_2| = s $.
- Cada vèrtex de $ V_1 $ està connectat amb **tots** els vèrtexs de $ V_2 $. Per tant, el grau de qualsevol vèrtex $ v \in V_1 $ és $ g(v) = s $.
- Cada vèrtex de $ V_2 $ està connectat amb **tots** els vèrtexs de $ V_1 $. Per tant, el grau de qualsevol vèrtex $ w \in V_2 $ és $ g(w) = r $.

Perquè el graf sigui eulerià, **tots** els graus han de ser parells:
1. Els vèrtexs de $ V_1 $ han de tenir grau parell $\implies s $ ha de ser **parell**.
2. Els vèrtexs de $ V_2 $ han de tenir grau parell $\implies r $ ha de ser **parell**.

El graf bipartit complet $ K_{r,s}$ és eulerià si i només si **tant $ r $ com $ s $ són nombres parells**.

---

### Exemples visuals




*[Gràfic interactiu disponible a la versió web de l'apunt]*



*[Gràfic interactiu disponible a la versió web de l'apunt]*



  

---

## Exercici 3.5: Connectant Components Eulerians

### Enunciat

Sigui $ G $ un graf que té exactament dos components connexos que són eulerians. Trobeu el mínim nombre d'arestes que cal afegir per obtenir un graf eulerià.

### Solució


Perquè un graf sigui eulerià, ha de complir dues condicions:
1. Ser **connex**.
2. Que tots els seus vèrtexs tinguin **grau parell**.

### Anàlisi Inicial
Tenim dos components connexos $ C_1 $ i $ C_2 $. Com que ambdós són eulerians per separat, tots els seus vèrtexs tenen grau parell. El problema és que el graf global **no és connex**.

---

### Intent amb 1 aresta
Si afegim una sola aresta $ e = (u, v)$ amb $ u \in C_1 $ i $ v \in C_2 $:
- El graf passa a ser **connex**.
- Però els vèrtexs $ u $ i $ v $ passen a tenir **grau senar** (parell + 1).


*[Gràfic interactiu disponible a la versió web de l'apunt]*


---

### Cas A: Algun component NO és complet (3 arestes)

Si $ C_2 $ no és complet, podem trobar dos vèrtexs $ v_1, v_2 \in C_2 $ que **no** estiguin connectats entre ells. Aleshores afegim un "triangle" que connecti els components:
1. $(u, v_1)$
2. $(u, v_2)$
3. $(v_1, v_2)$ (aresta nova interna a $ C_2 $)

Així, $ u, v_1, v_2 $ augmenten el seu grau en 2 i es mantenen parells.


*[Gràfic interactiu disponible a la versió web de l'apunt]*


### Cas B: Ambdós components SÓN complets (4 arestes)

Si $ C_1 $ i $ C_2 $ ja són grafs complets, no podem afegir cap aresta interna. Per mantenir la paritat, hem d'afegir arestes entre parelles de vèrtexs diferents dels dos components (una "creu" o rectangle):
1. $(u_1, v_1)$ i $(u_1, v_2)$
2. $(u_2, v_1)$ i $(u_2, v_2)$

Tots quatre vèrtexs augmenten el seu grau en 2.


*[Gràfic interactiu disponible a la versió web de l'apunt]*



---

## Exercici 3.6: Ponts i Graus Parells

### Enunciat

Demostreu que un graf connex amb tots els vèrtexs de grau parell no té arestes pont.

### Solució


Ho demostrarem per reducció a l'absurd.

*[Gràfic interactiu disponible a la versió web de l'apunt]*


Suposem que existeix un graf $ G $ on tots els vèrtexs tenen grau parell, però el graf té almenys una **aresta pont** $ e = (u, v)$.
Per definició de pont, si eliminem l'aresta $ e $, el graf $ G $ es divideix en dues components connexes separades, $ G_1 $ i $ G_2 $. Suposem que el vèrtex $ u $ queda a $ G_1 $ i el vèrtex $ v $ queda a $ G_2 $

Tots els vèrtexs de $ G_1 $ (excepte $ u $) tenen exactament el mateix grau que tenien a $ G $, ja que cap de les seves arestes ha estat eliminada. Per tant, el seu grau segueix sent **parell**.
El vèrtex $ u $, però, ha perdut l'aresta $ e $. El seu nou grau a $ G_1 $ és $ g_{G_1}(u) = g_G(u) - 1 $. Com que $ g_G(u)$ era parell, ara $ g_{G_1}(u)$ és **senar**.

**Contradicció**:
   - El lema de les encaixades diu que la suma dels graus dels vèrtexs de qualsevol graf ha de ser parell (és igual a $ 2|E|$).
   - A la component $ G_1 $, tenim un vèrtex de grau senar ($ u $) i tota la resta de grau parell.
   - La suma de graus de $ G_1 $ seria: $\text{Parell} + \text{Parell} + \dots + \text{Senar} = \mathbf{Senar}$.
   - Això és **impossible**.

Com que hem arribat a una contradicció, la nostra hipòtesi inicial era falsa. Per tant, un graf on tots els vèrtexs tenen grau parell **no pot tenir arestes pont**.


---

## Exercici 3.7: El Problema del Dòmino

### Enunciat

Esbrineu si és possible posar en successió totes les fitxes d'un dòmino de forma que coincideixen les puntuacions dels extrems en contacte i que els dos extrems lliures tinguin la mateixa puntuació. Si és possible, expliciteu una solució.

### Solució


Podem representar el conjunt de fitxes del dòmino com un graf on:


*[Gràfic interactiu disponible a la versió web de l'apunt]*


- Els **vèrtexs** són els números del $ 0 $ al $ 6 $ (7 vèrtexs).
- Les **arestes** són les fitxes. Una fitxa $[a|b]$ representa una aresta que connecta el vèrtex $ a $ amb el vèrtex $ b $.

El joc de dòmino complet té totes les combinacions possibles, incloent els dobles:
- Fitxes simples: $[0|1], [0|2], \dots, [0|6], [1|2], \dots, [5|6]$. Això correspon a les arestes d'un graf complet $ K_7 $.
- Fitxes dobles: $[0|0], [1|1], \dots, [6|6]$. Aquestes corresponen a **bucles** a cada vèrtex.

L'enunciat ens demana si podem posar **totes** les fitxes en una successió tancada (els extrems coincideixen). En l'idioma dels grafs, això s'anomena trobar un **circuit eulerià**.

### Condició d'existència
Un graf connex té un circuit eulerià si i només si tots els seus vèrtexs tenen **grau parell**. Calculem el grau de cada vèrtex:
- En un graf complet $ K_7 $, cada vèrtex està connectat amb els altres 6 vèrtexs. Per tant, el grau inicial de cada vèrtex és **6**.
- Les fitxes dobles (bucles) afegeixen $ 2 $ al grau de cada vèrtex (un bucle entra i surt pel mateix lloc).
- Grau final de cada vèrtex = $ 6 + 2 = \mathbf{8}$.

Com que tots els vèrtexs tenen grau 8 (un nombre **parell**) i el graf és clarament connex, **podem afirmar que SÍ que és possible**.

### Explicitar una solució
Trobar el circuit exacte és complex per fer-ho a mà (28 fitxes), però podem simplificar el procés:
1. Primer, trobem un circuit eulerià pel graf complet $ K_7 $ (sense dobles).
2. Cada vegada que passem per un vèrtex $ i $, podem "intercalar" la fitxa doble $[i|i]$ i seguir el camí.

Una seqüència parcial podria començar així:
$[0|0] \rightarrow [0|1] \rightarrow [1|1] \rightarrow [1|2] \rightarrow [2|2] \rightarrow [2|0] \rightarrow \dots $


---

## Exercici 3.8: El Graf n-cub (Qn)

### Enunciat

El graf $ n $-cub $ Q_n $ té per conjunt de vèrtexs ${0, 1}^n $ i dos vèrtexs $(x_1, x_2, \dots, x_n), (y_1, y_2, \dots, y_n)$ són adjacents si difereixen en exactament una coordenada.
  
1. Representeu $ Q_i $ per $ 1 \le i \le 4 $.
2. Determineu l'ordre, la mida i la seqüència de graus de $ Q_n $.
3. Trobeu els valors de $ n $ tals que $ Q_n $ és eulerià.

### Solució


### 1. Representació de $ Q_n $ ($ n=1, 2, 3 $)

El graf $ Q_n $ es pot veure com la generalització d'un cub en $ n $ dimensions.



*[Gràfic interactiu disponible a la versió web de l'apunt]*


*[Gràfic interactiu disponible a la versió web de l'apunt]*


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-center text-xs text-slate-400">Q_1 (Segment)</div>
<div class="text-center text-xs text-slate-400">Q_2 (Quadrat)</div>
<div class="text-center text-xs text-slate-400">Q_3 (Cub)</div>



*Nota: $ Q_4 $ (l'hipercub) té 16 vèrtexs i 32 arestes. Es pot visualitzar com dos cubs $ Q_3 $ connectats vèrtex a vèrtex.*

### 2. Propietats de $ Q_n $

- **Ordre ($ n $ vèrtexs)**: El nombre de cadenes binàries de longitud $ n $ és $|V| = 2^n $.
- **Grau**: Cada vèrtex té exactament **$ n $** veïns (podem canviar qualsevol de les $ n $ coordenades per obtenir un veí). És un graf **$ n $-regular**.
- **Seqüència de graus**: $(n, n, \dots, n)$ repetit $ 2^n $ vegades.
- **Mida ($ m $ arestes)**: Aplicant el Lema de les encaixades ($ 2m = \sum g(v)$):
  $$
2m = n \cdot 2^n \implies m = n \cdot 2^{n-1}
$$

### 3. Eulerianitat de $ Q_n $

Segons el Teorema d'Euler, un graf connex és eulerià si i només si tots els seus vèrtexs tenen grau parell.
- El grau de cada vèrtex a $ Q_n $ és $ n $.
- Per tant, $ Q_n $ serà eulerià si i només si **$ n $ és un nombre parell**. **$ Q_n $ és eulerià $\iff n \in \{2, 4, 6, \dots\}$**

> Tot i que només és eulerià per a $ n $ parells, es pot demostrar que el graf $ Q_n $ és **hamiltonià** per a tot $ n \ge 2 $.
  


---

## Exercici 3.9: Cicles Hamiltonians

### Enunciat

A cadascun del grafs de l'exercici 3.1 trobeu-hi un cicle hamiltonià, o demostreu-ne la no existència.
  
  <img src="/src/assets/apunts/m1/T3Ex1.png" class="rounded-lg border border-slate-200 shadow-sm w-full max-w-2xl mx-auto my-4" />
  

### Solució


Recordem que un **cicle hamiltonià** és un camí tancat que visita **tots els vèrtexs** del graf exactament una vegada (excepte l'origen i el final que coincideixen). A diferència dels eulerians, no hi ha una condició de "graus" tan senzilla, però tenim algunes eines com la condició dels vèrtexs de tall.

### Anàlisi dels grafs

1. **$ G_1 $**: **És Hamiltonià**. Té 6 vèrtexs. El perímetre exterior amb alguns salts interiors permet formar el cicle fàcilment.
2. **$ G_2 $**: **És Hamiltonià**. És un prisma sobre un quadrat. Podem recórrer el quadrat exterior, baixar a l'interior i tornar a pujar.
3. **$ G_3 $**: **És Hamiltonià**. Similar a $ G_2 $, el fet de tenir arestes creuades a l'interior només dona més opcions.
4. **$ G_4 $**: **No és Hamiltonià**. 
   - Observem que és un graf bipartit. Si comptem els vèrtexs, tenim 2 vèrtexs "centrals" i 4 vèrtexs "externs". 
   - En un graf bipartit $(V_1, V_2)$, per tenir un cicle hamiltonià cal que $|V_1| = |V_2|$. Aquí tenim $ 2 \neq 4 $, per tant és impossible.
5. **$ G_5 $**: **És Hamiltonià**. Podem recórrer en ziga-zaga: avall a amunt, avall amunt..
6. **$ G_6 $**: **És Hamiltonià**. És una estructura molt simètrica (octaedre amb subdivisions).
7. **$ G_7 $**: **No és Hamiltonià**. 
   - Podem aplicar la **condició de tall de vèrtexs**: $ c(G-S) \le |S|$.
   - Si traiem els 3 vèrtexs que formen el triangle central (conjunt $ S $), el graf es divideix en 4 components aïllades (els vèrtexs exteriors o les puntes).
   - Com que $ 4 > 3 $, el graf no pot ser hamiltonià.
8. **$ G_8 $**: **És Hamiltonià**. Té molta densitat d'arestes. El node central es pot integrar en el recorregut fàcilment.
9. **$ G_9 $**: **És Hamiltonià**. És un prisma pentagonal. Es recorre com el cub: mig pentà exterior, baixem a l'interior, recorrem el pentà interior, pugem i acabem el pentà exterior.
10. **$ G_{10}$**: **No és Hamiltonià**. 
    - Aquest és el **Graf de Petersen**. 
    - És un resultat clàssic de la teoria de grafs que el graf de Petersen és el graf hipohamiltonià més petit (si li traiem qualsevol vèrtex és hamiltonià, però ell mateix no ho és).

### Resum
| Graf | Hamiltonià? | Motiu / Prova |
| :--- | :--- | :--- |
| $ G_1, G_2, G_3 $ | **SÍ** | Es pot trobar el cicle per inspecció. |
| $ G_4 $ | **NO** | Bipartit amb subconjunts de mida desigual (2 vs 4). |
| $ G_5 $ | **SÍ** | Es pot trobar el cicle. |
| $ G_6 $ | **SÍ** | Estructura simètrica puntejada. |
| $ G_7 $ | **NO** | Condició de tall: c(G-S) > S amb S=3. |
| $ G_8, G_9 $ | **SÍ** | Existeixen cicles explícits. |
| $ G_{10}$ | **NO** | Graf de Petersen (clàssic no-hamiltonià). |
  

---

## Exercici 3.10: Bipartits i Hamiltonians

### Enunciat

Demostreu que si un graf bipartit és hamiltonià, aleshores les parts estables tenen el mateix cardinal.

### Solució


Sigui $ G = (V_1 \cup V_2, E)$ un graf bipartit amb dues parts estables $ V_1 $ i $ V_2 $. Per definició de graf bipartit, no hi ha arestes entre vèrtexs de la mateixa part; totes les arestes connecten un vèrtex de $ V_1 $ amb un vèrtex de $ V_2 $.

1. **L'alternança**: Qualsevol camí o cicle en un graf bipartit ha d'alternar vèrtexs entre $ V_1 $ i $ V_2 $. És a dir, la seqüència de vèrtexs d'un camí seria:
   $$
v_1 \in V_1 \to v_2 \in V_2 \to v_3 \in V_1 \to v_4 \in V_2 \dots
$$

2. **Cicle hamiltonià**: Un cicle hamiltonià és un cicle que visita **tots** els vèrtexs del graf exactament una vegada. Suposem que el cicle té longitud $ n $ (on $ n $ és el nombre total de vèrtexs).

3. **Paritat i tancament**:
   - Perquè el cicle es pugui "tancar" (tornar al punt de partida), l'últim vèrtex ha d'estar en una part diferent de la del primer vèrtex.
   - Això implica que el cicle ha de tenir una longitud **parell**: $ n = 2k $.
   - Dins d'aquest cicle de longitud $ 2k $, exactament la meitat dels vèrtexs hauran de pertànyer a $ V_1 $ i l'altra meitat a $ V_2 $.

4. **Conclusió**:
   - Com que el cicle visita tots els vèrtexs una sola vegada, tenim:
     $$
|V_1| = k \quad \text{i} \quad |V_2| = k
$$
   - Per tant, **$|V_1| = |V_2|$**.

### Conseqüència pràctica
Si tenim un graf bipartit on una part té més vèrtexs que l'altra (com el $ G_4 $ de l'exercici anterior), podem afirmar immediatament que **no és hamiltonià**.


> **Exemple ràpid**
>
> Un tauler d'escacs de $ 3 \times 3 $ és un graf bipartit amb 5 caselles negres i 4 blanques (o viceversa). Com que $|V_1| \neq |V_2|$, és impossible fer un recorregut hamiltonià pel tauler.

  

---

## Exercici 3.11: Hamiltonianitat en Bipartits Complets

### Enunciat

Demostreu que un graf bipartit $ K_{r,s}$ d'ordre $\ge 3 $ és hamiltonià si, i només si, $ r = s $.

### Solució


Aquest exercici és una aplicació directa de la propietat demostrada a l'exercici 3.10, aplicada al cas específic dels grafs bipartits complets.

### Demostració ($\implies $)
Suposem que $ K_{r,s}$ és hamiltonià.
Com que $ K_{r,s}$ és, per definició, un graf bipartit amb parts de mida $ r $ i $ s $, sabem per l'exercici 3.10 que perquè existeixi un cicle hamiltonià, les dues parts han de tenir el mateix nombre de vèrtexs.
Per tant, **$ r = s $**.

### Demostració ($\impliedby $)
Suposem que $ r = s $. Volem veure si el graf $ K_{r,r}$ és hamiltonià per a un ordre $\ge 3 $.
Si l'ordre és $\ge 3 $ i $ r=s $, llavors $ 2r \ge 3 $, la qual cosa implica que **$ r \ge 2 $**.

Podem provar-ho de dues maneres:

1. **Construcció explícita**:
   Siguin $ V_1 = \{u_1, u_2, \dots, u_r\}$ i $ V_2 = \{v_1, v_2, \dots, v_r\}$ les dues parts del graf. Com que és un graf bipartit complet, existeixen totes les arestes $(u_i, v_j)$.
   Podem construir el següent cicle que visita tots els vèrtexs:
   $$
u_1 \to v_1 \to u_2 \to v_2 \to \dots \to u_r \to v_r \to u_1
$$
   Aquest camí és un cicle vàlid perquè totes aquestes arestes existeixen a $ K_{r,r}$ i passa exactament una vegada per cada vèrtex.

2. **Teorema de Dirac**:
   En el graf $ K_{r,r}$, el nombre total de vèrtexs és $ n = 2r $.
   El grau de cada vèrtex és exactament $ g(v) = r $.
   La condició de Dirac diu que si $ g(v) \ge n/2 $ per a tot vèrtex, el graf és hamiltonià:
   $$
r \ge \frac{2r}{2} \implies r \ge r
$$
   Com que la condició es compleix per a $ n \ge 3 $ (que en el nostre cas vol dir $ r \ge 2 $), el graf és hamiltonià.

### Conclusió
Un graf $ K_{r,s}$ d'ordre $\ge 3 $ és hamiltonià si i només si les seves parts són iguals: **$ r = s $**.

---


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-center text-xs text-slate-400 mt-2">Cicle hamiltonià (en verd) en un graf $ K_{2,2}$ (un quadrat).</div>
  

---

## Exercici 3.12: Unir components hamiltonians

### Enunciat

Sigui $ G $ un graf que té exactament dos components connexos que són grafs hamiltonians. Trobeu el mínim nombre d'arestes que cal afegir per obtenir un graf hamiltonià.

### Solució


Per resoldre aquest problema, hem d'entendre què necessitem per formar un **cicle hamiltonià** que recorri tots els vèrtexs de dues components separades, $ C_1 $ i $ C_2 $.

### 1. Per què 1 aresta no és suficient?
Si afegim només una aresta entre un vèrtex $ u \in C_1 $ i un vèrtex $ v \in C_2 $, l'aresta resultant seria un **pont**.
- Qualsevol cicle en un graf no pot contenir cap aresta pont (ja que per tancar el cicle hauries de tornar a creuar el pont, repetint una aresta o un vèrtex).
- Per tant, amb 1 sola aresta el graf seria connex, però no podria tenir cap cicle que passés per vèrtexs de les dues components alhora.

### 2. Amb 2 arestes és suficient
Si afegim dues arestes, podem "cosir" els dos cicles originals per formar-ne un de sol més gran. Siguin els vèrtexs $ u, u' \in C_1 $ i $ v, v' \in C_2 $.

**Estratègia de construcció:**
1. Com que $ C_1 $ és hamiltonià, té un cicle que passa per tots els seus vèrtexs. Escollim una aresta d'aquest cicle, per exemple $(u, u')$, i la "deixem d'utilitzar".
2. Fem el mateix amb $ C_2 $, escollint una aresta $(v, v')$ del seu cicle hamiltonià.
3. Ara connectem els components afegint les arestes $(u, v)$ i $(u', v')$.
4. El nou cicle seria:
   - Camí hamiltonià de $ C_1 $ (des d'$ u $ fins a $ u'$).
   - Aresta nova $(u', v')$.
   - Camí hamiltonià de $ C_2 $ (des de $ v'$ fins a $ v $).
   - Aresta nova $(v, u)$.

Aquesta construcció garanteix un cicle que visita absolutament tots els vèrtexs de $ G $ sense repetir-ne cap.

### Conclusió
El mínim nombre d'arestes que cal afegir és **2**.

---

### Visualització del procés
Imagineu dos quadrats ($ C_1 $ i $ C_2 $) que volem unir:


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-center text-xs text-slate-400 mt-2">Hem substituït una aresta de cada component per dues arestes pont (verdes) per fusionar els cicles.</div>
  

---

## Exercici 3.13: Graus en Grafs Hamiltonians

### Enunciat

Sigui $ G $ un graf hamiltonià que no és un graf cicle. Demostreu que $ G $ té almenys dos vèrtexs de grau $ ge 3 $.

### Solució


Aquesta demostració és molt directa si utilitzem la definició de graf hamiltonià.

### Demostració

1. **Definició de Hamiltonià**: Per hipòtesi, $ G $ és un graf hamiltonià. Això significa que $ G $ conté un **cicle hamiltonià** $ C $ que passa per tots els vèrtexs del graf exactament una vegada.
   - En aquest cicle $ C $, cada vèrtex té exactament **grau 2**.
   - Per tant, en el graf original $ G $, el grau de cada vèrtex ha de ser com a mínim 2 ($ g_G(v) \ge 2 $).

2. **Graf no cicle**: També se'ns diu que $ G $ **no és un graf cicle** ($ G \neq C_n $).
   - Si $ G $ no és el cicle $ C_n $, significa que $ G $ ha de tenir, com a mínim, una aresta més que el cicle hamiltonià $ C $.
   - Sigui $ e = \{u, v\}$ una d'aquestes arestes "extres" que pertanyen a $ G $ però no al cicle $ C $.

3. **Anàlisi de graus**:
   - En el cicle $ C $, els vèrtexs $ u $ i $ v $ ja tenien grau 2.
   - En afegir l'aresta extra $ e = \{u, v\}$, el grau d'aquests dos vèrtexs augmenta en 1.
   - Així doncs: $ g_G(u) \ge 3 $ i $ g_G(v) \ge 3 $.

### Conclusió
Com que hem trobat almenys dos vèrtexs ($ u $ i $ v $) que tenen grau $\ge 3 $, la proposició queda demostrada.

---

### Exemple visual
Considereu un quadrat amb una diagonal. El quadrat és el cicle hamiltonià, i la diagonal és l'aresta extra que crea els vèrtexs de grau 3.


*[Gràfic interactiu disponible a la versió web de l'apunt]*

<div class="text-center text-xs text-slate-400 mt-2">Els nodes vermells tenen grau 3 degut a l'aresta extra groga.</div>
  

---

## Exercici 3.15: Hamiltonianitat del Graf Complementari

### Enunciat

Sigui $ G $ un graf $ d $-regular d'ordre $\ge 2d+2 $, amb $ d \ge 1 $. Demostreu que el complementari de $ G $ és hamiltonià.

### Solució


Per demostrar que el graf complementari $\bar{G}$ és hamiltonià, utilitzarem el **Teorema de Dirac**.

### Teorema de Dirac
Un graf simple amb $ n $ vèrtexs ($ n \ge 3 $) és hamiltonià si cada vèrtex $ v $ té un grau $ g(v) \ge \frac{n}{2}$.

### Demostració

1. **Grau en el graf original ($ G $)**:
   Se'ns diu que $ G $ és un graf $ d $-regular. Això significa que per a tot vèrtex $ v $:
   $$
g_G(v) = d
$$

2. **Grau en el graf complementari ($\bar{G}$)**:
   En el complementari $\bar{G}$, un vèrtex està connectat a tots els vèrtexs als quals no estava connectat en $ G $. Per tant, el grau de qualsevol vèrtex en $\bar{G}$ és:
   $$
g_{\bar{G}}(v) = (n - 1) - g_G(v) = n - 1 - d
$$

3. **Aplicació de la condició de Dirac**:
   Volem veure si es compleix que $ g_{\bar{G}}(v) \ge \frac{n}{2}$. Substituïm el valor del grau:
   $$
n - 1 - d \ge \frac{n}{2}
$$
   
   Reordenem la inequació per aïllar $ n $:
   $$
n - \frac{n}{2} \ge d + 1
$$
   $$
\frac{n}{2} \ge d + 1
$$
   $$
n \ge 2d + 2
$$

4. **Verificació de les hipòtesis**:
   - L'enunciat ens dóna precisament la condició **$ n \ge 2d + 2 $**.
   - També hem de comprovar que $ n \ge 3 $. Com que $ d \ge 1 $, llavors $ n \ge 2(1) + 2 = 4 $. Per tant, $ n \ge 3 $ es compleix sempre.

### Conclusió
Com que el grau de cada vèrtex en $\bar{G}$ és almenys la meitat de l'ordre del graf, pel Teorema de Dirac, el graf complementari **$\bar{G}$ és hamiltonià**.

---


> **Exemple pràctic**
>
> Si $ G $ és un graf 1-regular (un aparellament) de 4 vèrtexs ($ n=4, d=1 $), $ 2d+2 = 4 $. La condició es compleix.
> El complementari $\bar{G}$ tindrà vèrtexs de grau $ 4-1-1 = 2 $. Un graf de 4 vèrtexs on tots tenen grau 2 és un cicle $ C_4 $, que és hamiltonià.

  

---

## Exercici 3.16: Existència de Camí Hamiltonià

### Enunciat

Sigui $ G $ un graf d'ordre $ n \ge 2 $ tal que cada vèrtex té grau $\ge (n-1)/2 $. Demostreu que $ G $ té un camí hamiltonià.

### Solució


Per demostrar l'existència d'un camí hamiltonià en $ G $, utilitzarem una construcció auxiliar que ens permeti aplicar el **Teorema de Dirac**.

### Teorema de Dirac (per a cicles)
Recordem que un graf amb $ N $ vèrtexs té un cicle hamiltonià si cada vèrtex té grau $\ge N/2 $.

### Demostració

1. **Construcció del graf auxiliar $ G'$**:
   Creem un nou graf $ G'$ afegint un vèrtex extra $ x $ al graf original $ G $. Connectem aquest vèrtex $ x $ amb **tots** els vèrtexs originals de $ G $.
   - L'ordre del nou graf $ G'$ és $ N = n + 1 $.

2. **Càlcul dels graus en $ G'$**:
   - Per a qualsevol vèrtex $ v $ original de $ G $:
     $$
g_{G'}(v) = g_G(v) + 1 \ge \frac{n-1}{2} + 1 = \frac{n+1}{2}
$$
     Com que $ N = n+1 $, això significa que $ g_{G'}(v) \ge \frac{N}{2}$.
   - Per al vèrtex nou $ x $:
     $$
g_{G'}(x) = n
$$
     Com que $ n \ge \frac{n+1}{2}$ per a tot $ n \ge 1 $ (i sabem que $ n \ge 2 $), també es compleix que $ g_{G'}(x) \ge \frac{N}{2}$.

3. **Aplicació de Dirac a $ G'$**:
   Com que tots els vèrtexs de $ G'$ tenen grau $\ge N/2 $, el graf $ G'$ té un **cicle hamiltonià**.

4. **Retorn al graf original $ G $**:
   Un cicle hamiltonià a $ G'$ passa per tots els vèrtexs, inclòs el vèrtex $ x $. La seqüència seria:
   $$
\dots \to v_i \to x \to v_j \to \dots
$$
   Si eliminem el vèrtex $ x $ d'aquest cicle, ens queda una seqüència de tots els vèrtexs de $ G $ que encara estan connectats (ja que eren adjacents a través de $ x $ però el camí segueix la resta d'arestes de $ G $).
   En retirar $ x $, el cicle es "trenca" precisament en el vèrtex extra, deixant un **camí hamiltonià** que recorre tots els vèrtexs originals de $ G $.

### Conclusió
L'existència d'un cicle hamiltonià en el graf augmentat garanteix l'existència d'un camí hamiltonià en el graf original sota les condicions de grau donades.
  

---

