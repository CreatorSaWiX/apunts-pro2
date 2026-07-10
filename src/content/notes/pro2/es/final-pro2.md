---
title: "Final PRO2"
description: "Resumen de los temas 8 a 12 de PRO2 basado en las implementaciones reales del Jutge"
readTime: "8 min"
order: 14
draft: false
isUpdated: 1
---

## 1. Tema 8: Punteros y memoria dinámica

### Operadores
*   **`&x`**: Obtiene la **dirección de memoria** donde está guardada la variable `x`.
*   **`*p`**: Acceder al valor guardado en la dirección de memoria a la que apunta. Recordemos que `int* p` e `int *p` es lo mismo.
*   **`p->membre`**: Equivale a `(*p).membre`. Acceder al miembro de un struct apuntado por `p`.

> **`nullptr` o `NULL`**: Valor seguro que indica que el puntero no apunta a ninguna dirección (inicializa siempre con `nullptr`, nunca los dejes apuntando a basura: `int *p = nullptr;`).

### Errores comunes
1.  **Segmentation Fault (SEGFAULT)**: Intentar acceder a una dirección que no te pertenece o desreferenciar `nullptr`.
Ejemplo
2.  **Memory Leak**: Perder el único puntero que apuntaba a memoria pedida con `new` sin hacer el `delete` correspondiente.
Ejemplo
3.  **Dangling Pointer (Puntero colgante)**: Puntero que apunta a una dirección de memoria que ya ha sido liberada con `delete`.
Ejemplo
4.  **Double-Delete**: Intentar hacer `delete` dos veces sobre la misma dirección de memoria (corrompe la pila del Heap).
Ejemplo

### Paso de Parámetros
*   **Por valor (`f(int x)`)**: Copia del valor. Ineficiente para estructuras/objetos grandes.
*   **Por referencia (`f(int& x)`)**: Las modificaciones afectan al main. Preferimos `const T& x` por eficiencia si no queremos modificar el objeto.
*   **Por puntero (`f(int* px)`)**: Pasa la dirección de memoria. Permite que el parámetro pueda ser opcional pasándole `nullptr`.

### Tips
- **¿Has puesto `nullptr`?** Comprueba siempre si un puntero es nulo antes de hacer `p->next`.
- **¿Has hecho `delete`?** Cada `new` debe tener su `delete` para evitar Memory Leaks.
- **Casos vacíos**: ¿Qué hace tu código si la pila/cola está vacía? ¿Y si tiene solo 1 elemento?
- **Auto-asignación**: En el uso de `operator=`, ¿has comprobado `if (this != &s)`?

### X87185: Eliminación en Pila (`removeFirstOccurrence` - stack.hh)
Para eliminar elementos en una estructura simple, usamos una **ventana de tamaño 2** utilizando dos punteros (`pitem` y `prev`). El puntero `prev` se debe inicializar obligatoriamente a `nullptr` en lugar de dejarlo vacío.
```cpp
void removeFirstOccurrence(T value) {
    Item *pitem = ptopitem;
    Item *prev = nullptr; // Inicialización segura
    
    // 1. Búsqueda del elemento a borrar
    while (pitem != nullptr && pitem->value != value) {
        prev = pitem;
        pitem = pitem->next;
    }

    // 2. Si se ha encontrado, lo desconectamos y liberamos la memoria
    if (pitem != nullptr) {
        Item *paux = pitem;
        pitem = pitem->next;

        if (prev == nullptr) ptopitem = pitem; // Si es el primer elemento (cima)
        else prev->next = pitem;              // Si está en medio o al final
            
        delete paux; // Liberamos memoria del nodo destrozado
        _size--;
    } 
}
```

### X17005: Mover elementos en Cola (`moveFrontToLast` - queue.hh)
Desplazamiento físico de nodos en $\Theta(1)$ sin tener que borrar y crear nuevos nodos con `new`:
```cpp
void moveFrontToLast() {
    if (first == nullptr || first == last) return; // Menos de 2 elementos: nada que hacer

    Item *oldFirst = first;   // 1. Guardamos puntero al primer nodo
    first = oldFirst->next;   // 2. El segundo pasa a ser el nuevo primero

    last->next = oldFirst;    // 3. El antiguo primero pasa a ser el siguiente del último
    oldFirst->next = nullptr; // 4. Marcamos el nuevo final como NULL
    last = oldFirst;          // 5. Actualizamos el puntero final al movido
}
```

---

## 2. Tema 9: Implementación de Vectores

Un vector es un **array dinámico** guardado en un bloque de memoria contiguo en el *Heap*.

### Atributos de Clase
*   `T* data_`: Puntero al bloque del Heap donde se almacenan los elementos.
*   `int size_`: Elementos ocupados actualmente.
*   `int capacity_`: Memoria total reservada en el Heap.

### La Regla de los Tres
Si una clase gestiona memoria dinámica directamente (haciendo `new`), debe implementar obligatoriamente tres métodos especiales para evitar que C++ haga copias superficiales (*shallow copies*) que apunten a las mismas direcciones:

### A. Constructor de Copia (Deep Copy)
Crea un objeto nuevo reservando memoria propia en el Heap y copiando todos los elementos:
```cpp
Vector(const Vector& v) {
    data_ = new T[v.capacity_];
    size_ = v.size_;
    capacity_ = v.capacity_;
    for (int i = 0; i < size_; ++i) data_[i] = v.data_[i];
}
```

### B. Operador de Asignación (`operator=`)
Limpia el objeto actual, evita la auto-asignación y copia de forma profunda:
```cpp
Vector& operator=(const Vector& v) {
    if (this != &v) { // 1. Evita auto-asignación (l1 = l1)
        delete[] data_; // 2. Libera memoria vieja
        data_ = new T[v.capacity_]; // 3. Pide memoria nueva
        size_ = v.size_;
        capacity_ = v.capacity_;
        for (int i = 0; i < size_; ++i) data_[i] = v.data_[i]; // 4. Copia datos
    }
    return *this; // Permite asignación encadenada (a = b = c)
}
```

### C. Destructor
El único encargado de liberar definitivamente la memoria del bloque:
```cpp
~Vector() { delete[] data_; }
```

### Crecimiento y Coste Amortizado
*   **`push_back`**: Si el vector se llena (`size_ == capacity_`), pide un bloque que **dobla** la capacidad ($2 \times \text{capacity}$). Este redimensionamiento cuesta $\mathcal{O}(n)$, pero al pasar solo cada $2^k$ veces, el coste de cada inserción es **coste amortizado $\mathcal{O}(1)$**.
*   **`pop_back` (Thrashing)**: Para evitar redimensionamientos constantes en el límite (añadir/borrar continuamente), no reducimos inmediatamente. Solo se reduce la capacidad a la mitad cuando la cantidad de elementos ocupados baja a **$1/4$** de la capacidad total. Coste amortizado $\mathcal{O}(1)$.

::vectorviz

---

## 3. Tema 10: Implementación de Listas

A diferencia de los vectores, una lista aloja cada elemento en un nodo disperso en memoria que contiene enlaces hacia adelante y hacia atrás.

### Struct del Nodo
```cpp
struct Item {
    T value;
    Item *next; // Siguiente nodo
    Item *prev; // Nodo anterior
};
```

### Nodos Centinela (`iteminf` e `itemsup`)
Esta implementación utiliza dos nodos reales extremos que **siempre existen** (incluso si la lista está vacía):
*   **`iteminf`** (ficticio inicial): `iteminf.next` apunta al primer elemento de verdad.
*   **`itemsup`** (ficticio final): `itemsup.prev` apunta al último elemento de verdad.
*   **Ventaja**: Elimina completamente el tratamiento de casos especiales por punteros `nullptr` en los extremos al insertar o sacar nodos.

::linkedlistviz

### Insertar/Borrar en $\Theta(1)$
Si disponemos del iterador o de la dirección del nodo, podemos "recoser" los enlaces directamente en tiempo constante:
*   **Insertar antes de `p`**: 
    1.  Crear nuevo nodo `n`.
    2.  `n->prev = p->prev; n->next = p;`
    3.  `p->prev->next = n; p->prev = n;`
*   **Borrar nodo `p`**:
    1.  `p->prev->next = p->next;`
    2.  `p->next->prev = p->prev;`
    3.  `delete p;`

### El uso de los Helpers Internos (`extractItem` e `insertItem` - list.hh)
En las clases de listas del Jutge, tienes disponibles dos métodos privados muy potentes que se encargan de recoser los enlaces y actualizar `_size` de forma transparente:
*   `void extractItem(Item *pitem)`: Desconecta el nodo sin liberarlo de memoria.
*   `void insertItem(Item *pitemprev, Item *pitem)`: Conecta el nodo directamente después del nodo previo especificado.

### X25312: Mover Elementos de Lista (`moveSecondToLast` - list.hh)
Utilizando estos helpers, mover elementos sin tocar el `.value` es muy sencillo y evita totalmente tener que modificar manualmente los 4 punteros de doble enlace:
```cpp
void moveSecondToLast() {
    if (_size > 2) {
        Item *second = iteminf.next->next; // 1. Encontramos el segundo elemento
        extractItem(second);                // 2. Lo desconectamos físicamente
        insertItem(itemsup.prev, second);   // 3. Lo insertamos antes del centinela superior
    }
}
```

### Tabla de Costes y Complejidades Comparativa

| Estructura / Operación | Acceso aleatorio `[i]` | Inserción Principio | Inserción Final | Inserción Medio (con posición / it) | Distribución en memoria |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`std::vector`** | $\Theta(1)$ | $\Theta(N)$ | $\mathcal{O}(1)^*$ | $\Theta(N)$ | Bloque contiguo (excelente cache local). |
| **`std::list`** | $\Theta(N)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | Nodos dispersos conectados por punteros. |

*\*Coste amortizado. En el peor caso para vector es $\mathcal{O}(N)$ debido al realojamiento de memoria (`reallocate_`).*

---

## 4. Tema 11: Implementación de Árboles Binarios (`Arbre.hh`)

Estructura de datos dinámica y recursiva donde cada nodo tiene exactamente dos subárboles (izquierdo y derecho).

### Estructura de Nodo
```cpp
struct node_arbre {
    T info;
    node_arbre *segE; // Subárbol izquierdo
    node_arbre *segD; // Subárbol derecho
};
node_arbre *primer_node; // Raíz (nullptr si vacío)
```

### Regla de los Tres en Árboles
1.  **Copia profunda**: Se hace a través de una inmersión recursiva en **pre-orden** que duplica cada nodo del heap.
2.  **Destrucción**: Se debe realizar recursivamente en **post-orden** (primero liberamos el subárbol izquierdo, luego el derecho y finalmente hacemos `delete` de la raíz actual para evitar perder las direcciones).

### A. Control de ciclos en `plantar(x, a1, a2)`
Cuando plantamos un nuevo nodo `x` con dos subárboles `a1` y `a2`, el método **mueve los punteros** en lugar de duplicar para conseguir un coste de $\Theta(1)$. Sin embargo, tiene una comprobación crucial para evitar **aliasing inestable** en caso de que intentemos poner el mismo subárbol a la izquierda y a la derecha (`plantar(x, a, a)`):
```cpp
void plantar(const T &x, Arbre &a1, Arbre &a2) {
    if (this != &a1 && this != &a2) {
        if (primer_node == nullptr) {
            node_arbre* aux = new node_arbre;
            aux->info = x;
            aux->segE = a1.primer_node; // Mueve hijo izquierdo de forma directa
            
            // Si son el mismo árbol físico, se debe hacer copia profunda de uno de ellos para evitar ciclos
            if (a1.primer_node == a2.primer_node) {
                aux->segD = copia_node_arbre(a1.primer_node);
            } else {
                aux->segD = a2.primer_node; // Mueve hijo derecho de forma directa
            }
            
            primer_node = aux;
            a1.primer_node = nullptr; // Deja los parámetros originales vacíos
            a2.primer_node = nullptr;
        }
        // ...
    }
}
```

### B. Transferencia y destrucción del padre en `fills(fe, fd)`
El método `fills` divide el árbol en dos ramas en $\Theta(1)$ pasando directamente las referencias de memoria, y es muy importante destacar que **hace `delete aux` para liberar únicamente la memoria del nodo padre/raíz** que ya no es necesario, sin afectar a los subárboles de debajo.
```cpp
void fills (Arbre &fe, Arbre &fd) {
    if (primer_node != nullptr && fe.primer_node == nullptr && fd.primer_node == nullptr) {
        if (&fe != &fd) {       
            node_arbre* aux = primer_node;
            fe.primer_node = aux->segE; // Paso de punteros directo
            fd.primer_node = aux->segD;
            primer_node = nullptr;      // Deja el padre vacío
            delete aux;                 // Libera exclusivamente el nodo raíz antiguo
        }
        // ...
    }
}
```

---

## 5. Tema 12: Implementación de Árboles Generales (`ArbreG.hh`)

Un árbol general (n-ario) permite que cada nodo tenga un número ilimitado de descendientes.

### Estructura del Nodo
```cpp
struct node_arbreGen {
    T info;
    vector<node_arbreGen*> seg; // Vector dinámico de punteros a los hijos
};
node_arbreGen* primer_node; // Puntero a la raíz
```

### Recursividad con Bucles
Como el grado de los nodos es dinámico, las operaciones recursivas ya no se pueden escribir con dos llamadas fijas (izquierda y derecha). Se debe iterar utilizando un **bucle `for`** a lo largo del vector `seg`:
*   **Copia recursiva**: Aloja un nuevo nodo, reserva su vector de hijos con el mismo tamaño que el original y, con un bucle, copia recursivamente cada hijo.
*   **Borrado**: Recorre recursivamente todos los hijos del vector `seg` en bucle para borrarlos antes de liberar el nodo padre actual.

### Particularidades de las Operaciones del Jutge (`ArbreG.hh`)

### A. Transferencia de propiedad en `plantar(x, v)` y `fills(v)`
*   **`plantar(x, v)`**: Transfiere de forma eficiente los punteros de todos los subárboles contenidos en el vector `v` como hijos de la nueva raíz `x` en tiempo $\mathcal{O}(N)$ (siendo $N$ el número de hijos), e inmediatamente **establece los árboles de `v` como vacíos** (`v[i].primer_node = nullptr`) para evitar aliasing.
*   **`fills(v)`**: Libera memoria del nodo raíz actual con `delete aux` y coloca todos los hijos exactamente como nuevos árboles dentro del vector `v` en $\mathcal{O}(N)$.

### B. Copia profunda forzada en `afegir_fill(a)` y `fill(a, i)`
*   **`afegir_fill(a)`**: **¡Alerta!** A diferencia de `plantar`, este método **no transfiere punteros** directamente; en su lugar, hace una **copia profunda del árbol `a`** a través de `copia_node_arbreGen(a.primer_node)`.
*   **`fill(a, i)`**: Toma el hijo `i`-ésimo del árbol `a` y hace una copia profunda como nuevo árbol actual. Recuerda que la llamada es **1-indexed** (es decir, el hijo 1 del árbol equivale internamente a la posición indexada `0` del vector de hijos `seg[i-1]`).

---

## 6. Estrategia para ejercicios de árboles (Salto de fe)

La gran mayoría de problemas de árboles se resuelven con una función recursiva inmersiva. Esta estrategia permite escribir códigos de examen ultra-limpios sin tener que intentar simular mentalmente la pila de llamadas del procesador:

1.  **El Caso Base (La condición de parada)**: Olvídate del árbol entero y pregúntate: *¿Qué es lo más simple que me pueden pasar?* 
    *   En árboles, casi siempre es un árbol vacío (`node == nullptr`). Ejemplo `X75329`: ¿Cuál es la frecuencia de un valor en un árbol vacío? `0`. Este es tu caso base.
    *   Si el problema requiere calcular una propiedad sobre **caminos que van desde la raíz hasta una hoja**, el caso base **no puede ser el árbol vacío**, ya que no sabríamos qué devolver para un puntero nulo sin alterar la semántica o violar la definición de camino. Por lo tanto, en estos casos especiales, el caso base es el **nodo hoja** (`m->segE == nullptr && m->segD == nullptr`). Además, habrá que gestionar de manera explícita los casos donde el nodo solo tiene un único hijo activo para obligar al camino a continuar hacia él. Ejemplo: `X67695`.
2.  **La Fe Ciega (El Salto de Fe)**: **Escribe las llamadas recursivas** sobre los hijos activos (ej: `T res = f(m->segE);`), asumiendo y confiando ciegamente en que cada una de estas llamadas te devolverá *mágicamente* la respuesta correcta de todo su respectivo subárbol. 
    *   *Regla de oro:* No intentes simular ni imaginar mentalmente cómo la función irá bajando por los subárboles; simplemente llámala y guarda el resultado.
3.  **Tu Único Trabajo (El nodo actual)**: Identifica qué dato local necesitas del nodo actual. Normalmente es el valor de la raíz en la que te encuentras en el presente (`m->info`).
4.  **La Combinación Final (El montaje)**: ¿Cómo unes el dato local del presente (Paso 3) con los resultados que te han devuelto las llamadas recursivas de tus hijos (Paso 2)?
    *   Aquí es donde aplicas la lógica algebraica del problema (operaciones como `+`, `&&`, comparaciones `>` o condicionales para elegir el mejor resultado). 
    *   Ejemplo: Devuelves `m->info + (esquerra > dreta ? esquerra : dreta)`.

### Equivalencia de la Estrategia: Binario vs General (n-ario)

| Fase | Árbol Binario (`Arbre.hh`) | Árbol General (`ArbreG.hh`) |
| :--- | :--- | :--- |
| **1. Caso Base** | `if (m == nullptr) return ...;`<br>*(O caso de nodo hoja si hablamos de caminos)* | `if (m == nullptr) return ...;`<br>*(O caso de nodo hoja si hablamos de caminos)* |
| **2. Salto de Fe** | Llamadas recursivas directas a hijo izquierdo (`m->segE`) y derecho (`m->segD`). | Bucle `for` que acumula recursivamente el resultado de cada uno de los hijos en el vector `m->seg`. |
| **3. Trabajo en el Nodo** | Procesar el dato del nodo actual (`m->info`). | Procesar el dato del nodo actual (`m->info`). |
| **4. Combinación** | Combinar el trabajo local con el de la izquierda y la derecha. | Combinar el trabajo local con la suma/acumulación obtenida en el bucle de hijos. |

### Ejemplo 1: Suma del camino máximo (`max_suma_cami` - Binario)
*Enunciado: Calcula la suma del camino de suma máxima desde la raíz a una hoja de un árbol binario no vacío.*

*   **Caso Base**: Si un nodo es una hoja (hijos nulos), el camino máximo es simplemente su propio valor.
*   **Salto de Fe**: Asumimos que el hijo izquierdo me da su camino máximo `maxE`, y el derecho `maxD`.
*   **Combinación**: Mi camino máximo será mi valor (`m->info`) más el máximo de los caminos de los dos subárboles.

```cpp
T max_suma_cami_aux(node_arbre* m) {
    // Caso Base: Nodo Hoja
    if (m->segE == nullptr && m->segD == nullptr) return m->info;

    // Salto de Fe: Asumimos que por debajo ya funciona
    T maxE = max_suma_cami_aux(m->segE);
    T maxD = max_suma_cami_aux(m->segD);

    // Combinación
    if (m->segE == nullptr) return m->info + maxD;
    if (m->segD == nullptr) return m->info + maxE;
    return m->info + max(maxE, maxD);
}
```

### Ejemplo 2: Búsqueda de un valor (`buscar` - Árbol General)
*Enunciado: Indica si un valor `x` se encuentra o no en un árbol general n-ario.*

*   **Caso Base**: Si el árbol está vacío, es imposible que esté (`return false`).
*   **Mi trabajo**: ¿Soy yo el nodo que buscamos? `if (m->info == x) return true;`.
*   **Salto de Fe en n-arios**: Si no soy yo, pregunto en bucle a cada uno de mis hijos si lo tienen. Si cualquier hijo me dice `true`, propago el `true` hacia arriba. Si ningún hijo lo tiene, devuelvo `false`.

```cpp
bool buscar_aux(node_arbreGen* m, const T& x) {
    if (m == nullptr) return false; // Caso Base
    
    if (m->info == x) return true; // Mi trabajo

    // Salto de Fe en n-arios: bucle sobre el vector de hijos
    int n = m->seg.size();
    for (int i = 0; i < n; ++i) {
        if (buscar_aux(m->seg[i], x)) return true; // Si un hijo lo encuentra, devolvemos true
    }
    return false; // Ningún hijo lo ha encontrado
}
```

### Ejemplo 3: El Árbol de Sumas (`arb_sumes` - Binario)
*Enunciado: Devuelve un nuevo árbol idéntico en forma donde cada nodo contiene la suma de todo su subárbol correspondiente.*

*   **Caso Base**: Si el árbol está vacío, el subárbol suma es nulo y la suma es `0`.
*   **Salto de Fe**: Asumimos que el hijo izquierdo calcula correctamente su árbol de sumas `asumE` y me devuelve su suma acumulada `sumE`. Lo mismo para la derecha con `asumD` y `sumD`.
*   **Mi trabajo + Combinación**: Mi suma es `m->info + sumE + sumD`. Creo un nuevo nodo con este valor y lo conecto con los dos subárboles resultantes.

```cpp
// Auxiliar que recibe el nodo actual, construye el subárbol de sumas en 'res' y devuelve la suma
static int arb_sumes_aux(node_arbre* m, node_arbre*& res) {
    if (m == nullptr) {
        res = nullptr;
        return 0; // Caso base
    }

    res = new node_arbre;
    
    // Salto de Fe: Asumimos que izquierda y derecha se construyen solas y nos dan las sumas
    int sumE = arb_sumes_aux(m->segE, res->segE);
    int sumD = arb_sumes_aux(m->segD, res->segD);

    // Mi trabajo + Combinación
    res->info = m->info + sumE + sumD;
    return res->info;
}
```
