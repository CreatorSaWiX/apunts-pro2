---
title: "Tema 4: Immersió i Arbres Binaris"
description: "Vèncer les limitacions de la recursivitat i domini total i ràpid dels Arbres Binaris."
readTime: "8 min"
order: 4
---

Aquí és quan l'assignatura de M1 i PRO2 fusionen

## 4.1 La Immersió (I el cost dels Frames)

Quan una funció es crida a si mateixa de forma recursiva, la memòria demana un nou bloc (*frame*) per executar la seva instància particular. En C++, això vol dir que **les variables locals d'una execució no es poden compartir naturalment amb la següent crida a sota**. 

A l'examen no pots alterar la "signatura pública" (si et diuen fes `reverse(string s)`, no pots afegir arguments pel teu compte). L'estratègia de la **Immersió** respon d'aquesta manera:
1. Crear una segona funció occulta/auxiliar (amb **paràmetres extra** necessaris portats per valor o referència oculta).
2. Fer que la teva funció pública invidui inicalment i pre-carregui aquesta funció d'immersió oculta.

### Invertir String (`reverse`)
Necessitem un acumulador per guardar el *string* girat. Passant un simple segon paràmetre per immersió aconseguim portar el càlcul entre instàncies:

```cpp
// 1. Funció Immersa (Auxiliar afegint l'acumulador)
string reverse__(string s, string reversed) {
    if (s.empty()) return reversed;
    return reverse__(s.substr(1), s[0] + reversed);
}

// 2. Funció Pública (Interfície original requerida)
string reverse(string s) {
    return reverse__(s, ""); 
}
```

### Fibonacci en $\mathcal{O}(n)$
La recursió exponencial convencional de Fibonacci trencaria temps de càlcul. Baixem el cost a linear passant l'evolució constant dels dos últims nombres obtinguts.

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

És una estructura de dades estrictament recursiva: o és un buit absolut, o té un node central (*arrel*) proveït per dos descendents exactes màxim (`Esquerre` i `Dret`) que també seran conceptualitzables com a un subarbre BinTree. 
**Regla Estricta C++ de PRO2:** Són estructures totalment immutables. Un cop construït l'arbre o un subarbre, mai es pot modificar alterant o arrancant funcions internes. Les tasques "distructives" operen exclusivament llegint dades creant tot un arbre equivalent paral·lel des de l'arrel amb instàncies formades noves en el transcurs!

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

**Constructors clàssics idèntics a `bintree.hh`:**
- `BinTree()`: Arbre buit sense fills.
- `BinTree(x)`: Arbre d'un sol node (exclusivament valor `x`).
- `BinTree(x, left, right)`: Arbre complert on `x` agrupa dos sub-objectes inferiors com relleus!

Les consultes fonamentals per extreure la part pura:
- `t.empty()`: Retorna un booleà assenyalant buit permanent. Indispensable base per tota recurrència.
- `t.value()`: Extrau el valor numèric / cadena *(Vàlid únicament fora si no està `empty()`!)*.
- `t.left()` i `t.right()`: Excedeix les ramificacions oficials inferiors de procés.

---

## 4.3 Funcions de Laboratori (El Codi Públic Obligatori C++)

### Altura i Cerca d'Elements (`height` & `cerca`)
Fixa't bé en la diferència dels paràmetres i el `template`. A laboratori seran clau:

```cpp
// Retorna la profunditat matemàtica on viatjaria el riu pel lloc de cost més gran
template<typename T> 
int height(BinTree<T> t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}

// Ús crític de l'operador `||` sobre la cerca constant per aturar operacions un cop és real (`O(logN)` base real d'exploració cega).
bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    else if (t.value() == x) return true;
    else return cerca(t.left(), x) || cerca(t.right(), x);
}
```

### Mutacions Constructs 

```cpp
// Suma una constant generant noves posicions construint tot un arbre al moment de la devolució
BinTree<int> add(const BinTree<int>& t, int k) {
    if (t.empty()) return t;
    auto left = add(t.left(), k);
    auto right = add(t.right(), k);
    return BinTree<int>(t.value() + k, left, right);
}

// Filtra dos grans estructures deixant unides únicament les parts simètricament exactes.
BinTree<int> intersect(const BinTree<int>& ta, const BinTree<int>& tb) {
    if (ta.empty() || tb.empty() || ta.value() != tb.value()) return BinTree<int>(); 
    auto left = intersect(ta.left(), tb.left());
    auto right = intersect(ta.right(), tb.right());
    return BinTree<int>(ta.value(), left, right);
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
Creuem els nivells de pisos estructurals. No és possible a recursivitat descendent perquè aquest processament requereix llegir laterals simultàniament! S'empra **obligatòriament per exàmens una Cua (`queue`) i funcions iteratives.**

```cpp
template<typename T>
void breadth_first(BinTree<T> t) {
    if (t.empty()) return;
    
    queue<BinTree<T>> Q;
    Q.push(t);
    
    while (!Q.empty()) {
        BinTree<T> curr = Q.front(); 
        Q.pop();
        
        cout << curr.value() << ' '; 
        
        // Només inclourem branques reals a la cua iterativa d'anàlisi de futur
        if (!curr.left().empty()) Q.push(curr.left());
        if (!curr.right().empty()) Q.push(curr.right());
    }
}
```

:::algoviz{algorithm="bfs"}
:::

---

## 4.5 Eficiència Multitasca (`pair<A, B>`) i Cost $\Theta(N)$

Si demanen una condició doble a una pregunta genèrica (exemple: Retornem que a l'hora estigui equilibrat *i donem també quina altura tenia* o *Retorna'ns ja la Mitjana sencera dividint la seva suma pels sub-nodes comptats*), ens trobarem amb un problema extrem: Iterar un sumatori un per un cridant sobre crides iteratives on el teu `left` i `right` et multipliquen la carrega pel processament creant costs absoluts llastimosos d'escala de bucles ineficients matemàtics en $\Theta(N^2)$.

Solució oficial UPC? Introducció directa pels laboratoris d'assignar la classe tupla `std::pair` amb sub-crides per realitzar retorn multitasca dins instàncies $\Theta(N)$.

```cpp
// First -> Sumatori valors 
// Second -> Mida de quantitat Nodes emmagatzemats
pair<double, int> sum_and_size__(BinTree<double> t) {
    if (t.empty()) return {0.0, 0};
    
    auto L = sum_and_size__(t.left());
    auto R = sum_and_size__(t.right());
    
    // Suma per a extreure a .first / Compte d'elements unitari .second
    return {
        t.value() + L.first + R.first, 
        1 + L.second + R.second
    };
}

// Interfície netejadora final de cara al lliurement a usuari
double average(BinTree<double> t) {
    auto res = sum_and_size__(t);
    return res.first / res.second;
}
```

---

## 4.6 Reconstruir arbres (`cin >>`)

Als laboratoris t'enviaran seqüències textuals on la presència d'un valor fantasma *buit* es representa oficial d'estàndards com de '#' al *String*. Necessitem empaquetar una desgravadora:

```cpp
template <typename T>
T read_value(string text) {
    istringstream iss(text);
    T elem;
    iss >> elem;
    return elem;
}
```

### 1. Des de Preordre (Directe i Recursiu)
Com que l'arrel ve primer: llegeixes node, crees branca esquerra confiant que ella s'anirà emplenat preordre com t'han demanat i després demanes crear en cua a variables la part dreta. Molt intuïtiu.

```cpp
template <typename T> 
pro2::BinTree<T> bintree_from_preorder(istream& in) {
    string token;
    in >> token;
    
    // Condicional tancat i blindat respecte a arrels mortes # detectades
    if (token == "#" || !in) return pro2::BinTree<T>(); 
    
    T value = read_value<T>(token);
    
    auto left = bintree_from_preorder<T>(in);
    auto right = bintree_from_preorder<T>(in);
    
    return pro2::BinTree<T>(value, left, right);
}
```

### 2. Des de Postordre (La Màgia de  Pila `stack` lligada)
Atenció! Com l'arrel serà sempre completament l'últim caràcter a un text escrit "postordre", un bucle normal d'avanç temporal directe de teclat trenca. Les solucions obliguen emmagatzemar invers al sistema de `stack` i unir cap endarrere com es veu.

```cpp
template<typename T>
pro2::BinTree<T> bintree_from_postorder(istream& in) {
    stack<pro2::BinTree<T>> S;
    string token;
    
    while (in >> token) {
        if (token == "#" || !in) {
            S.push(pro2::BinTree<T>()); 
        } else {
            T value = read_value<T>(token);
            
            // Lligament fort d'examen clàssic per si l'entrada trenca l'index assert.
            assert(S.size() >= 2);
            
            // Vigilar el capgirar! La Dreta domina al superior de l'espai i va rebré pop primer
            auto right = S.top(); S.pop();  
            auto left = S.top(); S.pop();
            
            // Arbre sencer reconstruït cap amunt!
            S.push(pro2::BinTree<T>(value, left, right));
        }
    }
    assert(S.size() == 1);
    return S.top();
}
```

---

## 4.7 Simulador Interactiu d'Arbres

Mira com avança recursivament el codi a través dels sub-arbres fins atènyer la fulla i arrossega cap amunt gràcies a l'arquitectura dels frames en la immersió per parelles.

:::oopviz{simulation="arbre_bintree_immersio"}
:::
