---
title: "Tema 6: Cerca exhaustiva"
description: "Backtracking (tornada enrere), generació de subconjunts i permutacions, desarranjaments, n-reines, poda per viabilitat i fites (Branch & Bound), i transformació a temps polinòmic."
readTime: "12 min"
order: 7
draft: false
---

## 6.1. Esquema canònic de backtracking

### La mecànica de la solució parcial i el punter `idx`
En construir solucions d'esquerra a dreta:
* `0 ... idx - 1`: **El passat** (elements ja decidits i fixats a la solució parcial).
* `idx`: **El present** (la casella concreta que estem decidint en aquesta crida recursiva).
* `idx ... n - 1`: **El futur** (caselles pendents d'omplir).
* **Cas base (`idx == n`):** El futur és buit $\implies$ solució completa trobada.

### El cicle choose – explore – un-choose
Tots els algorismes de tornada enrere comparteixen aquest cicle:

```cpp
void backtrack(Estat& e, int pas) {
    if (es_solucio_completa(e, pas)) {
        processar(e); // Cas base: fulla valida assolida
        return;
    }
    for (int c : candidats_valids(e, pas)) {
        aplicar(e, c);            // 1. Choose
        backtrack(e, pas + 1);    // 2. Explore
        desfer(e, c);             // 3. Un-choose (BACKTRACK)
    }
}
```

:::backtrackviz
:::

**Per què cal desfer el marcatge (`Un-choose`)?**
Com que les estructures d'estat es passen per referència (`&`) per evitar copiar memòria a cada pas ($\mathcal{O}(n)$), si no es desfà el canvi en tornar de la recursió, les branques posteriors trobaran l'estat contaminat.

### Signatures segons l'objectiu del problema

| Objectiu | Retorn | Cas base | Crida recursiva |
| :--- | :---: | :---: | :--- |
| **Enumerar totes** | `void` | Imprimir / Desar | `backtrack(...)` directe. |
| **Aturada a la 1a solució** | `bool` | `return true;` | `if (backtrack(...)) return true;` (propagació immediata). |
| **Comptar solucions** | `int` | `return 1;` | Acumulador: `total += backtrack(...)`. |
| **Optimització ($\min/\max$)** | `void` | `millor = min(millor, cost_act);` | Poda per fita abans d'explorar. |

---

## 6.2. Generació de subconjunts ($2^n$)

Cada element $e_i$ té dues opcions: **no agafar-lo** ($s[i] = 0$) o **agafar-lo** ($s[i] = 1$).

```cpp
void subconjunts(vector<int>& s, int idx, int n) {
    if (idx == n) {
        processar(s); // Vector binari de mida n completat
        return;
    }
    s[idx] = 0; subconjunts(s, idx + 1, n); // Opcio 0: descartar
    s[idx] = 1; subconjunts(s, idx + 1, n); // Opcio 1: incloure
}
```

:::subsetsviz
:::

**Bijecció canònica (subconjunts $\longleftrightarrow$ bits):**
Si un problema demana subconjunts d'objectes (ex: paraules o ciutats), **mai creeu vectors auxiliars dinàmics de còpia**. Treballeu exclusivament amb el vector de bits `0/1` de mida $n$. A la fulla, imprimiu els elements on `s[i] == 1`.

### Poda sobre subconjunts: exactament $k$ uns
Es transmet la quantitat d'`uns` acumulada per evitar bucles al cas base, tallant les branques invàlides abans de baixar:

```cpp
void subconjunts_k(vector<int>& s, int idx, int n, int k, int uns) {
    // Poda 1: Massa uns | Poda 2: Falta espai (ni agafant tot el que queda arribem a k)
    if (uns > k || uns + (n - idx) < k) return;

    if (idx == n) { processar(s); return; }

    s[idx] = 0; subconjunts_k(s, idx + 1, n, k, uns);
    s[idx] = 1; subconjunts_k(s, idx + 1, n, k, uns + 1);
}
```

:::subsetskviz
:::

---

## 6.3. Generació de permutacions ($n!$) i desarranjaments

### 1. Permutacions canòniques
A cada posició `idx` podem triar qualsevol element $k \in \{1 \dots n\}$ no usat prèviament. Es manté un vector booleà `usat` de mida $n+1$ per consultar i marcar en $\mathbf{\Theta(1)}$:

```cpp
void permutacions(vector<int>& sol, int idx, int n, vector<bool>& usat) {
    if (idx == n) { processar(sol); return; }

    for (int k = 1; k <= n; ++k) {
        if (!usat[k]) {
            sol[idx] = k;
            usat[k] = true;                     // Choose
            permutacions(sol, idx + 1, n, usat);// Explore
            usat[k] = false;                    // Un-choose
        }
    }
}
```

:::permutationsviz
:::

### 2. Desarranjaments (*derangements*) — examen final 2024
Un **desarranjament** de mida $n$ és una permutació de $\{0 \dots n-1\}$ **sense punts fixos** ($\pi(i) \neq i$ per a tot $i$):

**Filtre de viabilitat:** N'hi ha prou d'afegir la condició `k != idx` al bucle de selecció:

```cpp
for (int k = 0; k < n; ++k) {
    if (!usat[k] && k != idx) { // Condicio de desarranjament: pi(idx) != idx
        sol[idx] = k;
        usat[k] = true;
        desarranjaments(sol, idx + 1, n, usat);
        usat[k] = false;
    }
}
```

:::derangementsviz
:::

---

## 6.4. Problemes clàssics d'examen final

### 1. El problema de les $n$-reines (poda en $\Theta(1)$)
Col·locar $n$ reines en un tauler $n \times n$ sense que s'amenacin (màxim 1 per fila, columna o diagonal).
* Representació: `t[i] = j` indica reina a la fila `i`, columna `j`.
* **Identificació de diagonals en $\Theta(1)$:**
  * Diagonal ascendent (↗): La suma d'índexs és constant: $i + j \in [0, 2n - 2]$ $\implies$ `md1[i + j]`.
  * Diagonal descendent (↘): La diferència és constant: $i - j + (n - 1) \in [0, 2n - 2]$ $\implies$ `md2[i - j + n - 1]`.

```cpp
int reines(int i, int n, vector<bool>& mc, vector<bool>& md1, vector<bool>& md2) {
    if (i == n) return 1; // n reines col·locades amb exit
    int total = 0;
    for (int j = 0; j < n; ++j) {
        int d1 = i + j, d2 = i - j + n - 1;
        if (!mc[j] && !md1[d1] && !md2[d2]) {
            mc[j] = md1[d1] = md2[d2] = true;
            total += reines(i + 1, n, mc, md1, md2);
            mc[j] = md1[d1] = md2[d2] = false;
        }
    }
    return total;
}
```

:::nqueensviz
:::

### 2. Navegació en graelles 2D (sudoku i taulers)
Per recórrer matrius casella a casella amb backtracking, s'avança horitzontalment i es canvia de fila en arribar al límit:

```cpp
void backtrack_2d(vector<vector<int>>& M, int i, int j, int n) {
    if (i == n) { processar(M); return; }                   // Cas base: matriu plena
    if (j == n) { backtrack_2d(M, i + 1, 0, n); return; }   // Salt a l'inici de la fila seguent

    for (int v : candidats_valids(M, i, j)) {
        M[i][j] = v;
        backtrack_2d(M, i, j + 1, n);
        M[i][j] = 0; // Desfer casella
    }
}
```

:::backtrack2dviz
:::

### 3. Cicle hamiltonià sobre graf
Trobar un cicle que visiti cada vèrtex exactament un cop i torni a l'origen:

```cpp
bool hamilton(const vector<vector<int>>& G, int u, int visitats, int n, vector<bool>& vis) {
    if (visitats == n) {
        for (int v : G[u]) if (v == 0) return true; // Hi ha aresta de tornada a l'origen?
        return false;
    }
    for (int v : G[u]) {
        if (!vis[v]) {
            vis[v] = true;
            if (hamilton(G, v, visitats + 1, n, vis)) return true;
            vis[v] = false;
        }
    }
    return false;
}
```

:::hamiltonviz
:::

### 4. Motxilla 0/1 i Branch & Bound (poda per fites)
* **Poda 1 (Viabilitat):** Si `pes_act + p[k] > C`, no agafar l'objecte $k$.
* **Poda 2 (Fita optimista):** Sigui `svr` la suma de valors dels objectes restants ($k \dots n-1$). Si `val_act + svr <= millor_valor`, descartar la branca sencera:

```cpp
void motxilla(int k, int n, int C, int pes_act, int val_act, int svr, int& millor_val) {
    if (pes_act > C || val_act + svr <= millor_val) return; // Poda 1 i Poda 2
    if (k == n) { millor_val = max(millor_val, val_act); return; }

    motxilla(k + 1, n, C, pes_act, val_act, svr - v[k], millor_val);                  // No agafar k
    motxilla(k + 1, n, C, pes_act + p[k], val_act + v[k], svr - v[k], millor_val);  // Agafar k
}
```

:::knapsackviz
:::

---

## 6.5. Backtracking vs solució polinòmica

**Exàmens 2022 i 2026:**
Sovint es presenta un problema d'ordenació amb restriccions (ex: resultats de partides de 3 jugadors on $j_1$ va abans que $j_2$ i $j_2$ abans que $j_3$) i un codi que prova totes les permutacions en $\mathbf{\mathcal{O}(n! \cdot m)}$.

**Pregunta:** *"Es pot resoldre en temps polinòmic?"*  **SÍ.**
* Es construeix un **graf dirigit** on cada restricció "$u$ ha d'anar abans que $v$" és un arc $u \to v$.
* El problema de trobar un ordre consistent es redueix a trobar una **ordenació topològica en temps lineal $\mathbf{\Theta(n + m)}$** mitjançant l'algorisme de Kahn.
* Si el graf conté cicles, no existeix cap ordre compatible.

### Resum

La **cerca exhaustiva** explora sistemàticament l'espai d'estats d'un problema quan no existeixen algorismes polinòmics directes (comú en problemes **NP-complets** o de satisfacció de restriccions). La **tornada enrere (*backtracking*)** construeix solucions pas a pas i **poda** (*prunes*) les branques tan bon punt incompleixen les restriccions o no poden millorar l'òptim.

| Problema | Espai brut | Condició de poda / filtre | Cost temporal pitjor cas |
| :--- | :---: | :--- | :---: |
| **Subconjunts / Cadenes de bits** | $2^n$ | Excés de pes o falta d'elements restants | $\Theta(2^n)$ |
| **Permutacions de $\{1 \dots n\}$** | $n!$ | Elements ja usats (`usat[k]` en $\Theta(1)$) | $\Theta(n! \cdot n)$ |
| **Desarranjaments ($\pi(i) \neq i$)** | $n!$ | Elements usats I elements en posició fixa ($k \neq i$) | $\Theta(n! / e)$ |
| **$N$-Reines ($n \times n$)** | $n^n$ | Marcatge de columnes i diagonals en $\Theta(1)$ | $\mathcal{O}(c^n)$ ($c < n$) |
| **Motxilla 0/1 / Herència** | $2^n$ | Poda de capacitat + Fita optimista superior | $\mathcal{O}(2^n)$ |
| **Cicle hamiltonià / TSP** | $n!$ | Vèrtexs visitats + Fita de cost $\ge \text{millor}$ | $\mathcal{O}(n!)$ |


1. **Poda de viabilitat vs poda de fita (*bound*):** La de viabilitat detecta solucions il·legals (ex: pes $> C$ o xoc de reines). La de fita descarta solucions legals que mai no podran igualar o superar la millor solució ja guardada.
2. **Ordre lexicogràfic garantit:** Explorar els candidats del bucle en ordre creixent (`for (int k = 1; k <= n; ++k)`) garanteix que les solucions s'imprimeixen en ordre lexicogràfic automàticament pel funcionament en profunditat del DFS.
3. **Complexitat del backtracking pur:** Sense podes efectives, generar subconjunts costa sempre $\Theta(n \cdot 2^n)$ i permutacions $\Theta(n \cdot n!)$ pel cost de copiar o imprimir la solució a les fulles.
4. **Quan NO val la pena podar:** Si l'enunciat demana generar *totes* les permutacions sense restriccions, tota branca porta a una solució vàlida; qualsevol comprovació extra afegeix sobrecost inútil.
