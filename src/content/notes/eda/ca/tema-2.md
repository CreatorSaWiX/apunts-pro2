---
title: "Tema 2: Dividir i vèncer"
description: "Recurrències divisores i subtractives, ordenació (MergeSort, QuickSort), exponenciació ràpida, Karatsuba, Strassen, Torres de Hanoi i selecció lineal (BFPRT)."
readTime: "45 min"
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

### Hibridació per talla crítica
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

### MergeSort iteratiu amb cua (*bottom-up*)
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

### MergeSort iteratiu sobre vector (*bottom-up*)
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

## 2.3 Productes i Exponents: Exponenciació Ràpida

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

---

## 2.4 Multiplicació d'enters grans: Algorisme de Karatsuba

La multiplicació de dos nombres enters de $n$ dígits (o bits) és una operació fonamental en aritmètica computacional i criptografia. 
En el mètode tradicional escolar, es multiplica el primer nombre per cadascun dels $n$ dígits del segon, desplaçant cada fila parcial una posició cap a l'esquerra:

$$
\begin{array}{rl}
2014 & \\
\times 1714 & \\
\hline
8056 & \quad (\text{fila 1: } 2014 \times 4 \cdot 10^0) \\
2014\phantom{0} & \quad (\text{fila 2: } 2014 \times 1 \cdot 10^1) \\
14098\phantom{00} & \quad (\text{fila 3: } 2014 \times 7 \cdot 10^2) \\
2014\phantom{000} & \quad (\text{fila 4: } 2014 \times 1 \cdot 10^3) \\
\hline
3451996 &
\end{array}
$$

| Etapa del mètode escolar | Operació elemental | Nombre d'operacions | Complexitat |
| :--- | :--- | :---: | :---: |
| **Generació de files** | $n$ files amb $n$ productes de dígits i arrossegaments (*carries*) | $n \times n$ | $\Theta(n^2)$ |
| **Suma de columnes** | Suma vertical sobre les $2n$ columnes resultants | $\approx 2n \times n$ | $\Theta(n^2)$ |

El cost total de l'algorisme escolar és:
$$ T_{\text{escolar}}(n) = \Theta(n^2) + \Theta(n^2) = \mathbf{\Theta(n^2)} $$

---

### Descomposició recursiva ingènua (4 subproductes)

L'any 1952, **Andrei Kolmogorov** va conjecturar que qualsevol algorisme per multiplicar dos nombres de $n$ dígits requeria una cota inferior asimptòtica infranquejable de $\Omega(n^2)$ operacions.

:::naivemultviz
:::

Representant dos nombres naturals $x$ i $y$ de $n$ bits (assumint $n$ parell) dividits en la meitat superior ($E$) i inferior ($D$):

$$ 
x = 2^{n/2} x_E + x_D, \qquad y = 2^{n/2} y_E + y_D 
$$

On $x_E, x_D, y_E, y_D$ són enters de $n/2$ bits. El desenvolupament per la propietat distributiva genera:

$$ 
xy = 2^n (x_E y_E) + 2^{n/2} (x_E y_D + x_D y_E) + (x_D y_D) 
$$

Aquest càlcul requereix **4 productes** de mida $n/2$: $x_E y_E$, $x_E y_D$, $x_D y_E$ i $x_D y_D$. Les multiplicacions per $2^n$ i $2^{n/2}$ corresponen a desplaçaments binaris de bits (*bit shifts*) de cost $\Theta(n)$, i les addicions de termes de longitud $\mathcal{O}(n)$ tenen cost lineal $\Theta(n)$.

| Paràmetre de recurrència | Valor | Significat computacional |
| :--- | :---: | :--- |
| **Nombre de subproblemes ($a$)** | $4$ | Els 4 productes creuats ($x_E y_E, x_E y_D, x_D y_E, x_D y_D$). |
| **Factor de reducció ($b$)** | $2$ | Divisió dels operands a la meitat ($n/2$ bits). |
| **Treball no recursiu ($g(n)$)** | $\Theta(n)$ | Desplaçaments binaris i sumes de cadenes de bits ($k = 1$). |

Recurrència:
$$ 
T(n) = 4T(n/2) + \Theta(n) 
$$

Atès que $\alpha = \log_b a = \log_2 4 = 2 > k = 1$:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 4}) = \Theta(n^2)} 
$$

La descomposició directa no redueix la classe asimptòtica respecte a l'algorisme escolar i afegeix sobrecàrrega temporal per la gestió de la pila recursiva.

---

### La reducció de Karatsuba (1960) i la identitat de Gauss

:::karatsubaviz
:::

L'any 1960, **Anatolii Karatsuba** va refutar la conjectura de Kolmogorov inspirant-se en la identitat de Gauss per al producte de nombres complexos:

$$ 
(a + bi)(c + di) = (ac - bd) + (bc + ad)i 
$$

on el terme creuat $bc + ad$ es calcula amb un únic producte addicional:

$$ 
bc + ad = (a + b)(c + d) - ac - bd 
$$

Aplicant aquest principi a enters binaris, Karatsuba defineix tres subproductes:

$$
\begin{aligned}
a &= x_E \cdot y_E \\
b &= x_D \cdot y_D \\
c &= (x_E + x_D)(y_E + y_D)
\end{aligned}
$$

Desenvolupant $c$:
$$ 
c = x_E y_E + x_E y_D + x_D y_E + x_D y_D = a + (x_E y_D + x_D y_E) + b 
$$

D'on la suma dels termes creuats s'obté per sostracció:
$$ 
x_E y_D + x_D y_E = c - a - b 
$$

Expressió final del producte:
$$ 
\mathbf{xy = 2^n a + 2^{n/2} (c - a - b) + b} 
$$

---

### Anàlisi formal de la recurrència de Karatsuba

L'algorisme requereix només **3 crides recursives** sobre nombres de mida $n/2$ ($a$, $b$ i $c$). Les sumes, restes i desplaçaments de bits sobre operands de mida $\mathcal{O}(n)$ tenen un cost no recursiu $g(n) \in \Theta(n)$.

$$ 
T(n) = 3T(n/2) + \Theta(n) 
$$

| Paràmetre Teorema Mestre | Valor | Significat computacional |
| :--- | :---: | :--- |
| **Nombre de crides recursives ($a$)** | $3$ | Els subproductes $a = x_E y_E$, $b = x_D y_D$ i $c = (x_E + x_D)(y_E + y_D)$. |
| **Factor de reducció de mida ($b$)** | $2$ | La longitud en bits es divideix per la meitat. |
| **Treball addicional ($k$)** | $1$ | Sumes, restes i desplaçaments de cadenes de bits ($\Theta(n^1)$). |

Exponent crític:
$$ 
\alpha = \log_b a = \log_2 3 \approx 1.58496 
$$

Com que $\alpha = \log_2 3 > k = 1$, el cost ve dominat per les fulles de l'arbre recursiu:
$$ 
\mathbf{T(n) \in \Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})} 
$$

Atès que $n^{1.585} \in o(n^2)$, aquest resultat demostra formalment que **la multiplicació d'enters té una complexitat estrictament subquadràtica**.

| Algorisme | Nombre de subproductes | Recurrència | Complexitat asimptòtica |
| :--- | :---: | :--- | :---: |
| **Escolar tradicional** | — | — | $\Theta(n^2)$ |
| **Dividir i vèncer ingenu** | 4 de mida $n/2$ | $T(n) = 4T(n/2) + \Theta(n)$ | $\Theta(n^2)$ |
| **Karatsuba** | 3 de mida $n/2$ | $T(n) = 3T(n/2) + \Theta(n)$ | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ |

<!-- ### Consideracions pràctiques d'implementació

| Aspecte d'implementació | Descripció tècnica |
| :--- | :--- |
| **Precisió arbitrària (`BigInt`)** | La CPU multiplica nombres de mida nativa (32 o 64 bits) en maquinari en un temps constant $\Theta(1)$. L'algorisme de Karatsuba s'aplica a tipus de dades de longitud arbitrària representats mitjançant vectors de dígits (`vector<uint32_t>`). |
| **Llindar crític (*threshold*)** | A causa de la constant multiplicativa de les crides recursives i de la gestió de memòria dinàmica, l'algorisme escolar és més eficient per a nombres inferiors a 1000-2000 bits. Les biblioteques d'alt rendiment (com GNU MP) empren un enfocament híbrid que commuta a l'algorisme clàssic per sota d'aquest llindar. | -->

---

## 2.5 Multiplicació de matrius: Algorisme de Strassen

Donades dues matrius quadrades $X, Y \in \mathbb{R}^{n \times n}$, el seu producte $Z = X \cdot Y$ és una matriu $n \times n$ on cada element $(i, j)$ es defineix per:

$$
Z_{ij} = \sum_{k=1}^n X_{ik} Y_{kj} \qquad (1 \le i, j \le n)
$$

### L'algorisme estàndard cúbic $\Theta(n^3)$

La implementació directa d'aquesta definició requereix 3 bucles niats:

```cpp
matrix<int> producte_estandard(const matrix<int>& A, const matrix<int>& B) {
    int n = A.numrows();
    matrix<int> C(n, n, 0);
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            for (int k = 0; k < n; ++k)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
```

Cada cel·la $Z_{ij}$ precisa $n$ multiplicacions i $n - 1$ sumes escalars ($\Theta(n)$ operacions). Omplir les $n \times n = n^2$ cel·les té un cost de:

$$
T(n) = n^2 \cdot \Theta(n) = \mathbf{\Theta(n^3)}
$$

---

### Descomposició per blocs $2 \times 2$

:::naivematmultviz
:::

Dividint les matrius $X$ i $Y$ en quatre quadrants o submatrius de mida $(n/2) \times (n/2)$:

$$
X = \begin{bmatrix} A & B \\ C & D \end{bmatrix}, \qquad Y = \begin{bmatrix} E & F \\ G & H \end{bmatrix}
$$

El producte per blocs reprodueix l'expressió estàndard:

$$
XY = \begin{bmatrix} A & B \\ C & D \end{bmatrix} \begin{bmatrix} E & F \\ G & H \end{bmatrix} = \begin{bmatrix} AE + BG & AF + BH \\ CE + DG & CF + DH \end{bmatrix}
$$

| Operació per blocs | Quantitat i dimensió | Cost computacional |
| :--- | :--- | :---: |
| **Productes de submatrius** | 8 multiplicacions de mida $(n/2) \times (n/2)$ | $8T(n/2)$ |
| **Sumes de submatrius** | 4 sumes de matrius $(n/2) \times (n/2)$ | $\Theta(n^2)$ |

Recurrència:

$$
T(n) = 8T(n/2) + \Theta(n^2)
$$

Pel Teorema Mestre divisor ($a = 8, b = 2, k = 2$):

$$
\alpha = \log_2 8 = 3 > k = 2 \implies \mathbf{T(n) \in \Theta(n^3)}
$$

La divisió directa per blocs manté la mateixa classe asimptòtica cúbica.

---

### Algorisme de Volker Strassen (1969)

:::strassenmatmultviz
:::

L'any 1969, **Volker Strassen** va demostrar que el producte de blocs es pot calcular emprant únicament **7 multiplicacions** de submatrius en comptes de 8, augmentant el nombre de sumes i restes lineals:

$$
\begin{aligned}
P_1 &= A(F - H) \\
P_2 &= (A + B)H \\
P_3 &= (C + D)E \\
P_4 &= D(G - E) \\
P_5 &= (A + D)(E + H) \\
P_6 &= (B - D)(G + H) \\
P_7 &= (A - C)(E + F)
\end{aligned}
$$

Reconstrucció dels quatre quadrants de la matriu producte:

$$
XY = \begin{bmatrix} P_5 + P_4 - P_2 + P_6 & P_1 + P_2 \\ P_3 + P_4 & P_1 + P_5 - P_3 - P_7 \end{bmatrix}
$$

Verificació algebraica del quadrant superior esquerre:

$$
P_5 + P_4 - P_2 + P_6 = (AE + AH + DE + DH) + (DG - DE) - (AH + BH) + (BG + BH - DG - DH) = AE + BG
$$

---

### Anàlisi de complexitat de Strassen

L'algorisme realitza 7 crides recursives sobre submatrius de mida $n/2$ i sumes/restes de matrius de cost $\Theta(n^2)$:

$$
T(n) = 7T(n/2) + \Theta(n^2)
$$

| Paràmetre Teorema Mestre | Valor | Significat computacional |
| :--- | :---: | :--- |
| **Nombre de crides recursives ($a$)** | $7$ | Els 7 productes matricials $P_1 \dots P_7$. |
| **Factor de divisió de mida ($b$)** | $2$ | La dimensió de les submatrius es redueix a $n/2$. |
| **Treball addicional no recursiu ($k$)** | $2$ | Sumes i restes de quadrants de mida $(n/2) \times (n/2)$ ($\Theta(n^2)$). |

Exponent crític:

$$
\alpha = \log_b a = \log_2 7 \approx 2.80735
$$

Com que $\alpha = \log_2 7 > k = 2$:

$$
\mathbf{T(n) \in \Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}
$$

| Algorisme | Nombre de subproductes | Recurrència | Complexitat asimptòtica |
| :--- | :---: | :--- | :---: |
| **Estàndard iteratiu** | — | — | $\Theta(n^3)$ |
| **Blocs ingenu ($2 \times 2$)** | 8 de mida $n/2$ | $T(n) = 8T(n/2) + \Theta(n^2)$ | $\Theta(n^3)$ |
| **Strassen** | 7 de mida $n/2$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ |

<!-- ---

### Reducció del producte lògic de matrius booleanes

El **producte booleà** de dues matrius $A, B \in \{0, 1\}^{n \times n}$ es defineix com:

$$
P_{ij} = \bigvee_{k=1}^n (A_{ik} \wedge B_{kj})
$$

Es pot reduir a una multiplicació matricial estàndard:

| Fase de reducció | Operació | Complexitat |
| :--- | :--- | :---: |
| **1. Conversió a enters** | Interpretar les matrius booleanes $A, B$ com a matrius sobre $\mathbb{Z}$ | $\Theta(n^2)$ |
| **2. Multiplicació amb Strassen** | Calcular el producte enter $M = A \cdot B$ | $\Theta(n^{2.807})$ |
| **3. Llindar booleà** | Avaluar $P_{ij} = (M_{ij} > 0)$ | $\Theta(n^2)$ |

Atès que $M_{ij} = \sum_{k=1}^n A_{ik} B_{kj}$ compta exactament el nombre d'índexs $k$ tals que $A_{ik} = 1$ i $B_{kj} = 1$, la condició $M_{ij} > 0$ equival a la disjunció $\bigvee_{k=1}^n (A_{ik} \wedge B_{kj})$. El cost dominant és el de la multiplicació:

$$
T(n) = \Theta(n^{2.807}) + \Theta(n^2) = \mathbf{\Theta(n^{2.807})}
$$ -->

<!-- ---

### Algorismes galàctics (*Galactic Algorithms*)

Després de Strassen, una successió d'investigacions teòriques van anar rebaixant progressivament l'exponent:
* **Coppersmith i Winograd (1990):** $\mathcal{O}(n^{2.376})$.
* **Avenços recents (Vassilevska Williams et al., 2023):** $\mathcal{O}(n^{2.371})$.

Aquests mètodes moderns pertanyen a la categoria coneguda com **algorismes galàctics**: algorismes que posseeixen un ordre asimptòtic demostradament superior, però les constants multiplicatives ocultes a la notació $\mathcal{O}$ són tan immenses que només superarien els algorismes pràctics (com Strassen o el clàssic per blocs optimitzat amb memòria cau) per a matrius amb dimensions que excedirien la quantitat total d'àtoms de la galàxia visible. Per aquesta raó, Strassen i les seves variants adaptades a memòria cau continuen sent la referència pràctica per a matrius grans. -->

---

## 2.6 Les Torres de Hanoi

El joc de les **Torres de Hanoi** il·lustra l'aplicació de dividir i vèncer sobre recurrències de caràcter **subtractiu**, on la mida del problema es redueix per una constant en lloc d'un factor divisor.

:::hanoiviz
:::

### Descripció i regles del problema

Es disposa de tres varetes verticals: $A$ (origen), $B$ (auxiliar) i $C$ (destí). Inicialment, $A$ conté una pila de $n$ discs foradats de radis estrictament decreixents (el disc de màxim diàmetre a la base). L'objectiu és traslladar la torre completa a $C$ complint dues restriccions invariants: a cada pas només es pot desplaçar el disc superior d'una pila i cap disc no pot dipositar-se mai sobre un disc de diàmetre inferior.

::videoviz{url="/eda/hanoi_transparent.webm?v=2" delay="2000" transparent="true"}

Per traslladar $n$ discs de la vareta origen $A$ a la vareta destí $C$ utilitzant $B$ com a suport auxiliar:

```cpp
void hanoi(int n, char a, char b, char c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); // Moure n-1 discs d'origen (a) a auxiliar (b) usant destí (c)
        cout << a << " -> " << c << "\n"; // Moviment elemental del disc més gran
        hanoi(n - 1, b, a, c); // Moure n-1 discs d'auxiliar (b) a destí (c) usant origen (a)
    }
}
```

---

### Càlcul del nombre exacte de moviments

Definim $M(n)$ com el nombre de moviments elementals necessaris per traslladar una torre de $n$ discs:

$$
M(n) = \begin{cases} 
0, & \text{si } n = 0 \\ 
2M(n - 1) + 1, & \text{si } n > 0 
\end{cases}
$$

El terme $2M(n - 1)$ representa els dos trasllats de la subtorre superior i el $+1$ correspon al desplaçament del disc basal.

| $n$ | $M(n) = 2M(n-1) + 1$ | Expressió associada a potències de 2 |
| :---: | :---: | :--- |
| **0** | $0$ | $2^0 - 1 = 0$ |
| **1** | $2(0) + 1 = 1$ | $2^1 - 1 = 1$ |
| **2** | $2(1) + 1 = 3$ | $2^2 - 1 = 3$ |
| **3** | $2(3) + 1 = 7$ | $2^3 - 1 = 7$ |
| **4** | $2(7) + 1 = 15$ | $2^4 - 1 = 15$ |
| **5** | $2(15) + 1 = 31$ | $2^5 - 1 = 31$ |
| **6** | $2(31) + 1 = 63$ | $2^6 - 1 = 63$ |

La successió indueix la solució exacta tancada:

$$
\mathbf{M(n) = 2^n - 1}
$$

### Demostració formal mitjançant canvi de variable:

Definint la seqüència auxiliar $S(n) = M(n) + 1$:

$$
S(n) = 2M(n-1) + 1 + 1 = 2(S(n-1) - 1) + 2 = 2S(n-1)
$$

Amb el cas base $S(0) = M(0) + 1 = 1$, la recurrència homogènia $S(n) = 2S(n-1)$ correspon a una progressió geomètrica de raó 2:

$$
S(n) = 2^n \implies \mathbf{M(n) = S(n) - 1 = 2^n - 1} \qquad (\forall n \ge 0)
$$

---

### Anàlisi asimptòtica mitjançant el Teorema Mestre subtractiu

La recurrència de les Torres de Hanoi s'ajusta a la forma general subtractiva:

$$
T(n) = a T(n - b) + g(n)
$$

| Paràmetre | Valor | Justificació |
| :--- | :---: | :--- |
| **Nombre de subproblemes ($a$)** | $2$ | Dues crides recursives independents per nivell. |
| **Pas de decrement ($b$)** | $1$ | La mida disminueix en una unitat ($n \to n - 1$). |
| **Cost no recursiu ($g(n)$)** | $\Theta(1)$ | Una única operació elemental d'escriptura o moviment ($k = 0$). |

Pel Teorema Mestre de recurrències subtractives, en ser $a = 2 > 1$, la solució és de tipus exponencial:

$$
\mathbf{T(n) \in \Theta(a^{n/b}) = \Theta(2^n)}
$$

Aquest cost exponencial és **estrictament mínim**. Per desplaçar el disc de la base, els $n-1$ discs restants han d'estar necessàriament allotjats a la vareta auxiliar. Per tant, és impossible resoldre el problema en menys de $2^n - 1$ moviments.

---

## 2.7 Càlcul de la Mediana i Algorismes de Selecció

### La mediana i la seva robustesa estadística

La **mediana** d'un conjunt de nombres és l'element central que divideix la mostra ordenada en dues meitats d'igual grandària: hi ha tants elements inferiors o iguals com superiors o iguals.
* Si la longitud $n$ és senar: la mediana és l'element central exacte.
* Si $n$ és parell: hi ha dos candidats centrals; per conveni formal s'escull el menor (o el més gran).

:::medianviz
:::

A diferència de la mitjana aritmètica ($\bar{x} = \frac{1}{n}\sum x_i$), la mediana posseeix dues propietats destacades:
1. **Pertinença garantida:** La mediana sempre és un dels valors reals presents al conjunt original de dades.
2. **Robustesa davant valors atípics (*outliers*):** Si mesurem temps d'execució d'un procés i obtenim la seqüència $[1, 1, 1, 1, 1, 1, 1, 1, 1, 100]$, la mitjana és $10.9$ (un valor enganyós que no descriu el comportament típic), mentre que la mediana és $1$, restant completament immune a la pertorbació puntual.

<!-- ### El problema general de selecció

En algorísmia, calcular la mediana és un cas particular del **problema de selecció**:
$$\text{seleccio}(S, k)$$
Donat un vector $S$ de $n$ elements i un natural $1 \le k \le n$, trobar el $k$-èssim element més petit de $S$.
* Per a la mediana: $k = \lfloor(n + 1) / 2\rfloor$.
* Per al primer quartil: $k = \lfloor(n + 1) / 4\rfloor$.
* Per al mínim absolut: $k = 1$.
* Per al màxim absolut: $k = n$.

#### La ineficiència d'ordenar prèviament:
La solució trivial consisteix a ordenar el vector complet amb MergeSort o HeapSort en temps $\Theta(n \log n)$ i consultar la posició $k - 1$. No obstant això, ordenar fa un treball redundant: a nosaltres no ens cal que els elements a l'esquerra o a la dreta del resultat estiguin ordenats entre si; únicament necessitem situar l'element correcte a la frontera.

---

### Algorisme QuickSelect (Hoare, 1962)

Tony Hoare va adaptar el mecanisme de partició de QuickSort per resoldre la selecció sense ordenar tot el vector:

```cpp
int quickselect(vector<int>& A, int l, int r, int k) {
    if (l == r) return A[l];
    int q = partition(A, l, r); // Partició de Hoare o Lomuto
    int len_left = q - l + 1;    // Mida del subvector esquerre (elements <= pivot)
    
    if (k <= len_left) {
        return quickselect(A, l, q, k);
    } else {
        return quickselect(A, q + 1, r, k - len_left);
    }
}
```

A diferència de QuickSort, que crida recursivament sobre **tots dos** costats de la partició ($2$ crides), QuickSelect descarta immediatament la meitat on sap segur que no es troba l'element cercat, realitzant **una sola crida recursiva**.

#### Anàlisi del cost de QuickSelect:
* **Cas mitjà:** Si el pivot produeix una partició raonablement equilibrada, la mida es divideix aproximadament per la meitat a cada pas:
  $$ T(n) = T(n/2) + \Theta(n) $$
  Pel Teorema Mestre divisor ($a = 1, b = 2, k = 1 \implies \alpha = \log_2 1 = 0 < k = 1$):
  $$ T_{\text{mitjà}}(n) \in \mathbf{\Theta(n)} $$
* **Cas pitjor:** Si el pivot triat resulta ser sempre l'element mínim o màxim i la cerca avança cap a la part gran, el subvector només es redueix en 1 element:
  $$ T(n) = T(n - 1) + \Theta(n) $$
  Pel Teorema Mestre subtractiu ($a = 1, b = 1, k = 1 \implies \Theta(n^{k+1})$):
  $$ T_{\max}(n) \in \mathbf{\Theta(n^2)} $$ -->

---

### Algorisme de la Mediana de Medianes (BFPRT, 1973)

L'any 1973, Manuel Blum, Robert Floyd, Vaughan Pratt, Ronald Rivest i Robert Tarjan van dissenyar un mètode determinista per escollir un pivot garantit que assegura que el cost de QuickSelect sigui **lineal $\Theta(n)$ en el cas pitjor**.

:::bfprtviz
:::

### Descripció de l'algorisme per blocs de mida $q = 5$:
1. **Divisió en blocs:** Es divideix el vector $A$ de mida $n$ en $\lceil n/5 \rceil$ blocs de 5 elements (excepte potser l'últim bloc, que pot contenir-ne menys).
2. **Mediana de cada bloc:** Es calcula la mediana de cadascun dels blocs. Com que cada bloc té una mida constant ($q = 5$), trobar la mediana d'un bloc costa $\Theta(1)$ operacions. Per als $n/5$ blocs:
   $$ \text{Cost(medianes de blocs)} = \frac{n}{5} \cdot \Theta(1) = \Theta(n) $$
3. **Càlcul recursiu del pivot:** S'aplica recursivament el propi algorisme de selecció per trobar la **mediana de les $n/5$ medianes** obtingudes al pas anterior. Aquest valor central rep el nom de **pseudomediana** o pivot garantit $p$.
   $$ \text{Cost(trobar pivot)} = T(n/5) $$
4. **Partició del vector original:** S'utilitza el pivot $p$ per partir el vector original de mida $n$ en dues meitats mitjançant la partició estàndard, amb cost lineal $\Theta(n)$.
5. **Crida recursiva final:** Es determina a quin dels dos subvectors rau el $k$-èssim element i s'hi fa una única crida recursiva.

---
<!-- 
### Demostració formal de la cota de balanceig del pivot

Determinem quants elements tenim la garantia absoluta que seran inferiors (o superiors) al pivot $p$:

1. Com que $p$ és la mediana del conjunt de medianes de blocs, $p$ és estrictament major o igual que com a mínim la meitat de les medianes de bloc:
   $$ \text{Nombre de medianes } \le p \quad \ge \quad \frac{1}{2} \left(\frac{n}{q}\right) = \frac{n}{2q} $$
2. Cadascuna d'aquestes medianes de bloc és, per la pròpia definició de mediana dins del seu bloc de mida $q$, major o igual que la meitat dels elements d'aquell bloc:
   $$ \text{Elements per bloc } \le \text{mediana de bloc} \quad \ge \quad \frac{q}{2} $$
3. Multiplicant ambdues cotes:
   $$ \text{Elements garantits } \le p \quad \ge \quad \left(\frac{1}{2} \cdot \frac{n}{q}\right) \times \left(\frac{q}{2}\right) = \mathbf{\frac{n}{4}} $$

> **Resultat fonamental:** El factor $q$ se simplifica algebraicament. El pivot $p$ té la garantia matemàtica que **com a mínim una quarta part ($\frac{1}{4}n$) dels elements són $\le p$** i, per pura simetria, **com a mínim una quarta part ($\frac{1}{4}n$) dels elements són $\ge p$**.

En conseqüència, en el cas més desfavorable possible, el subvector restant sobre el qual haurà d'operar la crida recursiva final tindrà com a màxim:
$$ 
\text{Mida màxima del subvector restant} \le n - \frac{n}{4} = \mathbf{\frac{3n}{4}} 
$$

L'algorisme elimina per complet la possibilitat d'un desequilibri extrem de mida $n - 1$.

--- -->

### Recurrència global i la condició de linealitat

El cost temporal en el cas pitjor $C(n)$ engloba tres contribucions:
1. Treball no recursiu (càlcul de les medianes de blocs de 5 elements i partició del vector complet): $\Theta(n)$.
2. Crida recursiva per determinar el pivot entre les $n/5$ medianes: $C(n/5)$.
3. Crida recursiva final de selecció sobre el subvector restant (mida màxima $3n/4$): $C(3n/4)$.

$$ 
\mathbf{C(n) = C\left(\frac{n}{5}\right) + C\left(\frac{3n}{4}\right) + \Theta(n)} 
$$

Aquesta equació no és directament resoluble pel Teorema Mestre perquè les mides dels subproblemes són asimètriques ($n/5$ i $3n/4$). No obstant això, una recurrència de la família $T(n) = T(\alpha n) + T(\beta n) + \Theta(n)$ convergeix a una solució lineal $\Theta(n)$ **si i només si la suma dels coeficients de contracció és estrictament menor que 1**:

$$ 
\alpha + \beta < 1 \iff \frac{1}{q} + \frac{3}{4} < 1 
$$

Per què es prenen blocs de mida $q = 5$?

| Valor de $q$ | Suma de fraccions $\frac{1}{q} + \frac{3}{4}$ | Condició $< 1$ | Comportament asimptòtic resultant |
| :---: | :---: | :---: | :--- |
| **$q = 3$** | $\frac{1}{3} + \frac{3}{4} = \frac{4 + 9}{12} = \mathbf{\frac{13}{12} \approx 1.083}$ | Fals ($> 1$) | **No lineal.** La quantitat de feina acumulada creix a cada nivell, resultant en un cost superlineal $\omega(n)$. |
| **$q = 5$** | $\frac{1}{5} + \frac{3}{4} = 0.20 + 0.75 = \mathbf{0.95}$ | **Cert ($< 1$)** | **Estrictament lineal $\mathbf{\Theta(n)}$.** |
| **$q = 7$** | $\frac{1}{7} + \frac{3}{4} \approx 0.143 + 0.75 = \mathbf{0.893}$ | **Cert ($< 1$)** | Lineal $\Theta(n)$, però augmenta el cost constant d'ordenar cada bloc de 7 elements. |

Per a $q = 5$, a cada nivell recursiu la quantitat agregada d'elements a processar és un factor $0.95$ respecte al nivell anterior ($n, 0.95n, (0.95)^2n, \dots$). El treball total és una sèrie geomètrica convergent:

$$ 
C(n) \le c \cdot n \sum_{i=0}^\infty (0.95)^i = c \cdot n \left(\frac{1}{1 - 0.95}\right) = 20 c \cdot n \in \mathbf{\Theta(n)} 
$$

Gràcies a l'estratègia de la mediana de medianes, **el cas pitjor de selecció i de cerca de la mediana queda resolt en temps estrictament lineal $\Theta(n)$**.

---

## 2.8 Síntesi de Complexitats del Tema 2

A continuació es resumeix el ventall complet d'algorismes de dividir i vèncer analitzats al llarg del tema:

| Algorisme | Problema computacional | Equació de recurrència $T(n)$ | Tipus de recurrència i mètode | Complexitat temporal | Espai addicional |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Cerca binària** | Cerca en vector ordenat | $T(n) = T(n/2) + \Theta(1)$ | Divisió ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(1)$ |
| **Exponenciació ràpida** | Càlcul de $x^n$ | $T(n) = T(n/2) + \Theta(1)$ | Divisió ($a=1, b=2, k=0 \implies \alpha = k$) | $\Theta(\log n)$ | $\Theta(\log n)$ |
| **MergeSort** | Ordenació estable | $T(n) = 2T(n/2) + \Theta(n)$ | Divisió ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(n)$ |
| **QuickSort (cas millor/mitjà)** | Ordenació *in-place* | $T(n) = 2T(n/2) + \Theta(n)$ | Divisió ($a=2, b=2, k=1 \implies \alpha = k$) | $\Theta(n \log n)$ | $\Theta(\log n)$ |
| **QuickSort (cas pitjor)** | Ordenació *in-place* | $T(n) = T(n-1) + \Theta(n)$ | Subtracció ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Multiplicació escolar** | Producte de dos enters de $n$ bits | — | Anàlisi iteratiu de graella de dígits | $\Theta(n^2)$ | $\Theta(n)$ |
| **Karatsuba** | Producte de dos enters de $n$ bits | $T(n) = 3T(n/2) + \Theta(n)$ | Divisió ($a=3, b=2, k=1 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})}$ | $\Theta(n)$ |
| **Matrius estàndard** | Producte de matrius $n \times n$ | — | 3 bucles niats | $\Theta(n^3)$ | $\Theta(n^2)$ |
| **Strassen** | Producte de matrius $n \times n$ | $T(n) = 7T(n/2) + \Theta(n^2)$ | Divisió ($a=7, b=2, k=2 \implies \alpha > k$) | $\mathbf{\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})}$ | $\Theta(n^2)$ |
| **Torres de Hanoi** | Trasllat de $n$ discs | $T(n) = 2T(n-1) + \Theta(1)$ | Subtracció ($a=2, b=1, k=0 \implies a > 1$) | $\mathbf{\Theta(2^n)}$ (exacte: $2^n - 1$) | $\Theta(n)$ |
| **QuickSelect (cas mitjà)** | Selecció del $k$-èssim element | $T(n) = T(n/2) + \Theta(n)$ | Divisió ($a=1, b=2, k=1 \implies \alpha < k$) | $\Theta(n)$ | $\Theta(\log n)$ |
| **QuickSelect (cas pitjor)** | Selecció del $k$-èssim element | $T(n) = T(n-1) + \Theta(n)$ | Subtracció ($a=1, b=1, k=1$) | $\Theta(n^2)$ | $\Theta(n)$ |
| **Mediana de Medianes (BFPRT)** | Selecció del $k$-èssim (cas pitjor) | $T(n) = T(n/5) + T(3n/4) + \Theta(n)$ | Contracció asimètrica ($1/5 + 3/4 = 0.95 < 1$) | $\mathbf{\Theta(n)}$ | $\Theta(\log n)$ |

