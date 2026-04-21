---
title: "Tema 6: Espais vectorials"
description: "Introducció als espais vectorials, subespais, bases i dimensió."
order: 7
readTime: "25 min"
subject: "m1"
draft: false
isNew: true
---

## 1. Espai vectorial

Tot i que sovint pensem en vectors com a "fletxes" a l'espai, per a un matemàtic, un vector és qualsevol cosa que es pugui sumar amb una altra de la seva espècie i es pugui estirar/multiplicar per un número. Per exemple, $\mathbb{R}^2$ o $\mathbb{R}^3$, molts altres objectes (com matrius o polinomis) es comporten com a vectors si tenen una **suma** i un **producte per escalar** definits. L'exemple més intuïtiu d'espai vectorial és $\mathbb{R}^n$:

$$\mathbb{R}^n = \left\{ \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix} : x_i \in \mathbb{R}, \, 1 \leq i \leq n \right\}$$

::three{type="vis_rn_dimensionality"}

### Operacions component a component

Siguin $x = (x_1, \dots, x_n)$ i $y = (y_1, \dots, y_n)$ dos elements de $\mathbb{R}^n$, i sigui $\lambda \in \mathbb{R}$ un escalar:

1.  **Suma**: $x + y = (x_1 + y_1, x_2 + y_2, \dots, x_n + y_n)$
2.  **Producte per escalar**: $\lambda x = (\lambda x_1, \lambda x_2, \dots, \lambda x_n)$

Un **espai vectorial** sobre un cos $\mathbb{K}$ (que serà normalment $\mathbb{R}$) consisteix en un conjunt no buit $E$, amb una operació interna (suma) i una aplicació externa (producte per escalars) que compleixen 8 axiomes:

### Axiomes de la suma

| Axioma | Definició | Exemple (a $\mathbb{R}^2$) |
| :--- | :--- | :--- |
| **e1** Associativa | $u + (v + w) = (u + v) + w$ | $(1,1) + [(2,0) + (0,3)] = [(1,1) + (2,0)] + (0,3)$ |
| **e2** Commutativa | $u + v = v + u$ | $(1,2) + (3,4) = (3,4) + (1,2) = (4,6)$ |
| **e3** Element neutre | $\exists! \, 0_E \in E : u + 0_E = u$ | $(x,y) + (0,0) = (x,y)$ |
| **e4** Element oposat | $\forall u, \exists! \, (-u) : u + (-u) = 0_E$ | $(3,-2) + (-3,2) = (0,0)$ |

::mafs{type="vis_axiomes_suma"}

### Axiomes del producte

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

## 2. Combinació lineal i subespais vectorials

### 2.1 Combinació lineal
Imaginem que els ingredients son $\vec{v}$ i $\vec{w}$ (els vectors) i els números: $\lambda = 2$ i $\mu = 3$ (els escalars). La combinació lineal és el plat final: $2\vec{v} + 3\vec{w}$.

Donats els vectors $u_1, \dots, u_k \in E$, una **combinació lineal** d'aquests és qualsevol expressió de la forma:
$$v = \lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k$$
on els $\lambda_i$ són escalars. 

::mafs{type="vis_combinacio_lineal"}

### 2.2 Subespais vectorials
Un **subespai vectorial** és un subconjunt d'un espai que **es comporta exactament igual que l'espai original**. 

És un univers dins d'un altre univers que conserva la mateixa "física" (les operacions de suma i producte). Aquest subconjunt és **autònom**: si et limites a operar amb els seus vectors fent **combinacions lineals**, mai podràs escapar-ne.

Perquè això sigui possible, hi ha dos requisits:
1.  **L'origen ha de ser-hi**: No pots tenir un univers sense un centre de coordenades $(0,0,0)$.
2.  **L'estructura ha de ser plana**: Qualsevol curvatura o límit finit faria que, en estirar un vector, sortissis a l'espai exterior. Per això els subespais sempre són rectes, plans o hiperplans que passen per l'origen.

Formalment, un subconjunt no buit $S \subseteq E$ és un **subespai vectorial** si ell mateix té estructura d'espai vectorial amb les mateixes operacions que $E$. A la pràctica, només cal verificar que és **tancat per combinacions lineals**:

1.  **Conté el vector nul**: $0_E \in S$. (Si no hi és, ja sabem segur que no és subespai).
2.  **Suma tancada**: Per a tot $u, v \in S \implies u + v \in S$.
3.  **Producte tancat**: Per a tot $u \in S$ i $\lambda \in \mathbb{K} \implies \lambda u \in S$.

::mafs{type="vis_sev_intro"}

> El vector nul **$0_E$** pertany a tots els subespais vectorials. Si un conjunt no conté el zero, **no** pot ser un subespai.

### 2.3 Independència lineal

Un conjunt de vectors $\{u_1, \dots, u_k\}$ és **linealment independent (LI)** si cadascun t'aporta una **informació nova**. Si un fos **linealment dependent (LD)**, voldria dir que "sobra" perquè el pots fabricar combinant els altres. Per exemple: 
*   **LI (Independents)**: $u = (1, 0)$ i $v = (0, 1)$. No hi ha cap forma de multiplicar el $(1,0)$ per un número i que et doni el $(0,1)$. Són camins totalment diferents.
*   **LD (Dependents)**: $u = (1, 2)$ i $v = (2, 4)$. Aquí $v = 2u$. El vector $v$ no ens diu res de nou, és només el vector $u$ estirat. **Sobra**.

Per saber si un conjunt és LI o LD, tenim tres mètodes principals:

### Mètode 1: L'equació fonamental (Definició)
A partir de la definició, plantegem l'equació:
$$\lambda_1 u_1 + \lambda_2 u_2 + \dots + \lambda_k u_k = 0_E$$

*   Si l'**única** solució és la trivial ($\lambda_1 = \dots = \lambda_k = 0$) $\implies$ **LI**.
*   Si trobem qualsevol altra combinació $\implies$ **LD**.

**Exemple (Polinomis)**: Són $p_1 = x+1$ i $p_2 = x-1$ independents?
$\lambda_1(x+1) + \lambda_2(x-1) = 0 \implies (\lambda_1+\lambda_2)x + (\lambda_1-\lambda_2) = 0$.
Resolent el sistema $\lambda_1+\lambda_2=0$ i $\lambda_1-\lambda_2=0$, obtenim $\lambda_1=0$ i $\lambda_2=0$. Són **LI**.

### Mètode 2: El Rang (Per a vectors a $\mathbb{R}^n$)
Si tenim vectors numèrics, el més ràpid és posar-los per columnes en una matriu $A$ i calcular el seu **rang** ($r$).
*   Si **$r = \text{nombre de vectors}$** $\implies$ **LI**.
*   Si **$r < \text{nombre de vectors}$** $\implies$ **LD**.

**Exemple**: Per a $u=(1,0,1)$, $v=(0,1,1)$ i $w=(1,1,2)$, el rang de la matriu és 2 (perquè $w = u + v$). Com que tenim 3 vectors però el rang és 2, el conjunt és **LD**.

### Mètode 3: Resolució de sistemes (SCD/SCI)
Quan plantegem l'equació fonamental com un sistema d'equacions lineals homogeni ($Ax=0$):
*   Si el sistema és **Compatible Determinat (SCD)** $\implies$ l'única solució és la zero $\implies$ **LI**.
*   Si el sistema és **Compatible Indeterminat (SCI)** $\implies$ hi ha infinites combinacions possibles $\implies$ **LD**.

### 2.4 Subespai generat
El **subespai generat** per un conjunt de vectors $\{u_1, \dots, u_k\}$, simbolitzat per $\langle u_1, \dots, u_k \rangle$, és el conjunt de **totes** les seves combinacions lineals possibles. És el subespai vectorial més petit que conté aquests vectors.

::mafs{type="vis_independencia_lineal"}

### 2.5 Operacions amb subespais

Quan tenim dos subespais $S$ i $W$ (dos mini-universos), podem intentar combinar-los. Però no totes les combinacions respecten les "lleis de la física" vectorial.

::mafs{type="vis_operacions_sev"}

### 1. Intersecció ($S \cap W$)
La intersecció és el conjunt de vectors que **pertanyen als dos universos alhora**.
*   **Intuïció**: Si tens dos plans que passen per l'origen, la seva intersecció és la recta on es tallen. Com que els dos plans són "estables", el terreny que comparteixen també ho és.
*   **Regla d'or**: La intersecció de subespais **SEMPRE** és un subespai vectorial.

### 2. Unió ($S \cup W$)
Intentar unir dos subespais simplement "ajuntant-los" (com si fossin dues enganxines) **no funciona**.
*   **Intuïció**: Imagina dues rectes (l'eix X i l'eix Y). La unió són només els punts que estan sobre els eixos. Però si sumes el vector $(1,0)$ de l'eix X i el $(0,1)$ de l'eix Y, obtens el $(1,1)$, que està al mig del pla i **fora dels eixos**. Has sortit del "club"!
*   **Conclusió**: La unió **NO** és normalment un subespai.

### 3. Suma ($S + W$): L'expansió
Com que la unió falla, la **suma** és la solució per fusionar subespais. Consisteix en agafar totes les sumes possibles entre un vector de $S$ i un de $W$.
*   **Intuïció**: És com agafar dues rectes i "omplir" tot l'espai que hi ha entre elles fins a formar un pla complet. La suma **sempre** és un subespai (el més petit que conté a $S$ i $W$).
*   **A la pràctica**: Per trobar una base de $S+W$, ajuntem els generadors de $S$ i els de $W$ i eliminem els que sobrin (els dependents).

### 4. Suma Directa ($S \oplus W$): Independència absoluta
Diem que la suma és **directa** si els dos universos **només es toquen en el vector nul** ($S \cap W = \{0_E\}$). 
*   **Intuïció**: És la fusió més "neta" possible. Significa que cada vector de l'espai resultant es pot escriure de **forma única** com una part de $S$ i una part de $W$. No hi ha redundància.

---

## 3. Bases i dimensió

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

## 4. Coordenades i canvi de base

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