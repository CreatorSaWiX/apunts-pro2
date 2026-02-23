---
title: "Tema 3: Llistes i Iteradors"
description: "Estudi de les llistes enllaçades i els iteradors per recórrer seqüències en C++."
readTime: "4 min"
order: 3
---

## 3.1 Llistes vs Vectors

Els vectors emmagatzemen memòria seguida, i per això podem buscar ràpid la posició `v[i]`. Però si afegim alguna cosa al mig, tota la resta del vector s'ha d'ajustar, costant matemàticament $\mathcal{O}(n)$. 

Les **Llistes (`list`)** solucionen això: estan formades per **nodes independents** enllaçats l'un rere l'altre. Afegir o esborrar qualsevol element on som val només $\mathcal{O}(1)$. 

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

Això comporta un gran preu a pagar per consultar:
- **No tenen posicions.** Utilitzar `L[i]` genera error immediat!
- Si vols arribar a l'element $n$, has de passar obligatòriament travessant tots els nodes anteriors.

**Mètodes extrems ràpids $\mathcal{O}(1)$:** Com que els extrems sí que estan connectats directament als marcadors interns, tens disponibles: `push_back(x)`, `push_front(x)`, `pop_back()`, `pop_front()`, `front()` i `back()`.

---

## 3.2 Iteradors (Els Pointers Intel·ligents)

Com que no tenim índexs, recorrem les llistes utilitzant **Iteradors**. Imagina un iterador com una "fletxa" temporal que assenyala just un element concret del contenidor.

Tenen tres regles d'or principals:
1. `L.begin()` assenyala el primer element real i `L.end()` és una parada d'emergència buida que senyalitza **després** del final.
2. Et mous de node en node fent `it++` (avançar) i `it--` (recular). La funció `advance(it, 3)` avançarà l'iterador n posicions (cost intern $\mathcal{O}(N)$).
3. Obtens o modifiques el valor travessant-lo en desreferència posant-li un asterisc al davant: `*it = 50`.

```cpp
list<int> L = {10, 20, 30};

// Usem 'auto' per a no haver d'escriure estúpidament list<int>::iterator
for (auto it = L.begin(); it != L.end(); it++) {
    *it += 5; // Ara tots valdran {15, 25, 35}
}
```

*I què passa si ens demanen coses diferents? Existeixen les **variacions**:*
- **`const_iterator`:** Obligatori si reps la llista com a referència constant (`const list<T>& L`). Bloqueja l'escriptura (no pots fer `*it = 5`). Usa `cbegin()` i `cend()`.
- **`reverse_iterator`:** Per recórrer del final al principi. Usa `rbegin()` i `rend()` (i també s'avança amb `it++`).

---

## 3.3 Inserir elements (El perill del retrocés explícit)

La funció `L.insert(it, valor)` col·locarà el nou element a la memòria **just ABANS del lloc** on es trobi en aquest precís instant el teu `it`.

El secret on tothom falla: **Insertar et fa "retrocedir" lògicament.** Donat que vas emplaçar els valors darrere, el bucle tornarà a passar pel referent que tens a no ser que prenguis mesures.

**Exemple d'Examen:** Insertar un `'0'` previ a qualsevol dígit:

```cpp
void zeros_abans_del_digit(list<char>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it >= '1' && *it <= '9') {
            // L.insert() retorna el iterador refent cap el nou valor afegit.
            it = L.insert(it, '0'); 
            
            // Incrementem en dues instàncies: sobrepassem el '0' i travessem el original!
            advance(it, 2); 
        } else {
            it++;
        }
    }
}
```

---

## 3.4 Esborrar elements (La mort incontrolable)

La destrucció en posició s'efectua pel contrari amb `L.erase(it)`. 

El problema massiu? En esborrar de memòria el node on apuntaves... **l'iterador mor al moment**. Si al teu `while` provaves de fer un inofensiu `it++` al final per avançar, el programa enviarà un Segmentation Fault fatídic per provar trucar cap al buit.

El truc infalible? L'`erase()` et retornarà sempre una fletxa sana, automàticament enganxada a **la següent baula**.

```cpp
void destrueix_parells(list<int>& L) {
    auto it = L.begin();
    
    // El "for" tòxic mai s'utilitza. Usem només algorítmica While manual!
    while (it != L.end()) {
        if (*it % 2 == 0) {
            // Substitueix a ell mateix per sobreviure a la mort
            it = L.erase(it); 
        } else {
            // Nomes passa d'element natural si no ha tocat res i ha sobreviscut.
            it++;
        }
    }
}
```

> **⚠️ Alerta per a Vectors:** Exactament aquesta mateixa lògica i bucles d'`insert`/`erase` funcionen de manera idèntica usant contenidors `std::vector`! Afegir o esborrar elements enmig d'un Vector **també invalida la resta d'iteradors vius**. Això és perquè un vector internament ha de desplaçar tots els elements endavant/endarrere o de vegades inclús re-ubicar-se ell sencer a una nova adreça de memòria. Utilitza la reassignació iterativa igualment!

---

## 3.5 Simulació visual a l'Execució

Vols veure com les fletxetes dels iteradors actuen directament en RAM sense interrupcions al teu contenidor? Dona reproduir i avança-hi manualment!

:::oopviz{simulation="llista_iteradors"}
:::
