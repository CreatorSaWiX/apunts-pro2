---
title: "Tema 4: Árboles y árboles generadores"
description: "La estructura estrella. Caracterización y la secuencia de Prüfer."
order: 4
---

Un árbol es la estructura preferida de la informática para representar jerarquías. A diferencia de un grafo arbitrario donde puedes quedar atrapado en un ciclo (rotonda), los árboles se expanden puramente sin rutas de retorno.

## 1. Conceptos básicos

*   **Árbol**: Todo grafo conexo y acíclico.
*   **Bosque**: Grafo acíclico formado por uno o más árboles (componentes conexos independientes).
*   **Hoja**: Todo vértice en un bosque que tenga grado 1.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "Raiz", "color": "#facc15", "label": "Raíz" }, { "id": "A" }, { "id": "B" },
    { "id": "Hoja1", "color": "#10b981", "label": "Hoja" }, { "id": "C" },
    { "id": "Hoja2", "color": "#10b981", "label": "Hoja" },
    { "id": "Hoja3", "color": "#10b981", "label": "Hoja" }
  ],
  "links": [
    { "source": "Raiz", "target": "A" }, { "source": "Raiz", "target": "B" },
    { "source": "A", "target": "Hoja1" }, { "source": "A", "target": "C" },
    { "source": "C", "target": "Hoja2" }, { "source": "B", "target": "Hoja3" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-amber-400">Árbol único</b><br/>Conexo y acíclico. En verde las hojas (grado 1).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "group": 1 }, { "id": "2", "group": 1 }, { "id": "3", "group": 1 },
    { "id": "4", "group": 2 }, { "id": "5", "group": 2 }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "4", "target": "5" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-sky-400">Ejemplo de Bosque</b><br/>No hay ciclos, pero tiene 2 componentes conexos separados.</div>

::::

:::::

### Propiedades fundamentales

Si $T$ es un árbol:
1.  **Mínimo 2 hojas**: Si $n \ge 2$, el árbol tiene al menos dos hojas (vértices de grado 1).
2.  **Aristas puente**: Todas las aristas de un árbol son puentes. Si se elimina una arista, el grafo deja de ser conexo y se divide en exactamente 2 componentes.
3.  **Vértices de corte**: Eliminar un vértice de grado $k$ divide el árbol en exactamente $k$ componentes.

:::note{title="Estructura de Examen: La Biestrella"}
Una **Biestrella** es un árbol que tiene **exactamente dos vértices que no son hojas**. 
*   Visualmente, son dos vértices centrales conectados entre sí, y cada uno de ellos tiene un número de hojas colgando.
*   **Diámetro**: El diámetro de una biestrella es siempre $3$ (la distancia más larga es entre dos hojas de lados opuestos).
:::

### Teoremas de caracterización
Un grafo $G$ de orden $n$ y tamaño $m$ es un árbol si cumple **dos** de estas tres condiciones:
1.  $G$ es conexo.
2.  $G$ es acíclico.
3.  $m = n - 1$.

:::tip{title="Ex1-Parcial-2014"}
**Problema:** Demostrad que un grafo de orden $n$ y tamaño $m$ es árbol si y solo si es acíclico y $m = n-1$.

<details>
<summary><b>Ver la demostración</b></summary>

1. ($\implies$) Si $G$ es un árbol, entonces es acíclico por definición. Demostramos que $m = n-1$ por inducción sobre $n$:
    
    **Caso base ($n=1$):** Un nodo y 0 aristas. $m = 0 = 1-1$. Correcto.
   
   **Paso inductivo:** 
    * **H.I.:** Supongamos que la fórmula $m=n-1$ es cierta para todos los árboles de $n=k$ vértices.
    * **T.I.:** Un árbol de $n=k+1$ nodos tiene al menos una hoja (vértice de grado 1). Si la eliminamos junto con su arista, obtenemos un nuevo árbol de $n=k$ nodos. Por hipótesis de inducción, este tiene $m = k-1$ aristas. Al restaurar la hoja y la arista original, tenemos $m = (k-1) + 1 = k = (k+1)-1$.

2. ($\impliedby$) Si $G$ es acíclico y $m = n-1$, tenemos que demostrar que es conexo (y por tanto un árbol):
    * Supongamos que $G$ tiene $k$ componentes conexas $C_1, C_2, \dots, C_k$. Como el grafo es acíclic, cada componente también lo es y, por ser conexa, cada $C_i$ es un árbol.
    * Para cada componente $C_i$, sabemos que $m_i = n_i - 1$.
    * Sumando todas las aristas: $m = \sum_{i=1}^k m_i = \sum_{i=1}^k (n_i - 1) = \sum n_i - \sum 1 = n - k$.
    * Como se nos dice que $m = n - 1$, entonces $n - k = n - 1 \implies \mathbf{k = 1}$.
    * Al haber una sola componente, el grafo es conexo y queda demostrado que es un árbol.
</details>
:::

Otras caracterizaciones:
*   Existe un **único camino** entre cualquier pareja de vértices.
*   Es acíclico, pero si añadimos cualquier arista nueva, se crea exactamente un ciclo.

### Tip de examen:
La mayoría de problemas numéricos se resuelven combinando el lema de los apretones de manos con la propiedad $m = n - 1$: $$ \sum_{v \in V} g(v) = 2n - 2 $$

:::tip{title="Ejemplo de cálculo de hojas"}
**Problema:** Un árbol tiene 3 vértices de grados 4, 3 y 2. El resto son hojas. ¿Cuántas hojas tiene?
**Solución:**
1.  Sean $f$ el número de hojas.
2.  Orden total: $n = f + 3$ (las hojas + los 3 vértices conocidos).
3.  Suma de grados: $4 + 3 + 2 + (f \cdot 1) = 9 + f$.
4.  Aplicamos la ecuación: $9 + f = 2(f + 3) - 2 \implies 9 + f = 2f + 4 \implies f = 5$.
:::

---

## 2. Árboles generadores

Un **árbol generador** de un grafo $G$ es un subgrafo que contiene todos los vértices de $G$ y es un árbol.
*   **Existencia**: Un grafo tiene un árbol generador si, y solo si, es **conexo**.

### Algoritmos de construcción
Podemos obtener árboles generadores recorriendo el grafo de dos maneras principales. Observa cómo un mismo grafo (una rueda $W_4$) produce resultados totalmente diferentes:

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=200}
{
  "nodes": [
    { "id": "A", "label": "Raíz", "color": "#facc15" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" }
  ],
  "links": [
    { "source": "A", "target": "B", "color": "#f87171", "width": 3 }, 
    { "source": "B", "target": "C", "color": "#f87171", "width": 3 }, 
    { "source": "C", "target": "D", "color": "#f87171", "width": 3 }, 
    { "source": "D", "target": "E", "color": "#f87171", "width": 3 }
  ]
}
:::
<div class="text-center text-sm"><strong>DFS (Profundidad)</strong><br/>Genera caminos largos y profundos.</div>
::::

::::grid{cols=1}
:::graph{height=200}
{
  "nodes": [
    { "id": "A", "label": "Raíz", "color": "#facc15" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" }
  ],
  "links": [
    { "source": "A", "target": "B", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "C", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "D", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "E", "color": "#60a5fa", "width": 3 }
  ]
}
:::
<div class="text-center text-sm"><strong>BFS (Amplitud)</strong><br/>Genera estructuras "panzudas" (estrellas).</div>
::::

:::::

:::tip{title="Nota sobre Isomorfismos"}
Como vemos en el dibujo superior, un mismo grafo puede generar árboles generadores **no isomorfos**. En la rueda $W_4$, el BFS desde el centro genera una estrella ($K_{1,4}$), mientras que el DFS genera un camino ($P_5$).
:::

---

## 3. Enumeración y secuencia de Prüfer

**¿Cuántos árboles diferentes podemos formar con $n$ vértices etiquetados?**
*   **Teorema de Cayley**: Existen exactamente $n^{n-2}$ árboles diferentes.

### Secuencia de Prüfer
Es una bijección que permite codificar un árbol etiquetado de $n$ vértices en una secuencia de longitud $n-2$.

**Algoritmo de codificación:**
1.  Busca la hoja con la etiqueta más pequeña.
2.  Apunta a su vecino en la secuencia.
3.  Elimina la hoja.
4.  Repite hasta que solo queden 2 vértices.

::videoviz{url="/m1/prufer_build.webm" delay="2000"}

:::tip{title="Relación Grado-Secuencia"}
Esta es la clave para los exámenes:
$$ \text{Grado de } v = (\text{veces que } v \text{ sale en la secuencia}) + 1 $$
*   Las **hojas** son los vértices que **no aparecen nunca** en la secuencia.
*   Si un vértice sale $k$ veces, su grado es $k+1$.
:::

**Algoritmo de decodificación:** Permite recuperar el árbol a partir de la secuencia.

::videoviz{url="/m1/prufer_rebuild.webm" delay="2000"}
