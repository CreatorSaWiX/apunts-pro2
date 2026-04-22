---
title: "Tema 3: Grafos Eulerianos y Hamiltonianos"
description: "Caminos y ciclos y sus teoremas asociados."
order: 3
readTime: "15 Min"
---

Los grafos eulerianos y hamiltonianos responden a dos problemas clásicos: recorrer todas las aristas sin repetir ninguna (euleriano) y recorrer todos los vértices sin repetir ninguno (hamiltoniano).

## 1. Grafos eulerianos: recorrido de aristas

El objetivo es recorrer un grafo pasando por **todas las aristas exactamente una vez**.

*   **Sendero euleriano**: Un recorrido no cerrado que pasa por todas las aristas de un grafo conexo sin repetir ninguna.
*   **Circuito euleriano**: Un recorrido cerrado (ciclo) que pasa por todas las aristas de un grafo conexo sin repetir ninguna.
*   **Grafo euleriano**: Un grafo que contiene un circuito euleriano.

### Teorema de Euler
Un grafo conexo es **euleriano** si y solo si **todos sus vértices tienen grado par**.

:::graph{height=200}
```json
{
  "nodes": [
    { "id": "A1", "label": "d=2", "color": "#3b82f6" },
    { "id": "A2", "label": "d=2", "color": "#3b82f6" },
    { "id": "B1", "label": "d=2", "color": "#ef4444" },
    { "id": "B2", "label": "d=2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }
  ]
}
```
:::

Si es un circuito, cada vez que llegas a un vértice por una arista, necesitas otra arista para salir de él. Por lo tanto, las aristas incidentes a cada vértice deben ir en parejas (una de entrada y una de salida).

### Corolario para senderos eulerianos
Un grafo conexo tiene un **sendero euleriano** (pero no circuito) si y solo si tiene **exactamente dos vértices de grado impar**. 
En este caso, el sendero comenzará obligatoriamente en uno de los vértices de grado impar y acabará en el otro.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "A", "label": "Grado 2", "color": "#10b981" },
    { "id": "B", "label": "Grado 3", "color": "#ef4444" },
    { "id": "C", "label": "Grado 3", "color": "#ef4444" },
    { "id": "D", "label": "Grado 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "A", "target": "B" }, { "source": "A", "target": "C" },
    { "source": "B", "target": "C" }, { "source": "B", "target": "D" },
    { "source": "C", "target": "D" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-rose-400">NO euleriano (tiene sendero)</b><br/>Tiene exactamente 2 nodos de grado impar (B y C).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "label": "Grado 2", "color": "#10b981" }, { "id": "2", "label": "Grado 2", "color": "#10b981" },
    { "id": "3", "label": "Grado 2", "color": "#10b981" }, { "id": "4", "label": "Grado 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "3", "target": "4" }, { "source": "4", "target": "1" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-emerald-400">Grafo euleriano</b><br/>Todos los nodos tienen grado par.</div>
::::

:::::

:::tip{title="Truco de Examen: El juego algebraico del euleriano"}
Examen típico: "¿Para qué valores de $n$, el grafo complementario $T^c$ es euleriano?" El examen juega donde no puedes ver gráficos, solo ecuaciones de letras muertas.
Si preguntan esto, invoca rápidamente el "Grado del Complementario" del Tema 1:
$$g_{T^c}(v) = (n - 1) - g_T(v)$$
Y aquí aplicamos Euler puro: **Para que $T^c$ sea euleriano, el resultado de esa ecuación TODAS LAS VECES para TODOS los elementos debe dar obligatoriamente un valor PAR.**
:::

Puedes ver cómo se evalúan programáticamente los grados impares para decidir si es o no euleriano en el algoritmo a continuación:

:::algoviz{algorithm="eulerian_check"}
:::

---

## 2. Grafos hamiltonianos: recorrido de vértices

Mientras Euler se fijaba en las aristas, Hamilton se fija en los **vértices**. El objetivo es visitar cada vértice exactamente una vez.

*   **Camino hamiltoniano**: Un camino que pasa por **todos los vértices** del grafo sin repetir ninguno.
*   **Ciclo hamiltoniano**: Un ciclo que pasa por **todos los vértices** del grafo exactamente una vez (excepto el vértice origen/destino).
*   **Grafo hamiltoniano**: Un grafo que contiene un ciclo hamiltoniano.

Lamentablemente, saber si un grafo general es hamiltoniano es un problema **NP-Completo**. No existe ninguna regla fácil e infalible (como los grados pares de Euler) para afirmarlo o denegarlo a primera vista. Nos basamos en condiciones y exploración con *backtracking*.

### 2.1 Condiciones necesarias (Si no se cumplen, NO puede ser Hamiltoniano)

1. **Grado mínimo $g_{min} \ge 2$**: En un ciclo debemos entrar y salir de cada vértice por dos aristas diferentes. Si el grafo tiene vértices de grado 1 (hojas), es imposible que sea hamiltoniano.
2. **Teorema de la eliminación de vértices**: Si eliminamos un conjunto de vértices $S$, el número de componentes conexas resultantes, $c(G-S)$, no puede superar el número de vértices eliminados:
   $$c(G-S) \le |S|$$

:::tip{title="Cómo descartar Hamilton en el examen"}
El Teorema de la eliminación es tu mejor arma. Si encuentras un solo vértice que, al eliminarlo, deja el grafo partido en 2 o más trozos (vértice de corte), el grafo **no es hamiltoniano** porque $c(G-S) \ge 2$ pero $|S|=1$.

**Por familias de grafos:**
- **Árboles:** Nunca son hamiltonianos (tienen hojas).
- **Bipartitos completos ($K_{r,s}$):** Solo son hamiltonianos si $r = s$.
- **Rueda ($W_n$):** Siempre es hamiltoniana (el ciclo exterior ya nos da el camino).
:::

### 2.2 Condiciones suficientes (Si se cumplen, SÍ que lo es seguro)

Estas condiciones garantizan la existencia de un ciclo si el grafo tiene "muchas" aristas:

- **Teorema de Dirac**: Si todos los vértices tienen grado $g(v) \ge \frac{n}{2}$, el grafo es **hamiltoniano**.
- **Teorema de Ore**: Si para cada pareja de vértices **no adyacentes** $u, v$, la suma de sus grados es $g(u) + g(v) \ge n$, el grafo es **hamiltoniano**.

### El algoritmo de exploración (backtracking)

Para encontrar un camino hamiltoniano en general necesitamos probar rutas a fondo confiando en no equivocarnos y haciendo _backtracking_ (marcha atrás) cuando llegamos a un callejón sin salida:

:::algoviz{algorithm="hamiltonian_backtrack"}
:::
