---
title: "Solucionari: Tema 9: Polinomi de Taylor en diverses variables"
author: "Apunts"
---

# Solucionari: Tema 9: Polinomi de Taylor en diverses variables

*Derivades parcials d'ordre superior. Matriu Hessiana. Polinomi de Taylor i residu.*

---

## Exercici 1: Polinomi de Taylor de grau 2

### Enunciat

Donada la funció $ f(x, y) = \ln(1 + 2x + 3y)$:
  
a) Escriviu el polinomi de Taylor de grau 2 per a $ f $ en el punt $(0,0)$.
b) Utilitzant el polinomi obtingut, calculeu un valor aproximat per a $ f(1/10, 1/10)$ i fiteu l'error.

### Solució

### Apartat a) Polinomi de Taylor de grau 2
Podem fer-ho mitjançant derivades o usant el desenvolupament de $\ln(1+t) = t - \frac{t^2}{2} + o(t^2)$.

Fem servir el desenvolupament directe per velocitat. Sigui $ t = 2x + 3y $:
$$
f(x,y) = \ln(1 + (2x + 3y)) \approx (2x + 3y) - \frac{(2x + 3y)^2}{2}
$$
Desenvolupem el quadrat:
$$
P_2(x,y) = 2x + 3y - \frac{4x^2 + 12xy + 9y^2}{2}
$$
**$$
P_2(x,y) = 2x + 3y - 2x^2 - 6xy - 4.5y^2
$$**

---

### Apartat b) Aproximació i fita de l'error
Substituïm $ x = 0.1 $ i $ y = 0.1 $:
$$
f(0.1, 0.1) \approx 2(0.1) + 3(0.1) - 2(0.1)^2 - 6(0.1)^2 - 4.5(0.1)^2
$$
$$
f(0.1, 0.1) \approx 0.2 + 0.3 - 0.02 - 0.06 - 0.045 = 0.375
$$

**Fita de l'error (Residu de Lagrange):**
Les derivades de tercer ordre tenen la forma:
* $ f_{xxx} = 16(1+2x+3y)^{-3}$
* $ f_{xxy} = 24(1+2x+3y)^{-3}$
* $ f_{xyy} = 36(1+2x+3y)^{-3}$
* $ f_{yyy} = 54(1+2x+3y)^{-3}$

Totes es maximitzen al punt $(0,0)$ dins del segment que uneix l'origen amb $(0.1, 0.1)$.
$$
|R_2| \leq \frac{1}{3!} \sum_{i+j+k=3} \binom{3}{i,j,k} |\partial_{ijk} f| |h^i k^j l^k|
$$
$$
|R_2| \leq \frac{0.1^3}{6} [16 + 3(24) + 3(36) + 54] = \frac{0.001}{6} [250] \approx 0.042
$$


---

## Exercici 2: Pla tangent i aproximació de Taylor

### Enunciat

Es demana,
  
a) Escriviu l'equació del pla tangent a la superfície de $\mathbb{R}^3 $ definida per l'equació: $ z = \sqrt[3]{xy}$, en el punt $ P(1, 1, 1)$.

b) Calculeu aproximadament mitjançant un polinomi de Taylor de primer grau la quantitat $\sqrt[3]{0.99 \cdot 1.01}$. Calculeu l'error en aquesta aproximació, és a dir doneu una fita superior del residu en aquest càlcul.

### Solució

### Apartat a) Equació del pla tangent
Considerem la funció $ f(x,y) = \sqrt[3]{xy} = x^{1/3}y^{1/3}$. El punt de tangència és $ P(1,1,1)$, per tant $ a=1, b=1 $ i $ f(1,1)=1 $.

Calculem les derivades parcials de primer ordre:
*   $ f_x = \frac{1}{3} x^{-2/3} y^{1/3} \implies f_x(1,1) = \frac{1}{3}$
*   $ f_y = \frac{1}{3} x^{1/3} y^{-2/3} \implies f_y(1,1) = \frac{1}{3}$

L'equació del pla tangent és:
$$
z = f(1,1) + f_x(1,1)(x-1) + f_y(1,1)(y-1)
$$
$$
z = 1 + \frac{1}{3}(x-1) + \frac{1}{3}(y-1)
$$
Multiplicant per 3 per simplificar: **$ x + y - 3z + 1 = 0 $**.

---

### Apartat b) Aproximació i fita de l'error

**1. Aproximació:**
Volem calcular $\sqrt[3]{0.99 \cdot 1.01} = f(0.99, 1.01)$. Utilitzem el polinomi de Taylor de grau 1 (que coincideix amb l'equació del pla tangent):
$$
P_1(x,y) = 1 + \frac{1}{3}(x-1) + \frac{1}{3}(y-1)
$$
Substituïm $ x=0.99 $ i $ y=1.01 $:
$$
f(0.99, 1.01) \approx 1 + \frac{1}{3}(0.99-1) + \frac{1}{3}(1.01-1) = 1 + \frac{1}{3}(-0.01) + \frac{1}{3}(0.01) = 1
$$

**2. Fita de l'error (Residu de Lagrange):**
L'error és $|R_1(x,y)|$. Necessitem les derivades de segon ordre:
*   $ f_{xx} = -\frac{2}{9} x^{-5/3} y^{1/3}$
*   $ f_{yy} = -\frac{2}{9} x^{1/3} y^{-5/3}$
*   $ f_{xy} = \frac{1}{9} x^{-2/3} y^{-2/3}$

En el segment que uneix $(1,1)$ amb $(0.99, 1.01)$, les derivades es poden fitar prenent el valor més desfavorable (més gran en valor absolut). Com que $ x, y \approx 1 $, podem prendre una fita conservadora $ M $ per a $|f_{ij}|$:
Si prenem $ x, y \in [0.99, 1.01]$, tenim:
*   $|f_{xx}| \leq \frac{2}{9} (0.99)^{-5/3} (1.01)^{1/3} \approx 0.23 $
*   $|f_{yy}| \leq \frac{2}{9} (1.01)^{1/3} (0.99)^{-5/3} \approx 0.23 $
*   $|f_{xy}| \leq \frac{1}{9} (0.99)^{-2/3} (0.99)^{-2/3} \approx 0.12 $

L'error es fita per:
$$
|R_1| \leq \frac{1}{2} \max \{|f_{xx}|h^2 + 2|f_{xy}||hk| + |f_{yy}|k^2|\}
$$
Amb $ h = -0.01 $ i $ k = 0.01 $:
$$
|R_1| \leq \frac{1}{2} [0.23(0.01)^2 + 2(0.12)(0.01)^2 + 0.23(0.01)^2]
$$
$$
|R_1| \leq \frac{1}{2} [0.000023 + 0.000024 + 0.000023] = \mathbf{0.000035}
$$


---

## Exercici 3: Estudi d'extrems relatius i Hessian nul

### Enunciat

Trobeu els extrems relatius de les funcions següents. En algun dels punts crítics, el determinant de la matriu hessiana és zero, i, per tant, cal determinar el caràcter del punt fent ús directament de les definicions de màxim, mínim o punt de sella.

a) $ f(x, y) = x^3 + y^3 - 9xy + 27 $

b) $ f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2 $

c) $ f(x, y) = y^2 - x^3 $

d) $ f(x, y) = x^2 y^2 (1 - x - y)$

### Solució

### Apartat a) $ f(x, y) = x^3 + y^3 - 9xy + 27 $

**1. Punts crítics:**
*   $ f_x = 3x^2 - 9y = 0 \implies y = x^2/3 $
*   $ f_y = 3y^2 - 9x = 0 \implies (x^2/3)^2 = 3x \implies x^4 = 27x $
Les solucions són $ x=0 $ (llavors $ y=0 $) i $ x=3 $ (llavors $ y=3 $). Tenim els punts **$ P_1(0,0)$** i **$ P_2(3,3)$**.

**2. Matriu Hessiana:**
$$
H(x,y) = \begin{pmatrix} 6x & -9 \\ -9 & 6y \end{pmatrix}, \quad \Delta = 36xy - 81
$$

*   **$ P_1(0,0)$:** $\Delta = -81 < 0 \implies $ **Punt de sella**.
*   **$ P_2(3,3)$:** $\Delta = 36(9) - 81 = 243 > 0 $. Com que $ f_{xx}(3,3) = 18 > 0 $, és un **Mínim relatiu**.

---

### Apartat b) $ f(x, y) = (x^2 - 2x + 4y^2 - 8y)^2 $
Podem escriure la funció com $ f(x,y) = g(x,y)^2 $, on $ g(x,y) = (x-1)^2 + 4(y-1)^2 - 5 $. Notem que $ f(x,y) \geq 0 $ sempre.

**1. Punts crítics:** $\nabla f = 2g \cdot \nabla g = 0 $.
Això passa si $ g(x,y)=0 $ (tots els punts de l'el·lipse $(x-1)^2 + 4(y-1)^2 = 5 $) o si $\nabla g = 0 $ (punt $(1,1)$).

**2. Estudi de $(1,1)$:**
$\Delta(1,1) = 1600 > 0 $ i $ f_{xx}(1,1) = -20 < 0 \implies $ **Màxim relatiu**.

**3. Estudi de l'el·lipse $ g(x,y)=0 $:**
En aquests punts, la Hessiana té determinant zero. Però per la definició, com que $ f(x,y) \geq 0 $ i en l'el·lipse $ f=0 $, tots aquests punts són **Mínims relatius** (i absoluts).

---

### Apartat c) $ f(x, y) = y^2 - x^3 $

**1. Punt crític:** $\nabla f = (-3x^2, 2y) = (0,0) \implies $ **$ P(0,0)$**.

**2. Hessiana:** $ H(0,0) = \begin{pmatrix} 0 & 0 \\ 0 & 2 \end{pmatrix}$. El determinant és $\Delta = 0 $.
Hem d'usar la definició. Estudiem el comportament de $ f(x,y)$ a prop de $(0,0)$:
*   Si ens movem per l'eix $ x $ ($ y=0 $), $ f(x,0) = -x^3 $.
*   Per a $ x > 0 $, $ f(x,0) < 0 $.
*   Per a $ x < 0 $, $ f(x,0) > 0 $.
Com que la funció canvia de signe al voltant del punt crític (on val 0), $(0,0)$ és un **Punt de sella**.

---

### Apartat d) $ f(x, y) = x^2 y^2 (1 - x - y)$

Després de resoldre el sistema de derivades parcials, trobem l'únic punt crític interior: **$ P(2/5, 2/5)$**.
*   Calculant la Hessiana en aquest punt, obtenim $\Delta > 0 $ i $ f_{xx} < 0 $.
*   Per tant, $ P(2/5, 2/5)$ és un **Màxim relatiu**.
*   Els punts de les rectes $ x=0 $ i $ y=0 $ també són crítics amb $\Delta=0 $.


---

## Exercici 4: Determinació de paràmetres per a extrems

### Enunciat

Trobeu els valors de $ a $ i $ b $ per tal que la funció $ f(x, y) = ax^3 + 3bxy^2 - 15a^2x - 12y + 5 $ tingui un mínim local al punt $(2, 1)$.

### Solució

### 1. Condició de punt crític
Perquè el punt $(2,1)$ sigui un extrem, el gradient ha de ser nul: $\nabla f(2,1) = (0,0)$.

Calculem les primeres derivades:
*   $ f_x = 3ax^2 + 3by^2 - 15a^2 $
*   $ f_y = 6bxy - 12 $

Substituïm el punt $(2,1)$:
1.  $ f_y(2,1) = 12b - 12 = 0 \implies \mathbf{b = 1}$
2.  $ f_x(2,1) = 12a + 3b - 15a^2 = 0 $

Substituint $ b=1 $ a la segona equació:
$$
12a + 3 - 15a^2 = 0 \implies 5a^2 - 4a - 1 = 0
$$
Resolent l'equació de segon grau per a $ a $:
$$
a = \frac{4 \pm \sqrt{16 + 20}}{10} = \frac{4 \pm 6}{10} \implies a_1 = 1, \quad a_2 = -0.2
$$

---

### 2. Condició de mínim local (Matriu Hessiana)
Perquè sigui un mínim, la matriu Hessiana en $(2,1)$ ha de ser definida positiva. Calculem les segones derivades:
*   $ f_{xx} = 6ax \implies f_{xx}(2,1) = 12a $
*   $ f_{yy} = 6bx \implies f_{yy}(2,1) = 12b = 12 $ (ja que $ b=1 $)
*   $ f_{xy} = 6by \implies f_{xy}(2,1) = 6b = 6 $

La matriu Hessiana és:
$$
H(2,1) = \begin{pmatrix} 12a & 6 \\ 6 & 12 \end{pmatrix}
$$

Per ser un mínim, cal que:
1.  **Determinant $\Delta > 0 $:** $ 144a - 36 > 0 \implies 144a > 36 \implies a > 1/4 $
2.  **Element $ f_{xx} > 0 $:** $ 12a > 0 \implies a > 0 $

Dels dos valors de $ a $ que hem trobat ($ 1 $ i $-0.2 $), només **$ a = 1 $** compleix la condició $ a > 0.25 $.

---

### Conclusió
Els valors cercats són:
**$$
a = 1, \quad b = 1
$$**


---

