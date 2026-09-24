---
title: "Tema 2: Divide and Conquer"
description: "Algorismes de divideix i venceràs (Divide and Conquer): anàlisi de recurrències, cerca binària avançada, exponenciació ràpida i ordenació."
readTime: "25 min"
order: 2
draft: false
---

# 1. Dividir i vèncer

L'estratègia de **dividir i vèncer** és un dels patrons de disseny algorísmic més potents en computació. Consisteix a descompondre un problema de mida $n$ en subproblemes més petits de la mateixa naturalesa, resoldre'ls de forma recursiva i combinar les seves solucions per construir la solució del problema original.

Qualsevol algorisme basat en aquest paradigma realitza el treball en tres passos:
1. **Dividir:** Descompondre l'entrada en $a \ge 1$ subproblemes de mida menor (habitualment de mida $n/b$ amb $b > 1$).
2. **Vèncer (recursivament):** Resoldre cadascun dels subproblemes mitjançant crides recursives. Si el subproblema és prou petit (cas base de mida $\mathcal{O}(1)$), es resol directament sense recursió.
3. **Combinar:** Fusionar o acoblar les respostes dels subproblemes per obtenir la solució global.

```text
               ┌─────────────────────────────┐
               │ Problema original (mida n)  │
               └──────────────┬──────────────┘
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
1.     │Subproblema 1│ │Subproblema 2│ │Subproblema a│  Dividir: T_divisio(n)
       │  mida n/b   │ │  mida n/b   │ │  mida n/b   │
       └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
              │ (rec)         │ (rec)         │ (rec)
              ▼               ▼               ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
2.     │  Solució 1  │ │  Solució 2  │ │  Solució a  │  Vèncer: a · T(n/b)
       └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
              └───────────────┼───────────────┘
                              ▼
               ┌─────────────────────────────┐
3.             │   Solució global combinada  │          Combinar: T_combinar(n)
               └─────────────────────────────┘
```

### Distribució del cost temporal
El cost total d'un algorisme de dividir i vèncer prové exclusivament de tres fonts:

$$
T(n) = \underbrace{T_{\text{divisio}}(n)}_{\text{partir}} + \underbrace{a \cdot T(n/b)}_{\text{crides recursives}} + \underbrace{T_{\text{combinar}}(n)}_{\text{fusió/acoblament}}
$$

On la feina no recursiva $g(n) = T_{\text{divisio}}(n) + T_{\text{combinar}}(n)$ pertany típicament a $\Theta(n^k)$ per a $k \ge 0$, podent resoldre's mitjançant el **Teorema Mestre de recurrències divisores**.

### Exemple introductori: Cerca binària (dicotòmica)
Donat un vector $A[0 \dots n-1]$ **ordenat**, volem determinar si un element $x$ hi pertany. A cada pas comparem $x$ amb l'element central $A[m]$: si coincideixen hem acabat; si $x < A[m]$, busquem recursivament a la meitat esquerra; si $x > A[m]$, a la meitat dreta.

:::oopviz{simulation="binary_search"}
:::

#### Anàlisi de cost de la cerca binària
El paràmetre de recursió és $n = j - i + 1$. A cada nivell es realitza només **una** crida recursiva ($a = 1$) sobre un subvector de mida meitat ($b = 2$), i el treball no recursiu (càlcul del mig i comparacions) és constant ($g(n) \in \Theta(1) \implies k = 0$).

$$ T(n) = T(n/2) + \Theta(1) $$

Pel Teorema Mestre divisor: $\alpha = \log_b a = \log_2 1 = 0$. Com que $\alpha = k = 0$, tenim:

$$ \mathbf{T(n) \in \Theta(n^0 \log n) = \Theta(\log n)} $$

---

# 2. Ordenació per Fusió (*MergeSort*)

L'algorisme d'**ordenació per fusió** (*MergeSort*), dissenyat per John von Neumann l'any 1945, és l'exemple paradigmàtic de dividir i vèncer on la partició és trivial i tot el pes computacional recau en la combinació.

### Propietats fonamentals
- **Cota de comparacions òptima:** Realitza un nombre de comparacions asimptòticament òptim ($\Theta(n \log n)$), molt proper a la cota inferior teòrica $\lceil \log_2(n!) \rceil$.
- **Insensible a l'ordre de l'entrada:** A diferència d'algorismes com la inserció o el quicksort, el seu rendiment no depèn de si el vector d'entrada està ordenat, invertit o desordenat; el seu cost és sempre $\mathbf{\Theta(n \log n)}$.
- **Estabilitat:** És un algorisme **estable**, és a dir, preserva rigorosament l'ordre relatiu original dels elements amb claus idèntiques.

### Estabilitat d'un algorisme d'ordenació
Un algorisme d'ordenació és **estable** si dos elements $x$ i $y$ amb la mateixa clau d'ordenació ($x = y$) que apareixen inicialment en l'ordre $\dots x \dots y \dots$ conserven la mateixa posició relativa en la sortida final: $x$ sempre precedirà $y$.  
*Importància pràctica (ordenació multicriteri):* Permet ordenar conjunts de dades complexos segons múltiples criteris successius ordenant primer pel criteri menys prioritari i posteriorment pel criteri principal usant un algorisme estable.

#### Exemple pas a pas d'ordenació multicriteri:
1. **Entrada inicial:**
   $$\langle 6, 7 \rangle,\; \langle 3, 2 \rangle,\; \langle 1, 4 \rangle,\; \langle 3, 1 \rangle,\; \langle 1, 6 \rangle,\; \langle 4, 7 \rangle$$
2. **1. Ordenar per la 2a component:**
   $$\langle 3, \mathbf{1} \rangle,\; \langle 3, \mathbf{2} \rangle,\; \langle 1, \mathbf{4} \rangle,\; \langle 1, \mathbf{6} \rangle,\; \langle 6, \mathbf{7} \rangle,\; \langle 4, \mathbf{7} \rangle$$
3. **2. Ordenació estable per la 1a component:**
   $$\langle \mathbf{1}, 4 \rangle,\; \langle \mathbf{1}, 6 \rangle,\; \langle \mathbf{3}, 1 \rangle,\; \langle \mathbf{3}, 2 \rangle,\; \langle \mathbf{4}, 7 \rangle,\; \langle \mathbf{6}, 7 \rangle$$
   - En empat de clau $1$, manté $\langle 1, 4 \rangle$ abans de $\langle 1, 6 \rangle$ perquè $4 < 6$.
   - En empat de clau $3$, manté $\langle 3, 1 \rangle$ abans de $\langle 3, 2 \rangle$ perquè $1 < 2$.
   - En empat de clau $7$, manté $\langle 4, 7 \rangle$ abans de $\langle 6, 7 \rangle$.

---

### Esquema general i implementació recursiva
Per no duplicar memòria durant les divisions, l'algorisme opera sobre el mateix vector $T$ delimitat per dos índexs: $e$ (*esquerra*) i $d$ (*dreta*).
1. Si $e \ge d$, el subvector té $0$ o $1$ elements; per definició ja està ordenat (cas base amagat).
2. Si $e < d$, calculem el punt mitjà $m = (e + d) / 2$.
3. Cridem recursivament per ordenar la primera meitat: $T[e \dots m]$.
4. Cridem recursivament per ordenar la segona meitat: $T[m+1 \dots d]$.
5. Fusionem les dues meitats ordenades mitjançant l'operació clau `merge(T, e, m, d)`.

:::oopviz{simulation="mergesort"}
:::

### L'operació de fusió (`merge`) i la necessitat de memòria auxiliar
El cor de l'algorisme és combinar dos subvectors ordenats contigus $T[e \dots m]$ i $T[m+1 \dots d]$ en un únic subvector ordenat a $T[e \dots d]$.  
**Per què no es pot fer la fusió *in-place* al mateix vector $T$?**  
Si intentem comparar els elements apuntats per l'esquerra i la dreta i escriure el més petit directament a la posició inicial de $T$, sobreescrivim un element original no processat encara, perdent-lo per sempre. Si intentem intercanviar-lo cap a una altra posició, destruïm l'ordre del subvector restant. Fer una fusió *in-place* requereix desplaçaments continus que eleven el cost a $\Theta(n^2)$ o una complexitat algorísmica impràctica. Per tant, **és imprescindible utilitzar un vector auxiliar $B$ de mida exacta $d - e + 1$**.

```text
1. Subvector original T[e..d] (mida: d - e + 1 elements):
   T: [ 8 | 7 | 2 | 4 | 6 | 1 | 1 | 5 ]
        e           m   m+1         d
        │───────────│   │───────────│
            rec               rec

2. Meitats ordenades a T:
   T: [ 2 | 4 | 7 | 8 ] [ 1 | 1 | 5 | 6 ]
        ▲                 ▲
       i=e              j=m+1

3. Fusió ordenada a l'auxiliar B:
   B: [ 1 | 1 | 2 | 4 | 5 | 6 | 7 | 8 ]  (k = 0 ... d-e)

4. Bolcat final de retorn cap a T:
   T[e + k] = B[k]
```

```cpp
template <typename elem>
void merge(vector<elem>& T, int e, int m, int d) {
    vector<elem> B(d - e + 1);
    int i = e, j = m + 1, k = 0;
    while (i <= m and j <= d) {
        if (T[i] <= T[j]) B[k++] = T[i++];
        else B[k++] = T[j++];
    }
    while (i <= m) B[k++] = T[i++];
    while (j <= d) B[k++] = T[j++];
    for (k = 0; k <= d - e; ++k) T[e + k] = B[k];
}
```

#### Punts crítics d'anàlisi de la implementació de `merge`:
1. **Càlcul de la mida del subvector:** Si ordenem des de l'índex $e=2$ fins a $d=6$, el nombre d'elements és $6 - 2 + 1 = 5$. Per tant, la mida de $B$ és sempre $d - e + 1$.
2. **Estabilitat garantida:** La comparació `if (T[i] <= T[j])` és la clau de l'estabilitat. En cas d'empat ($T[i] = T[j]$), sempre s'escull primer l'element de l'esquerra ($T[i]$), preservant l'ordre d'aparició inicial.
3. **Exclusivitat dels bucles residuals:** Després del bucle principal, **exactament un** dels dos punters haurà arribat al final del seu rang. Mai poden quedar tots dos pendents, ni tots dos esgotats alhora, ja que a cada iteració s'incrementa estrictament un sol punter ($i$ o bé $j$).
4. **Desplaçament al bolcat final (*shift*):** L'error més habitual en exàmens és escriure `T[k] = B[k]`. El vector auxiliar $B$ comença sempre a l'índex $0$, però el subvector a $T$ comença a la posició $e$. Per tant, l'assignació correcta és imperativament:
   $$ T[e + k] = B[k] $$
5. **Cost de la fusió:** Després de cada comparació s'afegeix un element a $B$. Per tant, el nombre de comparacions és com a màxim $n - 1$ ($< n = d - e + 1$). Es fan $n$ còpies a $B$ i $n$ còpies de retorn a $T$ ($2n$ assignacions). El cost és estrictament lineal: $\mathbf{\Theta(n)}$.

### Cost asimptòtic total de MergeSort
Com que el procediment `merge` és lineal, el cost d'ordenar $n$ elements compleix la recurrència:

$$ T(1) = \Theta(1), \qquad T(n) = 2T(n/2) + \Theta(n) \quad\text{per a } n > 1 $$

Identifiquem els paràmetres del Teorema Mestre divisor:
- Nombre de crides recursives: $a = 2$.
- Factor de divisió de la mida: $b = 2$.
- Treball no recursiu: $g(n) \in \Theta(n^1) \implies k = 1$.

Calculem l'exponent crític: $\alpha = \log_b a = \log_2 2 = 1$. Com que $\alpha = k = 1$ (empat exacte de treball a tots els nivells de l'arbre recursiu), el cost es multiplica per un factor logarítmic:

$$ \mathbf{T(n) \in \Theta(n \log n)} $$

---

### Variants de l'ordenació per fusió
Hi ha tres variants i millores principals per optimitzar el comportament a la pràctica:

#### 1. Hibridació amb Inserció per a subvectors petits (talla crítica)
Tot i que MergeSort té un cost asimptòtic superior a la Inserció ($\Theta(n \log n)$ vs $\Theta(n^2)$), per a vectors molt petits la inserció és més ràpida a causa de les constants multiplicatives molt baixes i l'absència de gestió de memòria dinàmica. A la pràctica, quan la mida del subvector cau per sota d'un llindar (**talla crítica $\approx 50$**), es talla la recursió i s'ordena amb inserció:

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

*Impacte:* En un vector gran de mida $4000$, la immensa majoria de les crides recursives (les fulles de l'arbre) tindran mida $< 50$. Aquest canvi estalvia milers de crides a `merge` i millora dràsticament el temps d'execució real.

#### 2. MergeSort Iteratiu 1 (TAD Cua de vectors, Dasgupta et al.)
La recursivitat en MergeSort baixa fins a arribar a subvectors de mida $1$, que és on realment comencen les fusions. Podem concebre l'algorisme de baix cap a dalt (*bottom-up*) usant una cua $Q$ de vectors:

```text
Cua Q: [ [7] ] [ [8] ] [ [2] ] [ [4] ] ... [ [2, 4, 7, 8] ] [ [1, 3, 5, 6] ]
         ──┬──   ──┬──
     eject()   eject()
           └───┬───┘
               ▼
       merge -> [7, 8]
               │
               ▼ (inject)
       inject(Q, [7, 8])
```

```text
function mergesort_queue(a[1...n]):
    Q = []  // Cua de vectors inicialitzada buida
    for i = 1 to n:
        inject(Q, [a[i]])  // Encua cada element com un vector unitari ordenat
    while |Q| > 1:
        inject(Q, merge(eject(Q), eject(Q)))
    return eject(Q)
```

#### 3. MergeSort Iteratiu 2 (*Bottom-up* en C++)
Evita la cua fusionant blocs de mida creixent directament sobre el vector: primer blocs de mida $m = 1$, després $m = 2, 4, 8 \dots$ doblant la mida a cada etapa:

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

# 3. Ordenació Ràpida (*QuickSort*)

Inventat per Sir Charles Antony Richard Hoare (Tony Hoare) l'any 1960 (guardonat amb el **Premi Turing el 1980**), **QuickSort** és l'algorisme d'ordenació genèric per excel·lència. Tot i que en el cas pitjor assoleix un cost quadràtic $\Theta(n^2)$, el seu cas mitjà és $\Theta(n \log n)$ i l'extraordinària eficiència del seu bucle intern el converteix en el més ràpid a la pràctica.

### Esquema dels 4 passos
Donat un vector $T$ de mida $\ge 2$:
1. **Triar un pivot:** Seleccionar un element $x \in T$.
2. **Partició:** Reorganitzar $T$ en dos blocs contigus: $T_1$ amb elements $\le x$, i $T_2$ amb elements $\ge x$.
3. **Vèncer (recursivament):** Ordenar recursivament $T_1$ i $T_2$.
4. **Combinar:** Retornar $T_1$ seguit de $T_2$. **No requereix cap feina ($\Theta(1)$)!**

```text
Vector T:           [ 8 | 7 | 2 | 4 | 6 | 3 | 1 | 5 ]    (Pivot triat: x = 3)
Partició Θ(n):      [ 2 | 3 | 1 ]           [ 8 | 7 | 4 | 6 | 5 ]
                    (elements <= 3)         (elements > 3)
Recursió (rec):     [ 1 | 2 | 3 ]           [ 4 | 5 | 6 | 7 | 8 ]
Combinació Θ(1):    [ 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ]
                    (Combinació gratuïta per transitivitat, vector ja ordenat)
```

### Dualitat i comparació: MergeSort vs QuickSort
MergeSort i QuickSort són algorismes duals i simètricament oposats:

| Característica | Ordenació per fusió (MergeSort) | Ordenació ràpida (QuickSort) |
| :--- | :--- | :--- |
| **Fase de Divisió** | Directa i trivial ($\Theta(1)$, només índexs) | Complexa i acurada ($\Theta(n)$, partició per pivot) |
| **Mida dels subproblemes** | Sempre idèntica ($n/2$) | Variable (depèn de l'element pivot triat) |
| **Fase de Combinació** | Complexa i acurada ($\Theta(n)$, `merge`) | Directa i gratuïta ($\Theta(1)$, ja concatenat) |
| **Ús de memòria auxiliar** | Requereix vector auxiliar $\Theta(n)$ | ***In-place*** sobre el propi vector ($\Theta(1)$ extra) |
| **Estabilitat** | **Estable** | **No estable** (els intercanvis creuats trenquen l'ordre) |
| **Cost en cas pitjor** | $\Theta(n \log n)$ | $\Theta(n^2)$ |
| **Cost en cas mitjà** | $\Theta(n \log n)$ | $\Theta(n \log n)$ (amb constants molt menors) |

---

### Partició de Hoare *in-place*
La partició clàssica de Hoare opera sense cap vector auxiliar. Utilitza dos punters: $i$ (que avança des de l'esquerra buscant elements que haurien d'anar a la dreta, és a dir, $\ge x$) i $j$ (que avança des de la dreta buscant elements $\le x$). Quan tots dos s'aturen, s'intercanvien amb `swap` i continuen acostant-se fins a creuar-se ($i \ge j$).

```text
Estat inicial:    [ 3 | 7 | 2 | 4 | 6 | 8 | 1 | 5 ]    (pivot x = 3 a la posició e)
                    ▲                       ▲
                   i ->                    <- j
                   (atura a T[i] >= x)     (atura a T[j] <= x)

Intercanvi:       swap(T[i], T[j])

Estat final:      [ 1 | 2 ] ┃ [ 7 | 4 | 6 | 8 | 3 | 5 ]
                  (<= x)    ┃ (>= x)
                            ▲
                            Retorn de j (tall de partició)
```

:::oopviz{simulation="quicksort"}
:::

#### Detalls tècnics de la partició de Hoare:
- **Punters fora de rang i pre-operadors:** S'inicialitzen $i = e - 1$ i $j = d + 1$. Com que s'utilitzen pre-decrements (`--j`) i pre-increments (`++i`), a la primera avaluació els punters apunten exactament als extrems $d$ i $e$.
- **Postcondició:** Garanteix que en retornar $q = j$, per a tot $i \in [e \dots q]$ tenim $T[i] \le x$, i per a tot $i \in [q+1 \dots d]$ tenim $T[i] \ge x$.
- **Cost de partició:** Cada element es visita una sola vegada pels punters i es fan com a màxim $n/2$ `swaps`. Temps estrictament lineal $\mathbf{\Theta(n)}$ i memòria $\mathbf{\Theta(1)}$.

---

### Estratègies d'elecció del pivot
Com que la partició de Hoare assumeix que el pivot es troba a la posició $T[e]$, qualsevol estratègia alternativa selecciona un pivot i l'intercanvia inicialment amb $T[e]$:

1. **Primer element ($x = T[e]$):** Simple, però altament vulnerable. Si l'entrada ja està ordenada o invertida, el pivot és sempre el mínim o el màxim, provocant el cas pitjor $\Theta(n^2)$ per no fer cap feina!
2. **Pivot aleatori (*Randomized QuickSort*):** Tria $p = \texttt{randint(e, d)}$ i fa `swap(T[e], T[p])`. Trenca qualsevol patró maliciós d'entrada i garanteix el comportament mitjà esperat de forma independent a les dades. Inconvenient: la generació de nombres pseudoaleatoris té un cost temporal notable.
3. **Mediana de tres elements:** Selecciona el primer ($T[e]$), el del mig ($T[(e+d)/2]$) i l'últim ($T[d]$), i els ordena amb $3$ comparacions/`swaps` col·locant la mediana a $T[e]$:
   ```cpp
   int centre = (e + d) / 2;
   if (T[e] < T[centre]) swap(T[centre], T[e]);
   if (T[d] < T[centre]) swap(T[centre], T[d]);
   if (T[d] < T[e]) swap(T[e], T[d]);
   // La mediana queda a T[e]
   ```
   Garanteix que el pivot mai no serà ni el mínim ni el màxim absolut de tot el vector.
4. **Hibridació amb Inserció per a vectors petits:** Quan $d - e < 20$, s'atura la recursió i s'ordena per inserció (`talla_critica = 20`).

---

### Anàlisi de complexitat de QuickSort
Sigui $i$ el nombre d'elements que cauen a la primera meitat ($1 \le i \le n - 1$). La recurrència general és:

$$ T(n) = T(i) + T(n - i) + \Theta(n) $$

- **Cas pitjor (desequilibri màxim, $i = 1$ o $i = n - 1$):**  
  Ocorre quan el pivot és sempre el mínim o el màxim:
  $$ T(n) = T(1) + T(n - 1) + \Theta(n) = T(n - 1) + \Theta(n) \implies \mathbf{T(n) \in \Theta(n^2)} $$
- **Cas millor (equilibri perfecte, $i = n/2$):**  
  Ocorre si el pivot divideix sempre el vector exactament per la meitat (com faria la mediana exacta):
  $$ T(n) = 2T(n/2) + \Theta(n) \implies \mathbf{T(n) \in \Theta(n \log n)} $$

> **Deducció formal del cost en cas mitjà de QuickSort:**  
> Suposem que totes les permutacions d'entrada són equiprobables, de manera que la mida del primer subvector $i$ pot ser qualsevol valor de $\{1, 2, \dots, n-1\}$ amb la mateixa probabilitat $\frac{1}{n-1}$.  
> Hi ha $n-1$ configuracions possibles de partició:
> $$ (1, n-1), \; (2, n-2), \; (3, n-3), \; \dots, \; (n-2, 2), \; (n-1, 1) $$
> El cost mitjà $\bar{T}(n)$ és l'esperança matemàtica:
> $$ \bar{T}(n) = \sum_{i=1}^{n-1} \frac{1}{n-1} [ T(i) + T(n - i) + cn ] $$
> Separant el sumatori:
> $$ \bar{T}(n) = \frac{1}{n-1} \sum_{i=1}^{n-1} [ T(i) + T(n - i) ] + \sum_{i=1}^{n-1} \frac{cn}{n-1} = \frac{1}{n-1} \sum_{i=1}^{n-1} [ T(i) + T(n - i) ] + cn $$
> **Propietat de simetria (d'on prové el factor 2):** En la suma $\sum_{i=1}^{n-1} [T(i) + T(n-i)]$, cada terme $T(j)$ apareix exactament dues vegades (un cop com a $T(i)$ i un cop com a $T(n-i)$ en l'ordre invers). Per tant:
> $$ (1) \quad \bar{T}(n) = \frac{2}{n-1} \sum_{j=1}^{n-1} T(j) + cn $$
> Multipliquem l'equació (1) per $n - 1$:
> $$ (2) \quad (n - 1)\bar{T}(n) = 2 \sum_{j=1}^{n-1} T(j) + cn(n - 1) $$
> Escrivim la mateixa relació per al cas $n + 1$:
> $$ (3) \quad n \bar{T}(n + 1) = 2 \sum_{j=1}^n T(j) + c(n + 1)n $$
> Restem l'equació (2) de la (3) per cancel·lar el sumatori:
> $$ n \bar{T}(n + 1) - (n - 1)\bar{T}(n) = 2 T(n) + 2cn $$
> Reordenant termes:
> $$ (4) \quad n \bar{T}(n + 1) = (n + 1)\bar{T}(n) + 2cn $$
> Dividim l'equació (4) per $n(n + 1)$:
> $$ \frac{\bar{T}(n + 1)}{n + 1} = \frac{\bar{T}(n)}{n} + \frac{2c}{n + 1} $$
> Substituïm recursivament per a tots els valors de $n-1$ fins a $1$, obtenint un sumatori telescòpic on els termes intermedis es cancel·len creuadament:
> $$ \frac{\bar{T}(n)}{n} = \frac{T(1)}{1} + 2c \sum_{i=2}^n \frac{1}{i} $$
> Sabem pel càlcul infinitesimal que la sèrie harmònica compleix $\sum_{i=2}^n \frac{1}{i} = \ln(n) + \gamma - 1$, on $\gamma \approx 0.577$ és la constant d'Euler-Mascheroni. Per tant:
> $$ \frac{\bar{T}(n)}{n} \in \Theta(\log n) \implies \mathbf{\bar{T}(n) \in \Theta(n \log n)} $$

---

### Per què QuickSort és més ràpid que MergeSort a la pràctica? (Arquitectura)
Tot i que asimptòticament ambdós algorismes tenen cost $\Theta(n \log n)$, a la pràctica QuickSort és entre $2$ i $3$ vegades més ràpid que MergeSort. La raó no és asimptòtica, sinó d'**arquitectura de computadors**:

| Nivell de memòria | Temps d'accés típic | Lentitud relativa respecte a registres |
| :--- | :--- | :--- |
| **Registres de CPU** | $< 0.5 \text{ ns}$ | $1\times$ |
| **Memòria Cau L1** | $\sim 1 \text{ ns}$ | $2\times$ |
| **Memòria Cau L2** | $\sim 7 \text{ ns}$ | $14\times$ |
| **Memòria Cau L3** | $\sim 20 \text{ ns}$ | $40\times$ |
| **Memòria Principal (RAM)** | $\sim 100 \text{ ns}$ | **$200\times$ més lenta!** |

- **Localitat espacial i *Cache Misses*:** La partició de Hoare treballa *in-place* recorrent el vector de manera seqüencial des dels extrems cap al centre. Quan es carrega un bloc de dades a la memòria cau L1/L2, les següents desenes d'accessos són immediats.
- **Absència d'al·locació dinàmica:** MergeSort ha de demanar contínuament memòria al sistema operatiu per al vector auxiliar $B$ a cada crida de fusió. Això no només afegeix una sobrecàrrega de gestió de memòria, sinó que fragmenta les adreces i provoca constants caigudes de memòria cau (*cache misses*), havent d'esperar centenars de cicles de rellotge a la RAM.

---

# 4. Productes i Exponents: Exponenciació Ràpida

El càlcul de potències enteres $x^n$ és una altra aplicació fonamental on l'estratègia de dividir i vèncer permet reduir el cost de polinòmic lineal a logarítmic.

### Algorisme ingenu vs Enfocament recursiu
L'algorisme iteratiu evident realitza $n - 1$ multiplicacions successives mitjançant un bucle `for`:

$$ x^n = \underbrace{x \cdot x \cdots x}_{n \text{ factors}} \implies \Theta(n) \text{ multiplicacions} $$

Mitjançant dividir i vèncer, podem aprofitar que si coneixem $x^{n/2}$, podem obtenir $x^n$ amb una sola multiplicació addicional elevant-lo al quadrat:

$$
x^n = \begin{cases} 
1, & \text{si } n = 0 \quad\text{(cas base)} \\ 
\left(x^{n/2}\right)^2, & \text{si } n \text{ és parell} \\ 
\left(x^{(n-1)/2}\right)^2 \cdot x, & \text{si } n \text{ és senar} 
\end{cases}
$$

```text
x^24 = (x^12)^2         ── 1 multiplicació (y · y)
  │
  ▼
x^12 = (x^6)^2          ── 1 multiplicació (y · y)
  │
  ▼
x^6  = (x^3)^2          ── 1 multiplicació (y · y)
  │
  ▼
x^3  = (x^1)^2 · x      ── 2 multiplicacions (y · y · x)
  │
  ▼
x^1  = (x^0)^2 · x      ── 2 multiplicacions (y · y · x)
  │
  ▼
x^0  = 1                ── Cas base (Θ(1))

Alçada de l'arbre: log₂ n nivells
Feina per nivell:  Θ(1) multiplicacions
Cost total:        Θ(log n)
```

:::oopviz{simulation="fast_power"}
:::

### Anàlisi de cost i parany habitual d'examen
> **Parany habitual:** Escriure `return potencia(x, n/2) * potencia(x, n/2);`. En aquest cas es farien $a = 2$ crides recursives, resultant en $T(n) = 2T(n/2) + \Theta(1) \implies \Theta(n)$, perdent completament l'avantatge algorísmic!

Emmagatzemant el resultat a la variable local `double y`, només es realitza **una sola crida recursiva**:
- Nombre de crides: $a = 1$.
- Factor de divisió de l'exponent: $b = 2$.
- Treball no recursiu: comprovació, mòdul i $1$ o $2$ multiplicacions $\implies g(n) \in \Theta(1) \implies k = 0$.

Recurrència:
$$ T(n) = T(n/2) + \Theta(1) $$

Pel Teorema Mestre divisor: $\alpha = \log_2 1 = 0 = k \implies \mathbf{T(n) \in \Theta(\log n)}$.

*Aplicacions transcendents:* Exponenciació de matrius per calcular el $n$-èssim nombre de Fibonacci en temps $\Theta(\log n)$ (multiplicant la matriu $\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$), aritmètica modular en xifratge de clau pública RSA, i transformades ràpides.
