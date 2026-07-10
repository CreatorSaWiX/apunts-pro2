---
title: "Tema 5: Colas de prioridad y árboles generales"
description: "Estructuras avanzadas de binary heaps para colas y árboles generales."
readTime: "8 min"
order: 5
---

## 5.1 La cola de prioridad

A diferencia de una cola normal FIFO (el primero en entrar es el primero en salir), una **cola de prioridad** atiende siempre al elemento **más grande o urgente** de todos los que esperan, sin importar cuándo ha entrado. 

Si lo hacemos en un simple vector ordenado, el `push` es absurdamente lento $\mathcal{O}(N)$ moviendo todos los elementos. Y si la hacemos desordenada, el `pop` tardará $\mathcal{O}(N)$ en buscar dónde escondíamos el máximo. Necesitamos llevar el coste de ambas acciones a un corto **$\mathcal{O}(\log N)$**. ¿Cuál es la herramienta definitiva? El **binary heap**.

---

## 5.2 El binary heap

Es un **árbol binario completo** modelado dentro de un *simple vector plano*. La raíz siempre es el elemento máximo absoluto de toda la estructura.

El árbol ignora la posición 0. La raíz dominante vive coronada en la posición 1. 
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
<div>

Para cualquier nodo en la posición $i$:
- **Padre:** `i / 2`
- **Hijo Izquierdo:** `2 * i`
- **Hijo Derecho:** `2 * i + 1`

</div>
<div>

:::graph
```json
{
  "nodes": [
    { "id": "0", "label": "Padre (i/2)", "color": "#facc15" },
    { "id": "1", "label": "Nodo (i)", "color": "#10b981" },
    { "id": "2", "label": "Hijo Izq (2i)", "color": "#3b82f6" },
    { "id": "3", "label": "Hijo Der (2i+1)", "color": "#3b82f6" },
    { "id": "4", "label": " ", "color": "#facc15" }
  ],
  "links": [
    { "source": "0", "target": "1" },
    { "source": "4", "target": "0" },
    { "source": "1", "target": "2" },
    { "source": "1", "target": "3" }
  ]
}
```
:::

</div>
</div>


No hacen falta punteros ni reglas complejas, todo es aritmética fulgurante en $\mathcal{O}(1)$.

### `push()` - insertar y subir (flow up)
El elemento entra por la última posición del vector. Entonces se evalúa de abajo a arriba: *¿Soy más grande que mi jefe?* Si sí, intercambio (`swap`) de posición con él hacia arriba, iterando la subida hasta encontrar su lugar jerárquico. Ejemplo:

:::algoviz{algorithm="heap_push"}
:::

### `pop()` - extraer y bajar (flow down)
El rey (posición 1) ha salido al ser procesado. Para sustituirlo, tomamos el "peón" (último de todos en el vector) y lo plantamos en la casilla 1 de la raíz. Entonces evalúa de arriba a abajo contra los dos hijos: *¿Cuál de mis dos nuevos súbditos inferiores es más grande que yo?*. Intercambio de posición con el hijo **más grande**, iterando hacia abajo de golpe bajando al agujero que se merece.

:::algoviz{algorithm="heap_pop"}
:::

> **Resumen de tiempos heap:** `top()` obtiene la raíz en lo inmediato **$\mathcal{O}(1)$**. Las inserciones y limpiezas modifican la altitud del árbol, requiriendo solo saltos de coste **$\mathcal{O}(\log N)$**.

---

## 5.3 Customizando elementos: el operador `>`

A menudo tus elementos a examinar serán tuplas o customizaciones como la propia `struct Persona`. Dado que tú le pides al Heap que *coloque el máximo arriba*, tendrás que dar reglas de juego (C++) donde redefinas literalmente el operador MÁS GRANDE (`>`) entre dos personas en el ambiente global.

```cpp
struct Persona {
    string nom;
    int prioritat;
};

// Sobre-escribimos la lógica de "más grande" de C++
bool operator>(const Persona& a, const Persona& b) {
    return a.prioritat > b.prioritat; 
}
```

¡En el `main::` una vez hacemos `Heap<Persona> cua;` la directiva interna ya sabe clasificar VIPs rápido por la edad o puntuación pre-cargada!

---

## 5.4 Árboles generales (`Tree<T>`)

Se acabó el limitarse al cerrado izquierdo/derecho. En un `Tree<T>`, un nodo Padre puede albergar un número arbitrario de nodos hijo infinito. Un **"vector"** literal de hijos.

Esto cambia toda la matriz de búsqueda. La etapa recursiva de llamar al `t.left()` y `t.right()` se modifica completamente adoptando un **bucle iterativo sobre las pertenencias `t.child(i)`**, pero el resto de artificios recursivos e inmutables restan exactos.

La clase tiene la siguiente organización visible a la pública:
- `Tree()`: creador estándar vacío absoluto.
- `Tree(const T& val)`: crea la coronación (hoja única base del valor sin hijos).
- `Tree(const T& val, vector<Tree> fills)`: Crea raíz asignando un valor e inyectando una ramificación múltiple de golpe hechos gracias a un vector inicial pre-cargado.

Consultoras prácticas para nuestra recursión:
1. `value()`: para leer el corazón de la raíz.
2. `num_children()`: para la condición tope al límite iterativo ($N$ hijos).
3. `child(i)`: desplazamiento en el vector interno extrayendo cada nodo padre para reiniciar la llamada de salto.

### Buscar profundamente en un general
Se itera la cantidad de hijos de 0 a limite-1. En caso de un acierto interior devolvemos el booleano a la cadena superior parando toda dispersión errática cerca de un $\mathcal{O}(N)$ salvador. No esperamos que todo acabe como en el recurso de dos alas antiguo, al encontrar la clave cortocircuitamos la estrategia con un True contundente que desapila sin remordimientos hacia la raíz principal garantizando prestaciones robustas e impecables al sistema de objetivos modernos de datos.

:::algoviz{algorithm="tree_general_search"}
:::
