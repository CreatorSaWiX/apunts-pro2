---
title: "Solucionari: Tema 8: Derivades parcials i direccionals. Vector Gradient"
author: "Apunts"
---

# Solucionari: Tema 8: Derivades parcials i direccionals. Vector Gradient

*Derivada direccional i parcial. Vector Gradient. Pla tangent a una superfície.*

---

## Exercici 1: Derivades parcials de primer ordre

### Enunciat

Calculeu les derivades parcials de primer ordre de la funció:
  
$$
f(x,y) = (e^x)^{e^y}
$$

### Solució

$$
f(x,y) = (e^x)^{e^y} = e^{x \cdot e^y}
$$

### Derivada parcial respecte a $ x $: $\frac{\partial f}{\partial x}$

Considerem $ y $ com una constant. La derivada de $ e^{u(x)}$ és $ e^{u(x)} \cdot u'(x)$.

$$
\frac{\partial f}{\partial x} = \frac{\partial}{\partial x} (e^{x e^y}) = e^{x e^y} \cdot e^y = (e^x)^{e^y} e^y
$$

### Derivada parcial respecte a $ y $: $\frac{\partial f}{\partial y}$

Considerem $ x $ com una constant.

$$
\frac{\partial f}{\partial y} = \frac{\partial}{\partial y} (e^{x e^y}) = e^{x e^y} \cdot x e^y = (e^x)^{e^y} x e^y
$$


---

## Exercici 2: Derivada direccional

### Enunciat

Donada $ f(x,y) = x^2 + y^2 $, calculeu la derivada direccional de la funció $ f $ en el punt $ P = (2,3)$ segons la direcció del vector $\vec{v} = (3/5, 4/5)$.

### Solució

Com que $ f(x,y) = x^2 + y^2 $ és una funció polinòmica, és de classe $ C^1 $ a tot $\mathbb{R}^2 $. Això ens garanteix que la funció és diferenciable al punt $ P(2,3)$ i podem calcular la derivada direccional mitjançant el gradient.

$$
|\vec{v}| = \sqrt{\left(\frac{3}{5}\right)^2 + \left(\frac{4}{5}\right)^2} = \sqrt{\frac{9}{25} + \frac{16}{25}} = 1 \implies \text{Unitari}
$$

$ f_x = 2x \implies f_x(2,3) = 4 $
$ f_y = 2y \implies f_y(2,3) = 6 $
$$
\nabla f(2,3) = (4, 6)
$$

$$
D_{\vec{v}} f(P) = \nabla f(P) \cdot \vec{v} = (4, 6) \cdot \left(\frac{3}{5}, \frac{4}{5}\right)
$$

$$
D_{\vec{v}} f(2,3) = \frac{12}{5} + \frac{24}{5} = \frac{36}{5} = 7.2
$$


---

## Exercici 3: Derivada direccional amb angle

### Enunciat

Trobar la derivada de la funció $ z = x^2 - y^2 $ en el punt $ M(1,1)$ en la direcció que forma un angle de $\pi/3 $ amb la direcció positiva de l'eix $ OX $.

### Solució

### 1. Condició de diferenciabilitat
Com que $ z = f(x,y) = x^2 - y^2 $ és un polinomi, sabem que $ f \in C^1(\mathbb{R}^2)$. Per tant, és diferenciable al punt $ M(1,1)$ i podem usar la fórmula del gradient.

### 2. Vector director $\vec{v}$
La direcció ve donada per l'angle $\alpha = \pi/3 $. El vector unitari és:
$$
\vec{v} = (\cos \alpha, \sin \alpha) = (\cos(\pi/3), \sin(\pi/3)) = \left(\frac{1}{2}, \frac{\sqrt{3}}{2}\right)
$$

### 3. Gradient $\nabla f(M)$
Calculm les derivades parcials al punt $ M(1,1)$:
* $ f_x = 2x \implies f_x(1,1) = 2 $
* $ f_y = -2y \implies f_y(1,1) = -2 $
$$
\nabla f(1,1) = (2, -2)
$$

### 4. Derivada direccional
Apliquem el producte escalar:
$$
D_{\vec{v}} f(M) = \nabla f(M) \cdot \vec{v} = (2, -2) \cdot \left(\frac{1}{2}, \frac{\sqrt{3}}{2}\right)
$$
$$
D_{\vec{v}} f(1,1) = 1 - \sqrt{3}
$$


---

## Exercici 4: Determinació de paràmetres

### Enunciat

Determineu els valors de $ a, b, c $ tals que la derivada direccional de la funció $ f(x,y,z) = axy^2 + byz + cz^2x^3 $ en el punt $(1, 2, -1)$ tingui un valor màxim de 64 en una direcció paral·lela a l'eix $ OZ $.

### Solució

### 1. Anàlisi del problema
Sabem dues coses fonamentals sobre la derivada direccional màxima:
1. S'assoleix en la direcció del **gradient** $\nabla f(1,2,-1)$.
2. El seu valor és el **mòdul del gradient**: $|
abla f(P)| = 64 $.

Si la direcció ha de ser paral·lela a l'eix $ OZ $, el gradient ha de ser de la forma $(0, 0, k)$. Per tant:
* $ f_x(1, 2, -1) = 0 $
* $ f_y(1, 2, -1) = 0 $
* $|f_z(1, 2, -1)| = 64 $

### 2. Càlcul de les parcials a $ P(1, 2, -1)$
* $ f_x = ay^2 + 3cz^2x^2 \implies f_x(P) = 4a + 3c = 0 $
* $ f_y = 2axy + bz \implies f_y(P) = 4a - b = 0 $
* $ f_z = by + 2czx^3 \implies f_z(P) = 2b - 2c = \pm 64 $

### 3. Resolució del sistema
De les dues primeres equacions obtenim $ c = -4a/3 $ i $ b = 4a $. Substituïm en la tercera:
$$
2(4a) - 2(-4a/3) = \pm 64 \implies 8a + \frac{8a}{3} = \pm 64
$$
$$
\frac{32a}{3} = \pm 64 \implies a = \pm 6
$$

### 4. Solucions
Tenim dues combinacions possibles:
1. **Solució 1**: $ a = 6, b = 24, c = -8 $
2. **Solució 2**: $ a = -6, b = -24, c = 8 $


---

## Exercici 5: Pla tangent i recta normal

### Enunciat

Escriure les equacions del pla tangent i de la recta normal a:
  
a) la superfície $ z = x^2 + y^2 $, en el punt $ M = (1, 2, 5)$;
b) la superfície $ z = \arctan \frac{y}{x}$, en el punt $ M = (1, 1, \frac{\pi}{4})$.

### Solució

### Fonaments teòrics
Per a superfícies en forma explícita $ z = f(x,y)$:
* **Condició**: Si $ f $ és de classe $ C^1 $ al punt, el pla tangent existeix.
* **Pla Tangent**: $ f_x(P)(x-x_0) + f_y(P)(y-y_0) - (z-z_0) = 0 $
* **Recta Normal**: En forma contínua és $\frac{x-x_0}{f_x} = \frac{y-y_0}{f_y} = \frac{z-z_0}{-1}$

---

### Apartat a) $ z = x^2 + y^2 $ a $ M(1, 2, 5)$
1. **Diferenciabilitat**: Funció polinòmica $ implies C^1 $.
2. **Parcials**:
   * $ f_x = 2x \implies f_x(1,2) = 2 $
   * $ f_y = 2y \implies f_y(1,2) = 4 $
3. **Pla tangent**:
   $ 2(x - 1) + 4(y - 2) - (z - 5) = 0 \implies 2x - 2 + 4y - 8 - z + 5 = 0 $
   **$$
2x + 4y - z - 5 = 0
$$**
4. **Recta normal**:
   **$$
\frac{x-1}{2} = \frac{y-2}{4} = \frac{z-5}{-1}
$$**

---

### Apartat b) $ z = \arctan(y/x)$ a $ M(1, 1, \pi/4)$
1. **Diferenciabilitat**: Funció $ C^1 $ en un entorn de $(1,1)$.
2. **Parcials**:
   * $ f_x = \frac{1}{1+(y/x)^2} \cdot \frac{-y}{x^2} = \frac{-y}{x^2+y^2} \implies f_x(1,1) = -1/2 $
   * $ f_y = \frac{1}{1+(y/x)^2} \cdot \frac{1}{x} = \frac{x}{x^2+y^2} \implies f_y(1,1) = 1/2 $
3. **Pla tangent**:
   $-\frac{1}{2}(x - 1) + \frac{1}{2}(y - 1) - (z - \pi/4) = 0 $
   Multiplicant per -2: $(x-1) - (y-1) + 2(z - \pi/4) = 0 $
   **$$
x - y + 2z - \pi/2 = 0
$$**
4. **Recta normal**:
   **$$
\frac{x-1}{-1/2} = \frac{y-1}{1/2} = \frac{z-\pi/4}{-1}
$$**


---

## Exercici 6: Pla tangent paral·lel a XY

### Enunciat

Sigui $ f(x,y) = 4x + 2y - x^2 + xy - y^2 $. Trobeu els punts de la superfície $ z = f(x,y)$ tals que el seu pla tangent sigui paral·lel al pla $ XY $.

### Solució

### 1. Condició geomètrica
Si el pla tangent a la superfície $ z = f(x,y)$ ha de ser paral·lel al pla $ XY $ (horitzontal), el seu vector normal $(f_x, f_y, -1)$ ha de ser paral·lel al vector $\vec{k} = (0,0,1)$.

Això només passa si les derivades parcials en el punt són nul·les:
$$
f_x(x,y) = 0 \quad \text{i} \quad f_y(x,y) = 0
$$

### 2. Condició de diferenciabilitat
Com que $ f(x,y)$ és un polinomi de segon grau, és de classe $ C^1 $ a tot $\mathbb{R}^2 $, per tant el pla tangent existeix a tots els punts de la superfície.

### 3. Resolució del sistema
Igualem les parcials a zero:
1. $ f_x = 4 - 2x + y = 0 \implies y = 2x - 4 $
2. $ f_y = 2 + x - 2y = 0 $

Substituint la primera en la segona:
$$
2 + x - 2(2x - 4) = 0 \implies 2 + x - 4x + 8 = 0
$$
$$
10 - 3x = 0 \implies x = 10/3
$$

Trobem la $ y $: $ y = 2(10/3) - 4 = 20/3 - 12/3 = 8/3 $.

### 4. Coordenada $ z $ del punt
Substituïm $(10/3, 8/3)$ a la funció:
$$
z = f(10/3, 8/3) = \dots = 28/3
$$

**Conclusió:** El punt buscat és **$ P = (10/3, 8/3, 28/3)$**.


---

## Exercici 7: Càlcul de gradients

### Enunciat

Trobeu el gradient de les funcions següents:
  
a) $ f(x,y,z) = \ln(z + \sin(y^2 - x))$ en el punt $(1, -1, 1)$;
b) $ f(x,y,z) = e^{3x+y} \sin(5z)$ en el punt $(0, 0, \pi/6)$;
c) $ f(x,y,z) = \int_x^{xy+z^2} \frac{\sin t}{t} dt $ en el punt $(\pi/2, 1, 0)$.

### Solució

### Apartat a) $ f(x,y,z) = \ln(z + \sin(y^2 - x))$ a $(1, -1, 1)$
1. **Derivades parcials**:
   * $ f_x = \frac{-\cos(y^2-x)}{z + \sin(y^2-x)} \implies f_x(1,-1,1) = \frac{-\cos(0)}{1 + \sin(0)} = -1 $
   * $ f_y = \frac{2y \cos(y^2-x)}{z + \sin(y^2-x)} \implies f_y(1,-1,1) = \frac{2(-1)\cos(0)}{1} = -2 $
   * $ f_z = \frac{1}{z + \sin(y^2-x)} \implies f_z(1,-1,1) = \frac{1}{1} = 1 $

**$$
\nabla f(1,-1,1) = (-1, -2, 1)
$$**

---

### Apartat b) $ f(x,y,z) = e^{3x+y} \sin(5z)$ a $(0, 0, \pi/6)$
1. **Derivades parcials**:
   * $ f_x = 3e^{3x+y} \sin(5z) \implies f_x(0,0,\pi/6) = 3(1)\sin(5\pi/6) = 3 \cdot \frac{1}{2} = 3/2 $
   * $ f_y = e^{3x+y} \sin(5z) \implies f_y(0,0,\pi/6) = 1 \cdot \frac{1}{2} = 1/2 $
   * $ f_z = 5e^{3x+y} \cos(5z) \implies f_z(0,0,\pi/6) = 5(1)\cos(5\pi/6) = 5 \cdot \left(-\frac{\sqrt{3}}{2}\right) = -\frac{5\sqrt{3}}{2}$

**$$
\nabla f(0,0,\pi/6) = (3/2, 1/2, -5\sqrt{3}/2)
$$**

---

### Apartat c) $ f(x,y,z) = \int_x^{xy+z^2} \frac{\sin t}{t} dt $ a $(\pi/2, 1, 0)$
Usem el Teorema Fonamental del Càlcul: $\frac{\partial}{\partial u} \int_a^u g(t) dt = g(u)$.
1. **Derivades parcials**:
   * $ f_x = \frac{\sin(xy+z^2)}{xy+z^2} \cdot y - \frac{\sin x}{x} \implies f_x(\pi/2, 1, 0) = \frac{\sin(\pi/2)}{\pi/2} \cdot 1 - \frac{\sin(\pi/2)}{\pi/2} = 0 $
   * $ f_y = \frac{\sin(xy+z^2)}{xy+z^2} \cdot x \implies f_y(\pi/2, 1, 0) = \frac{\sin(\pi/2)}{\pi/2} \cdot \frac{\pi}{2} = 1 $
   * $ f_z = \frac{\sin(xy+z^2)}{xy+z^2} \cdot 2z \implies f_z(\pi/2, 1, 0) = \dots \cdot 0 = 0 $

**$$
\nabla f(\pi/2, 1, 0) = (0, 1, 0)
$$**


---

## Exercici 8: Propietats del gradient

### Enunciat

Trobar la derivada de la funció $ z = x^2 - xy + y^2 $ en el punt $ M(1,1)$ en la direcció que forma un angle $\alpha $ amb la direcció positiva de l'eix $ OX $. En quina direcció aquesta derivada:
  
a) assoleix el seu valor màxim?
b) assoleix el seu valor mínim?
c) és igual a 0?

### Solució

### 1. Condició de diferenciabilitat
Com que $ f(x,y) = x^2 - xy + y^2 $ és una funció polinòmica, és de classe $ C^1 $ a tot $\mathbb{R}^2 $. Això ens permet usar les propietats del gradient per trobar les direccions de creixement.

### 2. Càlcul del gradient a $ M(1,1)$
* $ f_x = 2x - y \implies f_x(1,1) = 2(1) - 1 = 1 $
* $ f_y = -x + 2y \implies f_y(1,1) = -1 + 2(1) = 1 $
$$
\nabla f(1,1) = (1, 1)
$$

### 3. Resolució dels apartats
La derivada direccional en funció de l'angle $\alpha $ és:
$$
D_{\alpha} f(M) = \nabla f(M) \cdot (\cos \alpha, \sin \alpha) = \cos \alpha + \sin \alpha
$$

### a) Valor màxim
S'assoleix en la direcció del gradient $\nabla f = (1,1)$.
Per tant, $\tan \alpha = \frac{1}{1} = 1 \implies \mathbf{\alpha = \pi/4}$ (45°).
*Valor màxim*: $\|\nabla f\| = \sqrt{1^2+1^2} = \sqrt{2}$.

### b) Valor mínim
S'assoleix en la direcció oposada al gradient $-\nabla f = (-1, -1)$.
Això correspon a $\mathbf{\alpha = 5\pi/4}$ (225°).
*Valor mínim*: $-\|\nabla f\| = -\sqrt{2}$.

### c) Derivada igual a 0
S'assoleix en les direccions ortogonals al gradient. Si el gradient és $(1,1)$, els vectors perpendiculars són $(1,-1)$ i $(-1,1)$.
Això correspon als angles:
* $\tan \alpha = -1 \implies \mathbf{\alpha = 3\pi/4}$ (135°) i $\mathbf{\alpha = 7\pi/4}$ (315°).


---

## Exercici 9: Corbes de nivell i direccions de creixement

### Enunciat

Considereu la funció $ f(x,y) = x^2 + (y - 1)^2 - 1 $.
  
a) Feu un esboç de les corbes de nivell de $ z = f(x,y)$ corresponents als nivells $ z = -2, -1, 0, 3 $.
b) Quina és la direcció en la qual $ f(x,y)$ creix més ràpidament en el punt $ P = (-1,3)$? Trobeu la derivada direccional en aquesta direcció.
c) Quina és la direcció en la qual $ f(x,y)$ decreix més ràpidament en el punt $ P = (-1,3)$? Trobeu la derivada direccional en aquesta direcció.
d) Quina és la direcció en la qual $ f(x,y)$ és constant en el punt $ P = (-1,3)$? Trobeu la derivada direccional en aquesta direcció.

### Solució

### Apartat a) Esboç de les corbes de nivell
L'equació de les corbes de nivell $ k $ és:
$$
x^2 + (y-1)^2 - 1 = k \implies x^2 + (y-1)^2 = k + 1
$$
Això representa circumferències centrades al punt $(0,1)$ amb radi $ R = \sqrt{k+1}$.

* **$ k = -2 $**: $ x^2 + (y-1)^2 = -1 $. No existeix cap punt (radi imaginari).
* **$ k = -1 $**: $ x^2 + (y-1)^2 = 0 $. És el punt $(0,1)$, que és el mínim de la funció.
* **$ k = 0 $**: $ x^2 + (y-1)^2 = 1 $. Circumferència de radi 1.
* **$ k = 3 $**: $ x^2 + (y-1)^2 = 4 $. Circumferència de radi 2.

---

### Càlcul del gradient a $ P(-1,3)$
Primer comprovem que $ f $ és de classe $ C^1 $ (és polinòmica).
* $ f_x = 2x \implies f_x(-1,3) = -2 $
* $ f_y = 2(y-1) \implies f_y(-1,3) = 4 $
$$
\nabla f(-1,3) = (-2, 4)
$$

---

### Apartat b) Creixement màxim
Es produeix en la direcció del gradient: **$\vec{v} = (-2, 4)$**.
El valor de la derivada en aquesta direcció és el mòdul del gradient:
$$
D_{\vec{v}} f(P) = \|\nabla f(P)\| = \sqrt{(-2)^2 + 4^2} = \sqrt{20} = 2\sqrt{5}
$$

---

### Apartat c) Decreixement màxim
Es produeix en la direcció oposada al gradient: **$\vec{v} = (2, -4)$**.
El valor de la derivada és:
$$
D_{\vec{v}} f(P) = -\|\nabla f(P)\| = -2\sqrt{5}
$$

---

### Apartat d) Direcció constant
Es produeix en la direcció tangent a la corba de nivell (direccions perpendiculars al gradient).
Si $\nabla f = (-2, 4)$, els vectors perpendiculars són **$(4, 2)$** i **$(-4, -2)$**.
El valor de la derivada en aquestes direccions és **0**.


---

## Exercici 10: Pla tangent i recta normal (II)

### Enunciat

Calculeu la recta normal i el pla tangent a:
  
a) la superfície $ z = \frac{2xy}{x^2 + y}$ en el punt $(2, -2, -4)$;
b) la superfície $ z = \sin x + 2\cos y $ en el punt $(\pi/2, 0, 3)$.

### Solució

### Fonaments
Recordem que per a una superfície $ z = f(x,y)$, el vector normal al pla tangent és $(f_x, f_y, -1)$.

---

### Apartat a) $ z = \frac{2xy}{x^2 + y}$ a $(2, -2, -4)$
1. **Derivades parcials**:
   * $ f_x = \frac{2y(x^2+y) - 2x(2xy)}{(x^2+y)^2} = \frac{2y^2 - 2x^2y}{(x^2+y)^2} \implies f_x(2,-2) = \frac{8 + 16}{(4-2)^2} = \frac{24}{4} = 6 $
   * $ f_y = \frac{2x(x^2+y) - 2xy}{(x^2+y)^2} = \frac{2x^3}{(x^2+y)^2} \implies f_y(2,-2) = \frac{16}{4} = 4 $

2. **Pla Tangent**:
   $ 6(x-2) + 4(y+2) - (z+4) = 0 \implies 6x - 12 + 4y + 8 - z - 4 = 0 $
   **$$
6x + 4y - z - 8 = 0
$$**

3. **Recta Normal**:
   **$$
\frac{x-2}{6} = \frac{y+2}{4} = \frac{z+4}{-1}
$$**

---

### Apartat b) $ z = \sin x + 2\cos y $ a $(\pi/2, 0, 3)$
1. **Derivades parcials**:
   * $ f_x = \cos x \implies f_x(\pi/2, 0) = 0 $
   * $ f_y = -2\sin y \implies f_y(\pi/2, 0) = 0 $

2. **Pla Tangent**:
   $ 0(x-\pi/2) + 0(y-0) - (z-3) = 0 $
   **$$
z = 3
$$** (Pla horitzontal)

3. **Recta Normal**:
   Com que $ f_x=0 $ i $ f_y=0 $, el vector director de la normal és $(0,0,-1)$, una recta vertical:
   **$$
x = \pi/2, \quad y = 0
$$**


---

