---
title: "Tema 5: Àlgebra de Matrius"
description: "Repàs fonamental: definicions, operacions, matriu inversa i propietats de l'espai de matrius."
order: 6
readTime: "25 min"
subject: "m1"
draft: false
isNew: true
---

## 1. Àlgebra de matrius i rang

### Els escalars ($\mathbb{K}$)
Per un **cos d'escalars $\mathbb{K}$** entendrem un conjunt de nombres amb dues operacions (suma i producte) que satisfan les propietats habituals (commutativa, associativa, distributiva, elements neutres) i on tots els elements no nuls són invertibles. **Exemples de cossos**: $\mathbb{R}$ (Reals), $\mathbb{Q}$ (Racionals), $\mathbb{C}$ (Complexos), $\mathbb{Z}_p$ (enters mòdul $p$ primer).

### Definició de matriu
Una matriu de tipus $m \times n$ amb elements al cos $\mathbb{K}$ consisteix en $mn$ elements ordenats en $m$ files i $n$ columnes:

$$
A = \begin{pmatrix} 
a_{11} & a_{12} & \dots & a_{1n} \\ 
a_{21} & a_{22} & \dots & a_{2n} \\ 
\vdots & \vdots & \ddots & \vdots \\ 
a_{m1} & a_{m2} & \dots & a_{mn} 
\end{pmatrix} \in \mathcal{M}_{m \times n}(\mathbb{K})
$$

### Tipus de matrius

| Tipus | Descripció | Representació Formal | Exemple Pràctic |
| :--- | :--- | :--- | :--- |
| **Quadrada** | Mateix nombre de files que columnes ($m=n$). | $A \in \mathcal{M}_{n \times n}(\mathbb{K})$ | $\begin{pmatrix} 1 & 5 \\ -2 & 3 \end{pmatrix}$ |
| **Triangular superior** | Tots els elements per sota la diagonal són zero. | $a_{ij} = 0$ si $i > j$ | $\begin{pmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{pmatrix}$ |
| **Triangular inferior** | Tots els elements per sobre la diagonal són zero. | $a_{ij} = 0$ si $i < j$ | $\begin{pmatrix} 1 & 0 & 0 \\ 2 & 4 & 0 \\ 3 & 5 & 6 \end{pmatrix}$ |
| **Diagonal** | Només els elements de la diagonal poden ser no nuls. | $a_{ij} = 0$ si $i \neq j$ | $\begin{pmatrix} 2 & 0 & 0 \\ 0 & 5 & 0 \\ 0 & 0 & -1 \end{pmatrix}$ |
| **Identitat ($I_n$)** | Matriu diagonal on tots els elements de la diagonal són $1$. | $a_{ii} = 1, a_{ij} = 0$ | $\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ |
| **Simètrica** | La matriu és igual a la seva transposada ($A = A^t$). | $a_{ij} = a_{ji}$ | $\begin{pmatrix} 1 & 2 \\ 2 & 3 \end{pmatrix}$ |
| **Antisimètrica** | La matriu és igual a la seva transposada canviada de signe. | $a_{ij} = -a_{ji}$ | $\begin{pmatrix} 0 & 5 \\ -5 & 0 \end{pmatrix}$ |
| **Transposada ($A^t$)** | S'obté intercanviant files per columnes. | $(a_{ij})^t = a_{ji}$ | $\begin{pmatrix} a & b \\ c & d \end{pmatrix}^t = \begin{pmatrix} a & c \\ b & d \end{pmatrix}$ |
| **Traça (Tr)** | Suma dels elements de la diagonal principal. | $\text{Tr}(A) = \sum a_{ii}$ | $\text{Tr}\begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix} = 5$ |

### Operacions amb matrius

| Operació | Regla / Definició | Exemple |
| :--- | :--- | :--- |
| **Suma ($A+B$)** | Element a element: $c_{ij} = a_{ij} + b_{ij}$ | $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} + \begin{pmatrix} 0 & 1 \\ 2 & 0 \end{pmatrix} = \begin{pmatrix} 1 & 3 \\ 5 & 4 \end{pmatrix}$ |
| **Producte escalar** | Multiplicar tots els elements per $\lambda$: $\lambda \cdot a_{ij}$ | $3 \cdot \begin{pmatrix} 1 & -2 \\ 0 & 4 \end{pmatrix} = \begin{pmatrix} 3 & -6 \\ 0 & 12 \end{pmatrix}$ |
| **Producte ($AB$)** | Fila multiplicat per columna: $\sum a_{ik}b_{kj}$ | $\begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} = \begin{pmatrix} \mathbf{5} & \mathbf{6} \\ \mathbf{2} & \mathbf{3} \end{pmatrix}$ |

### Propietats del producte

| Propietat | Condició / Regla | Exemple |
| :--- | :--- | :--- |
| **No commutatiu** | $AB \neq BA$ : L'ordre dels factors altera el producte. | $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \neq \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ |
| **Transposada** | $(AB)^t = B^t A^t$ : S'inverteix l'ordre dels factors. | $\left( \begin{pmatrix} 1 & 2 \end{pmatrix} \begin{pmatrix} 3 \\ 0 \end{pmatrix} \right)^t = \begin{pmatrix} 3 & 0 \end{pmatrix} \begin{pmatrix} 1 \\ 2 \end{pmatrix}$ |
| **Associativa** | $(AB)C = A(BC)$ : L'agrupació no canvia el resultat. | $\left( \begin{pmatrix} 1 & 0 \end{pmatrix} \begin{pmatrix} 0 \\ 1 \end{pmatrix} \right) \begin{pmatrix} 2 \end{pmatrix} = \begin{pmatrix} 1 & 0 \end{pmatrix} \left( \begin{pmatrix} 0 \\ 1 \end{pmatrix} \begin{pmatrix} 2 \end{pmatrix} \right)$ |
| **Polinomi** | $p(A) = A^2 + \dots + \mathbf{a_0 I}$ : Les constants porten la Identitat. | Per a $p(x) = x^2 - 1$, usem $p(A) = A^2 - \mathbf{I}$. |

### Matriu inversa ($A^{-1}$)

| Concepte | Expressió / Regla | Exemple |
| :--- | :--- | :--- |
| **Definició** | $A \cdot A^{-1} = I$ : Només si la matriu té $\det(A) \neq 0$. | $\begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix} \begin{pmatrix} \frac{1}{2} & 0 \\ 0 & \frac{1}{2} \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ |
| **Prod. invertible** | $(AB)^{-1} = B^{-1} A^{-1}$ : S'inverteix l'ordre dels factors. | $(2I \cdot 3I)^{-1} = \frac{1}{3}I \cdot \frac{1}{2}I = \frac{1}{6}I$ |
| **Transposada** | $(A^t)^{-1} = (A^{-1})^t$ : Transposar i invertir commuten. | $\left(\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}^t\right)^{-1} = \begin{pmatrix} 1/2 & 0 \\ 0 & 1/3 \end{pmatrix}$ |
| **Doble inversa** | $(A^{-1})^{-1} = A$ : Invertir dues vegades anul·la l'operació. | $\left(\begin{pmatrix} 5 \end{pmatrix}^{-1}\right)^{-1} = \begin{pmatrix} 1/5 \end{pmatrix}^{-1} = \begin{pmatrix} 5 \end{pmatrix}$ |

### Transformacions elementals per files

| Tipus | Operació (Notació) | Matriu elemental ($E$) | Efecte |
| :--- | :--- | :--- | :--- |
| **Tipus I** | $F_i \leftrightarrow F_j$ | $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ | Intercanvia la Fila 1 i la Fila 2. |
| **Tipus II** | $F_i \to \lambda F_i$ | $\begin{pmatrix} \mathbf{k} & 0 \\ 0 & 1 \end{pmatrix}$ | Multiplica la Fila 1 per un escalar $k \neq 0$. |
| **Tipus III** | $F_i \to F_i + \lambda F_j$ | $\begin{pmatrix} 1 & \mathbf{k} \\ 0 & 1 \end{pmatrix}$ | Suma a la Fila 1 la Fila 2 multiplicada per $k$. |

**Matriu elemental ($E$)**: És el resultat d'aplicar **una sola** operació elemental a la identitat $I$. Multiplicar $EA$ equival a aplicar l'operació directa a la matriu $A$.

**Equivalència ($A \sim B$)**: Diem que $A$ i $B$ són equivalents si podem arribar de l'una a l'altra combinant operacions elementals.
> **Exemple**:  
> $A = \begin{pmatrix} 1 & 2 \\ 3 & 1 \end{pmatrix} \xrightarrow{F_2 - 3F_1} \mathbf{B = \begin{pmatrix} 1 & 2 \\ 0 & -5 \end{pmatrix}}$  
> Això s'expressa matricialment com $B = EA$ on $E = \begin{pmatrix} 1 & 0 \\ -3 & 1 \end{pmatrix}$.

### Matrius escalonades i rang
Diem que una matriu és **escalonada** quan té estructura d'escala descendents:

$$
\begin{pmatrix} 
\mathbf{1} & * & * & * \\ 
0 & \mathbf{1} & * & * \\ 
0 & 0 & 0 & \mathbf{1} \\ 
0 & 0 & 0 & 0 
\end{pmatrix}
$$

**Condicions**:
1. Les files de zeros sempre van al final (abaix).
2. El primer element no nul de cada fila és un **1** (anomenat **pivot**).
3. Cada pivot està a la dreta del pivot de la fila superior.

> **Definició de rang**: El nombre de files no nul·les (nombre de pivots) d'una matriu escalonada equivalent.

### Condició d'invertibilitat
Per saber si una matriu quadrada $A$ d'ordre $n$ té inversa, utilitzem el rang:

> **$A$ és invertible $\iff \text{rang}(A) = n$**
> Això implica que la seva forma escalonada reduïda és la **Identitat ($I_n$)**.

### Mètode de Gauss-Jordan
Per trobar la inversa, "enganxem" la identitat a la dreta i operem fins que la identitat quedi a l'esquerra:

$$ (A \mid I_n) \xrightarrow{\text{Operacions per files}} (I_n \mid A^{-1}) $$

**Exemple pas a pas ($2 \times 2$):**
Invertim $A = \begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix}$:

1. **Matriu ampliada**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 1 & 1 & 0 & 1 \end{array}\right)$
2. **Fer zero abaix ($F_2 - F_1$)**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & -1 & -1 & 1 \end{array}\right)$
3. **Normalitzar pivot ($F_2 \cdot (-1)$)**: $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & 1 & -1 \end{array}\right)$
4. **Fer zero dalt ($F_1 - 2F_2$)**: $\left(\begin{array}{cc|cc} \mathbf{1} & \mathbf{0} & \mathbf{-1} & \mathbf{2} \\ \mathbf{0} & \mathbf{1} & \mathbf{1} & \mathbf{-1} \end{array}\right)$
5. **La part de la dreta és la inversa**: $A^{-1} = \begin{pmatrix} -1 & 2 \\ 1 & -1 \end{pmatrix}$.

---

## 2. Sistemes d'equacions lineals

Un sistema es defineix, es discuteix (per saber si té solució) i es resol (Gauss). Ho veurem tot com un procés unificat.

### Definicions bàsiques
- **Equació lineal**: Expressió del tipus $a_1x_1 + \dots + a_nx_n = b$.
- **Solució del sistema**: Valors que satisfan **totes** les equacions simultàniament.
- **Solució general**: El conjunt format per **totes** les solucions possibles.

### Representació del sistema

| Format | Descripció | Exemple |
| :--- | :--- | :--- |
| **Algebraic** | Les equacions tal qual. | $\begin{cases} x + 2y = 3 \\ x + y = 2 \end{cases}$ |
| **Matricial** | Producte $Ax = b$ | $\begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}$ |
| **Ampliada** | Bloc $(A \mid b)$ | $\begin{pmatrix} 1 & 2 & \mid & 3 \\ 1 & 1 & \mid & 2 \end{pmatrix}$ |

On la **matriu ampliada** general és:
$$
(A \mid b) = \begin{pmatrix}
a_{11} & a_{12} & \dots & a_{1n} & \mid & b_1 \\
a_{21} & a_{22} & \dots & a_{2n} & \mid & b_2 \\
\vdots & \vdots & \ddots & \vdots & \mid & \vdots \\
a_{m1} & a_{m2} & \dots & a_{mn} & \mid & b_m
\end{pmatrix}
$$

### Sistemes equivalents i operacions
Diem que dos sistemes són equivalents si tenen la **mateixa solució general**. Per passar d'un sistema a un altre equivalent, podem:
1. **Intercanviar** dues equacions.
2. **Multiplicar** una equació per un $k \neq 0$.
3. **Sumar** a una equació un múltiple d'una altra ($E_i \to E_i + \lambda E_j$).

### Classificació segons el nombre de solucions
1. **Sistema incompatible (SI)**: No té cap solució (representen rectes/plans que no es tallen).
2. **Sistema compatible determinat (SCD)**: Té una única solució.
3. **Sistema compatible indeterminat (SCI)**: Té infinites solucions.

### Sistemes homogenis ($b = 0$)
Són sistemes on tota la columna de termes independents és zero.
- **Sempre són compatibles**: Tenen com a mínim la **solució trivial** $(0, \dots, 0)$.
- **Discussió per rang**:
    - $\text{rang}(A) = n \implies$ **SCD** (només la trivial).
    - $\text{rang}(A) < n \implies$ **SCI** (té solucions no trivials).

### Resolució de sistemes escalonats
En un sistema escalonat compatible amb $r = \text{rang}$ i $n = \text{incògnites}$:
- **Variables principals**: Corresponen als pivots (n'hi ha $r$).
- **Variables lliures**: La resta ($n - r$), que esdevenen paràmetres $\lambda, \mu, \dots$

**Exemple de forma paramètrica (SCI)**:
Si el resultat és $x + 2y = 5$, fem que $y = \lambda$ (lliure):
$$ \begin{cases} x = 5 - 2\lambda \\ y = \lambda \end{cases} \implies (x, y) = (5, 0) + \lambda(-2, 1) $$
> El sistema té **1 grau de llibertat** ($n-r = 1$).

---

### Discussió (Teorema de Rouché-Frobenius)

Aquest teorema permet classificar un sistema d'equacions comparant el rang de la matriu de coeficients ($A$) i el de l'ampliada ($A \mid b$). 

Sigui **$r = \text{rang}(A)$**, **$r' = \text{rang}(A \mid b)$** i **$n$** el nombre d'incògnites:

| Condició de Rangs | Tipus de Sistema | Solucions | Observació en Gauss |
| :--- | :--- | :--- | :--- |
| **$r < r'$** | **Incompatible (SI)** | Cap | Apareix una fila: $(0 \dots 0 \mid b)$ amb $b \neq 0$. |
| **$r = r' = n$** | **Comp. Determinat (SCD)** | Única | Tenim tants pivots com incògnites. |
| **$r = r' < n$** | **Comp. Indeterminat (SCI)** | Infinites | Hi ha $n-r$ variables lliures (paràmetres). |

> Si el sistema és compatible ($r = r'$), el valor de **$r$** s'anomena **rang del sistema**.

---

### Resolució (Eliminació Gaussiana)

L'eliminació gaussiana és l'algorisme sistemàtic per resoldre SEL. Segueix aquest camí:

1. **Matriu ampliada**: Transforma el sistema a la matriu $(A \mid b)$.
2. **Triangularització**: Fes zeros sota els pivots per obtenir una matriu escalonada.
3. **Discussió**: Aplica el **Tma. de Rouché-Frobenius** per classificar el sistema.
4. **Substitució enrere**: Si és compatible, calcula les incògnites de baix a dalt (des de l'última fila).

> **Exemple pas a pas**: Resolem $\begin{cases} x + 2y = 3 \\ 2x + 4y = 6 \end{cases}$
> 1. **Ampliada**: $\left(\begin{array}{cc|c} 1 & 2 & 3 \\ 2 & 4 & 6 \end{array}\right) \xrightarrow{F_2 - 2F_1} \left(\begin{array}{cc|c} \mathbf{1} & 2 & 3 \\ 0 & 0 & 0 \end{array}\right)$
> 2. **Discussió**: $\text{rang}(A) = 1$, $\text{rang}(A|b) = 1$, $n = 2$. Com que $1 = 1 < 2$, és un **SCI**.
> 3. **Solució**: $x + 2y = 3 \implies x = 3 - 2\lambda, y = \lambda$.

---

## 3. Determinants i aplicacions

El determinant és un escalar que resumeix les propietats clau d'una matriu quadrada: inversibilitat, rang i valors propis.
El determinant és un valor escalar que ens indica si una matriu quadrada és invertible ($\det \neq 0$).

### Mètodes de càlcul

| Mètode | Regla / Definició | Exemple |
| :--- | :--- | :--- |
| **$2 \times 2$** | Producte creuat: $ad - bc$ | $\begin{vmatrix} 1 & 2 \\ 3 & 4 \end{vmatrix} = 4 - 6 = -2$ |
| **Diagonal / Triang.** | Producte dels elements de la diagonal. | $\det \begin{pmatrix} \mathbf{2} & 5 \\ 0 & \mathbf{3} \end{pmatrix} = 2 \cdot 3 = 6$ |
| **Adjunts** | Desenvolupar per una fila/columna. | $\sum a_{ik} (-1)^{i+k} \det(A_{ik})$ |
| **Sarrus ($3 \times 3$)** | Suma de diagonals (positives i negatives). | Només per a ordres $n=3$. |

### Determinants i transformacions elementals

| Operació de Fila | Efecte en el Determinant | Exemple / Nota |
| :--- | :--- | :--- |
| **Intercanviar files** | El determinant **canvia de signe**. | $\det(B) = - \det(A)$ |
| **Multiplicar fila per $k$** | El determinant es **multiplica per $k$**. | Si $F_i \to k F_i$ |
| **Sumar combinació** | El determinant **NO varia**. | Operació $F_i \to F_i + \lambda F_j$. |
| **Escalar matriu ($kA$)** | Es multiplica per **$k^n$**. | $\det(k A) = k^n \det(A)$ ($n=$ordre). |

### Propietats algebraiques

| Operació | Regla del determinant | Nota |
| :--- | :--- | :--- |
| **Producte ($AB$)** | $\det(AB) = \det(A) \cdot \det(B)$ | El determinant del producte és el producte dels dets. |
| **Transposada ($A^t$)** | $\det(A^t) = \det(A)$ | El determinant no varia en transposar. |
| **Inversa ($A^{-1}$)** | $\det(A^{-1}) = \frac{1}{\det(A)}$ | Només si $\det(A) \neq 0$. |
| **Suma ($A+B$)** | **NO hi ha regla general** | $\det(A+B) \neq \det(A) + \det(B)$ gairebé sempre. |

> **Truc de la suma constant**: Si totes les files sumen el mateix valor $S$, sumant totes les columnes a la primera ($C_1 \to C_1 + C_2 + \dots$) i podrem treure el factor $S$ fora del determinant.
> En general, **$\det(A + B) \neq \det(A) + \det(B)$**. Els determinants "es porten bé" amb el producte, però no amb la suma.


### Aplicacions: Invertibilitat i valors propis

Gràcies als determinants, podem caracteritzar la matriu de forma ràpida:

1. **Invertibilitat**: $A$ és invertible $\iff \det(A) \neq 0$.
2. **Càlcul del Rang per Menors**: El rang és l'ordre del menor més gran amb determinant no nul.
3. **Valors Propis**: Es troben resolent l'equació característica $\det(A - \lambda I) = 0$.
