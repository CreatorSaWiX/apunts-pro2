---
title: "Solucionari: Tema 10: Optimització de funcions de diverses variables"
author: "Apunts"
---

# Solucionari: Tema 10: Optimització de funcions de diverses variables

*Weierstrass. Multiplicadors de Lagrange. Extrems relatius, condicionats i absoluts.*

---

## Exercici 1: Extrems condicionats

### Enunciat

Estudieu els extrems de la funció  $f(x,y) = x^2 + y^2$  quan les variables  $(x,y)$  estan lligades per la condició:
  

$$
y + x^2 = 1
$$



### Solució

Per resoldre aquest problema d'extrems condicionats, podem utilitzar dos camins: la substitució directa o el mètode dels multiplicadors de Lagrange.

### Mètode 1: Substitució directa

Aquest mètode és útil quan podem aïllar fàcilment una variable de la restricció.

De la condició  $y + x^2 = 1$ , aïllem  $x^2$ :



$$
x^2 = 1 - y
$$



Substituïm aquesta expressió a la funció original  $f(x,y) = x^2 + y^2$ :



$$
h(y) = (1 - y) + y^2 = y^2 - y + 1
$$



Ara tenim una funció d'una sola variable. Busquem on s'anul·la la seva derivada:



$$
h'(y) = 2y - 1 = 0 \implies y = 1/2
$$



Com que  $h''(y) = 2 > 0$ , es tracta d'un **mínim**.

Si  $y = 1/2 \implies x^2 = 1 - 1/2 = 1/2 \implies x = \pm \frac{1}{\sqrt{2}}$ .

També cal revisar els extrems del domini de la variable  $y$ . Com que  $x^2 = 1-y$  i  $x^2 \geq 0$ , tenim que  $y \leq 1$ . En el límit  $y=1$ , obtenim  $x=0$ , que ens dona el punt  $(0,1)$ .

---

### Mètode 2: Multiplicadors de Lagrange
Aquest mètode consisteix a buscar els punts on el gradient de la funció  $f$  és paral·lel al gradient de la restricció  $g$ .

1. **Definim la funció objectiu**:  $f(x,y) = x^2 + y^2$ 
2. **Definim la restricció** (igualada a zero):  $g(x,y) = y + x^2 - 1 = 0$ 
3. **Construïm la funció de Lagrange** ( $L = f - \lambda g$ ):


$$
L(x, y, \lambda) = \underbrace{x^2 + y^2}_{f} - \lambda \underbrace{(y + x^2 - 1)}_{g}
$$



Busquem els punts on el gradient de  $L$  és zero:
1.  $\frac{\partial L}{\partial x} = 2x - 2\lambda x = 2x(1 - \lambda) = 0$ 
2.  $\frac{\partial L}{\partial y} = 2y - \lambda = 0$ 
3.  $y + x^2 - 1 = 0$ 

De la primera equació tenim dues possibilitats:
- **Cas 1:  $x = 0$ **
  Substituint a la condició (3):  $y + 0 = 1 \implies y = 1$ .
  D'on  $\lambda = 2(1) = 2$ . Obtenim el punt ** $(0, 1)$ **.
- **Cas 2:  $\lambda = 1$ **
  Substituint a la segona equació:  $2y - 1 = 0 \implies y = 1/2$ .
  Substituint a la condició (3):  $1/2 + x^2 = 1 \implies x^2 = 1/2 \implies x = \pm \frac{1}{\sqrt{2}}$ .
  Obtenim els punts ** $(\frac{1}{\sqrt{2}}, \frac{1}{2})$ ** i ** $(-\frac{1}{\sqrt{2}}, \frac{1}{2})$ **.

### Conclusió
- Els punts  $(\pm \frac{1}{\sqrt{2}}, \frac{1}{2})$  són **mínims relatius** amb valor  $f = 3/4$ .
- El punt  $(0, 1)$  és un **màxim relatiu** amb valor  $f = 1$ .

---

## Exercici 2: Extrems condicionats (I)

### Enunciat

Determineu els extrems condicionats de les funcions següents:

a)  $f(x,y) = x + 2y$ , si  $x^2 + y^2 = 5$ 

b)  $f(x,y,z) = x^2 + y^2 + z^2$ , si  $\begin{cases} x^2 + y^2 = 1 \\ x + y + z = 1 \end{cases}$ 

### Solució

### Apartat a)  $f(x,y) = x + 2y$  amb  $x^2 + y^2 = 5$ 

**1. Definició del sistema de Lagrange**
Tenim la funció objectiu  $f(x,y) = x + 2y$  i la restricció  $g(x,y) = x^2 + y^2 - 5 = 0$ .
Construïm la funció de Lagrange  $L(x,y,\lambda) = f - \lambda g$ :


$$
L(x,y,\lambda) = (x + 2y) - \lambda(x^2 + y^2 - 5)
$$



**2. Càlcul de punts crítics**
Busquem on s'anul·la el gradient de  $L$ :
1.   $\frac{\partial L}{\partial x} = 1 - 2\lambda x = 0 \implies 1 = 2\lambda x$ 
2.   $\frac{\partial L}{\partial y} = 2 - 2\lambda y = 0 \implies 2 = 2\lambda y$ 
3.   $\frac{\partial L}{\partial \lambda} = -(x^2 + y^2 - 5) = 0 \implies x^2 + y^2 = 5$ 

De les equacions (1) i (2), podem aïllar  $\lambda$ :
 $\lambda = \frac{1}{2x} = \frac{2}{2y} \implies 2y = 4x \implies \mathbf{y = 2x}$ 

**3. Substitució en la restricció**
Substituïm  $y = 2x$  a l'equació (3):


$$
x^2 + (2x)^2 = 5 \implies 5x^2 = 5 \implies x^2 = 1 \implies \mathbf{x = \pm 1}
$$


- Si  $x = 1 \implies y = 2(1) = 2$ . Punt ** $(1, 2)$ **. Valor:  $f(1,2) = 1 + 2(2) = \mathbf{5}$ .
- Si  $x = -1 \implies y = 2(-1) = -2$ . Punt ** $(-1, -2)$ **. Valor:  $f(-1,-2) = -1 + 2(-2) = \mathbf{-5}$ .

**Conclusió a):** El punt  $(1, 2)$  és un **màxim condicionat** i  $(-1, -2)$  és un **mínim condicionat**.

---

### Apartat b)  $f(x,y,z) = x^2 + y^2 + z^2$  amb dues restriccions
 $g_1 = x^2 + y^2 - 1 = 0$ 

 $g_2 = x + y + z - 1 = 0$ 

**1. Simplificació del problema**
Com que a la frontera  $x^2 + y^2 = 1$ , la funció objectiu esdevé:



$$
f(x,y,z) = (x^2 + y^2) + z^2 = 1 + z^2
$$



Volem minimitzar/maximitzar  $z^2$ . De la segona restricció sabem que  $z = 1 - x - y$ .
Per tant, el problema es redueix a optimitzar la funció de dues variables:



$$
h(x,y) = (1 - x - y)^2 \quad \text{subjecte a } x^2 + y^2 = 1
$$



**2. Mètode de Lagrange per a  $h(x,y)$ **
Definim  $L(x,y,\mu) = (1-x-y)^2 - \mu(x^2 + y^2 - 1)$ . Calculem les derivades:
1.   $\frac{\partial L}{\partial x} = 2(1-x-y)(-1) - 2\mu x = 0 \implies -(1-x-y) = \mu x$ 
2.   $\frac{\partial L}{\partial y} = 2(1-x-y)(-1) - 2\mu y = 0 \implies -(1-x-y) = \mu y$ 
3.   $x^2 + y^2 = 1$ 

Igualant les dues primeres equacions:  $\mu x = \mu y$ .
- **Cas  $\mu = 0$ **:
  Això implica  $1-x-y = 0 \implies x+y=1$ .
  Amb  $x^2+y^2=1$ , l'única solució és que una variable sigui 1 i l'altra 0: ** $(1,0)$ ** o ** $(0,1)$ **.
  En aquests punts  $z = 1-1-0 = 0$ . Valor  $f = 1 + 0^2 = \mathbf{1}$ .
- **Cas  $x = y$ **:
  Substituïm a  $x^2+y^2=1 \implies 2x^2=1 \implies x = \pm \frac{1}{\sqrt{2}}$ .
  - Si  $x=y=1/\sqrt{2} \implies z = 1 - \sqrt{2}$ . Valor  $f = 1 + (1-\sqrt{2})^2 = \mathbf{4 - 2\sqrt{2}} \approx 1.17$ .
  - Si  $x=y=-1/\sqrt{2} \implies z = 1 + \sqrt{2}$ . Valor  $f = 1 + (1+\sqrt{2})^2 = \mathbf{4 + 2\sqrt{2}} \approx 6.83$ .

**Conclusió b):** 
- **Mínims**:  $(1,0,0)$  i  $(0,1,0)$  amb valor ** $1$ **.
- **Màxim**:  $(-1/\sqrt{2}, -1/\sqrt{2}, 1+\sqrt{2})$  amb valor ** $4+2\sqrt{2}$ **.

---

## Exercici 3: Extrems absoluts en un disc

### Enunciat

Calculeu els extrems absoluts que pren la funció  $f(x,y) = x^2 + y^2 - 12x - 8y + 50$  sobre el domini definit per la inequació:
  

$$
x^2 + y^2 - 4x - 2y \leq 20
$$



### Solució

Per trobar els extrems absoluts en un domini compacte, seguim el procediment de Weierstrass: analitzem l'interior del domini i després la seva frontera.

### 1. Punts crítics a l'interior
Busquem els punts on el gradient s'anul·la:
-  $\frac{\partial f}{\partial x} = 2x - 12 = 0 \implies \mathbf{x = 6}$ 
-  $\frac{\partial f}{\partial y} = 2y - 8 = 0 \implies \mathbf{y = 4}$ 

Hem de comprovar si el punt  $(6, 4)$  es troba dins del domini definit per  $x^2 + y^2 - 4x - 2y \leq 20$ :


$$
6^2 + 4^2 - 4(6) - 2(4) = 36 + 16 - 24 - 8 = 20
$$


Com que el valor és exactament  $20$ , el punt  $(6, 4)$  no és un punt interior, sinó que es troba a la **frontera**. Per tant, no hi ha cap extrem relatiu dins del domini.

### 2. Estudi de la frontera
La frontera és la circumferència d'equació  $x^2 + y^2 - 4x - 2y = 20$ . 
Podem aprofitar aquesta igualtat per simplificar la funció  $f(x,y)$  sobre la frontera. Aïllem el terme  $x^2 + y^2$ :


$$
x^2 + y^2 = 4x + 2y + 20
$$


Substituïm això a l'expressió de  $f$ :


$$
f(x,y) = (x^2 + y^2) - 12x - 8y + 50 = (4x + 2y + 20) - 12x - 8y + 50 = \mathbf{-8x - 6y + 70}
$$



Ara hem de minimitzar/maximitzar  $h(x,y) = -8x - 6y + 70$  subjecte a  $g(x,y) = (x-2)^2 + (y-1)^2 - 25 = 0$  (completant quadrats a l'equació de la frontera).

**Mètode de Lagrange:**
Definim  $L(x,y,\lambda) = (-8x - 6y + 70) - \lambda((x-2)^2 + (y-1)^2 - 25)$ .
1.   $\frac{\partial L}{\partial x} = -8 - 2\lambda(x-2) = 0 \implies \mathbf{x-2 = -4/\lambda}$ 
2.   $\frac{\partial L}{\partial y} = -6 - 2\lambda(y-1) = 0 \implies \mathbf{y-1 = -3/\lambda}$ 
3.   $(x-2)^2 + (y-1)^2 = 25$ 

Substituïm (1) i (2) a (3):


$$
\left(\frac{-4}{\lambda}\right)^2 + \left(\frac{-3}{\lambda}\right)^2 = 25 \implies \frac{16}{\lambda^2} + \frac{9}{\lambda^2} = 25 \implies \frac{25}{\lambda^2} = 25 \implies \mathbf{\lambda = \pm 1}
$$



- **Si  $\lambda = 1$ **:  $x-2 = -4 \implies x = -2$  i  $y-1 = -3 \implies y = -2$ . Punt ** $(-2, -2)$ **.
- **Si  $\lambda = -1$ **:  $x-2 = 4 \implies x = 6$  i  $y-1 = 3 \implies y = 4$ . Punt ** $(6, 4)$ **.

### 3. Conclusió
Avaluem la funció  $f$  en els dos candidats trobats:
-  $f(-2, -2) = -8(-2) - 6(-2) + 70 = 16 + 12 + 70 = \mathbf{98}$ 
-  $f(6, 4) = -8(6) - 6(4) + 70 = -48 - 24 + 70 = \mathbf{-2}$ 

El **màxim absolut** és  $98$  al punt  $(-2, -2)$  i el **mínim absolut** és  $-2$  al punt  $(6, 4)$ .

---

## Exercici 4: Extrems en un domini triangular

### Enunciat

Determineu els punts on la funció  $f(x,y) = x^2 + y^2 - xy + x + y$  pren els valors màxim i mínim absoluts en el compacte  $D = \{(x,y) \in \mathbb{R}^2 : x \leq 0, y \leq 0, x + y \geq -3\}$ .

### Solució

El domini  $D$  és un triangle amb vèrtexs als punts  $(0,0)$ ,  $(-3,0)$  i  $(0,-3)$ . Segons el teorema de Weierstrass, busquem candidats a l'interior i als tres segments de la frontera.

### 1. Punts crítics a l'interior
Calculem les derivades parcials i les igualem a zero:
1.  $\frac{\partial f}{\partial x} = 2x - y + 1 = 0 \implies y = 2x + 1$ 
2.  $\frac{\partial f}{\partial y} = 2y - x + 1 = 0$ 

Substituïm la primera a la segona:


$$
2(2x + 1) - x + 1 = 0 \implies 4x + 2 - x + 1 = 0 \implies 3x = -3 \implies \mathbf{x = -1}
$$


D'on obtenim  $y = 2(-1) + 1 = \mathbf{-1}$ .
El punt ** $(-1, -1)$ ** pertany a l'interior de  $D$  ja que compleix totes les inequacions:  $-1 \leq 0$ ,  $-1 \leq 0$  i  $-1-1 = -2 \geq -3$ . [OK]
Valor:  $f(-1, -1) = (-1)^2 + (-1)^2 - (-1)(-1) + (-1) + (-1) = 1 + 1 - 1 - 1 - 1 = \mathbf{-1}$ .

### 2. Estudi de la frontera
Analitzem els tres costats del triangle:

**A) Segment L1 ( $x=0$  per a  $y \in [-3, 0]$ ):**
La funció es redueix a:  $f(0, y) = y^2 + y$ .
La seva derivada és  $2y + 1 = 0 \implies y = -1/2$ .
- Candidat:  $(0, -1/2)$  amb  $f(0, -1/2) = (-1/2)^2 + (-1/2) = \mathbf{-1/4}$ .
- Extrems (vèrtexs):  $f(0,0) = \mathbf{0}$  i  $f(0,-3) = (-3)^2 + (-3) = \mathbf{6}$ .

**B) Segment L2 ( $y=0$  per a  $x \in [-3, 0]$ ):**
La funció es redueix a:  $f(x, 0) = x^2 + x$ .
La seva derivada és  $2x + 1 = 0 \implies x = -1/2$ .
- Candidat:  $(-1/2, 0)$  amb  $f(-1/2, 0) = \mathbf{-1/4}$ .
- Extrems (vèrtexs):  $f(0,0) = \mathbf{0}$  i  $f(-3,0) = (-3)^2 + (-3) = \mathbf{6}$ .

**C) Segment L3 ( $x+y=-3 \implies y = -3-x$  per a  $x \in [-3, 0]$ ):**
Substituïm  $y$  a la funció:


$$
f(x, -3-x) = x^2 + (-3-x)^2 - x(-3-x) + x + (-3-x)
$$




$$
= x^2 + (9 + 6x + x^2) + (3x + x^2) + x - 3 - x = 3x^2 + 9x + 6
$$


Derivem:  $6x + 9 = 0 \implies x = -3/2$ . Llavors  $y = -3 - (-3/2) = -3/2$ .
- Candidat:  $(-3/2, -3/2)$  amb  $f(-3/2, -3/2) = 3(-3/2)^2 + 9(-3/2) + 6 = 27/4 - 27/2 + 6 = \mathbf{-3/4}$ .
- Extrems (vèrtexs): Ja calculats ( $f=6$ ).

### 3. Conclusió
Comparant tots els valors obtinguts:
- El **màxim absolut** és ** $6$ ** i s'assoleix als vèrtexs ** $(-3, 0)$ ** i ** $(0, -3)$ **.
- El **mínim absolut** és ** $-1$ ** i s'assoleix al punt interior ** $(-1, -1)$ **.

---

## Exercici 5: Aplicació (Alarma Tèrmica)

### Enunciat

La temperatura en graus centígrads d'una placa en un punt qualsevol  $(x,y)$  s'obté a partir de la funció  $T(x,y) = 25 + 4x^2 - 4xy + y^2$ . Una alarma tèrmica situada sobre els punts de la circumferència  $x^2 + y^2 = 25$ , es dispara quan la temperatura es superior a 180 graus o inferior a 20 graus. Es dispararà aquesta alarma?

### Solució

Per saber si l'alarma es dispararà, hem de trobar els valors màxim i mínim de la temperatura  $T(x,y)$  sobre la circumferència de radi 5 ( $x^2 + y^2 = 25$ ).

### 1. Simplificació de la funció
Observem que la funció de temperatura es pot expressar com un quadrat perfecte:


$$
T(x,y) = 25 + 4x^2 - 4xy + y^2 = 25 + (2x - y)^2
$$


Aquesta forma ens indica que el valor mínim de la funció serà **25 °C**, que s'assolirà en els punts on  $2x - y = 0$ , sempre que aquests punts estiguin sobre la circumferència.

### 2. Mètode de Lagrange
Definim  $f(x,y) = 25 + (2x - y)^2$  i la restricció  $g(x,y) = x^2 + y^2 - 25 = 0$ .
Construïm la funció de Lagrange  $L(x,y,lambda) = f - lambda g$ :


$$
L(x,y,lambda) = 25 + (2x - y)^2 - lambda(x^2 + y^2 - 25)
$$



Busquem els punts on el gradient és zero:
1.   $rac{partial L}{partial x} = 2(2x - y) cdot 2 - 2lambda x = 0 implies 4x - 2y = lambda x$ 
2.   $rac{partial L}{partial y} = 2(2x - y) cdot (-1) - 2lambda y = 0 implies -2x + y = lambda y$ 
3.   $x^2 + y^2 = 25$ 

De l'equació (2) aïllem  $y$ :  $y(1 - lambda) = 2x implies y = rac{2x}{1 - lambda}$  (si  $lambda 
eq 1$ ).
Substituïm a l'equació (1):


$$
4x - 2left(rac{2x}{1 - lambda}ight) = lambda x implies 4 - rac{4}{1 - lambda} = lambda quad (	ext{dividint per } x 
eq 0)
$$


Multiplicant per  $(1 - lambda)$ :


$$
4(1 - lambda) - 4 = lambda(1 - lambda) implies 4 - 4lambda - 4 = lambda - lambda^2 implies mathbf{lambda^2 - 5lambda = 0}
$$


D'on obtenim ** $lambda = 0$ ** o ** $lambda = 5$ **.

**Anàlisi dels casos:**
- **Cas  $lambda = 0$ **:
  De l'equació (2),  $-2x + y = 0 implies mathbf{y = 2x}$ .
  Substituint a la restricció:  $x^2 + (2x)^2 = 25 implies 5x^2 = 25 implies x = pm sqrt{5}$ .
  En aquests punts ( $y=2x$ ), el terme  $(2x-y)^2$  és zero.
  Valor:  $T = 25 + 0 = mathbf{25}$  °C.

- **Cas  $lambda = 5$ **:
  De l'equació (2),  $-2x + y = 5y implies -2x = 4y implies mathbf{x = -2y}$ .
  Substituint a la restricció:  $(-2y)^2 + y^2 = 25 implies 5y^2 = 25 implies y = pm sqrt{5}$ .
  En aquests punts ( $x=-2y$ ), el terme  $(2x-y)^2$  val  $(-4y-y)^2 = (-5y)^2 = 25y^2 = 25(5) = 125$ .
  Valor:  $T = 25 + 125 = mathbf{150}$  °C.

### 3. Conclusió
La temperatura sobre la circumferència oscil·la entre un mínim de **25 °C** i un màxim de **150 °C**.
- Com que el màxim (150 °C) és menor que 180 °C, l'alarma no es dispararà per excés de calor.
- Com que el mínim (25 °C) és major que 20 °C, l'alarma no es dispararà per fred.

**Resposta**: No, l'alarma no es dispararà.

---

## Exercici 6: Distància mínima a l'el·lipse

### Enunciat

Trobeu la distància mínima des de l'origen de coordenades a l'el·lipse definida per:
  

$$
\mathcal{E} = \{(x,y) \in \mathbb{R}^2 : 5x^2 + 5y^2 - 6xy = 4\}
$$



### Solució

Per trobar la distància mínima des de l'origen, minimitzarem el quadrat de la distància per evitar les arrels quadrades en les derivades:
**Funció objectiu**:  $f(x,y) = x^2 + y^2$ 
**Restricció**:  $g(x,y) = 5x^2 + 5y^2 - 6xy - 4 = 0$ 

### 1. Mètode dels Multiplicadors de Lagrange
Construïm la funció de Lagrange  $L(x,y,\lambda) = x^2 + y^2 - \lambda(5x^2 + 5y^2 - 6xy - 4)$ .
Busquem els punts on el gradient s'anul·la:
1.   $\frac{\partial L}{\partial x} = 2x - \lambda(10x - 6y) = 0 \implies x = \lambda (5x - 3y)$ 
2.   $\frac{\partial L}{\partial y} = 2y - \lambda(10y - 6x) = 0 \implies y = \lambda (5y - 3x)$ 
3.   $5x^2 + 5y^2 - 6xy = 4$ 

Per resoldre el sistema, multipliquem l'equació (1) per  $y$  i l'equació (2) per  $x$  per poder igualar els termes:
-  $xy = \lambda (5xy - 3y^2)$ 
-  $yx = \lambda (5yx - 3x^2)$ 

Igualant les dues expressions:


$$
5xy - 3y^2 = 5xy - 3x^2 \implies -3y^2 = -3x^2 \implies \mathbf{x^2 = y^2}
$$


Això ens dona dues trajectòries candidates: ** $y = x$ ** i ** $y = -x$ **.

### 2. Anàlisi dels casos
Analitzem la restricció en cada cas:

- **Cas  $y = x$ **:
  Substituïm a  $g(x,y)=0$ :
  

$$
5x^2 + 5x^2 - 6x^2 = 4 \implies 4x^2 = 4 \implies x^2 = 1 \implies \mathbf{x = \pm 1}
$$


  Els punts són  $(1,1)$  i  $(-1,-1)$ .
  El quadrat de la distància és  $f = 1^2 + 1^2 = 2 \implies \mathbf{d = \sqrt{2}} \approx 1.41$ .

- **Cas  $y = -x$ **:
  Substituïm a  $g(x,y)=0$ :
  

$$
5x^2 + 5x^2 - 6(-x^2) = 4 \implies 16x^2 = 4 \implies x^2 = 1/4 \implies \mathbf{x = \pm 1/2}
$$


  Els punts són  $(1/2, -1/2)$  i  $(-1/2, 1/2)$ .
  El quadrat de la distància és  $f = (1/2)^2 + (-1/2)^2 = 1/4 + 1/4 = 1/2$ .
  La distància és ** $d = \sqrt{1/2} = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$ **  $\approx 0.71$ .

### 3. Conclusió
Comparant els resultats, la distància mínima des de l'origen a l'el·lipse és ** $1/\sqrt{2}$ **.

---

## Exercici 7: Extrems absoluts en un recinte compacte

### Enunciat

Sigui  $f: \mathbb{R}^2 \to \mathbb{R}$  la funció definida per  $f(x,y) = x^2 + y^2$ .

a) Calculeu i classifiqueu els extrems relatius de  $f$  en el seu domini.
b) Justifiqueu l'existència d'extrems absoluts de  $f$  en el conjunt 


$$
K = \{(x,y) \in \mathbb{R}^2 : y \leq 1 - x^2, \, y \geq x - 1\}
$$


c) Determineu tots els candidats a màxim i a mínim absoluts de  $f$  en el recinte  $K$ .
d) Trieu els punts on  $f$  pren els valors màxim i mínim absoluts en  $K$  i digueu quins són els valors màxim i mínim de  $f$  en  $K$ .

### Solució

### Apartat a) Extrems relatius
Calculem el gradient de  $f(x,y) = x^2 + y^2$ :
*    $\frac{\partial f}{\partial x} = 2x = 0 \implies x = 0$ 
*    $\frac{\partial f}{\partial y} = 2y = 0 \implies y = 0$ 

L'únic punt crític és l'origen ** $(0,0)$ **.
Calculem la Hessiana:


$$
H(0,0) = \begin{pmatrix} 2 & 0 \\ 0 & 2 \end{pmatrix}
$$


Com que  $\Delta = 4 > 0$  i  $f_{xx} = 2 > 0$ , el punt  $(0,0)$  és un **Mínim relatiu**. El seu valor és  $f(0,0) = 0$ .

---

### Apartat b) Existència d'extrems absoluts
El conjunt  $K$  està definit per les desigualtats  $y \leq 1 - x^2$  (interior d'una paràbola) i  $y \geq x - 1$  (part superior d'una recta).
1.  **Tancat**: Està definit per desigualtats no estrictes de funcions contínues.
2.  **Acotat**: El conjunt està contingut en una regió finita del pla (entre la paràbola i la recta).

Com que  $K$  és un **conjunt compacte** (tancat i acotat) i la funció  $f$  és contínua, el **Teorema de Weierstrass** garanteix que  $f$  assoleix el seu màxim i el seu mínim absolut en  $K$ .

---

### Apartat c) Candidats a extrems absoluts
Busquem candidats en l'interior i a la frontera:

**1. Interior de  $K$ :**
L'únic punt crític és ** $(0,0)$ **, que pertany a  $K$  (ja que  $0 \leq 1-0^2$  i  $0 \geq 0-1$ ).
*   Valor:  $f(0,0) = \mathbf{0}$ .

**2. Frontera de  $K$ :**
La frontera està formada per dos arcs que s'intersequen en  $1-x^2 = x-1 \implies x^2+x-2=0$ , és a dir, en  $x=1$  i  $x=-2$ .

*   **Segment de recta  $y = x-1$  per  $x \in [-2, 1]$ **:
     $g(x) = f(x, x-1) = x^2 + (x-1)^2 = 2x^2 - 2x + 1$ 
     $g'(x) = 4x - 2 = 0 \implies x = 1/2$ .
    Punt candidat: ** $(1/2, -1/2)$ **. Valor:  $f(1/2, -1/2) = 1/4 + 1/4 = \mathbf{0.5}$ .

*   **Arc de paràbola  $y = 1-x^2$  per  $x \in [-2, 1]$ **:
     $h(x) = f(x, 1-x^2) = x^2 + (1-x^2)^2 = x^4 - x^2 + 1$ 
     $h'(x) = 4x^3 - 2x = 2x(2x^2 - 1) = 0 \implies x=0$  o  $x = \pm \frac{1}{\sqrt{2}}$ .
    Punts candidats:
    -  $(0, 1)$ . Valor:  $f(0,1) = \mathbf{1}$ .
    -  $(\pm \frac{1}{\sqrt{2}}, \frac{1}{2})$ . Valor:  $f(\pm \frac{1}{\sqrt{2}}, \frac{1}{2}) = \frac{1}{2} + \frac{1}{4} = \mathbf{0.75}$ .

*   **Vèrtexs (Interseccions)**:
    -  $P(-2, -3)$ . Valor:  $f(-2, -3) = 4 + 9 = \mathbf{13}$ .
    -  $P(1, 0)$ . Valor:  $f(1, 0) = \mathbf{1}$ .

---

### Apartat d) Valors màxim i mínim absoluts
Comparant tots els valors candidats:
 ${0, \, 0.5, \, 1, \, 0.75, \, 13}$ 

*   El **Mínim absolut** s'assoleix en el punt ** $(0,0)$ ** amb un valor de ** $0$ **.
*   El **Màxim absolut** s'assoleix en el punt ** $(-2, -3)$ ** amb un valor de ** $13$ ** (correspon a un dels vèrtexs de la regió).

---

## Exercici 8: Optimització en un segment circular

### Enunciat

Sigui  $f: \mathbb{R}^2 \to \mathbb{R}$  la funció definida per  $f(x,y) = x^4 + y^2$ .

a) Calculeu i classifiqueu els extrems relatius de  $f$  en el seu domini.
b) Justifiqueu l'existència d'extrems absoluts de  $f$  en el recinte 


$$
K = \{(x,y) \in \mathbb{R}^2 : x^2 + y^2 \leq 1, \, y \geq 1/2\}
$$


c) Determineu el màxim absolut i el mínim absolut de  $f$  en el recinte  $K$ .

### Solució

### Apartat a) Extrems relatius
Calculem el gradient de  $f(x,y) = x^4 + y^2$ :
*    $\frac{\partial f}{\partial x} = 4x^3 = 0 \implies x = 0$ 
*    $\frac{\partial f}{\partial y} = 2y = 0 \implies y = 0$ 

L'únic punt crític és l'origen ** $(0,0)$ **.
La Hessiana en  $(0,0)$  és:


$$
H(0,0) = \begin{pmatrix} 12x^2 & 0 \\ 0 & 2 \end{pmatrix}_{(0,0)} = \begin{pmatrix} 0 & 0 \\ 0 & 2 \end{pmatrix}
$$


El determinant és  $\Delta = 0$ , per tant el criteri no és concloent. No obstant, observem que  $f(x,y) = x^4 + y^2 \geq 0$  per a tot  $(x,y)$  i  $f(0,0) = 0$ . Per definició, el punt  $(0,0)$  és un **Mínim relatiu** (i absolut global).

---

### Apartat b) Existència d'extrems absoluts
El recinte  $K$  és la regió del disc unitat que queda per sobre de la recta  $y = 1/2$ .
1.  **Tancat**: Definit per desigualtats febles.
2.  **Acotat**: Contingut dins del disc de radi 1.

Per ser  $K$  un **compacte** i  $f$  una funció contínua, el **Teorema de Weierstrass** assegura l'existència de màxim i mínim absoluts en  $K$ .

---

### Apartat c) Màxim i mínim absoluts en  $K$ 
**1. Interior de  $K$ :**
L'únic punt crític  $(0,0)$  **no pertany** a  $K$ , ja que la seva coordenada  $y=0$  no compleix  $y \geq 1/2$ . Per tant, no hi ha candidats a l'interior.

**2. Frontera de  $K$ :**
*   **Segment rectilini  $y = 1/2$  per  $x \in [-\sqrt{3}/2, \sqrt{3}/2]$ **:
     $g(x) = f(x, 1/2) = x^4 + 1/4$ .
     $g'(x) = 4x^3 = 0 \implies x=0$ .
    Candidat: ** $(0, 1/2)$ **. Valor:  $f(0, 1/2) = \mathbf{0.25}$ .
    Extrems del segment (vèrtexs): ** $(\pm \sqrt{3}/2, 1/2)$ **. Valor:  $(3/4)^2 + 1/4 = 9/16 + 4/16 = \mathbf{0.8125}$ .

*   **Arc de circumferència  $x^2 + y^2 = 1 \implies x^2 = 1 - y^2$  per  $y \in [1/2, 1]$ **:
     $h(y) = f(x,y) = (1-y^2)^2 + y^2 = y^4 - 2y^2 + 1 + y^2 = y^4 - y^2 + 1$ .
     $h'(y) = 4y^3 - 2y = 2y(2y^2 - 1) = 0$ .
    -  $y=0$  (fora de l'interval).
    -  $y^2 = 1/2 \implies y = 1/\sqrt{2} \approx 0.707$  (dins l'interval).
    Si  $y = 1/\sqrt{2} \implies x^2 = 1 - 1/2 = 1/2 \implies x = \pm 1/\sqrt{2}$ .
    Candidats: ** $(\pm 1/\sqrt{2}, 1/\sqrt{2})$ **. Valor:  $1/4 + 1/2 = \mathbf{0.75}$ .
    -  $y=1$  (extrem de l'arc). Punt ** $(0,1)$ **. Valor:  $f(0,1) = \mathbf{1}$ .

**3. Conclusió:**
Comparant els valors obtinguts  ${0.25, \, 0.8125, \, 0.75, \, 1}$ :
*   El **Mínim absolut** és ** $0.25$ ** al punt ** $(0, 1/2)$ **.
*   El **Màxim absolut** és ** $1$ ** al punt ** $(0, 1)$ **.

---

## Exercici 9: Extrems condicionats (Multiplicadors de Lagrange)

### Enunciat

Trobeu els punts de la circumferència  $x^2 + y^2 - 2x - 2y = 16$  tals que la suma de les seves coordenades sigui màxima i mínima, respectivament.

### Solució

### 1. Definició del problema
Volem optimitzar la funció **objectiu**:


$$
f(x,y) = x + y
$$


Subjecta a la **restricció** (circumferència):


$$
g(x,y) = x^2 + y^2 - 2x - 2y - 16 = 0
$$



### 2. Mètode dels Multiplicadors de Lagrange
Definim la funció de Lagrange  $L(x, y, \lambda) = f(x,y) - \lambda g(x,y)$ :


$$
L(x, y, \lambda) = x + y - \lambda(x^2 + y^2 - 2x - 2y - 16)
$$



Busquem els punts on el gradient de  $L$  s'anul·la:
1.   $\frac{\partial L}{\partial x} = 1 - \lambda(2x - 2) = 0 \implies 1 = 2\lambda(x-1)$ 
2.   $\frac{\partial L}{\partial y} = 1 - \lambda(2y - 2) = 0 \implies 1 = 2\lambda(y-1)$ 
3.   $\frac{\partial L}{\partial \lambda} = -(x^2 + y^2 - 2x - 2y - 16) = 0$ 

De les equacions (1) i (2), veiem que:


$$
2\lambda(x-1) = 2\lambda(y-1)
$$


Com que  $\lambda$  no pot ser zero (perquè llavors  $1=0$ ), podem dividir per  $2\lambda$ :


$$
x-1 = y-1 \implies \mathbf{x = y}
$$



### 3. Substitució en la restricció
Substituïm  $y = x$  en l'equació de la circumferència:


$$
x^2 + x^2 - 2x - 2x - 16 = 0
$$




$$
2x^2 - 4x - 16 = 0
$$


Dividim per 2:


$$
x^2 - 2x - 8 = 0
$$


Resolent l'equació de segon grau:


$$
(x-4)(x+2) = 0 \implies x = 4, \, x = -2
$$



Obtenim dos punts candidats:
*   Si  $x = 4 \implies y = 4 \implies P_1(4, 4)$ 
*   Si  $x = -2 \implies y = -2 \implies P_2(-2, -2)$ 

### 4. Conclusió
Avaluem la funció suma  $f(x,y) = x + y$  en els punts trobats:
*    $f(4, 4) = 4 + 4 = \mathbf{8}$ 
*    $f(-2, -2) = -2 - 2 = \mathbf{-4}$ 

Per tant:
*   El **màxim** s'assoleix al punt ** $(4, 4)$ ** amb un valor de ** $8$ **.
*   El **mínim** s'assoleix al punt ** $(-2, -2)$ ** amb un valor de ** $-4$ **.

---

## Exercici 10: Distància mínima a una corba en el espai

### Enunciat

Trobeu els punts de la corba intersecció de la superfície  $x^2 - xy + y^2 - z^2 = 1$  i la superfície  $x^2 + y^2 = 1$  que són més a prop a l'origen de coordenades.

### Solució

### 1. Definició del problema
Volem minimitzar la distància al quadrat a l'origen:


$$
f(x,y,z) = x^2 + y^2 + z^2
$$


Subjecte a les dues restriccions:
1.   $g_1(x,y,z) = x^2 - xy + y^2 - z^2 = 1$ 
2.   $g_2(x,y,z) = x^2 + y^2 = 1$ 

### 2. Simplificació del sistema
En lloc d'utilitzar multiplicadors de Lagrange directament amb tres variables, podem simplificar el problema utilitzant la segona restricció en la primera i en la funció objectiu.

De (2) sabem que  $x^2 + y^2 = 1$ . Substituïm això en (1):


$$
1 - xy - z^2 = 1 \implies xy + z^2 = 0 \implies \mathbf{z^2 = -xy}
$$



Com que  $z^2$  ha de ser un nombre no negatiu ( $z^2 \geq 0$ ), la condició imposa que el producte ** $xy \leq 0$ **.

Ara substituïm  $x^2 + y^2 = 1$  en la funció objectiu:


$$
f(x,y,z) = (x^2 + y^2) + z^2 = 1 + z^2
$$



### 3. Minimització
Per minimitzar  $f = 1 + z^2$ , hem de fer que  $z^2$  sigui el més petit possible.
Com que  $z^2 \geq 0$ , el valor mínim possible és ** $z = 0$ **.

Si  $z = 0$ , aleshores de la relació  $z^2 = -xy$  obtenim:


$$
-xy = 0 \implies \mathbf{xy = 0}
$$



Això ens indica que o bé  $x=0$  o bé  $y=0$ . Combinant-ho amb la restricció  $x^2 + y^2 = 1$ :
*   Si  $x = 0 \implies y^2 = 1 \implies y = \pm 1$ .
*   Si  $y = 0 \implies x^2 = 1 \implies x = \pm 1$ .

### 4. Resultat final
Els punts de la corba més propers a l'origen són:


$$
\mathbf{(0, 1, 0), \, (0, -1, 0), \, (1, 0, 0), \, (-1, 0, 0)}
$$



Tots aquests punts estan a una distància  $d = \sqrt{0^2 + 1^2 + 0^2} = \mathbf{1}$  de l'origen.

---

## Exercici 11: Aplicació d'extrems condicionats (Repartiment d'herència)

### Enunciat

Tres germans de 40, 45 i 50 anys respectivament han de repartir-se una herència de 20.000.000 euros. La llei de successions del país diu que els impostos a pagar per cada germà són proporcionals a la seva edat i al quadrat de la quantitat rebuda.

Obteniu la part de l'herència que ha de rebre cada germà per tal que la quantitat conjunta pagada a hisenda pels tres germans sigui mínima.

### Solució

### 1. Modelització del problema
Anomenem  $x, y, z$  a les quantitats que rep cada germà. Sabem que la suma total és l'herència:
**Restricció**:  $x + y + z = 20.000.000$ 

Els impostos de cada germà són proporcionals ( $k$ ) a la seva edat i al quadrat de la quantitat:
*    $T_1 = k \cdot 40 \cdot x^2$ 
*    $T_2 = k \cdot 45 \cdot y^2$ 
*    $T_3 = k \cdot 50 \cdot z^2$ 

Volem minimitzar la suma total d'impostos  $T = T_1 + T_2 + T_3$ . Com que  $k$  és una constant positiva, minimitzar  $T$  equival a minimitzar la funció:
**Funció objectiu**:  $f(x,y,z) = 40x^2 + 45y^2 + 50z^2$ 

### 2. Mètode dels Multiplicadors de Lagrange
Definim la funció de Lagrange:


$$
L(x, y, z, \lambda) = 40x^2 + 45y^2 + 50z^2 - \lambda(x + y + z - 20.000.000)
$$



Calculem les derivades parcials i igualem a zero:
1.   $\frac{\partial L}{\partial x} = 80x - \lambda = 0 \implies x = \frac{\lambda}{80}$ 
2.   $\frac{\partial L}{\partial y} = 90y - \lambda = 0 \implies y = \frac{\lambda}{90}$ 
3.   $\frac{\partial L}{\partial z} = 100z - \lambda = 0 \implies z = \frac{\lambda}{100}$ 

### 3. Resolució del sistema
Substituïm  $x, y, z$  en la restricció:


$$
\frac{\lambda}{80} + \frac{\lambda}{90} + \frac{\lambda}{100} = 20.000.000
$$


Busquem el mínim comú múltiple de 80, 90 i 100, que és **3600**:


$$
\lambda \left( \frac{45 + 40 + 36}{3600} \right) = 20.000.000
$$




$$
\lambda \left( \frac{121}{3600} \right) = 20.000.000 \implies \lambda = \frac{72.000.000.000}{121}
$$



### 4. Càlcul de les quantitats
Ara trobem el valor de cada part:
*   **Germà de 40 anys**:  $x = \frac{\lambda}{80} = \frac{900.000.000}{121} \approx \mathbf{7.438.016,53}$  €
*   **Germà de 45 anys**:  $y = \frac{\lambda}{90} = \frac{800.000.000}{121} \approx \mathbf{6.611.570,25}$  €
*   **Germà de 50 anys**:  $z = \frac{\lambda}{100} = \frac{720.000.000}{121} \approx \mathbf{5.950.413,22}$  €

### 5. Conclusió
El germà més jove rep la part més gran de l'herència per compensar que el seu coeficient d'impostos ( $40$ ) és el més baix, mentre que el més gran rep la part més petita ja que el seu impost creix més ràpidament ( $50$ ). La suma de les tres parts és exactament  $20.000.000$  €.

---

