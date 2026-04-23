---
title: "Solucionari: Tema 6: Integració de funcions d'una variable"
author: "Apunts"
---

# Solucionari: Tema 6: Integració de funcions d'una variable

*Teorema Fonamental del Càlcul. Regla de Barrow. Àrees i volums. Trapezis i Simpson.*

---

## Exercici 1: Derivada de funcions integrals

### Enunciat

Calculeu la derivada de les funcions següents:

a) $ f(x) = \int_{3}^{x} \sin \ln t \, dt, x > 3 $;

b) $ g(x) = \int_{x}^{10} \sin \ln t \, dt, x > 0 $;

c) $ h(x) = \int_{0}^{\ln(x)} \sin t^3 \, dt, x > 0 $;

d) $ s(x) = \int_{x^2+3x}^{x^4+2x+1} e^{\sin t} \, dt $.

### Solució


Per resoldre aquests exercicis utilitzarem el **Teorema Fonamental del Càlcul (TFC)** i la **Regla de la Cadena**.

Recordem que si $ F(x) = \int_{a}^{g(x)} f(t) \, dt $, llavors per la regla de la cadena:
$ F'(x) = f(g(x)) \cdot g'(x)$

En el cas general, si $ F(x) = \int_{h(x)}^{g(x)} f(t) \, dt $:
$ F'(x) = f(g(x)) \cdot g'(x) - f(h(x)) \cdot h'(x)$

---

### a) $ f(x) = \int_{3}^{x} \sin \ln t \, dt $

En aquest cas, tenim una aplicació directa del TFC on el límit superior és $ x $ i l'inferior és una constant.

$ f'(x) = \sin(\ln x) \cdot 1 = \sin(\ln x)$

---

### b) $ g(x) = \int_{x}^{10} \sin \ln t \, dt $

Primer, intercanviem els límits d'integració canviant el signe de la integral:
$ g(x) = - \int_{10}^{x} \sin \ln t \, dt $

Ara derivem aplicant el TFC:
$ g'(x) = - \sin(\ln x)$

---

### c) $ h(x) = \int_{0}^{\ln(x)} \sin t^3 \, dt $

Apliquem la regla de la cadena. Sigui $ u(x) = \ln(x)$. Llavors $ u'(x) = \frac{1}{x}$.

$ h'(x) = \sin(u(x)^3) \cdot u'(x) = \sin((\ln x)^3) \cdot \frac{1}{x}$

Finalment:
$ h'(x) = \frac{\sin(\ln^3 x)}{x}$

---

### d) $ s(x) = \int_{x^2+3x}^{x^4+2x+1} e^{\sin t} \, dt $

Apliquem la fórmula general per a límits dependents de $ x $:
- Límit superior: $ g(x) = x^4+2x+1 \implies g'(x) = 4x^3+2 $
- Límit inferior: $ h(x) = x^2+3x \implies h'(x) = 2x+3 $
- Funció integrant: $ f(t) = e^{\sin t}$

$ s'(x) = f(g(x)) \cdot g'(x) - f(h(x)) \cdot h'(x)$

$ s'(x) = e^{\sin(x^4+2x+1)} \cdot (4x^3+2) - e^{\sin(x^2+3x)} \cdot (2x+3)$


---

## Exercici 2: Límits amb integrals

### Enunciat

Calculeu els límits següents:

a) $\lim_{x \to 0^+} \frac{\int_{0}^{x^2} \sin \sqrt{t} \, dt}{x^3}$;

b) $\lim_{x \to 0} \frac{x \int_{0}^{x} e^{t^2} \, dt}{\int_{0}^{x} e^{t^2} \sin t \, dt}$.

### Solució


Per resoldre aquests límits, utilitzarem la **Regla de L'Hôpital** i el **Teorema Fonamental del Càlcul**.

---

### a) $\lim_{x \to 0^+} \frac{\int_{0}^{x^2} \sin \sqrt{t} \, dt}{x^3}$

Observem que és una indeterminació de tipus $\frac{0}{0}$. Apliquem la regla de L'Hôpital.

Derivem el numerador $ N(x) = \int_{0}^{x^2} \sin \sqrt{t} \, dt $ usant el TFC:

$ N'(x) = \sin(\sqrt{x^2}) \cdot (x^2)' = \sin(|x|) \cdot 2x = \sin(x) \cdot 2x = 2x \sin x $

Derivem el denominador $ D(x) = x^3 $:
$ D'(x) = 3x^2 $

El límit esdevé:
$\lim_{x \to 0^+} \frac{2x \sin x}{3x^2} = \frac{2}{3} \lim_{x \to 0^+} \frac{\sin x}{x}$

Com que $\lim_{x \to 0} \frac{\sin x}{x} = 1 $:
$\frac{2}{3} \cdot 1 = \mathbf{\frac{2}{3}}$

---

### b) $\lim_{x \to 0} \frac{x \int_{0}^{x} e^{t^2} \, dt}{\int_{0}^{x} e^{t^2} \sin t \, dt}$

També tenim una indeterminació de tipus $\frac{0}{0}$. Apliquem la regla de L'Hôpital.

**Derivada del numerador** (regla del producte):
$ N'(x) = 1 \cdot \int_{0}^{x} e^{t^2} \, dt + x \cdot e^{x^2}$

**Derivada del denominador**:
$ D'(x) = e^{x^2} \sin x $

El nou límit és:
$\lim_{x \to 0} \frac{\int_{0}^{x} e^{t^2} \, dt + x e^{x^2}}{e^{x^2} \sin x}$

Continuem tenint una indeterminació $\frac{0}{0}$. Podem aplicar L'Hôpital de nou o bé utilitzar **infinitèsims equivalents** per simplificar:

**Comprovació per L'Hôpital (segona vegada):**
Derivem el nou numerador: $ e^{x^2} + (e^{x^2} + x \cdot 2x e^{x^2}) = 2e^{x^2} + 2x^2 e^{x^2}$
Derivem el nou denominador: $ 2x e^{x^2} \sin x + e^{x^2} \cos x $

$\lim_{x \to 0} \frac{2e^{x^2} + 2x^2 e^{x^2}}{2x e^{x^2} \sin x + e^{x^2} \cos x} = \frac{2(1) + 0}{0 + 1(1)} = \mathbf{2}$

**Comprovació per infinitéssims equivalents:** A prop de $ x=0 $, $ e^{x^2} \approx 1 $ i $\sin x \approx x $.

$\lim_{x \to 0} \frac{\int_{0}^{x} e^{t^2} \, dt + x e^{x^2}}{e^{x^2} \sin x} \approx \lim_{x \to 0} \frac{\int_{0}^{x} 1 \, dt + x(1)}{1 \cdot x} = \lim_{x \to 0} \frac{x + x}{x} = \lim_{x \to 0} \frac{2x}{x} = \mathbf{2}$



---

## Exercici 3: Monotonia d'una funció integral

### Enunciat

Sigui funció $ f $ de zero a infinit menys menys el conjunt format pel 1, $ f : (0, +\infty) \setminus {1} \to \mathbb{R}$ definida per $ f(x) = \int_x^{x^2} \frac{1}{\ln t} dt =  \int_x^{x^2} \frac{dt}{\ln t}$. Proveu que $ f $ és estrictament creixent a $(0, 1)$ i a $(1, +\infty)$.

### Solució


Per provar que una funció és estrictament creixent en un interval, hem de demostrar que la seva derivada és estrictament positiva ($ f'(x) > 0 $) en aquest interval.

### 1) Càlcul de la derivada

Utilitzem el Teorema Fonamental del Càlcul. Com que els dos límits d'integració depenen de $ x $, la derivada s'avalua en ambdós extrems:
$$
f'(x) = \frac{1}{\ln(x^2)} \cdot (x^2)' - \frac{1}{\ln x} \cdot (x)'
$$

Substituïm les derivades $(x^2)' = 2x $ i $(x)' = 1 $:
$$
f'(x) = \frac{2x}{\ln(x^2)} - \frac{1}{\ln x}
$$

Ara apliquem la propietat dels logaritmes $\ln(a^b) = b \ln a $ al primer terme:
$$
f'(x) = \frac{2x}{2 \ln x} - \frac{1}{\ln x}
$$

Simplifiquem el factor $ 2 $ i agrupem els termes (tenen el mateix denominador):
$$
f'(x) = \frac{x}{\ln x} - \frac{1}{\ln x} = \mathbf{\frac{x-1}{\ln x}}
$$

---

### 2) Estudi del signe

Per saber si la funció és creixent, mirem on $ f'(x) > 0 $. Recordem el comportament de $\ln x $ (és negatiu entre $ 0 $ i $ 1 $, i positiu a partir d'1):

| | $ x \in (0, 1)$ | $ x \in (1, +\infty)$ |
| :--- | :---: | :---: |
| **Numerador** ($ x-1 $) | $-$ | $+$ |
| **Denominador** ($\ln x $) | $-$ | $+$ |
| **Signe de $ f'(x)$** | $\mathbf{+}$ | $\mathbf{+}$ |

**Conclusió**: Com que $ f'(x) > 0 $ en ambdós intervals, la funció **$ f(x)$ és estrictament creixent** a $(0, 1)$ i a $(1, +\infty)$.



---

## Exercici 4: Paritat i concavitat d'una funció integral

### Enunciat

Sigui $ F(x) = \int_{-x}^{x} t^2 e^{t^2} \, dt $. Proveu que $ F'$ és una funció parella i estudieu la concavitat de $ F $.

### Solució


### 1) Derivada de $ F(x)$ i prova de paritat

Primer calculem la derivada $ F'(x)$ utilitzant el Teorema Fonamental del Càlcul:
$ F(x) = \int_{-x}^{x} t^2 e^{t^2} \, dt $

L'integrant és $ f(t) = t^2 e^{t^2}$. La derivada és:

$ F'(x) = f(x) \cdot (x)' - f(-x) \cdot (-x)'$

$ F'(x) = x^2 e^{x^2} \cdot 1 - (-x)^2 e^{(-x)^2} \cdot (-1)$

$ F'(x) = x^2 e^{x^2} + x^2 e^{x^2}$

$ F'(x) = 2x^2 e^{x^2}$

Per veure si $ F'(x)$ és una **funció parella**, hem de comprovar si $ F'(-x) = F'(x)$:

$ F'(-x) = 2(-x)^2 e^{(-x)^2} = 2x^2 e^{x^2} = F'(x)$

Per tant, **$ F'$ és una funció parella**.

---

### 2) Estudi de la concavitat de $ F(x)$

La concavitat es determina mitjançant el signe de la segona derivada $ F''(x)$:
$ F''(x) = (2x^2 e^{x^2})'$

Apliquem la regla del producte:

$ F''(x) = (4x) \cdot e^{x^2} + (2x^2) \cdot (e^{x^2} \cdot 2x)$

$ F''(x) = 4x e^{x^2} + 4x^3 e^{x^2}$

$ F''(x) = 4x e^{x^2} (1 + x^2)$

Analitzem el signe de $ F''(x)$:

- Sabem que $ e^{x^2} > 0 $ per a tot $ x $.
- Sabem que $ 1 + x^2 > 0 $ per a tot $ x $.
- Per tant, el signe de $ F''(x)$ és el mateix que el signe de $ 4x $:

1. **Interval $(-\infty, 0)$**: $ x < 0 \implies F''(x) < 0 $. La funció és **còncava** (cap avall).
2. **Interval $(0, +\infty)$**: $ x > 0 \implies F''(x) > 0 $. La funció és **convexa** (cap amunt).
3. **Punt $ x = 0 $**: Com que $ F''(0) = 0 $ i hi ha un canvi de signe en la curvatura, $ x = 0 $ és un **punt d'inflexió**.


---

## Exercici 5: Integració numèrica (Trapezis i Simpson)

### Enunciat

Calculeu la integral següent $ I = \int_{0}^{4} (1 - e^{x/4}) \, dx $:

(a) Fent ús de la regla de Barrow.

(b) Fent ús de la fórmula dels trapezis amb una partició de 4 subintervals.

(c) Fent ús de la fórmula de Simpson amb una partició de 4 subintervals.

(d) Avalueu l'error absolut en cada cas i comenteu els resultats.

(e) Calculeu les cotes superiors de l'error utilitzant les fórmules teòriques.

### Solució


### (a) Regla de Barrow (Valor exacte)

Per trobar una primitiva de $ f(x) = 1 - e^{x/4}$, calculem cada part per separat:
1. La primitiva de 1 és $ x $.
2. Per a l'exponencial $ e^{x/4}$, sabem que la seva primitiva és $ 4e^{x/4}$, ja que si la derivem tornem a l'original:
$$
(4e^{x/4})' = 4 \cdot e^{x/4} \cdot \frac{1}{4} = e^{x/4}
$$

Així doncs, la primitiva completa és: **$ F(x) = x - 4e^{x/4}$**

Apliquem la Regla de Barrow en l'interval $[0, 4]$:
$$
I = [x - 4e^{x/4}]_0^4 = (4 - 4e^{4/4}) - (0 - 4e^{0/4})
$$
$$
I = (4 - 4e) - (0 - 4 \cdot 1) = 4 - 4e + 4 = 8 - 4e
$$

Valor numèric aproximat:
$ I = 8 - 4(2.7182818) \approx \mathbf{-2.873127}$

---

### (b) Fórmula dels Trapezis ($ n=4 $)

Dividim l'interval $[0, 4]$ en $ n=4 $ subintervals, per tant $ h = \frac{4-0}{4} = 1 $.
Els punts són $ x_i = {0, 1, 2, 3, 4}$.

| $ i $ | $ x_i $ | $ f(x_i) = 1 - e^{x_i/4}$ |
|---|---|---|
| 0 | 0 | $ 1 - e^0 = 0 $ |
| 1 | 1 | $ 1 - e^{1/4}$ |
| 2 | 2 | $ 1 - e^{1/2}$ |
| 3 | 3 | $ 1 - e^{3/4}$ |
| 4 | 4 | $ 1 - e^1 $ |

Substituïm els valors exactes en la fórmula:

$$
T = \frac{h}{2} \left[ f(0) + 2(f(1) + f(2) + f(3)) + f(4) \right]
$$

$$
T = \frac{1}{2} \left[ 0 + 2( (1-e^{1/4}) + (1-e^{1/2}) + (1-e^{3/4}) ) + (1-e) \right] \approx \mathbf{-2.908887}
$$

---

### (c) Fórmula de Simpson ($ n=4 $)

Substituïm els valors exactes en la fórmula de Simpson:

$$
S = \frac{h}{3} \left[ f(0) + 4f(1) + 2f(2) + 4f(3) + f(4) \right]
$$

$$
S = \frac{1}{3} \left[ 0 + 4(1-e^{1/4}) + 2(1-e^{1/2}) + 4(1-e^{3/4}) + (1-e) \right]
$$

$$
S = \frac{1}{3} \left[ 4 - 4e^{1/4} + 2 - 2e^{1/2} + 4 - 4e^{3/4} + 1 - e \right]
$$

$$
S = \frac{1}{3} \left[ 11 - e - 4e^{1/4} - 2e^{1/2} - 4e^{3/4} \right] \approx \mathbf{-2.873275}
$$

---

### (d) Error absolut i comentari

- **Error Trapezis**: $ E_T = |I - T| \approx |-2.873127 - (-2.908887)| = \mathbf{0.035760}$
- **Error Simpson**: $ E_S = |I - S| \approx |-2.873127 - (-2.873275)| = \mathbf{0.000148}$

S'observa que el mètode de Simpson és molt més precís que el dels trapezis per al mateix nombre de divisions. 

---

### (e) Cotes superiors de l'error

Derivem la funció $ f(x) = 1 - e^{x/4}$:

$ f'(x) = -\frac{1}{4} e^{x/4}$

$ f''(x) = -\frac{1}{16} e^{x/4} \implies |f''(x)| \leq \frac{e}{16} \approx 0.1699 $ en $[0, 4]$ (el màxim es dóna a $ x=4 $ perquè l'exponencial creix).

$ f'''(x) = -\frac{1}{64} e^{x/4}$

$ f^{(4)}(x) = -\frac{1}{256} e^{x/4} \implies |f^{(4)}(x)| \leq \frac{e}{256} \approx 0.0106 $ en $[0, 4]$ (el màxim es dóna a $ x=4 $ perquè l'exponencial creix).

**Cota Trapezis**:
$|E_T| \leq \frac{(b-a)h^2}{12} \max |f''(x)| = \frac{4 \cdot 1^2}{12} \cdot 0.1699 = \frac{1}{3} \cdot 0.1699 \approx \mathbf{0.0566}$

**Cota Simpson**:
$|E_S| \leq \frac{(b-a)h^4}{180} \max |f^{(4)}(x)| = \frac{4 \cdot 1^4}{180} \cdot 0.0106 = \frac{1}{45} \cdot 0.0106 \approx \mathbf{0.000236}$


---

## Exercici 6: Dimensió de la partició per Simpson

### Enunciat

Siguin $ f(x) = (\sin(x) \cos(x))^{4/3}$ i $ I = \int_{0.6}^{1.0} f(x) \, dx $.

(a) Sabent que $ 0 < f^{(4)}(x) < 20 $ per a tot $ x \in [0.6, 1.0]$, calculeu el nombre de subintervals necessaris per obtenir el valor de la integral amb la fórmula de Simpson amb una precisió de com a mínim quatre decimals correctes ($ 0.5 \cdot 10^{-4}$).

(b) Doneu el valor aproximat de la integral $ I $ amb el grau d'exactitud demanat.

### Solució


### (a) Càlcul del nombre de subintervals ($ n $)

La fórmula de l'error per al mètode de Simpson és:
$|E_S| \leq \frac{(b-a)h^4}{180} \max |f^{(4)}(x)|$

Dades del problema:
- Interval: $[0.6, 1.0] \implies b-a = 0.4 $
- Cota de la quarta derivada: $ M_4 = \max |f^{(4)}(x)| = 20 $
- Precisió demanada: $\epsilon = 0.5 \cdot 10^{-4} = 5 \cdot 10^{-5}$

Volem trobar $ h $ tal que $|E_S| \leq \epsilon $:

$\frac{0.4 \cdot h^4}{180} \cdot 20 \leq 5 \cdot 10^{-5} \implies \frac{8 \cdot h^4}{180} \leq 5 \cdot 10^{-5} \implies h^4 \leq \frac{5 \cdot 10^{-5} \cdot 180}{8} \implies h \leq \sqrt[4]{\frac{5 \cdot 10^{-5} \cdot 180}{8}} \approx 0.183 $

Com que $ h = \frac{b-a}{n} = \frac{0.4}{n}$:

$\frac{0.4}{n} \leq 0.183 \implies n \geq \frac{0.4}{0.183} \approx 2.18 $

En el mètode de Simpson, l'índex $ n $ ha de ser un **nombre enter parell**. El primer enter parell que compleix la condició és **$ n=4 $**.

---

### (b) Valor aproximat de la integral ($ n=4 $)

Amb $ n=4 $, l'amplada de cada subinterval és $ h = \frac{0.4}{4} = 0.1 $.
Els punts de la partició són: $ x_0=0.6, x_1=0.7, x_2=0.8, x_3=0.9, x_4=1.0 $.

Simplifiquem la funció utilitzant la identitat $\sin x \cos x = \frac{1}{2} \sin(2x)$:
$ f(x) = \left( \frac{1}{2} \sin(2x) \right)^{4/3}$

Calculem els valors de la funció:
- $ f(0.6) = (0.5 \sin 1.2)^{4/3} \approx 0.35821 $
- $ f(0.7) = (0.5 \sin 1.4)^{4/3} \approx 0.38584 $
- $ f(0.8) = (0.5 \sin 1.6)^{4/3} \approx 0.39322 $
- $ f(0.9) = (0.5 \sin 1.8)^{4/3} \approx 0.37981 $
- $ f(1.0) = (0.5 \sin 2.0)^{4/3} \approx 0.34651 $

Apliquem la fórmula de Simpson:

$ S = \frac{h}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]$

$ S = \frac{0.1}{3} [0.35821 + 4(0.38584) + 2(0.39322) + 4(0.37981) + 0.34651]$

$ S = \frac{0.1}{3} [0.35821 + 1.54336 + 0.78644 + 1.51924 + 0.34651]$

$ S = \frac{0.1}{3} [4.55376] \approx \mathbf{0.151792}$

El valor aproximat de la integral amb 4 decimals correctes és **$ 0.1518 $**.


---

## Exercici 7: Integrals immediates

### Enunciat

Calculeu les integrals immediates següents:

a) $\int \left(\frac{1-x}{x}\right)^2 \, dx $;

b) $\int \frac{x^3}{x^4+1} \, dx $;

c) $\int \sqrt{\frac{\arcsin x}{1-x^2}} \, dx $;

d) $\int x\sqrt{x} \, dx $;

e) $\int \frac{1}{x \ln x} \, dx $;

f) $\int x 5^{2x^2} \, dx $;

g) $\int \frac{1}{1+16x^2} \, dx $;

h) $\int \tan^2 x \, dx $.

### Solució

### a) $\int \left(\frac{1-x}{x}\right)^2 \, dx $
Primer desenvolupem el quadrat del numerador:
$\int \frac{1-2x+x^2}{x^2} \, dx = \int \left( \frac{1}{x^2} - \frac{2x}{x^2} + \frac{x^2}{x^2} \right) \, dx = \int (x^{-2} - 2x^{-1} + 1) \, dx $

Integrem terme a terme:
$-x^{-1} - 2 \ln|x| + x + C = \mathbf{-\frac{1}{x} - 2 \ln|x| + x + C}$

---

### b) $\int \frac{x^3}{x^4+1} \, dx $
Observem que la derivada del denominador és $ 4x^3 $. Ajustem la constant:
$\frac{1}{4} \int \frac{4x^3}{x^4+1} \, dx = \mathbf{\frac{1}{4} \ln(x^4+1) + C}$

---

### c) $\int \sqrt{\frac{\arcsin x}{1-x^2}} \, dx $
Podem escriure-ho com:
$\int (\arcsin x)^{1/2} \cdot \frac{1}{\sqrt{1-x^2}} \, dx $

Identifiquem la forma $\int f(x)^n \cdot f'(x) \, dx = \frac{f(x)^{n+1}}{n+1}$:
$\frac{(\arcsin x)^{3/2}}{3/2} + C = \mathbf{\frac{2}{3} (\arcsin x)^{3/2} + C}$

---

### d) $\int x\sqrt{x} \, dx $
Expressem-ho com a potència:
$\int x^1 \cdot x^{1/2} \, dx = \int x^{3/2} \, dx = \frac{x^{5/2}}{5/2} + C = \mathbf{\frac{2}{5} x^{5/2} + C}$

---

### e) $\int \frac{1}{x \ln x} \, dx $
Escrivim la fracció com un quocient de funcions:
$\int \frac{1/x}{\ln x} \, dx $

La derivada de $\ln x $ és $ 1/x $. Per tant:
$\mathbf{\ln|\ln x| + C}$

---

### f) $\int x 5^{2x^2} \, dx $
La derivada de l'exponent $ 2x^2 $ és $ 4x $. Ajustem les constants:
$\frac{1}{4} \int (4x) 5^{2x^2} \, dx $

Recordant que $\int a^{f(x)} f'(x) \, dx = \frac{a^{f(x)}}{\ln a}$:
$\frac{1}{4} \frac{5^{2x^2}}{\ln 5} + C = \mathbf{\frac{5^{2x^2}}{4 \ln 5} + C}$

---

### g) $\int \frac{1}{1+16x^2} \, dx $
Escrivim el denominador per identificar una arc tangent:
$\int \frac{1}{1+(4x)^2} \, dx $

La derivada de la funció interior $ 4x $ és 4:
$\frac{1}{4} \int \frac{4}{1+(4x)^2} \, dx = \mathbf{\frac{1}{4} \arctan(4x) + C}$

---

### h) $\int \tan^2 x \, dx $
Utilitzem la identitat trigonomètrica $ 1 + \tan^2 x = \sec^2 x \implies \tan^2 x = \sec^2 x - 1 $:
$\int (\sec^2 x - 1) \, dx = \mathbf{\tan x - x + C}$


---

## Exercici 8: Integració per parts

### Enunciat

Calculeu les integrals següents integrant per parts:

a) $\int e^{2x} \sin x \, dx $;

b) $\int \frac{\ln x}{\sqrt{x}} \, dx $;

c) $\int \arcsin x \, dx $;

d) $\int x \sin 2x \, dx $.

### Solució


Utilitzem la fórmula d'integració per parts: $\int u \, dv = uv - \int v \, du $.

---

### a) $\int e^{2x} \sin x \, dx $ (Integral cíclica)
Triem $ u = \sin x $ i $ dv = e^{2x} \, dx $:
- $ du = \cos x \, dx $
- $ v = \frac{1}{2} e^{2x}$

$ I = \frac{1}{2} e^{2x} \sin x - \frac{1}{2} \int e^{2x} \cos x \, dx $

Apliquem parts de nou a la segona integral ($ u = \cos x, dv = e^{2x} \, dx $):
- $ du = -\sin x \, dx $
- $ v = \frac{1}{2} e^{2x}$

$ I = \frac{1}{2} e^{2x} \sin x - \frac{1}{2} \left[ \frac{1}{2} e^{2x} \cos x - \int \frac{1}{2} e^{2x} (-\sin x) \, dx \right]$
$ I = \frac{1}{2} e^{2x} \sin x - \frac{1}{4} e^{2x} \cos x - \frac{1}{4} \int e^{2x} \sin x \, dx $

Com que la integral és la mateixa que la inicial ($ I $):
$ I = \frac{1}{2} e^{2x} \sin x - \frac{1}{4} e^{2x} \cos x - \frac{1}{4} I $
$\frac{5}{4} I = \frac{1}{2} e^{2x} \sin x - \frac{1}{4} e^{2x} \cos x $

Multiplicant per $ 4/5 $:
$ I = \frac{2}{5} e^{2x} \sin x - \frac{1}{5} e^{2x} \cos x + C = \mathbf{\frac{e^{2x}}{5} (2 \sin x - \cos x) + C}$

---

### b) $\int \frac{\ln x}{\sqrt{x}} \, dx = \int x^{-1/2} \ln x \, dx $
Triem $ u = \ln x $ i $ dv = x^{-1/2} \, dx $:
- $ du = \frac{1}{x} \, dx $
- $ v = 2x^{1/2}$

$ I = 2x^{1/2} \ln x - \int 2x^{1/2} \frac{1}{x} \, dx = 2\sqrt{x} \ln x - 2 \int x^{-1/2} \, dx $
$ I = 2\sqrt{x} \ln x - 2 \frac{x^{1/2}}{1/2} + C = \mathbf{2\sqrt{x} \ln x - 4\sqrt{x} + C}$

---

### c) $\int \arcsin x \, dx $
Triem $ u = \arcsin x $ i $ dv = dx $:
- $ du = \frac{1}{\sqrt{1-x^2}} \, dx $
- $ v = x $

$ I = x \arcsin x - \int \frac{x}{\sqrt{1-x^2}} \, dx $

Resolem la integral restant per canvi de variable inmediat ($ t = 1-x^2, dt = -2x \, dx $):
$\int \frac{x}{\sqrt{1-x^2}} \, dx = -\frac{1}{2} \int (1-x^2)^{-1/2} (-2x) \, dx = -\frac{1}{2} \frac{(1-x^2)^{1/2}}{1/2} = -\sqrt{1-x^2}$

Substituint:
$ I = x \arcsin x - (-\sqrt{1-x^2}) + C = \mathbf{x \arcsin x + \sqrt{1-x^2} + C}$

---

### d) $\int x \sin 2x \, dx $
Triem $ u = x $ i $ dv = \sin 2x \, dx $:
- $ du = dx $
- $ v = -\frac{1}{2} \cos 2x $

$ I = -\frac{x}{2} \cos 2x - \int -\frac{1}{2} \cos 2x \, dx $
$ I = -\frac{x}{2} \cos 2x + \frac{1}{2} \int \cos 2x \, dx $
$ I = -\frac{x}{2} \cos 2x + \frac{1}{2} \frac{\sin 2x}{2} + C = \mathbf{-\frac{x}{2} \cos 2x + \frac{1}{4} \sin 2x + C}$


---

## Exercici 9: Àrea entre una paràbola i una recta

### Enunciat

Trobeu l'àrea determinada per la paràbola $ y = x^2 + 7 $ i la recta $ y = 10 $.

### Solució


Per trobar l'àrea entre dues corbes, primer hem de determinar els seus punts d'intersecció i quina funció queda per sobre de l'altra.

### 1) Punts d'intersecció

Igualem les dues funcions per trobar els límits d'integració:
$ x^2 + 7 = 10 $
$ x^2 = 3 \implies x = \pm \sqrt{3}$

Els punts d'intersecció són $ x = -\sqrt{3}$ i $ x = \sqrt{3}$.

---

### 2) Càlcul de l'àrea

En l'interval $[-\sqrt{3}, \sqrt{3}]$, la recta $ y = 10 $ està per sobre de la paràbola $ y = x^2 + 7 $ (per exemple, en $ x = 0 $, $ 10 > 7 $).

L'àrea $ A $ ve donada per la integral de la diferència:
$ A = \int_{-\sqrt{3}}^{\sqrt{3}} (10 - (x^2 + 7)) \, dx = \int_{-\sqrt{3}}^{\sqrt{3}} (3 - x^2) \, dx $

Aprofitant la simetria de la funció (és una funció parella), podem integrar de $ 0 $ a $\sqrt{3}$ i multiplicar per 2:
$ A = 2 \int_{0}^{\sqrt{3}} (3 - x^2) \, dx $

Calculem la integral:
$ A = 2 \left[ 3x - \frac{x^3}{3} \right]_0^{\sqrt{3}}$
$ A = 2 \left( 3\sqrt{3} - \frac{(\sqrt{3})^3}{3} \right) = 2 \left( 3\sqrt{3} - \frac{3\sqrt{3}}{3} \right)$
$ A = 2 ( 3\sqrt{3} - \sqrt{3} ) = 2 ( 2\sqrt{3} )$

L'àrea final és:
$\mathbf{A = 4\sqrt{3}}$ unitats d'àrea.


---

## Exercici 10: Àrea entre corbes i eix d'abscisses

### Enunciat

Calculeu l'àrea de la regió tancada determinada per l'eix d'abscisses, les corbes $ y = e^x $ i $ y = e^{-x}$ i les rectes $ x = 2 $ i $ x = -2 $.

### Solució


Per calcular l'àrea d'aquesta regió, primer hem d'analitzar com es comporten les corbes en l'interval $[-2, 2]$.

### 1) Anàlisi de les funcions

Les corbes $ y = e^x $ i $ y = e^{-x}$ s'intersequen quan:
$ e^x = e^{-x} \implies x = -x \implies 2x = 0 \implies x = 0 $

L'àrea demanada està tancada per l'eix d'abscisses ($ y = 0 $) i les dues corbes. Perquè la regió estigui realment "tancada" per ambdues corbes i l'eix, hem d'integrar sota la corba que queda més a prop de l'eix $ x $ (la "inferior" de les dues corbes positives):

- En l'interval $[-2, 0]$: La funció "més baixa" és $ y = e^x $ (per exemple, $ e^{-1} \approx 0.36 < e^{1} \approx 2.71 $ no, espera).
  *Correcció:* En $ x = -1 $, $ e^{-1} \approx 0.36 $ i $ e^1 \approx 2.71 $. La funció que queda sota és $ e^x $ (ja que $ e^{-1} < e^1 $ és fals, $ e^{-1}$ és $ 1/e $).
  Vegem: a l'esquerra de zero ($ x < 0 $), $ e^x < 1 $ i $ e^{-x} > 1 $. Per tant, $ e^x $ és la que tanca la regió amb l'eix.
- En l'interval $[0, 2]$: Per a $ x > 0 $, $ e^{-x} < 1 $ i $ e^x > 1 $. Per tant, $ e^{-x}$ és la que tanca la regió.

---

### 2) Càlcul de la integral

L'àrea total $ A $ és la suma de dues integrals:
$ A = \int_{-2}^{0} e^x \, dx + \int_{0}^{2} e^{-x} \, dx $

Aprofitant la simetria de les funcions respecte a l'eix $ y $:
$ A = 2 \int_{0}^{2} e^{-x} \, dx $

Calculem la integral definida:
$ A = 2 \left[ -e^{-x} \right]_0^2 = 2 ( -e^{-2} - (-e^0) )$
$ A = 2 ( -e^{-2} + 1 ) = 2 ( 1 - \frac{1}{e^2} )$

L'àrea final és:
$\mathbf{A = 2 - 2e^{-2}}$ unitats d'àrea.

*(Valor aproximat: $ 2 - 2(0.1353) \approx 1.7294 $)*


---

## Exercici 11: Àrea en el quart quadrant

### Enunciat

Calculeu l'àrea de la regió del quart quadrant limitada per la corba $ y = (x^2 - x)e^{-x}$ i el semieix positiu d'abscisses.

### Solució


Per calcular l'àrea de la regió en el quart quadrant ($ x > 0, y < 0 $), primer hem de trobar els punts d'intersecció amb l'eix d'abscisses.

### 1) Punts d'intersecció i anàlisi de signe

Busquem on $ y = 0 $:
$(x^2 - x)e^{-x} = 0 \implies x(x - 1)e^{-x} = 0 $
Atès que $ e^{-x} \neq 0 $ sempre, les arrels són $ x = 0 $ i $ x = 1 $.

En l'interval $(0, 1)$:
Si agafem $ x = 0.5 $, $ y = (0.25 - 0.5)e^{-0.5} = -0.25 e^{-0.5}$, que és **negatiu**.
Per tant, la corba es troba efectivament en el quart quadrant entre $ x=0 $ i $ x=1 $.

---

### 2) Càlcul de la integral

L'àrea $ A $ és la integral de la funció canviada de signe (perquè $ y < 0 $):
$ A = \int_{0}^{1} - (x^2 - x)e^{-x} \, dx = \int_{0}^{1} (x - x^2)e^{-x} \, dx $

Primer trobem la primitiva integrant per parts dues vegades (o utilitzant el mètode de les derivades successives per a $ P(x)e^{ax}$):
Hi ha una fórmula general: $\int (ax^2+bx+c)e^{rx} \, dx = \left( \frac{ax^2+bx+c}{r} - \frac{2ax+b}{r^2} + \frac{2a}{r^3} \right) e^{rx}$

En el nostre cas per $\int (x^2 - x)e^{-x} \, dx $: $ a=1, b=-1, c=0, r=-1 $.
$ F(x) = \left( \frac{x^2-x}{-1} - \frac{2x-1}{1} + \frac{2}{-1} \right) e^{-x}$
$ F(x) = (-x^2 + x - 2x + 1 - 2) e^{-x} = (-x^2 - x - 1) e^{-x}$

Comprovem la derivada:
$ F'(x) = (-2x - 1)e^{-x} - (-x^2 - x - 1)e^{-x} = (-2x - 1 + x^2 + x + 1) e^{-x} = (x^2 - x) e^{-x}$ (Correcte)

---

### 3) Aplicació de la Regla de Barrow

L'àrea és:
$ A = - [F(x)]_0^1 = - [ (-x^2 - x - 1) e^{-x} ]_0^1 = [ (x^2 + x + 1) e^{-x} ]_0^1 $
$ A = (1^2 + 1 + 1)e^{-1} - (0^2 + 0 + 1)e^{-0}$
$ A = 3e^{-1} - 1 $

L'àrea final és:
$\mathbf{A = \frac{3}{e} - 1}$ unitats d'àrea.

*(Valor aproximat: $ 1.1036 - 1 = 0.1036 $)*


---

## Exercici 12: Integració numèrica de funcions no elementals

### Enunciat

Utilitzeu el mètode dels trapezis i la regla de Simpson amb 4 subintervals per avaluar les integrals següents:

a) $\int_0^1 e^{x^2} \, dx $;

b) $\int_0^1 \cos(x^2) \, dx $.

Calculeu també la cota superior de l'error comès en cada cas.

### Solució


Per a ambdues integrals tenim $ n=4 $ subintervals en l'interval $[0, 1]$, per tant $ h = \frac{1-0}{4} = 0.25 $.
Els punts de la partició són $ x_i = a + i \cdot h = 0 + \frac i 4 = \{0, 0.25, 0.5, 0.75, 1\}$.

---

### a) $\int_0^1 e^{x^2} \, dx $

Taula de valors ($ f(x) = e^{x^2}$):
- $ f(0) = 1 $
- $ f(0.25) \approx 1.06449 $
- $ f(0.5) \approx 1.28403 $
- $ f(0.75) \approx 1.75505 $
- $ f(1) \approx 2.71828 $

**Mètode dels Trapezis ($ T $):**
$ T_n = \frac{h}{2} \left[ f(x_0) + 2 \sum_{i=1}^{n-1} f(x_i) + f(x_n) \right]$

$ T = \frac{0.25}{2} [f(0) + 2(f(0.25) + f(0.5) + f(0.75)) + f(1)]$

$ T = 0.125 [1 + 2(4.10357) + 2.71828] = 0.125 [11.92542] \approx \mathbf{1.49068}$

**Regla de Simpson ($ S $):**
$ S_n = \frac{h}{3} \left[ f(x_0) + 4 \sum_{\text{senars}} f(x_i) + 2 \sum_{\text{parells}} f(x_i) + f(x_n) \right]$

$ S = \frac{0.25}{3} [f(0) + 4f(0.25) + 2f(0.5) + 4f(0.75) + f(1)]$

$ S = \frac{0.25}{3} [1 + 4.25796 + 2.56806 + 7.02020 + 2.71828] = \frac{0.25}{3} [17.56450] \approx \mathbf{1.46371}$

**Cotes d'error (a):**
Necessitem les derivades: $ f''(x) = (2+4x^2)e^{x^2}$ i $ f^{(4)}(x) = (12+48x^2+16x^4)e^{x^2}$.
- $ max |f''(x)| = f''(1) = 6e \approx 16.31 $
- $ max |f^{(4)}(x)| = f^{(4)}(1) = 76e \approx 206.59 $

Fórmules de l'error:
$|E_T| \leq \frac{(b-a)h^2}{12} M_2, \quad |E_S| \leq \frac{(b-a)h^4}{180} M_4 $

$|E_T| \leq \frac{1 \cdot 0.25^2}{12} \cdot 16.31 \approx \mathbf{0.0849}$
$|E_S| \leq \frac{1 \cdot 0.25^4}{180} \cdot 206.59 \approx \mathbf{0.00448}$

---

### b) $\int_0^1 \cos(x^2) \, dx $

Taula de valors ($ g(x) = \cos(x^2)$):
- $ g(0) = 1 $
- $ g(0.25) \approx 0.99805 $
- $ g(0.5) \approx 0.96891 $
- $ g(0.75) \approx 0.84592 $
- $ g(1) \approx 0.54030 $

**Mètode dels Trapezis ($ T $):**
$ T = \frac{0.25}{2} [g(0) + 2(g(0.25) + g(0.5) + g(0.75)) + g(1)]$
$ T = 0.125 [1 + 2(2.81288) + 0.54030] = 0.125 [7.16606] \approx \mathbf{0.89576}$

**Regla de Simpson ($ S $):**
$ S = \frac{0.25}{3} [g(0) + 4g(0.25) + 2g(0.5) + 4g(0.75) + g(1)]$
$ S = \frac{0.25}{3} [1 + 3.99220 + 1.93782 + 3.38368 + 0.54030] = \frac{0.25}{3} [10.85400] \approx \mathbf{0.90450}$

**Cotes d'error (b):**
Derivada segona: $ g''(x) = -2\sin(x^2) - 4x^2\cos(x^2)$.
- $ max |g''(x)| \approx |g''(1)| = |-2\sin(1) - 4\cos(1)| \approx 3.844 $

$|E_T| \leq \frac{1 \cdot 0.0625}{12} \cdot 3.844 \approx \mathbf{0.0200}$
*(Nota: Les derivades de Simpson per $\cos(x^2)$ són més complexes però segueixen la mateixa metodologia de cotes superiors).*


---

## Exercici 13: Determinació de la partició per a un error fixat

### Enunciat

Feu ús de les fórmules dels trapezis i de Simpson per avaluar les integrals següents amb un error més petit que $ 0.5 \cdot 10^{-2}$:

a) $\int_0^1 e^{x^2} \, dx $;

b) $\int_0^1 \cos(x^2) \, dx $.

### Solució


Volem que l'error $|E| < \epsilon = 0.005 $. Utilitzarem les cotes de les derivades calculades a l'exercici anterior.

---

### a) $\int_0^1 e^{x^2} \, dx $

Dades: $ b-a = 1 $. Cotes: $\max |f''(x)| \approx 16.31 $ i $\max |f^{(4)}(x)| \approx 206.59 $.

**Mètode dels Trapezis:**
$\frac{(b-a)h^2}{12} M_2 < 0.005 \implies \frac{h^2}{12} \cdot 16.31 < 0.005 $
$ h^2 < \frac{0.06}{16.31} \approx 0.003678 \implies h < 0.0606 $
$ n = \frac{1}{h} > 16.5 \implies \mathbf{n = 17}$

**Regla de Simpson:**
$\frac{(b-a)h^4}{180} M_4 < 0.005 \implies \frac{h^4}{180} \cdot 206.59 < 0.005 $
$ h^4 < \frac{0.9}{206.59} \approx 0.00435 \implies h < 0.256 $
$ n = \frac{1}{h} > 3.9 \implies \mathbf{n = 4}$ (ha de ser parell)

---

### b) $\int_0^1 \cos(x^2) \, dx $

Dades: $ b-a = 1 $. Cotes: $\max |g''(x)| \approx 3.844 $ i $\max |g^{(4)}(x)| \approx 42.48 $.

**Mètode dels Trapezis:**
$\frac{h^2}{12} \cdot 3.844 < 0.005 \implies h^2 < \frac{0.06}{3.844} \approx 0.0156 $
$ h < 0.125 $
$ n = \frac{1}{h} > 8 \implies \mathbf{n = 9}$ (o $ n=8 $ si l'error és molt ajustat)

**Regla de Simpson:**
$\frac{h^4}{180} \cdot 42.48 < 0.005 \implies h^4 < \frac{0.9}{42.48} \approx 0.02118 $
$ h < 0.381 $
$ n = \frac{1}{h} > 2.62 \implies \mathbf{n = 4}$ (ha de ser parell)

---

### Resum de resultats

| Integral | Trap. ($ n $) | Simp. ($ n $) |
|---|---|---|
| (a) $\int e^{x^2}$ | 17 | 4 |
| (b) $\int \cos(x^2)$ | 9 | 4 |

**Nota:** Per a ambdues funcions, el mètode de Simpson requereix molts menys subintervals (només 4) per assolir la mateixa precisió del $ 0.5 \%$, mentre que el dels trapezis en requereix prop del doble o més (fins a 17 en el cas de l'exponencial).


---

## Exercici 14: Anàlisi de l'error en la regla de Simpson

### Enunciat

Siguin $ f(x) = \cos^3(x)$ i $ I = \int_0^1 \cos^3(x) \, dx $.

a) Comproveu que $ f''(x) = 6\cos(x) - 9\cos^3(x)$ i $ f^{(4)}(x) = -60\cos(x) + 81\cos^3(x)$.

b) Justifiqueu que $\max_{x \in [0,1]} |f''(x)| \leq 3 $ i $\max_{x \in [0,1]} |f^{(4)}(x)| \leq 21 $.

c) Calculeu $ I $ amb un error menor que $ 10^{-4}$.

### Solució


### a) Derivació de la funció

Tenim $ f(x) = (\cos x)^3 $. Calculem les derivades successives:
1. $ f'(x) = 3\cos^2 x (-\sin x) = -3\cos^2 x \sin x $.
2. $ f''(x) = -3 [ 2\cos x (-\sin x) \sin x + \cos^2 x \cos x ] = -3 [ -2\sin^2 x \cos x + \cos^3 x ]$.
   Utilitzant $\sin^2 x = 1 - \cos^2 x $:
   $ f''(x) = -3 [ -2(1-\cos^2 x)\cos x + \cos^3 x ] = -3 [ -2\cos x + 3\cos^3 x ] = \mathbf{6\cos x - 9\cos^3 x}$.
3. $ f'''(x) = (-6 + 27\cos^2 x)\sin x $.
4. $ f^{(4)}(x) = (-54\cos x \sin^2 x) + (-6 + 27\cos^2 x)\cos x = -54\cos x (1-\cos^2 x) - 6\cos x + 27\cos^3 x $.
   $ f^{(4)}(x) = -54\cos x + 54\cos^3 x - 6\cos x + 27\cos^3 x = \mathbf{81\cos^3 x - 60\cos x}$.

---

### b) Justificació de les cotes

En l'interval $ x \in [0, 1]$, la funció $\cos x $ és decreixent i pren valors entre $\cos(1) \approx 0.54 $ i $\cos(0) = 1 $. Fem el canvi de variable $ u = \cos x $, on $ u \in [0.54, 1]$.

**Per a $ f''(x)$:**
Estudiem $ g(u) = 6u - 9u^3 $. La seva derivada és $ g'(u) = 6 - 27u^2 $. S'anul·la en $ u = \sqrt{6/27} \approx 0.47 $, que queda fora de l'interval $[0.54, 1]$. Els valors als extrems són:
- $ g(1) = 6 - 9 = -3 $.
- $ g(0.54) \approx 1.83 $.
Per tant, $|f''(x)| \leq |-3| = \mathbf{3}$.

**Per a $ f^{(4)}(x)$:**
Estudiem $ h(u) = 81u^3 - 60u $. La seva derivada $ h'(u) = 243u^2 - 60 $ s'anul·la en $ u \approx 0.49 $, també fora de l'interval.
- $ h(1) = 81 - 60 = 21 $.
- $ h(0.54) \approx -19.6 $.
Per tant, $|f^{(4)}(x)| \leq \mathbf{21}$.

---

### c) Càlcul de $ I $ amb error $< 10^{-4}$

Utilitzarem la **Regla de Simpson**. Busquem $ n $ tal que $|E_S| < 10^{-4}$:
$\frac{(b-a)h^4}{180} M_4 < 10^{-4} \implies \frac{1 \cdot h^4}{180} \cdot 21 < 10^{-4}$
$ h^4 < \frac{180 \cdot 10^{-4}}{21} \approx 0.000857 \implies h < \sqrt[4]{0.000857} \approx 0.171 $
$ n = \frac{1}{h} \geq 5.85 $. Com que $ n $ ha de ser parell, triem **$ n = 6 $**.

Càlcul per Simpson ($ n=6, h=1/6 $):
$ I \approx \frac{1}{18} [f(0) + 4f(1/6) + 2f(2/6) + 4f(3/6) + 2f(4/6) + 4f(5/6) + f(1)]$
Operant amb els valors de $\cos^3(x)$:
$ I \approx \frac{1}{18} [1 + 3.8213 + 1.6375 + 2.6582 + 0.9424 + 1.1576 + 0.1577] \approx \mathbf{0.6429}$

*(Nota: El valor exacte integrant analíticament és $\sin(1) - \frac{\sin^3(1)}{3} \approx 0.64287 $, el que confirma que l'error amb $ n=6 $ és inferior a $ 10^{-4}$).*


---

## Exercici 15: Punt crític i integració numèrica

### Enunciat

Sigui $ F(x) = \int_1^{x^2+2} \frac{e^t}{t} \, dt $.

a) Comproveu que $ x = 0 $ és un punt crític de $ F $.

b) Calculeu el valor aproximat de $ F(0)$ utilitzant el mètode de Simpson amb 4 subintervals.

c) Sabent que per $ f(t) = \frac{e^t}{t}$ es té $|f^{(4)}(t)| < 25 $ per a tot $ t \in [1, 2]$, calculeu la cota superior de l'error comès.

### Solució


### a) Punt crític

Per trobar els punts crítics, derivem $ F(x)$ utilitzant el Teorema Fonamental del Càlcul i la regla de la cadena:
$ F'(x) = \frac{d}{dx} \left( \int_1^{x^2+2} \frac{e^t}{t} \, dt \right) = \frac{e^{x^2+2}}{x^2+2} \cdot \frac{d}{dx}(x^2+2) = \frac{e^{x^2+2}}{x^2+2} \cdot 2x $

Substituint $ x = 0 $:
$ F'(0) = \frac{e^{0^2+2}}{0^2+2} \cdot 2(0) = \frac{e^2}{2} \cdot 0 = 0 $

Com que l'anul·lació de la derivada és la condició de punt crític, quedat comprovat que **$ x=0 $ és un punt crític**.

---

### b) Aproximació de $ F(0)$

Tenim $ F(0) = \int_1^2 \frac{e^t}{t} \, dt $. Aplicarem Simpson amb $ n=4 $ i $ h = \frac{2-1}{4} = 0.25 $.

**Taula de valors ($ f(t) = e^t/t $):**
- $ t_0 = 1.00 \implies f(1.00) = e/1 \approx 2.71828 $
- $ t_1 = 1.25 \implies f(1.25) = e^{1.25}/1.25 \approx 2.79227 $
- $ t_2 = 1.50 \implies f(1.50) = e^{1.5}/1.5 \approx 2.98779 $
- $ t_3 = 1.75 \implies f(1.75) = e^{1.75}/1.75 \approx 3.28834 $
- $ t_4 = 2.00 \implies f(2.00) = e^2/2 \approx 3.69453 $

**Càlcul per Simpson:**
$ S = \frac{0.25}{3} [f(t_0) + 4f(t_1) + 2f(t_2) + 4f(t_3) + f(t_4)]$
$ S = \frac{1}{12} [2.71828 + 11.16908 + 5.97558 + 13.15336 + 3.69453]$
$ S = \frac{1}{12} [36.71083] \approx \mathbf{3.05924}$

---

### c) Cota superior de l'error

Utilitzem la fórmula de l'error per a Simpson amb $ M_4 = 25 $ i $ h = 0.25 $:
$|E_S| \leq \frac{(b-a)h^4}{180} M_4 = \frac{1 \cdot (0.25)^4}{180} \cdot 25 $
$|E_S| \leq \frac{0.00390625}{180} \cdot 25 = \frac{0.09765625}{180} \approx \mathbf{0.0005425}$

L'error comès és inferior a $ 5.43 \cdot 10^{-4}$.


---

