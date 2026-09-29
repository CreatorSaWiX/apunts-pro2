---
title: "Tema 1: Anàlisi d'algorismes"
description: "Eficiència algorísmica, notació asimptòtica (O, Ω, Θ), anàlisi iteratiu i recursiu, i teoremes mestres."
readTime: "20 min"
order: 1
draft: false
---

El temps d'execució d'un algorisme, $T(n)$, s'avalua en funció de la **mida de l'entrada** ($n$):
- **Vectors / Llistes:** Nombre d'elements ($n$).
- **Grafs:** Nombre de vèrtexs ($|V|$) i arestes ($|E|$), expressat generalment com $|V| + |E|$.
- **Matrius:** Nombre de cel·les ($n \times m$) o dimensió ($n$).

Per a una mida $n$ fixada, el cost pot variar segons la instància concreta:

| Cas | Notació | Definició | Exemple (cerca en vector) |
| :--- | :--- | :--- | :--- |
| **Cas millor** | $T_{\min}(n)$ | Temps mínim sobre totes les entrades de mida $n$. | Trobar l'element a la primera posició ($\mathcal{O}(1)$). |
| **Cas mitjà** | $T_{\text{mitjà}}(n)$ | Temps esperat assumint una distribució uniforme d'entrades. | Trobar l'element cap a la meitat ($\mathcal{O}(n)$). |
| **Cas pitjor** | $T_{\max}(n)$ | Temps màxim sobre totes les entrades de mida $n$ (estàndard a EDA: cota superior segura). | Trobar l'element al final o que no hi sigui ($\mathcal{O}(n)$). |

---

## 1.1. Definicions formals de notació asimptòtica

La notació asimptòtica caracteritza el comportament d'una funció de cost $f(n)$ quan $n \to \infty$, ignorant constants multiplicatives i termes d'ordre inferior respecte a una funció de referència $g(n)$.

### Cota superior: $\mathcal{O}$ gran (òmicron)
Indica que $f(n)$ creix com a màxim tan ràpidament com $g(n)$ a partir d'un cert $n_0$ ($f(n) \le c \cdot g(n)$), garantint un límit superior al cost de l'algorisme:

$$
\mathcal{O}(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tal que} \quad \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}
$$

### Cota inferior: $\Omega$ gran (omega)
Indica que $f(n)$ creix com a mínim tan ràpidament com $g(n)$ a partir d'un cert $n_0$ ($f(n) \ge c \cdot g(n)$), garantint un límit inferior al cost de l'algorisme:

$$
\Omega(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tal que} \quad \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}
$$

### Cota ajustada: $\Theta$ gran (theta)
Indica que $f(n)$ creix al mateix ritme que $g(n)$ a partir d'un cert $n_0$ ($c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$), descrivint el comportament asimptòtic exacte:

$$
\Theta(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c_1, c_2 \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tal que} \quad \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}
$$

| Notació | Tipus de cota | Condició asimptòtica ($\forall n \ge n_0$) | Relació intuitiva |
| :--- | :--- | :--- | :--- |
| $\mathcal{O}(g)$ | Cota superior | $f(n) \le c \cdot g(n)$ | $f \le g$ |
| $\Omega(g)$ | Cota inferior | $f(n) \ge c \cdot g(n)$ | $f \ge g$ |
| $\Theta(g)$ | Cota ajustada | $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$ | $f \approx g$ |

:::asymptoticviz
:::

### Criteri del límit del quocient
Permet determinar la relació asimptòtica entre dues funcions positives $f(n)$ i $g(n)$ calculant el límit del seu quocient quan $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Valor de $L$ | Relació de creixement | Conclusió asimptòtica | Exemple |
| :--- | :--- | :--- | :--- |
| $L = 0$ | $f$ creix estrictament més a poc a poc que $g$ | $f \in \mathcal{O}(g)$ i $f \notin \Omega(g)$ | $\lim \frac{n}{n^2} = 0 \implies n \in \mathcal{O}(n^2)$ |
| $0 < L < \infty$ | Mateix ordre de creixement | $f \in \Theta(g) \iff g \in \Theta(f)$ | $\lim \frac{5n^2 + 3}{2n^2} = \frac{5}{2} \implies 5n^2 + 3 \in \Theta(n^2)$ |
| $L = \infty$ | $f$ creix estrictament més ràpid que $g$ | $f \in \Omega(g)$ i $f \notin \mathcal{O}(g)$ | $\lim \frac{n^2}{n} = \infty \implies n^2 \in \Omega(n)$ |

> Si el límit oscil·la o no existeix, cal aplicar la definició formal amb constants $c$ i $n_0$.

### Propietats fonamentals de les classes asimptòtiques

| Propietat | Formulació | Descripció / Exemple |
| :--- | :--- | :--- |
| **Reflexivitat** | $f \in \mathcal{O}(f), \quad f \in \Omega(f), \quad f \in \Theta(f)$ | Tota funció creix al seu mateix ritme. |
| **Simetria** | $f \in \Theta(g) \iff g \in \Theta(f)$ | Vàlida només per a $\Theta$ (no aplicable a $\mathcal{O}$ ni $\Omega$). |
| **Transitivitat** | $f \in \mathcal{O}(g) \land g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ | Vàlida també per a $\Omega$ i $\Theta$. |
| **Dualitat** | $f \in \mathcal{O}(g) \iff g \in \Omega(f)$ | Relació inversa entre cotes superior i inferior. |
| **Invariància per constants** | $\mathcal{O}(k \cdot f) = \mathcal{O}(f) \quad (k > 0)$ | Les constants multiplicatives no alteren la classe asimptòtica. |
| **Regla de la suma** | $\Theta(f) + \Theta(g) = \Theta(\max(f, g))$ | El terme dominant determina l'ordre ($n^2 + n \in \Theta(n^2)$). |
| **Regla del producte** | $\Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$ | Aplicable a blocs o bucles niats ($n \cdot \log n \implies \Theta(n \log n)$). |

---

## 1.2. Jerarquia de creixement

### Regles de simplificació asimptòtica

| Família / Relació | Formulació | Propietat |
| :--- | :--- | :--- |
| **Polinomis** | $p(n) = \sum_{i=0}^k a_i n^i \in \Theta(n^k)$ | Domina el terme de major grau ($a_k > 0$); els termes inferiors i el coeficient es descarten. |
| **Logaritmes** | $\Theta(\log_a n) = \Theta(\log_b n)$ | La base no altera la classe asimptòtica per la fórmula de canvi de base: $\log_a n = \frac{\log_b n}{\log_b a}$. S'escriu $\Theta(\log n)$. |
| **Logaritmes vs Polinomis** | $\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$ | Qualsevol potència de logaritme creix més a poc a poc que qualsevol potència de $n$ ($a, b > 0$). |
| **Polinomis vs Exponencials** | $\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$ | Qualsevol polinomi creix més a poc a poc que qualsevol exponencial ($b > 0, c > 1$). |

> La base del logaritme **sí que és rellevant** quan forma part de l'exponent: $2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631}$.

### Cadena de creixement asimptòtic universal

:::growthviz
:::

### Frontera de la intractabilitat i impacte de la tecnologia
Quan un algorisme té cost exponencial ($2^n$ o $3^n$), el temps es dispara fins i tot per a mides ridículament petites. Assumint un processador estàndard que executa $10^6$ operacions bàsiques per segon ($1\,\mu\text{s}$ per operació):

| Complexitat | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ | Efecte de comprar una màquina $\times 1000$ més ràpida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $n$ (lineal) | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ | Mida $1000 \cdot N$ (guany proporcional complet) |
| $n^2$ (quadràtic) | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ | Mida $\sqrt{1000} \cdot N \approx 31.6 \cdot N$ (guany amortit per arrel) |
| $n^3$ (cúbic) | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ | Mida $\sqrt[3]{1000} \cdot N = 10 \cdot N$ |
| $2^n$ (exponencial) | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ anys}$** | Només $N + \log_2(1000) \approx \mathbf{N + 10}$ elements més! |
| $3^n$ (exponencial) | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ anys}$ | **$2 \times 10^8\text{ segles}$** | Només $N + \log_3(1000) \approx \mathbf{N + 6.3}$ elements més! |

Si comprem una màquina $m = 1000$ cops més ràpida, només se suma una petita constant. L'única solució possible és el **redisseny algorísmic**.

---

## 1.3. Algorismes no recursius

### Operacions elementals i pas de paràmetres

| Concepte / Operació | Cost | Justificació / Regla |
| :--- | :---: | :--- |
| **Operacions primitives i I/O simple** | $\Theta(1)$ | Assignacions primitives, operadors aritmètics/lògics/relacionals i `cin`/`cout` simple. |
| **Accés indexat `v[i]`** | $\Theta(1)$ | Aritmètica de punters sobre memòria contigua ($\text{adreça} = \text{inici} + i \cdot \text{mida}$). |
| **Pas per referència (`&`, `const &`)** | $\Theta(1)$ | Es transmet l'adreça de memòria (punter), sense duplicar dades. |
| **Pas per valor (`vector<T>` de mida $n$)** | $\Theta(n)$ | Clona els $n$ elements reservant memòria a la *heap*. |

### Estructures de control

| Estructura | Esquema sintàctic | Càlcul de cost | Comportament |
| :--- | :--- | :--- | :--- |
| **Seqüència** | $F_1; \; F_2; \; \dots; \; F_k$ | $\Theta(\max(C_1, \dots, C_k))$ | Suma de passos consecutius; el terme de major cost determina la complexitat. |
| **Alternativa** | `if (B) F1 else F2` | **Pitjor:** $D + \max(C_1, C_2)$<br>**Millor:** $D + \min(C_1, C_2)$ | $D$ és el cost d'avaluar $B$ ($\Theta(1)$ generalment). Sense `else`, el millor cas és només $D$. |
| **Iteració** | `for` / `while` ($N$ iteracions) | $\sum_{k=1}^N C_k + (N+1)\Theta(1)$ | La condició s'avalua $N+1$ cops i el cos $N$ cops. Si $C_k = \Theta(1)$, el cost total és $\Theta(N)$. |

---

### Ordenació per selecció (Selection Sort)
A cada iteració $i$ (de $n-1$ baixant fins a $1$), cerca el màxim de la part restant $v[0 \dots i]$ i l'intercanvia amb $v[i]$, deixant-lo fixat al final:

:::oopviz{simulation="selection_sort"}
:::


:::selectionsortviz
:::



La cerca del màxim sobre el subvector $v[0 \dots i]$ requereix comparar tots els seus elements, suposant $i$ comparacions. Com que l'índex $i$ decreix d'$n - 1$ fins a $1$, el nombre total de comparacions ve donat per la suma aritmètica de Gauss:

$$
\sum_{i=1}^{n-1} i = (n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

A cada iteració es realitza exactament un intercanvi (`swap`), donant $n - 1$ moviments ($\Theta(n)$). El cost total de l'algorisme és la suma d'ambdós:

$$
T_{\text{sel}}(n) = \Theta(n^2) + \Theta(n) = \Theta(n^2)
$$

L'algorisme no disposa de sortida anticipada; executa exactament les mateixes comparacions independentment de l'ordenació inicial de l'entrada. Per tant:

$$
T_{\min}(n) = T_{\text{mitjà}}(n) = T_{\max}(n) = \Theta(n^2)
$$

### Ordenació per inserció (Insertion Sort)

:::oopviz{simulation="insertion_sort"}
:::

La barra $\mid$ separa la part ja ordenada $v[0 \dots k-1]$ (esquerra) de la part pendent d'explorar (dreta):

:::insertionsortviz
:::



A diferència de selecció, la inserció és un algorisme **adaptatiu**: el bucle intern s'atura tan bon punt troba un element menor o igual, de manera que el nombre d'operacions depèn de la disposició de les dades.

**Cas millor (vector ja ordenat):** Cada nou element compleix $v[k] \ge v[k-1]$. La condició del bucle intern falla a la primera comprovació i fa $0$ intercanvis:

$$
T_{\min}(n) = \sum_{k=1}^{n-1} 1 = n - 1 \in \Theta(n)
$$

**Cas pitjor (vector en ordre invers):** Cada element $v[k]$ és menor que tots els anteriors i ha de retrocedir fins a la posició inicial ($k$ comparacions i $k$ intercanvis):

$$
T_{\max}(n) = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} \in \Theta(n^2)
$$

**Cas mitjà (ordre aleatori):** Assumint distribució uniforme, cada element retrocedeix de mitjana fins a la meitat del prefix ordenat ($k/2$ passos), resultant en $T_{\text{mitjà}}(n) \approx \sum_{k=1}^{n-1} \frac{k}{2} \approx \frac{n^2}{4} \in \Theta(n^2)$. En vectors **quasi-ordenats** (on cap element es troba a més d'una distància fitada $c \in \mathcal{O}(1)$ de la posició definitiva), el cost total és $\mathcal{O}(c \cdot n) = \Theta(n)$.

Cada intercanvi de components adjacents redueix exactament una inversió (parella $(i, j)$ amb $i < j$ tal que $v[i] > v[j]$). El cost total queda determinat directament pel nombre d'inversions inicials $I$:

$$
T(n) = \Theta(n + I) \quad \text{amb} \quad 0 \le I \le \frac{n(n-1)}{2}
$$

---

## 1.4. Algorismes recursius i teoremes mestres

El cost d'una funció recursiva s'expressa mitjançant una equació de recurrència:

$$ 
C(n) = a \cdot C(\text{mida subproblema}) + g(n) 
$$

on $a \ge 1$ és el nombre de crides recursives i $g(n)$ és el cost de la feina no recursiva (preparació i combinació).

### Teorema mestre de recurrències subtractives
Aplica a recurrències on cada crida redueix la mida de l'entrada en una quantitat constant $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad\text{amb } g(n) \in \Theta(n^k), \; k \ge 0
$$

La complexitat asimptòtica es resol segons el valor del factor de ramificació $a$:

$$
C(n) \in \begin{cases} 
\Theta(n^k), & \text{si } a < 1 \\ 
\Theta(n^{k+1}), & \text{si } a = 1 \\ 
\Theta(a^{n/c}), & \text{si } a > 1 
\end{cases}
$$

| Recurrència | Paràmetres | Cas | Complexitat | Algorisme |
| :--- | :--- | :---: | :---: | :--- |
| $C(n) = C(n-1) + \Theta(1)$ | $a=1, k=0, c=1$ | $a = 1$ | $\Theta(n)$ | Cerca lineal recursiva |
| $C(n) = C(n-1) + \Theta(n)$ | $a=1, k=1, c=1$ | $a = 1$ | $\Theta(n^2)$ | Selection / Insertion sort recursiu |
| $C(n) = 2C(n-1) + \Theta(1)$ | $a=2, k=0, c=1$ | $a > 1$ | $\Theta(2^n)$ | Torres de Hanoi |

---

### Teorema mestre de recurrències divisores
Aplica a algorismes de divideix i venceràs, on la mida de l'entrada es divideix per un factor constant $b > 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad\text{amb } g(n) \in \Theta(n^k), \; k \ge 0
$$

Definim l'exponent crític $\alpha = \log_b a$. La solució depèn de la relació entre $\alpha$ i el grau no recursiu $k$:

$$
C(n) \in \begin{cases} 
\Theta(n^k), & \text{si } \alpha < k \iff a < b^k \\ 
\Theta(n^k \log n), & \text{si } \alpha = k \iff a = b^k \\ 
\Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{si } \alpha > k \iff a > b^k 
\end{cases}
$$

| Algorisme | Recurrència | Paràmetres | Relació | Complexitat |
| :--- | :--- | :--- | :--- | :---: |
| **Cerca binària** | $C(n) = C(n/2) + \Theta(1)$ | $a=1, b=2, k=0$ | $\alpha = 0 = k$ | $\Theta(\log n)$ |
| **Mergesort** | $C(n) = 2C(n/2) + \Theta(n)$ | $a=2, b=2, k=1$ | $\alpha = 1 = k$ | $\Theta(n \log n)$ |
| **Karatsuba** | $C(n) = 3C(n/2) + \Theta(n)$ | $a=3, b=2, k=1$ | $\alpha = \log_2 3 \approx 1.585 > k$ | $\Theta(n^{1.585})$ |
| **Strassen** | $C(n) = 7C(n/2) + \Theta(n^2)$ | $a=7, b=2, k=2$ | $\alpha = \log_2 7 \approx 2.807 > k$ | $\Theta(n^{2.807})$ |