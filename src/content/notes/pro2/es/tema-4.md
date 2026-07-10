---
title: "Tema 4: Inmersión y árboles binarios"
description: "Vencer las limitaciones de la recursividad y dominio total y rápido de los árboles binarios."
readTime: "8 min"
order: 4
---

## 4.1 La inmersión

Cuando una función se llama a sí misma de forma recursiva, la memoria pide un nuevo bloque (*frame*) para ejecutar su instancia particular. En el examen no podemos alterar la "firma pública" (si te dicen haz `reverse(string s)`, no puedes añadir argumentos por tu cuenta). La estrategia de la **Inmersión** responde de esta manera:
1. Crear una segunda función auxiliar.
2. Hacer que la función pública pre-cargue esta función de inmersión oculta.

### Invertir String (`reverse`)
Necesitamos un acumulador para guardar el *string* girado. Pasando un simple segundo parámetro por inmersión conseguimos llevar el cálculo entre instancias:

```cpp
// 1. Función inmersa (auxiliar)
string reverse__(string s, string reversed) {
    if (s.empty()) return reversed;
    return reverse__(s.substr(1), s[0] + reversed);
}

// 2. Función pública (Interfaz original)
string reverse(string s) {
    return reverse__(s, ""); 
}
```

### Fibonacci en $\mathcal{O}(n)$

La recursión exponencial convencional al calcular Fibonacci repetía llamadas sobre llamadas lastimosamente provocando parálisis matemáticas de $\mathcal{O}(2^n)$. Con una única Inmersión bajamos y solucionamos el coste a lineal $\mathcal{O}(n)$ pasando por el viaje directamente la evolución de los dos últimos números obtenidos.

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

## 4.2 El árbol binario (`BinTree<T>`)

Es una estructura de datos estrictamente recursiva: o es un *vacío absoluto*, o tiene un nodo central (*raíz*) asociado como máximo a dos descendientes exactos (`izquierdo` y `derecho`) que a la vez, son considerados subárboles `BinTree` respectivos en sí mismos.

:::graph
```json
{
  "nodes": [
    { "id": "1", "label": "Raíz", "color": "#10b981" },
    { "id": "2", "label": "Izquierdo", "color": "#3b82f6" },
    { "id": "3", "label": "Derecho", "color": "#3b82f6" },
    { "id": "4", "label": "Hijo izq" },
    { "id": "5", "label": "Hijo izq", "color": "#ef4444" },
    { "id": "6", "label": "Hijo der" },
    { "id": "7", "label": "Hijo der", "color": "#ef4444" }
  ],
  "links": [
    { "source": "1", "target": "2", "label": "left()" },
    { "source": "1", "target": "3", "label": "right()" },
    { "source": "2", "target": "4" },
    { "source": "2", "target": "5" },
    { "source": "3", "target": "6" },
    { "source": "3", "target": "7" }
  ]
}
```
:::

> Un árbol BinTree **NO se puede modificar**. Una vez haces el constructor y lo cierras, nunca podrás acceder a licencias como *"coger su rama derecha nativa y borrarla con un delete o set"*. Para alterar datos, se opera **re-construyendo completamente el mismo árbol como Instancia Nueva** gracias a aprovechar todas las partes antiguas junto con el cambio. (Mira debajo, el apartado 4.3).

:::bintreeviz
:::

---

## 4.3 Funciones básicas y de mutación

Vamos a transformar los dos problemas más comunes a la clase `BinTree` (Saber la altura total `height` o buscar si existe una hoja `cerca`):

:::algoviz{algorithm="cerca_height"}
:::

Como el árbol no tiene punteros libres o licencias de asignación de variables nativas como Vectores positivos, **cualquier operación que "modifique" un árbol** en teoría, en la práctica C++, ¡lo que hace es reconstruirlo entero creando nuevos nodos por la zona o rama que haya sufrido el cambio! Revisiones inmutables.

---

## 4.4 Los recorridos globales

### Búsqueda en profundidad (DFS)
Bajar por el túnel hasta el final antes de escanear lateralmente. 

- **Preorden:** *Raíz → Izquierdo → Derecho.*
:::algoviz{algorithm="preordre"}
:::

- **Inorden:** *Izquierdo → Raíz → Derecho.*
:::algoviz{algorithm="inordre"}
:::

- **Postorden:** *Izquierdo → Derecho → Raíz.*
:::algoviz{algorithm="postordre"}
:::

### Búsqueda en anchura (BFS)

:::algoviz{algorithm="bfs"}
:::

---

## 4.5 Eficiencia multitarea (`pair<A, B>`)

Si nos piden resolver dos cosas a la vez (ej: *¿Está sub-equilibrado? ¿Y qué altura tiene?*), lanzar dos funciones de búsqueda separadas provocará un desastre de eficiencia a $\Theta(N^2)$.
**La solución:** Buscar en una sola pasada, devolviendo los dos datos a la vez dentro de una tupla `std::pair` ($\Theta(N)$).

A continuación vemos cómo extraer tanto la suma de todos los valores *como* la cantidad de nodos con un solo `std::pair` para averiguar la media global:

:::algoviz{algorithm="eficiencia_multitasca"}
:::

---

## 4.6 Leer y Reconstruir Árboles

En los Jueces del laboratorio recibirás los árboles representados en una línea de texto plano (ej: `10 5 # # 14 # #`), donde un **`#`** indica "Sub-árbol Vacío".
Aquí tienes una utilidad rápida auxiliar de conversión:

```cpp
template <typename T>
T read_value(string text) {
    istringstream iss(text);
    T elem;
    iss >> elem;
    return elem;
}
```

### 1. Leyendo en formato Preorden (Lo habitual)
Muy directo: La raíz siempre es la primera en entrar por el `cin`. Después vienen los de la izquierda, y finalmente los de la derecha.

:::algoviz{algorithm="reconstruccio_preordre"}
:::

### 2. Leyendo en formato Postorden (Con Pila `stack`)
Si no hay más remedio y te lo dan en Postorden, la lectura normal falla porque "la información de la raíz llega en el último segundo a tu teclado". Tendremos que leerlo todo al revés apilando directamente en un `stack` hasta resolver el camino entero hacia arriba:

<!-- ```cpp
template<typename T>
pro2::BinTree<T> bintree_from_postorder(istream& in) {
    stack<pro2::BinTree<T>> S;
    string token;
    
    while (in >> token) {
        if (token == "#" || !in) {
            S.push(pro2::BinTree<T>()); 
        } else {
            T value = read_value<T>(token);
            
            // Ligadura fuerte de examen clásico por si la entrada rompe el índice assert.
            assert(S.size() >= 2);
            
            // ¡Vigilar el voltear! La Derecha domina en lo superior del espacio y va a recibir pop primero
            auto right = S.top(); S.pop();  
            auto left = S.top(); S.pop();
            
            // ¡Árbol entero reconstruido hacia arriba!
            S.push(pro2::BinTree<T>(value, left, right));
        }
    }
    assert(S.size() == 1);
    return S.top();
}
``` -->

<!-- ---

## 4.7 Simulador Interactivo de Árboles

Mira cómo avanza recursivamente el código a través de los sub-árboles hasta alcanzar la hoja y arrastra hacia arriba gracias a la arquitectura de los frames en la inmersión por parejas.

:::oopviz{simulation="arbre_bintree_immersio"}
::: -->
