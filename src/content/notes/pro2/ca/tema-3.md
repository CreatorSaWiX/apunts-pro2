---
title: "Tema 3: Llistes i iteradors"
description: "Estudi de les llistes enllaçades i els iteradors per recórrer seqüències en C++."
readTime: "9 min"
order: 3
---

## 3.1 Llistes vs vectors

Les **llistes (`list`)** solucionen l'alt cost d'inserció al mig dels vectors $\mathcal{O}(n)$. Estan formades per nodes independents enllaçats. Afegir o esborrar un element intermig costa només $\mathcal{O}(1)$. 

<br>

**Desavantatges:**

- **Sense posicions directes:** Utilitzar `L[i]` genera error de compilació.
- **Cost de travessia:** Per arribar a $n$, cal recórrer seqüencialment tots els nodes anteriors.

**Mètodes $\mathcal{O}(1)$:** `push_back()`, `push_front()`, `pop_back()`, `pop_front()`, `front()` i `back()`.

:::listviz
:::

:::info
Encara que les llistes siguin de cost constant en mig de la seqüència, en termes generals d'eficiència s'acostuma a prioritzar l'ús del `std::vector` atès que emmagatzema memòria en blocs contigus molt llestos de llegir. Només usarem llistes si el problema exigeix constants insercions i esborrats intermedis.
:::

---

## 3.2 Iteradors

Les llistes s'han de recórrer usant **iteradors**:

- `L.begin()`: Retorna l'iterador apuntant al **primer** element.
- `L.end()`: Retorna l'iterador que assenyala la cel·la virtual **després de l'últim** element (fora de rang).
- S'accedeix al seu valor utilitzant l'asterisc com a desreferenciació: `*it = 50`.
- Es passa al següent element avaluant el símbol suma: `it++`.

```cpp
list<int> L = {10, 20, 30};

// S'usa 'auto' per simplificar tipus extremadament llargs com 'list<int>::iterator'
for (auto it = L.begin(); it != L.end(); it++) {
    *it += 5; 
}
```

**Variants principals d'iteradors:**
- **`const_iterator` (`cbegin`, `cend`)**: Si la llista es passa com a constant `const`, no permet mutar les dades mitjançant `*it = x;`.
- **`reverse_iterator` (`rbegin`, `rend`)**: Permet recórrer la llista del final al principi mantenint comoditat tècnica aplicant en el fons normalment el `it++`.

Retrocedir manualment des de `L.end()` amb iteradors porta problemes tècnics d'índex ja que l'avaluació arrenca "al límit on ja no hi ha res". Observa de quina manera avança el simulador respecte al traçat invers:

:::oopviz{simulation="iteradors_reversos"}
:::

---

## 3.3 Modificar llistes mentre es recorren: `insert` i `erase`

Quan esborrem o inserim elements en una llista mentre la recorrem amb un iterador, l'iterador antic queda invalidat. Per solucionar-ho, C++ retorna **un nou iterador vàlid**:

- `it = L.insert(it, x)`: Insereix `x` **abans** de la posició actual i retorna l'iterador al nou element inserit.
- `it = L.erase(it)`: Esborra l'element actual i retorna l'iterador al **següent element**.

### Com recórrer i esborrar amb `while`

Si esborrem un element, **no hem de fer `it++`**, ja que `erase` ja ens col·loca al següent:

```cpp
void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it);   // Ja avança al següent (no fem it++)
        } 
        else if (*it == -1) {
            L.insert(it, 0);    // Insereix 0 abans de -1 (it segueix a -1)
            it++;               // Avancem per passar el -1
        } 
        else {
            it++;               // Només avancem si no hem esborrat
        }
    }
}
```

:::oopviz{simulation="llista_iteradors"}
:::
