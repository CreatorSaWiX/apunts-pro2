---
title: "Final EDA"
description: "Guia completa 100% enfocada a l'examen final d'EDA: Temes 1–7, patrons reals d'examen, demostracions model, codi C++ i lògica P vs NP."
readTime: "35 min"
order: 99
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

### Propietats de potències, exponencials ($a^n, e^n$) i arrels
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

### Patrons de Problema 1 al Final

| Patró al codi / pregunta | Com s'analitza al moment | Cost / Solució | Exàmens reals |
| :--- | :--- | :---: | :--- |
| **Suma triangular (`s += i; ++i;` fins `s > n`)** | Després de $k$ voltes, $s = \frac{k(k+1)}{2}$ (o $s = k(k+1)$ amb `2*u`). | **$\Theta(\sqrt{n})$** | Final 2024 T, Final 2026 P |
| **Doblement acumulat (`x *= 2; y *= x;` fins `y > n`)** | Després de $k$ voltes, $y = 2^{1+2+\dots+k} = 2^{k(k+1)/2} > n \implies k^2 \approx \log n$. | **$\Theta(\sqrt{\log n})$** | 10/06/2024 P1(c) |
| **Recursió sobre bits (`f(x/2)`)** | Si $x$ té $n = \lfloor\log_2 x\rfloor+1$ bits, `x/2` en té $n-1$: $C(n) = C(n-1)+\Theta(1)$. | **$\Theta(n)$** (en bits) | Final 2022 T (gen. 2023) |
| **Subcadenes (`s.substr(i, k)`)** | `substr` costa $\Theta(k)$, no $\Theta(1)$! Bucle doble $(i,j)$ suma $\sum_{i=0}^{n-1} (n-i)^2$. | **$\Theta(n^3)$** | Final 2021 T (gen. 2022) |
| **Comparar $4^n$, $2^{2n}$ i $2^{n^2}$** | $2^{2n} = (2^2)^n = 4^n$; $\lim \frac{2^{n^2}}{2^{2n}} = \lim 2^{n(n-2)} = \infty$. | **$4^n = 2^{2n} \ll 2^{n^2}$** | Final 2026 P P1(c) |

* **Recurrències amb paràmetre ($a, b, k$):** compara sempre $\alpha = \log_b a$ amb $k$ sense perdre els logs:
  * Ex. Final 2023 T (08/01/2024): $T(n) = aT(n/4) + \Theta(n^2) \implies \Theta(n^2)$ si $a < 16$; $\Theta(n^2\log n)$ si $a = 16$; $\Theta(n^{\log_4 a})$ si $a > 16$.
  * Ex. Final 2026 P (09/06/2026): per què $T(n) = 9T(n/b) + \Theta(n)$ iguali $S(n) = S(n-2) + \Theta(n) \in \Theta(n^2)$, cal $\alpha > k=1$ (evitar $\log n$) amb $\log_b 9 = 2 \implies \mathbf{b = 3}$.
* **Rànquing ràpid de 10 funcions (Final 2025 T / 14/01/2026 P1(c)):**
  $$2^{\log_2 n} = n \;\ll\; n\log n = n\log(n^2) \;\ll\; n^2\log n \;\ll\; 2^{n/2} \;\ll\; 2^{n-10} = 2^n \;\ll\; 3^n \;\ll\; n! \;\ll\; n^n$$
* **Fites estructurals obligatòries (Final 2025 T P1(a)):** graf connex $\implies \Omega(n)$ arestes; ABC de $n$ nodes $\implies$ alçada $\Omega(\log n)$ (i $\mathcal{O}(n)$); *min-heap* de $n$ nodes $\implies \Theta(n)$ fulles.

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

### Les torres de Hanoi

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

### La mediana de medianes 

:::medianviz
:::

:::bfprtviz
:::

### Trucs de D&C i Selecció al Final
* **Crida degenerada en un dels extrems (Final 2023 P / 12/06/2023 P1(a)):** `f(v, e, e) + f(v, e, (e+d)/2)` només fa **1** crida recursiva real de mida $n/2$ (l'altra és $\Theta(1)$) $\implies T(n) = T(n/2) + \Theta(1) \implies \Theta(\log n)$. Si parteix en dues meitats reals $\implies 2T(n/2)+\Theta(1) \implies \Theta(n)$.
* **Reducció d'un vector a meitat + cerca lineal (`majority_pairs`, Final 2020 T P1(b) / 2022 T P1(b)):** si cada nivell redueix el vector a mida $\le n/2$ i després recorre el vector actual ($n$), la recurrència és $T(n) = T(n/2) + \Theta(n) \implies \mathbf{\Theta(n)}$ (perquè $\alpha = 0 < k = 1$).
* **Trobar els $m = n/2$ elements menors en $\Theta(n)$ garantit (Final 2025 P / 04/06/2025 P2):** usa **Mediana de Medianes (BFPRT)** per trobar la mediana $x$ en $\Theta(n)$ pitjor cas, i filtra en una passada els elements $\le x$ en $\Theta(n)$ (supera `sort` $\Theta(n\log n)$ i selecció repetida $\Omega(n^2)$).

## 3. Diccionaris

Un diccionari emmagatzema parelles **(clau, valor)** ($k \in K$, $i \in I$) i permet gestionar-les eficientment:

:::dictviz
:::


### Taules de dispersió (*hash tables*)

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

### Arbres binaris de cerca (ABC / BST)

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

### Resum ràpid de Hash i AVL per al Final
* **`map` (AVL) vs `unordered_map` (Hash) vs vector comptador (Finals 2020 T P1(a), 2023 T P2):**
  * $n$ consultes/insercions en `map`: $\sum_{i=1}^{n-1}\log i = \Theta(n \log n)$ en cas pitjor.
  * En `unordered_map` ($\alpha = n/m$): cost mitjà $\Theta(1+\alpha)$, per tant $\Theta(n)$ en cas mitjà si $m = \Theta(n)$ (pitjor cas $\Theta(n^2)$).
  * Si les claus són naturals fitats ($< 100$): vector de freqüències dóna **$\Theta(n)$ garantit en cas pitjor**.
* **Rotacions AVL en un cop d'ull:** **LL** $\to$ simple dreta; **RR** $\to$ simple esquerra; **LR** $\to$ esquerra al fill + dreta a l'arrel; **RL** $\to$ dreta al fill + esquerra a l'arrel.

### Patrons d'ABC / BST al Final (Problema 2)

| Tècnica sobre ABC | Idea / Invariant | Complexitat | Examen |
| :--- | :--- | :---: | :--- |
| **Inordre / Inordre invers** | `esq-arrel-dre` dóna creixent; `dre-arrel-esq` dóna decreixent. | $\Theta(n)$ | Final 2023 P P2, 2026 P P2(a) |
| **Poda d'intervals (`escriu_menors`)** | Si `root->data >= x`, podar tot el subarbre dret! | $\mathcal{O}(h + k)$ | 10/06/2024 P2(a) |
| **Successor (`upper_bound`)** | Si `root->data > x`, buscar candidat a `left`; si és `nullptr`, el resultat és `root`. | $\mathcal{O}(h)$ | Final 2024 T P2(c) |
| **ABC $\to$ Max-Heap** | Omplir un vector (pos. `1..n`) fent **inordre invers** (`dre, arrel, esq`); qualsevol vector decreixent és *max-heap*. | $\Theta(n)$ | Final 2023 P P2 |
| **Vector ordenat $\to$ ABC equilibrat** | Posar `v[m]` amb `m = (e+d)/2` d'arrel i construir `[e..m-1]` i `[m+1..d]` recursivament. | $\Theta(n)$ | Final 2026 P P2(b) |
| **Fusionar dos ABCs** | Inordre d'A i B $\to$ `merge` lineal (treure repetits) $\to$ reconstruir ABC equilibrat. | $\Theta(n)$ | Final 2026 P P2(c) |

**Recorregut acotat (10/06/2024 P2a) i Successor recursiu (07/01/2025 P2c):**

```cpp
void escriu_menors(Node* root, int x) {
    if (root == nullptr) return;
    if (root->data >= x) escriu_menors(root->left, x); // Poda dreta
    else {
        escriu_menors(root->left, x);
        cout << root->data << '\n';
        escriu_menors(root->right, x);
    }
}

Node* upper_bound_abc(Node* root, int x) {
    if (root == nullptr) return nullptr;
    if (root->data > x) {
        Node* tmp = upper_bound_abc(root->left, x);
        return (tmp == nullptr) ? root : tmp;
    }
    return upper_bound_abc(root->right, x);
}
```

> **ABC i Min-Heap alhora? (Final 2022 P / 02/06/2022 P1(b)):** Amb $n \ge 3$ nodes és **impossible**: si l'arrel $a$ té tots dos fills, $fe < a < fd$ contradiu $a \le fe$; si li falta algun fill al nivell $1$, hi hauria un node a nivell $2$ amb el nivell $1$ incomplet (no seria arbre complet).

---

## 4. Cues amb prioritat i munts (*Heaps*)

### Fórmules d'indexació (clau per no fallar al codi)

| Variant | Rang al vector | Fills de $i$ | Pare de $i$ | Condició de fulla |
| :--- | :---: | :---: | :---: | :---: |
| **Binari indexat a 1** | `1 .. n` | `2*i`, `2*i + 1` | `i / 2` | `2*i > n` |
| **Binari indexat a 0** | `0 .. n-1` | `2*i + 1`, `2*i + 2` | `(i - 1) / 2` | `2*i + 1 >= n` |
| **Ternari indexat a 1** | `1 .. n` | `3*i - 1`, `3*i`, `3*i + 1` | `(i + 1) / 3` | `3*i - 1 > n` |
| **Ternari indexat a 0** | `0 .. n-1` | `3*i + 1`, `3*i + 2`, `3*i + 3` | `(i - 1) / 3` | `3*i + 1 >= n` |

### Demostracions model d'examen

1. **Fulles d'un heap ($\lceil n/2 \rceil$ fulles $\in \Theta(n)$ — Finals 07/01/2025 P2(b), 14/01/2026 P1(b)):**
   En un *heap* indexat a $1$ ($1 \dots n$), un node $i$ és fulla $\iff$ no té fill esquerre $\iff 2i > n \iff i > n/2$. Per a $n$ parell, són exactament les posicions $\frac{n}{2} + 1, \dots, n$, és a dir, exactament **$n/2$ fulles** (en general $\lceil n/2 \rceil \in \Theta(n)$).
2. **Alçada d'un munt ternari ($h \in \mathcal{O}(\log n)$ — Final 14/01/2026 P2(a)-(b)):**
   * Suma geomètrica (per inducció sobre $h$): $1 + 3 + \dots + 3^h = \frac{3^{h+1}-1}{2}$.
   * Mínim nombre de nodes amb alçada $h$: tots els primers $h$ nivells plens més $1$ node al nivell $h+1$:
     $$n \ge \left(1 + 3 + \dots + 3^{h-1}\right) + 1 = \frac{3^h - 1}{2} + 1 = \frac{3^h + 1}{2} \implies h \le \log_3(2n - 1) \in \mathcal{O}(\log n)$$

**`sink()` en Min-Heap ternari indexat a 1 (Final 14/01/2026 P2d):**

```cpp
// v[0] és sentinella; elements vàlids a 1..n amb n = (int)v.size() - 1
void THeap::sink(int i) {
    if (3*i - 1 < (int)v.size()) {
        int pos_min = 3*i - 1;
        if (3*i < (int)v.size() and v[3*i] < v[pos_min]) pos_min = 3*i;
        if (3*i + 1 < (int)v.size() and v[3*i + 1] < v[pos_min]) pos_min = 3*i + 1;
        if (v[pos_min] < v[i]) {
            swap(v[i], v[pos_min]);
            sink(pos_min);
        }
    }
}
```

### Comprovacions i reconstruccions sobre vectors *Heap*
* **Detectar si un vector és *heap* (Final 07/01/2025 P2(a)):** comprovar tots els pares $i$ amb els seus fills (compte amb l'índex inicial `0` vs `1`!).
* **Quin element podia haver estat l'últim a inserir-se? (Final 08/01/2024 P1(b)):** una inserció entra a l'última posició i fa **`surar`** cap a l'arrel. Si provem que $x$ acabi a un node $u$, tots els nodes del camí des de l'última posició fins a $u$ haurien d'haver baixat un nivell, i cal comprovar si violarien la propietat de *heap* amb l'altre fill! (Ex.: al *max-heap* amb arrel `38` i fills `32` (esq.) i `33` (dre.), `38` no pot ser l'últim inserit perquè implicaria que `32` era l'anterior arrel, impossible sent $32 < 33$).
* **Reconstruir elements perduts (10/06/2024 P2(b)):** imposar $v[\text{pare}] \le v[i] \le v[\text{fill}]$ per a cada forat; si hi ha fulles que comparteixen cotes superiors al seu pare, permeten múltiples permutacions vàlides.

### Operacions, construcció i `decrease_key`
* **Floyd *bottom-up*:** `enfonsar` de $\lfloor n/2 \rfloor$ fins a $1$ costa **$\Theta(n)$** (enfront de $\Theta(n\log n)$ inserint un a un amb `surar`).
* **Extracció dels $m$ menors (Final 2025 P / 04/06/2025 P2):** Floyd + $m$ `pop` costa $\Theta(n + m\log n)$; mantenir un *max-heap* de mida $m$ costa $\Theta(n\log m)$; `QuickSelect` (BFPRT) $\Theta(n)$.
* **Cua amb prioritat amb `decrease_key` (Final 09/06/2020 P3A):** si `find(x)` és lineal, $m$ crides costen $\mathcal{O}(m\cdot n)$; afegint un `unordered_map<Elem, int> pos` actualitzat a cada `swap` de `surar`/`enfonsar`, `find` passa a $\mathcal{O}(1)$ i `decrease_key` a $\mathcal{O}(\log n)$.

---

## 5. Grafs

### Resum operatiu d'algorismes i costos

| Algorisme | Tipus de graf | Estructura clau | Cost (llistes adj.) | Detall crític d'examen |
| :--- | :--- | :--- | :---: | :--- |
| **DFS** | Dirigit / No dirigit | Pila / Recursió | $\Theta(n + m)$ | En no dirigits: cicle si `vis[v]` i `v != pare`. En dirigits: cal estat *en procés*. |
| **BFS** | Dirigit / No dirigit | Cua (`queue`) | $\Theta(n + m)$ | Camí mínim en **passos** (no ponderat). Marcar **en encuar**! |
| **Kahn (Toposort)** | DAG | Cua / Min-Heap | $\Theta(n + m)$ | `priority_queue` mínima (`greater<int>`) dóna l'ordre **lexicogràfic**. |
| **Dijkstra** | Pesos $\ge 0$ | Min-Heap + `S[]` | $\mathcal{O}((n + m)\log n)$ | Sense heap en grafs densos ($m \approx n^2$): $\Theta(n^2)$. Falla amb pesos $< 0$. |
| **Prim (MST)** | No dirigit connex | Min-Heap / `vis[]` | $\mathcal{O}(m\log n)$ | Versió naïf cercant l'aresta mínima que surt de `vis`: $\Theta(n(n+m))$. |
| **Kruskal (MST)** | No dirigit connex | Llista d'arestes sort + DSU | $\mathcal{O}(m\log n)$ | Millor si ja tenim les arestes o graf dispers. |

### 5 patrons clau de Grafs al Final

1. **Kahn naïf vs eficient (Final 14/01/2026 P3(a)-(c)):** tornar a comptar graus d'entrada a cada pas per triar un vèrtex de grau $0$ fa $n$ crides de cost $\Theta(n + m) \implies \mathbf{\Theta(n(n + m))}$. Si només funciona per a grafs dirigits acíclics (**DAG**), en qualsevol cicle retornarà menys de $n$ vèrtexs.
2. **Dijkstra comptant el nombre de camins mínims (`ways` — Final 07/01/2025 P3):**
   ```cpp
   if (d[v] > d[u] + c) {
       d[v] = d[u] + c;
       p[v] = p[u];          // Millor distància: reiniciar camins
       Q.push({d[v], v});
   }
   else if (d[v] == d[u] + c) {
       p[v] += p[u];         // Empat exacte: acumular camins
   }
   ```
3. **L'arbre de camins mínims de Dijkstra NO és un MST (Final 02/06/2022 P2(c)):**
   Triangle $\{0, 1, 2\}$ amb pesos $w(0,1) = 5$, $w(0,2) = 5$, $w(1,2) = 3$: des de `0`, Dijkstra escull $\{0,1\}$ i $\{0,2\}$ (cost total $10$), mentre que el MST és $\{0,1\}$ i $\{1,2\}$ (cost total $8$).
4. **Prim naïf pas a pas (Final 14/01/2026 P3(d)):** trobar l'aresta de pes mínim $(u, v)$ amb `vis[u] == true` i `vis[v] == false`:
   ```cpp
   // G[u] emmagatzema parells {pes, veí}
   pair<int,int> aux(const vector<vector<pair<int,int>>>& G, const vector<bool>& vis) {
       int cost_min = numeric_limits<int>::max(), vertex_min = -1;
       for (int u = 0; u < (int)G.size(); ++u)
           if (vis[u])
               for (auto [w, v] : G[u])
                   if (not vis[v] and w < cost_min) { cost_min = w; vertex_min = v; }
       return {cost_min, vertex_min};
   }
   ```
5. **Graf implícit + Pila monòtona + BFS (Final 08/01/2024 P3 i 04/06/2025 P3):**
   * En espais d'estats (ex. dues gerres $0 \dots \text{cap}_A \times 0 \dots \text{cap}_B$), inicialitzar `dist` amb `-1`/`INF`, marcar en **encuar** i aturar quan s'arriba a l'objectiu.
   * Per trobar el *primer element estrictament major a la dreta* en $\Theta(n)$ (per generar transicions implícites sense buscar linealment), usar una **pila monòtona decreixent**:
   ```cpp
   vector<int> right_greater(const vector<int>& v) {
       int n = v.size();
       vector<int> sol(n, -1);
       stack<int> S;
       for (int i = 0; i < n; ++i) {
           while (not S.empty() and v[S.top()] < v[i]) {
               sol[S.top()] = i;
               S.pop();
           }
           S.push(i);
       }
       return sol;
   }
   ```

---

## 6. Cerca exhaustiva, Backtracking i Branch & Bound

### Esquema i tipus de retorn
* **Totes les solucions:** `void rec(...)` (escriu o guarda al cas base).
* **Una solució:** `bool rec(...)` amb `if (rec(...)) return true;` per tallar la cerca al primer èxit.
* **Comptar solucions:** `int rec(...)` sumant els subproblemes (`total += rec(...)`).
* **Optimització (Branch & Bound):** `void rec(..., cost_actual)` actualitzant `best_cost` i podant si la fita optimista no pot millorar `best_cost`.

### Anàlisi de fites de crides al cas base (pregunta fixa de final)

| Estructura del codi | Crides al cas base (millor) | Crides al cas base (pitjor) | Cost total | Examen |
| :--- | :---: | :---: | :---: | :--- |
| **`b1 = SAT(...); b2 = SAT(...); return b1 \|\| b2;`** (sense curtcircuit) | **$2^n$** | **$2^n$** | $\Theta(2^n \cdot \text{eval})$ | Final 2022 T P3(b) |
| **Permutacions amb `if (find_ranking(...)) return true;`** | **$1$** (cost $\Omega(n + m)$) | **$n!$** | $\Omega(m \cdot n!)$ (pitjor) | Finals 10/01/2022 P2(b), 09/06/2026 P3(b) |

> **Com justificar el cost en pitjor cas:** Multiplicar el nombre de configuracions completes que arriben al cas base (quan no hi ha solució o cal explorar-les totes, ex. $n!$ permutacions) pel cost de la funció de comprovació (ex. $\Theta(m)$ de `good_ranking`) $\implies \mathbf{\Theta(m \cdot n!)}$.

### Les 4 podes clau i la trampa de la reducció a DAG

1. **Suma objectiu amb suma restant (*Herència*, Final 08/01/2021 P2):** podar si `partial_sum > money` (excés) **o** si `partial_sum + suma_restant[idx] < money` (no arribaríem ni agafant tot el que queda).
2. **Elements pendents (*Tutis*, Final 02/06/2022 P3):** si queden `n - sol.size()` caselles i ens falten `pendents` lletres obligatòries: `if ((int)(n - sol.size()) < pendents) return;`.
3. **Fita optimista en B&B (Motxilla / TSP, Final 09/06/2020 P2B):**
   * Maximitzar (Motxilla): podar si `svp + svr <= millor_valor` (`svr` = suma de valors dels objectes restants).
   * Minimitzar (TSP): podar si `cost_actual + M[u][v] >= best_cost` (assumint pesos positius).
4. **Permutació amb restriccions d'ordre $\neq$ Backtracking! (Finals 10/01/2022 P2(c), 09/06/2026 P3(c)):** si cada restricció només exigeix que $j_1$ aparegui abans que $j_2$ (ex. $(j_1, j_2, j_3) \implies j_1 \to j_2 \to j_3$), **no cal $n!$**: es resol amb una **Ordenació Topològica en $\mathcal{O}(n + m)$**.

---

## 7. P vs NP, Reduccions i Test (Problema 4 del Final)

### Plantilla estricta per a les demostracions de Problema 4

1. **Provar $X \in \text{NP}$ (3 passos obligatoris — ex. `3-COL-EQUIL`, Final 08/01/2024 P4(b)):**
   * **Testimoni:** definir què és $y$ (ex. una funció/vector de colors $c: V \to \{1,2,3\}$).
   * **Mida polinòmica:** justificar que $|y| \le p(|x|)$ (ex. un graf amb $n$ vèrtexs i $m$ arestes ocupa $\Theta(n+m)$, i $c$ necessita $\le 2n$ bits).
   * **Verificador polinòmic:** descriure $V(x, y)$ i sumar el cost de cada comprovació (ex. recórrer les $m$ arestes en $\Theta(n+m)$ per verificar $c(u)\neq c(v)$ i comptar $|C_i| = n$ en $\Theta(n)$) + concloure $\iff$.

2. **Provar una reducció polinòmica $A \le_p B$ (3 passos obligatoris — ex. `3-COL` $\le_p$ `3-COL-EQUIL`, Final 08/01/2024 P4(c)):**
   * **Construcció i cost polinòmic:** definir $\mathcal{F}(x)$ (ex. 3 còpies disjuntes de $G$: $3n$ vèrtexs i $3m$ arestes) i justificar que es construeix en temps i mida polinòmics.
   * **($\implies$) $x \in A \implies \mathcal{F}(x) \in B$:** donar explícitament la solució construïda per a $\mathcal{F}(x)$ (ex. usar permutacions cícliques $(1,2,3), (2,3,1), (3,1,2)$ a les 3 còpies perquè cada color surti exactament $n$ cops).
   * **($\Longleftarrow$) $\mathcal{F}(x) \in B \implies x \in A$:** explicar com una solució de $\mathcal{F}(x)$ dóna una solució vàlida per a $x$ (ex. la primera còpia dins $G'$ ja és una 3-coloració vàlida de $G$).

### Errors clàssics de reduccions (preguntes de diagnòstic)
* **`k-COL` $\le_p$ `CNF-SAT` sense clàusules d'existència (Final 16/01/2023 P4(a)-(b)):** si la fórmula només té $(\neg x_{u,c} \lor \neg x_{v,c})$ per cada aresta $\{u,v\}$, posar totes les variables a `false` sempre la satisfà (acceptaria un $K_3$ en `2-COL`). Cal afegir $(x_{u,1} \lor \dots \lor x_{u,k})$ per a tot $u \in V$.
* **`SUBSET-SUM` $\le_p$ `PARTITION` amb $f(S, \text{obj}) = S \cup \{\text{obj}\}$ (Final 04/06/2025 P4(b)):** **és falsa**! Contraexemple: $S = \{1, 3, 3\}$, $\text{obj} = 3$ és positiva de `SUBSET-SUM`, però $f(S, 3) = \{1, 3, 3, 3\}$ suma $10$ i no admet partició $5 + 5$. *(La reducció correcta afegeix $\text{sum}(S) - 2\cdot\text{obj}$, ajustant la meitat total a $\text{sum}(S)-\text{obj}$)*.

### Casos especials polinòmics i problemes NP-C freqüents als finals
* **NP-C habituals als finals (a banda de `SAT`, `3-SAT`, `CLICA`, `SI`, `RV`, `k-COLOR`):** `SUBSET-SUM`, `PARTITION`, `HAMILTONIAN-CYCLE`, `VIATJANT` (`TSP`), `3-COL-EQUIL`, `5-COL`.
* **Variants que SÍ són a $\text{P}$:**
  * Qualsevol problema reducible a `2-COL` (bipartit amb BFS/DFS, ex. Final 10/01/2022 P3(b)).
  * `RESTRICTED-3-COL` amb components connexes de mida $\le 10$ (Final 09/06/2026 P4(b)): força bruta en cada component costa $\mathcal{O}(3^{10}) = \Theta(1) \implies \mathcal{O}(n)$ total.
  * `(n-1)-COL` (Final 04/06/2025 P4(c)): pintem tots els vèrtexs diferents excepte dos de no adjacents $\iff$ **$G$ no és complet ($K_n$)**, comprovable en $\mathcal{O}(n^2)$.

### Guia mestra per al Test (C / F / N)

| Afirmació típica d'examen | Veredicte | Raonament ràpid |
| :--- | :---: | :--- |
| "$A \in \text{NP-C}$, $A \le_p B$ i $B \le_p A$ $\implies B \in \text{NP-C}$" | **C** | $B \le_p A \in \text{NP} \implies B \in \text{NP}$; i $A \le_p B \implies B \in \text{NP-difícil}$. |
| "$A \in \text{P}$ i $B \le_p A \implies B \in \text{P}$" | **C** | Tancament de $\text{P}$ per reduccions polinòmiques. |
| "$B \in \text{P}$ i $B \le_p A \implies A \in \text{P}$" | **F** | Reduir d'un problema fàcil cap a $A$ no limita la dificultat de $A$. |
| "$A, B \in \text{P}$ (amb instàncies SÍ/NO) $\implies A \le_p B$" | **C** | Resol $x \in A$ en polinòmic i retorna una instància fixa SÍ o NO de $B$. |
| "$\text{NP} \cap \text{P} \neq \emptyset$" | **C** | $\text{P} \subseteq \text{NP}$ (qualsevol problema de $\text{P}$ és a la intersecció). |
| "Si $X \in \text{NP}$, no es coneix algorisme polinòmic per a $X$" | **F** | Falsa: tots els problemes de $\text{P}$ pertanyen a $\text{NP}$. |
| "Si $A \in \text{NP-C}$ i $A \in \text{P} \implies \text{P} = \text{NP}$" | **C** | Qualsevol $B \in \text{NP}$ compleix $B \le_p A \in \text{P} \implies B \in \text{P}$. |
| "Si trobem $X \in \text{NP} \cap \text{P}$, tot $\text{NP}$ és a $\text{P}$" | **F** | Només val si $X$ és **$\text{NP-complet}$**, no qualsevol problema de $\text{NP}$. |
| "$\exists A \in \text{P},\ B \in \text{NP-difícil}$ amb $B \le_p A$" | **N** | Equivaldria a $\text{P} = \text{NP}$ (problema obert). |
| "**Existeix** reducció polinòmica de `3-COL` a `2-SAT`" | **N** | Equivaldria a $\text{P} = \text{NP}$ (Final 14/01/2026 P4(4)). |
| "**Es coneix** reducció polinòmica de `3-COL` a `2-SAT`" | **F** | Pregunta pel coneixement actual: **no** se'n coneix cap (10/06/2024 P4(2)). |
| "Hi ha algorisme polinòmic per a `HAMILTONIÀ` però no per a `3-COL`" | **F** | Tots dos són $\text{NP-C}$: un té algorisme polinòmic $\iff$ l'altre també (09/06/2026 P4(c)). |

> **Regla d'or als tests C / F / N (0.5 / -0.25 o -0.5):** Distingeix **"Es coneix / No es coneix"** (estat actual del coneixement: sol ser **C** o **F**) d'**"Existeix / Hi ha / Pertany"** quan implica $\text{P} = \text{NP}$ (sol ser **N**). Si dubtes entre dues opcions i resta punt, deixa-la en blanc.
