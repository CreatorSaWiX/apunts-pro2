---
title: "Tema 8: Punters i memòria dinàmica"
description: "Gestió de memòria en C++, operadors, aliasing i gestió del 'heap'."
readTime: "20 min"
order: 9
draft: false
isUpdated: 2
---

## 8.1 La memòria en C++: Stack vs Heap

Per entendre els punters, primer cal conèixer com s'organitza la memòria RAM d'un programa en C++:

| Característica | Stack (Pila) | Heap (Monticle) |
| :--- | :--- | :--- |
| **Gestió** | **Automàtica**: el compilador reserva i allibera espai. | **Manual**: el programador decideix quan demanar (`new`) i alliberar (`delete`). |
| **Velocitat** | Molt ràpida (punter de pila contigu). | Més lenta (cerca de blocs lliures al sistema). |
| **Mida** | Limitada i fixa (uns quants MB, risc d'*Stack Overflow*). | Molt gran (tota la memòria RAM disponible). |
| **Cicle de vida** | Lligat a l'àmbit (*scope*) entre claus `{}`. | Persistent fins que s'executa `delete`. |

```cpp
int f(int a, int b) {
    int n = a;      // Reserva espai a la pila
    if (b > n) {
        int m = 2;  // 'm' neix a la pila en entrar al bloc if
        a = b;
    }               // 'm' s'allibera automàticament aquí
    return a;
}                   // 'n', 'a' i 'b' s'alliberen automàticament en acabar la funció
```

---

## 8.2 Què és un punter?

Un **punter** és una variable que, en lloc de guardar una dada directa (com `int` o `char`), emmagatzema una **adreça de memòria** d'una altra variable.

### Els tres operadors fonamentals

| Operador | Nom | Funció | Exemple |
| :--- | :--- | :--- | :--- |
| **`&`** | **Adreça de** | Obté l'adreça de memòria d'una variable existent. | `int* p = &x;` |
| **`*`** | **Desreferència** | Accedeix/modifica el valor situat a l'adreça que guarda el punter. | `*p = 20;` |
| **`->`** | **Accés a membre** | Accedeix directament a un camp d'un `struct`/`class`. Equivalent a `(*p).camp`. | `p_node->value = 5;` |

### Distinció fonamental: `p` vs `*p`

```cpp
int x = 10;
int y = 99;
int* p = &x; // 'p' guarda l'adreça de 'x' (ex: 0x7ffd8)

// 1. Llegir
cout << p;   // Imprimeix l'adreça: 0x7ffd8
cout << *p;  // Imprimeix el contingut de x: 10

// 2. Modificar el contingut (*p)
*p = 25;     // Canvia el valor de 'x' a 25!

// 3. Modificar la referència (p)
p = &y;      // Ara 'p' apunta a 'y'. 'x' es manté en 25 i *p val 99.
```

### Trampes típiques de declaració

1. **Declaració múltiple d'asteriscs:**
   ```cpp
   int *pa, *pb; // Correcte: dos punters a enter
   int* pa, pb;  // Perill: 'pa' és punter, però 'pb' és un int normal!
   ```
2. **Punters a membres de contenidors o tuples:**
   ```cpp
   vector<int> v = {10, 20, 30};
   int* pv = &v[1]; // Apunta al 20
   *pv += 5;        // v[1] ara val 25

   pair<string, int> persona = {"Anna", 21};
   int* pedat = &persona.second;
   *pedat = 22;     // persona.second ara val 22
   ```

:::warning
Un punter no inicialitzat (`int* p;`) conté **brossa** (apunta a una adreça aleatòria de memòria). Intentar llegir o escriure amb `*p` provocarà un **Segmentation Fault** o corrupció de dades. Si un punter no apunta a cap lloc inicialment, assigna-li sempre **`nullptr`**:
```cpp
int* p = nullptr; // Apunta de forma segura a "enlloc"
```
:::

## 8.3 Gestió dinàmica de memòria: `new` i `delete`

La utilitat principal dels punters és gestionar memòria al **Heap** en temps d'execució:

### 1. Objectes individuals
```cpp
int* p_int = new int(42);       // Reserva espai per a un int amb valor 42
delete p_int;                   // Allibera la memòria
p_int = nullptr;                // Evita deixar un punter penjant (dangling pointer)
```

### 2. Blocs / Vectors dinàmics (`new[]` i `delete[]`)
```cpp
int* arr = new int[100];        // Reserva un bloc continu de 100 enters
delete[] arr;                   // Allibera el bloc sencer (sempre amb [])
arr = nullptr;
```

:::warning
- **`delete` vs `delete[]`:** Alliberar un bloc creat amb `new[]` fent servir només `delete` (sense claudàtors) produeix **comportament indefinit** i fuites de memòria.
- **Fuga de memòria (*Memory Leak*):** Es produeix quan es perd l'últim punter que apuntava a un bloc del Heap abans d'haver fet `delete`:
  ```cpp
  int* p = new int(10);
  p = new int(20); // ERROR: L'enter inicial (10) queda orfe a la RAM per sempre!
  ```
:::

---

## 8.4 Aliasing i Còpia Superficial vs Profunda

L'**aliasing** es produeix quan dos o més punters emmagatzemen la **mateixa adreça de memòria**. Qualsevol canvi fet a través d'un àlies modifica la dada per a tots els altres.

```cpp
int x = 10;
int* p1 = &x;
int* p2 = p1; // Aliasing: p2 apunta exactament a la mateixa casella que p1

*p2 = 99;
cout << *p1;  // Imprimeix 99!
```

### Còpia superficial vs profunda
- **Còpia superficial:** Copia les adreces dels punters. Ambdós objectes comparteixen la mateixa memòria.
- **Còpia profunda:** Reserva nova memòria al Heap i duplica el contingut.

---

## 8.5 Errors crítics amb punters

| Error | Causa | Conseqüència | Solució |
| :--- | :--- | :--- | :--- |
| **Segmentation Fault** | Desreferenciar `nullptr` o adreces brossa/fora de rang. | El programa s'atura immediatament (*crash*). | Comprovar sempre `if (p != nullptr)` abans d'usar `*p` o `p->`. |
| **Memory Leak** | Perdre la referència a un bloc del Heap sense `delete`. | Consum continu i innecessari de memòria RAM. | Assegurar un `delete` per cada `new`. |
| **Dangling Pointer** | Punter que segueix guardant una adreça que ja s'ha alliberat. | Dades corromptes o SEGFAULT en accedir-hi. | Assignar `p = nullptr;` immediatament després del `delete`. |
| **Double Delete** | Fer `delete` dues vegades sobre el mateix bloc de memòria. | Corrupció de l'administrador del Heap (*crash*). | Fer `p = nullptr;` (en C++, `delete nullptr;` no fa res i és segur). |

> **Consell per al Jutge/Compilació:** Utilitza el flag `-D_GLIBCXX_DEBUG` al compilar perquè els contenidors de la STL avisin de qualsevol accés fora de rang en lloc de produir errors silenciosos.

---

## 8.6 Pas de paràmetres en funcions

| Tipus de pas | Sintaxi | Quan utilitzar-lo a PRO2 |
| :--- | :--- | :--- |
| **Per valor** | `void f(int x)` | Tipus primitius petits (`int`, `char`, `bool`, `double`). |
| **Per referència constant** | `void f(const string& s)` | **L'estàndard a PRO2** per a estructures grans (`vector`, `list`, `BinTree`, `string`) que només volem llegir sense cost de còpia. |
| **Per referència** | `void f(int& x)` | Quan la funció ha de **modificar directament** l'objecte original. |
| **Per punter** | `void f(Node* p)` | Quan el paràmetre és **opcional** (pot ser `nullptr`) o en estructures enllaçades. |


---

## 8.7 Aplicació: Estructures Enllaçades (Nodes)

La utilitat principal dels punters a PRO2 és crear estructures de dades dinàmiques que creixen i decreixen node a node en memòria. Cada element s'emmagatzema en un **Node** (o `Item`):

```cpp
template <typename T>
struct Node {
    T value;        // Dada emmagatzemada
    Node* next;     // Punter cap al següent node (o nullptr si és l'últim)
};
```

### 8.7.1 La Pila enllaçada (Stack — LIFO)
En una pila dinàmica, només cal mantenir un punter al cim (`top` o `p_top`):
- **`push(x)`**: Es crea un nou node que apunta a l'antic cim, i s'actualitza el cim.
- **`pop()`**: Es guarda el cim temporalment, s'avança el cim al següent node (`top = top->next`) i s'allibera la memòria de l'antic cim.

:::stackviz
:::

> **Reenllaçament (`swap2Topmost`):** Per intercanviar els dos primers nodes sense copiar els seus valors:
> 1. `Node* p2 = top->next;` (guardem el segon node)
> 2. `top->next = p2->next;` (el primer ara apunta al tercer)
> 3. `p2->next = top;` (el segon ara apunta a l'antic primer)
> 4. `top = p2;` (el nou cim és p2)

---

### 8.7.2 La Cua enllaçada (Queue — FIFO)
En una cua dinàmica calen dos punters: **`first`** (per extreure per davant) i **`last`** (per afegir pel final):

:::queueviz
:::

> **Casos especials:**
> - Inserir en cua buida: tant `first` com `last` passen a apuntar al nou node.
> - Treure l'últim element: si després del `pop` la cua queda buida (`first == nullptr`), cal fer també `last = nullptr;`.

---

### 8.7.3 Esborrat de nodes pel mig
Per esborrar un node situat a l'interior d'una seqüència enllaçada:

1. Localitzar el node **anterior** (`ant`) al que volem eliminar.
2. Guardar el node a esborrar: `Node* p_del = ant->next;`
3. Saltar el node: `ant->next = p_del->next;`
4. Alliberar la memòria: `delete p_del;`

:::pointerviz
:::

---

## 8.8 Checklist per a problemes de punters al Jutge

- **Comprovació de `nullptr`:** Assegura't de no fer mai `p->next` o `p->value` si `p == nullptr`.
- **Alliberament amb `delete`:** Cada `new` ha de tenir el seu `delete` corresponent (o en el destructor de la classe).
- **Gestió dels casos límit:**
  - Estructura completament buida (`top == nullptr` o `first == nullptr`).
  - Estructura amb un sol element (on eliminar-lo requereix actualitzar tant `first` com `last` a `nullptr`).
  - Esborrat del primer node vs un node intermedi.
- **Control d'auto-assignació:** En sobrecarregar l'`operator=`, comprova sempre `if (this != &other)` abans d'esborrar la memòria pròpia.
