---
title: "Tema 4: Immersió i Arbres Binaris"
description: "Vèncer les limitacions de la recursivitat i domini total i ràpid dels Arbres Binaris."
readTime: "8 min"
order: 4
---

## 4.1 La Immersió

En recursivitat, **les variables locals es destrueixen a cada crida** (canvi de *frame*). Per tant, per arrossegar informació de forma eficient de dalt a baix s'afegeixen paràmetres extra.

Com que a l'examen no pots alterar la "signatura pública", s'utilitza la **Immersió**:
1. Crear una funció oculta/auxiliar (amb els paràmetres nous).
2. Fer que la funció pública inicialitzi i cridi aquesta funció oculta.

### Invertir String (`reverse`)
Necessitem un acumulador `reversed` per guardar les lletres girades pas a pas.

```cpp
// 1. Funció Immersa (Privada, té la recursivitat)
string reverse__(string s, string reversed) {
    if (s.empty()) return reversed;
    return reverse__(s.substr(1), s[0] + reversed);
}

// 2. Funció Pública (Oficial d'usuari)
string reverse(string s) {
    return reverse__(s, ""); 
}
```

### Fibonacci en $\mathcal{O}(n)$
Passem el penúltim i l'últim valor per no recalcular l'universencer repetidament.

```cpp
int fibonacci__(int n, int a, int b) {
    if (n == 0) return a;
    return fibonacci__(n - 1, b, a + b); 
}

int fibonacci(int n) {
    return fibonacci__(n, 0, 1);
}
```

---

## 4.2 L'Arbre Binari (`BinTree<T>`)

És una estructura no lineal, que o bé és absolutament **buida** o conté una `arrel` amb dos subarbres màxim (`Esquerre` i `Dret`).
**Regla C++ de PRO2:** Són inmutables. Un cop fets, no s'hi pot afegir o treure res ("tallar branques"). Se n'ha de construir un de nou sencer.

:::graph
```json
{
  "nodes": [
    { "id": "1", "label": "Arrel", "color": "#10b981" },
    { "id": "2", "label": "Esquerre", "color": "#3b82f6" },
    { "id": "3", "label": "Dret", "color": "#3b82f6" },
    { "id": "4", "label": "Fulla" }
  ],
  "links": [
    { "source": "1", "target": "2", "label": "left()" },
    { "source": "1", "target": "3", "label": "right()" },
    { "source": "2", "target": "4" }
  ]
}
```
:::

**Constructors essencials:**
- `BinTree()`: Arbre absolutament buit.
- `BinTree(x)`: Arbre d'un sol node amb valor `x`.
- `BinTree(x, left, right)`: Arbre de valor `x` enllaçant 2 subarbres inferiors.

Les consultes fonamentals:
- `t.empty()`: Comprova si és nul. Tota recursió ha de començar mirant això.
- `t.value()`: El valor arrel *(Només d'ús lícit si `!empty()`)*.
- `t.left()` i `t.right()`: Accedeix purament als subarbres.

---

## 4.3 Funcions de Laboratori (El "Pa de cada dia")

### Altura i Cerca d'Elements

```cpp
// Altura = +1 comptant el camí escollit més gran
int height(const BinTree<int>& t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}

// L'operador || curtocircuita la feina i assegura estalvi (O(logN))
bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    return cerca(t.left(), x) || cerca(t.right(), x);
}
```

### Mutacions constructives (Sense trencar l'original)

```cpp
// Afegeix un enter positiu 'k' a tots els racons
BinTree<int> add(const BinTree<int>& t, int k) {
    if (t.empty()) return t;
    return BinTree<int>(t.value() + k, add(t.left(), k), add(t.right(), k));
}

// Talla per complet el que no tinguin exactament igual dos arbres (Intersecció)
BinTree<int> intersect(BinTree<int> A, BinTree<int> B) {
    if (A.empty() || B.empty() || A.value() != B.value()) return BinTree<int>(); 
    return BinTree<int>(A.value(), intersect(A.left(), B.left()), intersect(A.right(), B.right()));
}
```

---

## 4.4 Els Recorreguts Globals

La decisió sobre d'avaluar i imprimir abans de buscar, alterarà completament la nostra sortida.

### Profunditat (DFS): Explotació Recursiva
Baixar pel túnel fins el final abans d'escanejar lateralment. 

- **Preordre:** *Arrel 👉 Esquerre 👉 Dret.* (Idoni per a replicar-se).
:::algoviz{algorithm="preordre"}
:::

- **Inordre:** *Esquerre 👉 Arrel 👉 Dret.* (Llegeix estructures per ordre estricte alfabètic als BST).
:::algoviz{algorithm="inordre"}
:::

- **Postordre:** *Esquerre 👉 Dret 👉 Arrel.* (Primer tanca els fills i destrueix, deixant l'arrel de final).
:::algoviz{algorithm="postordre"}
:::

### Amplada (BFS): Escaneig per Onades 
Creuem els nivells plans 0, 1, 2... Sense recursivitat directe! S'empra **obligatoriament una cua (`queue`)**.

```cpp
template<typename T>
void breadth_first(const BinTree<T>& t) {
    if (t.empty()) return;
    
    queue<BinTree<T>> Q;
    Q.push(t);
    
    while (!Q.empty()) {
        BinTree<T> act = Q.front(); 
        Q.pop();
        
        cout << act.value() << ' '; 
        
        if (!act.left().empty()) Q.push(act.left());
        if (!act.right().empty()) Q.push(act.right());
    }
}
```

:::algoviz{algorithm="bfs"}
:::

---

## 4.5 Eficiència Multitasca (`pair<A, B>`)

Si demanen informació doble d'un arbre, si no empra una tupla d'agrupació per viatge, suspendràs en temps de requeriment pel control per recórrer el mateix $\mathcal{O}(n^2)$ el node.  A C++ el tipificat `std::pair` ens brinda solucionar sumatoris.

```cpp
// First -> Sumatori valors 
// Second -> Nodes existents
pair<double, int> sum_and_sz__(const BinTree<double>& t) {
    if (t.empty()) return {0.0, 0};
    
    auto L = sum_and_sz__(t.left());
    auto R = sum_and_sz__(t.right());
    
    return {
        t.value() + L.first + R.first, 
        1 + L.second + R.second
    };
}

// Funció matriu intocable de base
double mitjana(const BinTree<double>& t) {
    auto res = sum_and_sz__(t);
    return res.first / res.second;
}
```

---

## 4.6 Reconstruir arbres (`cin >>`)

Als laboratoris t'enviaran seqüències textuals on la presència d'un Nul apareix gravada com un `#`.

### 1. Des de Preordre (Directe i Recursiu)
Com que l'arrel ve primer: llegeixes node, crees branca esquerra, crees branca dreta.

```cpp
template <typename T> 
pro2::BinTree<T> reconstruir_preordre(istream& in) {
    string token;
    in >> token;
    
    // Hem xocat amb paret nul·la ("#"), retornem subarbre buit tallant recursions!
    if (token == "#" || !in) return pro2::BinTree<T>(); 
    
    T val;
    istringstream(token) >> val;
    
    // Apuntem cap els dos següents bucles on la consola espera de manera idèntica les parts.
    auto esquerra = reconstruir_preordre<T>(in);
    auto dreta = reconstruir_preordre<T>(in);
    
    return pro2::BinTree<T>(val, esquerra, dreta);
}
```

### 2. Des de Postordre (Amb Pila `stack`)
Com que l'arrel ens arriba *al final de tot*, la recursivitat pura no s'hi pot aplicar ràpidament. A la universitat us obliguen a apilar:

```cpp
template<typename T>
pro2::BinTree<T> reconstruir_postordre(istream& in) {
    stack<pro2::BinTree<T>> S;
    string text;
    
    while (in >> text) {
        if (text == "#") {
            S.push(pro2::BinTree<T>()); // Arbre mort / Buit
        } else {
            T val; 
            istringstream(text) >> val;
            
            // Atenció a l'ordre! El dret està per sobre de l'esquerre a la pila.
            auto dreta = S.top(); S.pop();  
            auto esquerra = S.top(); S.pop();
            
            S.push(pro2::BinTree<T>(val, esquerra, dreta));
        }
    }
    return S.top();
}
```

---

## 4.7 Simulador Interactiu d'Arbres

Mira com avança recursivament el codi a través dels sub-arbres fins atènyer la fulla i arrossega cap amunt gràcies a l'arquitectura dels frames en la immersió per parelles.

:::oopviz{simulation="arbre_bintree_immersio"}
:::
