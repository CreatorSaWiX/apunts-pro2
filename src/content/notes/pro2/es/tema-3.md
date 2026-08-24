---
title: "Tema 3: Listas e iteradores"
description: "Estudio de las listas enlazadas y los iteradores para recorrer secuencias en C++."
readTime: "9 min"
order: 3
---

## 3.1 Listas vs vectores

Las **listas (`list`)** solucionen el alto coste de inserción en medio de los vectores $\mathcal{O}(n)$. Están formadas por nodos independientes enlazados. Añadir o borrar un elemento intermedio cuesta solo $\mathcal{O}(1)$.

<br>

**Desventajas:**

- **Sin posiciones directas:** Utilizar `L[i]` genera error de compilación.
- **Coste de travesía:** Para llegar a $n$, hay que recorrer secuencialmente todos los nodos anteriores.

**Métodos $\mathcal{O}(1)$:** `push_back()`, `push_front()`, `pop_back()`, `pop_front()`, `front()` y `back()`.

:::listviz
:::

:::info
Aunque las listas sean de coste constante en medio de la secuencia, en términos generales de eficiencia se suele priorizar el uso del `std::vector` dado que almacena memoria en bloques contiguos muy listos de leer. Solo usaremos listas si el problema exige constantes inserciones y borrados intermedios.
:::

---

## 3.2 Iteradores

Las listas se deben recorrer usando **iteradores**:

- `L.begin()`: Devuelve el iterador apuntando al **primer** elemento.
- `L.end()`: Devuelve el iterador que señala la celda virtual **después del último** elemento (fuera de rango).
- Se accede a su valor utilizando el asterisco como desreferenciación: `*it = 50`.
- Se pasa al siguiente elemento evaluando el símbolo suma: `it++`.

```cpp
list<int> L = {10, 20, 30};

// Se usa 'auto' para simplificar tipos extremadamente largos como 'list<int>::iterator'
for (auto it = L.begin(); it != L.end(); it++) {
    *it += 5; 
}
```

**Variantes principales de iteradores:**
- **`const_iterator` (`cbegin`, `cend`)**: Si la lista se pasa como constante `const`, no permite mutar los datos mediante `*it = x;`.
- **`reverse_iterator` (`rbegin`, `rend`)**: Permite recorrer la lista del final al principio manteniendo la comodidad técnica aplicando en el fondo normalmente el `it++`.

Retroceder manualmente desde `L.end()` con iteradores trae problemas técnicos de índice ya que la evaluación arranca "en el límite donde ya no hay nada". Observa de qué manera avanza el simulador respecto al trazado inverso:

:::oopviz{simulation="iteradors_reversos"}
:::

---

## 3.3 Modificar listas mientras se recorren: `insert` y `erase`

Cuando borramos o insertamos elementos en una lista mientras la recorremos con un iterador, el iterador antiguo queda invalidado. Para solucionarlo, C++ devuelve **un nuevo iterador válido**:

- `it = L.insert(it, x)`: Inserta `x` **antes** de la posición actual y devuelve el iterador al nuevo elemento insertado.
- `it = L.erase(it)`: Borra el elemento actual y devuelve el iterador al **siguiente elemento**.

### Cómo recorrer y borrar con `while`

Si borramos un elemento, **no debemos hacer `it++`**, ya que `erase` ya nos coloca en el siguiente:

```cpp
void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it);   // Ya avanza al siguiente (no hacemos it++)
        } 
        else if (*it == -1) {
            L.insert(it, 0);    // Inserta 0 antes de -1 (it sigue en -1)
            it++;               // Avanzamos para pasar el -1
        } 
        else {
            it++;               // Solo avanzamos si no hemos borrado
        }
    }
}
```

:::oopviz{simulation="llista_iteradors"}
:::
