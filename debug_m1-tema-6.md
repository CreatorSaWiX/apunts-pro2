---
title: "Solucionari: Tema 6: Espais vectorials"
author: "Apunts"
---

# Solucionari: Tema 6: Espais vectorials

*Introducció als espais vectorials, subespais i bases.*

---

## Exercici 6.1: Operacions amb Vectors

### Enunciat

Siguin  $u = \begin{pmatrix} 3 \\ -1 \\ 2 \end{pmatrix}$ ,  $v = \begin{pmatrix} 4 \\ 0 \\ -8 \end{pmatrix}$  i  $w = \begin{pmatrix} 6 \\ -1 \\ -4 \end{pmatrix}$  vectors de  $\mathbb{R}^3$ . Calculeu:
  
1)  $u - v$ ;  $\quad$  2)  $5v + 3w$ ;  $\quad$  3)  $5(v + 3w)$ ;  $\quad$  4)  $(2w - u) - 3(2v + u)$ .

### Solució


### 1) Càlcul de  $u - v$ 

Restem les components corresponents dels vectors  $u$  i  $v$ :

 $u - v = \begin{pmatrix} 3 \\ -1 \\ 2 \end{pmatrix} - \begin{pmatrix} 4 \\ 0 \\ -8 \end{pmatrix} = \begin{pmatrix} 3-4 \\ -1-0 \\ 2-(-8) \end{pmatrix} = \begin{pmatrix} -1 \\ -1 \\ 10 \end{pmatrix}$ 

### 2) Càlcul de  $5v + 3w$ 

 $5v = 5 \begin{pmatrix} 4 \\ 0 \\ -8 \end{pmatrix} = \begin{pmatrix} 20 \\ 0 \\ -40 \end{pmatrix}$ 

 $3w = 3 \begin{pmatrix} 6 \\ -1 \\ -4 \end{pmatrix} = \begin{pmatrix} 18 \\ -3 \\ -12 \end{pmatrix}$ 

 $5v + 3w = \begin{pmatrix} 20 \\ 0 \\ -40 \end{pmatrix} + \begin{pmatrix} 18 \\ -3 \\ -12 \end{pmatrix} = \begin{pmatrix} 20+18 \\ 0-3 \\ -40-12 \end{pmatrix} = \begin{pmatrix} 38 \\ -3 \\ -52 \end{pmatrix}$ 

### 3) Càlcul de  $5(v + 3w)$ 

 $v + 3w = \begin{pmatrix} 4 \\ 0 \\ -8 \end{pmatrix} + \begin{pmatrix} 18 \\ -3 \\ -12 \end{pmatrix} = \begin{pmatrix} 22 \\ -3 \\ -20 \end{pmatrix}$ 

 $5(v + 3w) = 5 \begin{pmatrix} 22 \\ -3 \\ -20 \end{pmatrix} = \begin{pmatrix} 110 \\ -15 \\ -100 \end{pmatrix}$ 

### 4) Càlcul de  $(2w - u) - 3(2v + u)$ 

 $2w - u = \begin{pmatrix} 12 \\ -2 \\ -8 \end{pmatrix} - \begin{pmatrix} 3 \\ -1 \\ 2 \end{pmatrix} = \begin{pmatrix} 12-3 \\ -2-(-1) \\ -8-2 \end{pmatrix} = \begin{pmatrix} 9 \\ -1 \\ -10 \end{pmatrix}$ 

 $2v + u = \begin{pmatrix} 8 \\ 0 \\ -16 \end{pmatrix} + \begin{pmatrix} 3 \\ -1 \\ 2 \end{pmatrix} = \begin{pmatrix} 11 \\ -1 \\ -14 \end{pmatrix}$ 

 $3(2v + u) = 3 \begin{pmatrix} 11 \\ -1 \\ -14 \end{pmatrix} = \begin{pmatrix} 33 \\ -3 \\ -42 \end{pmatrix}$ 

 $(2w - u) - 3(2v + u) = \begin{pmatrix} 9 \\ -1 \\ -10 \end{pmatrix} - \begin{pmatrix} 33 \\ -3 \\ -42 \end{pmatrix} = \begin{pmatrix} 9-33 \\ -1-(-3) \\ -10-(-42) \end{pmatrix} = \begin{pmatrix} -24 \\ 2 \\ 32 \end{pmatrix}$ 


---

## Exercici 6.2: Representació de Vectors al Pla

### Enunciat

Dibuixeu en el pla els vectors següents de  $\mathbb{R}^2$ :
  
1)  $v_1 = \begin{pmatrix} 2 \\ 6 \end{pmatrix}$ ;  $\quad$  2)  $v_2 = \begin{pmatrix} -4 \\ -8 \end{pmatrix}$ ;  $\quad$  3)  $v_3 = \begin{pmatrix} -1 \\ 5 \end{pmatrix}$ ;  $\quad$  4)  $v_4 = \begin{pmatrix} 3 \\ 0 \end{pmatrix}$ .

### Solució


Per representar un vector  $v = \begin{pmatrix} x \\ y \end{pmatrix}$  en el pla  $\mathbb{R}^2$ , situem l'origen del vector al punt  $(0,0)$  i l'extrem al punt definit per les seves coordenades  $(x,y)$ .

A continuació es mostren els vectors de l'exercici representats gràficament:


*[Gràfic interactiu disponible a la web]*


### Descripció dels vectors:

*   ** $v_1 = (2, 6)$ **: Es desplaça 2 unitats a la dreta (eix  $X$ ) i 6 unitats cap amunt (eix  $Y$ ). Es troba al **primer quadrant**.
*   ** $v_2 = (-4, -8)$ **: Es desplaça 4 unitats a l'esquerra (eix  $X$ ) i 8 unitats cap avall (eix  $Y$ ). Es troba al **tercer quadrant**.
*   ** $v_3 = (-1, 5)$ **: Es desplaça 1 unitat a l'esquerra (eix  $X$ ) i 5 unitats cap amunt (eix  $Y$ ). Es troba al **segon quadrant**.
*   ** $v_4 = (3, 0)$ **: Es desplaça 3 unitats a la dreta (eix  $X$ ) i 0 unitats en vertical. Es troba sobre l'**eix d'abscisses** (part positiva).


---

## Exercici 6.3: Operacions Gràfiques i Algebràiques

### Enunciat

Per als vectors de l'exercici anterior, calculeu  $v_1 + v_2$ ,  $v_1 - v_3$  i  $v_2 - v_4$  gràficament i comproveu les vostres respostes algebràicament.

### Solució


Recordem els vectors de l'exercici 6.2:
 $v_1 = \begin{pmatrix} 2 \\ 6 \end{pmatrix}, v_2 = \begin{pmatrix} -4 \\ -8 \end{pmatrix}, v_3 = \begin{pmatrix} -1 \\ 5 \end{pmatrix}, v_4 = \begin{pmatrix} 3 \\ 0 \end{pmatrix}$ 

### Resolució Algebràica

1) **Càlcul de  $v_1 + v_2$ **:


$$
v_1 + v_2 = \begin{pmatrix} 2 \\ 6 \end{pmatrix} + \begin{pmatrix} -4 \\ -8 \end{pmatrix} = \begin{pmatrix} 2-4 \\ 6-8 \end{pmatrix} = \begin{pmatrix} -2 \\ -2 \end{pmatrix}
$$



2) **Càlcul de  $v_1 - v_3$ **:


$$
v_1 - v_3 = \begin{pmatrix} 2 \\ 6 \end{pmatrix} - \begin{pmatrix} -1 \\ 5 \end{pmatrix} = \begin{pmatrix} 2-(-1) \\ 6-5 \end{pmatrix} = \begin{pmatrix} 3 \\ 1 \end{pmatrix}
$$



3) **Càlcul de  $v_2 - v_4$ **:


$$
v_2 - v_4 = \begin{pmatrix} -4 \\ -8 \end{pmatrix} - \begin{pmatrix} 3 \\ 0 \end{pmatrix} = \begin{pmatrix} -4-3 \\ -8-0 \end{pmatrix} = \begin{pmatrix} -7 \\ -8 \end{pmatrix}
$$



---

### Resolució Gràfica


*[Gràfic interactiu disponible a la web]*



---

## Exercici 6.4: Combinacions Lineals Simbòliques

### Enunciat

Siguin  $u, v, w$  elements d'un espai vectorial i siguin  $\alpha, \beta, \gamma$  elements del cos d'escalars amb  $\alpha \neq 0$ . Suposem que es compleix la relació  $\alpha u + \beta v + \gamma w = 0$ . Escriviu els vectors  $u$ ,  $u - v$  i  $u + \alpha^{-1} \beta v$  en funció de  $v$  i  $w$ .

### Solució

Recordem que un vector  $\vec{u}$  és combinació lineal d'un conjunt de vectors  $\{\vec{v}_1, \dots, \vec{v}_n\}$  si existeixen escalars  $a_1, \dots, a_n$  tals que:


$$
\vec{u} = a_1 \vec{v}_1 + a_2 \vec{v}_2 + \dots + a_n \vec{v}_n
$$

. En aquest exercici, estem expressant un vector  $u$  com a combinació lineal de  $v$  i  $w$ .


*[Gràfic interactiu disponible a la web]*


Partim de la relació donada:


$$
\alpha u + \beta v + \gamma w = 0
$$



Com que  $\alpha \neq 0$ , existeix l'invers  $\alpha^{-1}$  (o podem dividir per  $\alpha$ ).

### 1) Expressar  $u$  en funció de  $v, w$ 




$$
\alpha u = -\beta v - \gamma w
$$





$$
u = \alpha^{-1}(-\beta v - \gamma w)
$$





$$
\mathbf{u = -\alpha^{-1}\beta v - \alpha^{-1}\gamma w}
$$



### 2) Expressar  $u - v$  en funció de  $v, w$ 



$$
u - v = (-\alpha^{-1}\beta v - \alpha^{-1}\gamma w) - v
$$





$$
u - v = (-\alpha^{-1}\beta - 1)v - \alpha^{-1}\gamma w
$$





$$
\mathbf{u - v = -(\alpha^{-1}\beta + 1)v - \alpha^{-1}\gamma w}
$$



### 3) Expressar  $u + \alpha^{-1} \beta v$  en funció de  $v, w$ 



$$
u + \alpha^{-1} \beta v = (-\alpha^{-1}\beta v - \alpha^{-1}\gamma w) + \alpha^{-1} \beta v
$$





$$
\mathbf{u + \alpha^{-1} \beta v = -\alpha^{-1}\gamma w}
$$




---

## Exercici 6.5: Espai de Polinomis de Grau Parell

### Enunciat

Sigui  $P(\mathbb{R})_p$  el conjunt de tots els polinomis amb coeficients a  $\mathbb{R}$  i on totes les potències de  $x$  tenen grau parell. Esbrineu si  $P(\mathbb{R})_p$  és un espai vectorial amb les operacions de suma i producte per escalar habituals. (Considerem que el polinomi 0 té grau 0.)

### Solució



**Espai Vectorial**: Un conjunt  $V$  d'elements (vectors) dotat d'una suma i un producte per escalars que compleix 8 propietats fonamentals (associativitat, commutativitat, element neutre, invers, etc.).

**Subespai Vectorial**: Un subconjunt  $S \subseteq V$  que ell mateix és un espai vectorial aplicant les operacions de  $V$ . Per comprovar-ho, només cal verificar:
  1. Que conté el vector nul:  $\vec{0} \in S$ .
  2. Que és tancat per la suma: la suma de dos elements del conjunt continua sent del conjunt  $\vec{u}, \vec{v} \in S \implies \vec{u} + \vec{v} \in S$ .
  3. Que és tancat pel producte d'escalars: multiplicar per un escalar continua donant un element del conjunt  $\vec{u} \in S, \lambda \in \mathbb{R} \implies \lambda \vec{u} \in S$ .



Per determinar si  $P(\mathbb{R})_p$  és un espai vectorial, comprovarem si compleix les propietats de **subespai vectorial** del conjunt de tots els polinomis  $\mathbb{R}[x]$ , que ja sabem que és un espai vectorial.
Un subconjunt  $S$  és un subespai vectorial si conté el vector nul i és tancat per la suma i el producte per escalar.

### 1) Existència de l'element neutre (Polinomi nul)

El polinomi nul  $p(x) = 0$  pertany a  $P(\mathbb{R})_p$ ?
L'enunciat ens indica que considerem que el polinomi  $0$  té grau  $0$ . Com que  $0$  és un nombre parell, el polinomi nul compleix la condició de pertinença al conjunt.


$$
0 \in P(\mathbb{R})_p
$$



### 2) Tancament respecte a la suma

Siguin  $p(x)$  i  $q(x)$  dos polinomis de  $P(\mathbb{R})_p$ . Això vol dir que es poden escriure com:



$$
p(x) = a_0 + a_2 x^2 + a_4 x^4 + \dots + a_{2n} x^{2n}
$$





$$
q(x) = b_0 + b_2 x^2 + b_4 x^4 + \dots + b_{2m} x^{2m}
$$



Si els sumem:


$$
(p+q)(x) = (a_0 + b_0) + (a_2 + b_2) x^2 + (a_4 + b_4) x^4 + \dots
$$



El resultat és un nou polinomi on totes les potències de  $x$  segueixen sent parelles. Per tant:


$$
(p+q)(x) \in P(\mathbb{R})_p
$$



### 3) Tancament respecte al producte per escalar

Sigui  $p(x) \in P(\mathbb{R})_p$  i sigui  $\lambda \in \mathbb{R}$  un escalar qualsevol:


$$
(\lambda p)(x) = \lambda(a_0 + a_2 x^2 + a_4 x^4 + \dots) = (\lambda a_0) + (\lambda a_2) x^2 + (\lambda a_4) x^4 + \dots
$$



Totes les potències de  $x$  en el polinomi resultant són parelles. Per tant:


$$
(\lambda p)(x) \in P(\mathbb{R})_p
$$



Com que es compleixen les tres condicions,  $P(\mathbb{R})_p$  és un **subespai vectorial** de  $\mathbb{R}[x]$  i, per tant, és un **espai vectorial** amb les operacions habituals.


---

## Exercici 6.6: Espai Vectorial de les Funcions Reals

### Enunciat

Considereu el conjunt  $\mathcal{F}(\mathbb{R})$  format per totes les funcions  $f : \mathbb{R} \to \mathbb{R}$ . Donades dues funcions  $f,g \in \mathcal{F}(\mathbb{R})$  i  $\lambda \in \mathbb{R}$ , definim les funcions  $f + g$  i  $\lambda f$  com:
  


$$
(f + g)(x) = f(x) + g(x)
$$





$$
(\lambda f)(x) = \lambda f(x)
$$



Demostreu que  $\mathcal{F}(\mathbb{R})$  amb aquestes operacions és un  $\mathbb{R}$ -espai vectorial.

### Solució


Per demostrar que  $(\mathcal{F}(\mathbb{R}), +, \cdot)$  és un espai vectorial sobre  $\mathbb{R}$ , hem de verificar que es compleixen els 8 axiomes fonamentals. Totes aquestes propietats es basen en el fet que les operacions es defineixen punt a punt i aprofiten les propietats dels nombres reals.

### Propietats de la suma (+)

Siguin  $f, g, h \in \mathcal{F}(\mathbb{R})$ :

1.  **Associativa**:  $((f+g)+h)(x) = (f(x)+g(x))+h(x) = f(x)+(g(x)+h(x)) = (f+(g+h))(x)$ .
2.  **Commutativa**:  $(f+g)(x) = f(x)+g(x) = g(x)+f(x) = (g+f)(x)$ .
3.  **Element neutre**: Existeix la funció nul·la  $z(x) = 0$  tal que  $(f+z)(x) = f(x)+0 = f(x)$ . Llavors  $f+z = f$ .
4.  **Element oposat**: Per a cada  $f$ , existeix  $-f$  definida com  $(-f)(x) = -f(x)$  tal que  $(f+(-f))(x) = f(x)-f(x) = 0 = z(x)$ .

### Propietats del producte per escalar ( $\cdot$ )

Siguin  $a, b \in \mathbb{R}$  i  $f, g \in \mathcal{F}(\mathbb{R})$ :

5.  **Pseudo-associativa**:  $(a(bf))(x) = a(b f(x)) = (ab)f(x) = ((ab)f)(x)$ .
6.  **Element unitat**:  $(1f)(x) = 1 \cdot f(x) = f(x)$ . Llavors  $1f = f$ .
7.  **Distributiva respecte a la suma de vectors**:
     $(a(f+g))(x) = a(f(x)+g(x)) = a f(x) + a g(x) = (af + ag)(x)$ .
8.  **Distributiva respecte a la suma d'escalars**:
     $((a+b)f)(x) = (a+b)f(x) = a f(x) + b f(x) = (af + bf)(x)$ .

Com que es compleixen els vuit axiomes, el conjunt  $\mathcal{F}(\mathbb{R})$  amb les operacions de suma i producte per escalar definides és un ** $\mathbb{R}$ -espai vectorial**.


---

## Exercici 6.7: Determinació de Subespais Vectorials

### Enunciat

Esbrineu quins dels conjunts següents són subespais vectorials sobre  $\mathbb{R}$ . Justifiqueu les respostes.
  
 $E_1 = \{ (x, y) \in \mathbb{R}^2 : x + \pi y = 0 \}$ 

 $E_2 = \{ (x, y, z) \in \mathbb{R}^3 : x + z = \pi \}$ 

 $E_3 = \{ (x, y, z) \in \mathbb{R}^3 : xy = 0 \}$ 

 $E_4 = \{ (x, y) \in \mathbb{R}^2 : x \in \mathbb{Q} \}$ 

 $E_5 = \{ (x, y, z, t) \in \mathbb{R}^4 : x+y+z+t=0, x-t=0 \}$ 

 $E_6 = \{ (x, y) \in \mathbb{R}^2 : x^2 + 2xy + y^2 = 0 \}$ 

 $E_7 = \{ (a+b, a-2b, c, 2a+c) : a,b,c \in \mathbb{R} \}$ 

 $E_8 = \{ (a^2, a, b+a, 2+a) : a,b \in \mathbb{R} \}$ 

### Solució

Recordem que un subconjunt  $E \subseteq V$  és un subespai vectorial si conté el vector nul, és tancat per la suma i és tancat pel producte per escalar. Una forma ràpida de detectar-ho és comprovar si el conjunt està definit per equacions lineals homogènies (terme independent 0,  $ax + by = 0$ , ex:  $x + \pi y = 0$ , etc.).

---

### ** $E_1$ : SÍ**
Està definit per una **equació lineal homogènia** ( $x + \pi y = 0$ ). Tota equació del tipus  $ax + by = 0$  defineix un subespai vectorial (una recta que passa per l'origen).

---

### ** $E_2$ : NO**
L'equació  $x + z = \pi$  no és homogènia perquè el terme independent  $\pi$  és diferent de zero. El **vector nul  $(0,0,0)$  no hi pertany**, ja que  $0+0 \neq \pi$ .

---

### ** $E_3$ : NO**
La condició  $xy = 0$  no és lineal. Tot i que conté el vector nul, **no és tancat per la suma**. Per exemple:
*    $(1, 0, 0) \in E_3$  (perquè  $1 \cdot 0 = 0$ )
*    $(0, 1, 0) \in E_3$  (perquè  $0 \cdot 1 = 0$ )
*   Però la seva suma  $(1,0,0)+(0,1,0) = (1, 1, 0) \notin E_3$  perquè  $1 \cdot 1 = 1 \neq 0$ .

---

### ** $E_4$ : NO**
La condició  $x \in \mathbb{Q}$  (racionals) fa que el conjunt **no sigui tancat pel producte per escalar real**.
Si prenem el vector  $(1, 0) \in E_4$  i l'escalar  $\sqrt{2} \in \mathbb{R}$ :


$$
\sqrt{2} \cdot (1, 0) = (\sqrt{2}, 0) \notin E_4 \quad \text{perquè } \sqrt{2} \notin \mathbb{Q}
$$



---

### ** $E_5$ : SÍ**
Està definit per un **sistema d'equacions lineals homogènies**. Qualsevol conjunt de solucions d'un sistema homogeni és un subespai vectorial.

---

### ** $E_6$ : SÍ**
L'expressió  $x^2 + 2xy + y^2 = 0$  es pot factoritzar com a  $(x+y)^2 = 0$ , que equival a l'equació lineal homogènia:


$$
x + y = 0
$$



Per tant, és un subespai vectorial.

---

### ** $E_7$ : SÍ**
Podem escriure el vector genèric com una combinació lineal de vectors fixos segons els paràmetres  $a, b, c$ :


$$
(a+b, a-2b, c, 2a+c) = a(1, 1, 0, 2) + b(1, -2, 0, 0) + c(0, 0, 1, 1)
$$



Això vol dir que  $E_7 = \text{Gen}\{(1,1,0,2), (1,-2,0,0), (0,0,1,1)\}$ . El **generat (Span)** d'un conjunt de vectors sempre és un subespai vectorial.

---

### ** $E_8$ : NO**
El conjunt no conté el vector nul ni és lineal. Analitzem l'última component  $2+a$ : per ser el vector nul,  $2+a$  hauria de ser  $0$ , pel que  $a$  hauria de ser  $-2$ . Però si  $a=-2$ , la segona component seria  $-2 \neq 0$ . A més, la component  $a^2$  indica **no linealitat**.


---

## Exercici 6.8: Subespais en l’Espai de Polinomis

### Enunciat

Denotem per  $P(\mathbb{R})$  l'espai vectorial dels polinomis amb coeficients reals i variable  $x$ . Esbrineu quins dels subconjunts següents són subespais vectorials de  $P(\mathbb{R})$ . Justifiqueu les respostes.
  
 $F_1 = \{ a_3 x^3 + a_2 x^2 + a_1 x + a_0 \in P(\mathbb{R}) : a_2 = a_0 \}$ 

 $F_2 = \{ p(x) \in P(\mathbb{R}) : p(x) \text{ té grau } 3 \}$ 

 $F_3 = \{ p(x) \in P(\mathbb{R}) : p(x) \text{ té grau parell} \}$ 

 $F_4 = \{ p(x) \in P(\mathbb{R}) : p(1) = 0 \}$ 

 $F_5 = \{ p(x) \in P(\mathbb{R}) : p(0) = 1 \}$ 

 $F_6 = \{ p(x) \in P(\mathbb{R}) : p'(5) = 0 \}$ 

### Solució


Per a cada conjunt, analitzem si compleix les condicions de subespai vectorial: conté el zero, tancament per la suma i tancament pel producte per escalar.

---

### ** $F_1$ : SÍ**
La condició  $a_2 = a_0$  es pot escriure com una **equació lineal homogènia** entre els coeficients:  $a_2 - a_0 = 0$ . Qualsevol restricció lineal i homogènia sobre els components d'un vector (o coeficients d'un polinomi) defineix un subespai.

---

### ** $F_2$ : NO**
Els polinomis de grau **exactament** 3 no formen un subespai vectorial per dos motius:
1.  **No conté el polinomi nul**, ja que el polinomi  $0$  no té grau 3 (el seu grau és  $0$  o  $-\infty$ ).
2.  **No és tancat per la suma**. Per exemple, si sumem  $p(x) = x^3 + x$  i  $q(x) = -x^3 + 2$ , obtenim  $(p+q)(x) = x + 2$ , que té grau 1.

---

### ** $F_3$ : NO**
Tot i que conté el polinomi nul (grau 0, parell), **no és tancat per la suma**. Considereu:
*    $p(x) = x^4 + x^3 \in F_3$  (grau 4, parell)
*    $q(x) = -x^4 \in F_3$  (grau 4, parell)
*   La suma  $(p+q)(x) = x^3 \notin F_3$  perquè té grau 3 (imparell).

---

### ** $F_4$ : SÍ**
L'avaluació en un punt és una operació lineal. La condició  $p(1) = 0$  és una **equació lineal homogènia**.
*    $0(1) = 0$ .
*    $(p+q)(1) = p(1) + q(1) = 0 + 0 = 0$ .
*    $(\lambda p)(1) = \lambda p(1) = \lambda \cdot 0 = 0$ .

---

### ** $F_5$ : NO**
La condició  $p(0) = 1$  no és homogènia. El **polinomi nul no hi pertany** perquè  $0(0) = 0 \neq 1$ . Tampoc seria tancat per la suma ( $1+1=2 \neq 1$ ).

---

### ** $F_6$ : SÍ**
La derivada i la seva avaluació en un punt són operacions lineals. La condició  $p'(5) = 0$  és una restricció lineal homogènia.
*   La derivada del polinomi nul és  $0$ , i  $0(5) = 0$ .
*   Les propietats de la derivada asseguren que  $(p+q)'(5) = p'(5) + q'(5) = 0+0=0$  i  $(\lambda p)'(5) = \lambda p'(5) = 0$ .


---

## Exercici 6.9: Subespais en l’Espai de Matrius

### Enunciat

Considereu  $\mathcal{M}_{n \times m}(\mathbb{R})$  l'espai vectorial de les matrius  $n \times m$  amb coeficients reals. Esbrineu quins dels subconjunts següents són subespais vectorials de  $\mathcal{M}_{n \times m}(\mathbb{R})$ . Justifiqueu les respostes.
  
 $M_1 = \left\{ A \in \mathcal{M}_{2 \times 2}(\mathbb{R}) : A \begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix} = \begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix} A \right\}$ 

 $M_2 = \{ A \in \mathcal{M}_{n \times n}(\mathbb{R}) : A = A^t \}$ 

 $M_3 = \{ A \in \mathcal{M}_{n \times m}(\mathbb{R}) : a_{1i} = 0 \quad \forall i \in [m] \}$ 

 $M_4 = \{ A \in \mathcal{M}_{n \times m}(\mathbb{R}) : a_{1i} = 1 \quad \forall i \in [m] \}$ 

 $M_5 = \{ A \in \mathcal{M}_{n \times m}(\mathbb{R}) : AB = 0 \}$  (on  $B$  és una matriu fixa)

### Solució


Analitzem cada conjunt verificant les condicions de subespai vectorial en l'espai de matrius.

---

### ** $M_1$ : SÍ**
És el conjunt de matrius que **commuten** amb una matriu fixa  $B$ . La condició  $AB = BA$  (o  $AB - BA = 0$ ) és una equació lineal homogènia respecte als elements de  $A$ .
*   La matriu nul·la commuta:  $0B = B0 = 0$ .
*   Si  $A_1$  i  $A_2$  commuten, la seva suma també:  $(A_1+A_2)B = A_1B+A_2B = BA_1+BA_2 = B(A_1+A_2)$ .
*   El producte per escalar manté la commutativitat:  $(\lambda A)B = \lambda(AB) = \lambda(BA) = B(\lambda A)$ .

---

### ** $M_2$ : SÍ**
És el conjunt de les **matrius simètriques**. La trasposició és una operació lineal:
*   La matriu nul·la és simètrica ( $0^t = 0$ ).
*    $(A+B)^t = A^t + B^t = A + B$ .
*    $(\lambda A)^t = \lambda A^t = \lambda A$ .

---

### ** $M_3$ : SÍ**
La condició que la primera fila sigui zero ( $a_{1i}=0$ ) equival a un conjunt d'equacions lineals homogènies sobre les entrades de la matriu. La suma de dues matrius amb la primera fila nul·la tindrà la primera fila nul·la, i el mateix passa amb el producte per escalar.

---

### ** $M_4$ : NO**
La condició  $a_{1i}=1$  no és homogènia.
1.  **No conté la matriu nul·la**, ja que totes les entrades de la matriu nul·la són  $0$ , no  $1$ .
2.  **No és tancat per la suma**: la suma de dues matrius d'aquest conjunt tindria  $1+1=2$  a la primera fila.

---

### ** $M_5$ : SÍ**
La condició  $AB = 0$  és lineal i homogènia respecte a  $A$ :
*   La matriu nul·la compleix  $0B = 0$ .
*   Si  $A_1B = 0$  i  $A_2B = 0$ , llavors  $(A_1+A_2)B = A_1B + A_2B = 0 + 0 = 0$ .
*   Si  $AB = 0$ , llavors  $(\lambda A)B = \lambda (AB) = \lambda \cdot 0 = 0$ .


---

## Exercici 6.10: Combinacions Lineals No Úniques

### Enunciat

Considereu el conjunt  $T \subset \mathbb{R}^4$  format pels vectors:


$$
v_1 = \begin{pmatrix} 1 \\ 0 \\ -1 \\ 0 \end{pmatrix}, v_2 = \begin{pmatrix} 1 \\ 1 \\ 1 \\ 0 \end{pmatrix}, v_3 = \begin{pmatrix} 0 \\ 1 \\ 1 \\ 1 \end{pmatrix}, v_4 = \begin{pmatrix} 0 \\ 1 \\ 2 \\ 0 \end{pmatrix}
$$



Proveu que el vector  $u = \begin{pmatrix} 0 \\ 3 \\ 5 \\ 1 \end{pmatrix}$  es pot escriure com a combinació lineal dels vectors del conjunt almenys de dues maneres diferents.

### Solució


Per provar que  $u$  es pot escriure com a combinació lineal dels vectors de  $T$ , busquem escalars  $x_1, x_2, x_3, x_4$  tals que:


$$
x_1 v_1 + x_2 v_2 + x_3 v_3 + x_4 v_4 = u
$$



Això planteja el següent sistema d'equacions lineals per components:
1.   $x_1 + x_2 = 0$ 
2.   $x_2 + x_3 + x_4 = 3$ 
3.   $-x_1 + x_2 + x_3 + 2x_4 = 5$ 
4.   $x_3 = 1$ 

### Resolució del sistema

Substituïm  $x_3 = 1$  (de l'equació 4) i  $x_1 = -x_2$  (de l'equació 1) a les altres dues equacions:
*   De (2):  $x_2 + 1 + x_4 = 3 \implies \mathbf{x_2 + x_4 = 2}$ 
*   De (3):  $-(-x_2) + x_2 + 1 + 2x_4 = 5 \implies 2x_2 + 2x_4 = 4 \implies \mathbf{x_2 + x_4 = 2}$ 

Com veiem, les dues equacions ens porten a la mateixa relació  $x_2 + x_4 = 2$ . Això vol dir que el sistema és **compatible indeterminat** (té infinites solucions). Podem expressar la solució general en funció d'un paràmetre  $\lambda$  (fent  $x_4 = \lambda$ ):


$$
x_4 = \lambda, \quad x_2 = 2 - \lambda, \quad x_1 = \lambda - 2, \quad x_3 = 1
$$



### Dues maneres diferents

Podem escollir qualsevol valor de  $\lambda$  per obtenir combinacions lineals diferents:

**Opció A:  $\lambda = 0$ **
Tenim  $x_1 = -2, x_2 = 2, x_3 = 1, x_4 = 0$ .


$$
-2 v_1 + 2 v_2 + v_3 = u
$$



**Opció B:  $\lambda = 1$ **
Tenim  $x_1 = -1, x_2 = 1, x_3 = 1, x_4 = 1$ .


$$
-1 v_1 + v_2 + v_3 + v_4 = u
$$



Havent trobat dues combinacions lineals distintes, queda provat que  $u$  no s'escriu de forma única com a combinació lineal dels vectors de  $T$ . Això implica, per cert, que els vectors de  $T$  són **linealment dependents**.


---

## Exercici 6.11: Combinació Lineal amb Paràmetres

### Enunciat

Per a quins valors del paràmetre  $a$  el vector  $u = \begin{pmatrix} 1 \\ 5 \\ a \end{pmatrix}$  es pot escriure com a combinació lineal dels vectors del conjunt  $T$ ?



$$
T = \left\{ \begin{pmatrix} 3 \\ 1 \\ -1 \end{pmatrix}, \begin{pmatrix} 0 \\ 7 \\ -1 \end{pmatrix}, \begin{pmatrix} -1 \\ 2 \\ 0 \end{pmatrix} \right\}
$$



### Solució


Perquè  $u$  sigui combinació lineal dels vectors de  $T$ , el sistema d'equacions lineals format per la matriu ampliada  $[v_1, v_2, v_3 | u]$  ha de ser compatible.

### Plantejament de la matriu ampliada



$$
\left( \begin{array}{ccc|c} 
3 & 0 & -1 & 1 \\
1 & 7 & 2 & 5 \\
-1 & -1 & 0 & a
\end{array} \right)
$$



### Escalonament mitjançant Gauss

1.  **Intercanviem la primera i la segona fila** per tenir un pivot d'unitat:



$$
\left( \begin{array}{ccc|c} 
1 & 7 & 2 & 5 \\
3 & 0 & -1 & 1 \\
-1 & -1 & 0 & a
\end{array} \right)
$$



2.  **Fem zeros sota el primer pivot** ( $F_2 \to F_2 - 3F_1$  i  $F_3 \to F_3 + F_1$ ):

*    $F_2: (3, 0, -1, 1) - 3(1, 7, 2, 5) = (0, -21, -7, -14)$  que simplifiquem dividint per  $-7 	o (0, 3, 1, 2)$ 
*    $F_3: (-1, -1, 0, a) + (1, 7, 2, 5) = (0, 6, 2, a+5)$ 

Matriu resultant:



$$
\left( \begin{array}{ccc|c} 
1 & 7 & 2 & 5 \\
0 & 3 & 1 & 2 \\
0 & 6 & 2 & a+5
\end{array} \right)
$$



3.  **Fem zeros sota el segon pivot** ( $F_3 \to F_3 - 2F_2$ ):

*    $F_3: (0, 6, 2, a+5) - 2(0, 3, 1, 2) = (0, 0, 0, a+5-4) = (0, 0, 0, a+1)$ 

### Condició de compatibilitat

Perquè el sistema sigui compatible, el rang de la matriu de coeficients ha de ser igual al rang de la matriu ampliada (**Teorema de Rouché-Frobenius**). 

L'última fila de la matriu escalonada ens diu que:
*   El rang de la matriu de coeficients és **2**.
*   El rang de la matriu ampliada serà **2** només si l'últim terme és zero.



$$
a + 1 = 0 implies a = -1
$$



### Conclusió

El vector  $u$  es pot escriure com a combinació lineal dels vectors de  $T$  si i només si l'escalar ** $a = -1$ **.


---

## Exercici 6.12: Combinació Lineal de Matrius

### Enunciat

Doneu els valors dels paràmetres  $a$  i  $b$  per als quals la matriu  $\begin{pmatrix} 1 & 0 \\ a & b \end{pmatrix}$  és combinació lineal de  $A = \begin{pmatrix} 1 & 4 \\ -5 & 2 \end{pmatrix}$  i  $B = \begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix}$ .

### Solució


Busquem escalars  $x$  i  $y$  tals que:


$$
x \begin{pmatrix} 1 & 4 \\ -5 & 2 \end{pmatrix} + y \begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ a & b \end{pmatrix}
$$



Això ens dóna un sistema de 4 equacions lineals (una per cada entrada de la matriu):
1.   $x + y = 1$  (entrada 1,1)
2.   $4x + 2y = 0$  (entrada 1,2)
3.   $-5x + 3y = a$  (entrada 2,1)
4.   $2x - y = b$  (entrada 2,2)

### Resolució del sistema

Utilitzem les equacions (1) i (2) per trobar  $x$  i  $y$ :
*   De la segona equació:  $4x = -2y \implies y = -2x$ .
*   Substituïm a la primera:  $x + (-2x) = 1 \implies -x = 1 \implies \mathbf{x = -1}$ .
*   Per tant:  $y = -2(-1) \implies \mathbf{y = 2}$ .

### Càlcul de  $a$  i  $b$ 

Ara que tenim els coeficients de la combinació lineal, els substituïm a les equacions restants:
*   Per a  $a$ :  $a = -5(-1) + 3(2) = 5 + 6 \implies \mathbf{a = 11}$ .
*   Per a  $b$ :  $b = 2(-1) - (2) = -2 - 2 \implies \mathbf{b = -4}$ .

### Conclusió

La matriu donada és combinació lineal de  $A$  i  $B$  si i només si els paràmetres prenen els valors ** $a = 11$ ** i ** $b = -4$ **.


---

## Exercici 6.13: Equació Implícita d’un Subespai

### Enunciat

Donats els vectors  $u = \begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix}$  i  $v = \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$  de  $\mathbb{R}^3$ , trobeu quina condició han de complir les components d'un vector  $w = \begin{pmatrix} x \\ y \\ z \end{pmatrix}$  per a que pertanyi al subespai generat per  $\{u, v\}$ .

### Solució


Un vector  $w$  pertany al subespai generat per  ${u, v}$  si es pot escriure com a combinació lineal d'aquests, és a dir, si existeixen escalars  $\lambda_1, \lambda_2$  tals que:



$$
\lambda_1 \begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix} + \lambda_2 \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} = \begin{pmatrix} x \\ y \\ z \end{pmatrix}
$$



Això planteja un sistema d'equacions que ha de ser compatible. Utilitzem la matriu ampliada i l'escalonem:

### Escalonament de Gauss



$$
\left( \begin{array}{cc|c} 
1 & 0 & x \\
1 & 1 & y \\
2 & 1 & z
\end{array} \right)
$$



1.  **Fem zeros a la primera columna** ( $F_2 \to F_2 - F_1$  i  $F_3 \to F_3 - 2F_1$ ):



$$
\left( \begin{array}{cc|c} 
1 & 0 & x \\
0 & 1 & y - x \\
0 & 1 & z - 2x
\end{array} \right)
$$



2.  **Fem zero a la segona columna** ( $F_3 \to F_3 - F_2$ ):



$$
\left( \begin{array}{cc|c} 
1 & 0 & x \\
0 & 1 & y - x \\
0 & 0 & (z - 2x) - (y - x)
\end{array} \right)
$$



Simplifiquem el terme de l'última fila:



$$
(z - 2x) - (y - x) = z - 2x - y + x = -x - y + z
$$



### Condició de pertinença (Equació implícita)

Perquè el sistema sigui compatible, el terme independent de la fila de zeros ha de ser nul (Teorema de Rouché-Frobenius):



$$
-x - y + z = 0 \implies \mathbf{x + y - z = 0}
$$



### Conclusió

La condició que han de complir les components del vector per pertànyer al subespai generat per  ${u, v}$  és que la suma de les dues primeres components sigui igual a la tercera: ** $x + y - z = 0$ **. Aquesta és l'equació implícita del pla que generen els dos vectors a  $\mathbb{R}^3$ .


---

## Exercici 6.14: Forma Genèrica d’un Subespai de Polinomis

### Enunciat

Doneu la forma genèrica dels polinomis de  $P(\mathbb{R})$  que pertanyen al subespai vectorial generat pel conjunt  $\{1+x, x^2\}$ .

### Solució


Un polinomi  $p(x)$  pertany al subespai generat pel conjunt  $S = \{1+x, x^2\}$  si es pot escriure com una combinació lineal dels elements de  $S$ .

Això vol dir que existeixen dos escalars  $a, b \in \mathbb{R}$  tals que:


$$
p(x) = a(1+x) + b(x^2)
$$



Si desenvolupem l'expressió:


$$
p(x) = a + ax + bx^2
$$



### Forma genèrica

Podem expressar la forma genèrica de dues maneres:

1.  **En funció dels paràmetres**:
    

$$
p(x) = a + ax + bx^2, \quad a, b \in \mathbb{R}
$$



2.  **Mitjançant una condició sobre els coeficients**:
    Si denotem un polinomi genèric de grau  $\leq 2$  com  $p(x) = a_2 x^2 + a_1 x + a_0$ , observem que perquè pertanyi al subespai s'ha de complir que:
    

$$
a_1 = a_0 = a
$$


    Per tant, la forma genèrica és el conjunt de polinomis de grau  $\leq 2$  tals que el seu terme independent i el seu coeficient de grau 1 són iguals.


---

## Exercici 6.15: Igualtat de Subespais i Pertinença

### Enunciat

Siguin  $F = \left\langle \begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ -1 \end{pmatrix} \right\rangle$  i  $G = \left\langle \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 1 \\ -2 \\ 2 \end{pmatrix} \right\rangle$  subespais de  $\mathbb{R}^3$ .

1) Demostreu que  $F = G$ .
2) Sigui  $e = \begin{pmatrix} 9 \\ \sqrt{2}-1 \\ 1-\sqrt{2} \end{pmatrix}$ . Proveu que  $e \in F$  i expresseu-lo com a combinació lineal dels vectors que generen  $F$ .

### Solució


### 1) Demostració de  $F = G$ 

Dos subespais són iguals si tenen la mateixa dimensió i un d'ells està contingut en l'altre. 
Els generadors de  $F$  ( $v_1, v_2$ ) i els de  $G$  ( $w_1, w_2$ ) són linealment independents en ambdós casos, per tant  $\dim(F) = \dim(G) = 2$ . Només cal veure que els generadors de  $G$  es poden escriure com a combinació lineal dels de  $F$ :

*   Per a  $w_1 = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}$ :
    Observem que  $v_1 + v_2 = \begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix} + \begin{pmatrix} 0 \\ 1 \\ -1 \end{pmatrix} = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix} = \mathbf{w_1}$ .
*   Per a  $w_2 = \begin{pmatrix} 1 \\ -2 \\ 2 \end{pmatrix}$ :
    Busquem  $a, b$  tals que  $a v_1 + b v_2 = w_1$ :
     $a(1) + b(0) = 1 \implies a = 1$ 
     $a(-1) + b(1) = -2 \implies -1 + b = -2 \implies b = -1$ 
    Comprovem la 3a component:  $1(1) - 1(-1) = 2$ . Correcte.
    Per tant,  $\mathbf{w_2 = v_1 - v_2}$ .

Com que els generadors de  $G$  pertanyen a  $F$  i tenen la mateixa dimensió, concloem que ** $F = G$ **.

---

### 2) Pertinença del vector  $e$  a  $F$ 

Busquem els escalars  $x, y$  tals que  $x v_1 + y v_2 = e$ :


$$
x \begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix} + y \begin{pmatrix} 0 \\ 1 \\ -1 \end{pmatrix} = \begin{pmatrix} 9 \\ \sqrt{2}-1 \\ 1-\sqrt{2} \end{pmatrix}
$$



1.  De la 1a component: ** $x = 9$ **.
2.  De la 2a component:  $-x + y = \sqrt{2}-1 \implies -9 + y = \sqrt{2}-1 \implies \mathbf{y = 8 + \sqrt{2}}$ .
3.  Comprovem la 3a component:
     $x - y = 9 - (8 + \sqrt{2}) = 1 - \sqrt{2}$ . **Correcte**.

L'existència d'aquests escalars prova que ** $e \in F$ **. La seva expressió com a combinació lineal és:


$$
\mathbf{e = 9 \begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix} + (8+\sqrt{2}) \begin{pmatrix} 0 \\ 1 \\ -1 \end{pmatrix}}
$$




---

## Exercici 6.16: Independència Lineal de Conjunts

### Enunciat

Esbrineu si els conjunts de vectors següents són linealment independents a l'espai vectorial que s'indica.
  
1)  $\{ (1,2,3), (3,6,8) \}$  a  $\mathbb{R}^3$ .
2)  $\{ (2,-3,1), (3,-1,5), (1,-4,3) \}$  a  $\mathbb{R}^3$ .
3)  $\{ (5,4,3), (3,3,2), (8,1,3) \}$  a  $\mathbb{R}^3$ .
4)  $\{ (4,-5,2,6), (2,2,-1,3), (6,-3,3,9), (4,-1,5,6) \}$  a  $\mathbb{R}^4$ .
5)  $\{ (1,0,0,2,5), (0,1,0,3,4), (0,0,1,4,7), (2,-3,4,11,12) \}$  a  $\mathbb{R}^5$ .

### Solució


Recordem que un conjunt de vectors és Linealment Independent (LI) si cap d'ells es pot escriure com a combinació lineal dels altres. Per a conjunts de  $n$  vectors en  $\mathbb{R}^n$ , podem utilitzar el determinant; si el determinant és diferent de zero, el conjunt és LI.

---

### **1)  $\{ (1,2,3), (3,6,8) \}$  a  $\mathbb{R}^3$ **
Dos vectors són linealment dependents si i només si són proporcionals.


$$
(3, 6, 8) = k(1, 2, 3) \implies k=3, \text{ però } 3 \cdot 3 = 9 \neq 8
$$


Com que no són proporcionals, el conjunt és **Linealment Independent (LI)**.

---

### **2)  $\{ (2,-3,1), (3,-1,5), (1,-4,3) \}$  a  $\mathbb{R}^3$ **
Calculem el determinant de la matriu formada pels vectors:


$$
\Delta = \begin{vmatrix} 2 & 3 & 1 \\ -3 & -1 & -4 \\ 1 & 5 & 3 \end{vmatrix} = 2(-3+20) - 3(-9+4) + 1(-15+1) = 34 + 15 - 14 = 35
$$


Com que  $\Delta = 35 \neq 0$ , el conjunt és **Linealment Independent (LI)**.

---

### **3)  $\{ (5,4,3), (3,3,2), (8,1,3) \}$  a  $\mathbb{R}^3$ **
Calculem el determinant:


$$
\Delta = \begin{vmatrix} 5 & 3 & 8 \\ 4 & 3 & 1 \\ 3 & 2 & 3 \end{vmatrix} = 5(9-2) - 3(12-3) + 8(8-9) = 35 - 27 - 8 = 0
$$


Com que el determinant és  $0$ , el conjunt és **Linealment Dependent (LD)**.

---

### **4)  $\{ v_1, v_2, v_3, v_4 \}$  a  $\mathbb{R}^4$ **
Observem les files de la matriu o busquem relacions:


$$
\text{Matriu} = \begin{pmatrix} 4 & 2 & 6 & 4 \\ -5 & 2 & -3 & -1 \\ 2 & -1 & 3 & 5 \\ 6 & 3 & 9 & 6 \end{pmatrix}
$$


Observem que la quarta fila és  $1.5$  vegades la primera fila:  $F_4 = \frac{3}{2} F_1$ . Això implica que el determinant és  $0$  i el rang és menor que 4. El conjunt és **Linealment Dependent (LD)**.

---

### **5)  $\{ v_1, v_2, v_3, v_4 \}$  a  $\mathbb{R}^5$ **
Els tres primers vectors tenen els elements de la base canònica a les 3 primeres posicions. Qualsevol combinació de  $v_1, v_2, v_3$  que vulgui donar  $v_4$  hauria d'utilitzar els coeficients  $2, -3, 4$ :


$$
2v_1 - 3v_2 + 4v_3 = \begin{pmatrix} 2 \\ -3 \\ 4 \\ 2(2)-3(3)+4(4) \\ 2(5)-3(4)+4(7) \end{pmatrix} = \begin{pmatrix} 2 \\ -3 \\ 4 \\ 11 \\ 26 \end{pmatrix}
$$


Com que  $26 \neq 12$  (l'última component del quart vector), veiem que  $v_4$  no és combinació lineal de la resta. Com que  $v_1, v_2, v_3$  són clarament LI entre ells, tot el conjunt és **Linealment Independent (LI)**.


---

## Exercici 6.17: Dependència Lineal i Paràmetres

### Enunciat

A l'espai vectorial  $\mathbb{R}^4$  considerem els vectors:


$$
v_1 = \begin{pmatrix} 1 \\ 1 \\ 0 \\ a \end{pmatrix}, v_2 = \begin{pmatrix} 3 \\ -1 \\ b \\ -1 \end{pmatrix}, v_3 = \begin{pmatrix} -3 \\ 5 \\ a \\ -4 \end{pmatrix}
$$



Determineu  $a$  i  $b$  per tal que siguin un conjunt linealment dependent, i en aquest cas expresseu el vector  $0_{\mathbb{R}^4}$  com a combinació lineal no nul·la dels vectors.

### Solució


Tres vectors a  $\mathbb{R}^4$  són linealment dependents (LD) si el rang de la matriu que formen és inferior a 3. Això equival a dir que, en escalonar la matriu per columnes, algun dels pivots s'ha d'anul·lar.

### Escalonament de Gauss

Plantegem la matriu per columnes i l'escalonem:


$$
\begin{pmatrix} 1 & 3 & -3 \\ 1 & -1 & 5 \\ 0 & b & a \\ a & -1 & -4 \end{pmatrix}
$$



1.  Fem zeros a la primera columna ( $F_2 \to F_2 - F_1$  i  $F_4 \to F_4 - aF_1$ ):


$$
\begin{pmatrix} 1 & 3 & -3 \\ 0 & -4 & 8 \\ 0 & b & a \\ 0 & -1-3a & -4+3a \end{pmatrix} \xrightarrow{F_2 \div (-4)} \begin{pmatrix} 1 & 3 & -3 \\ 0 & 1 & -2 \\ 0 & b & a \\ 0 & -1-3a & -4+3a \end{pmatrix}
$$



2.  Fem zeros sota el segon pivot ( $F_3 \to F_3 - bF_2$  i  $F_4 \to F_4 + (1+3a)F_2$ ):
*    $F_3: (0, b, a) - b(0, 1, -2) = (0, 0, a+2b)$ 
*    $F_4: (0, -1-3a, -4+3a) + (1+3a)(0, 1, -2) = (0, 0, -4+3a - 2 - 6a) = (0, 0, -6-3a)$ 

### Condició de Dependència Lineal

Perquè el rang sigui menor que 3, tant la 3a com la 4a fila han de tenir zeros a l'última columna:
1.   $-6 - 3a = 0 \implies 3a = -6 \implies \mathbf{a = -2}$ 
2.   $a + 2b = 0 \implies -2 + 2b = 0 \implies 2b = 2 \implies \mathbf{b = 1}$ 

Els valors buscats són ** $a = -2$ ** i ** $b = 1$ **.

### Combinació lineal nul·la

Amb aquests valors, el sistema resolt per la combinació  $x v_1 + y v_2 + z v_3 = 0$  és:
*    $y - 2z = 0 \implies y = 2z$ 
*    $x + 3y - 3z = 0 \implies x + 3(2z) - 3z = 0 \implies x + 3z = 0 \implies x = -3z$ 

Si triem  $z=1$ , obtenim els coeficients  $x=-3, y=2, z=1$ . L'expressió del vector nul és:


$$
\mathbf{-3 v_1 + 2 v_2 + v_3 = 0}
$$




---

## Exercici 6.18: Prova Teòrica de Dependència

### Enunciat

Siguin  $E$  un  $\mathbb{R}$ -espai vectorial i  $u, v, w$  tres vectors qualssevol d' $E$ . Demostreu que el conjunt  $\{u-v, v-w, w-u\}$  és linealment dependent.

### Solució


Per demostrar que un conjunt de vectors  $\{v_1, v_2, v_3\}$  és linealment dependent (LD), hem de trobar una combinació lineal no trivial que sigui igual al vector nul:


$$
c_1 v_1 + c_2 v_2 + c_3 v_3 = \vec{0}
$$


on almenys un dels coeficients  $c_i$  sigui diferent de zero.

### Demostració

Considerem els vectors del conjunt:
*    $v_1 = u - v$ 
*    $v_2 = v - w$ 
*    $v_3 = w - u$ 

Sumem els tres vectors (triant els coeficients  $c_1 = c_2 = c_3 = 1$ ):


$$
(u - v) + (v - w) + (w - u) = u - v + v - w + w - u
$$


Rearrangem els termes mitjançant les propietats commutativa i associativa de l'espai vectorial:


$$
(u - u) + (v - v) + (w - w) = \vec{0} + \vec{0} + \vec{0} = \vec{0}
$$



### Conclusió

Hem trobat una combinació lineal amb coeficients no nuls ( $1, 1, 1$ ) que dóna el vector nul:


$$
1(u-v) + 1(v-w) + 1(w-u) = \vec{0}
$$


Per tant, per la definició de dependència lineal, el conjunt és **Linealment Dependent (LD)**, independentment de quins siguin els vectors  $u, v, w$  originals.


---

## Exercici 6.19: Independència Lineal i Combinacions de Matrius

### Enunciat

Demostreu que les matrius  $A, B$  i  $C$  següents formen un conjunt linealment independent a  $\mathcal{M}_{2 \times 3}(\mathbb{R})$ .


$$
A = \begin{pmatrix} 0 & 1 & -2 \\ 1 & 1 & 1 \end{pmatrix}, \quad B = \begin{pmatrix} 1 & 1 & -2 \\ 0 & 1 & 1 \end{pmatrix}, \quad C = \begin{pmatrix} -1 & 1 & -2 \\ 3 & -2 & 0 \end{pmatrix}
$$



Proveu que per a qualsevol valor de  $\lambda$  la matriu següent és combinació lineal d' $A$  i  $B$ :


$$
M_\lambda = \begin{pmatrix} \lambda & 2 & -4 \\ 2-\lambda & 2 & 2 \end{pmatrix}
$$



### Solució


### 1) Demostració d'Independència Lineal

Plantegem l'equació  $x A + y B + z C = \mathbf{0}$ :


$$
x \begin{pmatrix} 0 & 1 & -2 \\ 1 & 1 & 1 \end{pmatrix} + y \begin{pmatrix} 1 & 1 & -2 \\ 0 & 1 & 1 \end{pmatrix} + z \begin{pmatrix} -1 & 1 & -2 \\ 3 & -2 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}
$$



Això ens dóna el següent sistema d'equacions per components:
*   (1,1):  $y - z = 0 \implies y = z$ 
*   (2,1):  $x + 3z = 0$ 
*   (2,3):  $x + y = 0 \implies x = -y$ 

Substituint en les unes a les altres:
Com que  $x = -y$  i  $z = y$ , l'equació  $x + 3z = 0$  esdevé  $-y + 3y = 0 \implies 2y = 0 \implies y = 0$ .
Això implica  $x = 0$  i  $z = 0$ .

Com que l'única solució és la trivial ( $x=y=z=0$ ), les matrius  $\{A, B, C\}$  són **Linealment Independents (LI)**.

---

### 2) Prova de la Combinació Lineal  $M_\lambda$ 

Busquem escalars  $x, y$  tals que  $x A + y B = M_\lambda$ :


$$
x \begin{pmatrix} 0 & 1 & -2 \\ 1 & 1 & 1 \end{pmatrix} + y \begin{pmatrix} 1 & 1 & -2 \\ 0 & 1 & 1 \end{pmatrix} = \begin{pmatrix} \lambda & 2 & -4 \\ 2-\lambda & 2 & 2 \end{pmatrix}
$$



Sumant component a component:


$$
\begin{pmatrix} y & x+y & -2(x+y) \\ x & x+y & x+y \end{pmatrix} = \begin{pmatrix} \lambda & 2 & -4 \\ 2-\lambda & 2 & 2 \end{pmatrix}
$$



Comparant les entrades:
*   De (1,1): ** $y = \lambda$ **
*   De (2,1): ** $x = 2 - \lambda$ **

Comprovem la resta de components per verificar la consistència per a qualsevol  $\lambda$ :
*   (1,2), (2,2), (2,3):  $x + y = (2-\lambda) + \lambda = 2$ . **Correcte**.
*   (1,3):  $-2(x+y) = -2(2) = -4$ . **Correcte**.

Havent trobat escalars que satisfan totes les equacions per a qualsevol  $\lambda$ , queda provat que  $M_\lambda$  és combinació lineal de  $A$  i  $B$ :


$$
\mathbf{M_\lambda = (2-\lambda) A + \lambda B}
$$




---

## Exercici 6.20: Dependència Lineal de Polinomis

### Enunciat

Demostreu que els polinomis  $p_1(x) = -1 + 2x + x^2$ ,  $p_2(x) = 1 + x^2$  i  $p_3(x) = x + x^2$  són linealment dependents a l'espai  $P(\mathbb{R})$ .

### Solució


Per demostrar que tres polinomis són linealment dependents, podem treballar amb els seus coeficients respecte a la base canònica de  $P_2(\mathbb{R})$ , que és  $\{1, x, x^2\}$ . 

### Representació vectorial

Escrivim els coeficients de cada polinomi com a vectors de  $\mathbb{R}^3$ :
*    $p_1(x) = -1 + 2x + x^2 \implies v_1 = (-1, 2, 1)$ 
*    $p_2(x) = 1 + 0x + x^2 \implies v_2 = (1, 0, 1)$ 
*    $p_3(x) = 0 + 1x + x^2 \implies v_3 = (0, 1, 1)$ 

### Càlcul del Determinant

El conjunt serà linealment dependent si el determinant de la matriu formada per aquests vectors és zero:


$$
\Delta = \begin{vmatrix} -1 & 1 & 0 \\ 2 & 0 & 1 \\ 1 & 1 & 1 \end{vmatrix}
$$



Desenvolupant per la primera fila:


$$
\Delta = -1(0 - 1) - 1(2 - 1) + 0 = -1(-1) - 1(1) = 1 - 1 = 0
$$



Com que el determinant és **zero**, els vectors (i per tant els polinomis) són **Linealment Dependents (LD)**.

### Relació de dependència

Podem trobar la combinació lineal que dóna el polinomi nul buscant els coeficients  $x, y, z$  tals que  $x p_1 + y p_2 + z p_3 = 0$ :


$$
x(-1 + 2x + x^2) + y(1 + x^2) + z(x + x^2) = 0
$$


Observem que:


$$
1 \cdot p_1(x) + 1 \cdot p_2(x) = (-1+1) + (2x) + (1+1)x^2 = 2x + 2x^2 = 2(x + x^2) = 2 p_3(x)
$$


Per tant, la relació és:


$$
\mathbf{p_1(x) + p_2(x) - 2 p_3(x) = 0}
$$




---

## Exercici 6.21: Propietats de la Dependència Lineal

### Enunciat

Si  $\{e_1, e_2, \dots, e_r\}$  és un conjunt de vectors linealment dependent (LD) d'un espai vectorial, és cert que qualsevol  $e_i$  es pot escriure com a combinació lineal dels altres vectors del conjunt? Demostreu-ho o doneu un contraexemple.

### Solució


La resposta a aquesta afirmació és **FALS**. 

La definició de dependència lineal ens diu que existeix **almenys un** vector del conjunt que es pot escriure com a combinació lineal dels altres, però no garanteix que **qualsevol** d'ells ho pugui ser.

### Justificació Teòrica

Un conjunt és LD si existeixen escalars  $c_1, c_2, \dots, c_r$ , **no tots nuls**, tals que:


$$
c_1 e_1 + c_2 e_2 + \dots + c_r e_r = \vec{0}
$$



Si volem aïllar un vector concret  $e_j$  en funció dels altres:


$$
e_j = -\frac{1}{c_j} \sum_{i \neq j} c_i e_i
$$


Perquè això sigui possible, el coeficient  $c_j$  ha de ser **diferent de zero**. Com que la definició només garanteix que un dels coeficients és no nul, només podem assegurar que el vector corresponent a aquest coeficient es pot expressar com a combinació lineal dels altres.

### Contraexemple

Considerem l'espai  $\mathbb{R}^2$  i el conjunt de vectors:


$$
v_1 = \begin{pmatrix} 1 \\ 0 \end{pmatrix}, \quad v_2 = \begin{pmatrix} 2 \\ 0 \end{pmatrix}, \quad v_3 = \begin{pmatrix} 0 \\ 1 \end{pmatrix}
$$



1.  **El conjunt és LD**: Podem veure que  $2v_1 - 1v_2 + 0v_3 = \vec{0}$ . Com que hem trobat coeficients no nuls ( $2$  i  $-1$ ), el conjunt és linealment dependent.
2.  ** $v_3$  no és combinació lineal**: Intentem escriure  $v_3$  com a combinació de  $v_1$  i  $v_2$ :
    

$$
a \begin{pmatrix} 1 \\ 0 \end{pmatrix} + b \begin{pmatrix} 2 \\ 0 \end{pmatrix} = \begin{pmatrix} a+2b \\ 0 \end{pmatrix}
$$


    És impossible obtenir la segona component  $1$  del vector  $v_3 = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$ .

Per tant, hem trobat un vector ( $v_3$ ) d'un conjunt LD que no es pot escriure com a combinació lineal de la resta del conjunt.


---

## Exercici 6.22: Veritat o Fals sobre Independència i Generadors

### Enunciat

Esbrineu si les afirmacions següents sobre conjunts de vectors en un espai vectorial  $E$  són certes, demostrant-ho si és el cas i donant-ne un contraexemple altrament.

1) Si  $\{e_1, \dots, e_r\}$  és un conjunt LI i  $v \neq e_i$  per a tot  $i$ , aleshores  $\{e_1, \dots, e_r, v\}$  és LI.
2) Si  $\{e_1, \dots, e_r\}$  és un conjunt LI i  $v \notin \langle e_1, \dots, e_r \rangle$ , aleshores  $\{e_1, \dots, e_r, v\}$  és LI.
3) Si  $\{e_1, \dots, e_r\}$  és un conjunt generador de  $E$  i  $v \neq e_i$  per a tot  $i$ , aleshores  $\{e_1, \dots, e_r, v\}$  és un conjunt generador de  $E$ .
4) Si  $\{e_1, \dots, e_r\}$  és un conjunt generador de  $E$  i  $e_r \in \langle e_1, \dots, e_{r-1} \rangle$ , aleshores  $\{e_1, \dots, e_{r-1} \}$  és un conjunt generador de  $E$ .
5) Tot conjunt amb un sol vector és linealment independent.

### Solució


### 1) Fals
El fet que  $v$  no sigui idèntic a cap dels vectors del conjunt no garanteix que no sigui una combinació lineal d'ells.
*   **Contraexemple**: A  $\mathbb{R}^2$ , sigui  $e_1 = (1, 0)$ . El conjunt  $\{e_1\}$  és LI. Sigui  $v = (2, 0)$ . Es compleix que  $v \neq e_1$ , però el conjunt  $\{ (1,0), (2,0) \}$  és LD ja que  $v = 2e_1$ .

### 2) Cert
Aquesta és la propietat d'extensió de conjunts LI.
*   **Demostració**: Suposem que  $c_1 e_1 + \dots + c_r e_r + c v = 0$ . Si  $c \neq 0$ , podríem aïllar  $v$  com a combinació lineal dels  $e_i$ , cosa que contradiu la hipòtesi  $v \notin \langle e_1, \dots, e_r \rangle$ . Per tant,  $c = 0$ . Llavors ens queda  $\sum c_i e_i = 0$ , i com que els  $e_i$  són LI, tots els  $c_i$  han de ser zero. Com que tots els coeficients són zero, el conjunt és LI.

### 3) Cert
Afegir vectors a un conjunt generador no pot reduir l'espai que aquest genera.
*   **Raonament**: Si  $\langle e_1, \dots, e_r \rangle = E$ , llavors qualsevol vector de  $E$  (inclòs  $v$ ) ja es pot generar. Per tant,  $\langle e_1, \dots, e_r, v \rangle = E$ , i el nou conjunt segueix generant  $E$ .

### 4) Cert
Aquesta és la propietat de reducció de conjunts generadors.
*   **Raonament**: Si  $e_r$  es pot escriure com a combinació lineal de la resta, qualsevol vector que utilitzés  $e_r$  per ser generat pot substituir  $e_r$  per la seva combinació lineal corresponent. L'espai generat no canvia:  $\langle e_1, \dots, e_r \rangle = \langle e_1, \dots, e_{r-1} \rangle$ .

### 5) Fals
Cal tenir en compte el vector nul.
*   **Contraexemple**: El conjunt  $\{ \vec{0} \}$  és **linealment dependent**, ja que la combinació lineal  $c \cdot \vec{0} = \vec{0}$  admet solucions no nuls (qualsevol  $c \neq 0$ ). Qualsevol altre conjunt  $\{v\}$  amb  $v \neq \vec{0}$  sí que seria LI.


---

## Exercici 6.23: Canvi de Base i Coordenades en R4

### Enunciat

Considereu el conjunt de vectors  $\mathcal{B} = \{ v_1, v_2, v_3, v_4 \}$  a  $\mathbb{R}^4$ :


$$
v_1 = \begin{pmatrix} 1 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \quad v_2 = \begin{pmatrix} 0 \\ 0 \\ 1 \\ 1 \end{pmatrix}, \quad v_3 = \begin{pmatrix} 1 \\ 0 \\ 0 \\ 4 \end{pmatrix}, \quad v_4 = \begin{pmatrix} 0 \\ 0 \\ 0 \\ 2 \end{pmatrix}
$$



1) Demostreu que formen una base de  $\mathbb{R}^4$ .
2) Trobeu les coordenades del vector  $w = \begin{pmatrix} 1 \\ 0 \\ 2 \\ -3 \end{pmatrix}$  en aquesta base.
3) Trobeu les coordenades d'un vector arbitrari  $u = \begin{pmatrix} x \\ y \\ z \\ t \end{pmatrix}$  en aquesta base.

### Solució


### 1) Demostració de la Base

En un espai de dimensió  $n$ , un conjunt de  $n$  vectors formen una base si i només si són linealment independents. Com que  $\dim(\mathbb{R}^4) = 4$ , només cal comprovar que el determinant de la matriu formada per aquests vectors és diferent de zero:



$$
\Delta = \begin{vmatrix} 1 & 0 & 1 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 1 & 4 & 2 \end{vmatrix}
$$



Desenvolupant per la segona fila (que només té un element no nul):


$$
\Delta = -1 \cdot \begin{vmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 1 & 4 & 2 \end{vmatrix} = (-1) \cdot (-1) \cdot \begin{vmatrix} 1 & 0 \\ 4 & 2 \end{vmatrix} = 1 \cdot (2 - 0) = 2
$$



Com que  $\Delta = 2 \neq 0$ , els vectors són linealment independents i formen una **base de  $\mathbb{R}^4$ **.

---

### 2) Coordenades del vector  $w$ 

Busquem els escalars  $c_1, c_2, c_3, c_4$  tals que  $c_1 v_1 + c_2 v_2 + c_3 v_3 + c_4 v_4 = w$ :


$$
\begin{cases} c_1 + c_3 = 1 \\ c_1 = 0 \\ c_2 = 2 \\ c_2 + 4c_3 + 2c_4 = -3 \end{cases}
$$



Resolem el sistema:
1.  De la 2a eq: ** $c_1 = 0$ **.
2.  Substituim en la 1a:  $0 + c_3 = 1 \implies \mathbf{c_3 = 1}$ .
3.  De la 3a eq: ** $c_2 = 2$ **.
4.  Substituim en la 4a:  $2 + 4(1) + 2c_4 = -3 \implies 6 + 2c_4 = -3 \implies 2c_4 = -9 \implies \mathbf{c_4 = -4.5}$ .

Les coordenades de  $w$  en la base  $\mathcal{B}$  són: ** $(0, 2, 1, -4.5)_{\mathcal{B}}$ **.

---

### 3) Coordenades d'un vector arbitrari  $(x, y, z, t)$ 

Busquem el canvi de base genèric:


$$
\begin{cases} c_1 + c_3 = x \\ c_1 = y \\ c_2 = z \\ c_2 + 4c_3 + 2c_4 = t \end{cases}
$$



Aillant cada coeficient:
*   ** $c_1 = y$ **
*   ** $c_2 = z$ **
*    $c_3 = x - c_1 \implies \mathbf{c_3 = x - y}$ 
*    $2c_4 = t - c_2 - 4c_3 = t - z - 4(x - y) = t - z - 4x + 4y \implies \mathbf{c_4 = -2x + 2y - 0.5z + 0.5t}$ 

Per tant, les coordenades del vector  $(x,y,z,t)$  són:


$$
(y, z, x-y, -2x + 2y - 0.5z + 0.5t)_\mathcal{B}
$$




---

## Exercici 6.24: Base de l’Espai de Matrius 2x2

### Enunciat

Sigui  $\mathcal{B} = \left\{ \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}, \begin{pmatrix} 1 & 1 \\ 0 & 0 \end{pmatrix}, \begin{pmatrix} 1 & 2 \\ 1 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} \right\}$ .

Comproveu que és una base de  $\mathcal{M}_2(\mathbb{R})$ .
Doneu les coordenades d' $A = \begin{pmatrix} 1 & 3 \\ 3 & 1 \end{pmatrix}$  en la base  $\mathcal{B}$ .

### Solució


### 1) Comprovació de la Base

L'espai de les matrius  $2 \times 2$  té dimensió 4. Com que el conjunt  $\mathcal{B}$  té 4 matrius, només cal demostrar que són linealment independents. Podem representar cada matriu com un vector de  $\mathbb{R}^4$  (per files) i calcular el determinant de la matriu de transició:

Les matrius en forma vectorial són:
*    $v_1 = (1, 0, 0, 0)$ 
*    $v_2 = (1, 1, 0, 0)$ 
*    $v_3 = (1, 2, 1, 0)$ 
*    $v_4 = (0, 0, 0, 1)$ 

Construïm la matriu per columnes:


$$
M = \begin{pmatrix} 1 & 1 & 1 & 0 \\ 0 & 1 & 2 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}
$$



Aquesta matriu és **triangular superior**, per tant el seu determinant és el producte dels elements de la diagonal principal:


$$
\Delta = 1 \cdot 1 \cdot 1 \cdot 1 = 1
$$



Com que  $\Delta \neq 0$ , les matrius són linealment independents i formen una **base de  $\mathcal{M}_2(\mathbb{R})$ **.

---

### 2) Coordenades de la matriu  $A$ 

Busquem els escalars  $c_1, c_2, c_3, c_4$  tals que:


$$
c_1 \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} + c_2 \begin{pmatrix} 1 & 1 \\ 0 & 0 \end{pmatrix} + c_3 \begin{pmatrix} 1 & 2 \\ 1 & 0 \end{pmatrix} + c_4 \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} = \begin{pmatrix} 1 & 3 \\ 3 & 1 \end{pmatrix}
$$



Igualant component a component obtenim el sistema:
1.  **Component (2,1)**:  $c_3 = 3$ 
2.  **Component (2,2)**:  $c_4 = 1$ 
3.  **Component (1,2)**:  $c_2 + 2c_3 = 3 \implies c_2 + 2(3) = 3 \implies c_2 = -3$ 
4.  **Component (1,1)**:  $c_1 + c_2 + c_3 = 1 \implies c_1 - 3 + 3 = 1 \implies c_1 = 1$ 

Les coordenades de la matriu  $A$  en la base  $\mathcal{B}$  són:


$$
(1, -3, 3, 1)_\mathcal{B}
$$




---

## Exercici 6.25: Base en l’Espai de Polinomis P3

### Enunciat

Sigui  $P_3(\mathbb{R})$  l'espai vectorial dels polinomis de grau com a molt 3. 

1) Demostreu que els polinomis  $1 + x, -1 + x, 1 + x^2$  i  $1 - x + x^3$  formen una base de  $P_3(\mathbb{R})$ .
2) Doneu les coordenades del polinomi  $q(x) = -5 + 6x + 3x^2 + x^3$  en aquesta base.

### Solució


### 1) Demostració de la Base

L'espai  $P_3(\mathbb{R})$  té dimensió 4. Per demostrar que els quatre polinomis donats formen una base, hem de veure que són linealment independents. Treballarem amb la matriu de coeficients respecte a la base canònica  $\{1, x, x^2, x^3\}$ :

*    $p_1 = 1 + x \implies (1, 1, 0, 0)$ 
*    $p_2 = -1 + x \implies (-1, 1, 0, 0)$ 
*    $p_3 = 1 + x^2 \implies (1, 0, 1, 0)$ 
*    $p_4 = 1 - x + x^3 \implies (1, -1, 0, 1)$ 

Construïm la matriu per columnes i calculem el determinant:


$$
\Delta = \begin{vmatrix} 1 & -1 & 1 & 1 \\ 1 & 1 & 0 & -1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{vmatrix}
$$



Desenvolupant per l'última fila:


$$
\Delta = 1 \cdot \begin{vmatrix} 1 & -1 & 1 \\ 1 & 1 & 0 \\ 0 & 0 & 1 \end{vmatrix}
$$


Desenvolupant de nou per l'última fila d'aquest sub-determinant:


$$
\Delta = 1 \cdot 1 \cdot \begin{vmatrix} 1 & -1 \\ 1 & 1 \end{vmatrix} = 1 + 1 = 2
$$



Com que  $\Delta = 2 \neq 0$ , els polinomis són linealment independents i formen una **base de  $P_3(\mathbb{R})$ **.

---

### 2) Coordenades del polinomi  $q(x)$ 

Busquem els escalars  $c_1, c_2, c_3, c_4$  tals que:


$$
c_1 (1+x) + c_2 (-1+x) + c_3 (1+x^2) + c_4 (1-x+x^3) = -5 + 6x + 3x^2 + x^3
$$



Igualem els coeficients de cada potència de  $x$ :
*   **Terme  $x^3$ **:  $c_4 = 1$ 
*   **Terme  $x^2$ **:  $c_3 = 3$ 
*   **Terme  $x^1$ **:  $c_1 + c_2 - c_4 = 6 \implies c_1 + c_2 - 1 = 6 \implies c_1 + c_2 = 7$ 
*   **Terme  $x^0$ **:  $c_1 - c_2 + c_3 + c_4 = -5 \implies c_1 - c_2 + 3 + 1 = -5 \implies c_1 - c_2 = -9$ 

Tenim un sistema de dues equacions amb dues incògnites ( $c_1, c_2$ ):
Sumant les dues equacions:  $2c_1 = -2 \implies \mathbf{c_1 = -1}$ .
Substituint:  $-1 + c_2 = 7 \implies \mathbf{c_2 = 8}$ .

Les coordenades del polinomi  $q(x)$  en la base donada són:


$$
(-1, 8, 3, 1)_\mathcal{B}
$$




---

## Exercici 6.26: Base i Equació Implícita d’un Subespai

### Enunciat

Considereu el subespai  $F = \left\langle \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 4 \\ 1 \\ -1 \end{pmatrix}, \begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix} \right\rangle$  a  $\mathbb{R}^3$ . Trobeu una base de  $F$  i la condició (en forma de sistema d'equacions lineals homogènies) que ha de satisfer un vector  $\begin{pmatrix} x \\ y \\ z \end{pmatrix}$  per pertànyer a  $F$ .

### Solució


### 1) Càlcul de la Base de  $F$ 

Tenim tres vectors generadors:  $v_1 = (0, 1, 1)$ ,  $v_2 = (4, 1, -1)$  i  $v_3 = (2, 1, 0)$ . Comprovem si són linealment independents observant si un es pot escriure com a combinació dels altres:


$$
\frac{1}{2} v_1 + \frac{1}{2} v_2 = \begin{pmatrix} 0 \\ 0.5 \\ 0.5 \end{pmatrix} + \begin{pmatrix} 2 \\ 0.5 \\ -0.5 \end{pmatrix} = \begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix} = v_3
$$



Com que  $v_3$  és combinació lineal de  $v_1$  i  $v_2$ , el podem descartar. Els vectors  $v_1$  i  $v_2$  són linealment independents (no són proporcionals), per tant una base de  $F$  és:


$$
\mathcal{B_F = \left\{ \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 4 \\ 1 \\ -1 \end{pmatrix} \right\}}
$$


Això implica que  $\dim(F) = 2$  (és un pla a  $\mathbb{R}^3$ ).

---

### 2) Equació Implícita del Subespai

Un vector  $(x, y, z)$  pertany al subespai  $F$  si es pot escriure com a combinació lineal dels vectors de la base. Això equival a dir que el determinant de la matriu formada pels vectors de la base i el vector genèric ha de ser zero:



$$
\begin{vmatrix} 0 & 4 & x \\ 1 & 1 & y \\ 1 & -1 & z \end{vmatrix} = 0
$$



Desenvolupant el determinant (per exemple, per la primera fila):


$$
0 \cdot \begin{vmatrix} 1 & y \\ -1 & z \end{vmatrix} - 4 \cdot \begin{vmatrix} 1 & y \\ 1 & z \end{vmatrix} + x \cdot \begin{vmatrix} 1 & 1 \\ 1 & -1 \end{vmatrix} = 0
$$




$$
-4(z - y) + x(-1 - 1) = 0
$$




$$
-4z + 4y - 2x = 0
$$



Dividint tota l'equació per  $-2$  per simplificar:


$$
\mathbf{x - 2y + 2z = 0}
$$



Aquesta és l'equació implícita (o condició de pertinença) que defineix el subespai  $F$ . Qualsevol vector que satisfaci aquesta igualtat pertany a  $F$ .


---

## Exercici 6.27: Igualtat de Subespais i Coordenades en R4

### Enunciat

Considereu els subespais de  $\mathbb{R}^4$ :


$$
F = \left\langle \begin{pmatrix} 1 \\ -1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ -1 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 0 \\ -1 \end{pmatrix} \right\rangle, \quad G = \left\langle \begin{pmatrix} 1 \\ 0 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 1 \\ -2 \\ 2 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ -1 \\ 1 \end{pmatrix} \right\rangle
$$



1) Proveu que  $F=G$  i que els conjunts generadors donats són bases.
2) Esbrineu si algun dels vectors  $w_1 = \begin{pmatrix} \sqrt{3} \\ \sqrt{2}-1 \\ 1-\sqrt{2} \\ 0 \end{pmatrix}$  i  $w_2 = \begin{pmatrix} 0 \\ 1 \\ 0 \\ 0 \end{pmatrix}$  pertany a  $F$ .
3) Si és el cas, doneu-ne les coordenades en les dues bases.

### Solució


### 1) Comprovació de la Base i Igualtat  $F=G$ 

### Per al subespai  $F$ :
Comprovem si els vectors generadors  $\{v_1, v_2, v_3\}$  són linealment independents (LI):


$$
\begin{pmatrix} 1 & 0 & 1 \\ -1 & 1 & 0 \\ 1 & -1 & 0 \\ 0 & 1 & -1 \end{pmatrix} \xrightarrow[f_3+f_2]{f_2+f_1} \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \\ 0 & 1 & -1 \end{pmatrix} \implies \text{Rang } 3
$$


(Els vectors són LI, per tant formen una base de  $F$ ). Observant els vectors, tots compleixen la condició  $y + z = 0$ . Per tant, l'equació de  $F$  és ** $y + z = 0$ **.

### Per al subespai  $G$ :
Comprovem els generadors  $\{u_1, u_2, u_3\}$ :


$$
\text{Rang} \begin{pmatrix} 1 & 1 & 0 \\ 0 & -2 & 1 \\ 0 & 2 & -1 \\ 0 & 0 & 1 \end{pmatrix} \implies \text{Rang } 3
$$


(Els vectors són LI, base de  $G$ ). Tots els vectors de  $G$  també compleixen ** $y + z = 0$ **.
Com que  $\dim(F) = \dim(G) = 3$  i ambdós estan definits per la mateixa equació implícita a  $\mathbb{R}^4$ , concloem que ** $F = G$ **.

---

### 2) Pertinença de  $w_1$  i  $w_2$ 

Utilitzem l'equació implícita  $y + z = 0$ :
*   **Vector  $w_1$ **:  $(\sqrt{2}-1) + (1-\sqrt{2}) = 0$ . **Pertany a  $F$ **.
*   **Vector  $w_2$ **:  $1 + 0 = 1 \neq 0$ . **No pertany a  $F$ **.

---

### 3) Coordenades de  $w_1$ 

### En la base de  $F$  ( $\{v_1, v_2, v_3\}$ ):
Busquem  $c_1, c_2, c_3$  tals que  $c_1 v_1 + c_2 v_2 + c_3 v_3 = w_1$ . Obtenim el sistema:
1.  $c_1 + c_3 = \sqrt{3}$ 
2.  $-c_1 + c_2 = \sqrt{2}-1$ 
3.  $c_2 - c_3 = 0 \implies c_2 = c_3$ 

Resolent:
 $c_2 = c_3 = \frac{\sqrt{3} + \sqrt{2} - 1}{2}, \quad c_1 = \frac{\sqrt{3} - \sqrt{2} + 1}{2}$ 
Coordenades: ** $(\frac{\sqrt{3} - \sqrt{2} + 1}{2}, \frac{\sqrt{3} + \sqrt{2} - 1}{2}, \frac{\sqrt{3} + \sqrt{2} - 1}{2})_F$ **

### En la base de  $G$  ( $\{u_1, u_2, u_3\}$ ):
Busquem  $k_1, k_2, k_3$  tals que  $k_1 u_1 + k_2 u_2 + k_3 u_3 = w_1$ :
1.  $k_1 + k_2 = \sqrt{3}$ 
2.  $-2k_2 + k_3 = \sqrt{2}-1$ 
3.  $k_3 = 0$ 

Resolent:
 $k_3 = 0, \quad k_2 = \frac{1-\sqrt{2}}{2}, \quad k_1 = \sqrt{3} - \frac{1-\sqrt{2}}{2} = \frac{2\sqrt{3}-1+\sqrt{2}}{2}$ 
Coordenades: ** $(\frac{2\sqrt{3}-1+\sqrt{2}}{2}, \frac{1-\sqrt{2}}{2}, 0)_G$ **


---

## Exercici 6.28: Prova de Base mitjançant Combinacions

### Enunciat

Sigui  $\{v_1, v_2, v_3\}$  una base d'un espai vectorial  $E$ . Demostreu que el conjunt  $\{u_1, u_2, u_3\}$  definit per:


$$
u_1 = v_1 + 2v_2, \quad u_2 = 2v_2 + 3v_3, \quad u_3 = 3v_3 + v_1
$$


també és una base d' $E$ .

### Solució


### Resolució del Problema

Com que la dimensió de l'espai  $E$  és 3 (ja que té una base de 3 vectors) i el conjunt  $\{u_1, u_2, u_3\}$  té exactament 3 vectors, per demostrar que és una base només cal provar que aquests vectors són **linealment independents**.

### Mètode 1: Definició d'Independència Lineal
Suposem una combinació lineal nul·la:


$$
c_1 u_1 + c_2 u_2 + c_3 u_3 = \vec{0}
$$



Substituïm els vectors  $u_i$  per la seva definició:


$$
c_1(v_1 + 2v_2) + c_2(2v_2 + 3v_3) + c_3(3v_3 + v_1) = \vec{0}
$$



Reagrupem els termes segons els vectors de la base original  $\{v_1, v_2, v_3\}$ :


$$
(c_1 + c_3)v_1 + (2c_1 + 2c_2)v_2 + (3c_2 + 3c_3)v_3 = \vec{0}
$$



Com que  $\{v_1, v_2, v_3\}$  és una base, els seus vectors són linealment independents. Per tant, els coeficients de la combinació han de ser zero:
1.   $c_1 + c_3 = 0$ 
2.   $2c_1 + 2c_2 = 0 \implies c_1 + c_2 = 0$ 
3.   $3c_2 + 3c_3 = 0 \implies c_2 + c_3 = 0$ 

Resolem el sistema:
*   De (2):  $c_1 = -c_2$ 
*   De (3):  $c_3 = -c_2$ 
*   Substituïm en (1):  $(-c_2) + (-c_2) = 0 \implies -2c_2 = 0 \implies \mathbf{c_2 = 0}$ 
Això implica que ** $c_1 = 0$ ** i ** $c_3 = 0$ **. Com que l'única solució és la trivial, els vectors són LI.

### Mètode 2: Determinant de la Matriu de Transició
Podem construir la matriu on cada columna representa un vector  $u_i$  expressat en la base  $\{v_1, v_2, v_3\}$ :


$$
M = \begin{pmatrix} 1 & 0 & 1 \\ 2 & 2 & 0 \\ 0 & 3 & 3 \end{pmatrix}
$$



Calculem el seu determinant:


$$
\det(M) = 1 \cdot \begin{vmatrix} 2 & 0 \\ 3 & 3 \end{vmatrix} + 1 \cdot \begin{vmatrix} 2 & 2 \\ 0 & 3 \end{vmatrix} = (6 - 0) + (6 - 0) = 12
$$



Com que  $\det(M) = 12 \neq 0$ , els vectors són linealment independents i, per tant, formen una **base d' $E$ **.


---

## Exercici 6.29: Base d’un Subespai a R5 i Extensió

### Enunciat

Trobeu una base del subespai  $E$  de  $\mathbb{R}^5$  i completeu-la a una base de  $\mathbb{R}^5$ , sent:


$$
E = \left\{ \begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{pmatrix} \in \mathbb{R}^5 : x_3 = x_1 + x_2 - x_4, \, x_5 = x_2 - x_1 \right\}
$$



### Solució


### 1) Trobar una base del subespai  $E$ 

El subespai  $E$  està definit per dues equacions lineals a  $\mathbb{R}^5$ . Per tant, la seva dimensió serà  $5 - 2 = 3$ . Expressem un vector genèric de  $E$  en funció dels paràmetres lliures ( $x_1, x_2, x_4$ ):



$$
\begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{pmatrix} = \begin{pmatrix} x_1 \\ x_2 \\ x_1 + x_2 - x_4 \\ x_4 \\ x_2 - x_1 \end{pmatrix}
$$



Podem desglossar aquest vector com a combinació lineal dels paràmetres:


$$
\begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{pmatrix} = x_1 \begin{pmatrix} 1 \\ 0 \\ 1 \\ 0 \\ -1 \end{pmatrix} + x_2 \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \\ 1 \end{pmatrix} + x_4 \begin{pmatrix} 0 \\ 0 \\ -1 \\ 1 \\ 0 \end{pmatrix}
$$



Els vectors obtinguts són linealment independents (es pot observar per la posició dels zeros i uns). Per tant, una base de  $E$  és:


$$
\mathcal{B_E = \left\{ \begin{pmatrix} 1 \\ 0 \\ 1 \\ 0 \\ -1 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ -1 \\ 1 \\ 0 \end{pmatrix} \right\}}
$$



---

### 2) Completar a una base de  $\mathbb{R}^5$ 

Per completar la base de  $E$  fins a una base de tot l'espai  $\mathbb{R}^5$ , hem d'afegir 2 vectors que siguin linealment independents respecte als tres anteriors. 

Col·loquem els vectors de la base  $\mathcal{B}_E$  en una matriu i busquem vectors de la base canònica que mantinguin el rang màxim:


$$
M = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 1 & 1 & -1 \\ 0 & 0 & 1 \\ -1 & 1 & 0 \end{pmatrix}
$$



Si afegim els vectors  $e_4 = (0, 0, 0, 1, 0)$  i  $e_5 = (0, 0, 0, 0, 1)$ , la matriu global  $5 \times 5$  seria:


$$
\tilde{M} = \begin{pmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 1 & 1 & -1 & 0 & 0 \\ 0 & 0 & 1 & 1 & 0 \\ -1 & 1 & 0 & 0 & 1 \end{pmatrix}
$$



El determinant d'aquesta matriu és producte dels elements de la diagonal (és triangular inferior si reordenem files, o simplement veient els pivots):


$$
\det(\tilde{M}) = 1 \cdot 1 \cdot (-1) \cdot 1 \cdot 1 = -1
$$



Com que el determinant és diferent de zero, el conjunt resultant és una base de  $\mathbb{R}^5$ :


$$
\mathcal{B_{final} = \left\{ \begin{pmatrix} 1 \\ 0 \\ 1 \\ 0 \\ -1 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ -1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 0 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 1 \end{pmatrix} \right\}}
$$




---

## Exercici 6.30: Extensió d’Independència Lineal en Matrius

### Enunciat

Considereu els vectors de  $\mathcal{M}_2(\mathbb{R})$ :


$$
A_1 = \begin{pmatrix} 1 & 4 \\ -1 & 10 \end{pmatrix}, \quad A_2 = \begin{pmatrix} 6 & 10 \\ 1 & 0 \end{pmatrix}, \quad A_3 = \begin{pmatrix} 2 & 2 \\ 1 & 1 \end{pmatrix}
$$


Demostreu que formen un conjunt linealment independent i trobeu un vector que juntament amb aquests tres formi una base de  $\mathcal{M}_2(\mathbb{R})$ .

### Solució


### 1) Demostració de la Independència Lineal

Representem cada matriu com un vector de  $\mathbb{R}^4$  mitjançant els seus coeficients (per files):
*    $v_1 = (1, 4, -1, 10)$ 
*    $v_2 = (6, 10, 1, 0)$ 
*    $v_3 = (2, 2, 1, 1)$ 

Anem a calcular el rang de la matriu formada per aquests vectors mitjançant escalonament de Gauss:



$$
\begin{pmatrix} 1 & 4 & -1 & 10 \\ 6 & 10 & 1 & 0 \\ 2 & 2 & 1 & 1 \end{pmatrix} \xrightarrow[R_3-2R_1]{R_2-6R_1} \begin{pmatrix} 1 & 4 & -1 & 10 \\ 0 & -14 & 7 & -60 \\ 0 & -6 & 3 & -19 \end{pmatrix}
$$



Multipliquem  $R_2$  per  $-3$  i  $R_3$  per  $7$ :


$$
\begin{pmatrix} 1 & 4 & -1 & 10 \\ 0 & 42 & -21 & 180 \\ 0 & -42 & 21 & -133 \end{pmatrix} \xrightarrow{R_3+R_2} \begin{pmatrix} 1 & 4 & -1 & 10 \\ 0 & 42 & -21 & 180 \\ 0 & 0 & 0 & 47 \end{pmatrix}
$$



Com que la matriu té 3 pivots (files no nul·les), el rang és 3. Això prova que les tres matrius són **linealment independents**.

---

### 2) Trobar un quart vector per formar una base

L'espai  $\mathcal{M}_2(\mathbb{R})$  té dimensió 4. Necessitem un vector  $A_4$  que no sigui combinació lineal dels altres tres. Hem vist que el tercer pivot de la matriu escalonada està a la quarta columna (corresponent al component  $(2,2)$  de la matriu). El component  $(2,1)$  (columna 3) s'ha anul·lat.

Provem d'afegir la matriu de la base canònica  $E_{2,1} = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}$ , que correspon al vector  $(0, 0, 1, 0)$ . Comprovem el determinant del conjunt:



$$
\Delta = \begin{vmatrix} 1 & 4 & -1 & 10 \\ 6 & 10 & 1 & 0 \\ 2 & 2 & 1 & 1 \\ 0 & 0 & 1 & 0 \end{vmatrix}
$$



Desenvolupant per l'última fila:


$$
\Delta = -1 \cdot \begin{vmatrix} 1 & 4 & 10 \\ 6 & 10 & 0 \\ 2 & 2 & 1 \end{vmatrix}
$$




$$
\Delta = -1 \cdot \left[ 1(10-0) - 4(6-0) + 10(12-20) \right] = -1 \cdot (10 - 24 - 80) = -1 \cdot (-94) = 94
$$



Com que el determinant és **94  $\neq 0$ **, el conjunt format per  $\{A_1, A_2, A_3, A_4\}$  és linealment independent i, per tant, és una base de  $\mathcal{M}_2(\mathbb{R})$ .

Un vector possible és: ** $A_4 = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}$ **.


---

## Exercici 6.31: Dimensió d’un Subespai amb Paràmetres

### Enunciat

Per a quins valors de  $\lambda$  els vectors generen un subespai vectorial de  $\mathbb{R}^4$  de dimensió 2?


$$
v_1 = \begin{pmatrix} \lambda \\ 0 \\ 1 \\ \lambda \end{pmatrix}, \quad v_2 = \begin{pmatrix} \lambda \\ 1 \\ 2 \\ 1 \end{pmatrix}, \quad v_3 = \begin{pmatrix} 1 \\ 0 \\ \lambda \\ \lambda \end{pmatrix}
$$



### Solució


### Resolució del Problema

La dimensió de l'espai generat pels vectors és igual al **rang** de la matriu formada per aquests vectors. Se'ns demana que aquest rang sigui exactament 2. Això implica que els tres vectors han de ser linealment dependents (rang < 3) i que almenys n'hi ha dos de linealment independents (rang  $\geq 2$ ).

Construïm la matriu per columnes:


$$
M = \begin{pmatrix} \lambda & \lambda & 1 \\ 0 & 1 & 0 \\ 1 & 2 & \lambda \\ \lambda & 1 & \lambda \end{pmatrix}
$$



Perquè el rang sigui menor que 3, tots els menors d'ordre  $3 \times 3$  han de tenir determinant zero.

### 1) Analitzem el menor format per les tres primeres files:


$$
\Delta_{123} = \begin{vmatrix} \lambda & \lambda & 1 \\ 0 & 1 & 0 \\ 1 & 2 & \lambda \end{vmatrix} = 1 \cdot \begin{vmatrix} \lambda & 1 \\ 1 & \lambda \end{vmatrix} = \lambda^2 - 1
$$


Perquè aquest determinant sigui zero:


$$
\lambda^2 - 1 = 0 \implies \lambda = 1 \quad \text{o} \quad \lambda = -1
$$



### 2) Analitzem el menor format per les files 2, 3 i 4:


$$
\Delta_{234} = \begin{vmatrix} 0 & 1 & 0 \\ 1 & 2 & \lambda \\ \lambda & 1 & \lambda \end{vmatrix} = -1 \cdot (\lambda - \lambda^2) = \lambda^2 - \lambda = \lambda(\lambda - 1)
$$


Perquè aquest determinant sigui zero:


$$
\lambda(\lambda - 1) = 0 \implies \lambda = 0 \quad \text{o} \quad \lambda = 1
$$



### Conclusió dels valors de  $\lambda$ :
L'únic valor de  $\lambda$  que anul·la tots els menors d'ordre 3 simultàniament és ** $\lambda = 1$ **. (Si  $\lambda = -1$  o  $\lambda = 0$ , un dels menors seria diferent de zero i el rang seria 3).

### Comprovació per a  $\lambda = 1$ :
Substituïm  $\lambda = 1$  en la matriu original:


$$
M = \begin{pmatrix} 1 & 1 & 1 \\ 0 & 1 & 0 \\ 1 & 2 & 1 \\ 1 & 1 & 1 \end{pmatrix}
$$



Observem les relacions:
*   Fila 4 = Fila 1
*   Fila 3 = Fila 1 + Fila 2
L'espai de files té només dues files independents. Per tant, el rang és 2.

El valor per al qual la dimensió del subespai és 2 és: ** $\lambda = 1$ **.


---

## Exercici 6.32: Subespai de Matrius amb Paràmetres i Bases

### Enunciat

Considereu el subespai  $F_a = \left\langle \begin{pmatrix} 1 & 2 \\ 0 & 2 \end{pmatrix}, \begin{pmatrix} -1 & 1 \\ 0 & 1 \end{pmatrix}, \begin{pmatrix} 2 & a \\ 0 & -1 \end{pmatrix} \right\rangle$  de  $\mathcal{M}_2(\mathbb{R})$ .

1) Trobeu el valor de  $a$  per al qual  $F_a$  és de dimensió 2.
2) Sigui  $a = a_0$  el valor obtingut. Trobeu les condicions en forma de sistema d'equacions lineals perquè una matriu sigui de  $F_{a_0}$ .
3) Raoneu que  $B = \left\{ \begin{pmatrix} 1 & 2 \\ 0 & 2 \end{pmatrix}, \begin{pmatrix} -1 & 1 \\ 0 & 1 \end{pmatrix} \right\}$  i  $B' = \left\{ \begin{pmatrix} 0 & 1 \\ 0 & 1 \end{pmatrix}, \begin{pmatrix} 2 & 1 \\ 0 & 1 \end{pmatrix} \right\}$  són bases de  $F_{a_0}$ .

### Solució


### 1) Valor de  $a$  per a dimensió 2

Escribim els generadors com a vectors de  $\mathbb{R}^4$ :
 $v_1 = (1, 2, 0, 2), \, v_2 = (-1, 1, 0, 1), \, v_3 = (2, a, 0, -1)$ .
Com que  $v_1$  i  $v_2$  són clarament linealment independents, el subespai tindrà dimensió 2 si  $v_3$  és combinació lineal de  $v_1$  i  $v_2$ :
 $c_1 \begin{pmatrix} 1 \\ 2 \\ 0 \\ 2 \end{pmatrix} + c_2 \begin{pmatrix} -1 \\ 1 \\ 0 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 \\ a \\ 0 \\ -1 \end{pmatrix}$ 

Obtenim el sistema:
1.  $c_1 - c_2 = 2$ 
2.  $2c_1 + c_2 = a$ 
3.  $2c_1 + c_2 = -1$ 

Igualant (2) i (3), veiem immediatament que ** $a = -1$ **.
(Resolent el sistema, trobem  $c_1 = 1/3, c_2 = -5/3$ ).

---

### 2) Equacions implícites de  $F_{a_0}$  ( $a = -1$ )

Una matriu  $\begin{pmatrix} x & y \\ z & t \end{pmatrix}$  pertany a  $F_{-1}$  si el vector  $(x, y, z, t)$  és combinació de  $v_1$  i  $v_2$ .
D'una banda, és evident que el tercer component ha de ser zero: ** $z = 0$ **.
D'altra banda, observem que tant en  $v_1$  com en  $v_2$  (i per tant en qualsevol combinació), el segon i quart component coincideixen ( $y = t$ ).
Per tant, el sistema d'equacions implícites és:


$$
\begin{cases} z = 0 \\ y - t = 0 \end{cases}
$$



---

### 3) Raonament de les Bases

*   **Base  $B$ **: Són els dos primers generadors de  $F_{a_0}$ . Ja hem vist que són linealment independents i que generen l'espai de dimensió 2, per tant formen una base.
*   **Base  $B'$ **:
    1.  Comprovem que les matrius compleixen les condicions del subespai:
        *    $\begin{pmatrix} 0 & 1 \\ 0 & 1 \end{pmatrix} \implies z=0, y=t=1$  (Compleix).
        *    $\begin{pmatrix} 2 & 1 \\ 0 & 1 \end{pmatrix} \implies z=0, y=t=1$  (Compleix).
    2.  Comprovem la independència lineal: Clarament no són proporcionals (una té  $x=0$  i l'altra  $x=2$ ).
    Com que són 2 vectors linealment independents en un espai de dimensió 2, automàticament formen una **base de  $F_{a_0}$ **.


---

## Exercici 6.33: Intersecció i Bases de Subespais

### Enunciat

Doneu una base i la dimensió dels espais  $E, F$  i  $E \cap F$  en els casos següents:

1)  $E = \{ (x, y, z) \in \mathbb{R}^3 : 2x = 2y = z \}$  i  $F = \{ (x, y, z) \in \mathbb{R}^3 : x + y = z, \, 3x + y + z = 0 \}$ .
2)  $E = \langle (1, 1, -1), (2, 0, -1), (0, 2, -1) \rangle$  i  $F = \langle (1, 0, -1), (2, 3, 0), (4, 3, -2) \rangle$  a  $\mathbb{R}^3$ .
3)  $E = \{ (a, a+3b, 2a-b, c) : a,b,c \in \mathbb{R} \}$  i  $F = \{ (-2a, b, 0, 3b) : a,b \in \mathbb{R} \}$  a  $\mathbb{R}^4$ .
4)  $E = \{ \begin{pmatrix} a & b \\ c & d \end{pmatrix} \in \mathcal{M}_2(\mathbb{R}) : a=b=c \}$  i  $F = \left\langle \begin{pmatrix} 1 & 1 \\ 2 & 1 \end{pmatrix}, \begin{pmatrix} 2 & 0 \\ -1 & 1 \end{pmatrix} \right\rangle$ .

### Solució


### Cas 1: Rectes a  $\mathbb{R}^3$ 

*   **Subespai  $E$ **:  $2x=z$  i  $2y=z \implies x=y=z/2$ . Vector generador:  $(1, 1, 2)$ .
    ** $\mathcal{B}_E = \{(1, 1, 2)\}, \dim(E)=1$ .**
*   **Subespai  $F$ **: Resolent el sistema  $\begin{cases} x+y-z=0 \\ 3x+y+z=0 \end{cases} \implies y=-2x, z=-x$ .
    ** $\mathcal{B}_F = \{(1, -2, -1)\}, \dim(F)=1$ .**
*   **Intersecció  $E \cap F$ **: Com que els generadors no són proporcionals (no és la mateixa recta), la intersecció és només el vector nul.
    ** $\dim(E \cap F)=0, \mathcal{B}_{E \cap F} = \emptyset$ .**

---

### Cas 2: Plans a  $\mathbb{R}^3$ 

*   **Subespai  $E$ **: El rang dels generadors és 2. Equació:  $3x - y + z = 0$ .
    ** $\mathcal{B}_E = \{(1, 1, -1), (2, 0, -1)\}, \dim(E)=2$ .**
*   **Subespai  $F$ **: El rang és 2. Equació:  $3x - 2y + 3z = 0$ .
    ** $\mathcal{B}_F = \{(1, 0, -1), (2, 3, 0)\}, \dim(F)=2$ .**
*   **Intersecció  $E \cap F$ **: Resolent el sistema de les dues equacions:  $y=2z, x=z/3$ .
    ** $\mathcal{B}_{E \cap F} = \{(1, 6, 3)\}, \dim(E \cap F)=1$ .**

---

### Cas 3: Subespais a  $\mathbb{R}^4$ 

*   **Subespai  $E$ **:  $E = \langle (1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1) \rangle$ . Equació:  $7x_1 - x_2 - 3x_3 = 0$ .
    ** $\dim(E)=3$ .**
*   **Subespai  $F$ **:  $F = \langle (-2, 0, 0, 0), (0, 1, 0, 3) \rangle$ .
    ** $\dim(F)=2$ .**
*   **Intersecció  $E \cap F$ **: Un vector de  $F$  és  $(-2a, b, 0, 3b)$ . Substituint a l'eq. de  $E$ :  $7(-2a) - b = 0 \implies b = -14a$ . Vector:  $(-2a, -14a, 0, -42a) = -2a(1, 7, 0, 21)$ .
    ** $\mathcal{B}_{E \cap F} = \{(1, 7, 0, 21)\}, \dim(E \cap F)=1$ .**

---

### Cas 4: Subespais de matrius  $\mathcal{M}_2(\mathbb{R})$ 

*   **Subespai  $E$ **: Matrius de la forma  $\begin{pmatrix} a & a \\ a & d \end{pmatrix}$ .
    ** $\mathcal{B}_E = \{ \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} \}, \dim(E)=2$ .**
*   **Subespai  $F$ **: Generat per dues matrius independents.
    ** $\dim(F)=2$ .**
*   **Intersecció  $E \cap F$ **: Una matriu de  $F$  és  $\begin{pmatrix} k_1+2k_2 & k_1 \\ 2k_1-k_2 & k_1+k_2 \end{pmatrix}$ .
    Condició  $a=b \implies k_1+2k_2 = k_1 \implies k_2 = 0$ .
    Condició  $b=c \implies k_1 = 2k_1-k_2 \implies k_1 = 0$  (ja que  $k_2=0$ ).
    ** $\dim(E \cap F)=0, \mathcal{B}_{E \cap F} = \emptyset$ .**


---

## Exercici 6.34: Ampliació de Bases de Subespais

### Enunciat

Considereu els subespais  $E$  de l'exercici anterior (Exercici 6.33). Per a cadascun d'ells, amplieu la base fins a obtenir-ne una de l'espai vectorial on es troben.

### Solució


### Resolució del Problema

Per ampliar una base  $\mathcal{B}$  d'un subespai  $E$  fins a una base de l'espai total  $V$ , hem d'afegir vectors de  $V$  que siguin linealment independents respecte als vectors de  $\mathcal{B}$  fins a completar la dimensió de l'espai total.

### 1)  $E \subset \mathbb{R}^3$ ,  $\mathcal{B}_E = \{(1, 1, 2)\}$ 
La dimensió de  $\mathbb{R}^3$  és 3. Necessitem 2 vectors més.
Podem afegir  $e_1 = (1, 0, 0)$  i  $e_2 = (0, 1, 0)$ .
Comprovem el determinant:


$$
\begin{vmatrix} 1 & 1 & 2 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{vmatrix} = -1 \cdot (0-2) = 2 \neq 0
$$


**Base ampliada:  $\{(1, 1, 2), (1, 0, 0), (0, 1, 0)\}$ **.

### 2)  $E \subset \mathbb{R}^3$ ,  $\mathcal{B}_E = \{(1, 1, -1), (2, 0, -1)\}$ 
Necessitem 1 vector més. Provarem amb  $e_1 = (1, 0, 0)$ .


$$
\begin{vmatrix} 1 & 1 & -1 \\ 2 & 0 & -1 \\ 1 & 0 & 0 \end{vmatrix} = 1 \cdot \begin{vmatrix} 1 & -1 \\ 0 & -1 \end{vmatrix} = 1 \cdot (-1) = -1 \neq 0
$$


**Base ampliada:  $\{(1, 1, -1), (2, 0, -1), (1, 0, 0)\}$ **.

### 3)  $E \subset \mathbb{R}^4$ ,  $\mathcal{B}_E = \{(1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1)\}$ 
La dimensió de  $\mathbb{R}^4$  és 4. Necessitem 1 vector més.
L'equació de  $E$  era  $7x_1 - x_2 - 3x_3 = 0$ . Qualsevol vector que no la compleixi serà independent. Per exemple,  $e_1 = (1, 0, 0, 0)$ .
**Base ampliada:  $\{(1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1), (1, 0, 0, 0)\}$ **.

### 4)  $E \subset \mathcal{M}_2(\mathbb{R})$ ,  $\mathcal{B}_E = \{ \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} \}$ 
Necessitem 2 matrius més. Provem amb les de la base canònica  $E_{12}$  i  $E_{21}$ :
 $M_3 = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}, \, M_4 = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}$ .
En forma vectorial a  $\mathbb{R}^4$ :  $(1, 1, 1, 0), (0, 0, 0, 1), (0, 1, 0, 0), (0, 0, 1, 0)$ .
El determinant d'aquests 4 vectors és 1, per tant són LI.
**Base ampliada:  $\left\{ \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix}, \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} \right\}$ **.


---

## Exercici 6.35: Matrius de Canvi de Base

### Enunciat

Considereu la base  $B = \left\{ \begin{pmatrix} 1 \\ 0 \\ -1 \end{pmatrix}, \begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix}, \begin{pmatrix} 3 \\ 4 \\ 0 \end{pmatrix} \right\}$  de  $\mathbb{R}^3$ .

1) Doneu la matriu  $P_B^C$  de canvi de base de la base canònica de  $\mathbb{R}^3$  a  $B$ .
2) Sigui ara  $B' = \left\{ \begin{pmatrix} 2 \\ -1 \\ -2 \end{pmatrix}, \begin{pmatrix} 1 \\ -2 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \right\}$  una altra base de  $\mathbb{R}^3$ . Doneu la matriu  $P_B^{B'}$  de canvi de base de  $B'$  a  $B$ .

### Solució


### 1) Matriu de canvi de base de la canònica a  $B$  ( $P_B^C$ )

Per definició, la matriu  $P_C^B$  (de  $B$  a la canònica) és la que té els vectors de  $B$  per columnes:


$$
P_C^B = \begin{pmatrix} 1 & 1 & 3 \\ 0 & 2 & 4 \\ -1 & 1 & 0 \end{pmatrix}
$$



La matriu que ens demanen,  $P_B^C$  (de la canònica a  $B$ ), és la seva inversa:  $P_B^C = (P_C^B)^{-1}$ .
Calculem la inversa:
*    $\det(P_C^B) = 1(0-4) - 1(0+4) + 3(0+2) = -4 - 4 + 6 = -2$ .
*   Matriu d'adjunts:  $\text{Adj}(P_C^B) = \begin{pmatrix} -4 & -4 & 2 \\ 3 & 3 & -2 \\ -2 & -4 & 2 \end{pmatrix}$ .
*   Transposant i dividint pel determinant:


$$
\mathbf{P_B^C = \begin{pmatrix} 2 & -3/2 & 1 \\ 2 & -3/2 & 2 \\ -1 & 1 & -1 \end{pmatrix}}
$$



---

### 2) Matriu de canvi de base de  $B'$  a  $B$  ( $P_B^{B'}$ )

Sabem que la relació entre coordenades ve donada per:


$$
[v]_B = P_B^{B'} [v]_{B'} \implies P_B^{B'} = P_B^C \cdot P_C^{B'}
$$



On  $P_C^{B'}$  és la matriu amb els vectors de  $B'$  en columnes:


$$
P_C^{B'} = \begin{pmatrix} 2 & 1 & 1 \\ -1 & -2 & 0 \\ -2 & 1 & 1 \end{pmatrix}
$$



Multipliquem les dues matrius:


$$
P_B^{B'} = \begin{pmatrix} 2 & -3/2 & 1 \\ 2 & -3/2 & 2 \\ -1 & 1 & -1 \end{pmatrix} \begin{pmatrix} 2 & 1 & 1 \\ -1 & -2 & 0 \\ -2 & 1 & 1 \end{pmatrix}
$$



Realitzant el producte fila per columna:
*    $f_1: (2\cdot 2 + 1.5 - 2, \, 2 + 3 + 1, \, 2 + 0 + 1) = (3.5, \, 6, \, 3)$ 
*    $f_2: (2\cdot 2 + 1.5 - 4, \, 2 + 3 + 2, \, 2 + 0 + 2) = (1.5, \, 7, \, 4)$ 
*    $f_3: (-2 - 1 + 2, \, -1 - 2 - 1, \, -1 + 0 - 1) = (-1, \, -4, \, -2)$ 

Obtenim la matriu:


$$
\mathbf{P_B^{B'} = \begin{pmatrix} 7/2 & 6 & 3 \\ 3/2 & 7 & 4 \\ -1 & -4 & -2 \end{pmatrix}}
$$




---

## Exercici 6.36: Base de Polinomis i Canvi de Base

### Enunciat

Considereu l'espai vectorial  $P_2(\mathbb{R})$  dels polinomis de grau menor o igual a 2.

1) Proveu que  $B = \{ -1 + 2x + 3x^2, \, x - x^2, \, x - 2x^2 \}$  és una base de  $P_2(\mathbb{R})$  i calculeu la matriu de canvi de base de base canònica a base  $B$ .
2) Trobeu les coordenades de  $p(x) = 3 - x + 2x^2$  en la base  $B$ .

### Solució


### 1) Prova de la Base i Matriu de Canvi de Base

Treballarem amb les coordenades respecte a la base canònica  $C = \{1, x, x^2\}$ . Els vectors de  $B$  són:
 $v_1 = (-1, 2, 3), \, v_2 = (0, 1, -1), \, v_3 = (0, 1, -2)$ .

### Prova de la Base:
Construïm la matriu de  $B$  a la canònica ( $P_C^B$ ) i calculem el seu determinant:


$$
P_C^B = \begin{pmatrix} -1 & 0 & 0 \\ 2 & 1 & 1 \\ 3 & -1 & -2 \end{pmatrix}
$$




$$
\det(P_C^B) = -1 \cdot (1(-2) - 1(-1)) = -1 \cdot (-2 + 1) = 1
$$


Com que el determinant és **1  $\neq 0$ **, els vectors són linealment independents i formen una base.

### Matriu de Canvi de Base (Canònica a  $B$ ):
Hem de calcular la inversa  $P_B^C = (P_C^B)^{-1}$ . Com que el determinant és 1, la inversa és simplement la matriu d'adjunts transposada:


$$
\mathbf{P_B^C = \begin{pmatrix} -1 & 0 & 0 \\ 7 & 2 & 1 \\ -5 & -1 & -1 \end{pmatrix}}
$$



---

### 2) Coordenades del polinomi  $p(x)$ 

El polinomi  $p(x) = 3 - x + 2x^2$  té coordenades  $(3, -1, 2)$  en la base canònica. Per trobar les seves coordenades en la base  $B$ , apliquem la matriu de canvi de base:


$$
[p]_B = P_B^C \cdot [p]_C = \begin{pmatrix} -1 & 0 & 0 \\ 7 & 2 & 1 \\ -5 & -1 & -1 \end{pmatrix} \begin{pmatrix} 3 \\ -1 \\ 2 \end{pmatrix}
$$



Realitzem el producte:
*    $c_1 = -1(3) = -3$ 
*    $c_2 = 7(3) + 2(-1) + 1(2) = 21 - 2 + 2 = 21$ 
*    $c_3 = -5(3) - 1(-1) - 1(2) = -15 + 1 - 2 = -16$ 

Les coordenades de  $p(x)$  en la base  $B$  són: ** $(-3, 21, -16)_B$ **.


---

## Exercici 6.37: Canvi de Base entre Bases no Canòniques

### Enunciat

Siguin  $B = \left\{ \begin{pmatrix} 1 \\ 5 \\ 6 \end{pmatrix}, \begin{pmatrix} -2 \\ -5 \\ 3 \end{pmatrix}, \begin{pmatrix} 1 \\ 4 \\ -1 \end{pmatrix} \right\}$  i  $B' = \left\{ \begin{pmatrix} 1 \\ 3 \\ 2 \end{pmatrix}, \begin{pmatrix} -1 \\ -2 \\ 5 \end{pmatrix}, \begin{pmatrix} 0 \\ 2 \\ 4 \end{pmatrix} \right\}$  bases de  $\mathbb{R}^3$ .

1) Comproveu que efectivament són bases.
2) Doneu la matriu del canvi de la base  $B$  a la base  $B'$  ( $P_{B'}^B$ ) i la de  $B'$  a  $B$  ( $P_B^{B'}$ ).
3) Calculeu les coordenades en les bases  $B$  i  $B'$  del vector que en base canònica té coordenades  $(2, 5, 2)^T$ .

### Solució


### 1) Comprovació de les bases

Un conjunt de 3 vectors a  $\mathbb{R}^3$  és una base si el determinant de la matriu que formen és diferent de zero.

*   **Per a  $B$ **:  $\det(P_C^B) = \begin{vmatrix} 1 & -2 & 1 \\ 5 & -5 & 4 \\ 6 & 3 & -1 \end{vmatrix} = 1(5-12) + 2(-5-24) + 1(15+30) = -7 - 58 + 45 = -20 \neq 0$ .
*   **Per a  $B'$ **:  $\det(P_C^{B'}) = \begin{vmatrix} 1 & -1 & 0 \\ 3 & -2 & 2 \\ 2 & 5 & 4 \end{vmatrix} = 1(-8-10) + 1(12-4) + 0 = -18 + 8 = -10 \neq 0$ .

Ambdós conjunts són bases de  $\mathbb{R}^3$ .

---

### 2) Matrius de canvi de base

Calculem primer les inverses de les matrius a la canònica:
 $P_B^C = (P_C^B)^{-1} = \frac{1}{20} \begin{pmatrix} 7 & -1 & 3 \\ -29 & 7 & -1 \\ -45 & 15 & -5 \end{pmatrix}$ , \,  $P_{B'}^C = (P_C^{B'})^{-1} = \frac{1}{10} \begin{pmatrix} 18 & -4 & 2 \\ 8 & -4 & 2 \\ -19 & 7 & -1 \end{pmatrix}$ 

### Matriu  $P_{B'}^B$  (de  $B$  a  $B'$ ):


$$
P_{B'}^B = P_{B'}^C \cdot P_C^B = \begin{pmatrix} 1.8 & -0.4 & 0.2 \\ 0.8 & -0.4 & 0.2 \\ -1.9 & 0.7 & -0.1 \end{pmatrix} \begin{pmatrix} 1 & -2 & 1 \\ 5 & -5 & 4 \\ 6 & 3 & -1 \end{pmatrix} = \begin{pmatrix} 1 & -1 & 0 \\ 0 & 1 & -1 \\ 1 & 0 & 1 \end{pmatrix}
$$



### Matriu  $P_B^{B'}$  (de  $B'$  a  $B$ ):
És la inversa de l'anterior:


$$
\mathbf{P_B^{B'} = \begin{pmatrix} 1/2 & 1/2 & 1/2 \\ -1/2 & 1/2 & 1/2 \\ -1/2 & -1/2 & 1/2 \end{pmatrix}}
$$



---

### 3) Coordenades del vector  $v = (2, 5, 2)$ 

### En la base  $B$ :


$$
[v]_B = P_B^C \cdot \begin{pmatrix} 2 \\ 5 \\ 2 \end{pmatrix} = \begin{pmatrix} 0.35 & -0.05 & 0.15 \\ -1.45 & 0.35 & -0.05 \\ -2.25 & 0.75 & -0.25 \end{pmatrix} \begin{pmatrix} 2 \\ 5 \\ 2 \end{pmatrix} = \begin{pmatrix} 3/4 \\ -5/4 \\ -5/4 \end{pmatrix}
$$



### En la base  $B'$ :


$$
[v]_{B'} = P_{B'}^C \cdot \begin{pmatrix} 2 \\ 5 \\ 2 \end{pmatrix} = \begin{pmatrix} 1.8 & -0.4 & 0.2 \\ 0.8 & -0.4 & 0.2 \\ -1.9 & 0.7 & -0.1 \end{pmatrix} \begin{pmatrix} 2 \\ 5 \\ 2 \end{pmatrix} = \begin{pmatrix} 2 \\ 0 \\ -1/2 \end{pmatrix}
$$



*Comprovació en  $B'$ *:  $2(1, 3, 2) + 0(-1, -2, 5) - 1/2(0, 2, 4) = (2, 6, 4) - (0, 1, 2) = (2, 5, 2)$ . Correcte.


---

## Exercici 6.38: Canvis de Base en l’Espai de Matrius

### Enunciat

Siguin:
 $B = \left\{ \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} \right\}$ ,
 $B' = \left\{ \begin{pmatrix} 1 & 1 \\ 0 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 1 & 1 \end{pmatrix}, \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix} \right\}$ 
dues bases de  $\mathcal{M}_2(\mathbb{R})$ . Doneu les matrius de canvi de base  $P_{B'}^B$  i  $P_B^{B'}$ .

### Solució


### Resolució del Problema

Identifiquem els elements de l'espai  $\mathcal{M}_2(\mathbb{R})$  amb vectors de  $\mathbb{R}^4$  seguint l'ordre habitual de les entrades de la matriu  $(a_{11}, a_{12}, a_{21}, a_{22})$ .

La base  $B$  és la base canònica de les matrius. La base  $B'$  està formada pels vectors:
 $v'_1 = (1, 1, 0, 0), \, v'_2 = (0, 1, 1, 0), \, v'_3 = (0, 0, 1, 1), \, v'_4 = (0, 0, 0, 1)$ .

### 1) Matriu  $P_B^{B'}$  (de  $B'$  a  $B$ )
Aquesta matriu té per columnes les coordenades dels vectors de  $B'$  expressats en la base  $B$ . Com que  $B$  és la base canònica, només hem de col·locar els vectors de  $B'$  directament:


$$
\mathbf{P_B^{B'} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}}
$$



### 2) Matriu  $P_{B'}^B$  (de  $B$  a  $B'$ )
Aquesta matriu és la inversa de l'anterior:  $P_{B'}^B = (P_B^{B'})^{-1}$ .
Podem calcular-la resolent el sistema  $Y = P_B^{B'} X$ :
*    $y_1 = x_1 \implies x_1 = y_1$ 
*    $y_2 = x_1 + x_2 \implies x_2 = y_2 - y_1$ 
*    $y_3 = x_2 + x_3 \implies x_3 = y_3 - (y_2 - y_1) = y_3 - y_2 + y_1$ 
*    $y_4 = x_3 + x_4 \implies x_4 = y_4 - (y_3 - y_2 + y_1) = y_4 - y_3 + y_2 - y_1$ 

Escrivint els coeficients en la matriu:


$$
\mathbf{P_{B'}^B = \begin{pmatrix} 1 & 0 & 0 & 0 \\ -1 & 1 & 0 & 0 \\ 1 & -1 & 1 & 0 \\ -1 & 1 & -1 & 1 \end{pmatrix}}
$$




---

## Exercici 6.39: Relació entre Coordenades de Bases Diferents

### Enunciat

Considereu els conjunts  $B = \left\{ \begin{pmatrix} 2 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix} \right\}$  i  $B' = \left\{ \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} \right\}$  bases de  $\mathbb{R}^3$ .

Sigui  $u$  un vector de  $\mathbb{R}^3$  que en la base  $B$  té coordenades  $u_B = (x, y, z)^T$  i en la base  $B'$ ,  $u_{B'} = (x', y', z')^T$ . Expresseu  $x, y, z$  en funció de  $x', y', z'$ , i viceversa.

### Solució


### 1) Comprovació de les bases

*   **Det( $P_C^B$ )**:  $\begin{vmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{vmatrix} = 2(4-1) - 1(2-1) + 1(1-2) = 6 - 1 - 1 = 4 \neq 0$ .
*   **Det( $P_C^{B'}$ )**:  $\begin{vmatrix} 0 & 1 & 1 \\ 1 & 0 & 1 \\ 1 & 1 & 0 \end{vmatrix} = -1(0-1) + 1(1-0) = 2 \neq 0$ .
Ambdós conjunts són bases de  $\mathbb{R}^3$ .

---

### 2) Exprexió de  $(x, y, z)$  en funció de  $(x', y', z')$ 

S'obté mitjançant la matriu de canvi de base  $P_B^{B'}$ :


$$
U_B = P_B^{B'} U_{B'} \implies P_B^{B'} = (P_C^B)^{-1} \cdot P_C^{B'}
$$



Calculem la inversa  $(P_C^B)^{-1} = \frac{1}{4} \begin{pmatrix} 3 & -1 & -1 \\ -1 & 3 & -1 \\ -1 & -1 & 3 \end{pmatrix}$ . Multiplicant per  $P_C^{B'}$ :


$$
P_B^{B'} = \frac{1}{4} \begin{pmatrix} 3 & -1 & -1 \\ -1 & 3 & -1 \\ -1 & -1 & 3 \end{pmatrix} \begin{pmatrix} 0 & 1 & 1 \\ 1 & 0 & 1 \\ 1 & 1 & 0 \end{pmatrix} = \begin{pmatrix} -1/2 & 1/2 & 1/2 \\ 1/2 & -1/2 & 1/2 \\ 1/2 & 1/2 & -1/2 \end{pmatrix}
$$



Les equacions són:


$$
\begin{cases} x = -\frac{1}{2}x' + \frac{1}{2}y' + \frac{1}{2}z' \\ y = \frac{1}{2}x' - \frac{1}{2}y' + \frac{1}{2}z' \\ z = \frac{1}{2}x' + \frac{1}{2}y' - \frac{1}{2}z' \end{cases}
$$



---

### 3) Expressió de  $(x', y', z')$  en funció de  $(x, y, z)$ 

S'obté mitjançant la matriu  $P_{B'}^B$ :


$$
U_{B'} = P_{B'}^B U_B \implies P_{B'}^B = (P_C^{B'})^{-1} \cdot P_C^B
$$



Calculem la inversa  $(P_C^{B'})^{-1} = \frac{1}{2} \begin{pmatrix} -1 & 1 & 1 \\ 1 & -1 & 1 \\ 1 & 1 & -1 \end{pmatrix}$ . Multiplicant per  $P_C^B$ :


$$
P_{B'}^B = \frac{1}{2} \begin{pmatrix} -1 & 1 & 1 \\ 1 & -1 & 1 \\ 1 & 1 & -1 \end{pmatrix} \begin{pmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{pmatrix} = \begin{pmatrix} 0 & 1 & 1 \\ 1 & 0 & 1 \\ 1 & 1 & 0 \end{pmatrix}
$$



Les equacions són:


$$
\begin{cases} x' = y + z \\ y' = x + z \\ z' = x + y \end{cases}
$$




---

## Exercici 6.40: Determinació d’una Base a partir de Coordenades

### Enunciat

Sigui  $B = \{ p_1(x), p_2(x), p_3(x) \}$  una base de  $P_2(\mathbb{R})$ . Considerem els polinomis:
 $u(x) = x^2 + x + 2$ , \,  $v(x) = 2x^2 + 3$ , \,  $w(x) = x^2 + x$ .
Si en la base  $B$  les coordenades de  $u(x), v(x)$  i  $w(x)$  són:


$$
u(x)_B = \begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix}, \quad v(x)_B = \begin{pmatrix} 2 \\ 0 \\ 2 \end{pmatrix}, \quad w(x)_B = \begin{pmatrix} 1 \\ 1 \\ -2 \end{pmatrix}
$$


respectivament, doneu les coordenades dels vectors de  $B$  en base canònica  $C = \{x^2, x, 1\}$ .

### Solució


### Resolució del Problema

Siguin  $U_C$  i  $U_B$  les matrius que tenen per columnes les coordenades de  $u, v, w$  en les bases canònica i  $B$  respectivament:


$$
U_C = \begin{pmatrix} 1 & 2 & 1 \\ 1 & 0 & 1 \\ 2 & 3 & 0 \end{pmatrix}, \quad U_B = \begin{pmatrix} 2 & 2 & 1 \\ 1 & 0 & 1 \\ 0 & 2 & -2 \end{pmatrix}
$$



Sabem que la relació entre coordenades és  $U_C = P_C^B \cdot U_B$ , on  $P_C^B$  és la matriu que té per columnes les coordenades dels elements de la base  $B$  expressats en la base canònica. Per tant:


$$
P_C^B = U_C \cdot (U_B)^{-1}
$$



### 1) Càlcul de  $(U_B)^{-1}$ 
Determinant de  $U_B$ :
 $\det(U_B) = 2(0-2) - 2(-2-0) + 1(2-0) = -4 + 4 + 2 = 2$ .

La inversa és:


$$
(U_B)^{-1} = \frac{1}{2} \begin{pmatrix} -2 & 6 & 2 \\ 2 & -4 & -1 \\ 2 & -4 & -2 \end{pmatrix} = \begin{pmatrix} -1 & 3 & 1 \\ 1 & -2 & -0.5 \\ 1 & -2 & -1 \end{pmatrix}
$$



### 2) Producte de matrius


$$
P_C^B = \begin{pmatrix} 1 & 2 & 1 \\ 1 & 0 & 1 \\ 2 & 3 & 0 \end{pmatrix} \begin{pmatrix} -1 & 3 & 1 \\ 1 & -2 & -0.5 \\ 1 & -2 & -1 \end{pmatrix} = \begin{pmatrix} 2 & -3 & -1 \\ 0 & 1 & 0 \\ 1 & 0 & 0.5 \end{pmatrix}
$$



### Resultat Final

Les columnes de la matriu  $P_C^B$  són les coordenades dels vectors de  $B$  en la base canònica:
*    $p_1(x) = (2, 0, 1)_C \implies \mathbf{2x^2 + 1}$ 
*    $p_2(x) = (-3, 1, 0)_C \implies \mathbf{-3x^2 + x}$ 
*    $p_3(x) = (-1, 0, 0.5)_C \implies \mathbf{-x^2 + 0.5}$ 

*Comprovació*: Per exemple,  $u(x) = 2p_1(x) + p_2(x) = 2(2x^2+1) + (-3x^2+x) = x^2+x+2$ . Correcte.


---

