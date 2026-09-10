---
title: "Tema 1: Anàlisi d'Algorismes"
description: "Eficiència algorísmica, notació asimptòtica (O, Ω, Θ), anàlisi iteratiu i recursiu, Teoremes Mestres, Fibonacci logarítmic i fites inferiors d'ordenació."
readTime: "20 min"
order: 1
draft: true
---

## 1. Eficiència dels Algorismes i Mida de l'Entrada

### Per què no mesurem segons de rellotge?
Mesurar el temps d'execució d'un programa en segons amb un cronòmetre no és útil per comparar algorismes:
- El temps en segons depèn de factors físics: la velocitat de la CPU, la memòria cau, les optimitzacions del compilador o el llenguatge (C++ vs Python).
- Tots aquests factors només aporten una **millora constant multiplicativa ($c$)**: un ordinador el doble de ràpid farà la feina en la meitat de temps, però **mai convertirà un algorisme inviable en un de viable**.

A EDA avaluem el cost temporal $T(n)$ i espacial $S(n)$ de forma matemàtica en funció de la **mida de l'entrada ($n$)** (no és el mateix ordenar 10 elements que 10 mil·lions), de manera completament independent de la màquina on s'executi.

Imaginem aquest experiment: **Tenim un temps límit fix (per exemple, 1 hora de càlcul)**.
- Amb el nostre ordinador actual, podem resoldre un problema d'una mida màxima $N$ en 1 hora.
- Si comprem un ordinador **$1.000$ vegades més ràpid**, quina mida màxima d'entrada podrem processar en aquesta mateixa hora?

| Complexitat | Relació en 1 hora de càlcul | Mida resoluble amb CPU $\times 1000$ | Conclusió pràctica |
| :--- | :--- | :---: | :--- |
| **Lineal** $\Theta(n)$ | $\frac{N'}{1000} = N \implies N' = 1000 \cdot N$ | **$1000 \cdot N$** | Processem **1.000 vegades més dades**. |
| **Quadràtic** $\Theta(n^2)$ | $\frac{(N')^2}{1000} = N^2 \implies N' = \sqrt{1000} \cdot N$ | **$\approx 31.6 \cdot N$** | El guany s'esmorteix molt (només $\approx 31$ vegades més). |
| **Exponencial** $\Theta(2^n)$ | $\frac{2^{N'}}{1000} = 2^N \implies 2^{N'} = 1000 \cdot 2^N$ | **$N + \log_2(1000) \approx N + 10$** | **Només podem resoldre 10 elements més!** |

Si l'algorisme és exponencial ($2^n$), comprar un supercomputador 1.000 vegades més potent només et permetrà augmentar la mida del problema en 10 dades més abans d'esgotar el temps. La potència bruta no soluciona una mala complexitat algorísmica.

---

### Mida de l'entrada ($n$)
El cost temporal $T(n)$ i espacial $S(n)$ s'expressa sempre com una funció de la **mida de l'entrada**:
- En vectors, llistes o cadenes de caràcters: $n$ és el **nombre d'elements** o caràcters.
- En grafs: la mida es descriu mitjançant dues variables: el nombre de vèrtexs ($|V|$) i el nombre d'arestes ($|E|$).
- En operacions aritmètiques sobre nombres enters grans: $n$ és el **nombre de bits** necessaris per codificar el nombre:
  $$n = \lfloor \log_2(x) \rfloor + 1$$

### Cas Pitjor, Cas Millor i Cas Mitjà
Per a una mateixa mida $n$, dues entrades diferents poden trigar temps molt dispars (per exemple, cercar un valor que és a la primera casella vs un que no hi és):
- **Cas Pitjor ($T_{\text{pitjor}}(n)$)**: És el màxim temps possible sobre qualsevol entrada de mida $n$. **Aquest és l'estàndard que farem servir sempre a EDA i als exàmens**, ja que ofereix una garantia matemàtica absoluta (fita superior segura).
- **Cas Millor ($T_{\text{millor}}(n)$)**: El mínim temps possible. Sol ser enganyós i poc útil (un algorisme dolent de cerca pot trobar l'element al primer intent per pura casualitat).
- **Cas Mitjà ($T_{\text{mitjà}}(n)$)**: L'esperança matemàtica ponderada per la probabilitat de cada entrada:
  $$T_{\text{mitjà}}(n) = \sum_{I} P(I) \cdot T(I)$$
  Tot i ser molt interessant a la pràctica, requereix conèixer la distribució estadística de les dades del món real, cosa que sovint no tenim.

---

## 2. Dos Exemples Clàssics: Quan la Intuïció ens Enganya

### Exemple 1: El problema de selecció ($k$-èsim element més gran)
Tenim un vector desordenat de mida $n$ i volem trobar el $k$-èsim element més gran. Com ho resolem?

- **Estratègia A (Força bruta ordenada)**: Ordenem tot el vector de més gran a més petit amb un algorisme eficient com Mergesort o `std::sort` ($\mathcal{O}(n \log n)$), i retornem la posició $k-1$.
  $$\text{Cost A} = \mathcal{O}(n \log n)$$
- **Estratègia B (Finestra dels $k$ millors)**: Guardem només els $k$ primers elements ordenats en memòria. Per a cadascun dels $n-k$ elements restants, mirem si és més gran que el menor d'aquests $k$. Si ho és, l'inserim al seu lloc i descartem el més petit.
  $$\text{Cost B} = \mathcal{O}(k \cdot n)$$

Quin mètode és millor? **Depèn de quant valgui $k$ en funció de $n$!**
- Si busquem un $k$ constant i petit (ex: el 3r més gran, $k = 3$):
  - Mètode A: $\mathcal{O}(n \log n)$
  - Mètode B: $\mathcal{O}(3 \cdot n) = \mathcal{O}(n)$ $\implies$ **Guanya clarament el Mètode B (lineal)**.
- Si busquem la **mediana** ($k = n/2$):
  - Mètode A: $\mathcal{O}(n \log n)$
  - Mètode B: $\mathcal{O}\left(\frac{n}{2} \cdot n\right) = \mathcal{O}(n^2)$ $\implies$ **El Mètode A és infinitament superior (quasilineal vs quadràtic)**.

---

### Exemple 2: El mur infinit (Cerca en la foscor)
Imagina que ets de nit davant d'un mur rectilini infinit i saps que hi ha una porta a una distància desconeguda $n$ de la teva posició inicial (pot estar a l'esquerra o a la dreta). Portes una espelma que només il·lumina el punt exacte on ets. Quina estratègia segueixes per trobar la porta?

- **Estratègia 1 (Progressió aritmètica)**: Camines $1$ metre a la dreta i tornes al punt d'origen. Després $2$ a l'esquerra i tornes. Després $3$ a la dreta i tornes...
  - Distància recorreguda:
    $$2 \cdot 1 + 2 \cdot 2 + 2 \cdot 3 + \dots + 2 \cdot n \approx 2 \sum_{i=1}^n i = 2 \cdot \frac{n(n+1)}{2} = \Theta(n^2)$$
- **Estratègia 2 (Progressió geomètrica / Doblar distància)**: Camines $1$ metre a la dreta i tornes. Després $2$ a l'esquerra i tornes. Després $4$ a la dreta i tornes. Després $8$ a l'esquerra i tornes... Doblem la distància a cada pas!
  - Si la porta és a distància $n$, ens aturarem quan la distància explorada $2^k \ge n$, és a dir $k \approx \lceil \log_2 n \rceil$.
  - Gràcies a la suma d'una progressió geomètrica:
    $$\sum_{i=0}^k 2^i = 2^{k+1} - 1 \le 4n = \Theta(n)$$

:::tip{title="Conclusió sorprenent"}
Encara que a l'Estratègia 2 sembla que caminem "molt més lluny en la direcció equivocada", en realitat passem d'un cost quadràtic $\Theta(n^2)$ a un cost **lineal $\Theta(n)$**! Un canvi subtil d'estratègia fa l'algorisme exponencialment més eficient.
:::

---

## 3. Notació Asimptòtica Formal: $\mathcal{O}$, $\Omega$ i $\Theta$

La notació asimptòtica descriu el comportament límit d'una funció quan la mida de l'entrada creix cap a l'infinit ($n \to \infty$), ignorant constants multiplicatives i termes d'ordre inferior.

```
            Cost
             ^
             |             /  c2 * g(n)  [Fita superior]
             |            /
             |           /   f(n)        [Funció real]
             |          /
             |         /    c1 * g(n)  [Fita inferior]
             |        /
             +-------+----------------------------> Mida (n)
                     n0
```

### 1. Fita Superior: Notació O Gran ($\mathcal{O}$)
Diem que $f(n) \in \mathcal{O}(g(n))$ si $f$ no creix més ràpidament que $g$. És una cota superior:
$$\exists \, c > 0, \, n_0 > 0 \quad \text{tal que} \quad \forall n \ge n_0, \quad 0 \le f(n) \le c \cdot g(n)$$

### 2. Fita Inferior: Notació Omega ($\Omega$)
Diem que $f(n) \in \Omega(g(n))$ si $f$ creix almenys tan ràpidament com $g$. És una cota inferior:
$$\exists \, c > 0, \, n_0 > 0 \quad \text{tal que} \quad \forall n \ge n_0, \quad 0 \le c \cdot g(n) \le f(n)$$

### 3. Fita Exacta: Notació Theta ($\Theta$)
Diem que $f(n) \in \Theta(g(n))$ si $f$ i $g$ tenen exactament el mateix ordre de magnitud:
$$\exists \, c_1, c_2 > 0, \, n_0 > 0 \quad \text{tal que} \quad \forall n \ge n_0, \quad c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$$

$$\mathbf{f(n) \in \Theta(g(n)) \iff f(n) \in \mathcal{O}(g(n)) \quad \text{i} \quad f(n) \in \Omega(g(n))}$$

---

### El Mètode dels Límits (Eina pràctica d'examen)
Per comparar dues funcions positives $f(n)$ i $g(n)$, el mètode més ràpid i fiable és calcular el límit del seu quocient quan $n \to \infty$:

$$L = \lim_{n \to \infty} \frac{f(n)}{g(n)}$$

| Valor del límit $L$ | Relació asimptòtica | Significat intuïtiu |
| :--- | :--- | :--- |
| **$L = 0$** | $f \in \mathcal{O}(g)$ i $f \notin \Theta(g)$ | $g(n)$ creix estrictament més ràpid que $f(n)$. |
| **$0 < L < \infty$** | **$f \in \Theta(g)$** (i per tant $f \in \mathcal{O}(g)$ i $f \in \Omega(g)$) | Ambdues funcions creixen al mateix ritme asimptòtic. |
| **$L = \infty$** | $f \in \Omega(g)$ i $f \notin \Theta(g)$ | $f(n)$ creix estrictament més ràpid que $g(n)$. |

*Recordatori de Càlcul*: Si obtenim una indeterminació $\left[\frac{\infty}{\infty}\right]$, podem aplicar la **Regla de L'Hôpital** derivant numerador i denominador respecte a $n$.

---

### Propietats Algebraiques
- **Regla de la Suma (Terme dominant)**:
  $$\mathcal{O}(f_1(n)) + \mathcal{O}(f_2(n)) = \mathcal{O}(\max(f_1(n), f_2(n)))$$
  *Exemple*: Si un programa fa una inicialització en $3n^2$ i després un bucle de $5n$, el cost total és $\mathcal{O}(n^2 + n) = \mathcal{O}(n^2)$.
- **Regla del Producte**:
  $$\mathcal{O}(f_1(n)) \cdot \mathcal{O}(f_2(n)) = \mathcal{O}(f_1(n) \cdot f_2(n))$$
  *Exemple*: Un bucle de $n$ iteracions que a l'interior crida una funció de cost $\mathcal{O}(\log n)$ té un cost global de $\mathcal{O}(n \log n)$.
- **Polinomis**: Només importa el terme de major grau:
  $$a_k n^k + a_{k-1} n^{k-1} + \dots + a_0 = \Theta(n^k) \quad (\text{amb } a_k > 0)$$
- **Logaritmes**: La base del logaritme és irrellevant asimptòticament:
  $$\log_a(n) = \frac{\log_b(n)}{\log_b(a)} = \Theta(\log_b(n))$$
  Per això a informàtica escrivim simplement $\Theta(\log n)$.

---

### Jerarquia Fonamental de Creixement
Aquesta escala és **imprescindible** per als exàmens parcials i finals. Està ordenada de menor a major ritme de creixement:

$$\Theta(1) < \Theta(\log \log n) < \Theta(\log n) < \Theta(\sqrt{n}) < \Theta(n) < \Theta(n \log n) < \Theta(n^2) < \Theta(n^3) < \Theta(2^n) < \Theta(3^{n/2}) < \Theta(n!) < \Theta(n^n) < \Theta(2^{n^2})$$

:::tip{title="Focus d'Examen: Trampes habituals en comparació de funcions"}
Als exàmens de la FIB sempre demanen ordenar funcions complexes. Tingues molt presents aquests trucs:
1. **Bases i exponents variables**:
   $$3^{n/2} = \left(\sqrt{3}\right)^n \approx (1.732)^n \implies \mathbf{3^{n/2} \in \mathcal{O}(2^n)}$$
   Com que $1.732 < 2$, $3^{n/2}$ creix estrictament més a poc a poc que $2^n$!
2. **Propietats dels logaritmes**:
   $$n \log(n^2) = 2 n \log n = \Theta(n \log n)$$
   $$\log(n^c) = c \log n = \Theta(\log n)$$
   Però compte amb $(\log n)^2 \neq \log(n^2)$! $(\log n)^2$ creix més ràpid que $\log n$, però molt menys que qualsevol potència polinòmica com $n^{0.1}$.
3. **Constants a l'exponent**:
   $$2^{n-10} = 2^{-10} \cdot 2^n = \frac{1}{1024} 2^n \implies \mathbf{\Theta(2^n)}$$
   En canvi:
   $$2^{2n} = (2^2)^n = 4^n \implies \mathbf{2^{2n} \notin \mathcal{O}(2^n)}$$
4. **La fórmula de Stirling per a factorials**:
   $$n! \approx \sqrt{2\pi n} \left(\frac{n}{e}\right)^n \implies \log(n!) = \Theta(n \log n)$$
   Per tant, $n!$ creix molt més ràpid que qualsevol exponencial constant $c^n$, però més a poc a poc que $n^n$.
:::

---

## 4. Anàlisi d'Algorismes Iteratius (No Recursius)

Per calcular el cost d'un codi imperatiu apliquem regles compositives clares:
- **Operacions bàsiques**: Assignacions, comparacions, operacions aritmètiques simples i accessos a taules per índex costen $\Theta(1)$.
- **Composició seqüencial**: Se sumen els costos de les instruccions.
- **Condicionals (`if-else`)**:
  $$\text{Cost} \le \text{Cost(Condició)} + \max(\text{Cost(Branca If)}, \text{Cost(Branca Else)})$$
- **Bucles (`while`, `for`)**: Sumatori del cost de la condició més el cos per a cada iteració.

:::warning{title="Alerta C++ a EDA: La trampa del pas per valor"}
Un error clàssic que penalitza en exàmens i al Jutge és passar estructures per valor:
```cpp
// MALAMENT: Es copia tot el vector a cada crida -> Cost O(n)
void processar(vector<int> v);

// CORRECTE: Pas per referència constant -> Cost O(1)
void processar(const vector<int>& v);
```
Si una funció amb cost intern $\mathcal{O}(1)$ rep un `vector` de mida $n$ per valor dins d'un bucle de $n$ iteracions, el teu programa passarà automàticament de ser lineal $\mathcal{O}(n)$ a ser quadràtic $\mathcal{O}(n^2)$!
:::

---

### Cas d'Estudi: Comparació d'Algorismes d'Ordenació Iteratius

#### 1. Ordenació per Selecció (Selection Sort)
Cerca l'element més petit i l'intercanvia amb la primera posició; després el segon més petit, etc.

```cpp [selection_sort.cpp]
void selectionSort(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; ++i) {
        int min_idx = i;
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[min_idx]) min_idx = j;
        }
        swap(a[i], a[min_idx]);
    }
}
```

- El bucle extern itera des de $i = 0$ fins a $n-2$.
- El bucle intern fa $n - 1 - i$ comparacions.
- Nombre total de comparacions:
  $$\sum_{i=0}^{n-2} (n - 1 - i) = (n-1) + (n-2) + \dots + 1 = \frac{n(n-1)}{2} = \mathbf{\Theta(n^2)}$$
- **Tant en el cas millor com en el cas pitjor**, Selection Sort fa exactament les mateixes comparacions. El seu cost és invariablement $\Theta(n^2)$.

---

#### 2. Ordenació per Inserció (Insertion Sort)
Pren cada nou element i el va desplaçant cap a l'esquerra fins a trobar la seva posició correcta entre els elements ja ordenats.

```cpp [insertion_sort.cpp]
void insertionSort(vector<int>& a) {
    int n = a.size();
    for (int i = 1; i < n; ++i) {
        int x = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > x) {
            a[j + 1] = a[j];
            --j;
        }
        a[j + 1] = x;
    }
}
```

- **Cas Millor (Vector ja ordenat)**:
  La condició `a[j] > x` falla a la primera comparació per a cada $i$. El bucle `while` fa només $1$ comparació per iteració:
  $$T_{\text{millor}}(n) = \sum_{i=1}^{n-1} \Theta(1) = \mathbf{\Omega(n)}$$
- **Cas Pitjor (Vector ordenat a la inversa)**:
  L'element $x$ s'ha de desplaçar fins a l'inici en cada pas ($j$ arriba fins a $-1$):
  $$T_{\text{pitjor}}(n) = \sum_{i=1}^{n-1} i = \frac{n(n-1)}{2} = \mathbf{\mathcal{O}(n^2)}$$

:::tip{title="Focus d'Examen: Bucles dependents i sèries freqüents"}
Als exàmens et posaran bucles `while` on les variables no s'incrementen d'un en un:
1. **Variables que es multipliquen**:
   ```cpp
   for (int i = 1; i < n; i *= 2) { /* O(1) */ }
   ```
   Com que $i$ pren valors $1, 2, 4, 8, \dots, 2^k$, el nombre d'iteracions és $k = \lceil \log_2 n \rceil \implies \mathbf{\Theta(\log n)}$.
2. **Sèrie Harmònica (Bucles amb salts variables)**:
   ```cpp
   for (int i = 1; i <= n; ++i) {
       for (int j = 1; j <= n; j += i) {
           // Feina O(1)
       }
   }
   ```
   El bucle intern fa $\frac{n}{i}$ iteracions per a cada $i$. El cost total és:
   $$\sum_{i=1}^n \frac{n}{i} = n \sum_{i=1}^n \frac{1}{i} = n \cdot H_n = n \cdot (\ln n + \gamma) = \mathbf{\Theta(n \log n)}$$
:::

---

## 5. Algorismes Recursius i Teoremes Mestres

Quan una funció es crida a si mateixa, el seu cost temporal es descriu mitjançant una **equació de recurrència**:
- **Cas Base**: Cost per a la mida mínima (típicament $T(0) = \Theta(1)$ o $T(1) = \Theta(1)$).
- **Cas Recursiu**: Expressa $T(n)$ en funció del cost de les subcrides més el treball no recursiu fet a la crida actual.

### Mètode del Desplegament (Unrolling)
Consisteix a anar substituint la recurrència en si mateixa fins a trobar un patró recognoscible:

#### Exemple 1: Cerca Lineal Recursiva (Recurrència Subtractiva)
$$T(n) = T(n-1) + c$$
$$T(n) = [T(n-2) + c] + c = T(n-2) + 2c = \dots = T(1) + (n-1)c = \mathbf{\Theta(n)}$$

#### Exemple 2: Cerca Binària (Recurrència Divisora)
$$T(n) = T(n/2) + c$$
$$T(n) = [T(n/4) + c] + c = T(n/2^2) + 2c = \dots = T(n/2^k) + k \cdot c$$
Com que ens aturem quan $\frac{n}{2^k} = 1 \implies k = \log_2 n$:
$$T(n) = T(1) + c \log_2 n = \mathbf{\Theta(\log n)}$$

---

### Teoremes Mestres (Master Theorem)
Per estalviar-nos desplegar a mà, fem servir dues fórmules generals:

### 1. Teorema Mestre Subtractiu
S'aplica quan el problema es redueix **restant** una quantitat constant $c > 0$:

$$T(n) = a \cdot T(n - c) + \Theta(n^k) \quad \text{amb } a \ge 1, \, c > 0, \, k \ge 0$$

- **Si $a = 1$**: El treball local s'acumula linealment (s'afegeix un grau a la potència):
  $$T(n) = \mathbf{\Theta(n^{k+1})}$$
- **Si $a > 1$**: Les crides es ramifiquen en un arbre que creix exponencialment:
  $$T(n) = \mathbf{\Theta(a^{n/c})}$$

*Exemple*: $T(n) = 2T(n-1) + \Theta(1) \implies a=2, c=1, k=0 \implies T(n) = \Theta(2^n)$.

---

### 2. Teorema Mestre Divisor (Dividir i Vèncer)
S'aplica quan el problema es redueix **dividint** la mida per un factor $b > 1$:

$$T(n) = a \cdot T(n / b) + \Theta(n^k) \quad \text{amb } a \ge 1, \, b > 1, \, k \ge 0$$

On:
- $a$: nombre de subproblemes que resolem recursivament.
- $b$: factor pel qual dividim la mida de l'entrada ($n/b$).
- $k$: exponent del treball no recursiu per dividir el problema i combinar les solucions ($\Theta(n^k)$).

Definim el **paràmetre crític** $\alpha = \log_b(a)$ (que mesura la taxa de ramificació de l'arbre):

| Cas | Condició | Solució $T(n)$ | On es concentra el treball? |
| :--- | :--- | :--- | :--- |
| **Cas 1** | $\mathbf{\alpha > k} \iff a > b^k$ | $\mathbf{\Theta(n^{\alpha}) = \Theta(n^{\log_b a})}$ | A les **fulles** de l'arbre recursiu (domina la ramificació). |
| **Cas 2** | $\mathbf{\alpha = k} \iff a = b^k$ | $\mathbf{\Theta(n^k \log n)}$ | **Equilibrat**: tots els nivells de l'arbre fan exactament el mateix treball. |
| **Cas 3** | $\mathbf{\alpha < k} \iff a < b^k$ | $\mathbf{\Theta(n^k)}$ | A l'**arrel** de l'arbre (domina el cost de combinació inicial). |

---

### Exemple Il·lustratiu: Mergesort (Ordenació per Fusió)
En el Mergesort:
1. Dividim el vector en dues meitats ($b = 2$).
2. Ordenem les dues meitats recursivament ($a = 2$).
3. Fusionem les dues meitats ordenades en temps lineal ($k = 1$, cost $\Theta(n)$).

L'equació de recurrència és:
$$T(n) = 2 \cdot T(n/2) + \Theta(n)$$

Identifiquem els paràmetres:
$$a = 2, \quad b = 2, \quad k = 1$$
$$\alpha = \log_b(a) = \log_2(2) = 1$$

Com que $\alpha = k = 1$ (Cas 2 de l'empat):
$$T(n) = \mathbf{\Theta(n \log n)}$$

:::tip{title="Focus d'Examen: Teoremes Mestres Inversos"}
Als exàmens de teoria d'EDA és típic trobar preguntes on **no et demanen calcular el cost**, sinó trobar els paràmetres $a$ o $b$:
- *"Troba el valor d'$a$ perquè l'algorisme $T(n) = a T(n/3) + \Theta(n^2)$ tingui un cost total de $\Theta(n^2)$."*
  - Resolució: Volem ser al Cas 3 ($\alpha < k$) o Cas 2 ($\alpha = k$). Com que $k = 2$, necessitem $\log_3(a) \le 2 \implies a \le 3^2 = 9$. Per tant, per a qualsevol $1 \le a \le 9$, el cost serà $\mathcal{O}(n^2)$ (amb $a=9$ donant $\Theta(n^2 \log n)$ i $a \le 8$ donant $\Theta(n^2)$).
- *"Compara un algorisme subtractiu $T_1(n) = 2T_1(n-1) + 1$ amb un divisor $T_2(n) = 4T_2(n/2) + n$."*
  - $T_1(n) = \Theta(2^n)$ (exponencial).
  - $T_2(n)$: $\alpha = \log_2(4) = 2 > 1 \implies \Theta(n^2)$ (polinòmic).
  - Encara que $T_2$ fa 4 crides i $T_1$ només 2, dividir per 2 fa que $T_2$ sigui immensament més ràpid que $T_1$.
:::

---

## 6. Cas d'Estudi Avançat: La Successió de Fibonacci

La successió de Fibonacci ($0, 1, 1, 2, 3, 5, 8, 13, \dots$) és el millor exemple històric de com canviar d'enfocament algorísmic pot reduir dràsticament el cost de càlcul.

### 1. Enfocament Recursiu Ingenu: $\Theta(\phi^n)$
```cpp
long long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```
- Recurrència: $T(n) = T(n-1) + T(n-2) + \Theta(1)$.
- L'arbre d'execució repeteix els mateixos càlculs milers de vegades. La solució exacta d'aquesta equació en diferències és:
  $$T(n) = \Theta(\phi^n) \quad \text{on } \phi = \frac{1 + \sqrt{5}}{2} \approx 1.618 \quad (\text{el nombre d'or})$$
- Per a $n = 50$, aquest algorisme fa més de $10^{10}$ operacions (triga minuts/hores).

---

### 2. Enfocament Iteratiu (Programació Dinàmica): $\Theta(n)$
Mantenim només els dos últims valors calculats:

```cpp
long long fibIter(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; ++i) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```
- Cost temporal: **$\Theta(n)$** (un únic bucle).
- Cost espacial: **$\Theta(1)$** (només dues variables).

---

### 3. Enfocament amb Exponenciació de Matrius: $\Theta(\log n)$
Podem expressar la recurrència de Fibonacci en forma matricial:

$$\begin{pmatrix} F_{n+1} \\ F_n \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} F_n \\ F_{n-1} \end{pmatrix}$$

Iterant aquesta multiplicació $n$ vegades obtenim:

$$\begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$$

Com calculem la matriu $M^n$ en temps logarítmic? Utilitzant l'algorisme d'**exponenciació ràpida (Divideix i Vèncer)**:
- Si $n$ és parell: $M^n = (M^{n/2})^2$
- Si $n$ és senar: $M^n = M \cdot M^{n-1}$

```cpp [fibonacci_matrix.cpp]
typedef vector<vector<long long>> Matrix;

Matrix multiply(const Matrix& A, const Matrix& B) {
    Matrix C = {{0, 0}, {0, 0}};
    for (int i = 0; i < 2; ++i)
        for (int j = 0; j < 2; ++j)
            for (int k = 0; k < 2; ++k)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}

Matrix power(Matrix M, long long n) {
    if (n == 1) return M;
    if (n % 2 == 0) {
        Matrix half = power(M, n / 2);
        return multiply(half, half);
    } else {
        return multiply(M, power(M, n - 1));
    }
}

long long fibLog(long long n) {
    if (n == 0) return 0;
    Matrix M = {{1, 1}, {1, 0}};
    Matrix res = power(M, n);
    return res[0][1]; // Retorna F_n
}
```

- La multiplicació de dues matrius de mida $2 \times 2$ té cost constant $\Theta(1)$.
- L'exponent es divideix per $2$ a cada pas:
  $$T(n) = T(n/2) + \Theta(1) \implies \mathbf{\Theta(\log n)}$$

| Mètode | Temps | Espai | $n = 50$ | $n = 10^9$ |
| :--- | :--- | :--- | :--- | :--- |
| **Recursiu naïf** | $\Theta(1.618^n)$ | $\Theta(n)$ | $\approx 2$ hores | Impossible |
| **Iteratiu** | $\Theta(n)$ | $\Theta(1)$ | $\approx 0.00001$ s | $\approx 1$ segon |
| **Matrius (Divideix i Vèncer)** | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{< 1}$ **microsegon** | $\mathbf{< 1}$ **microsegon** |

:::tip{title="Focus d'Examen: Matrius per a altres recurrències"}
Als exàmens solen demanar dissenyar la matriu de transició per a altres recurrències lineals com:
$$A_n = 2A_{n-1} + 3A_{n-2}$$
La matriu associada seria $\begin{pmatrix} 2 & 3 \\ 1 & 0 \end{pmatrix}$, aconseguint calcular qualsevol terme en $\Theta(\log n)$.
:::

---

## 7. Fita Inferior Teòrica d'Ordenació per Comparació: $\Omega(n \log n)$

Hem vist que Mergesort i Heapsort ordenen en $\Theta(n \log n)$. Ens podem preguntar: *Podríem descobrir algun dia un algorisme basat en comparacions que ordeni en temps lineal $\Theta(n)$?*

La resposta teòrica és un **NO rotund**. Està demostrat que **qualsevol algorisme d'ordenació basat en comparacions necessita com a mínim $\Omega(n \log n)$ operacions en el cas pitjor**.

### Demostració mitjançant Arbres de Decisió
1. **Model de comparació**: Cada pas de l'algorisme fa una comparació entre dos elements ($a_i \le a_j$). Aquesta comparació té només dos resultats possibles (cert o fals). Per tant, el procés es pot representar com un **arbre binari**.
2. **Nombre de fulles**: Un vector de mida $n$ té $n!$ possibles ordenacions inicials (permutacions). Perquè l'algorisme sigui correcte, ha de ser capaç de retornar qualsevol d'aquestes $n!$ respostes ordenades. Això vol dir que l'arbre ha de tenir **com a mínim $n!$ fulles**:
   $$L \ge n!$$
3. **Alçada de l'arbre ($h$)**: L'alçada $h$ de l'arbre representa el nombre màxim de comparacions en el cas pitjor (el camí més llarg des de l'arrel fins a una fulla).
   Com que un arbre binari d'alçada $h$ té com a màxim $2^h$ fulles:
   $$2^h \ge L \ge n! \implies h \ge \log_2(n!)$$
4. **Acotació de $\log_2(n!)$**:
   $$\log_2(n!) = \sum_{i=1}^n \log_2(i) \ge \sum_{i=n/2}^n \log_2(i) \ge \sum_{i=n/2}^n \log_2(n/2) = \frac{n}{2} \cdot \log_2(n/2) = \frac{n}{2} (\log_2 n - 1) = \mathbf{\Omega(n \log n)}$$

:::tip{title="Conclusió fonamental"}
Com que la fita inferior del problema és $\Omega(n \log n)$ i tenim algorismes com Mergesort amb cost $\mathcal{O}(n \log n)$, diem que aquests algorismes són **asimptòticament òptims**.
*(Nota: Algorismes que ordenen en temps lineal com Counting Sort o Radix Sort NO contradiuen aquesta fita, perquè NO utilitzen comparacions, sinó indexació directa sobre rangs acotats d'enters).*
:::

---

## 8. De la Teoria a la Pràctica: Estructures de Dades de l'STL a C++

A les sessions de laboratori d'EDA i als problemes del Jutge.org, l'èxit depèn directament de triar l'estructura de dades de la biblioteca estàndard de C++ (**STL**) que tingui la complexitat asimptòtica necessària per no superar el límit de temps (*Time Limit*):

| Contenidor STL | Estructura interna | Accés aleatori | Cerca | Inserció / Esborrat | Quan utilitzar-lo? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`std::vector`** | Taula dinàmica contigua | $\Theta(1)$ | $\Theta(n)$ | Final: $\Theta(1)$ amortitzat<br>Mig: $\Theta(n)$ | Per defecte si sabem la mida o només afegim al final. |
| **`std::list`** | Llista doblement enllaçada | $\Theta(n)$ | $\Theta(n)$ | Amb iterador: $\Theta(1)$ | Si hem d'inserir/esborrar contínuament al mig. |
| **`std::set` / `std::map`** | Arbre binari balancejat (Red-Black) | No disponible | **$\Theta(\log n)$** | **$\Theta(\log n)$** | Quan necessitem mantenir les dades **sempre ordenades** i sense duplicats. |
| **`std::unordered_set` / `unordered_map`** | Taula de dispersió (Hash Table) | No disponible | **$\Theta(1)$** mitjà<br>($\Theta(n)$ pitjor) | **$\Theta(1)$** mitjà<br>($\Theta(n)$ pitjor) | Quan necessitem consultes ultra-ràpides i l'ordre dels elements és irrellevant. |
| **`std::priority_queue`** | Heap binari màxim/mínim | Només cim $\Theta(1)$ | No disponible | **$\Theta(\log n)$** | Per obtenir repetidament el màxim o mínim dinàmic (ex: Dijkstra, medianes dinàmiques). |
| **`std::stack` / `std::queue`** | Pila (LIFO) / Cua (FIFO) | Només extrem $\Theta(1)$ | No disponible | **$\Theta(1)$** | Per a algorismes de recorregut DFS (`stack`) i BFS (`queue`). |

---

### Exercicis de Jutge del Tema 1
Pots posar a prova tots aquests conceptes resolent la col·lecció d'exercicis oficials d'EDA:
- **P50709**: *Col·lecció de números* (Ús de `std::priority_queue` per consultar i modificar màxims eficientment).
- **P40902**: *Casino* (Ús de `std::map` per gestionar guanys i presència de jugadors en temps logarítmic).
- **P69781**: *Pseudo-seqüències de Collatz (2)* (Detecció de cicles utilitzant `std::map` o taules de dispersió).
- **P84415**: *La bossa de les paraules* (Manteniment de freqüències i mínims/màxims lexicogràfics amb `std::map`).
- **P37064**: *Mediana dinàmica* (Estratègia amb dues cues de prioritat o un iterador sobre `std::set`).
- **P59282**: *Mesures estadístiques* (Gestió de mitjanes i extrems dinàmics).
- **P69932**: *La seqüència més llarga* (Propietats de conjunts ordenats amb `std::set`).
- **P60296**: *Rol classificatori* (Ordenacions múltiples i rànquings amb `std::map`).
- **P60219**: *Easy game?* (Conjunts de paraules i ordenació per longitud).
- **P62653**: *Ticket distribution* (Cues amb prioritat i gestió de torns).
- **P63584**: *K-èsim element* (Fusió de llistes ordenades utilitzant heaps).

---

## 9. Resum d'Or per a l'Examen (Cheatsheet)

:::tip{title="Checklist ràpida de supervivència per als exàmens de teoria d'EDA"}
1. **Definicions**: Recorda que $\mathcal{O}$ és cota superior, $\Omega$ és cota inferior i $\Theta$ és fita exacta.
2. **Límits**: Si $\lim \frac{f(n)}{g(n)} = 0 \implies f \in \mathcal{O}(g)$. Si és una constant finita positiva $\implies f \in \Theta(g)$.
3. **Jerarquia**: $\log n \ll n^\epsilon \ll n \ll n \log n \ll n^c \ll c^n \ll n! \ll n^n$.
4. **Teorema Mestre Divisor**: Calcula sempre $\alpha = \log_b(a)$ i compara'l amb $k$:
   - $\alpha > k \implies \Theta(n^\alpha)$
   - $\alpha = k \implies \Theta(n^k \log n)$
   - $\alpha < k \implies \Theta(n^k)$
5. **Teorema Mestre Subtractiu**: Si $a = 1 \implies \Theta(n^{k+1})$. Si $a > 1 \implies \Theta(a^{n/c})$.
6. **Fibonacci**: Naïf $\Theta(\phi^n)$, Iteratiu $\Theta(n)$, Matrius $\Theta(\log n)$.
7. **Fita d'ordenació**: Qualsevol ordenació per comparació és $\Omega(n \log n)$ pel nombre de fulles de l'arbre de decisió ($n!$).
:::
