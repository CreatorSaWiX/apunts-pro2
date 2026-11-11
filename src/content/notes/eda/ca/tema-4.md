---
title: "Tema 4: Cues amb prioritat"
description: "TAD cua amb prioritat, munts binaris i ternaris, representació sobre vector, Heapsort in-place i construcció lineal Θ(n), i el problema de selecció."
readTime: "12 min"
order: 5
draft: false
---

Una **cua amb prioritat** emmagatzema elements amb una prioritat associada i permet extreure'n sempre el valor extrem (mínim o màxim). Admet **elements duplicats** i **no permet cerca per clau arbitrària**.

| Implementació | `afegir` | `treure_min` | `minim` | Memòria aux. | Visualització i comportament |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Vector no ordenat** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ | :pqcompareviz{type="unordered"} |
| **Vector ordenat** | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | :pqcompareviz{type="sorted"} |
| **Arbre AVL / `std::set`** | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(1)$ | $\Theta(n)$ | :pqcompareviz{type="avl"} |
| **Munt binari (*Heap*)** | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(1)}$ | $\mathbf{\Theta(1)}$ | :pqcompareviz{type="heap"} |

---

## 4.1. Preliminars d'arbres: topologia i cotes

* **Arbre binari perfecte:** Tots els nivells estan completament plens.
  $$n = 2^{h+1} - 1 \text{ nodes}$$
* **Arbre binari complet:** Els nivells $0 \dots h-1$ estan plens i l'últim nivell ($h$) té les fulles agrupades **el màxim a l'esquerra possible**.

### Cotes de nodes i alçada logarítmica
En tot arbre binari complet d'alçada $h$:

$$
2^h \le n \le 2^{h+1} - 1 \implies h = \lfloor \log_2 n \rfloor \in \mathbf{\Theta(\log n)}
$$

* **Cota de fulles:** Exactament $\lceil n/2 \rceil$ nodes són fulles (el 50% de l'arbre). Cercar a les fulles requereix escanejar $\Theta(n)$ elements.

:::treetopoviz
:::

---

## 4.2. Munts binaris (*heaps*)

Estructura basada en un arbre binari complet que compleix la **propietat de heap**:
* **Min-Heap:** Per a tot node $i \neq \text{arrel}$, $\text{clau}(\text{pare}(i)) \le \text{clau}(i)$. L'arrel conté el mínim global.

* **Max-Heap:** Per a tot node $i \neq \text{arrel}$, $\text{clau}(\text{pare}(i)) \ge \text{clau}(i)$. L'arrel conté el màxim global.

:::minmaxheapviz{type="min"}
:::

### Representació sobre vector (sense punters)

Els nodes s'allotgen per nivells d'esquerra a dreta.

| Relació | Indexat a 1 (`t[1...n]`, estàndard FIB) | Indexat a 0 (`t[0...n-1]`) |
| :--- | :---: | :---: |
| **Pare de $i$** | $\lfloor i / 2 \rfloor$ | $\lfloor (i - 1) / 2 \rfloor$ |
| **Fill esquerre de $i$** | $2i$ | $2i + 1$ |
| **Fill dret de $i$** | $2i + 1$ | $2i + 2$ |
| **És fulla?** | $2i > n$ | $2i + 1 \ge n$ |

Indexar a 1 simplifica l'aritmètica de bits (`i >> 1`, `i << 1`) i evita sumes auxiliars.

### 1. Inserció (`surar`)
S'afegeix l'element al final del vector (posició $n+1$) i es fa pujar intercanviant-lo amb el seu pare mentre sigui menor:

```cpp
void surar(vector<int>& t, int i) {
    while (i > 1 && t[i] < t[i / 2]) {
        swap(t[i], t[i / 2]);
        i /= 2;
    }
}
```
* **Cost:** $\mathcal{O}(h) = \mathbf{\Theta(\log n)}$.

:::surarviz
:::

### 2. Extracció del mínim (`enfonsar`)
Es guarda l'arrel (`t[1]`), es mou l'últim element (`t[n]`) a l'arrel, es decrementa $n$ i es fa descendir intercanviant-lo **sempre amb el fill menor**:

```cpp
void enfonsar(vector<int>& t, int n, int i) {
    int c = 2 * i; // Fill esquerre
    while (c <= n) {
        if (c + 1 <= n && t[c + 1] < t[c]) ++c; // c és el menor dels dos fills
        if (t[i] <= t[c]) break;                // Invariant restablert
        swap(t[i], t[c]);
        i = c;
        c = 2 * i;
    }
}
```
* **Cost:** $\mathcal{O}(h) = \mathbf{\Theta(\log n)}$.

Si no s'intercanvia amb el fill *menor*, el fill gran passaria a ser pare del petit, violant la propietat de min-heap.

:::enfonsarviz
:::

---

## 4.3. Munts ternaris (*ternary heaps*)

Arbre ternari complet on cada node té com a màxim **3 fills** i compleix la propietat de heap.

### Aritmètica d'índexs sobre vector (indexat a 0)

| Relació per al node $i$ | Expressió matemàtica |
| :--- | :---: |
| **Pare de $i$** | $\lfloor (i - 1) / 3 \rfloor$ |
| **Fills de $i$** | $3i + 1, \quad 3i + 2, \quad 3i + 3$ |

:::ternaryheapviz
:::

### Fórmules de nodes per alçada $h$

* **Nombre màxim de nodes (arbre ternari perfecte d'alçada $h$):**
  $$
  N_{\max}(h) = \sum_{j=0}^h 3^j = \frac{3^{h+1} - 1}{2}
  $$
  *Demostració per inducció:* Per a $h=0$, $\frac{3^1-1}{2} = 1$. Pas inductiu: $N_{\max}(h) = 1 + 3 \cdot N_{\max}(h-1) = 1 + 3\left(\frac{3^h-1}{2}\right) = \frac{2 + 3^{h+1} - 3}{2} = \frac{3^{h+1}-1}{2}$. $\blacksquare$

* **Nombre mínim de nodes d'alçada $h$:**
  $$
  N_{\min}(h) = N_{\max}(h - 1) + 1 = \frac{3^h - 1}{2} + 1
  $$

* **Alçada asimptòtica:** $h \in \mathbf{\Theta(\log_3 n)}$. Té menor alçada que el binari, però fa fins a 3 comparacions per nivell a l'`enfonsar`.

### Implementació d'`enfonsar` per a min-heap ternari

```cpp
void enfonsar_ternari(vector<int>& t, int n, int i) {
    int c = 3 * i + 1; // Primer fill
    while (c < n) {
        int menor = c;
        if (c + 1 < n && t[c + 1] < t[menor]) menor = c + 1;
        if (c + 2 < n && t[c + 2] < t[menor]) menor = c + 2;
        if (t[i] <= t[menor]) break;
        swap(t[i], t[menor]);
        i = menor;
        c = 3 * i + 1;
    }
}
```

---

## 4.4. Algorisme d'ordenació Heapsort

### 1. Construcció del heap: bàsica vs mètode de Floyd

* **Construcció bàsica (Top-Down):** Inserir $n$ elements successius amb `surar`.
  $$T(n) = \sum_{i=1}^n \log i = \log(n!) = \mathbf{\Theta(n \log n)}$$
* **Construcció lineal de Floyd (Bottom-Up / *Heapify*):** Es disposen els elements al vector i s'aplica `enfonsar` des del darrer pare ($i = \lfloor n/2 \rfloor$) fins a l'arrel ($i = 1$).
  $$T(n) = \mathbf{\Theta(n)}$$
  *Justificació:* La majoria de nodes estan als nivells inferiors (on l'alçada per baixar és 0 o 1). Només l'arrel pot baixar $h$ nivells.

:::heapbuildviz
:::

### 2. Heapsort *in-place* (memòria auxiliar $\Theta(1)$)

Per ordenar un vector de menor a major (creixent) sense memòria extra:
1. Es construeix un **Max-Heap** lineal en $\Theta(n)$ sobre el mateix vector.
2. Es repeteix per a $i$ des de $n$ fins a 2:
   - S'intercanvia l'arrel (el màxim actual a `t[1]`) amb `t[i]`.
   - Es redueix la mida del heap actiu a $i - 1$.
   - S'aplica `enfonsar(t, i - 1, 1)`.

```cpp
void heapsort(vector<int>& t) {
    int n = t.size() - 1; // Assumint indexat a 1
    // 1. Heapify en O(n)
    for (int i = n / 2; i >= 1; --i) enfonsar_max(t, n, i);
    // 2. Extraccions successives
    for (int i = n; i >= 2; --i) {
        swap(t[1], t[i]);
        enfonsar_max(t, i - 1, 1);
    }
}
```

:::heapsortviz
:::

| Propietat | Valor |
| :--- | :---: |
| **Complexitat temporal (millor, mitjà, pitjor)** | $\mathbf{\Theta(n \log n)}$ |
| **Memòria auxiliar** | $\mathbf{\Theta(1)}$ (*in-place*) |
| **Estabilitat** | **NO és estable** (els salts de swap desordenen claus idèntiques) |

---

## 4.5. Aplicació (trobar els $m$ menors de $n$ elements)

| Mètode | Cost Temporal | Memòria Auxiliar | Quan aplicar-lo? |
| :--- | :---: | :---: | :--- |
| **MergeSort complet** | $\Theta(n \log n)$ | $\Theta(n)$ | Només si cal ordenar tot el vector sencer. |
| **Min-Heap de mida $n$** | $\mathbf{\Theta(n + m \log n)}$ | $\Theta(1)$ / $\Theta(n)$ | Excel·lent quan $m \ll n$ (construcció lineal + $m$ pops). |
| **Max-Heap de mida $m$** | $\mathbf{\Theta(n \log m)}$ | $\mathbf{\Theta(m)}$ | **Òptim per a Streams / Dades Online:** no requereix carregar els $n$ elements a RAM. |
| **QuickSelect (mediana)** | $\mathbf{\Theta(n)}$ (pitjor cas) | $\Theta(1)$ | Òptim asimptòtic teòric per a vectors en memòria. |

1. **Un vector ordenat creixent és un min-heap?** **SÍ.** Per a tot $i$, $t[i] \le t[2i]$ i $t[i] \le t[2i+1]$.
2. **On pot ser el màxim en un min-heap?** En **qualsevol de les fulles** (índexs $\lfloor n/2 \rfloor + 1 \dots n$). Trobar-lo costa $\Theta(n)$.
3. **Munts ternaris vs binaris:** El ternari té alçada $\approx \log_3 n$ (menys nivells), però a cada pas d'`enfonsar` fa 3 comparacions en comptes de 2. El cost asimptòtic segueix sent $\Theta(\log n)$.
4. **Construcció de Floyd:** Fa `enfonsar` des de $n/2$ cap avall. Fer-ho amb `surar` d'1 a $n$ costaria $\Theta(n \log n)$.

### C++ STL: `std::priority_queue`

```cpp
#include <queue>
#include <vector>

// 1. Max-Heap per defecte
priority_queue<int> max_pq;

// 2. Min-Heap
priority_queue<int, vector<int>, greater<int>> min_pq;

// 3. Construcció lineal en Theta(n) a partir d'un vector
vector<int> v = {5, 2, 8, 1, 9};
priority_queue<int> pq_lineal(v.begin(), v.end());
```

* Operacions: `.push(x)` ($\mathcal{O}(\log n)$), `.pop()` ($\mathcal{O}(\log n)$), `.top()` ($\Theta(1)$), `.empty()` ($\Theta(1)$), `.size()` ($\Theta(1)$).
* **Parany:** La STL **no suporta `decrease_key`**. Per actualitzar prioritats (com a Dijkstra) cal reinserir el parell duplicat.
