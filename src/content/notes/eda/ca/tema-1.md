---
title: "Tema 1: Anàlisi d'Algorismes"
description: "Eficiència algorísmica, notació asimptòtica (O, Ω, Θ), anàlisi iteratiu i recursiu, Teoremes Mestres, Fibonacci logarítmic i fites inferiors d'ordenació."
readTime: "25 min"
order: 1
draft: false
---

## 1. Eficiència i Models de Cost

### 1.1. Objectius de l'Anàlisi
- **Comparar solucions:** Escollir l'algorisme òptim per a un mateix problema entre alternatives (p. ex., diferents mètodes d'ordenació).
- **Optimitzar:** Localitzar colls d'ampolla estructurals per reduir el cost.
- **Predir recursos:** Estimar temps d'execució i memòria abans de la implementació.
- A l'assignatura EDA, l'anàlisi se centra gairebé exclusivament en el **temps d'execució** (cost temporal).

### 1.2. Per què no mesurar en segons de rellotge?
Mesurar amb cronòmetre no és científicament invariant:
- Depèn de la màquina (CPU, memòria cau, arquitectura).
- Depèn del compilador i els nivells d'optimització (`-O2`, `-O3`).
- Depèn del llenguatge de programació (C++ compilat vs. Python interpretat).

Aquests factors només afecten per una **constant multiplicativa ($c$)**: una CPU el doble de ràpida redueix el temps a la meitat, però mai farà tractable un algorisme exponencial. Per tant, fem una **abstracció matemàtica** independent de la tecnologia.

### 1.3. Mida de l'Entrada ($n = |x|$)
Parametritzem el cost com una funció $T(n)$:
- **Vectors / Llistes:** Nombre d'elements ($n$).
- **Grafs:** Nombre de vèrtexs més nombre d'arestes ($|V| + |E|$).
- **Nombres enters ($x \in \mathbb{N}$):**
  - *Codificació binària estàndard:* Nombre de bits necessaris:
    $$n = |x| = \lfloor \log_2 x \rfloor + 1$$
  - *Codificació unària:* El valor mateix ($n = x$). Només en casos específics.

### 1.4. Mesures de Rendiment
Donat el conjunt $E$ d'entrades de mida $n$:
- **Cas Pitjor ($T_{\text{pitjor}}(n) = \max_{|x|=n} T(x)$):** Temps màxim possible. Proporciona una **garantia absoluta**: l'algorisme mai superarà aquest llindar. És la mesura estàndard emprada a EDA.
- **Cas Millor ($T_{\text{millor}}(n) = \min_{|x|=n} T(x)$):** Temps mínim possible. Poc informatiu a la pràctica, ja que no ofereix cap garantia operativa general.
- **Cas Mitjà ($T_{\text{mitjà}}(n) = \sum_{|x|=n} \Pr(x) \cdot T(x)$):**
  - És l'esperança matemàtica del cost.
  - *Intuïció de classe:* És exactament una mitjana ponderada (com calcular el pes mitjà d'alumnes a classe sumant la probabilitat de triar cadascú pel seu pes).
  - *Dificultat:* Exigeix conèixer la distribució de probabilitat de les entrades (sovint desconeguda o no uniforme).

---

## 2. Exemples Introductoris

### 2.1. Problema de Selecció ($k$-èssim element més gran de $n$ elements)
1. **Solució 1 (Ordenació total):** Ordenar el vector sencer de forma decreixent i retornar l'element a l'índex $k$. Cost: $\Theta(n \log n)$ amb mergesort/heapsort. Desaprofita feina si $k \ll n$.
2. **Solució 2 (Vector auxiliar de mida $k$ amb Invariant):**
   - **Invariant de bucle:** A cada pas, el vector auxiliar conté els $k$ elements més grans vistos fins al moment, mantinguts de forma ordenada decreixentment.
   - Per a cada element restant $x$:
     - Si $x \le$ mínim del vector auxiliar (l'últim element), **es descarta** directament en $\Theta(1)$.
     - Si $x >$ mínim, s'elimina el mínim i s'insereix $x$ a la seva posició correcta desplaçant elements en $\mathcal{O}(k)$.
   - En acabar, per l'invariant, l'element a la posició $k$ és la resposta.
   - Cost pitjor: $\Theta(k \log k + (n-k) \cdot k) = \Theta(n \cdot k)$.
   - **Comparació:** Si $k$ és constant o molt petit ($k \ll \log n$), la Solució 2 és lineal $\Theta(n)$ i supera la Solució 1. Si $k = n/2$ (mediana), degenera a $\Theta(n^2)$, sent molt pitjor que la Solució 1.

### 2.2. Problema del Mur Infinit
Cercar una porta situada a una distància desconeguda $d$ (esquerra o dreta) sobre un mur infinit amb visibilitat nul·la fins a arribar-hi:
- **Estratègia Aritmètica (Lineal):** Caminar 1 pas a la dreta i tornar; 2 a l'esquerra i tornar; 3 a la dreta...
  $$\text{Distància total} = \sum_{i=1}^d 2i = 2 \frac{d(d+1)}{2} = \Theta(d^2)$$
- **Estratègia Geomètrica (Duplicació Exponencial):** Caminar $1$ pas a la dreta i tornar; $2^1$ a l'esquerra i tornar; $2^2$ a la dreta...
  $$\text{Distància total} \le 2 \sum_{i=0}^k 2^i + d = 2(2^{k+1} - 1) + d$$
  Com que l'últim salt $2^{k-1} < d \le 2^k$, tenim $2^k < 2d$. La distància total és $\le 4(2d) + d = \Theta(d)$.
- **Conclusió:** La duplicació exponencial redueix la complexitat de quadràtica $\Theta(d^2)$ a lineal $\Theta(d)$.

---

## 3. Notació Asimptòtica Formal

Estudia el comportament límit del temps d'execució quan $n \to \infty$ ("a la llarga"). Treballem sobre funcions no negatives $f, g: \mathbb{N} \to \mathbb{R}^+$.

### 3.1. Definicions Formals
- **Cota Superior ($\mathcal{O}$ gran / Òmicron):**
  $$\mathcal{O}(g) = \{ f \mid \exists c \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ tals que } \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}$$
  *Intuïció:* $f \le g$ a la llarga (llevat de constant $c$).
- **Cota Inferior ($\Omega$ gran / Omega):**
  $$\Omega(g) = \{ f \mid \exists c \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ tals que } \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}$$
  *Intuïció:* $f \ge g$ a la llarga (llevat de constant $c$).
- **Cota Ajustada / Exacta ($\Theta$ gran / Theta):**
  $$\Theta(g) = \mathcal{O}(g) \cap \Omega(g)$$
  $$\Theta(g) = \{ f \mid \exists c_1, c_2 \in \mathbb{R}^+, \exists n_0 \in \mathbb{N} \text{ tals que } \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}$$
  *Intuïció:* $f \approx g$ a la llarga. (Atenció: no significa que $f$ i $g$ siguin funcions idèntiques, sinó que tenen la mateixa taxa de creixement).

### 3.2. Mètode de Demostració Formal (Càlcul de $c$ i $n_0$)
Per demostrar $f(n) \in \mathcal{O}(g(n))$ per definició:
1. Eliminar termes negatius per dalt: $-an \le 0$ per a $n \ge 0$.
2. Fitar termes positius de menor grau utilitzant que $n^a \le n^b$ per a tot $b \ge a$ quan $n \ge 1$.
3. Fixar una constant $c$ superior al coeficient principal resultant.
4. Resoldre la inequació per aïllar el llindar enter mínim $n_0$.

> **Exemple de classe:** Demostrar que $f(n) = 3n^3 + 5n^2 - 7n + 41 \in \mathcal{O}(n^3)$:
> 1. Fitem termes negatius: $3n^3 + 5n^2 - 7n + 41 \le 3n^3 + 5n^2 + 41$.
> 2. Com que $n^2 \le n^3$ per a $n \ge 1$: $3n^3 + 5n^2 + 41 \le 3n^3 + 5n^3 + 41 = 8n^3 + 41$.
> 3. Volem $8n^3 + 41 \le c \cdot n^3$. Triem $c = 9$: $41 \le n^3 \iff n \ge \lceil \sqrt[3]{41} \rceil = 4$.
> 4. Prenent **$c = 9$** i **$n_0 = 4$**, es compleix formalment $\forall n \ge 4,\; f(n) \le 9n^3$. Queda demostrat.

### 3.3. Criteri del Límit
Siguin $f(n), g(n) > 0$. Calculem $L = \lim_{n \to \infty} \frac{f(n)}{g(n)}$:
- **$L = 0$:** $f$ creix estrictament més a poc a poc que $g$ ($f \in \mathcal{O}(g)$ i $f \notin \Omega(g)$; notació estricta $f \prec g$).
- **$L = \infty$:** $f$ creix estrictament més ràpid que $g$ ($f \in \Omega(g)$ i $f \notin \mathcal{O}(g)$; notació estricta $f \succ g$).
- **$0 < L < \infty$:** $f$ i $g$ tenen el mateix ordre de creixement ($f \in \Theta(g) \iff g \in \Theta(f)$).
- **Si el límit oscil·la o no existeix:** Cal recórrer exclusivament a la definició formal amb quantificadors.

### 3.4. Propietats Fonamentals
- **Reflexivitat:** $f \in \Theta(f)$, $f \in \mathcal{O}(f)$, $f \in \Omega(f)$.
- **Simetria en $\Theta$:** $f \in \Theta(g) \iff g \in \Theta(f)$.
- **Transitivitat:** Si $f \in \mathcal{O}(g)$ i $g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h)$ (igualment per a $\Omega$ i $\Theta$).
- **Dualitat:** $f \in \mathcal{O}(g) \iff g \in \Omega(f)$.
- **Invariància per constants positives:** $\forall k > 0$, $\Theta(k \cdot f) = \Theta(f)$.
- **Regla de la Suma (Terme Dominant):**
  $$\Theta(f) + \Theta(g) = \Theta(f + g) = \Theta(\max(f, g))$$
  *Exemple:* $n^3 + n^2 \in \Theta(n^3)$.
- **Regla del Producte:**
  $$\mathcal{O}(f) \cdot \mathcal{O}(g) = \mathcal{O}(f \cdot g), \quad \Theta(f) \cdot \Theta(g) = \Theta(f \cdot g)$$

---

## 4. Jerarquia de Creixement i Intractabilitat

### 4.1. Classes de Creixement Estàndard
1. **Polinomis:** Per a tot polinomi $p(n) = a_k n^k + \dots + a_0$ amb $a_k > 0$:
   $$p(n) \in \Theta(n^k)$$
   (Només compta el terme de grau màxim; coeficients i graus inferiors es descarten).
2. **Logaritmes (invariància de base):** Per a qualssevol bases $a, b > 1$:
   $$\log_a n = \frac{\log_b n}{\log_b a} \implies \Theta(\log_a n) = \Theta(\log_b n)$$
   *Alerta d'examen:* La base només importa si el logaritme apareix a l'exponent ($2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2}$).
3. **Jerarquia Logaritmes vs. Polinomis vs. Exponencials:**
   Per a qualssevol constants $a, b > 0$ i $c > 1$:
   $$\lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b$$
   $$\lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n$$
   *Exemples extrems de classe:*
   - $(\ln n)^{1.000.000} \prec n^{0.00000001}$ (el polinomi sempre guanya al logaritme a la llarga).
   - $n^{1.000.000} \prec (1.00000001)^n$ (l'exponencial amb base $> 1$ sempre guanya al polinomi).
   - Si la base de l'exponencial fos $< 1$ (p. ex. $0.9^n$), la funció tendeix a 0 i no serveix com a model de cost.

### 4.2. Escala Universal de Dominància Asimptòtica
$$\Theta(1) \prec \Theta(\log \log n) \prec \Theta(\log n) \prec \Theta(\sqrt{n}) \prec \Theta(n) \prec \Theta(n \log n) \prec \Theta(n^2) \prec \Theta(n^k) \prec \Theta(c^n) \prec \Theta(n!) \prec \Theta(n^n)$$

### 4.3. Frontera de la Intractabilitat (Garey & Johnson)

#### Temps d'execució assumint $1\,\mu\text{s}$ per operació bàsica:

| Complexitat | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ |
| :--- | :--- | :--- | :--- | :--- |
| $n$ | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ |
| $n^2$ | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ |
| $n^3$ | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ |
| $2^n$ | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ anys}$** |
| $3^n$ | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ anys}$ | **$2 \times 10^8\text{ segles}$** |

#### Impacte de millores tecnològiques (Multiplicar velocitat de maquinari per $m$):
Si en un temps límit actualment resolem mida $N$:
- Per a $T(n) = n$: Resolem $m \cdot N$ (guany lineal complet).
- Per a $T(n) = n^2$: Resolem $\sqrt{m} \cdot N$ (guany reduït per arrel).
- Per a $T(n) = 2^n$: La nova mida $N'$ compleix $2^{N'} = m \cdot 2^N \implies N' = N + \log_2 m$.
  - Si $m = 100$: Només podem resoldre $N + 6.64$ elements més.
  - Si $m = 1.000$: Només podem resoldre $N + 9.97 \approx 10$ elements més.
- **Conclusió teòrica:** El maquinari no venç la complexitat exponencial; l'única via és el disseny algorísmic eficient.

---

## 5. Anàlisi d'Algorismes No Recursius (Iteratius)

### 5.1. Regles de Càlcul de Cost
1. **Operacions Elementals:** Assignacions, operacions aritmètiques amb tipus nadius, comparacions, indexació de vectors i pas per referència tenen cost $\Theta(1)$.
2. **Composició Seqüencial:** Si $F_1$ té cost $C_1$ i $F_2$ té cost $C_2$:
   $$\text{Cost}(F_1; F_2) = C_1 + C_2 = \Theta(\max(C_1, C_2))$$
3. **Composició Alternativa (`if (B) F1 else F2`):**
   $$\text{Cost} = \text{Cost}(B) + \max(\text{Cost}(F_1), \text{Cost}(F_2))$$
4. **Bucles (`for`, `while`):** Es modelen com a sumatoris: $\sum_{i=1}^{\text{voltes}} \text{Cost}(\text{cos})$.
   - Bucles independents: $\sum_{i=1}^n \Theta(1) = \Theta(n)$.
   - Bucles niats triangulars: $\sum_{i=1}^n \sum_{j=1}^i \Theta(1) = \sum_{i=1}^n i = \frac{n(n+1)}{2} = \Theta(n^2)$.
   - Bucles amb pas multiplicatiu (`i *= 2` o `i /= 2`): El nombre de passos compleix $2^k \le n \implies k = \lfloor \log_2 n \rfloor \implies \Theta(\log n)$.
   - Bucles amb condició d'arrel quadrada (`i * i <= n` o acumulant $\sum_{j=1}^k j \ge n$): Fan $\Theta(\sqrt{n})$ iteracions.

### 5.2. Comparació: Algorismes Bàsics d'Ordenació

#### Ordenació per Selecció (Selection Sort)
Troba el màxim de $v[0..i]$ i l'intercanvia amb $v[i]$, decrementant $i$ des de $n-1$ fins a 1.
- Nombre de comparacions: $\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2}$.
- Cost en Cas Millor: $\Theta(n^2)$.
- Cost en Cas Pitjor: $\Theta(n^2)$.
- *Propietat:* No és sensible a l'ordre previ de l'entrada; sempre fa exactament $\Theta(n^2)$ comparacions.

#### Ordenació per Inserció (Insertion Sort)
A cada pas $i$ (de 1 a $n-1$), insereix $v[i]$ a la seva posició correcta entre els elements ja ordenats $v[0..i-1]$ desplaçant els elements majors cap a la dreta.
- **Cas Millor (vector ja ordenat creixentment):** 1 sola comparació per volta, 0 desplaçaments. Cost: $\Theta(n)$.
- **Cas Pitjor (vector en ordre invers decreixent):** Cada element es desplaça fins al principi ($i$ comparacions i $i$ intercanvis). Cost: $\sum_{i=1}^{n-1} i = \Theta(n^2)$.
- **Cas Adaptatiu (vectors quasi-ordenats):** El cost total és $\Theta(n + I)$, on $I$ és el nombre d'inversions del vector. Si cada element està a distància fitada per una constant $B$ de la seva posició final, el cost és lineal $\Theta(n)$.

---

## 6. Anàlisi d'Algorismes Recursius i Teoremes Mestres

### 6.1. Formulació de Recurrències
El cost d'una funció recursiva s'expressa com:
$$T(n) = \begin{cases} \text{cost base}, & \text{si } n \le n_0 \\ a \cdot T(\text{mida subproblema}) + g(n), & \text{si } n > n_0 \end{cases}$$
on $a$ és el nombre de crides recursives i $g(n)$ és el treball no recursiu (divisió i combinació).

- **Cerca Lineal Recursiva:** $T(n) = T(n-1) + \Theta(1) \implies \Theta(n)$.
- **Cerca Binària Recursiva:** $T(n) = T(n/2) + \Theta(1) \implies \Theta(\log n)$.

---

### 6.2. Teorema Mestre de Recurrències Subtractives (FIB)

Aplica a recurrències de la forma:
$$T(n) = \begin{cases} f(n), & \text{si } 0 \le n < n_0 \\ a \cdot T(n-c) + g(n), & \text{si } n \ge n_0 \end{cases}$$
amb $n_0 \in \mathbb{N}$, $c \ge 1$, $a > 0$ i $g(n) \in \Theta(n^k)$ per a $k \ge 0$.

$$T(n) \in \begin{cases} \Theta(n^k), & \text{si } a < 1 \\ \Theta(n^{k+1}), & \text{si } a = 1 \\ \Theta(a^{n/c}), & \text{si } a > 1 \end{cases}$$

- **Exemple $a = 1$:** $T(n) = T(n-1) + \Theta(n) \implies a=1, c=1, k=1 \implies T(n) \in \Theta(n^{1+1}) = \Theta(n^2)$.
- **Exemple $a > 1$:** $T(n) = 2T(n-1) + \Theta(1) \implies a=2, c=1, k=0 \implies T(n) \in \Theta(2^n)$.

---

### 6.3. Teorema Mestre de Recurrències Divisores (FIB)

Aplica a recurrències de la forma:
$$T(n) = \begin{cases} f(n), & \text{si } 0 \le n < n_0 \\ a \cdot T(n/b) + g(n), & \text{si } n \ge n_0 \end{cases}$$
amb $n_0 \in \mathbb{N}$, $a \ge 1$, $b > 1$ i $g(n) \in \Theta(n^k)$ per a $k \ge 0$.

Definim l'exponent crític de les fulles: **$\alpha = \log_b(a)$**.

$$T(n) \in \begin{cases} \Theta(n^k), & \text{si } \alpha < k \iff a < b^k \quad (\text{domina el treball no recursiu}) \\ \Theta(n^k \log n), & \text{si } \alpha = k \iff a = b^k \quad (\text{treball equilibrat a cada nivell}) \\ \Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{si } \alpha > k \iff a > b^k \quad (\text{dominen les fulles de l'arbre}) \end{cases}$$

#### Cas generalitzat amb factors polilogarítmics:
Si $g(n) \in \Theta(n^\alpha \log^p n)$ amb $p \ge 0$:
$$T(n) \in \Theta(n^\alpha \log^{p+1} n)$$

#### Exemples típics:
- **Mergesort (Ordenació per fusió):**
  $$T(n) = 2T(n/2) + \Theta(n) \implies a=2, b=2, k=1 \implies \alpha = \log_2 2 = 1 = k \implies T(n) \in \Theta(n \log n)$$
- **Multiplicació de Karatsuba:**
  $$T(n) = 3T(n/2) + \Theta(n) \implies a=3, b=2, k=1 \implies \alpha = \log_2 3 \approx 1.585 > 1 \implies T(n) \in \Theta(n^{\log_2 3})$$
- **Multiplicació de matrius de Strassen:**
  $$T(n) = 7T(n/2) + \Theta(n^2) \implies a=7, b=2, k=2 \implies \alpha = \log_2 7 \approx 2.807 > 2 \implies T(n) \in \Theta(n^{\log_2 7})$$

---

## 7. Estudi de Cas: Nombres de Fibonacci

Definició: $f(0) = 1$, $f(1) = 1$, $f(k) = f(k-1) + f(k-2)$ per a $k \ge 2$.

### 7.1. Solució 1: Recursiva Simple
```cpp
int fib(int k) {
    if (k <= 1) return 1;
    return fib(k - 1) + fib(k - 2);
}
```
- Recurrència de cost: $T(k) = T(k-1) + T(k-2) + \Theta(1)$.
- Fitació superior: $T(k) \le 2T(k-1) + \Theta(1) \implies T(k) \in \mathcal{O}(2^k)$.
- Fitació inferior: $T(k) \ge 2T(k-2) + \Theta(1) \implies T(k) \in \Omega((\sqrt{2})^k) \approx \Omega(1.414^k)$.
- **Cost exacte:** Resolent l'equació característica $r^2 - r - 1 = 0$, les arrels són $r = \frac{1 \pm \sqrt{5}}{2}$. La solució és dominada per la raó àuria $\phi = \frac{1+\sqrt{5}}{2} \approx 1.618$:
  $$T(k) \in \Theta(\phi^k)$$
  Totalment intractable per a valors moderats de $k$.

### 7.2. Solució 2: Iterativa (Programació Dinàmica)
```cpp
int fib(int k) {
    if (k <= 1) return 1;
    int cur = 1, pre = 1;
    for (int i = 1; i < k; ++i) {
        int tmp = pre;
        pre = cur;
        cur = cur + tmp;
    }
    return cur;
}
```
- Fa $k-1$ iteracions amb feina $\Theta(1)$ per iteració.
- **Cost temporal:** $\Theta(k)$ (lineal).
- **Cost espacial:** $\Theta(1)$.

### 7.3. Solució 3: Logarítmica per Exponenciaciò Ràpida de Matrius
Relació matricial (demostrable formalment per inducció per a tot $k \ge 0$):
$$\begin{pmatrix} f(k+1) \\ f(k) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} f(k) \\ f(k-1) \end{pmatrix} \implies \begin{pmatrix} f(k+1) & f(k) \\ f(k) & f(k-1) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^k$$

#### Algorisme d'Exponenciaciò Ràpida (`pow`):
Per calcular $M^k$, aprofitem la propietat de divisió per 2:
$$M^k = \begin{cases} I, & \text{si } k = 0 \\ (M^{k/2})^2, & \text{si } k \text{ és parell} \\ M \cdot (M^{\lfloor k/2 \rfloor})^2, & \text{si } k \text{ és senar} \end{cases}$$

```cpp
typedef vector<vector<int>> matrix;

matrix multiply(const matrix& A, const matrix& B) {
    matrix C(2, vector<int>(2, 0));
    for (int i = 0; i < 2; ++i)
        for (int j = 0; j < 2; ++j)
            for (int p = 0; p < 2; ++p)
                C[i][j] += A[i][p] * B[p][j];
    return C;
}

matrix pow(const matrix& A, int k) {
    if (k == 0) return {{1, 0}, {0, 1}};
    matrix B = pow(A, k / 2);
    matrix B2 = multiply(B, B);
    if (k % 2 == 0) return B2;
    else return multiply(A, B2);
}

int fib(int k) {
    matrix F = {{1, 1}, {1, 0}};
    matrix P = pow(F, k);
    return P[1][0] + P[1][1]; // Retorna f(k)
}
```
- Multiplicar dues matrius de mida constant $2 \times 2$ costa $\Theta(1)$.
- Recurrència de cost: $T(k) = T(k/2) + \Theta(1)$.
- Aplicant el Teorema Mestre divisor: $a=1, b=2, k=0 \implies \alpha = \log_2 1 = 0 = k \implies T(k) \in \Theta(\log k)$.

---

## 8. Fita Inferior dels Algorismes d'Ordenació per Comparació

### 8.1. Model d'Arbres de Decisió
- Qualsevol algorisme d'ordenació basat en comparacions entre parells d'elements ($a_i < a_j$) es pot modelar com un **arbre binari de decisió**:
  - Cada **node intern** representa una comparació $a_i \le a_j$.
  - Cada branca representa el resultat booleà (`cert` cap a l'esquerra, `fals` cap a la dreta).
  - Cada **fulla** representa la permutació ordenada final dels elements.
- **Cost en el pitjor cas:** És la longitud del camí més llarg des de l'arrel fins a una fulla, és a dir, l'**alçada de l'arbre ($d$)**.

### 8.2. Demostració de la Cota $\Omega(n \log n)$
1. **Nombre de permutacions possibles:** Per a $n$ elements diferents, hi ha $n!$ ordenacions possibles.
2. Com que cada entrada pot tenir qualsevol ordenació inicial, cada possible permutació ha d'aparèixer com a mínim en una fulla de l'arbre (si una permutació no aparegués, l'algorisme fallaria per a aquella entrada).
   Per tant, si $L$ és el nombre de fulles:
   $$L \ge n!$$
3. **Propietat dels arbres binaris:** Un arbre binari d'alçada $d$ té com a màxim $2^d$ fulles:
   $$L \le 2^d$$
4. Combinant ambdues desigualtats:
   $$n! \le L \le 2^d \implies 2^d \ge n! \implies d \ge \log_2(n!)$$
5. **Fitació de $\log_2(n!)$:**
   Eliminant la meitat inferior dels factors:
   $$n! = n \cdot (n-1) \cdots 1 \ge n \cdot (n-1) \cdots \lceil n/2 \rceil \ge \left(\frac{n}{2}\right)^{n/2}$$
   Prenent logaritmes:
   $$\log_2(n!) \ge \log_2\left(\left(\frac{n}{2}\right)^{n/2}\right) = \frac{n}{2} \log_2\left(\frac{n}{2}\right) = \frac{n}{2} (\log_2 n - 1) \in \Omega(n \log n)$$

> **Teorema:** Tot algorisme d'ordenació basat en comparacions requereix, en el cas pitjor, $\Omega(n \log n)$ comparacions.
> 
> **Corol·lari:** Com que el Mergesort té un cost en el pitjor cas de $\Theta(n \log n)$, és asimptòticament **òptim**. Cap algorisme basat en comparacions pot tenir un cost asimptòtic inferior.