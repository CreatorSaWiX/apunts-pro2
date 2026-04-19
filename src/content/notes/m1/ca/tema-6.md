---
title: "Tema 6: Espais vectorials"
description: "Introducció als espais vectorials, subespais, bases i dimensió."
order: 7
readTime: "25 min"
subject: "m1"
draft: false
isNew: true
---

## 1. Definició i exemples d'espai vectorial

Tot i que sovint pensem en vectors com a "fletxes" a l'espai $\mathbb{R}^2$ o $\mathbb{R}^3$, molts altres objectes (com matrius o polinomis) es comporten com a vectors si tenen una **suma** i un **producte per escalar** definits. L'exemple més intuïtiu d'espai vectorial és $\mathbb{R}^n$, el conjunt de totes les $n$-uples de nombres reals:

$$\mathbb{R}^n = \left\{ \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix} : x_i \in \mathbb{R}, \, 1 \leq i \leq n \right\}$$

::three{type="vis_rn_dimensionality"}

### Operacions component a component

Siguin $x = (x_1, \dots, x_n)$ i $y = (y_1, \dots, y_n)$ dos elements de $\mathbb{R}^n$, i sigui $\lambda \in \mathbb{R}$ un escalar:

1.  **Suma**: $x + y = (x_1 + y_1, x_2 + y_2, \dots, x_n + y_n)$
2.  **Producte per escalar**: $\lambda x = (\lambda x_1, \lambda x_2, \dots, \lambda x_n)$

---

## 2. Definició general d'espai vectorial

Un **espai vectorial** sobre un cos $\mathbb{K}$ (que serà normalment $\mathbb{R}$) consisteix en un conjunt no buit $E$, amb una operació interna (suma) i una aplicació externa (producte per escalars) que compleixen 8 axiomes:

### Axiomes de la suma (Operació interna)

| Axioma | Definició | Exemple (a $\mathbb{R}^2$) |
| :--- | :--- | :--- |
| **e1** Associativa | $u + (v + w) = (u + v) + w$ | $(1,1) + [(2,0) + (0,3)] = [(1,1) + (2,0)] + (0,3)$ |
| **e2** Commutativa | $u + v = v + u$ | $(1,2) + (3,4) = (3,4) + (1,2) = (4,6)$ |
| **e3** Element neutre | $\exists! \, 0_E \in E : u + 0_E = u$ | $(x,y) + (0,0) = (x,y)$ |
| **e4** Element oposat | $\forall u, \exists! \, (-u) : u + (-u) = 0_E$ | $(3,-2) + (-3,2) = (0,0)$ |

::mafs{type="vis_axiomes_suma"}

### Axiomes del producte (Aplicació externa)

| Axioma | Definició | Exemple |
| :--- | :--- | :--- |
| **e5** Associativa | $\lambda(\mu u) = (\lambda\mu)u$ | $2 \cdot (3 \cdot (1,1)) = (2 \cdot 3) \cdot (1,1) = (6,6)$ |
| **e6** Distr. p/ suma de vectors | $\lambda(u + v) = \lambda u + \lambda v$ | $2 \cdot [(1,0) + (0,1)] = 2(1,0) + 2(0,1) = (2,2)$ |
| **e7** Distr. p/ suma d'escalars | $(\lambda + \mu)u = \lambda u + \mu u$ | $(2 + 3) \cdot (1,1) = 2(1,1) + 3(1,1) = (5,5)$ |
| **e8** Neutre del producte | $1 \cdot u = u$ | $1 \cdot (x,y) = (x,y)$ |

::mafs{type="vis_axiomes_producte"}

### Exemples d'espais vectorials

Més enllà de $\mathbb{R}^n$, trobem molts altres conjunts que compleixen aquestes propietats:

*   **Matrius $\mathcal{M}_{m \times n}(\mathbb{K})$**: Amb la suma de matrius i el producte per un escalar convencional.
*   **Polinomis $\mathcal{P}(\mathbb{R})$**: Tots els polinomis amb coeficients reals.
*   **Polinomis de grau $\leq d$ ($\mathcal{P}_d(\mathbb{R})$)**: Fixant un grau màxim.
*   **Espai trivial $\{0_E\}$**: Format només pel vector nul.
*   **Solucions d'un sistema lineal homogeni**: El conjunt de solucions de $Ax = 0$ sempre forma un espai vectorial.

::mafs{type="vis_exemples_espais"}

### Propietats bàsiques

Si $v \in E$ i $\lambda \in \mathbb{K}$, sempre es compleix:

1.  **$0 \cdot v = 0_E$**: L'escalar zero pel vector dóna l'element neutre.
2.  **$\lambda \cdot 0_E = 0_E$**: Qualsevol escalar pel vector nul dóna el vector nul.
3.  **Si $\lambda v = 0_E$**, llavors **$\lambda = 0$** o **$v = 0_E$**. (Producte nul implica un dels factors nul).
4.  L'element oposat de $v$ és **$(-1)v$**. Normalment l'escrivim com $-v$.

---

## 3. Subespais Vectorials (SEV)

Un subconjunt $S \subseteq E$ és un **subespai vectorial** si ell mateix té estructura d'espai vectorial amb les mateixes operacions que $E$. Per comprovar-ho, només cal verificar 3 condicions:

1.  **$S \neq \emptyset$**: Normalment comprovem que $0_E \in S$.
2.  **Suma tancada**: Per a tot $u, v \in S$, llavors $u + v \in S$.
3.  **Producte tancat**: Per a tot $u \in S$ i $\lambda \in \mathbb{K}$, llavors $\lambda u \in S$.

::mafs{type="vis_sev_intro"}

> El vector nul **$0_E$** pertany a tots els subespais vectorials. Si un conjunt no conté el zero, **no** pot ser un subespai.

### Exemples de SEV
*   **$\mathcal{P}_d(\mathbb{R})$** (polinomis de grau $\leq d$) és un SEV de l'espai de tots els polinomis.
*   Les **matrius triangulars superiors** formen un SEV de $\mathcal{M}_n(\mathbb{R})$.
*   El conjunt de **solucions d'un sistema lineal homogeni** $Ax = 0$ és un SEV de $\mathbb{R}^n$.

### Operacions amb subespais

::mafs{type="vis_operacions_sev"}

### Intersecció
Si $S$ i $S'$ són subespais de $E$, llavors la seva intersecció **$S \cap S'$** també és un subespai vectorial.

:::warning
La unió de subespais **no és normalment un subespai**. 
Si agafem dues rectes que passen per l'origen a $\mathbb{R}^2$, la seva unió són només els punts de les dues rectes. Si sumem un vector d'una recta amb un de l'altra, el resultat "surt" de la unió (no es compleix el requisit de suma tancada).
:::

::mafs{type="vis_unio_sev_atencio"}

### Suma de subespais
Si $S$ i $W$ són subespais de $E$, la seva **suma** es defineix com:
$$S + W = \{ s + w : s \in S, w \in W \}$$
Aquest conjunt sempre és un subespai vectorial. Una forma fàcil de trobar una base de $S+W$ és ajuntar les bases de $S$ i $W$ i eliminar els vectors que siguin dependents.

### Suma directa
Diem que la suma és **directa** ($S \oplus W$) si $S \cap W = \{0_E\}$. En aquest cas, cada vector de la suma s'expressa de forma única.

---

## 4. Independència i combinació lineal

### Combinació lineal
Donats els vectors $u_1, \dots, u_k \in E$, una **combinació lineal** d'aquests és qualsevol expressió de la forma:
$$v = \lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k$$
on els $\lambda_i$ són escalars.

### Subespai generat
El **subespai generat** per un conjunt de vectors $\{u_1, \dots, u_k\}$, simbolitzat per $\langle u_1, \dots, u_k \rangle$, és el conjunt de **totes** les seves combinacions lineals possibles:
$$\langle u_1, \dots, u_k \rangle = \{ \lambda_1 u_1 + \dots + \lambda_k u_k : \lambda_i \in \mathbb{K} \}$$

*   Aquest conjunt sempre és un subespai vectorial (el més petit que conté els vectors donats).
*   Diem que $\{u_1, \dots, u_k\}$ és un **conjunt de generadors** de l'espai $S = \langle u_1, \dots, u_k \rangle$.

::mafs{type="vis_independencia_lineal"}

Un conjunt de vectors $\{u_1, \dots, u_k\}$ és **linealment independent (LI)** si cap d'ells es pot expressar com a combinació lineal dels altres. Formalment, l'equació:
$$\lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k = 0_E$$
té com a **única solució** la trivial: $\lambda_1 = \dots = \lambda_k = 0$.

Si existeix alguna solució on algun $\lambda_i \neq 0$, diem que el conjunt és **linealment dependent (LD)**.

### A l'espai $\mathbb{R}^n$ (Mètode del rang)
1.  Formem una matriu $A$ amb els vectors com a columnes.
2.  Calculem el **rang** ($r$) de la matriu $A$.
3.  Si $r = k$ (nombre de vectors), llavors són **LI**.
4.  Si $r < k$, llavors són **LD**.

### En el cas general (Sistemes homogenis)
Plantegem el sistema d'equacions lineals que sorgeix de l'equació vectorial:
- Si el sistema és **Compatible Determinat (SCD)** $\implies$ **LI**.
- Si el sistema és **Compatible Indeterminat (SCI)** $\implies$ **LD**.

---

## 5. Bases i Dimensió

### Dimensió
La **dimensió** ($\dim E$) és el nombre de vectors que té qualsevol de les seves bases. 

| Espai | Dimensió |
| :--- | :--- |
| $\mathbb{R}^n$ | $n$ |
| $\mathcal{M}_{m \times n}(\mathbb{K})$ | $m \cdot n$ |
| $\mathcal{P}_d(\mathbb{R})$ | $d + 1$ |
| Subespai trivial $\{0_E\}$ | $0$ |

### Fórmula de Grassmann
Vital per a exercicis de sumes i interseccions:
$$\dim(S+W) = \dim S + \dim W - \dim(S \cap W)$$

Siguin $k$ vectors en un espai $E$ de dimensió $n$:
1. **$k > n$**: El conjunt és **sempre LD** (sobren vectors).
2. **$k < n$**: El conjunt **no pot generar** $E$ (falten vectors).
3. **$k = n$**: Si demostres que són **LI** (o que generen), automàticament són **Base**. (Això t'estalvia la meitat de la feina!).

::mafs{type="vis_regles_or_base"}

---

## 6. Coordenades i canvi de base

Qualsevol vector $v$ s'expressa de forma única en una base $B$ mitjançant les seves **coordenades** $v_B$. La matriu de canvi de base $P_{B'}^B$ les relaciona:
$$v_{B'} = P_{B'}^B \cdot v_B$$

::mafs{type="vis_canvi_base"}

:::tip{title="La clau del Canvi de Base (Exercici 6.40)"}
La matriu de canvi de base de la canònica a B (**$P_{can}^B$**) s'obté posant els vectors de la base B **per columnes**. 
Això vol dir que si coneixes les coordenades en base $B$, pots trobar el vector "normal" (canònic) fent: $v_{can} = P_{can}^B \cdot v_B$.
:::

<!-- 
---

## 7. Guia pràctica: Equacions de SEV

### A. Equacions paramètriques
Expressen cada component del vector en funció d'uns paràmetres ($\alpha, \beta, \gamma \dots$).
- **De generadors a paramètriques**: Simplement escriu la combinació lineal genèrica.
  Ex: $\langle (1,0), (0,1) \rangle \implies (x,y) = \alpha(1,0) + \beta(0,1) \implies \{x=\alpha, y=\beta\}$.

### B. De Generadors a Implícites (Mètode de Gauss)
Tens els generadors $\langle u_1, u_2 \rangle$ i vols saber quines equacions han de complir les variables $(x, y, z)$.

**Exemple pràctic (Pas a pas):**
Siguin $u_1=(1,1,2)^T$ i $u_2=(0,1,1)^T$. Escrivim la matriu ampliada:
$$ \left( \begin{array}{cc|c} 1 & 0 & x \\ 1 & 1 & y \\ 2 & 1 & z \end{array} \right) \xrightarrow{F_2-F_1, F_3-2F_1} \left( \begin{array}{cc|c} 1 & 0 & x \\ 0 & 1 & y-x \\ 0 & 1 & z-2x \end{array} \right) \xrightarrow{F_3-F_2} \left( \begin{array}{cc|c} 1 & 0 & x \\ 0 & 1 & y-x \\ \mathbf{0} & \mathbf{0} & \mathbf{z-x-y} \end{array} \right) $$
Perquè el sistema sigui compatible, el que queda a la dreta de la fila de zeros ha de ser **0**.
**Resposta**: L'equació implícita és $z - x - y = 0$.

### B. De Implícites a Generadors
Simplement resol el sistema d'equacions lineals. Les variables lliures (paràmetres) et donaran els vectors de la base.
*Nombre de paràmetres = $\dim E - \text{nombre d'equacions LI}$.*

:::tip Recordatori per l'Examen
Per ampliar un conjunt LI fins a ser una base d' $E$, simplement afegeix vectors de la base canònica d'un en un, comprovant que el rang augmenti, fins a arribar a $\dim E$ vectors.
::: -->