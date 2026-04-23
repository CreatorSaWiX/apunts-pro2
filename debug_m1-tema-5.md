---
title: "Solucionari: Tema 5: Matrius"
author: "Apunts"
---

# Solucionari: Tema 5: Matrius

*Càlcul matricial. Operacions bàsiques i propietats.*

---

## Exercici 5.1: Operacions amb Matrius

### Enunciat

Donades les matrius
$ A = \begin{pmatrix} 1 & 2 & 4 \\ -3 & 0 & -1 \\ 2 & 1 & 2 \end{pmatrix}$,
$ B = \begin{pmatrix} 2 & 0 & 0 \\ 1 & -4 & 3 \\ -1 & 3 & 2 \end{pmatrix}$,
$ C = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 0 & 3 \\ -1 & 0 & 2 \\ 4 & 5 & -1 \end{pmatrix}$,

calculeu: 1) $ 3A $; 2) $ 3A - B $; 3) $ AB $; 4) $ BA $; 5) $ C(3A - 2B)$.

### Solució


### 1) Càlcul de $ 3A $

Multipliquem cada element de la matriu $ A $ per l'escalar 3:

$ 3A = 3 \begin{pmatrix} 1 & 2 & 4 \\ -3 & 0 & -1 \\ 2 & 1 & 2 \end{pmatrix} = \begin{pmatrix} 3(1) & 3(2) & 3(4) \\ 3(-3) & 3(0) & 3(-1) \\ 3(2) & 3(1) & 3(2) \end{pmatrix} = \begin{pmatrix} 3 & 6 & 12 \\ -9 & 0 & -3 \\ 6 & 3 & 6 \end{pmatrix}$

### 2) Càlcul de $ 3A - B $

Restem els elements corresponents:

$ 3A - B = \begin{pmatrix} 3 & 6 & 12 \\ -9 & 0 & -3 \\ 6 & 3 & 6 \end{pmatrix} - \begin{pmatrix} 2 & 0 & 0 \\ 1 & -4 & 3 \\ -1 & 3 & 2 \end{pmatrix} = \begin{pmatrix} 3-2 & 6-0 & 12-0 \\ -9-1 & 0-(-4) & -3-3 \\ 6-(-1) & 3-3 & 6-2 \end{pmatrix} = \begin{pmatrix} 1 & 6 & 12 \\ -10 & 4 & -6 \\ 7 & 0 & 4 \end{pmatrix}$

### 3) Càlcul de $ AB $

Fem el producte de matrius (fila per columna):

$ AB = \begin{pmatrix} 1 & 2 & 4 \\ -3 & 0 & -1 \\ 2 & 1 & 2 \end{pmatrix} \begin{pmatrix} 2 & 0 & 0 \\ 1 & -4 & 3 \\ -1 & 3 & 2 \end{pmatrix} = \begin{pmatrix} 1(2)+2(1)+4(-1) & 1(0)+2(-4)+4(3) & 1(0)+2(3)+4(2) \\ -3(2)+0(1)-1(-1) & -3(0)+0(-4)-1(3) & -3(0)+0(3)-1(2) \\ 2(2)+1(1)+2(-1) & 2(0)+1(-4)+2(3) & 2(0)+1(3)+2(2) \end{pmatrix}$

$ AB = \begin{pmatrix} 2+2-4 & 0-8+12 & 0+6+8 \\ -6+0+1 & 0+0-3 & 0+0-2 \\ 4+1-2 & 0-4+6 & 0+3+4 \end{pmatrix} = \begin{pmatrix} 0 & 4 & 14 \\ -5 & -3 & -2 \\ 3 & 2 & 7 \end{pmatrix}$

### 4) Càlcul de $ BA $

$ BA = \begin{pmatrix} 2 & 0 & 0 \\ 1 & -4 & 3 \\ -1 & 3 & 2 \end{pmatrix} \begin{pmatrix} 1 & 2 & 4 \\ -3 & 0 & -1 \\ 2 & 1 & 2 \end{pmatrix} = \begin{pmatrix} 2(1)+0+0 & 2(2)+0+0 & 2(4)+0+0 \\ 1(1)-4(-3)+3(2) & 1(2)-4(0)+3(1) & 1(4)-4(-1)+3(2) \\ -1(1)+3(-3)+2(2) & -1(2)+3(0)+2(1) & -1(4)+3(-1)+2(2) \end{pmatrix}$

$ BA = \begin{pmatrix} 2 & 4 & 8 \\ 1+12+6 & 2+3 & 4+4+6 \\ -1-9+4 & -2+2 & -4-3+4 \end{pmatrix} = \begin{pmatrix} 2 & 4 & 8 \\ 19 & 5 & 14 \\ -6 & 0 & -3 \end{pmatrix}$

Observem que $ AB \neq BA $ (el producte de matrius no és commutatiu).

### 5) Càlcul de $ C(3A - 2B)$

Primer calculem $ 3A - 2B $:

$ 2B = 2 \begin{pmatrix} 2 & 0 & 0 \\ 1 & -4 & 3 \\ -1 & 3 & 2 \end{pmatrix} = \begin{pmatrix} 4 & 0 & 0 \\ 2 & -8 & 6 \\ -2 & 6 & 4 \end{pmatrix}$

$ 3A - 2B = \begin{pmatrix} 3 & 6 & 12 \\ -9 & 0 & -3 \\ 6 & 3 & 6 \end{pmatrix} - \begin{pmatrix} 4 & 0 & 0 \\ 2 & -8 & 6 \\ -2 & 6 & 4 \end{pmatrix} = \begin{pmatrix} -1 & 6 & 12 \\ -11 & 8 & -9 \\ 8 & -3 & 2 \end{pmatrix}$

Ara multipliquem $ C $ ($ 4 \times 3 $) per $(3A - 2B)$ ($ 3 \times 3 $):

$ C(3A - 2B) = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 0 & 3 \\ -1 & 0 & 2 \\ 4 & 5 & -1 \end{pmatrix} \begin{pmatrix} -1 & 6 & 12 \\ -11 & 8 & -9 \\ 8 & -3 & 2 \end{pmatrix}$

- Fila 1:
  - $ 2(-1) + 1(-11) + 0(8) = -2 - 11 = -13 $
  - $ 2(6) + 1(8) + 0(-3) = 12 + 8 = 20 $
  - $ 2(12) + 1(-9) + 0(2) = 24 - 9 = 15 $

- Fila 2:
  - $ 1(-1) + 0(-11) + 3(8) = -1 + 24 = 23 $
  - $ 1(6) + 0(8) + 3(-3) = 6 - 9 = -3 $
  - $ 1(12) + 0(-9) + 3(2) = 12 + 6 = 18 $

- Fila 3:
  - $-1(-1) + 0(-11) + 2(8) = 1 + 16 = 17 $
  - $-1(6) + 0(8) + 2(-3) = -6 - 6 = -12 $
  - $-1(12) + 0(-9) + 2(2) = -12 + 4 = -8 $

- Fila 4:
  - $ 4(-1) + 5(-11) - 1(8) = -4 - 55 - 8 = -67 $
  - $ 4(6) + 5(8) - 1(-3) = 24 + 40 + 3 = 67 $
  - $ 4(12) + 5(-9) - 1(2) = 48 - 45 - 2 = 1 $

Finalment:
$ C(3A - 2B) = \begin{pmatrix} -13 & 20 & 15 \\ 23 & -3 & 18 \\ 17 & -12 & -8 \\ -67 & 67 & 1 \end{pmatrix}$


---

## Exercici 5.2: Producte de Vectors Fila i Columna

### Enunciat

Calculeu els productes $\begin{pmatrix} 1 & 2 & -3 \end{pmatrix} \begin{pmatrix} 2 \\ 1 \\ 5 \end{pmatrix}$ i $\begin{pmatrix} 2 \\ 1 \\ 5 \end{pmatrix} \begin{pmatrix} 1 & 2 & -3 \end{pmatrix}$.

### Solució


Aquest exercici mostra la diferència entre el producte d'un vector fila per un vector columna (producte escalar) i el d'un vector columna per un fila (producte exterior o *outer product*).

### 1) Producte Fila per Columna ($ 1 \times 3 $ per $ 3 \times 1 $)

El resultat és una matriu $ 1 \times 1 $ (un escalar):

$\begin{pmatrix} 1 & 2 & -3 \end{pmatrix} \begin{pmatrix} 2 \\ 1 \\ 5 \end{pmatrix} = (1 \cdot 2) + (2 \cdot 1) + (-3 \cdot 5) = 2 + 2 - 15 = \mathbf{-11}$

### 2) Producte Columna per Fila ($ 3 \times 1 $ per $ 1 \times 3 $)

El resultat és una matriu $ 3 \times 3 $. Fem el producte fila per columna seguint la regla general ($ c_{ij} = a_{i1} \cdot b_{1j}$):

$\begin{pmatrix} 2 \\ 1 \\ 5 \end{pmatrix} \begin{pmatrix} 1 & 2 & -3 \end{pmatrix} = \begin{pmatrix} 2(1) & 2(2) & 2(-3) \\ 1(1) & 1(2) & 1(-3) \\ 5(1) & 5(2) & 5(-3) \end{pmatrix} = \begin{pmatrix} 2 & 4 & -6 \\ 1 & 2 & -3 \\ 5 & 10 & -15 \end{pmatrix}$

Observeu com el canvi en l'ordre dels factors canvia radicalment tant la mida com el contingut de la matriu resultant.


---

## Exercici 5.3: Existència del Producte BA

### Enunciat

Donades $ A $ i $ B $ matrius tals que $ AB $ és una matriu quadrada, proveu que el producte $ BA $ està definit.

### Solució


Suposem que la matriu $ A $ té dimensions $ m \times n $ (és a dir, $ m $ files i $ n $ columnes).
Perquè el producte $ AB $ estigui definit, el nombre de files de $ B $ ha de ser igual al nombre de columnes de $ A $. Per tant, si $ A $ és $ m \times n $, llavors $ B $ ha de tenir dimensions $ n \times p $ per a algun valor $ p $.

La matriu $ AB $ resultant tindrà dimensions $ m \times p $.

L'enunciat diu que $ AB $ és una **matriu quadrada**. Una matriu és quadrada si el seu nombre de files és igual al seu nombre de columnes:
$$
m = p
$$

Substituint $ p $ per $ m $, tenim que les dimensions de $ B $ són $ n \times m $.

Ara mirem si el producte $ BA $ està definit:
- La matriu **$ B $** té dimensions **$ n \times m $**.
- La matriu **$ A $** té dimensions **$ m \times n $**.

Perquè el producte $ BA $ estigui definit, el nombre de columnes de $ B $ ha de coincidir amb el nombre de files de $ A $.
- Columnes de $ B $: $ m $
- Files de $ A $: $ m $

Com que $ m = m $, el producte **$ BA $ està definit** i la matriu resultant tindrà dimensions $ n \times n $ (també serà una matriu quadrada). $\square $


---

## Exercici 5.4: Càlcul d’Elements Específics del Producte

### Enunciat

Per a les matrius $ A $ i $ B $ següents, doneu els elements $ c_{13}$ i $ c_{22}$ de la matriu $ C = AB $ sense calcular tots els elements de $ C $.
$ A = \begin{pmatrix} 1 & 2 & 1 \\ -3 & 0 & -1 \end{pmatrix}$,
$ B = \begin{pmatrix} 2 & 0 & 0 \\ 1 & -4 & 3 \\ -1 & 3 & 2 \end{pmatrix}$.

### Solució


Recordem que comptem desde 1, no 0 com a PRO o EC.

### Càlcul de $ c_{13}$
Aquest element s'obté multiplicant la **Fila 1 d'A** per la **Columna 3 de B**:

- Fila 1 d'A: $\begin{pmatrix} 1 & 2 & 1 \end{pmatrix}$
- Columna 3 de B: $\begin{pmatrix} 0 \\ 3 \\ 2 \end{pmatrix}$

$$
c_{13} = (1 \cdot 0) + (2 \cdot 3) + (1 \cdot 2) = 0 + 6 + 2 = \mathbf{8}
$$

### Càlcul de $ c_{22}$
Aquest element s'obté multiplicant la **Fila 2 d'A** per la **Columna 2 de B**:

- Fila 2 d'A: $\begin{pmatrix} -3 & 0 & -1 \end{pmatrix}$
- Columna 2 de B: $\begin{pmatrix} 0 \\ -4 \\ 3 \end{pmatrix}$

$$
c_{22} = (-3 \cdot 0) + (0 \cdot (-4)) + (-1 \cdot 3) = 0 + 0 - 3 = \mathbf{-3}
$$


---

## Exercici 5.5: Representació Matricial de Dades

### Enunciat

Una empresa confecciona bosses i maletes en dues fàbriques diferents. La taula adjunta dóna la informació del cost total de fabricació en milers d'euros de cada producte a cada lloc:

| | Fàbrica 1 | Fàbrica 2 |
|---|---|---|
| Bosses | 135 | 150 |
| Maletes | 627 | 681 |

Responeu les preguntes següents mitjançant operacions matricials:
1) Sabent que el cost de personal representa $ 2/3 $ del cost total, trobeu la matriu que representa el cost de personal de cada producte en cada fàbrica.
2) Trobeu la matriu que representa els costos de material de cada producte en cada fàbrica, suposant que, a més dels costos de personal i de materials, hi ha un cost de 20.000 euros per cada producte a cada fàbrica.

### Solució


Definim primer la **matriu de costos totals $ C $** (en milers d'euros):
$$
C = \begin{pmatrix} 135 & 150 \\ 627 & 681 \end{pmatrix}
$$

### 1) Matriu de cost de personal ($ P $)

Se'ns indica que el cost de personal és el $ 2/3 $ del cost total. Per tant, multipliquem la matriu $ C $ per l'escalar $ 2/3 $:

$$
P = \frac{2}{3} C = \frac{2}{3} \begin{pmatrix} 135 & 150 \\ 627 & 681 \end{pmatrix} = \begin{pmatrix} \frac{2 \cdot 135}{3} & \frac{2 \cdot 150}{3} \\ \frac{2 \cdot 627}{3} & \frac{2 \cdot 681}{3} \end{pmatrix} = \begin{pmatrix} 90 & 100 \\ 418 & 454 \end{pmatrix}
$$

### 2) Matriu de costos de material ($ M $)

L'enunciat diu que el cost total es composa de:
$$
\text{Cost Total} = \text{Personal} + \text{Material} + \text{Altres}
$$

On els "Altres" costos són de 20.000 euros per cada producte i fàbrica. Com que la matriu $ C $ està expressada en **milers d'euros**, 20.000 euros equivalen a **20** unitats. Definim la matriu d'altres costos $ O $:
$$
O = \begin{pmatrix} 20 & 20 \\ 20 & 20 \end{pmatrix}
$$

Per trobar la matriu de materials $ M $, aïllem:
$$
M = C - P - O
$$

$$
C - P = \begin{pmatrix} 45 & 50 \\ 209 & 227 \end{pmatrix}
$$

$$
M = \begin{pmatrix} 45 & 50 \\ 209 & 227 \end{pmatrix} - \begin{pmatrix} 20 & 20 \\ 20 & 20 \end{pmatrix} = \begin{pmatrix} 25 & 30 \\ 189 & 207 \end{pmatrix}
$$


---

## Exercici 5.6: Potències de Matrius Diagonals

### Enunciat

En aquest exercici es vol trobar una fórmula per calcular les potències d'una matriu diagonal.

a) Calculeu $ A^2 $, $ A^3 $ i $ A^5 $, sent $ A = \begin{pmatrix} 2 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 3 \end{pmatrix}$.

b) Quina matriu creieu que és $ A^{32}$?

c) Sigui $ D $ una matriu $ n \times n $ diagonal que té per elements a la diagonal $\lambda_1, \lambda_2, \dots, \lambda_n $. Conjectureu quina és la matriu $ D^r $, per a $ r \in \mathbb{Z}, r \ge 1 $, i proveu la conjectura per inducció.

### Solució


### a) Càlcul de les primeres potències

Quan multipliquem una matriu diagonal per si mateixa, el resultat és una matriu on cada element de la diagonal s'ha multiplicat per l'element corresponent de l'altra.

- **$ A^2 $**:
$$
A^2 = \begin{pmatrix} 2 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 3 \end{pmatrix} \begin{pmatrix} 2 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 3 \end{pmatrix} = \begin{pmatrix} 2^2 & 0 & 0 \\ 0 & (-1)^2 & 0 \\ 0 & 0 & 3^2 \end{pmatrix} = \begin{pmatrix} 4 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 9 \end{pmatrix}
$$

- **$ A^3 $**:
$$
A^3 = A \cdot A^2 = \begin{pmatrix} 2 \cdot 4 & 0 & 0 \\ 0 & -1 \cdot 1 & 0 \\ 0 & 0 & 3 \cdot 9 \end{pmatrix} = \begin{pmatrix} 8 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 27 \end{pmatrix}
$$

- **$ A^5 $**:
$$
A^5 = \begin{pmatrix} 2^5 & 0 & 0 \\ 0 & (-1)^5 & 0 \\ 0 & 0 & 3^5 \end{pmatrix} = \begin{pmatrix} 32 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 243 \end{pmatrix}
$$

### b) Conjectura per a $ A^{32}$

Seguint el patró observat, per a una matriu diagonal l'exponent s'aplica directament a cada element de la diagonal:

$$
A^{32} = \begin{pmatrix} 2^{32} & 0 & 0 \\ 0 & (-1)^{32} & 0 \\ 0 & 0 & 3^{32} \end{pmatrix} = \begin{pmatrix} 2^{32} & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 3^{32} \end{pmatrix}
$$

### c) Generalització i Prova per Inducció

**Conjectura:**
$$
D^r = \text{diag}(\lambda_1^r, \lambda_2^r, \dots, \lambda_n^r) = \begin{pmatrix} \lambda_1^r & 0 & \dots & 0 \\ 0 & \lambda_2^r & \dots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \dots & \lambda_n^r \end{pmatrix}
$$

**Prova per inducció:**

1.  **Cas base ($ r=1 $):**
    $ D^1 = \text{diag}(\lambda_1^1, \dots, \lambda_n^1) = D $. És cert per definició.

2.  **Hipòtesi d'Inducció (HI):** Suposem que la fórmula és vàlida per a $ r = k $:
    $ D^k = \text{diag}(\lambda_1^k, \lambda_2^k, \dots, \lambda_n^k)$.

3.  **Pas Inductiu:** Volem provar que es compleix per a $ r = k+1 $: $$
D^{k+1} = D \cdot D^k
$$

    Com que $ D $ i $ D^k $ són diagonals, el seu producte és una matriu diagonal on cada element $(i, i)$ és el producte dels elements $(i, i)$ de les matrius originals:
    $$
(D \cdot D^k)_{ii} = d_{ii} \cdot (d^k)_{ii} = \lambda_i \cdot \lambda_i^k = \lambda_i^{k+1}
$$
    
    Per tant, $ D^{k+1} = \text{diag}(\lambda_1^{k+1}, \lambda_2^{k+1}, \dots, \lambda_n^{k+1})$. $\square $


---

## Exercici 5.7: Transposada del Producte

### Enunciat

Doneu un exemple de dues matrius $ A $ i $ B $ de tipus $ 2 \times 2 $ tals que $(AB)^t \neq A^t B^t $.

### Solució


Recordem que la propietat correcta per a la transposada d'un producte és **$(AB)^t = B^t A^t $**. Segons aquesta propietat, la igualtat $(AB)^t = A^t B^t $ només es compliria si les matrius transposades commutessin ($ B^t A^t = A^t B^t $). Com que generalment el producte de matrius no és commutatiu, és fàcil trobar un contraexemple.

### Exemple de contraexemple

Siguin les matrius:
$$
A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}, \quad B = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}
$$

**1. Calculem $(AB)^t $:**

$$
AB = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 1(0)+1(1) & 1(1)+1(0) \\ 0(0)+1(1) & 0(1)+1(0) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}
$$

$$
(AB)^t = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}
$$

**2. Calculem $ A^t B^t $:**

$$
A^t = \begin{pmatrix} 1 & 0 \\ 1 & 1 \end{pmatrix}, \quad B^t = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}
$$

$$
A^t B^t = \begin{pmatrix} 1 & 0 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 1(0)+0(1) & 1(1)+0(0) \\ 1(0)+1(1) & 1(1)+1(0) \end{pmatrix} = \begin{pmatrix} 0 & 1 \\ 1 & 1 \end{pmatrix}
$$

Com podem observar:
$$
(AB)^t = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \neq \begin{pmatrix} 0 & 1 \\ 1 & 1 \end{pmatrix} = A^t B^t
$$

L'exemple demostra que, en general, **la transposada no és distributiva respecte al producte mantenint l'ordre**, sinó que s'ha d'invertir l'ordre dels factors: $(AB)^t = B^t A^t $.


---

## Exercici 5.8: Producte de Matrius Simètriques

### Enunciat

Siguin $ A = \begin{pmatrix} 1 & -2 \\ -2 & 3 \end{pmatrix}$ i $ B = \begin{pmatrix} -2 & 1 \\ 1 & 1 \end{pmatrix}$. Calculeu $(AB)^t $ i $ B^t A^t $. Observeu que, encara que $ A $ i $ B $ són matrius simètriques, el seu producte no ho és.

### Solució


Diem que una matriu $ M $ és **simètrica** si $ M^t = M $. En aquest exercici comprovarem que la simetria no es conserva necessàriament mitjançant el producte.

### 1) Verificació de la simetria de $ A $ i $ B $

- **Matriu $ A $**: $ A^t = \begin{pmatrix} 1 & -2 \\ -2 & 3 \end{pmatrix} = A $. (Simètrica)
- **Matriu $ B $**: $ B^t = \begin{pmatrix} -2 & 1 \\ 1 & 1 \end{pmatrix} = B $. (Simètrica)

### 2) Càlcul de $(AB)^t $ i $ B^t A^t $

$$
AB = \begin{pmatrix} 1 & -2 \\ -2 & 3 \end{pmatrix} \begin{pmatrix} -2 & 1 \\ 1 & 1 \end{pmatrix} = \begin{pmatrix} 1(-2)+(-2)(1) & 1(1)+(-2)(1) \\ (-2)(-2)+3(1) & (-2)(1)+3(1) \end{pmatrix} = \begin{pmatrix} -4 & -1 \\ 7 & 1 \end{pmatrix}
$$

$$
(AB)^t = \begin{pmatrix} -4 & 7 \\ -1 & 1 \end{pmatrix}
$$

$$
B^t A^t = B A = \begin{pmatrix} -2 & 1 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} 1 & -2 \\ -2 & 3 \end{pmatrix} = \begin{pmatrix} -2(1)+1(-2) & -2(-2)+1(3) \\ 1(1)+1(-2) & 1(-2)+1(3) \end{pmatrix} = \begin{pmatrix} -4 & 7 \\ -1 & 1 \end{pmatrix}
$$

Observem que, efectivament, $(AB)^t = B^t A^t $.

### 3) Observació sobre la simetria del producte

Perquè el producte $ AB $ fos simètric, caldria que $(AB)^t = AB $.

$$
(AB)^t = \begin{pmatrix} -4 & 7 \\ -1 & 1 \end{pmatrix} \neq \begin{pmatrix} -4 & -1 \\ 7 & 1 \end{pmatrix} = AB
$$

Encara que dues matrius siguin simètriques, el seu producte **no té per què ser simètric**. El producte de dues matrius simètriques només és simètric si les matrius **commuten** ($ AB = BA $).


---

## Exercici 5.9: Condició de Simetria del Producte

### Enunciat

Siguin $ A $ i $ B $ dues matrius simètriques del mateix tipus. Proveu que $ AB $ és una matriu simètrica si, i només si, $ A $ i $ B $ commuten.

### Solució


**Hipòtesis:**
1. $ A $ és simètrica: $ A^t = A $
2. $ B $ és simètrica: $ B^t = B $
3. $ A $ i $ B $ són del mateix tipus (perquè el producte estigui definit i sigui quadrat).

**Objectiu:** Provar que $(AB)^t = AB \iff AB = BA $.

### Demostració

Utilitzarem la propietat fonamental de la transposada d'un producte: **$(AB)^t = B^t A^t $**.

Substituint les nostres hipòtesis de simetria ($ B^t = B $ i $ A^t = A $):
$$
(AB)^t = B A
$$

Perquè $ AB $ sigui simètrica s'ha de complir que:
$$
(AB)^t = AB
$$

Substituint el resultat aplicant la transposada al producte ($(AB)^t = BA $):
$$
B A = AB
$$

Aquesta darrera igualtat és, precisament, la definició de **commutar**.


---

## Exercici 5.10: Matrius amb Propietats Especials

### Enunciat

Siguin $ I $ la matriu identitat i $ O $ la matriu nul·la de $\mathcal{M}_{2 \times 2}(\mathbb{R})$. Trobeu matrius $ A, B, C, D, E \in \mathcal{M}_{2 \times 2}(\mathbb{R})$ tals:
1) $ A^2 = I $ i $ A \neq I, -I $;
2) $ B^2 = O $ i $ B \neq O $;
3) $ C^2 = C $ i $ C \neq I, O $;
4) $ DE = O $ però $ E \neq D $ i $ ED \neq O $.

### Solució


Aquest exercici ens ajuda a entendre que les propietats dels nombres reals (com que si $ x^2=1 \implies x = \pm 1 $ o si $ ab=0 \implies a=0 $ o $ b=0 $) no sempre s'apliquen a les matrius.

### 1) Matriu involutòria ($ A^2 = I $)

Busquem una matriu que sigui la seva pròpia inversa. Una solució senzilla és una matriu que intercanviï les files (matriu de permutació):

$$
A = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}
$$

$$
A^2 = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} = I
$$

És clar que $ A $ no és ni $ I $ ni $-I $.

### 2) Matriu nilpotent ($ B^2 = O $)

Busquem una matriu no nul·la que, en elevar-la al quadrat, esdevingui la matriu nul·la. Podem utilitzar una matriu triangular superior amb zeros a la diagonal:

$$
B = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}
$$

$$
B^2 = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix} = O
$$

### 3) Matriu idempotent ($ C^2 = C $)

Busquem una matriu que sigui una projecció. Una matriu diagonal amb un 1 i un 0 a la diagonal principal funcionarà:

$$
C = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}
$$

$$
C^2 = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} = C
$$

És clar que $ C $ no és ni la identitat $ I $ ni la matriu nul·la $ O $.

### 4) Divisors de zero no commutatius ($ DE = O, ED \neq O $)

Busquem dues matrius $ D $ i $ E $ tals que el seu producte en un ordre sigui zero, però en l'altre no ho sigui:

Sigui $ D = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ i $ E = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}$.

$$
DE = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 1(0)+0(1) & 1(0)+0(0) \\ 0(0)+0(1) & 0(0)+0(0) \end{pmatrix} = \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix} = O
$$

$$
ED = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} = \begin{pmatrix} 0(1)+0(0) & 0(0)+0(0) \\ 1(1)+0(0) & 1(0)+0(0) \end{pmatrix} = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} \neq O
$$

Es compleixen totes les condicions, incloent $ E \neq D $.


---

## Exercici 5.11: Identitats Notables amb Matrius

### Enunciat

Esbrineu si les igualtats següents les satisfan totes les matrius $ A, B \in \mathcal{M}_n(\mathbb{R})$. En cas negatiu, doneu alguna condició sobre $ A $ i $ B $ per tal que es satisfacin.
1) $(A + B)^2 = A^2 + B^2 + 2AB $;
2) $(A - B)(A + B) = A^2 - B^2 $.

### Solució


### 1) Estudi de $(A + B)^2 = A^2 + B^2 + 2AB $

Desenvolupem utilitzant la propietat distributiva:
$$
(A + B)^2 = (A + B)(A + B) = A^2 + AB + BA + B^2
$$

Comparem aquest resultat amb la igualtat proposada:
$$
A^2 + AB + BA + B^2 = A^2 + B^2 + 2AB \implies AB + BA = 2AB
$$

$$
BA = 2AB - AB \implies BA = AB
$$

La condició necessària i suficient és que les matrius $ A $ i $ B $ **commutin** ($ AB = BA $).

---

### 2) Estudi de $(A - B)(A + B) = A^2 - B^2 $

Desenvolupem el producte del costat esquerre:
$$
(A - B)(A + B) = A^2 + AB - BA - B^2
$$

Comparem amb el costat dret:
$$
A^2 + AB - BA - B^2 = A^2 - B^2 \implies AB - BA = O
$$
$$
AB = BA
$$

La condició és, novament, que les matrius $ A $ i $ B $ **commutin** ($ AB = BA $).



---

## Exercici 5.12: Relació de Semblança entre Matrius

### Enunciat

Siguin $ A $ i $ B $ matrius quadrades del mateix tipus. Direm que $ A $ és **semblant** a $ B $ si existeix una matriu invertible $ P $ tal que $ B = P^{-1}AP $. Si aquest és el cas, proveu:
1) $ B $ és semblant a $ A $.
2) Ser semblants és una relació d'equivalència.
3) $ A $ és invertible si, i només si, $ B $ és invertible.
4) $ A^t $ és semblant a $ B^t $.
5) Si $ A^n = 0 $ i $ B $ és semblant a $ A $, aleshores $ B^n = 0 $.

### Solució


### 1) Simetria de la relació ($ B $ semblant a $ A $)

Si $ A $ és semblant a $ B $, existeix una matriu $ P $ invertible tal que:
$$
B = P^{-1} A P
$$

Volem provar que $ A $ es pot escriure com $ Q^{-1} B Q $ per a alguna $ Q $ invertible. Multipliquem per l'esquerra per $ P $ i per la dreta per $ P^{-1}$:
$$
P B P^{-1} = P (P^{-1} A P) P^{-1} = (P P^{-1}) A (P P^{-1}) = I A I = A
$$

Definim $ Q = P^{-1}$. Llavors $ Q^{-1} = (P^{-1})^{-1} = P $. Substituint:
$$
A = Q^{-1} B Q
$$

Per tant, **$ B $ és semblant a $ A $**.

### 2) Relació d'equivalència

Una relació és d'equivalència si compleix tres propietats:
- **Reflexiva**: $ A = I^{-1} A I $. Tota matriu és semblant a si mateixa (prenent la matriu identitat com a $ P $).
- **Simètrica**: Provat en l'apartat (1). Si $ A \sim B \implies B \sim A $.
- **Transitiva**: Suposem $ A \sim B $ ($ B = P^{-1} A P $) i $ B \sim C $ ($ C = Q^{-1} B Q $). Aleshores:
  $$
C = Q^{-1} (P^{-1} A P) Q = (PQ)^{-1} A (PQ)
$$
  Com que el producte de matrius invertibles ($ PQ $) és invertible, $ A \sim C $.

### 3) Invertibilitat

Suposem $ A $ invertible. Provarem que $ B = P^{-1} A P $ també ho és:

$$
B^{-1} = (P^{-1} A P)^{-1} = P^{-1} A^{-1} (P^{-1})^{-1} = P^{-1} A^{-1} P
$$

Com que hem pogut trobar una inversa per a $ B $ utilitzant $ A^{-1}$, $ B $ és invertible. El mateix raonament s'aplica a la inversa si suposem $ B $ invertible.

### 4) Semblança de les transposades

Tenim $ B = P^{-1} A P $. Apliquem la transposada a tota la igualtat:

$$
B^t = (P^{-1} A P)^t = P^t A^t (P^{-1})^t
$$

Sabem que la transposada de la inversa és la inversa de la transposada $(P^{-1})^t = (P^t)^{-1}$. Aleshores:

$$
B^t = P^t A^t (P^t)^{-1}
$$

Si definim $ S = (P^t)^{-1}$, llavors $ S^{-1} = P^t $. Substituint:
$$
B^t = S^{-1} A^t S
$$

Això prova que **$ A^t $ i $ B^t $ són semblants**.

### 5) Potències de matrius semblants

Desenvolupem $ B^n $:

$$
B^n = (P^{-1} A P)^n = (P^{-1} A P)(P^{-1} A P) \dots (P^{-1} A P)
$$

Observem que els termes intermedis s'anul·len: $ P P^{-1} = I $.

$$
B^n = P^{-1} A (P P^{-1}) A (P P^{-1}) \dots A P = P^{-1} A^n P
$$

Si $ A^n = 0 $, llavors:

$$
B^n = P^{-1} \cdot 0 \cdot P = \mathbf{0}
$$


---

## Exercici 5.13: Escalonament i Rang de Matrius

### Enunciat

Trobeu una matriu escalonada per files equivalent a cadascuna de les matrius següents. Doneu el rang de cada matriu.
1) $\begin{pmatrix} 1 & 0 & 2 & 3 \\ 2 & 1 & 1 & 3 \\ -1 & 2 & 0 & 0 \end{pmatrix}$
2) $\begin{pmatrix} -3 & 1 \\ 2 & 0 \\ 6 & 4 \end{pmatrix}$
3) $\begin{pmatrix} 5 & 11 & 6 \\ 2 & 1 & 4 \\ 3 & -2 & 8 \\ 0 & 0 & 4 \end{pmatrix}$
4) $\begin{pmatrix} 0 & 1 & 2 & 3 & 4 \\ -1 & 0 & 1 & 2 & 3 \\ -2 & -1 & 0 & 1 & 2 \\ -3 & -2 & -1 & 0 & 1 \end{pmatrix}$

### Solució


Per trobar el rang d'una matriu, apliquem el mètode de Gauss per obtenir-ne una forma escalonada. El rang serà el nombre de files no nul·les.

### 1) $$
M_1 = \begin{pmatrix} 1 & 0 & 2 & 3 \\ 2 & 1 & 1 & 3 \\ -1 & 2 & 0 & 0 \end{pmatrix}
$$

- $ F_2 \to F_2 - 2F_1 $:
$$
\begin{pmatrix} 1 & 0 & 2 & 3 \\ 0 & 1 & -3 & -3 \\ -1 & 2 & 0 & 0 \end{pmatrix}
$$
- $ F_3 \to F_3 + F_1 $:
$$
\begin{pmatrix} 1 & 0 & 2 & 3 \\ 0 & 1 & -3 & -3 \\ 0 & 2 & 2 & 3 \end{pmatrix}
$$
- $ F_3 \to F_3 - 2F_2 $:
$$
\begin{pmatrix} 1 & 0 & 2 & 3 \\ 0 & 1 & -3 & -3 \\ 0 & 0 & 8 & 9 \end{pmatrix}
$$
**Rang = 3** (hi ha 3 files no nul·les).

### 2) Matriu 2
$$
M_2 = \begin{pmatrix} -3 & 1 \\ 2 & 0 \\ 6 & 4 \end{pmatrix}
$$
- Intercanvi $ F_1 \leftrightarrow F_2 $: $\begin{pmatrix} 2 & 0 \\ -3 & 1 \\ 6 & 4 \end{pmatrix}$
- $ F_2 \to F_2 + \frac{3}{2}F_1 $: (o $ 2F_2 + 3F_1 \to F_2 $)
$$
\begin{pmatrix} 2 & 0 \\ 0 & 1 \\ 6 & 4 \end{pmatrix}
$$
- $ F_3 \to F_3 - 3F_1 $:
$$
\begin{pmatrix} 2 & 0 \\ 0 & 1 \\ 0 & 4 \end{pmatrix}
$$.
- $ F_3 \to F_3 - 4F_2 $:
$$
\begin{pmatrix} 2 & 0 \\ 0 & 1 \\ 0 & 0 \end{pmatrix}
$$
**Rang = 2**.

### 3) Matriu 3
$$
M_3 = \begin{pmatrix} 5 & 11 & 6 \\ 2 & 1 & 4 \\ 3 & -2 & 8 \\ 0 & 0 & 4 \end{pmatrix}
$$
- Intercanvi $ F_1 \leftrightarrow F_2 $: $\begin{pmatrix} 2 & 1 & 4 \\ 5 & 11 & 6 \\ 3 & -2 & 8 \\ 0 & 0 & 4 \end{pmatrix}$
- $ 2F_2 - 5F_1 \to F_2 $
- $ 2F_3 - 3F_1 \to F_3 $
$$
\begin{pmatrix} 2 & 1 & 4 \\ 0 & 17 & -8 \\ 0 & -7 & 4 \\ 0 & 0 & 4 \end{pmatrix}
$$
- $ 17F_3 + 7F_2 \to F_3 $
$$
\begin{pmatrix} 2 & 1 & 4 \\ 0 & 17 & -8 \\ 0 & 0 & 12 \\ 0 & 0 & 4 \end{pmatrix}
$$
- $ 3F_4 - F_3 \to F_4 $
$$
\begin{pmatrix} 2 & 1 & 4 \\ 0 & 17 & -8 \\ 0 & 0 & 12 \\ 0 & 0 & 0 \end{pmatrix}
$$
**Rang = 3**.

### 4) Matriu 4
$$
M_4 = \begin{pmatrix} 0 & 1 & 2 & 3 & 4 \\ -1 & 0 & 1 & 2 & 3 \\ -2 & -1 & 0 & 1 & 2 \\ -3 & -2 & -1 & 0 & 1 \end{pmatrix}
$$
- Intercanvi $ F_1 \leftrightarrow F_2 $: $\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\ 0 & 1 & 2 & 3 & 4 \\ -2 & -1 & 0 & 1 & 2 \\ -3 & -2 & -1 & 0 & 1 \end{pmatrix}$
- $ F_3 \to F_3 - 2F_1 $:
$$
\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\ 0 & 1 & 2 & 3 & 4 \\ 0 & -1 & -2 & -3 & -4 \\ -3 & -2 & -1 & 0 & 1 \end{pmatrix}
$$
- $ F_4 \to F_4 - 3F_1 $:
$$
\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\ 0 & 1 & 2 & 3 & 4 \\ 0 & -1 & -2 & -3 & -4 \\ 0 & -2 & -4 & -6 & -8 \end{pmatrix}
$$
- $ F_3 \to F_3 + F_2 $
- $ F_4 \to F_4 + 2F_2 $
$$
\begin{pmatrix} -1 & 0 & 1 & 2 & 3 \\ 0 & 1 & 2 & 3 & 4 \\ 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix}
$$
**Rang = 2**.


---

## Exercici 5.14: Inversa de Matrius Elementals

### Enunciat

Trobeu la inversa de les matrius elementals següents.
1) $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$
2) $\begin{pmatrix} 5 & 0 \\ 0 & 1 \end{pmatrix}$
3) $\begin{pmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{pmatrix}$
4) $\begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & -3 & 1 \end{pmatrix}$
5) $\begin{pmatrix} k & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}, k \neq 0 $

### Solució


Diem que una matriu és **elemental** si s'obté aplicant una única operació elemental de fila a la matriu identitat. La inversa d'una matriu elemental és la matriu que realitza l'operació inversa.

---

### 1) Intercanvi de files ($ F_1 \leftrightarrow F_2 $)
$$
E_1 = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}
$$
L'operació inversa d'intercanviar dues files és tornar-les a intercanviar. Per tant, la matriu és la seva pròpia inversa.
$$
E_1^{-1} = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}
$$

### 2) Escalar una fila ($ F_1 \to 5F_1 $)
$$
E_2 = \begin{pmatrix} 5 & 0 \\ 0 & 1 \end{pmatrix}
$$
L'operació inversa de multiplicar per 5 és multiplicar per $ 1/5 $.
$$
E_2^{-1} = \begin{pmatrix} 1/5 & 0 \\ 0 & 1 \end{pmatrix}
$$

### 3) Intercanvi de files ($ F_1 \leftrightarrow F_3 $)
$$
E_3 = \begin{pmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{pmatrix}
$$
Igual que en el cas 1, la inversa d'una permutació és ella mateixa.
$$
E_3^{-1} = \begin{pmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{pmatrix}
$$

### 4) Combinació lineal de files ($ F_3 \to F_3 - 3F_2 $)
$$
E_4 = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & -3 & 1 \end{pmatrix}
$$
L'operació inversa de restar 3 vegades una fila és sumar-la 3 vegades.
$$
E_4^{-1} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 3 & 1 \end{pmatrix}
$$

### 5) Escalar una fila ($ F_1 \to kF_1 $)
$$
E_5 = \begin{pmatrix} k & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}
$$
L'operació inversa de multiplicar per $ k $ és multiplicar per $ 1/k $.
$$
E_5^{-1} = \begin{pmatrix} 1/k & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}
$$


---

## Exercici 5.15: Càlcul de la Matriu Inversa (Gauss-Jordan)

### Enunciat

Trobeu, si existeix, la inversa de cadascuna de les matrius següents, seguint el mètode de Gauss-Jordan.
1) $\begin{pmatrix} 1 & 2 \\ 3 & 5 \end{pmatrix}$
2) $\begin{pmatrix} 3 & 1 & 5 \\ 2 & 4 & 1 \\ -4 & 2 & -9 \end{pmatrix}$
3) $\begin{pmatrix} -2 & 3 & -1 & -1 \\ -1 & 1 & 1 & 1 \\ -1 & -1 & 1 & 2 \\ 3 & 1 & -2 & -4 \end{pmatrix}$
4) $ A = (a_{ij})_{4 \times 4}$, tal que $ a_{ij} = 1 $ si $|i - j| \le 1 $, i $ a_{ij} = 0 $ altrament.
5) $ A = (a_{ij})_{4 \times 4}$, tal que $ a_{ij} = 2^{j-1}$ si $ i \ge j $, i $ a_{ij} = 0 $ altrament.
6) $ A = (a_{ij})_{4 \times 4}$, tal que $ a_{ii} = k $, $ a_{i,j} = 1 $ si $ i - j = 1 $, i $ a_{ij} = 0 $ altrament.

### Solució


El mètode de Gauss-Jordan consisteix a col·locar la matriu identitat a la dreta de la matriu $ A $ i aplicar operacions elementals fins que a l'esquerra quedi la identitat. El que quedi a la dreta serà la inversa.

### 1) Matriu $ 2 \times 2 $
$$
(M_1 | I) = \begin{pmatrix} 1 & 2 & | & 1 & 0 \\ 3 & 5 & | & 0 & 1 \end{pmatrix} \xrightarrow{F_2 - 3F_1} \begin{pmatrix} 1 & 2 & | & 1 & 0 \\ 0 & -1 & | & -3 & 1 \end{pmatrix} \xrightarrow{-F_2} \begin{pmatrix} 1 & 2 & | & 1 & 0 \\ 0 & 1 & | & 3 & -1 \end{pmatrix} \xrightarrow{F_1 - 2F_2} \begin{pmatrix} 1 & 0 & | & -5 & 2 \\ 0 & 1 & | & 3 & -1 \end{pmatrix}
$$

$$
M_1^{-1} = \begin{pmatrix} -5 & 2 \\ 3 & -1 \end{pmatrix}
$$

### 2) Matriu $ 3 \times 3 $
Calculem el determinant per veure si existeix:
$\det(M_2) = 3(-36-2) - 1(-18+4) + 5(4+16) = -114 + 14 + 100 = 0 $.
**La matriu no té inversa** perquè el seu determinant és nul.

### 3) Matriu $ 4 \times 4 $
Després d'aplicar Gauss-Jordan complet (procés llarg):
$$
M_3^{-1} = \begin{pmatrix} 1 & -3 & 1 & 0 \\ 2 & -7 & 2 & 1 \\ 3 & -9 & 3 & 1 \\ -2 & 6 & -3 & -1 \end{pmatrix}
$$

### 4) Matriu de banda $ 4 \times 4 $
La matriu és $\begin{pmatrix} 1 & 1 & 0 & 0 \\ 1 & 1 & 1 & 0 \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 1 & 1 \end{pmatrix}$. Aplicant Gauss-Jordan:
$$
A^{-1} = \begin{pmatrix} 1 & 0 & -1 & 1 \\ 0 & 0 & 1 & -1 \\ -1 & 1 & 0 & 0 \\ 1 & -1 & 0 & 1 \end{pmatrix}
$$

### 5) Matriu triangular inferior $ 4 \times 4 $
La matriu és $\begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 2 & 0 & 0 \\ 1 & 2 & 4 & 0 \\ 1 & 2 & 4 & 8 \end{pmatrix}$.
Resolent el sistema $ AX=I $:
$$
A^{-1} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ -1/2 & 1/2 & 0 & 0 \\ 0 & -1/4 & 1/4 & 0 \\ 0 & 0 & -1/8 & 1/8 \end{pmatrix}
$$

### 6) Matriu bidiagonal inferior ($ k \neq 0 $)
La matriu és $\begin{pmatrix} k & 0 & 0 & 0 \\ 1 & k & 0 & 0 \\ 0 & 1 & k & 0 \\ 0 & 0 & 1 & k \end{pmatrix}$.
La inversa segueix el patró alternant segons les potències de $ k $:
$$
A^{-1} = \begin{pmatrix} 1/k & 0 & 0 & 0 \\ -1/k^2 & 1/k & 0 & 0 \\ 1/k^3 & -1/k^2 & 1/k & 0 \\ -1/k^4 & 1/k^3 & -1/k^2 & 1/k \end{pmatrix}
$$


---

## Exercici 5.16: Linealitat de les Equacions

### Enunciat

Quines de les equacions següents són lineals en $ x, y $ i $ z $?
1) $ x + 3xy + 2z = 2 $;
2) $ y + x + \sqrt{2}z = e^2 $;
3) $ x - 4y + 3z^{1/2} = 0 $;
4) $ y = z \sin \frac{\pi}{4} - 2y + 3 $;
5) $ z + x - y^{-1} + 4 = 0 $;
6) $ x = z $.

### Solució


Una equació en les variables $ x, y, z $ és **lineal** si es pot escriure de la forma:
$$
ax + by + cz = d
$$
on $ a, b, c, d $ són constants reals. Això implica que les variables han d'estar elevades a la potència 1 i no es poden multiplicar entre elles ni aparèixer dins de funcions no lineals (com arrels, logaritmes o trigonomètriques).

---

### Anàlisi de les equacions:

1. **$ x + 3xy + 2z = 2 $**: **NO lineal**. El terme $ 3xy $ és un producte de dues variables, la qual cosa invalida la linealitat.
2. **$ y + x + \sqrt{2}z = e^2 $**: **Lineal**. S'escruria com $ 1x + 1y + \sqrt{2}z = e^2 $. Cal recordar que $\sqrt{2}$ i $ e^2 $ són constants (nombres reals).
3. **$ x - 4y + 3z^{1/2} = 0 $**: **NO lineal**. La variable $ z $ està elevada a $ 1/2 $ (una arrel quadrada), i requerim que el grau sigui exactament 1.
4. **$ y = z \sin \frac{\pi}{4} - 2y + 3 $**: **Lineal**. Es pot reordenar com $ 0x + 3y - (\sin \frac{\pi}{4})z = 3 $. El terme $\sin \frac{\pi}{4}$ és una constant ($\frac{\sqrt{2}}{2}$), no afecta les variables.
5. **$ z + x - y^{-1} + 4 = 0 $**: **NO lineal**. El terme $ y^{-1}$ ($ 1/y $) no és de grau 1.
6. **$ x = z $**: **Lineal**. Es pot escriure com $ 1x + 0y - 1z = 0 $.

Les equacions lineals són la **2**, la **4** i la **6**.


---

## Exercici 5.17: De Matriu Ampliada a Sistema d'Equacions

### Enunciat

Trobeu un sistema d'equacions lineals que correspongui a cadascuna de les matrius ampliades següents.
1) $\begin{pmatrix} 1 & 0 & 3 & 2 \\ 2 & 1 & 1 & 3 \\ 0 & -1 & 2 & 4 \end{pmatrix}$
2) $\begin{pmatrix} -1 & 5 & -2 \\ 1 & 1 & 0 \\ 1 & -1 & 1 \end{pmatrix}$
3) $\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\ 1/3 & 1/4 & 1/5 & 1/2 & 1 \end{pmatrix}$
4) $\begin{pmatrix} 1 & 0 & 0 & 0 & 1 \\ 0 & 1 & 0 & 0 & 2 \\ 0 & 0 & 1 & 0 & 3 \\ 1 & 0 & 0 & 1 & 4 \end{pmatrix}$

### Solució


En una matriu ampliada $(A|b)$, les columnes de la matriu $ A $ representen els coeficients de les variables ($ x, y, z...$ o $ x_1, x_2, x_3...$) i la darrera columna (el vector $ b $) representa els termes independents de cada equació.

---

### 1) Sistema en $ x, y, z $
La matriu té 3 files i 4 columnes (3 equacions i 3 incògnites):
$$
\begin{cases} x + 3z = 2 \\ 2x + y + z = 3 \\ -y + 2z = 4 \end{cases}
$$

### 2) Sistema en $ x, y $
La matriu té 3 files i 3 columnes (3 equacions i 2 incògnites):
$$
\begin{cases} -x + 5y = -2 \\ x + y = 0 \\ x - y = 1 \end{cases}
$$

### 3) Sistema en $ x_1, x_2, x_3, x_4 $
La matriu té 2 files i 5 columnes (2 equacions i 4 incògnites):
$$
\begin{cases} x_1 + 2x_2 + 3x_3 + 4x_4 = 5 \\ \frac{1}{3}x_1 + \frac{1}{4}x_2 + \frac{1}{5}x_3 + \frac{1}{2}x_4 = 1 \end{cases}
$$

### 4) Sistema en $ x_1, x_2, x_3, x_4 $
La matriu té 4 files i 5 columnes (4 equacions i 4 incògnites):
$$
\begin{cases} x_1 = 1 \\ x_2 = 2 \\ x_3 = 3 \\ x_1 + x_4 = 4 \end{cases}
$$

*(Aquest darrer sistema ja està pràcticament resolt, ja que ens dóna directament el valor de les variables primeres).*


---

## Exercici 5.18: Teorema de Rouché-Capelli

### Enunciat

Responeu raonadament les preguntes següents:
1) Quin és el rang de la matriu associada a un sistema compatible determinat amb 5 equacions i 4 incògnites? I si el sistema és compatible indeterminat?
2) Quantes equacions com a mínim són necessàries per tenir un sistema compatible indeterminat amb 2 graus de llibertat i rang 3? Quantes incògnites tindrà aquest sistema?
3) Pot ser compatible determinat un sistema amb 7 equacions i 10 incògnites?
4) És possible que un sistema lineal amb menys equacions que incògnites sigui incompatible?
5) Inventeu un sistema compatible determinat, un sistema compatible indeterminat i un sistema incompatible, tots ells amb 3 incògnites i 4 equacions.

### Solució


Aquest exercici requereix l'aplicació del **Teorema de Rouché-Capelli**, que relaciona el rang de la matriu de coeficients ($ A $), el rang de la matriu ampliada ($ A|b $) i el nombre d'incògnites ($ n $).

---

### 1) Sistema amb 5 equacions i 4 incògnites ($ n=4 $)
Com que el sistema és compatible (té solució), el $\text{rang}(A) = \text{rang}(A|b)$.
- **Si és determinat (SCD)**: El rang ha de ser igual al nombre d'incògnites. Per tant, **rang = 4**.
- **Si és indeterminat (SCI)**: El rang ha de ser inferior al nombre d'incògnites. Per tant, el **rang < 4** (pot ser 1, 2 o 3).

### 2) SCI amb 2 graus de llibertat i rang 3
Els **graus de llibertat** es calculen com la diferència entre el nombre d'incògnites i el rang ($ n - r $).
- $ n - 3 = 2 \implies n = 5 $. El sistema té **5 incògnites**.
- Com que el rang és 3, necessitem com a mínim 3 files linealment independents. Per tant, calen **com a mínim 3 equacions** (tot i que el més habitual seria tenir-ne almenys 5 per "omplir" el sistema, teòricament amb 3 n'hi ha prou per tenir rang 3).

### 3) Sistema amb 7 equacions ($ m $) i 10 incògnites ($ n $)
Perquè sigui compatible determinat (SCD), el rang hauria de ser igual al nombre d'incògnites ($ n=10 $).
No obstant això, el rang d'una matriu no pot superar mai el seu nombre més petit de dimensions: $\text{rang}(A) \le \min(m, n) = \min(7, 10) = 7 $.
Com que el rang màxim és 7 i necessitaríem rang 10, **NO pot ser compatible determinat**.

### 4) Equacions < incògnites i incompatibilitat
**SÍ, és possible**. Que hi hagi poques equacions no garanteix que no hi hagi contradiccions.
*Exemple:* $ x + y + z = 1 $ i $ x + y + z = 2 $. Hi ha 2 equacions i 3 incògnites, però el sistema no té solució ($ 1 \neq 2 $).

### 5) Exemples (3 incògnites, 4 equacions)

- **SCD (Compatible Determinat)**: $\text{rang}=3 $
  $$
\begin{cases} x = 1 \\ y = 1 \\ z = 1 \\ x + y + z = 3 \end{cases}
$$
- **SCI (Compatible Indeterminat)**: $\text{rang}<3 $
  $$
\begin{cases} x + y + z = 1 \\ 2x + 2y + 2z = 2 \\ 0 = 0 \\ 0 = 0 \end{cases}
$$
- **SI (Incompatible)**: $\text{rang}(A) \neq \text{rang}(A|b)$
  $$
\begin{cases} x = 1 \\ x = 2 \\ y = 0 \\ z = 0 \end{cases}
$$


---

## Exercici 5.19: Sistemes en el cos Z2

### Enunciat

Resoleu els sistemes lineals següents amb coeficients a $\mathbb{Z}_2 $. Useu eliminació gaussiana i doneu la solució en forma paramètrica.
1) $\begin{cases} x + y = 1 \\ x + z = 0 \\ x + y + z = 1 \end{cases}$
2) $\begin{cases} x + y = 1 \\ y + z = 1 \\ x + z = 1 \end{cases}$
3) $\begin{cases} x + y = 0 \\ y + z = 0 \\ x + z = 0 \end{cases}$

### Solució


Recordem que en $\mathbb{Z}_2 $, només hi ha dos elements: ${0, 1}$. Les operacions segueixen les regles:
- $ 1 + 1 = 0 $ (per tant, sumar és el mateix que restar).
- $ 1 \cdot 1 = 1 $, $ 1 \cdot 0 = 0 $.

### 1) Primer sistema
Escrivim la matriu ampliada:
$$
\begin{pmatrix} 1 & 1 & 0 & | & 1 \\ 1 & 0 & 1 & | & 0 \\ 1 & 1 & 1 & | & 1 \end{pmatrix}
$$
Apliquem Gauss ($ F_2 \to F_2 + F_1 $, $ F_3 \to F_3 + F_1 $):
$$
\begin{pmatrix} 1 & 1 & 0 & | & 1 \\ 0 & 1 & 1 & | & 1 \\ 0 & 0 & 1 & | & 0 \end{pmatrix}
$$
D'on obtenim:
- $ z = 0 $
- $ y + z = 1 \implies y + 0 = 1 \implies y = 1 $
- $ x + y = 1 \implies x + 1 = 1 \implies x = 0 $

**Solució:** $(x, y, z) = (0, 1, 0)$.

### 2) Segon sistema
$$
\begin{pmatrix} 1 & 1 & 0 & | & 1 \\ 0 & 1 & 1 & | & 1 \\ 1 & 0 & 1 & | & 1 \end{pmatrix}
$$
Apliquem Gauss ($ F_3 \to F_3 + F_1 $):
$$
\begin{pmatrix} 1 & 1 & 0 & | & 1 \\ 0 & 1 & 1 & | & 1 \\ 0 & 1 & 1 & | & 0 \end{pmatrix}
$$
Apliquem Gauss ($ F_3 \to F_3 + F_2 $):
$$
\begin{pmatrix} 1 & 1 & 0 & | & 1 \\ 0 & 1 & 1 & | & 1 \\ 0 & 0 & 0 & | & 1 \end{pmatrix}
$$
L'última fila ens dóna $ 0 = 1 $, la qual cosa és una contradicció. 
**Solució:** El sistema és **incompatible**.

### 3) Tercer sistema
És un sistema homogeni:
$$
\begin{pmatrix} 1 & 1 & 0 & | & 0 \\ 0 & 1 & 1 & | & 0 \\ 1 & 0 & 1 & | & 0 \end{pmatrix} \xrightarrow{F_3 + F_1} \begin{pmatrix} 1 & 1 & 0 & | & 0 \\ 0 & 1 & 1 & | & 0 \\ 0 & 1 & 1 & | & 0 \end{pmatrix} \xrightarrow{F_3 + F_2} \begin{pmatrix} 1 & 1 & 0 & | & 0 \\ 0 & 1 & 1 & | & 0 \\ 0 & 0 & 0 & | & 0 \end{pmatrix}
$$
Obtenim:
- $ y + z = 0 \implies y = z $
- $ x + y = 0 \implies x = y $

**Solució:** $ x = y = z = \lambda $.
En forma de conjunt: ${(0, 0, 0), (1, 1, 1)}$, o bé $(x, y, z) = \lambda(1, 1, 1)$ amb $\lambda \in \mathbb{Z}_2 $.


---

## Exercici 5.20: Resolució de Sistemes Lineals (Gauss)

### Enunciat

Resoleu el sistemes lineals següents. Useu eliminació gaussiana i doneu la solució en forma paramètrica.
1) $\begin{cases} x + y + 2z = 8 \\ -x - 2y + 3z = 1 \\ 3x - 7y + 4z = 10 \\ 3y - 2z = -1 \end{cases}$
2) $\begin{cases} x - y + 2z = 3 \\ 2x - 2y + 5z = 4 \\ x + 2y - z = -3 \\ 2y + 2z = 1 \end{cases}$
3) $\begin{cases} x - y + 2z - w = -1 \\ 2x + y - 2z - 2w = -2 \\ -x + 2y - 4z + w = 1 \\ 3x - 3w = -3 \end{cases}$
4) $\begin{cases} x_1 + 3x_2 - 2x_3 + 2x_5 = 0 \\ 2x_1 + 6x_2 - 5x_3 - 2x_4 + 4x_5 - 3x_6 = -1 \\ 5x_3 + 10x_4 + 15x_6 = 5 \\ 2x_1 + 6x_2 + 8x_4 + 4x_5 + 18x_6 = 6 \end{cases}$

### Solució


Apliquem l'eliminació gaussiana a cada sistema per determinar-ne la compatibilitat i trobar les solucions.

### 1) Sistema de 4 equacions i 3 incògnites
Matriu ampliada i passos de Gauss:
$$
\begin{pmatrix} 1 & 1 & 2 & | & 8 \\ -1 & -2 & 3 & | & 1 \\ 3 & -7 & 4 & | & 10 \\ 0 & 3 & -2 & | & -1 \end{pmatrix} \xrightarrow[F_3 - 3F_1]{F_2 + F_1} \begin{pmatrix} 1 & 1 & 2 & | & 8 \\ 0 & -1 & 5 & | & 9 \\ 0 & -10 & -2 & | & -14 \\ 0 & 3 & -2 & | & -1 \end{pmatrix} \xrightarrow[F_4+3F_2]{F_3-10F_2} \begin{pmatrix} 1 & 1 & 2 & | & 8 \\ 0 & -1 & 5 & | & 9 \\ 0 & 0 & -52 & | & -104 \\ 0 & 0 & 13 & | & 26 \end{pmatrix}
$$
De la tercera fila: $-52z = -104 \implies z = 2 $.
Substituint:
- $-y + 5(2) = 9 \implies -y = -1 \implies y = 1 $
- $ x + 1 + 2(2) = 8 \implies x = 3 $

**Solució única (SCD):** $(x, y, z) = (3, 1, 2)$.

### 2) Sistema de 4 equacions i 3 incògnites
Matriu ampliada:
$$
\begin{pmatrix} 1 & -1 & 2 & | & 3 \\ 2 & -2 & 5 & | & 4 \\ 1 & 2 & -1 & | & -3 \\ 0 & 2 & 2 & | & 1 \end{pmatrix} \xrightarrow[F_3-F_1]{F_2-2F_1} \begin{pmatrix} 1 & -1 & 2 & | & 3 \\ 0 & 0 & 1 & | & -2 \\ 0 & 3 & -3 & | & -6 \\ 0 & 2 & 2 & | & 1 \end{pmatrix} \xrightarrow[F_4-2F_3]{F_3/3, F_2 \leftrightarrow F_3} \begin{pmatrix} 1 & -1 & 2 & | & 3 \\ 0 & 1 & -1 & | & -2 \\ 0 & 0 & 1 & | & -2 \\ 0 & 0 & 4 & | & 5 \end{pmatrix} \xrightarrow{F_4-4F_3} \begin{pmatrix} \dots \\ 0 & 0 & 0 & | & 13 \end{pmatrix}
$$
L'última fila indica una contradicció ($ 0 = 13 $).
**Solució:** El sistema és **incompatible**.

### 3) Sistema de 4 variables
$$
\begin{pmatrix} 1 & -1 & 2 & -1 & | & -1 \\ 2 & 1 & -2 & -2 & | & -2 \\ -1 & 2 & -4 & 1 & | & 1 \\ 3 & 0 & 0 & -3 & | & -3 \end{pmatrix} \xrightarrow[F_3+F_1, F_4-3F_1]{F_2-2F_1} \begin{pmatrix} 1 & -1 & 2 & -1 & | & -1 \\ 0 & 3 & -6 & 0 & | & 0 \\ 0 & 1 & -2 & 0 & | & 0 \\ 0 & 3 & -6 & 0 & | & 0 \end{pmatrix}
$$
Les files 2, 3 i 4 són proporcionals ($ y - 2z = 0 $). Tenim 2 variables lliures ($ z $ i $ w $).
- $ y = 2z $
- $ x - 2z + 2z - w = -1 \implies x = w - 1 $

**Solució paramètrica:** $(x, y, z, w) = (w - 1, 2z, z, w)$ per a tot $ z, w \in \mathbb{R}$.

### 4) Sistema de 6 variables
$$
\begin{pmatrix} 1 & 3 & -2 & 0 & 2 & 0 & | & 0 \\ 2 & 6 & -5 & -2 & 4 & -3 & | & -1 \\ 0 & 0 & 5 & 10 & 0 & 15 & | & 5 \\ 2 & 6 & 0 & 8 & 4 & 18 & | & 6 \end{pmatrix} \xrightarrow[F_4-2F_1]{F_2-2F_1} \begin{pmatrix} 1 & 3 & -2 & 0 & 2 & 0 & | & 0 \\ 0 & 0 & -1 & -2 & 0 & -3 & | & -1 \\ 0 & 0 & 1 & 2 & 0 & 3 & | & 1 \\ 0 & 0 & 4 & 8 & 0 & 18 & | & 6 \end{pmatrix}
$$
- De la segona i tercera fila, veiem que són la mateixa equació.
- De la quarta: $ F_4 - 4F_2 \implies 6x_6 = 2 \implies x_6 = 1/3 $.
- De la segona: $ x_3 + 2x_4 + 3(1/3) = 1 \implies x_3 = -2x_4 $.
- De la primera: $ x_1 + 3x_2 - 2(-2x_4) + 2x_5 = 0 \implies x_1 = -3x_2 - 4x_4 - 2x_5 $.

**Solució paramètrica:**
$(x_1, \dots, x_6) = (-3\lambda - 4\mu - 2\gamma, \lambda, -2\mu, \mu, \gamma, 1/3)$ amb $\lambda, \mu, \gamma \in \mathbb{R}$.


---

## Exercici 5.21: Resolució de Sistemes Homogenis

### Enunciat

Resoleu el sistemes lineals homogenis següents. Useu l'eliminació gaussiana i doneu la solució en forma paramètrica.
1) $\begin{cases} 2x + 2y + 2z = 0 \\ -2x + 5y + 2z = 0 \\ -7x + 7y + z = 0 \end{cases}$
2) $\begin{cases} 2x - 4y + z + w = 0 \\ x - 5y + 2z = 0 \\ -2y - 2z - w = 0 \\ x + 3y + w = 0 \\ x - 2y - z + w = 0 \end{cases}$
3) $\begin{cases} x_2 - 3x_3 + x_4 = 0 \\ x_1 + x_2 - x_3 + 4x_4 = 0 \\ -2x_1 - 2x_2 + 2x_3 - 8x_4 = 0 \end{cases}$
4) $\begin{cases} 2x_1 + 2x_2 - x_3 + x_5 = 0 \\ -x_1 - x_2 + 2x_3 - 3x_4 + x_5 = 0 \\ x_1 + x_2 + x_3 + 2x_5 = 0 \\ 2x_3 + 2x_4 + 2x_5 = 0 \end{cases}$

### Solució


En un sistema homogeni, el vector de termes independents és sempre nul. Això garanteix que el sistema sempre sigui compatible (com a mínim té la solució trivial).

### 1) Sistema en $ x, y, z $
Matriu i eliminació:
$$
\begin{pmatrix} 2 & 2 & 2 \\ -2 & 5 & 2 \\ -7 & 7 & 1 \end{pmatrix} \xrightarrow[F_3 + \frac{7}{2}F_1]{F_2 + F_1} \begin{pmatrix} 2 & 2 & 2 \\ 0 & 7 & 4 \\ 0 & 14 & 8 \end{pmatrix} \xrightarrow{F_3 - 2F_2} \begin{pmatrix} 2 & 2 & 2 \\ 0 & 7 & 4 \\ 0 & 0 & 0 \end{pmatrix}
$$
Tenim un sistema amb una variable lliure ($ z $).
- $ 7y + 4z = 0 \implies y = -\frac{4}{7}z $
- $ 2x + 2(-\frac{4}{7}z) + 2z = 0 \implies 2x - \frac{8}{7}z + \frac{14}{7}z = 0 \implies 2x + \frac{6}{7}z = 0 \implies x = -\frac{3}{7}z $

**Solució:** $(x, y, z) = \lambda (-3, -4, 7)$ per a tot $\lambda \in \mathbb{R}$.

### 2) Sistema de 5 equacions i 4 variables
$$
\begin{pmatrix} 2 & -4 & 1 & 1 \\ 1 & -5 & 2 & 0 \\ 0 & -2 & -2 & -1 \\ 1 & 3 & 0 & 1 \\ 1 & -2 & -1 & 1 \end{pmatrix} \xrightarrow{\dots} \text{Esglaonada amb 4 pivots}
$$
Després d'aplicar Gauss, s'observa que el rang de la matriu és 4 (igual al nombre d'incògnites).
**Solució:** Només la trivial: $(x, y, z, w) = (0, 0, 0, 0)$.

### 3) Sistema de 3 equacions i 4 variables
$$
\begin{pmatrix} 0 & 1 & -3 & 1 \\ 1 & 1 & -1 & 4 \\ -2 & -2 & 2 & -8 \end{pmatrix} \xrightarrow{F_3 + 2F_2} \begin{pmatrix} 1 & 1 & -1 & 4 \\ 0 & 1 & -3 & 1 \\ 0 & 0 & 0 & 0 \end{pmatrix}
$$
Tenim 2 variables lliures ($ x_3 $ i $ x_4 $).
- $ x_2 = 3x_3 - x_4 $
- $ x_1 + (3x_3 - x_4) - x_3 + 4x_4 = 0 \implies x_1 = -2x_3 - 3x_4 $

**Solució:** $(x_1, x_2, x_3, x_4) = (-2\lambda - 3\mu, 3\lambda - \mu, \lambda, \mu)$ per a tot $\lambda, \mu \in \mathbb{R}$.

### 4) Sistema de 4 equacions i 5 variables
$$
\begin{pmatrix} 2 & 2 & -1 & 0 & 1 \\ -1 & -1 & 2 & -3 & 1 \\ 1 & 1 & 1 & 0 & 2 \\ 0 & 0 & 2 & 2 & 2 \end{pmatrix} \xrightarrow{\text{Gauss}} \begin{pmatrix} 1 & 1 & 1 & 0 & 2 \\ 0 & 0 & 1 & -1 & 1 \\ 0 & 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix}
$$
Tenim 2 variables lliures ($ x_2 $ i $ x_5 $).
- $ x_4 = 0 $
- $ x_3 - x_4 + x_5 = 0 \implies x_3 = -x_5 $
- $ x_1 + x_2 + x_3 + 2x_5 = 0 \implies x_1 + x_2 - x_5 + 2x_5 = 0 \implies x_1 = -x_2 - x_5 $

**Solució:** $(x_1, x_2, x_3, x_4, x_5) = (-\lambda - \mu, \lambda, -\mu, 0, \mu)$ per a tot $\lambda, \mu \in \mathbb{R}$.


---

## Exercici 5.22: Discussió de Sistemes amb Paràmetres

### Enunciat

Discutiu els sistemes següents segons els valors dels paràmetres a $\mathbb{R}$.
1) $\begin{cases} x+y+2z = a \\ x+z = b \\ 2x+y+3z = c \end{cases}$
2) $\begin{cases} bx+y+z = b^2 \\ x-y+z = 1 \\ 3x-y-z = 1 \\ 6x-y+z = 3b \end{cases}$
3) $\begin{cases} ax+y-z+t-u = 0 \\ x+ay+z-t+u = 0 \\ -x+y+az+t-u = 0 \\ x-y+z+at+u = 0 \\ -x+y-z+t+au = 0 \end{cases}$
4) $\begin{cases} x+2y-3z = 4 \\ 3x-y+5z = 2 \\ 4x+y+(a^2-14)z = a+2 \end{cases}$
5) $\begin{cases} x+y = k \\ ax+by = k^2 \\ a^2x+b^2y = k^3 \end{cases}$

### Solució


Discutir un sistema significa determinar per a quins valors dels paràmetres el sistema és compatible (determinat o indeterminat) o incompatible, utilitzant el Teorema de Rouché-Capelli.

---

### 1) Paràmetres $ a, b, c $
Observem que la tercera equació és la suma de les dues primeres ($ F_3 = F_1 + F_2 $):
$(x+y+2z) + (x+z) = 2x+y+3z $.
Per tant:
- Si **$ c = a + b $**: El sistema és **SCI** (Compatible Indeterminat) amb rang 2.
- Si **$ c \neq a + b $**: El sistema és **SI** (Incompatible).

### 2) Paràmetre $ b $
Utilitzant les files que no tenen el paràmetre ($ F_2 $ i $ F_3 $), trobem que $ x=z $ i $ y=2x-1 $. Substituint en $ F_4 $, trobem $ x = (3b-1)/5 $. Finalment, substituint en $ F_1 $, obtenim l'equació $ 2(b-2)^2 = 0 $.
- Si **$ b = 2 $**: El sistema és **SCD** (Compatible Determinat).
- Si **$ b \neq 2 $**: El sistema és **SI** (Incompatible).

### 3) Sistema Homogeni (paràmetre $ a $)
Com que és homogeni, sempre és compatible. El determinant de la matriu de coeficients és $(a-2)^2(a+2)^3 $ o similar (segons l'estructura de simetria).
- Si **$ a \in \{0, 2, -2\}$** (valors on les files es tornen dependents): **SCI**.
- Si **$ a \notin \{0, 2, -2\}$**: **SCD** (només la solució trivial).

### 4) Paràmetre $ a $
Observem que $ F_3 $ té els mateixos coeficients que $ F_1+F_2 $ en $ x $ i $ y $. Sumant les dues primeres: $ 4x+y+2z = 6 $.
Comparem amb $ F_3 $: $ 4x+y+(a^2-14)z = a+2 $.
Igualem els coeficients de $ z $: $ a^2-14 = 2 \implies a^2=16 \implies a = \pm 4 $.
- Si **$ a = 4 $**: $ a^2-14=2 $ i $ a+2=6 $. El sistema és **SCI** (rang 2).
- Si **$ a = -4 $**: $ a^2-14=2 $ però $ a+2=-2 \neq 6 $. El sistema és **SI**.
- Si **$ a \neq \pm 4 $**: El sistema és **SCD**.

### 5) Paràmetres $ a, b, k $
És un sistema estil Vandermonde.
- Si **$ a = b $**:
  - Si **$ k = a $** o **$ k = 0 $**: **SCI**.
  - Si **$ k \neq a, 0 $**: **SI**.
- Si **$ a \neq b $**:
  - Si **$ k = a $**, **$ k = b $** o **$ k = 0 $**: **SCD**.
  - Si **$ k \notin \{a, b, 0\}$**: **SI**.


---

## Exercici 5.23: Propietats dels Determinants

### Enunciat

Suposant que $\begin{vmatrix} a & b & c & d \\ e & f & g & h \\ i & j & k & l \\ m & n & o & p \end{vmatrix} = 5 $, calculeu els determinants següents:
1) $\begin{vmatrix} e & f & g & h \\ i & j & k & l \\ a & b & c & d \\ m & n & o & p \end{vmatrix}$
2) $\begin{vmatrix} -a & -b & -c & -d \\ 2e & 2f & 2g & 2h \\ i & j & k & l \\ m & n & o & p \end{vmatrix}$
3) $\begin{vmatrix} a+e & b+f & c+g & d+h \\ e & f & g & h \\ m & n & o & p \\ i & j & k & l \end{vmatrix}$
4) $\begin{vmatrix} a & b & c & d \\ e-3a & f-3b & g-3c & h-3d \\ i & j & k & l \\ 4m & 4n & 4o & 4p \end{vmatrix}$

### Solució


Per resoldre aquest exercici aplicarem les següents **propietats dels determinants**:
- Si s'intercanvien dues files, el determinant canvia de signe.
- Si una fila es multiplica per un escalar $ k $, el determinant queda multiplicat per $ k $.
- Si a una fila se li suma una combinació lineal d'altres files, el determinant no varia.

---

### 1) Permutació de files
Tenim les files del determinant original en l'ordre $(F_2, F_3, F_1, F_4)$.
Fem els canvis pas a pas per veure el signe:
- Intercanviem $ F_1 \leftrightarrow F_2 $: $(F_2, F_1, F_3, F_4)$ $\to $ Signe $(-)$
- Intercanviem $ F_2 \leftrightarrow F_3 $: $(F_2, F_3, F_1, F_4)$ $\to $ Signe $(-)(-) = (+)$
Com que s'han fet 2 intercanvis, el determinant es manté:
$$
D_1 = (-1)^2 \cdot 5 = \mathbf{5}
$$

### 2) Multiplicació per escalars
- La fila 1 s'ha multiplicat per $-1 $.
- La fila 2 s'ha multiplicat per $ 2 $.
$$
D_2 = (-1) \cdot 2 \cdot 5 = \mathbf{-10}
$$

### 3) Combinació lineal i intercanvi
Primer, restem la segona fila a la primera ($ F_1 \to F_1 - F_2 $). El determinant no varia:
$$
\begin{vmatrix} a & b & c & d \\ e & f & g & h \\ m & n & o & p \\ i & j & k & l \end{vmatrix}
$$
Ara, observem que les files 3 i 4 estan intercanviades respecte l'original:
- Intercanvi $ F_3 \leftrightarrow F_4 $: Signe $(-)$
$$
D_3 = -1 \cdot 5 = \mathbf{-5}
$$

### 4) Operació elemental i constant
- L'operació $ F_2 \to F_2 - 3F_1 $ no modifica el valor del determinant.
- La quarta fila s'ha multiplicat per $ 4 $.
$$
D_4 = 4 \cdot 5 = \mathbf{20}
$$


---

## Exercici 5.24: Valors per Determinant Nul (Valors Propis)

### Enunciat

Trobeu els valors de $\lambda $ per als quals les matrius següents tenen determinant 0.
1) $\begin{pmatrix} \lambda - 1 & -2 \\ 1 & \lambda - 4 \end{pmatrix}$
2) $\begin{pmatrix} \lambda - 6 & 0 & 0 \\ 0 & \lambda & -1 \\ 0 & 4 & \lambda - 4 \end{pmatrix}$
3) $\begin{pmatrix} 3 - \lambda & 1 & 1 \\ 2 & 4 - \lambda & 2 \\ 1 & 1 & 3 - \lambda \end{pmatrix}$

### Solució


El determinant de la matriu ha de ser igual a zero. Això equival a trobar les arrels del polinomi característic (els valors propis de la matriu).

---

### 1) Matriu $ 2 \times 2 $
$$
\det(A) = (\lambda - 1)(\lambda - 4) - (-2)(1) = 0
$$
$$
\lambda^2 - 5\lambda + 4 + 2 = 0 \implies \lambda^2 - 5\lambda + 6 = 0
$$
Resolem l'equació de segon grau:
$$
\lambda = \frac{5 \pm \sqrt{25 - 24}}{2} = \frac{5 \pm 1}{2} \implies \mathbf{\lambda \in \{2, 3\}}
$$

### 2) Matriu $ 3 \times 3 $
Desenvolupem per la primera fila (ja que té dos zeros):
$$
\det(A) = (\lambda - 6) \begin{vmatrix} \lambda & -1 \\ 4 & \lambda - 4 \end{vmatrix} = 0
$$
$$
(\lambda - 6)(\lambda(\lambda - 4) - (-1)(4)) = 0
$$
$$
(\lambda - 6)(\lambda^2 - 4\lambda + 4) = 0
$$
$$
(\lambda - 6)(\lambda - 2)^2 = 0
$$
Els valors són: **$\lambda \in \{2, 6\}$** (on el 2 és una arrel doble).

### 3) Matriu $ 3 \times 3 $ (Simètrica)
Podem simplificar restant la fila 3 a la fila 1 ($ F_1 \to F_1 - F_3 $):
$$
\begin{vmatrix} 2 - \lambda & 0 & \lambda - 2 \\ 2 & 4 - \lambda & 2 \\ 1 & 1 & 3 - \lambda \end{vmatrix} = 0
$$
Treiem factor comú $(\lambda - 2)$ de la primera fila:
$$
(\lambda - 2) \begin{vmatrix} -1 & 0 & 1 \\ 2 & 4 - \lambda & 2 \\ 1 & 1 & 3 - \lambda \end{vmatrix} = 0
$$
Sumem la primera columna a la tercera ($ C_3 \to C_3 + C_1 $):
$$
(\lambda - 2) \begin{vmatrix} -1 & 0 & 0 \\ 2 & 4 - \lambda & 4 \\ 1 & 1 & 4 - \lambda \end{vmatrix} = (\lambda - 2) (-1) ((4-\lambda)^2 - 4) = 0
$$
$$
(2 - \lambda) ((\lambda - 4)^2 - 4) = 0
$$
L'equació $(\lambda - 4)^2 = 4 $ té solucions $\lambda - 4 = 2 \to \lambda = 6 $ i $\lambda - 4 = -2 \to \lambda = 2 $.
Per tant, els valors són: **$\mathbf{\lambda \in \{2, 6\}}$**.


---

## Exercici 5.25: Càlcul de Determinants de Diversos Ordres

### Enunciat

Calculeu els determinants següents:
1) $\begin{vmatrix} 5 & 15 \\ 10 & -20 \end{vmatrix}$
2) $\begin{vmatrix} 2 & 1 & 2 \\ 0 & 3 & -1 \\ 4 & 1 & 1 \end{vmatrix}$
3) $\begin{vmatrix} 3 & -1 & 5 \\ -1 & 2 & 1 \\ -2 & 4 & 3 \end{vmatrix}$
4) $\begin{vmatrix} 4 & 16 & 0 \\ 12 & -8 & 8 \\ 16 & 20 & -4 \end{vmatrix}$
5) $\begin{vmatrix} 0 & 2 & 1 \\ -1 & 3 & 0 \\ 2 & 4 & 3 \end{vmatrix}$
6) $\begin{vmatrix} -1 & 2 & 1 & 2 \\ 1 & 2 & 4 & 1 \\ 2 & 0 & -1 & 3 \\ 3 & 2 & -1 & 0 \end{vmatrix}$
7) $\begin{vmatrix} 0 & -3 & 8 & 2 \\ 8 & 1 & -1 & 6 \\ -4 & 6 & 0 & 9 \\ -7 & 0 & 0 & 14 \end{vmatrix}$
8) $\begin{vmatrix} 1 & -1 & 8 & 4 & 2 \\ 2 & 6 & 0 & -4 & 3 \\ 2 & 0 & 2 & 6 & 2 \\ 0 & 2 & 8 & 0 & 0 \\ 0 & 1 & 1 & 2 & 2 \end{vmatrix}$

### Solució


A continuació es mostren els càlculs per a cada determinant, utilitzant mètodes com la regla de Sarrus, el desenvolupament per adjunts o l'aplicació d'operacions elementals per simplificar.

### 1) Determinant $ 2 \times 2 $
$$
\begin{vmatrix} 5 & 15 \\ 10 & -20 \end{vmatrix} = 5(-20) - 15(10) = -100 - 150 = \mathbf{-250}
$$

### 2) Determinant $ 3 \times 3 $
Desenvolupant per adjunts de la primera columna:
$$
2 \begin{vmatrix} 3 & -1 \\ 1 & 1 \end{vmatrix} - 0 + 4 \begin{vmatrix} 1 & 2 \\ 3 & -1 \end{vmatrix} = 2(3+1) + 4(-1-6) = 8 - 28 = \mathbf{-20}
$$

### 3) Operació elemental
Fem $ F_3 \to F_3 - 2F_2 $:
$$
\begin{vmatrix} 3 & -1 & 5 \\ -1 & 2 & 1 \\ 0 & 0 & 1 \end{vmatrix} = 1 \cdot \begin{vmatrix} 3 & -1 \\ -1 & 2 \end{vmatrix} = 6 - 1 = \mathbf{5}
$$

### 4) Factorització
Traiem un 4 de cada fila: $ 4^3 \cdot \begin{vmatrix} 1 & 4 & 0 \\ 3 & -2 & 2 \\ 4 & 5 & -1 \end{vmatrix}$
$$
64 \cdot [1(2-10) - 4(-3-8)] = 64 \cdot [-8 + 44] = 64 \cdot 36 = \mathbf{2304}
$$

### 5) Desenvolupament per $ F_1 $
$$
0 - 2 \begin{vmatrix} -1 & 0 \\ 2 & 3 \end{vmatrix} + 1 \begin{vmatrix} -1 & 3 \\ 2 & 4 \end{vmatrix} = -2(-3) + 1(-4-6) = 6 - 10 = \mathbf{-4}
$$

### 6) Determinant $ 4 \times 4 $
Fent $ F_2+F_1, F_3+2F_1, F_4+3F_1 $ i desenvolupant per $ C_1 $:
$$
-1 \cdot \begin{vmatrix} 4 & 5 & 3 \\ 4 & 1 & 7 \\ 8 & 2 & 6 \end{vmatrix} = \mathbf{128}
$$

### 7) Determinant $ 4 \times 4 $
Factoritzant el 7 de $ F_4 $ i fent $ C_4 \to C_4 + 2C_1 $:
$$
7 \cdot \begin{vmatrix} 0 & -3 & 8 & 2 \\ 8 & 1 & -1 & 22 \\ -4 & 6 & 0 & 1 \\ -1 & 0 & 0 & 0 \end{vmatrix} = 7 \cdot ( -(-1) \begin{vmatrix} -3 & 8 & 2 \\ 1 & -1 & 22 \\ 6 & 0 & 1 \end{vmatrix} ) = 7 \cdot 1063 = \mathbf{7441}
$$

### 8) Determinant $ 5 \times 5 $
Fent $ C_3 \to C_3 - 4C_2 $ i desenvolupant per $ F_4 $:
$$
2 \cdot \begin{vmatrix} 1 & 12 & 4 & 2 \\ 2 & -24 & -4 & 3 \\ 2 & 2 & 6 & 2 \\ 0 & -3 & 2 & 2 \end{vmatrix} = 2 \cdot (-550) = \mathbf{-1100}
$$


---

## Exercici 5.26: Propietats Algebraiques dels Determinants

### Enunciat

Siguin $ A $ i $ B $ matrius quadrades d'ordre 3 tals que $\det(A) = 10 $ i $\det(B) = 12 $. Calculeu:
1) $\det(AB)$
2) $\det(A^4)$
3) $\det(2B)$
4) $\det(A^t)$
5) $\det(A^{-1})$

### Solució


Per resoldre aquest exercici apliquem les propietats fonamentals dels determinants:
- **Producte:** $\det(AB) = \det(A) \cdot \det(B)$
- **Potència:** $\det(A^k) = (\det A)^k $
- **Escalament:** $\det(k A) = k^n \det(A)$, on $ n $ és l'ordre de la matriu.
- **Transposada:** $\det(A^t) = \det(A)$
- **Inversa:** $\det(A^{-1}) = \frac{1}{\det(A)}$

---

### Resultats:

1. **$\det(AB)$**:
   $$
\det(A) \cdot \det(B) = 10 \cdot 12 = \mathbf{120}
$$

2. **$\det(A^4)$**:
   $$
(\det A)^4 = 10^4 = \mathbf{10000}
$$

3. **$\det(2B)$**:
   Com que l'ordre és $ n=3 $:
   $$
2^3 \cdot \det(B) = 8 \cdot 12 = \mathbf{96}
$$

4. **$\det(A^t)$**:
   $$
\det(A) = \mathbf{10}
$$

5. **$\det(A^{-1})$**:
   $$
\frac{1}{\det(A)} = \frac{1}{10} = \mathbf{0.1}
$$


---

## Exercici 5.27: Demostració d'un Determinant Simètric

### Enunciat

Comproveu que
$$
\begin{vmatrix} a & 1 & 1 & 1 \\ 1 & a & 1 & 1 \\ 1 & 1 & a & 1 \\ 1 & 1 & 1 & a \end{vmatrix} = (a+3)(a-1)^3.
$$

### Solució


Aquest tipus de determinants, on totes les files sumen el mateix, es resolen fàcilment sumant totes les columnes a la primera.

### Pas 1: Sumar totes les columnes a la primera ($ C_1 \to C_1 + C_2 + C_3 + C_4 $)
$$
\begin{vmatrix} a+3 & 1 & 1 & 1 \\ a+3 & a & 1 & 1 \\ a+3 & 1 & a & 1 \\ a+3 & 1 & 1 & a \end{vmatrix}
$$

### Pas 2: Treure factor comú $(a+3)$ de la primera columna
$$
(a+3) \cdot \begin{vmatrix} 1 & 1 & 1 & 1 \\ 1 & a & 1 & 1 \\ 1 & 1 & a & 1 \\ 1 & 1 & 1 & a \end{vmatrix}
$$

### Pas 3: Crear zeros a la primera columna ($ F_2-F_1, F_3-F_1, F_4-F_1 $)
$$
(a+3) \cdot \begin{vmatrix} 1 & 1 & 1 & 1 \\ 0 & a-1 & 0 & 0 \\ 0 & 0 & a-1 & 0 \\ 0 & 0 & 0 & a-1 \end{vmatrix}
$$

### Pas 4: Calcular el determinant de la matriu triangular
Com que la matriu resultant és triangular superior, el seu determinant és el producte dels elements de la diagonal principal:
$$
D = (a+3) \cdot [1 \cdot (a-1) \cdot (a-1) \cdot (a-1)] = \mathbf{(a+3)(a-1)^3}
$$

Quedant així demostrada la igualtat.


---

