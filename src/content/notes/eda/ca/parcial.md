---
title: "Parcial EDA"
description: "Resum tema 1 - tema 3"
readTime: "20 min"
order: 4
draft: false
---

## 1. Anàlisi d'algorismes

- **$\mathcal{O}(g)$** (cota superior): $f(n) \le c \cdot g(n)$  *(creix com a molt com $g$)*
- **$\Omega(g)$** (cota inferior): $f(n) \ge c \cdot g(n)$  *(creix com a mínim com $g$)*
- **$\Theta(g)$** (ajustada): $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \iff f \in \mathcal{O}(g) \land f \in \Omega(g)$

:::asymptoticviz
:::

Permet determinar la relació asimptòtica entre dues funcions positives $f(n)$ i $g(n)$ calculant el límit del seu quocient quan $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

| Valor de $L$ | Relació | Conclusió |
| :--- | :--- | :--- |
| **$L = 0$** | $f < g$ | $f \in \mathcal{O}(g)$, $f \notin \Omega(g)$, $f \notin \Theta(g)$ |
| **$0 < L < \infty$** | $f \approx g$ | $f \in \Theta(g)$ (i per tant $f \in \mathcal{O}(g)$ i $f \in \Omega(g)$) |
| **$L = \infty$** | $f > g$ | $f \in \Omega(g)$, $f \notin \mathcal{O}(g)$, $f \notin \Theta(g)$ |
| **No existeix** | Oscil·la | Aplicar directament la definició amb $c$ i $n_0$. |

### Formulari de simplificació per a límits i comparacions

:::growthviz
:::

### Propietats de logaritmes i neperians ($\log_b, \ln$)
| Propietat | Formulació matemàtica | Exemple |
| :--- | :--- | :--- |
| **Producte a suma** | $\log_b(x \cdot y) = \log_b x + \log_b y$ | $\log(2n) = \log 2 + \log n \implies \Theta(\log n)$|
| **Quocient a resta** | $\log_b(x / y) = \log_b x - \log_b y$ | $\log(n / 2) = \log n - \log 2 \implies \Theta(\log n)$ |
| **Potència a producte** | $\log_b(x^k) = k \cdot \log_b x$ | $\log(n^3) = 3 \log n \implies \Theta(\log n)$. <br>$\log(n^2) = 2\log n \neq (\log n)^2$ |
| **Neperià ($\ln$) i $e$** | $\ln x = \log_e x \quad (e \approx 2.718)$ | $\ln(e^x) = x, \quad e^{\ln x} = x$ |
| **Canvi de base** | $\log_b x = \frac{\log_a x}{\log_a b} = \frac{\ln x}{\ln b}$ | $\log_2 n = \frac{\ln n}{\ln 2} \implies \Theta(\log_a n) = \Theta(\log_b n)$ |
| **Logaritmes niats** | $\log(\log(n^k)) = \log(k \log n) = \log k + \log(\log n)$ | $\log(\log(n^2)) = \log 2 + \log(\log n) \implies \Theta(\log(\log n))$ |
| **Stirling (Factorial)** | $\log(n!) = \sum_{i=1}^n \log i = \Theta(n \log n)$ | Útil per a cotes inferiors d'ordenació i límits amb $n!$ |

> **Compte amb la base a l'exponent:** La base del logaritme **sí que canvia l'ordre** si és a l'exponent:  
> $2^{\log_2 n} = n$, però $2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631} \implies 2^{\log_2 n} \gg 2^{\log_3 n}$.

### Propietats de Potències, Exponencials ($a^n, e^n$) i arrels
| Propietat | Formulació | Exemple |
| :--- | :--- | :--- |
| **Suma a l'exponent** | $a^{x + y} = a^x \cdot a^y$ | $2^{n + 3} = 2^3 \cdot 2^n = 8 \cdot 2^n \implies \mathbf{\Theta(2^n)}$  |
| **Producte a l'exponent** | $a^{k \cdot n} = (a^k)^n$ | $2^{2n} = (2^2)^n = 4^n \implies \mathbf{4^n \gg 2^n}$ |
| **Resta d'exponents (quocient)** | $\frac{a^n}{b^n} = \left(\frac{a}{b}\right)^n$ | $\frac{2^n}{3^n} = (2/3)^n \xrightarrow{n\to\infty} 0 \quad (b > a \implies a^n \ll b^n)$ |
| **Arrels com a potències** | $\sqrt[k]{n^p} = n^{p/k}$ | $\sqrt{n} = n^{1/2}, \quad \sqrt[3]{n^2} = n^{2/3}, \quad \sqrt{n^3 + 1} \in \Theta(n^{3/2})$ |
| **Passar a base $e$** | $a^x = e^{x \ln a}$ | $2^n = e^{n \ln 2}, \quad n^n = e^{n \ln n}$ |
| **Identitat d'intercanvi clau** | $\mathbf{a^{\log_b n} = n^{\log_b a}}$ | $4^{\log_2 n} = n^{\log_2 4} = n^2 \quad \vert \quad 3^{\log_2 n} = n^{\log_2 3} \approx n^{1.585}$ |

### Operacions elementals i pas de paràmetres

| Concepte / Operació | Cost | Justificació / Regla |
| :--- | :---: | :--- |
| **Operacions primitives i I/O simple** | $\Theta(1)$ | Assignacions primitives, operadors aritmètics/lògics/relacionals i `cin`/`cout` simple. |
| **Accés indexat `v[i]`** | $\Theta(1)$ | Aritmètica de punters sobre memòria contigua ($\text{adreça} = \text{inici} + i \cdot \text{mida}$). |
| **Pas per referència (`&`, `const &`)** | $\Theta(1)$ | Es transmet l'adreça de memòria (punter), sense duplicar dades. |
| **Pas per valor (`vector<T>` de mida $n$)** | $\Theta(n)$ | Clona els $n$ elements reservant memòria a la *heap*. |


**Ordenació per selecció (Selection Sort)**
:::selectionsortviz
:::

**Ordenació per inserció (Insertion Sort)**
:::insertionsortviz
:::

---

### Teorema mestre de recurrències subtractives
Aplica a recurrències on cada crida redueix la mida de l'entrada en una quantitat constant $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
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

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad C(n) \in \begin{cases} 
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

## 2. Dividir i vèncer

El cost total d'un algorisme de dividir i vèncer prové exclusivament de tres fonts:

$$
T(n) = \underbrace{T_{\text{divisio}}(n)}_{\text{partir}} + \underbrace{a \cdot T(n/b)}_{\text{crides recursives}} + \underbrace{T_{\text{combinar}}(n)}_{\text{fusió/acoblament}}
$$

On la feina no recursiva $g(n) = T_{\text{divisio}}(n) + T_{\text{combinar}}(n)$ pertany típicament a $\Theta(n^k)$ per a $k \ge 0$, podent resoldre's mitjançant el **Teorema Mestre de recurrències divisores**.

:::dncviz
:::

| Algorisme | Problema computacional | Equació de recurrència $T(n)$ | Complexitat temporal |
| :--- | :--- | :--- | :---: |
| **Cerca binària** | Cerca en vector ordenat | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **Exponenciació ràpida** | Càlcul de $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | $\Theta(\log n)$ |
| **MergeSort** | Ordenació estable | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (cas millor/mitjà)** | Ordenació *in-place* | $T(n) = 2T(n/2) + \Theta(n)$ | $\Theta(n \log n)$ |
| **QuickSort (cas pitjor)** | Ordenació *in-place* | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | Producte de dos enters de $n$ bits | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |
| **Strassen** | Producte de matrius $n \times n$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |
| **Torres de Hanoi** | Trasllat de $n$ discs | $T(n) = 2T(n-1) + \Theta(1)$ | $\mathbf{\Theta(2^n)}$ (exacte: $2^n - 1$) |
| **QuickSelect (cas mitjà)** | Selecció del $k$-èssim element | $T(n) = T(n/2) + \Theta(n)$ | $\Theta(n)$ |
| **QuickSelect (cas pitjor)** | Selecció del $k$-èssim element | $T(n) = T(n-1) + \Theta(n)$ | $\Theta(n^2)$ |
| **Mediana de Medianes (BFPRT)** | Selecció del $k$-èssim (cas pitjor) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | $\mathbf{\Theta(n)}$ |

### Cerca binària $\Theta(\log n)$
:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

<!-- 
El paràmetre de recursió és $n = j - i + 1$. A cada nivell es realitza només **una** crida recursiva ($a = 1$) sobre un subvector de mida meitat ($b = 2$), i el treball no recursiu (càlcul del mig i comparacions) és constant ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

Pel Teorema Mestre divisor: $\alpha = \log_b a = \log_2 1 = 0$. Com que $\alpha = k = 0$, tenim:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$ -->

### MergeSort $\Theta(n \log n)$

:::mergerecviz
:::

:::mergeviz
:::

:::oopviz{simulation="mergesort"}
:::

---

### MergeSort hibrid amb talla

:::hybridmergeviz
:::

```cpp
const int talla_critica = 50;
if (d - e < talla_critica) ordena_insercio(T, e, d);
else {
    int m = (e + d) / 2;
    mergesort(T, e, m);
    mergesort(T, m + 1, d);
    merge(T, e, m, d);
}
```

### MergeSort iteratiu amb cua

:::mergequeueviz
:::

```text
function mergesort_queue(a[1...n]):
    Q = cua buida
    per a cada element x de a:
        encua(Q, [x])
    mentre mida(Q) > 1:
        encua(Q, merge(desencua(Q), desencua(Q)))
    retorna desencua(Q)
```

### MergeSort sobre vector 

:::mergebottomupviz
:::

```cpp
template <typename elem>
void mergesort_bottom_up(vector<elem>& T) {
    int n = T.size();
    for (int m = 1; m < n; m *= 2) {
        for (int i = 0; i < n - m; i += 2 * m) {
            merge(T, i, i + m - 1, min(i + 2 * m - 1, n - 1));
        }
    }
}
```

---

### Ordenació ràpida $\Theta(n \log n)$ amb pitjor $\Theta(n^2)$

:::quicksortviz
:::

### Partició de Hoare 
:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

### Estratègies d'elecció del pivot

Codi per a l'estratègia de la mediana de tres:
```cpp
int centre = (e + d) / 2;
if (T[e] < T[centre]) swap(T[centre], T[e]);
if (T[d] < T[centre]) swap(T[centre], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// La mediana queda situada a T[e]
```

---

### Exponenciació ràpida $ \mathbf{T(n) \in \Theta(\log n)} $

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Algorisme de Karatsuba $\Theta(n^{1.585})$

:::karatsubaviz
:::

### Algorisme de Strassen $\Theta(n^{2.807})$

:::strassenmatmultviz
:::

### Les Torres de Hanoi

:::hanoiviz
:::

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Moure n-1 discs d'origen (a) a auxiliar (b) usant destí (c)
        cout << a << " -> " << c << "\n"; // Moviment elemental del disc més gran
        hanoi(n - 1, b, a, c); // Moure n-1 discs d'auxiliar (b) a destí (c) usant origen (a)
    }
}
```

### La Mediana de Medianes 

:::medianviz
:::

:::bfprtviz
:::

## 3. Diccionaris

Un diccionari emmagatzema parelles **(clau, valor)** ($k \in K$, $i \in I$) i permet gestionar-les eficientment:

:::dictviz
:::


### Taules de dispersió (*Hash Tables*)

Les **taules de dispersió** assoleixen cerca, inserció i esborrat en **temps constant esperat $\Theta(1)$**, a canvi d'un cas pitjor $\Theta(n)$ (quan tot col·lisiona).

**La funció de dispersió (*Hash function*)**

$$
\text{posició} = h(\text{clau}) \quad (\text{entre } 0 \text{ i } m-1)
$$

L'element es guarda a la casella `T[h(clau)]`.

:::hashviz
:::

**Col·lisions**

Com que tenim infinites claus possibles però la taula té un nombre limitat de caselles, és inevitable que tard o d'hora **dues claus diferents acabin donant el mateix índex** ($h(k_1) = h(k_2)$).

:::collisionviz
:::

Per solucionar col·lisions, cada casella $T[j]$ és una **llista enllaçada** de tots els elements amb $h(k) = j$.

:::chainingviz
:::

---

### Arbres Binaris de Cerca (ABC / BST)

Un **ABC** implementa el diccionari aprofitant un **ordre total** sobre les claus.

:::abcviz
:::

:::oopviz{simulation="diccionari_abc"}
:::

**Arbres AVL:**

Un **arbre AVL** és un ABC on, **per a cada node**, la diferència d'alçades entre els seus dos subarbres és com a màxim 1:

$$
|\text{alçada}(\text{fesq}) - \text{alçada}(\text{fdre})| \le 1
$$

:::oopviz{simulation="diccionari_avl"}
:::

Quan una inserció o un esborrat provoca un desequilibri ($\text{diferència} = \pm 2$), s'aplica una **rotació local en temps constant $\Theta(1)$** per restaurar l'equilibri sense trencar l'ordre de l'ABC:

:::avlrotviz
:::

**Exemple inserció (Parcial primavera 2021 - Exercici 1(d)):** Escriviu l'arbre AVL resultant d'afegir l'element amb clau **11** a l'arbre AVL següent:

:::avlinsertviz
:::

**Exemple eliminació:** Escriviu l'arbre AVL resultant d'eliminar l'element amb clau **15** de l'arbre AVL següent:

:::avldeleteviz
:::