---
title: "Tema 5: Àlgebra de Matrius"
description: "Repàs fonamental: definicions, operacions, matriu inversa i propietats de l'espai de matrius."
order: 6
readTime: "25 min"
subject: "m1"
draft: false
isNew: true
---

## 0. Repàs d'Àlgebra de Matrius

Aquesta secció preliminar serveix com a base per a tot el bloc d'Àlgebra Lineal. Començarem per les estructures més bàsiques fins a les propietats de la matriu inversa.

### Els Escalars ($\mathbb{K}$)
Per un **cos d'escalars $\mathbb{K}$** entendrem un conjunt de nombres amb dues operacions (suma i producte) que satisfan les propietats habituals (commutativa, associativa, distributiva, elements neutres) i on tots els elements no nuls són invertibles.

**Exemples de cossos**: $\mathbb{R}$ (Reals), $\mathbb{Q}$ (Racionals), $\mathbb{C}$ (Complexos), $\mathbb{Z}_p$ (enters mòdul $p$ primer).

### Definició de Matriu
Una matriu de tipus $m \times n$ amb elements al cos $\mathbb{K}$ consisteix en $mn$ elements de $\mathbb{K}$ ordenats en $m$ files i $n$ columnes ($A \in \mathcal{M}_{m \times n}(\mathbb{K})$).

### Tipus de Matrius
- **Quadrades**: $m = n$.
- **Triangulars (Superior/Inferior)** i **Diagonals**.
- **Identitat ($I_n$)**: Matriu diagonal amb $1$ a tota la diagonal principal.
- **Transposada ($A^t$)**: Intercanviant files per columnes.

### Operacions amb Matrius
- **Suma** i **Producte per Escalar**: Operacions element a element.
- **Producte de Matrius ($AB$)**: $c_{ij} = \sum_{k=1}^n a_{ik} b_{kj}$. Recorda: **AB ≠ BA**.
- **Propietats del producte**: Associativa, Distributiva, Element Unitat ($I$).
- **Transposada del producte**: $(AB)^t = B^t A^t$ (Atenció: s'inverteix l'ordre!).

### Matriu Inversa ($A^{-1}$)
Una matriu quadrada $A$ és **invertible** si existeix una matriu $B$ tal que $AB = BA = I_n$. 
- Si existeix, aquesta matriu $B$ és única i l'anomenem $A^{-1}$.
- El producte de matrius invertibles és invertible: $(AB)^{-1} = B^{-1} A^{-1}$.

---

## 1. Transformacions Elementals i Matrius Escalonades

Aquí és on comença el contingut formal del Tema 5 cap a l'estudi de sistemes d'equacions lineals i l'anàlisi de rang.

### Transformacions Elementals per Files
Una transformació elemental consisteix en una de les tres operacions següents:
1. **Tipus I**: Intercanviar dues files ($F_i \leftrightarrow F_j$).
2. **Tipus II**: Multiplicar una fila per un escalar no nul ($\lambda \neq 0$).
3. **Tipus III**: Sumar a una fila el resultat de multiplicar una altra fila per un escalar ($F_i \leftarrow F_i + \lambda F_j$).

**Matrius Elementals i Equivalència**:
- Una **matriu elemental** ($E$) és el resultat d'aplicar una única transformació elemental a la identitat.
- Dues matrius $A$ i $B$ són **equivalents per files** si podem passar d'una a l'altra mitjançant una seqüència finita de transformacions: $B = E_r \dots E_2 E_1 A$.

### Matrius Escalonades i Rang
Diem que una matriu és **escalonada per files** si compleix:
1. Si una fila és nul·la, totes les que estan per sota d'ella també són nul·les.
2. En cada fila no nul·la, el primer element no nul és un **1** (anomenat **1 dominant** o **pivot**).
3. El pivot d'una fila sempre es troba més a la dreta que el pivot de la fila anterior.

> [!IMPORTANT]
> **Definició de Rang**: El rang d'una matriu $A$ és el nombre de files no nul·les de qualsevol matriu escalonada equivalent a $A$.

### Aplicació al Càlcul de la Inversa
Una matriu $A \in \mathcal{M}_n(\mathbb{K})$ és **invertible** si i només si tots els elements de la diagonal d'una de les seves matrius escalonades equivalents són iguals a 1 (és a dir, si la seva forma escalonada reduïda és la identitat).
- **Corol·lari**: $A$ és invertible si i només si el **rang** d'A és **n**.

### Mètode de Gauss-Jordan per al càlcul de la inversa
Donada una matriu $A$, podem seguir aquests passos per trobar $A^{-1}$, si existeix:

1. Comencem amb la matriu ampliada $(A \mid I_n)$.
2. Apliquem transformacions elementals per files a tot el bloc $(A \mid I_n)$ amb l'objectiu d'arribar a $(I_n \mid B)$.
3. Si ho aconseguim (és a dir, si podem transformar la part de l'esquerra en la identitat), llavors **$A^{-1} = B$**.
4. Altrament, si ens apareix una fila de zeros a la part de l'esquerra abans d'arribar a la identitat, llavors **$A$ no és invertible**.

---

## 2. Sistemes d'Equacions Lineals

Un sistema d'equacions lineals és un conjunt d'equacions que comparteixen les mateixes variables $x_1, \dots, x_n$.

### Definicions bàsiques
- **Equació lineal**: Una expressió del tipus $a_1x_1 + a_2x_2 + \dots + a_nx_n = b$. Per a una sola equació, el nombre de solucions pot anar de zero a infinit.
- **Solució del sistema**: Una $n$-upla $(s_1, \dots, s_n)$ que satisfà **totes** les equacions del sistema simultàniament.
- **Solució general**: El conjunt de totes les solucions del sistema.

### Classificació segons el nombre de solucions
1. **Sistema Incompatible (SI)**: No té cap solució.
2. **Sistema Compatible Determinat (SCD)**: Té una única solució.
3. **Sistema Compatible Indeterminat (SCI)**: Té infinites solucions.

### Sistemes Equivalents
Diem que dos sistemes són equivalents si tenen la mateixa solució general. Podem obtenir sistemes equivalents mitjançant:
- Intercanviar l'ordre de les equacions.
- Multiplicar una equació per un escalar no nul.
- Sumar a una equació un múltiple d'una altra.

### Representació Matricial
Qualsevol sistema de $m$ equacions i $n$ incògnites es pot escriure de forma compacta com un producte de matrius:
$$Ax = b$$
On:
- **$A$** és la matriu de coeficients (matriu associada).
- **$x$** és el vector columna de les incògnites.
- **$b$** és el vector columna dels termes independents.

### Sistemes Homogenis
Un sistema és **homogeni** si tots els termes independents són zero ($b = \mathbf{0}$).
- **Propietat**: Un sistema homogeni sempre és **compatible**, ja que té com a mínim la **solució trivial** ($x_1 = x_2 = \dots = x_n = 0$).
- **Discussió**:
    - Si $\text{rang}(A) = n$, el sistema és **SCD** (només solució trivial).
    - Si $\text{rang}(A) < n$, el sistema és **SCI** (té solucions no trivials).

### Matriu Ampliada
La matriu ampliada $(A \mid b)$ inclou els termes independents:
$$
(A \mid b) = \begin{pmatrix}
a_{11} & a_{12} & \dots & a_{1n} & b_1 \\
a_{21} & a_{22} & \dots & a_{2n} & b_2 \\
\vdots & \vdots & \ddots & \vdots & \vdots \\
a_{m1} & a_{m2} & \dots & a_{mn} & b_m
\end{pmatrix}
$$
> [!NOTE]
> Qualsevol sistema és equivalent a un on la matriu ampliada és escalonada.

### Resolució de Sistemes Escalonats
En un sistema escalonat compatible amb $r$ files no nul·les:
- **Variables Principals**: Les $r$ variables que corresponen als pivots.
- **Variables Lliures**: La resta de variables (n'hi ha $n - r$).

**Solució General**: Podem aïllar les variables principals en funció de les lliures. El sistema té **$n - r$ graus de llibertat**.
**Forma Paramètrica**: És l'expressió vectorial de la solució general on les variables lliures actuen com a paràmetres.

---

## 3. Discussió de Sistemes: Teorema de Rouché-Frobenius

Aquest teorema permet classificar un sistema comparant el rang de la matriu de coeficients ($A$) i el de l'ampliada ($A \mid b$).

Sigui $r = \text{rang}(A)$ i $r' = \text{rang}(A \mid b)$, i $n$ el nombre d'incògnites:

1. **Si $r < r'$**: El sistema és **Incompatible (SI)**. No hi ha solució.
2. **Si $r = r' = n$**: El sistema és **Compatible Determinat (SCD)**. Solució única.
3. **Si $r = r' < n$**: El sistema és **Compatible Indeterminat (SCI)**. Infinites solucions amb $n - r$ graus de llibertat.

> [!TIP]
> Anomenem **rang del sistema** al valor $r$ quan el sistema és compatible.

---

## 4. Resolució de Sistemes: Eliminació Gaussiana

Per trobar la solució general de qualsevol sistema d'equacions lineals, seguim aquest procediment algorítmic:

1. **Matriu Ampliada**: Escriure la matriu $(A \mid b)$ del sistema.
2. **Escalonament**: Trobar una matriu escalonada $M$ equivalent a $(A \mid b)$ mitjançant transformacions elementals.
3. **Discussió**: Aplicar el **Teorema de Rouché-Frobenius** per determinar si el sistema és compatible (SCD o SCI) o incompatible (SI).
4. **Resolució**: Si el sistema és compatible, trobar la solució general a partir de la matriu escalonada (aïllant les variables principals en funció de les lliures, si n'hi ha).

---

## 5. Determinants

El determinant és un valor escalar que només es calcula per a **matrius quadrades** i té propietats fonamentals per a l'estudi de la inversibilitat i el rang.

### Definicions
- **Menor $A_{ij}$**: Matriu que s'obté en eliminar la fila $i$ i la columna $j$ de $A$.
- **Adjunt de l'element $a_{ij}$**: El valor $C_{ij} = (-1)^{i+j} \det(A_{ij})$.
- **Definició recursiva**: El determinant es pot calcular desenvolupant per qualsevol fila o columna:
  $$\det(A) = \sum_{k=1}^n a_{ik} (-1)^{i+k} \det(A_{ik})$$

### Càlcul ràpid
- **Matriu $2 \times 2$**: $|A| = ad - bc$.
- **Matriu $3 \times 3$**: Regla de Sarrus o desenvolupament per adjunts.
- **Matriu Diagonal/Triangular**: El determinant és el producte dels elements de la diagonal principal.
- **Fila/Columna nul·la**: Si n'hi ha una, llavors $\det(A) = 0$.

### Determinants i Transformacions Elementals
L'efecte de les operacions per files sobre el determinant és:
1. **Intercanviar dues files**: El determinant canvia de signe.
2. **Multiplicar una fila per $\lambda$**: El determinant queda multiplicat per $\lambda$.
3. **Sumar un múltiple d'una fila a una altra**: El determinant **no varia**.

### Determinants i Operacions amb Matrius
Per a dues matrius quadrades $A, B \in \mathcal{M}_{n}(\mathbb{K})$:

- **Producte**: $\det(AB) = \det(A) \cdot \det(B)$.
- **Transposada**: $\det(A^t) = \det(A)$.
- **Inversa**: Si $A$ és invertible, $\det(A^{-1}) = \frac{1}{\det(A)}$.

> [!CAUTION]
> En general, **$\det(A + B) \neq \det(A) + \det(B)$**. Els determinants "es porten bé" amb el producte, però no amb la suma.


---

## 6. Caracterització de Matrius Invertibles i Rang

Gràcies als determinants, podem definir la invertibilitat de manera molt directa:

> [!IMPORTANT]
> **Teorema**: Una matriu quadrada $A \in \mathcal{M}_n(\mathbb{K})$ és **invertible** si i només si **$\det(A) \neq 0$**.

D'aquest teorema se'n deriven un corol·lari i una aplicació al rang:
1. **Inversibilitat i Rang**: Una matriu té rang màxim ($n$) si i només si el seu determinant és no nul.
2. **Definició de Rang per Menors**: El rang d'una matriu $A$ (no cal que sigui quadrada) és $r$ si i només si el **menor més gran** de $A$ amb determinant no nul és de mida $r \times r$.
