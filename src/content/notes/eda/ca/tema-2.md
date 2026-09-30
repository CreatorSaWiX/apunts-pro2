---
title: "Tema 2: Divide and Conquer"
description: "Algorismes de divideix i venceràs (Divide and Conquer): anàlisi de recurrències, cerca binària avançada, exponenciació ràpida i ordenació."
readTime: "25 min"
order: 2
draft: false
---

El paradigma de **dividir i vèncer** descomposa un problema de mida $n$ en subproblemes menors de la mateixa naturalesa, els resol de forma recursiva i en combina els resultats per obtenir la solució global.

| Fase | Acció | Cost associat |
| :--- | :--- | :---: |
| **1. Dividir** | Descompondre l'entrada en $a \ge 1$ subproblemes de mida $n/b$ amb $b > 1$. | $T_{\text{divisio}}(n)$ |
| **2. Vèncer** | Resoldre recursivament els $a$ subproblemes (resolució directa $\Theta(1)$ en cas base). | $a \cdot T(n/b)$ |
| **3. Combinar** | Acoblar les solucions parcials per construir la solució global. | $T_{\text{combinar}}(n)$ |

:::dncviz
:::

### Distribució del cost temporal
El cost total d'un algorisme de dividir i vèncer prové exclusivament de tres fonts:

$$
T(n) = \underbrace{T_{\text{divisio}}(n)}_{\text{partir}} + \underbrace{a \cdot T(n/b)}_{\text{crides recursives}} + \underbrace{T_{\text{combinar}}(n)}_{\text{fusió/acoblament}}
$$

On la feina no recursiva $g(n) = T_{\text{divisio}}(n) + T_{\text{combinar}}(n)$ pertany típicament a $\Theta(n^k)$ per a $k \ge 0$, podent resoldre's mitjançant el **Teorema Mestre de recurrències divisores**.

### Exemple introductori: Cerca binària (dicotòmica)
Donat un vector $A[0 \dots n-1]$ **ordenat**, volem determinar si un element $x$ hi pertany. A cada pas comparem $x$ amb l'element central $A[m]$: si coincideixen hem acabat; si $x < A[m]$, busquem recursivament a la meitat esquerra; si $x > A[m]$, a la meitat dreta.

:::binarysearchviz
:::

:::oopviz{simulation="binary_search"}
:::

El paràmetre de recursió és $n = j - i + 1$. A cada nivell es realitza només **una** crida recursiva ($a = 1$) sobre un subvector de mida meitat ($b = 2$), i el treball no recursiu (càlcul del mig i comparacions) és constant ($g(n) \in \Theta(1) \implies k = 0$).

$$ 
T(n) = T(n/2) + \Theta(1) 
$$

Pel Teorema Mestre divisor: $\alpha = \log_b a = \log_2 1 = 0$. Com que $\alpha = k = 0$, tenim:

$$ 
\mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} 
$$

---

## 2.1 Ordenació per fusió (*MergeSort*)

L'algorisme d'**ordenació per fusió** (*MergeSort*) és un esquema de dividir i vèncer on la partició del vector és trivial i el treball computacional principal recau en la combinació ordenada dels subvectors.

:::mergerecviz
:::

| Propietat | Comportament | Justificació |
| :--- | :---: | :--- |
| **Complexitat temporal** | $\Theta(n \log n)$ | Òptima en el model de comparacions; idèntica en cas millor, mitjà i pitjor (no adaptatiu). |
| **Estabilitat** | Sí | Preserva l'ordre relatiu original dels elements amb claus idèntiques. |
| **Memòria auxiliar** | $\Theta(n)$ | Requereix un vector auxiliar per a la fase de fusió (no és *in-place*). |

### Estabilitat i ordenació multicriteri

Un algorisme és **estable** si per a qualsevol parella d'elements amb claus idèntiques ($x = y$), si $x$ precedeix $y$ a l'entrada, $x$ també precedeix $y$ a la sortida.

Aquesta propietat permet l'**ordenació multicriteri**: per ordenar un conjunt de dades segons múltiples claus de prioritat diferent, s'aplica l'algorisme estable de manera successiva des del criteri menys prioritari fins al més prioritari.

| Pas | Criteri aplicat | Seqüència resultant |
| :---: | :--- | :--- |
| **0** | Entrada desordenada | $\langle 6, 7 \rangle,\; \langle 3, 2 \rangle,\; \langle 1, 4 \rangle,\; \langle 3, 1 \rangle,\; \langle 1, 6 \rangle,\; \langle 4, 7 \rangle$ |
| **1** | Ordenar per la 2a component | $\langle 3, \mathbf{1} \rangle,\; \langle 3, \mathbf{2} \rangle,\; \langle 1, \mathbf{4} \rangle,\; \langle 1, \mathbf{6} \rangle,\; \langle 6, \mathbf{7} \rangle,\; \langle 4, \mathbf{7} \rangle$ |
| **2** | Ordenació estable per la 1a component | $\langle \mathbf{1}, 4 \rangle,\; \langle \mathbf{1}, 6 \rangle,\; \langle \mathbf{3}, 1 \rangle,\; \langle \mathbf{3}, 2 \rangle,\; \langle \mathbf{4}, 7 \rangle,\; \langle \mathbf{6}, 7 \rangle$ |

---

### Esquema recursiu i implementació

L'algorisme opera sobre el mateix vector $T$ delimitat pels índexs d'inici $e$ i final $d$. Divideix el subvector pel punt mitjà $m = \lfloor(e + d) / 2\rfloor$, ordena recursivament ambdues meitats i les combina amb `merge`.

La fusió combina dos subvectors contigus prèviament ordenats, $T[e \dots m]$ i $T[m+1 \dots d]$, produint un únic subvector ordenat a $T[e \dots d]$. No és possible realitzar aquesta operació *in-place* en temps lineal; per tant, requereix un vector auxiliar $B$ de mida $d - e + 1$.

:::mergeviz
:::

| Aspecte clau | Codi associat | Justificació / Efecte |
| :--- | :--- | :--- |
| **Mida auxiliar** | `vector<elem> B(d - e + 1)` | Nombre d'elements en l'interval tancat $[e, d]$. |
| **Estabilitat** | `if (T[i] <= T[j])` | En cas d'empat ($T[i] = T[j]$), prioritza l'element de l'esquerra, preservant l'ordre original. |
| **Bucles residuals** | `while (i <= m)`, `while (j <= d)` | Copien els elements restants. Són mútuament excloents (exactament un índex arriba al límit). |
| **Desplaçament (*shift*)** | `T[e + k] = B[k]` | Reubica el contingut de $B[0 \dots n-1]$ a la finestra original $T[e \dots d]$. |
| **Cost de fusió** | $T_{\text{merge}}(n) \in \Theta(n)$ | Fa com a màxim $n - 1$ comparacions i exactament $2n$ assignacions ($n$ a $B$ i $n$ de retorn a $T$). |

:::oopviz{simulation="mergesort"}
:::

### Anàlisi del cost temporal

El cost temporal $T(n)$ per a un subvector de mida $n = d - e + 1$ satisfà l'equació de recurrència:

$$
T(n) = \begin{cases} \Theta(1) & \text{si } n \le 1 \\ 2T(n/2) + \Theta(n) & \text{si } n > 1 \end{cases}
$$

Aplicant el Teorema Mestre divisor amb paràmetres $a = 2$, $b = 2$ i $g(n) \in \Theta(n^1)$ ($k = 1$):

$$
\alpha = \log_b a = \log_2 2 = 1
$$

Com que $\alpha = k = 1$, la complexitat asimptòtica resulta:

$$
T(n) \in \Theta(n^k \log n) = \Theta(n \log n)
$$

Aquest cost és independent de la disposició inicial de les dades; el nombre de divisions i comparacions és idèntic en tots els casos:

$$
T_{\min}(n) = T_{\text{mitjà}}(n) = T_{\max}(n) = \Theta(n \log n)
$$

---

### Variants d'optimització

#### Hibridació per talla crítica
Per a subvectors de mida petita ($n < k_0 \approx 50$), la inserció supera la fusió a la pràctica gràcies a factors constants inferiors i a l'absència de gestió de memòria dinàmica. Quan l'interval cau per sota del llindar crític, s'interromp la recursió i s'aplica inserció:

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

#### MergeSort iteratiu amb cua (*bottom-up*)
Construeix la solució de baix a dalt sense recursió: encua cada element com un vector unitari i fusiona successivament les parelles extretes del cap de la cua fins que en resta un de sol:

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

#### MergeSort iteratiu sobre vector (*bottom-up*)
Aplica el principi *bottom-up* directament sobre el vector sense la sobrecàrrega d'una cua, fusionant blocs contigus de mida duplicada a cada etapa ($m = 1, 2, 4, 8, \dots$):

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

## 2.2 Ordenació ràpida (*QuickSort*)

**QuickSort** és un algorisme de dividir i vèncer que reordena els elements directament sobre el vector (*in-place*). Té un cost en cas mitjà de $\Theta(n \log n)$ i un cas pitjor de $\Theta(n^2)$, amb un coeficient constant molt baix que el fa extremadament ràpid a la pràctica.

### Fases de l'algorisme

| Fase | Acció | Cost associat |
| :--- | :--- | :---: |
| **1. Triar pivot** | Seleccionar un element $x \in T$ com a referència. | $\Theta(1)$ |
| **2. Partició** | Reorganitzar $T$ en dos subblocs: elements $\le x$ a l'esquerra i elements $\ge x$ a la dreta. | $\Theta(n)$ |
| **3. Vèncer** | Ordenar recursivament cadascun dels dos subblocs. | $T(n_1) + T(n_2)$ |
| **4. Combinar** | Trivial: el vector ja queda ordenat en memòria sense cap operació addicional. | $\Theta(1)$ |

:::quicksortviz
:::

### Dualitat: MergeSort vs QuickSort

MergeSort i QuickSort presenten una simetria inversa en l'esforç computacional de les seves fases:

| Característica | MergeSort | QuickSort |
| :--- | :---: | :---: |
| **Fase de divisió** | Trivial: punt mitjà ($\Theta(1)$) | Complexa: partició per pivot ($\Theta(n)$) |
| **Subproblemes** | Sempre balancejats ($n/2$) | Variables segons el pivot ($n_1 + n_2 = n$) |
| **Fase de combinació** | Complexa: fusió ordenada ($\Theta(n)$) | Nul·la: elements ja col·locats *in-place* ($\Theta(1)$) |
| **Memòria auxiliar** | $\Theta(n)$ (vector auxiliar) | $\Theta(1)$ addicional (*in-place*) |
| **Estabilitat** | Estable | No estable |
| **Cas pitjor** | $\Theta(n \log n)$ | $\Theta(n^2)$ |
| **Cas mitjà** | $\Theta(n \log n)$ | $\Theta(n \log n)$ |

---

### Partició de Hoare *in-place*
La partició clàssica de Hoare opera sense cap vector auxiliar. Utilitza dos punters: $i$ (que avança des de l'esquerra buscant elements $\ge x$) i $j$ (que avança des de la dreta buscant elements $\le x$). Quan tots dos s'aturen, s'intercanvien amb `swap` i continuen acostant-se fins a creuar-se ($i \ge j$).

:::hoarepartviz
:::

:::oopviz{simulation="quicksort"}
:::

| Aspecte tècnic | Descripció formal |
| :--- | :--- |
| **Punters i pre-operadors** | S'inicialitzen a $i = e - 1$ i $j = d + 1$. Els pre-increments (`++i`) i pre-decrements (`--j`) garanteixen que la primera avaluació operi exactament sobre els extrems $e$ i $d$. |
| **Postcondició** | En retornar l'índex $q = j$, es compleix $\forall k \in [e \dots q], T[k] \le x$ i $\forall k \in [q+1 \dots d], T[k] \ge x$. |
| **Cost computacional** | Temps lineal $\mathbf{\Theta(n)}$ (cada element és avaluat un nombre constant de vegades, amb $\le n/2$ intercanvis) i memòria auxiliar $\mathbf{\Theta(1)}$ (*in-place*). |

---

### Estratègies d'elecció del pivot
Atès que la partició de Hoare pren com a referència l'element $T[e]$, qualsevol estratègia alternativa selecciona un element i l'intercanvia inicialment amb $T[e]$:

| Estratègia | Mecanisme | Avantatge | Inconvenient |
| :--- | :--- | :--- | :--- |
| **Primer element ($x = T[e]$)** | Selecció directa del primer índex. | Cost d'elecció nul ($\Theta(1)$). | Degenera a $\Theta(n^2)$ si l'entrada ja està ordenada o invertida. |
| **Pivot aleatori** | Tria aleatòria $p \in [e, d]$ i `swap(T[e], T[p])`. | Elimina correlacions amb ordenacions prèvies de les dades. | Sobrecàrrega en la generació de valors pseudoaleatoris. |
| **Mediana de tres** | Mediana entre $T[e]$, $T[\lfloor(e+d)/2\rfloor]$ i $T[d]$. | Assegura que el pivot no és mai cap dels dos valors extrems absoluts. | Requereix 3 comparacions i intercanvis previs per partició. |
| **Hibridació per inserció** | Commutació a inserció quan $d - e < 20$. | Redueix la sobrecàrrega recursiva en subvectors de mida reduïda. | Precisa calibrar la mida crítica segons l'arquitectura. |

Codi per a l'estratègia de la mediana de tres:
```cpp
int centre = (e + d) / 2;
if (T[e] < T[centre]) swap(T[centre], T[e]);
if (T[d] < T[centre]) swap(T[centre], T[d]);
if (T[d] < T[e]) swap(T[e], T[d]);
// La mediana queda situada a T[e]
```

---

### Anàlisi de complexitat de QuickSort
Sigui $i$ el nombre d'elements del primer subvector ($1 \le i \le n - 1$). La recurrència general és:

$$ T(n) = T(i) + T(n - i) + \Theta(n) $$

| Cas | Condició de partició | Recurrència | Complexitat asimptòtica |
| :--- | :--- | :--- | :---: |
| **Pitjor** | Desequilibri màxim ($i = 1$ o $i = n - 1$ per selecció d'elements extrems) | $T(n) = T(n - 1) + \Theta(n)$ | $\mathbf{\Theta(n^2)}$ |
| **Millor** | Equilibri exacte ($i = n/2$, bisecció simètrica) | $T(n) = 2T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n \log n)}$ |

---

### Comparativa pràctica: QuickSort vs MergeSort a nivell d'arquitectura
Tot i compartir un cost asimptòtic de $\Theta(n \log n)$, QuickSort resulta habitualment entre $2$ i $3$ vegades més ràpid en sistemes reals a causa del rendiment de la jerarquia de memòria:

| Nivell de memòria | Temps d'accés típic | Factor de lentitud respecte a registres |
| :--- | :--- | :---: |
| **Registres de CPU** | $< 0.5 \text{ ns}$ | $1\times$ |
| **Memòria Cau L1** | $\sim 1 \text{ ns}$ | $2\times$ |
| **Memòria Cau L2** | $\sim 7 \text{ ns}$ | $14\times$ |
| **Memòria Cau L3** | $\sim 20 \text{ ns}$ | $40\times$ |
| **Memòria Principal (RAM)** | $\sim 100 \text{ ns}$ | **$200\times$** |

| Factor d'arquitectura | QuickSort | MergeSort |
| :--- | :--- | :--- |
| **Localitat espacial i memòria cau** | Alta (*in-place*). El recorregut seqüencial des dels extrems maximitza els encerts de cau (*cache hits*) a L1 i L2. | Reduïda. L'accés alternat entre el vector base i l'auxiliar provoca fallades de cau (*cache misses*). |
| **Gestió de memòria dinàmica** | Nul·la. Opera directament sobre l'espai existent ($\Theta(1)$ memòria addicional). | Elevada. Requereix reservar i alliberar espai auxiliar de mida $\Theta(n)$ per a la fusió. |
| **Factor constant intern** | Molt baix. El bucle intern conté únicament comparacions i desplaçaments d'índexs. | Més alt. Inclou la transferència d'elements cap a l'auxiliar i la còpia de retorn. |

---

# 2.3 Productes i Exponents: Exponenciació Ràpida

El càlcul de potències enteres $x^n$ exemplifica com l'estratègia de dividir i vèncer permet reduir la complexitat computacional d'un cost lineal a un cost logarítmic.

| Enfocament | Mecanisme de càlcul | Recurrència / Nombre d'operacions | Complexitat temporal | Memòria auxiliar |
| :--- | :--- | :---: | :---: | :---: |
| **Iteratiu ingenu** | Multiplicacions successives $\prod_{i=1}^n x$ en un bucle | $n - 1 \text{ multiplicacions}$ | $\Theta(n)$ | $\Theta(1)$ |
| **Dividir i vèncer** | Càlcul recursiu de $x^{\lfloor n/2 \rfloor}$ seguit d'elevació al quadrat | $T(n) = T(n/2) + \Theta(1)$ | $\mathbf{\Theta(\log n)}$ | $\Theta(\log n)$ (pila) |

La relació de recurrència formal es defineix per:

$$
x^n = \begin{cases} 
1, & \text{si } n = 0 \quad\text{(cas base)} \\ 
\left(x^{n/2}\right)^2, & \text{si } n \text{ és parell} \\ 
\left(x^{(n-1)/2}\right)^2 \cdot x, & \text{si } n \text{ és senar} 
\end{cases}
$$

:::fastpowerviz
:::

:::oopviz{simulation="fast_power"}
:::

### Anàlisi de complexitat i nombre de crides recursives

Emmagatzemant el resultat intermedi de la subpotència en una variable local (`y = potencia(x, n/2)`), es realitza una única crida recursiva per nivell:

| Paràmetre del Teorema Mestre | Valor | Justificació matemàtica |
| :--- | :---: | :--- |
| **Nombre de subproblemes ($a$)** | $1$ | Una sola crida recursiva gràcies a l'emmagatzematge del terme intermedi. |
| **Factor de divisió ($b$)** | $2$ | L'exponent es divideix a la meitat a cada pas. |
| **Treball no recursiu ($g(n)$)** | $\Theta(1)$ | Paritat de l'exponent i un màxim de dues multiplicacions escalars ($k = 0$). |

Recurrència:
$$ T(n) = T(n/2) + \Theta(1) $$

Atès que $\alpha = \log_b a = \log_2 1 = 0$ i $k = 0$ ($\alpha = k$):
$$ \mathbf{T(n) \in \Theta(\log n)} $$

> **Observació sobre la duplicació de crides:**  
> Si es calcula duplicant l'expressió (`potencia(x, n/2) * potencia(x, n/2)`), el nombre de crides passa a ser $a = 2$. La recurrència esdevé $T(n) = 2T(n/2) + \Theta(1)$, on $\alpha = \log_2 2 = 1 > k = 0 \implies T(n) \in \Theta(n)$, perdent completament l'eficiència de l'algorisme.

### Aplicacions pràctiques

| Àmbit | Aplicació | Complexitat resultant |
| :--- | :--- | :---: |
| **Àlgebra matricial** | Càlcul del terme $n$-èssim de Fibonacci elevant la matriu $\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$. | $\Theta(\log n)$ |
| **Criptografia** | Aritmètica d'exponenciació modular ($x^n \pmod m$) en esquemes de clau pública com RSA o Diffie-Hellman. | $\Theta(\log n)$ |
