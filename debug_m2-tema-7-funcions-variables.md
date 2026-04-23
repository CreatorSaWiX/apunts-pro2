---
title: "Solucionari: Tema 7: Funcions de diverses variables"
author: "Apunts"
---

# Solucionari: Tema 7: Funcions de diverses variables

*Domini, gràfica, conjunts de nivell, interpretació geomètrica. Funcions contínues.*

---

## Exercici 1: Topologia a R^2

### Enunciat

Considereu els conjunts:
  
$ A = \{(x,y) \in \mathbb{R}^2 : x^2 + y^2 < 1\}$

$ B = \{(x,y) \in \mathbb{R}^2 : |y| \le x^2, y \ne 0, x \in [-2, 2]\}$

a) Dibuixeu aquests conjunts.

b) Trobeu la frontera, l'interior i l'adherència d'aquests conjunts.

c) Són conjunts oberts? Són conjunts tancats?

d) Són conjunts compactes?

### Solució


### a) Dibuix dels conjunts

*   **Conjunt A**: És el disc unitat obert centrat a l'origen $(0,0)$. Inclou tots els punts la distància dels quals a l'origen és estrictament menor que 1. Gràficament, és el cercle de radi 1 amb la vora (la circumferència) dibuixada amb línia discontínua.


*[Gràfic matemàtic interactiu disponible a la versió web]*


*   **Conjunt B**: És la regió compresa entre les paràboles $ y = x^2 $ i $ y = -x^2 $ per a $ x $ entre $-2 $ i $ 2 $, però **excloent** l'eix d'abscisses ($ y = 0 $). Són dues "ales" que surten de l'origen però sense incloure el segment horitzontal de l'eix $ X $ que les uneix ni el propi origen $(0,0)$.


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### b) Topologia dels conjunts

Recordem que:
- **$ S^\circ $** (Interior): Punts que pertanyen a $ S $ amb un entorn totalment contingut en $ S $.
- **$\bar{S}$** (Adherència): Conjunt de punts que són límit de successions de $ S $.
- **$ Fr(S)$** (Frontera): Punts que compleixen $\bar{S} \setminus S^\circ $.

### Per al conjunt $ A $:
L'expressió $ x^2 + y^2 < 1 $ ja defineix un conjunt obert.
- **$ A^\circ $**: $ A = \{(x,y) \in \mathbb{R}^2 : x^2 + y^2 < 1\}$
- **$\bar{A}$**: $\{(x,y) \in \mathbb{R}^2 : x^2 + y^2 \le 1\}$ (el disc tancat)
- **$ Fr(A)$**: $\{(x,y) \in \mathbb{R}^2 : x^2 + y^2 = 1\}$ (la circumferència unitat)

### Per al conjunt $ B $:
El conjunt $ B $ té punts "a la vora" (les paràboles) però li falta el segment central.
- **$\bar{B}$**: $\{(x,y) \in \mathbb{R}^2 : |y| \le x^2, x \in [-2, 2]\}$. Noteu que aquí la condició $ y \ne 0 $ desapareix perquè els punts amb $ y=0 $ són punts d'acumulació de $ B $.
- **$ B^\circ $**: $\{(x,y) \in \mathbb{R}^2 : |y| < x^2, y \ne 0, x \in (-2, 2)\}$.
- **$ Fr(B)$**: Està formada per les corbes $ y = x^2 $ i $ y = -x^2 $ per a $ x \in [-2, 2]$, els segments verticals $ x = \pm 2 $ per a $ y \in [-4, 4]$, i el segment de l'eix $ X $: $\{(x, 0) : x \in [-2, 2]\}$.

---

### c) Obertura i tancament

- **Conjunt A**: És **obert**, ja que $ A = A^\circ $. No és tancat ($ Fr(A) \not\subset A $).
- **Conjunt B**:
    - **No és obert**: Conté punts de la seva frontera (com els punts sobre les paràboles amb $ x \ne 0 $). Qualsevol entorn d'un d'aquests punts s'escapa de $ B $.
    - **No és tancat**: No conté tota la seva frontera ($ Fr(B) \not\subset B $). Per exemple, el punt $(1, 0) \in Fr(B)$ però no és de $ B $ perquè $ y = 0 $.

---

### d) Compacitat

Un conjunt a $\mathbb{R}^n $ és **compacte** si i només si és **tancat i acotat**.

- **Conjunt A**: És acotat però **no és tancat**. Per tant, **no és compacte**.
- **Conjunt B**: És acotat però **no és tancat**. Per tant, **no és compacte**.


---

## Exercici 2: Dominis de funcions

### Enunciat

Trobeu i representeu el domini de les funcions següents:

  a) $ f(x,y) = \ln(1 + xy)$
  
  b) $ g(x,y) = \sqrt{y \sin x}$

### Solució


### a) Domini de $ f(x,y) = \ln(1 + xy)$

Perquè un logaritme estigui definit, el seu argument ha de ser **estrictament positiu**. Per tant, la condició del domini és:
$$
1 + xy > 0 \implies xy > -1
$$

Podem analitzar la frontera (on $ xy = -1 $, és a dir, les hipèrboles $ y = -1/x $):
1.  Si $ x > 0 $, llavors $ y > -1/x $.
2.  Si $ x < 0 $, llavors $ y < -1/x $.
3.  Si $ x = 0 $, la condició és $ 1 > 0 $, que es compleix sempre. Per tant, tot l'eix $ Y $ forma part del domini.

**Representació visual**: El domini és la regió entre les dues branques de la hipèrbola $ xy = -1 $. Com que la desigualtat és estricta, la frontera no forma part del domini (**conjunt obert**, la denotem $ A^\circ $).


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### b) Domini de $ g(x,y) = \sqrt{y \sin x}$

Perquè una arrel quadrada (d'índex parell) estigui definida, el seu argument ha de ser **major o igual a zero**. La condició és:
$$
y \sin x \ge 0
$$

Això passa en dos casos clau:
1.  **Cas 1**: $\sin x \ge 0 $ AND $ y \ge 0 $.
    Els intervals on el sinus és positiu són $ x \in [0, \pi], [2\pi, 3\pi]$, etc. (quadrants superiors).
2.  **Cas 2**: $\sin x \le 0 $ AND $ y \le 0 $.
    Els intervals on el sinus és negatiu són $ x \in [-\pi, 0], [\pi, 2\pi]$, etc. (quadrants inferiors).

**Representació visual**: Això genera franges verticals de l'amplada $\pi $ que alternen entre la part superior i inferior de l'eix $ X $, creant un patró de tauler. Com que la desigualtat inclou el zero, la frontera (els eixos i les rectes verticals) **sí forma part del domini** (l'adherència $\bar{B}$).


*[Gràfic matemàtic interactiu disponible a la versió web]*



---

## Exercici 3: Dibuix de corbes de nivell

### Enunciat

Per a cada una de les funcions següents, dibuixeu les corbes de nivell corresponents als nivells $ z = -2, -1, 0, 1, 2 $:

  a) $ z(x,y) = x^2 - y^2 $
  
  b) $ z(x,y) = 1 - |x| - |y|$

### Solució


### a) Corbes de nivell de $ z(x,y) = x^2 - y^2 $

Aquesta funció representa un **paraboloide hiperbòlic** (conegut com a sella de muntar). Les corbes de nivell s'obtenen igualant la funció a una constant $ k $:
$$
x^2 - y^2 = k
$$

Analitzem els casos:
1.  **Si $ k > 0 $**: Són **hipèrboles** que s'obren en l'eix $ X $. Per exemple, si $ k=1 $, tenim $ x^2 - y^2 = 1 $.
2.  **Si $ k < 0 $**: Són **hipèrboles** que s'obren en l'eix $ Y $. Per exemple, si $ k=-1 $, tenim $ y^2 - x^2 = 1 $.
3.  **Si $ k = 0 $**: Tenim $ x^2 - y^2 = 0 \implies (x-y)(x+y) = 0 $. Això representa les dues **rectes bisectrius** $ y=x $ i $ y=-x $.



---

### b) Corbes de nivell de $ z(x,y) = 1 - |x| - |y|$

Aquesta funció té una forma de piràmide de base quadrada amb el vèrtex a $(0,0,1)$. Igualem a $ k $:
$$
1 - |x| - |y| = k \implies |x| + |y| = 1 - k
$$

Perquè hi hagi solució, cal que $ 1-k \ge 0 \implies k \le 1 $.
- Les corbes de nivell són **quadrats** rotats 45° (rombes) centrats a l'origen.
- La mida del quadrat disminueix a mesura que $ k $ s'apropa a 1.
- Per a $ k=1 $, la corba és només el punt $(0,0)$.
- Per a $ k > 1 $, el conjunt de nivell és buit.




---

## Exercici 4: Domini i Corbes de Nivell complexes

### Enunciat

Considereu la funció $ f(x,y) = \frac{\ln(xy)}{\sqrt{1 - x^2 + y}}$.
  
  a) Trobeu el seu domini i representeu-lo gràficament.
  
  b) Calculeu l'equació de la corba de nivell de la superfície $ z = f(x,y)$ que passa pel punt $(1,1)$ i representeu-la gràficament.

### Solució


### a) Càlcul del Domini

Per determinar el domini de $ f(x,y)$, hem de considerar les restriccions imposades per les funcions elementals que la componen:

1.  **Logaritme neperià**: L'argument ha de ser estrictament positiu:
    $$
xy > 0
$$
    Això es compleix en el **primer quadrant** ($ x>0, y>0 $) i en el **tercer quadrant** ($ x<0, y<0 $).

2.  **Arrel quadrada al denominador**: L'interior de l'arrel ha de ser estrictament positiu (no pot ser zero perquè està dividint):
    $$
1 - x^2 + y > 0 \implies y > x^2 - 1
$$
    Això representa el conjunt de punts que estan **per sobre de la paràbola** $ y = x^2 - 1 $.

**Conclusió**: El domini $ D $ és la intersecció d'aquestes regions:
$$
D = \{(x,y) \in \mathbb{R}^2 : xy > 0, y > x^2 - 1\}
$$


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### b) Corba de nivell pel punt $(1,1)$

Primer, trobem el valor de la constant $ k $ avaluant la funció en el punt $(1,1)$:
$$
f(1,1) = \frac{\ln(1 \cdot 1)}{\sqrt{1 - 1^2 + 1}} = \frac{\ln(1)}{\sqrt{1}} = \frac{0}{1} = 0
$$

Per tant, busquem la corba de nivell $ k = 0 $:
$$
\frac{\ln(xy)}{\sqrt{1 - x^2 + y}} = 0 \implies \ln(xy) = 0
$$
Aplicant l'exponencial a ambdós costats:
$$
xy = e^0 \implies xy = 1 \implies y = \frac{1}{x}
$$

Aquesta corba és una **hipèrbola**. Noteu que només té sentit en les regions que pertanyen al domini definit a l'apartat anterior. Com que el punt $(1,1)$ és al primer quadrant i compleix $ 1 > 1^2 - 1 $, la branca de la hipèrbola que busquem és la del primer quadrant.


*[Gràfic matemàtic interactiu disponible a la versió web]*



---

## Exercici 5: Dibuix de subconjunts de R^2

### Enunciat

Dibuixeu els subconjunts de $\mathbb{R}^2 $ següents:

a) $ A = \{(x,y) \in \mathbb{R}^2 : |x - 3| < 2, |1 - y| \le 5\}$;

b) $ B = \{(x,y) \in \mathbb{R}^2 : |x^2 + 4x + 1| = -x^2 - 4x - 1, |y - 2| < 10\}$;

c) $ C = \{(x,y) \in \mathbb{R}^2 : x^2 + y^2 \le 1, x < y\}$.

### Solució


### a) Conjunt $ A $

Analitzem les desigualtats per separat:
1. $|x - 3| < 2 \implies -2 < x - 3 < 2 \implies 1 < x < 5 $. És una franja vertical oberta.
2. $|1 - y| \le 5 \implies -5 \le 1 - y \le 5 \implies -6 \le -y \le 4 \implies -4 \le y \le 6 $. És una franja horitzontal tancada.

La intersecció és un rectangle de vèrtexs $(1, -4), (5, -4), (5, 6)$ i $(1, 6)$.
*   Les vores verticals ($ x=1 $ i $ x=5 $) són **obertes** (discontínues).
*   Les vores horitzontals ($ y=-4 $ i $ y=6 $) són **tancades** (sòlides).


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### b) Conjunt $ B $

La primera condició és $|f(x)| = -f(x)$, la qual cosa només és certa si $ f(x) \le 0 $:
$$
x^2 + 4x + 1 \le 0
$$
Trobem les arrels de $ x^2 + 4x + 1 = 0 $:
$$
x = \frac{-4 \pm \sqrt{16 - 4}}{2} = \frac{-4 \pm \sqrt{12}}{2} = -2 \pm \sqrt{3}
$$
Per tant, $ x \in [-2 - \sqrt{3}, -2 + \sqrt{3}] \approx [-3.73, -0.27]$.

La segona condició $|y - 2| < 10 $ implica $-8 < y < 12 $.

El conjunt és una franja vertical entre $ x \approx -3.73 $ i $ x \approx -0.27 $ (vores incloses) tallada horitzontalment entre $ y = -8 $ i $ y = 12 $ (vores **no** incloses).


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### c) Conjunt $ C $

Tenim dues regions:
1. $ x^2 + y^2 \le 1 $: És el disc unitat tancat (inclou la circumferència).
2. $ x < y $: És el semiplà superior delimitat per la recta $ y = x $.

La intersecció és la meitat del disc que queda per sobre de la diagonal.
*   L'arc de la circumferència està inclòs ($ x^2+y^2=1 $).
*   El segment de la recta $ y=x $ dins del disc **no** està inclòs (ja que la desigualtat és estrictament $ x < y $).


*[Gràfic matemàtic interactiu disponible a la versió web]*



---

## Exercici 6: Topologia i Compacitat

### Enunciat

Considereu els conjunts:

$ A = \{(x,y) \in \mathbb{R}^2 : x^2 - y^2 < 1\}$

$ B = \{(x,y) \in \mathbb{R}^2 : x > 0, y > 0, xy \le 1\}$

$ C = \{(x,y,z) \in \mathbb{R}^3 : x + y + z = 1, x^2 + y^2 + z^2 \le 1\}$

a) Dibuixeu aquests conjunts.

b) Trobeu la frontera, l'interior i l'adherència d'aquests conjunts.

c) Quins d'aquests conjunts són oberts? I quins tancats? I quins compactes?

### Solució


### a) Dibuix dels conjunts

### Conjunt A
És la regió compresa **entre** les dues branques de la hipèrbola $ x^2 - y^2 = 1 $. Inclou l'eix d'ordenades ($ x=0 $) i tots els punts tals que $|x| < \sqrt{1 + y^2}$. Com que la desigualtat és estricta, la frontera és oberta.


*[Gràfic matemàtic interactiu disponible a la versió web]*


### Conjunt B
És la regió del primer quadrant ($ x>0, y>0 $) situada per sota o sobre la hipèrbola equilàtera $ y = 1/x $. Noteu que els eixos no estan inclosos en la definició original, però la hipèrbola sí.


*[Gràfic matemàtic interactiu disponible a la versió web]*


### Conjunt C
És la intersecció d'un pla ($ x+y+z=1 $) amb una bola sòlida ($ x^2+y^2+z^2 \le 1 $). El resultat és un **disc circular** situat sobre el pla.



---

### b) Topologia dels conjunts

### Per al conjunt $ A $:
L'expressió $ x^2 - y^2 < 1 $ defineix un conjunt obert de forma natural (funció contínua < constant).
- **$ A^\circ $**: El propi conjunt $ A $.
- **$\bar{A}$**: $\{(x,y) \in \mathbb{R}^2 : x^2 - y^2 \le 1\}$.
- **$ Fr(A)$**: La hipèrbola $\{(x,y) \in \mathbb{R}^2 : x^2 - y^2 = 1\}$.

### Per al conjunt $ B $:
- **$ B^\circ $**: $\{(x,y) \in \mathbb{R}^2 : x > 0, y > 0, xy < 1\}$.
- **$\bar{B}$**: $\{(x,y) \in \mathbb{R}^2 : x \ge 0, y \ge 0, xy \le 1\}$.
- **$ Fr(B)$**: Formada per la hipèrbola $ xy=1 $ ($ x>0 $), el segment de l'eix X ($ x \ge 0, y=0 $) i el segment de l'eix Y ($ y \ge 0, x=0 $). Noteu que la frontera s'estén fins a l'infinit.

### Per al conjunt $ C $:
- **$ C^\circ $**: $\emptyset $ (en $\mathbb{R}^3 $). Un disc en un pla no té interior en l'espai tridimensional perquè qualsevol bola 3D centrada en un punt del disc sortirà del pla.
- **$\bar{C}$**: El propi conjunt $ C $ (ja que és tancat).
- **$ Fr(C)$**: El propi conjunt $ C $ (ja que $ Fr(C) = \bar{C} \setminus C^\circ = C \setminus \emptyset = C $).

---

### c) Tipus de conjunts

### Conjunt A:
- **Obert**: Sí ($ A = A^\circ $).
- **Tancat**: No ($ Fr(A) \not\subset A $).
- **Compacte**: No (no és tancat, i tampoc és acotat).

### Conjunt B:
- **Obert**: No (conté punts de la hipèrbola on $ xy=1 $).
- **Tancat**: No (no conté els punts sobre els eixos on $ x=0 $ o $ y=0 $).
- **Compacte**: No (no és tancat ni acotat).

### Conjunt C:
- **Obert**: No ($ C \ne C^\circ = \emptyset $).
- **Tancat**: Sí ($ Fr(C) = C \subset C $).
- **Compacte**: **Sí**. És tancat i acotat (està contingut dins de la bola unitat).


---

## Exercici 7: Representació de dominis

### Enunciat

Trobeu i representeu el domini de les funcions següents:

a) $ f(x,y) = x^2 - y^2 $;

b) $ g(x,y) = \sqrt{1 - x^2 - y^2}$;

c) $ h(x,y) = \ln(x + y)$.

### Solució


### a) Domini de $ f(x,y) = x^2 - y^2 $

La funció $ f(x,y)$ és un polinomi. Els polinomis estan definits per a qualsevol valor real de les seves variables. Per tant:
$$
D = \mathbb{R}^2
$$

Gràficament, el domini és tot el pla cartesià.


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### b) Domini de $ g(x,y) = \sqrt{1 - x^2 - y^2}$

Perquè la funció estigui definida, l'argument de l'arrel quadrada ha de ser major o igual a zero:
$$
1 - x^2 - y^2 \ge 0 \implies x^2 + y^2 \le 1
$$

Aquesta desigualtat representa el **disc unitat tancat** centrat a l'origen. Inclou tots els punts de l'interior i els de la circumferència de radi 1.


*[Gràfic matemàtic interactiu disponible a la versió web]*


---

### c) Domini de $ h(x,y) = \ln(x + y)$

Perquè la funció logaritme estigui definida, el seu argument ha de ser estrictament positiu:
$$
x + y > 0 \implies y > -x
$$

Gràficament, el domini és el semiplà situat per sobre de la recta $ y = -x $. Com que la desigualtat és estricta, la recta $ y = -x $ és una frontera **oberta** (no pertany al domini).


*[Gràfic matemàtic interactiu disponible a la versió web]*



---

## Exercici 8: Corbes de nivell

### Enunciat

Per a cada una de les funcions següents, dibuixeu les corbes de nivell corresponents als nivells $ z = -2, -1, 0, 1, 2 $:

a) $ z(x,y) = x^2 y $;

b) $ z(x,y) = x^2 + y^2 - 1 $;

c) $ z(x,y) = |x + y| + |x - y|$.

### Solució


### a) Corbes de nivell de $ z = x^2 y $

L'expressió de les corbes de nivell és $ x^2 y = k $.
- Si **$ k = 0 $**: $ x^2 y = 0 \implies x=0 $ o $ y=0 $. La corba de nivell 0 són els propis eixos de coordenades.
- Si **$ k \ne 0 $**: Podem aïllar $ y = \frac{k}{x^2}$. 
    - Són corbes simètriques respecte l'eix d'ordenades ($ y $).
    - Si $ k > 0 $, la corba està totalment per sobre de l'eix X.
    - Si $ k < 0 $, la corba està totalment per sota de l'eix X.



---

### b) Corbes de nivell de $ z = x^2 + y^2 - 1 $

L'expressió és $ x^2 + y^2 - 1 = k \implies x^2 + y^2 = k + 1 $.
Representen circumferències centrades a l'origen amb radi $ R = \sqrt{k+1}$.
- El domini de valors de $ z $ és $[-1, \infty)$. Per a $ k = -2 $, la corba de nivell és el buit.
- Per a **$ k = -1 $**, el radi és 0, per tant és el punt $(0,0)$.
- Per a **$ k = 0 $**, és la circumferència unitat $ x^2 + y^2 = 1 $.
- Per a **$ k = 1, 2 $**, són circumferències de radi $\sqrt{2}$ i $\sqrt{3}$ respectivament.



---

### c) Corbes de nivell de $ z = |x + y| + |x - y|$

Podem simplificar aquesta expressió utilitzant la propietat $|a+b| + |a-b| = 2 \max(|a|, |b|)$.
Així, $ z = 2 \max(|x|, |y|)$. Les corbes de nivell són:
$$
2\max(|x|, |y|) = k \implies \max(|x|, |y|) = \frac{k}{2}
$$
Aquesta equació defineix **quadrats** centrats a l'origen amb costats paral·lels als eixos i de longitud $ k $.
- Si $ k = 0 $, és el punt $(0,0)$.
- Si $ k > 0 $, tenim quadrats que van creixent a mesura que augmentem $ k $.




---

## Exercici 9: Verificació de corbes de nivell

### Enunciat

Comproveu que les paràboles $ y = ax^2 $ són corbes de nivell de la funció:
$$
f(x,y) = \frac{x^4 y^4}{(x^4 + y^2)^3}
$$

### Solució


### Demostració teòrica

Per comprovar que les paràboles $ y = ax^2 $ són corbes de nivell, hem de substituir aquesta relació en l'expressió de la funció i verificar que el resultat és una constant (que no depèn de $ x $ ni $ y $, sinó només del paràmetre $ a $ que defineix cada paràbola).

Substituïm $ y = ax^2 $ en $ f(x,y)$:

$$
f(x, ax^2) = \frac{x^4 (ax^2)^4}{(x^4 + (ax^2)^2)^3}
$$

Operem amb les potències del numerador i el denominador:

$$
f(x, ax^2) = \frac{x^4 \cdot a^4 \cdot x^8}{(x^4 + a^2 x^4)^3} = \frac{a^4 x^{12}}{(x^4(1 + a^2))^3}
$$

Simplifiquem el denominador elevant al cub:

$$
f(x, ax^2) = \frac{a^4 x^{12}}{x^{12}(1 + a^2)^3}
$$

Finalment, cancel·lem el terme $ x^{12}$:

$$
f(x, ax^2) = \frac{a^4}{(1 + a^2)^3}
$$

### Conclusió

Com que el valor de la funció sobre qualsevol punt de la paràbola $ y = ax^2 $ val constantment $\frac{a^4}{(1 + a^2)^3}$, queda demostrat que aquestes paràboles són, efectivament, les corbes de nivell de la funció $ f(x,y)$.

A continuació podeu explorar com canvia el valor del nivell segons la paràbola escollida:


*[Gràfic matemàtic interactiu disponible a la versió web]*



---

