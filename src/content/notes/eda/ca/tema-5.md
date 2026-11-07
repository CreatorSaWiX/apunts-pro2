---
title: "Tema 5: Grafs"
description: "Definició i propietats de grafs, representacions en memòria, recorreguts DFS i BFS, camins mínims (Dijkstra), ordenació topològica en DAGs, arbres d'expansió mínima (Prim) i grafs implícits."
readTime: "15 min"
order: 6
draft: false
---

## 5.1. Propietats Fonamentals i Cotes

Un graf $G = (V, E)$ està format per un conjunt de $n = |V|$ **vèrtexs** i $m = |E|$ **arestes**.

**Cota màxima d'arestes:**
* No dirigit simple: $0 \le m \le \binom{n}{2} = \frac{n(n - 1)}{2} \implies \mathbf{m = \mathcal{O}(n^2)}$.
* Dirigit simple: $0 \le m \le n(n - 1) \implies \mathbf{m = \mathcal{O}(n^2)}$.
**Lema de l'encaixada de mans:** $\sum_{u \in V} \deg(u) = 2m$.
* *Corol·lari:* El nombre de vèrtexs de grau senar en un graf no dirigit és sempre **parell**.

**Connectivitat:**
* Un graf no dirigit connex té com a mínim $n - 1$ arestes ($m = \Omega(n)$).
* En digrafs: **Feblement connex** (el graf no dirigit subjacent és connex); **Fortament connex (SCC)** (existeix camí dirigit $u \rightsquigarrow v$ i $v \rightsquigarrow u$ per a tot parell).

**Arbres:** Un graf és un arbre $\iff$ és connex i té exactament $n - 1$ arestes $\iff$ és acíclic i té $n - 1$ arestes.

Més detalls a [Resum parcial teoria de grafs M1](./m1-G)

---

## 5.2. Representacions a Memòria: Matriu vs Llistes d'Adjacència

| Operació / Paràmetre | Matriu d'adjacència (`vector<vector<bool>>`) | Llistes d'adjacència (`vector<vector<int>>`) |
| :--- | :---: | :---: |
| **Espai a memòria** | $\mathbf{\Theta(n^2)}$ | $\mathbf{\Theta(n + m)}$ |
| **Consultar si existeix $\{u, v\}$** | $\mathbf{\Theta(1)}$ | $\mathcal{O}(\deg(u))$ |
| **Iterar sobre tots els veïns d'$u$** | $\Theta(n)$ | $\mathbf{\Theta(\deg(u))}$ |
| **Inserir / Esborrar aresta** | $\Theta(1)$ | $\mathcal{O}(\deg(u))$ |
| **Ús idoni** | **Grafs molt densos** ($m \approx n^2$) | **Grafs dispersos** ($m \ll n^2$, estàndard a EDA) |

:::graphrepviz
:::

* **Refactorització d'examen:** Canviar un bucle que cerca veïns sobre matriu ($\mathcal{O}(n^2)$) per llistes d'adjacència redueix el cost a $\mathcal{O}(n + m)$.

---

## 5.3. Cerca en Profunditat (DFS) i Cerca en Amplada (BFS)

### DFS (Cerca en Profunditat)
Explora recursivament fins a arribar a un carreró sense sortida i retrocedeix.

```cpp
void dfs(const vector<vector<int>>& G, int u, vector<bool>& vis) {
    vis[u] = true;
    for (int v : G[u]) {
        if (!vis[v]) dfs(G, v, vis);
    }
}
```

* **Cost:** $\mathbf{\Theta(n + m)}$. Espai: $\Theta(n)$ per la pila de crides i `vis`.
* **Propietat d'examen:** En un **graf no dirigit**, el DFS només produeix **arestes d'arbre** i **arestes de retrocés** (*back edges*). Un graf no dirigit conté cicles $\iff$ DFS troba una aresta cap a un vèrtex ja visitat que no sigui el pare directe.

:::dfsviz
:::

---

### BFS (Cerca en Amplada)
Explora per nivells concèntrics de distància des d'un origen $s$.

```cpp
vector<int> bfs(const vector<vector<int>>& G, int s) {
    int n = G.size();
    vector<int> dist(n, -1);
    queue<int> Q;

    dist[s] = 0;
    Q.push(s);

    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        for (int v : G[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1; // Marcatge en encuar!
                Q.push(v);
            }
        }
    }
    return dist;
}
```

* **Cost:** $\mathbf{\Theta(n + m)}$. Espai: $\Theta(n)$.
* **Principi fonamental:** BFS garanteix trobar el **camí mínim en nombre d'arestes** (o passos).
* **Regla d'or:** A BFS els nodes es marquen com a visitats **en ENCUAR**, mai en desencuar (evita encuar duplicats).

:::bfsviz
:::

---

## 5.4. Algorisme de Dijkstra (Camins mínims amb pesos $\ge 0$)

Calcula les distàncies mínimes des d'un origen $s$ en grafs amb arestes ponderades **no negatives** ($\omega(e) \ge 0$).

:::dijkstraviz
:::

```cpp
typedef pair<double, int> PII; // {distancia_acumulada, node}
typedef vector<vector<pair<int, double>>> GrafP;

void dijkstra(const GrafP& G, int s, vector<double>& dist) {
    int n = G.size();
    dist.assign(n, 1e18);
    vector<bool> S(n, false); // S[u] = cert quan la distancia es definitiva
    priority_queue<PII, vector<PII>, greater<PII>> pq; // Min-Heap

    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        int u = pq.top().second;
        double d = pq.top().first;
        pq.pop();

        if (S[u]) continue; // Descarta copies obsoletes del heap
        S[u] = true;

        for (auto& arc : G[u]) {
            int v = arc.first;
            double w = arc.second;
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}
```

* **Cost temporal amb `std::priority_queue`:** $\mathbf{\mathcal{O}((n + m) \log n)}$.

### Preguntes Clau d'Examen sobre Dijkstra

1. **Per què cal el vector `S` (o `if (d > dist[u]) continue;`)?**
   Com que `std::priority_queue` no té operació `decrease_key`, es permeten entrades duplicades a la cua. Sense el vector `S`, un node es podria reprocessar múltiples vegades, fent explotar el cost a **$\mathbf{\Omega(n^2)}$** en grafs amb molts camins alternatius.
2. **Per què falla si hi ha arestes amb pes negatiu?**
   Dijkstra és voraç: assumeix que en extreure $u$ del heap, la seva distància ja no pot millorar mai més. Una aresta negativa posterior podria oferir una drecera que reduís el cost d'un node ja tancat. *(Amb pesos negatius cal usar Bellman-Ford en $\mathcal{O}(n \cdot m)$)*.
3. **Comptar el nombre de camins mínims (Gener 2025):**
   Es manté un vector `ways(n, 0)` amb `ways[s] = 1`:
   * Si `dist[u] + w < dist[v]`: nou mínim estrictament millor $\implies$ `dist[v] = dist[u] + w; ways[v] = ways[u]; pq.push(...)`.
   * Si `dist[u] + w == dist[v]`: camí alternatiu d'idèntic cost mínim $\implies$ `ways[v] += ways[u]`.

---

## 5.5. Ordenació Topològica en Digrafs Acíclics (DAGs)

Una ordenació topològica és una permutació lineal dels vèrtexs $(v_1, \dots, v_n)$ tal que per a tot arc $(u, v) \in E$, $u$ apareix abans que $v$.

* **Teorema:** Un digraf admet ordenació topològica $\iff$ és un **DAG** (no té cicles dirigits).
* Tot DAG finit té almenys una font ($\deg^- = 0$) i un embornal ($\deg^+ = 0$).

### Algorisme de Kahn (Fonts i Graus d'Entrada)

```cpp
vector<int> toposort(const vector<vector<int>>& G) {
    int n = G.size();
    vector<int> ge(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : G[u]) ++ge[v];

    queue<int> Q;
    for (int u = 0; u < n; ++u)
        if (ge[u] == 0) Q.push(u);

    vector<int> ordre;
    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        ordre.push_back(u);
        for (int v : G[u]) {
            if (--ge[v] == 0) Q.push(v);
        }
    }

    if (ordre.size() != n) return {}; // Si no conte n nodes, EL GRAF TÉ CICLES!
    return ordre;
}
```

* **Cost:** $\mathbf{\Theta(n + m)}$. Espai: $\Theta(n)$.
* **Detecció de cicles:** Si `ordre.size() < n`, el graf no és un DAG.

:::toposortviz
:::

---

## 5.6. Arbres d'Expansió Mínims (MST): Prim vs Kruskal

Un **arbre d'expansió** connecta tots els vèrtexs d'un graf no dirigit connex utilitzant exactament **$n - 1$ arestes**. L'**MST** és aquell que minimitza la suma de pesos de les arestes.

* **Unicitat:** Si tots els pesos de les arestes són **estrictament diferents**, l'MST és **ÚNIC**.

| Criteri | Algorisme de Prim | Algorisme de Kruskal |
| :--- | :--- | :--- |
| **Estratègia** | Creixement d'un **únic arbre local continu** des d'un vèrtex inicial. | Fusió d'un **bosc global** d'arbres independents. |
| **Estructura clau** | `priority_queue` d'arestes que creuen el tall actual. | Ordenació d'arestes + **Union-Find / DSU** (evitar cicles). |
| **Cost temporal** | $\mathbf{\mathcal{O}(m \log n)}$ | $\mathbf{\mathcal{O}(m \log m) = \mathcal{O}(m \log n)}$ |
| **Idoni per a** | **Grafs densos** ($m \approx n^2$). | **Grafs dispersos** ($m \ll n^2$). |

:::mstviz
:::

---

## 5.7. Grafs Implícits: Graelles i Espais d'Estats

A molts problemes de final no donen llistes d'adjacència; el graf és implícit:

### 1. Graelles 2D ($R \times C$)
Les caselles transitables són nodes i els moviments permesos són arestes:

```cpp
const int di[] = {-1, 1, 0, 0};
const int dj[] = {0, 0, -1, 1};

// Dins del bucle de BFS sobre graella:
for (int k = 0; k < 4; ++k) {
    int ni = r + di[k], nj = c + dj[k];
    if (ni >= 0 && ni < R && nj >= 0 && nj < C && mapa[ni][nj] != '#' && dist[ni][nj] == -1) {
        dist[ni][nj] = dist[r][c] + 1;
        Q.push({ni, nj});
    }
}
```

:::gridbfsviz
:::

### 2. Espais d'Estats Abstractes (ex: Problema de les Gerres, Gener 2024)
* **Vèrtexs:** Parelles d'estats $(a, b)$ amb l'aigua actual a cada gerra ($0 \le a \le A$, $0 \le b \le B$).
* **Arestes:** Operacions possibles (omplir $A$, buidar $B$, transvasar $A \to B$, etc.).
* **Resolució:** Com que cada operació compta com 1 pas, el nombre mínim de passos es resol **sempre amb BFS**, mai amb Dijkstra ni DFS. Cost: $\mathcal{O}(\text{nombre d'estats}) = \mathcal{O}(A \cdot B)$.

:::jugsviz
:::

---

## 5.8. Resum

1. **Per què Dijkstra en un graf no ponderat és una mala opció?**
   Perquè costa $\mathcal{O}((n + m) \log n)$ a causa del heap, mentre que un simple BFS resol camins mínims en $\Theta(n + m)$.
2. **Què detecta cicles més ràpid en un DAG?**
   L'algorisme de Kahn en $\Theta(n + m)$ (si queden nodes per processar amb `ge > 0`) o un DFS amb comprovació d'arestes de retrocés cap a nodes actius a la pila.
3. **Dijkstra amb matriu d'adjacència:** En grafs extremadament densos ($m = \Theta(n^2)$), usar un vector simple en comptes d'un heap assoleix $\Theta(n^2)$, que és millor que $\mathcal{O}(n^2 \log n)$.
4. **Camins Eulerians vs Hamiltonians:**
   - Eulerià (visita cada **aresta** 1 cop): computable en temps polinòmic $\Theta(m) \in \mathbf{P}$.
   - Hamiltonià (visita cada **vèrtex** 1 cop): problema **NP-complet**.

| Algorisme | Tipus de graf | Pesos | Problema que resol | Estructura clau | Cost temporal | Memòria aux. |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **DFS** | Dirigit / No dirigit | Irrellevant | Connectivitat, cicles, components | Pila / Recursió | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **BFS** | Dirigit / No dirigit | Sense pesos / constants | Camí mínim en arestes / passos | Cua FIFO (`queue`) | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **Dijkstra** | Dirigit / No dirigit | **No negatius** ($\omega \ge 0$) | Camí mínim ponderat des d'un origen | Min-Heap (`priority_queue`) | $\mathbf{\mathcal{O}((n + m) \log n)}$ | $\Theta(n + m)$ |
| **Kahn (TopoSort)**| Digraf acíclic (**DAG**)| Irrellevant | Ordenació topològica i dependències | Vector graus entrada + Cua/Pila | $\mathbf{\Theta(n + m)}$ | $\Theta(n)$ |
| **Prim (MST)** | No dirigit connex | Ponderat | Arbre d'expansió de cost mínim | Min-Heap d'arestes del tall | $\mathbf{\mathcal{O}(m \log n)}$ | $\Theta(n + m)$ |