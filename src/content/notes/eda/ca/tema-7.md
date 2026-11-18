---
title: "Tema 7: Complexitat"
description: "Problemes decisionals i mida d'entrada, classes P, NP i EXP, reduccions polinòmiques, teoria de la NP-completesa (Cook-Levin) i problemes NP-complets clàssics."
readTime: "12 min"
order: 8
draft: true
---

La teoria de la complexitat classifica els **problemes** (no els algorismes concrets) segons si admeten una solució eficient o si, fins on sabem, requereixen cerca exhaustiva.

---

## 7.1. Problemes decisionals i mida de l'entrada

Un **problema decisional** només té dues respostes possibles: **SÍ (`1`)** o **NO (`0`)**. Formalment, sobre un conjunt d'entrades vàlides $E$, s'identifica amb el conjunt d'**entrades positives**:

$$
A = \{ x \in E \mid x \text{ satisfà la propietat} \} \qquad (\text{negatives: } E \setminus A)
$$

Els problemes d'optimització o cerca es converteixen a decisió afegint una **fita**:

| Problema original | Versió decisional |
| :--- | :--- |
| **Camí més curt** | Existeix un camí de $u$ a $v$ de longitud $\le k$? |
| **Motxilla 0/1** | Existeix una selecció d'objectes amb pes $\le C$ i valor $\ge V$? |
| **Viatjant de comerç** | Existeix un cicle que visiti les $n$ ciutats amb cost total $\le k$? |

> **Per què n'hi ha prou amb la versió decisional?** Si sabem decidir ràpidament l'existència amb restriccions parcials (com ara a les *$n$-reines* fixant les primeres $k$ files $r_1, \dots, r_k$), podem reconstruir una solució fent un nombre polinòmic de consultes.

### Funció de mida $|x|$
La complexitat es mesura sempre respecte a $|x|$: el **nombre de bits o símbols** necessaris per codificar l'entrada $x$. Per a un enter natural $x \ge 1$ en binari:

$$
|x| = \lfloor \log_2 x \rfloor + 1
$$

> **Compte amb els algorismes pseudopolinòmics:** Comprovar tots els divisors de $x$ des de $2$ fins a $x - 1$ fa $\Theta(x)$ operacions, però com que $|x| \approx \log_2 x$, el cost real en funció de la mida de l'entrada és $\Theta(2^{|x|})$ (**exponencial**).

---

## 7.2. Classes de complexitat: $\text{P}$, $\text{NP}$ i $\text{EXP}$

Un problema $A$ pertany a $\text{TIME}(t)$ si existeix un algorisme determinista que el decideix en temps $\mathcal{O}(t(|x|))$ en el cas pitjor.

| Classe | Definició formal | Intuïció | Exemples |
| :--- | :--- | :--- | :--- |
| **$\text{P}$** | $\bigcup_{k > 0} \text{TIME}(n^k)$ | **Trobar** la solució en temps polinòmic (**tractables**). | `CONNECTIVITAT`, `CAMÍ CURT`, `PRIMALITAT`, `2-COLOR`. |
| **$\text{NP}$** | Temps polinòmic **indeterminista** | **Verificar** un testimoni en temps polinòmic. | `COMPOSTOS`, `3-COLOR`, `CNF-SAT`, `VIATJANT`. |
| **$\text{EXP}$** | $\bigcup_{k > 0} \text{TIME}(2^{n^k})$ | Resolubles en temps exponencial (**intractables** si $\notin \text{P}$). | `ATURADA FITADA` ($\in \text{EXP} \setminus \text{P}$). |

### Dues definicions equivalents de $\text{NP}$

1. **Via indeterminisme (`TRIAR(x)`):** un algorisme polinòmic que pot bifurcar-se triant un valor en paral·lel; retorna `1` si **alguna** branca retorna `1`.
2. **Via testimoni i verificador:** existeix un polinomi $p(n)$ i un algorisme determinista polinòmic **verificador** $V(x, y)$ tals que, per a tota entrada $x \in E$:

$$
x \in A \iff \exists y \quad \bigl(|y| \le p(|x|) \land V(x, y) = 1\bigr)
$$

* **Exemple (`COMPOSTOS`):** per a $x = 27$, el testimoni és $y = 3$ ($|y| \le |x|$); el verificador només comprova $1 < y < x$ i $x \bmod y = 0$ en temps polinòmic.
* **Exemple (`3-COLOR`):** donat un graf $G$, el testimoni és un vector de colors $(c_1, \dots, c_n) \in \{0, 1, 2\}^n$; el verificador comprova totes les arestes en temps polinòmic.

### Jerarquia coneguda i el problema $\text{P} \stackrel{?}{=} \text{NP}$

$$
\text{P} \subseteq \text{NP} \subseteq \text{EXP} \qquad\text{i se sap que}\qquad \text{P} \subsetneq \text{EXP}
$$

* **$\text{P} \subseteq \text{NP}$:** si ja sabem decidir $x \in A$ en temps polinòmic, el verificador simplement executa aquest algorisme ignorant el testimoni $y$.
* **$\text{NP} \subseteq \text{EXP}$:** per a qualsevol problema en $\text{NP}$, podem provar tots els possibles testimonis $y$ amb $|y| \le p(|x|)$ ($2^{\mathcal{O}(p(|x|))}$ candidats) i avaluar $V(x, y)$.

Com que $\text{P} \neq \text{EXP}$, hi ha tres escenaris possibles ($\text{P} \neq \text{NP} \neq \text{EXP}$, $\text{P} \neq \text{NP} = \text{EXP}$, o $\text{P} = \text{NP} \neq \text{EXP}$). **No se sap si $\text{P} = \text{NP}$**, però la hipòtesi de treball estàndard és que **$\text{P} \neq \text{NP}$**.

---

## 7.3. Reduccions polinòmiques ($\le_p$)

Siguin $A$ i $B$ dos problemes decisionals sobre dominis $E$ i $E'$. Diem que **$A$ es redueix polinòmicament a $B$** ($A \le_p B$) si existeix un algorisme determinista polinòmic $\mathcal{F} : E \to E'$ (on $|\mathcal{F}(x)|$ és polinòmica respecte a $|x|$) tal que:

$$
x \in A \iff \mathcal{F}(x) \in B
$$

> **Intuïció:** Si $A \le_p B$, qualsevol algorisme per a $B$ serveix per resoldre $A$ (transformant primer $x$ en $\mathcal{F}(x)$). Per tant, **$B$ és almenys tan difícil com $A$**.

### Propietats fonamentals

| Propietat | Enunciat | Utilitat |
| :--- | :--- | :--- |
| **Reflexivitat** | $A \le_p A$ | Funció identitat $\mathcal{F}(x) = x$. |
| **Transitivitat** | $A \le_p B \land B \le_p C \implies A \le_p C$ | Permet encadenar reduccions ($\mathcal{G} \circ \mathcal{F}$). |
| **Tancament de $\text{P}$** | $A \le_p B \land B \in \text{P} \implies A \in \text{P}$ | Si resolem $B$ ràpidament, també $A$. (Contrapositiu: si $A \notin \text{P}$, llavors $B \notin \text{P}$). |

### Exemple: `MOTXILLA` $\le_p$ `INEQUACIONS LINEALS 0-1`
Donada una instància de `MOTXILLA` ($C$, $V$, pesos $p_1 \dots p_n$, valors $v_1 \dots v_n$), volem traduir-la al problema de decidir si existeix $x \in \{0, 1\}^n$ tal que $Ax \ge b$.

Prenent $x_i = 1$ com *"agafo l'objecte $i$"*, generem en temps lineal les dues inequacions:

$$
\sum_{i=1}^n (-p_i)x_i \ge -C \qquad \land \qquad \sum_{i=1}^n v_i x_i \ge V
$$

Existeix una selecció vàlida d'objectes per a la motxilla $\iff$ el sistema generat té solució binària $x \in \{0, 1\}^n$.

---

## 7.4. Teoria de la $\text{NP}$-completesa

* **$\text{NP}$-difícil:** un problema $A$ és $\text{NP}$-difícil si $\forall B \in \text{NP},\ B \le_p A$ (almenys tan difícil com *qualsevol* problema de $\text{NP}$; no cal que $A \in \text{NP}$).
* **$\text{NP}$-complet ($\text{NP-C}$):** un problema $A$ és $\text{NP}$-complet si **$A \in \text{NP}$** i **$A$ és $\text{NP}$-difícil** (els problemes més difícils de $\text{NP}$).

**Proposició clau:** Si $A$ és $\text{NP}$-complet, llavors:

$$
\text{P} = \text{NP} \iff A \in \text{P}
$$

És a dir, si es trobés un algorisme polinòmic per a **un sol** problema $\text{NP}$-complet, tots els problemes de $\text{NP}$ passarien automàticament a ser a $\text{P}$.

### Recepta per demostrar que $B$ és $\text{NP}$-complet
1. **$B \in \text{NP}$:** indicar quin és el testimoni $y$, comprovar que $|y|$ és polinòmica en $|x|$ i descriure un verificador $V(x, y)$ de cost polinòmic.
2. **$B$ és $\text{NP}$-difícil:** escollir un problema $A \in \text{NP-C}$ ja conegut i donar una reducció polinòmica **$A \le_p B$** (verificant que $\mathcal{F}$ és polinòmica i que $x \in A \iff \mathcal{F}(x) \in B$).

> **Atenció a la direcció:** Per provar que $B$ és $\text{NP}$-complet cal reduir **d'un $\text{NP-C}$ conegut cap a $B$** ($A_{\text{NP-C}} \le_p B$). Reduir $B \le_p A_{\text{NP-C}}$ només prova que $B$ no és més difícil que $A$, però no demostra que sigui $\text{NP}$-difícil.

### Teorema de Cook-Levin (1971)
Una fórmula booleana està en **Forma Normal Conjuntiva (CNF)** si és una conjunció ($\land$) de clàusules, i cada clàusula és una disjunció ($\lor$) de literals ($x$ o $\neg x$). Exemple: $(x \lor \neg y \lor z) \land (\neg x \lor \neg z)$.

* **`SAT`** (satisfactibilitat booleana general) i **`CNF-SAT`** (en forma CNF) són **$\text{NP}$-complets**.
* **Idea de la demostració:** pertany a $\text{NP}$ perquè el testimoni és l'assignació booleana $\alpha$ de $n \le |F|$ bits, verificable avaluant les connectives en temps polinòmic; és $\text{NP}$-difícil perquè qualsevol verificador polinòmic $V(x, y)$ es pot simular amb un circuit lògic (i traduir a una fórmula CNF de mida polinòmica) satisfactible $\iff \exists y\ V(x,y)=1$.

---

## 7.5. Problemes canònics i frontera $\text{P}$ vs $\text{NP-C}$

| Problema | Pregunta decisional | Testimoni ($\in \text{NP}$) | Classe |
| :--- | :--- | :--- | :---: |
| **`1-SAT`** | Fórmula CNF amb $1$ literal per clàusula: és satisfactible? | Assignació booleana | **$\text{P}$** |
| **`2-SAT`** | Fórmula CNF amb $\le 2$ literals per clàusula: és satisfactible? | Assignació booleana | **$\text{P}$** |
| **`3-SAT`** | Fórmula CNF amb $\le 3$ literals per clàusula: és satisfactible? | Assignació booleana | **$\text{NP-C}$** |
| **`CLICA`** | El graf $G$ té un subgraf complet de $k$ vèrtexs? | Conjunt de $k$ vèrtexs ($C \subseteq V$) | **$\text{NP-C}$** |
| **`SI`** | El graf $G$ té $k$ vèrtexs no adjacents dos a dos (independent)? | Conjunt de $k$ vèrtexs ($H \subseteq V$) | **$\text{NP-C}$** |
| **`RV`** | El graf $G$ té $k$ vèrtexs que toquen totes les arestes (recobriment)? | Conjunt de $k$ vèrtexs ($R \subseteq V$) | **$\text{NP-C}$** |
| **`k-COLOR`** ($k \le 2$) | Es pot pintar $G$ amb $\le k$ colors sense adjacents iguals? | Assignació de colors | **$\text{P}$** |
| **`k-COLOR`** ($k \ge 3$) | Es pot pintar $G$ amb $\le k$ colors sense adjacents iguals? | Assignació de colors | **$\text{NP-C}$** |

### Per què `1-SAT` i `2-SAT` són a $\text{P}$, però `3-SAT` és $\text{NP-C}$
* **`1-SAT` $\in \text{P}$:** n'hi ha prou a comprovar linealment que no apareguin alhora un literal $x$ i el seu negat $\neg x$.
* **`2-SAT` $\in \text{P}$:** reescrivim cada clàusula com a implicacions usant $(a \lor b) \equiv (\neg a \implies b) \land (\neg b \implies a)$ i $(a) \equiv (\neg a \implies a)$, formant un digraf sobre els literals. La fórmula és insatisfactible $\iff$ existeix alguna variable $x$ amb camí de $x$ a $\neg x$ **i** de $\neg x$ a $x$ (comprovable en temps polinòmic).
* **`CNF-SAT` $\le_p$ `3-SAT`:** per a tota clàusula $(a_1 \lor a_2 \lor \dots \lor a_k)$ amb $k > 3$, s'introdueixen variables noves $z_2, \dots, z_{k-2}$ per partir-la en una cadena equisatisfactible de clàusules de mida $3$:

$$
(a_1 \lor a_2 \lor z_2) \land (\neg z_2 \lor a_3 \lor z_3) \land \dots \land (\neg z_{k-2} \lor a_{k-1} \lor a_k)
$$

### Reduccions sobre grafs: `CLICA`, `SI` i `RV`
* **`CNF-SAT` $\le_p$ `CLICA`:** per a una fórmula amb $m$ clàusules $C_1, \dots, C_m$, creem un vèrtex $(l_i, j)$ per cada ocurrència d'un literal $l_i$ dins de $C_j$, i posem aresta entre $(l_i, j)$ i $(l_k, j')$ si i només si són de clàusules diferents ($j \neq j'$) i compatibles ($\neg l_i \neq l_k$). Llavors $F \in \text{CNF-SAT} \iff (G, m) \in \text{CLICA}$.
* **`CLICA` $\le_p$ `SI`:** donat $(G, k)$, construïm el graf complementari $\overline{G}$ (mateixos vèrtexs, arestes invertides). Un subgraf complet de mida $k$ a $G$ és un subconjunt independent de mida $k$ a $\overline{G}$.
* **`SI` $\le_p$ `RV`:** donat $(G, k)$ amb $n = |V|$, retornem $(G, n - k)$. Un conjunt $H \subseteq V$ de mida $k$ no té arestes internes $\iff$ el complementari $V \setminus H$ de mida $n - k$ conté almenys un extrem de tota aresta de $G$.

### Reduccions de coloració: `k-COLOR`
* **`k-COLOR` ($k \le 2$) $\in \text{P}$:** `1-COLOR` accepta només grafs sense arestes; `2-COLOR` comprova si $G$ és bipartit mitjançant BFS/DFS en $\Theta(n + m)$.
* **`CNF-SAT` $\le_p$ `3-COLOR`:** es construeix un triangle base amb 3 vèrtexs $(V, G, B)$ que fixen 3 rols (*fals*, *cert*, *base*). Cada variable $x$ i $\neg x$ es connecten entre si i a $B$ (forçant una a *cert* i l'altra a *fals*), i per a cada clàusula s'hi enganxa un subgraf que només és 3-colorable si almenys un dels seus literals té color *cert*.
* **`3-COLOR` $\le_p$ `k-COLOR` ($k > 3$):** donat $G$, s'afegeix un subgraf complet $K_{k-3}$ i se'n connecten tots els vèrtexs a tots els vèrtexs de $G$. Els $k-3$ vèrtexs nous consumeixen $k-3$ colors propis i deixen exactament $3$ colors lliures per a $G$.

### Arbre resum de reduccions

```text
CNF-SAT
 ├──► 3-SAT
 ├──► CLICA ──► SI ──► RV
 └──► 3-COLOR ──► k-COLOR (k > 3)
```

> **Casos particulars en $\text{P}$:** Que un problema general sigui $\text{NP}$-complet no impedeix que versions restringides siguin polinòmiques (com passar de `3-SAT` a `2-SAT`, o de `3-COLOR` a `2-COLOR`).
