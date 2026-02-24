---
title: "Tema 3: Llistes i Iteradors"
description: "Estudi de les llistes enllaçades i els iteradors per recórrer seqüències en C++."
readTime: "4 min"
order: 3
---

## 3.1 Llistes vs Vectors

Les **Llistes (`list`)** solucionen l'alt cost d'inserció al mig dels vectors ($\mathcal{O}(n)$). Estan formades per nodes independents enllaçats. Afegir o esborrar un element intermig costa només $\mathcal{O}(1)$.

:::graph
```json
{
  "nodes": [
    { "id": "begin", "label": "begin()", "color": "#10b981" },
    { "id": "1", "label": "Valor A", "color": "#3b82f6" },
    { "id": "2", "label": "Valor B", "color": "#3b82f6" },
    { "id": "3", "label": "Valor C", "color": "#3b82f6" },
    { "id": "end", "label": "end()", "color": "#ef4444" }
  ],
  "links": [
    { "source": "begin", "target": "1", "label": "Punter" },
    { "source": "1", "target": "2", "label": "Punter" },
    { "source": "2", "target": "3", "label": "Punter" },
    { "source": "3", "target": "end" }
  ]
}
```
:::

**Desavantatges algorísmics:**
- **Sense posicions directes:** Utilitzar `L[i]` genera error de compilació.
- **Cost de travessia:** Per arribar a $n$, cal recórrer seqüencialment tots els nodes anteriors.

**Mètodes amb cost $\mathcal{O}(1)$ garantit:** `push_back()`, `push_front()`, `pop_back()`, `pop_front()`, `front()` i `back()`.

> **💡 Realitat a la Indústria (CPU Cache)**
> A l'entorn real, la indústria prioritza `std::vector`. Els blocs continus de memòria aprofiten la *Cache* del processador de l'ordinador, oferint velocitats molt superiors en rutes seqüencials. Les llistes resulten deficients per la càrrega de fragments esparcits a memòria.

---

## 3.2 Iteradors

Davant la manca d'índexs, utilitzem **Iteradors**. Actuen com punters tàctics per recórrer les col·leccions.

1. `L.begin()` retorna el primer element, mentre que `L.end()` marca l'espai **buit després de l'últim**.
2. Ens movem inter-element usant `it++` o salts en bloc amb `advance(it, n)`.
3. Es desreferencia i accedeix al valor contingut iterat fent servir l'asterisc: `*it = 50`.

```cpp
list<int> L = {10, 20, 30};

// 'auto' simplifica codis excessivament llargs tipus 'list<int>::iterator'.
for (auto it = L.begin(); it != L.end(); it++) {
    *it += 5; 
}
```

**Variants principals:**
- **`const_iterator`:** S'usa quan l'entorn restringeix alteracions (`const list<T>& L`). Bloqueja la mutabilitat interna (`cbegin`, `cend`).
- **`reverse_iterator`:** Recorre i suma iteracions invertint trajecte (`rbegin`, `rend`). 

Retrocedir manualment des de `L.end()` amb un iterador base genera cicles `for` complexos donat que la barrera assignada superior comença fora de rang per base. El model *reverse* integra el trajecte a l'inrevés mantenint el tradicional `it++`. Observa de tu mateix aquesta execució tècnica invertida amb l'ajuda del següent simulador:

:::oopviz{simulation="iteradors_reversos"}
:::

---

## 3.3 Alterar col·leccions: L'ús avançat de l'iterador

El gran perill de treballar alterant espais iterables és que les adreces assignades sovint perden la seva traçabilitat interna a C++, resultant en els coneguts *Segmentation Faults*.

- `L.insert(it, valor)`: Insereix l'element **abans** de la posició assignada.
- `L.erase(it)`: Allibera la cel·la activa. Si el procés avança l'iterador després (`it++`), col·lapsarà perquè el contacte de posició de la memòria va quedar esborrat junt de l'element.

Per resoldre-ho, ambdúes funcions **retornen l'iterador sà i re-assignat** per seguir utilitzant un patró basat a un `while` genèric format:

```cpp
void processar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            // L'esborrat salva memòria tornant l'enllaç del següent element segur per ser guardat l'iterador
            it = L.erase(it); 
        } 
        else if (*it == -1) {
            // Insertar desvia referència en retard constant. Sumem avançar '2' distàncies per no tornar a processar-lo al bucle!
            it = L.insert(it, 0);
            advance(it, 2); 
        } 
        else {
            // Cicle complet normal d'una travessia per enllaç
            it++;
        }
    }
}
```

> **⚠️ Alerta Aplicada a `std::vector`:** Aquest mateix patró s'ha d'assumir estrictament als Vectors. Ampliar posicions internament reubica blocs de vectors modulars de memòries; trencant igualment els intercanvis que no hagin utilitzat la nova localització generada referent als retornables d'`erase()` o `insert()`. 

Interactua visualment amb aquest model de `L.insert` i `L.erase` per observar en primer plà el patró de re-engaxar a l'iterador la ruta de tornada intacte pas a pas.

:::oopviz{simulation="llista_iteradors"}
:::
