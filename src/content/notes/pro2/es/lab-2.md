---
title: "Lab 2: Estructuras de datos lineales"
description: "Sesión de laboratorio resuelta. Stacks y queues (pilas y colas)."
readTime: "12 min"
order: 2.5
---

## 1. Pilas (stacks) y colas (queues) de la STL

El segundo laboratorio nos pone a prueba con *Data Structures* lineales. Utilizaremos el equivalente de la Standard Template Library (STL) para los contenedores `Stack` y `Queue`. Si alguna vez has visto apilar platos (el último plato que pones es el primero en lavar) o ponerte en una fila en el supermercado (el primero en llegar es el primero en salir), acabas de entender al 100% qué es una pila y una cola.

### Interfaces: `Stack` y `Queue`

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6">
<div>

```cpp [Interface Pila (Stack)]
s.push(x) // Pone arriba.
s.top()   // Mira el de arriba.
s.pop()   // Saca de arriba.
s.empty() // ¿Está vacía?
s.size()  // Elementos.
```
</div>
<div>

```cpp [Interface Cola (Queue)]
q.push(x) // Pone atrás.
q.front() // Mira el de adelante.
q.pop()   // Saca de adelante.
q.empty() // ¿Está vacía?
q.size()  // Elementos.
```
</div>
</div>

---

<!-- 2. Doctest -->

## 2. Tests automáticos con Doctest

El juez realiza múltiples pruebas introduciendo datos en tu código para averiguar si tiene algún error. Estas pruebas automáticas se amparan en C++ bajo el framework **Doctest**. Una vez has programado tu solución (ej. `reverse.cc`), se te incluye en el laboratorio el `Doctest` y el `Makefile`. Solo habrá que ejecutar el comando:

```bash
make test
```


---

## 3. Pilas (Stacks)

Garantizan el sistema **LIFO: Last In, First Out** (Último en entrar, primero en salir).

### Ejercicio 1: Reverse

Consiste en leer números constantes e imprimirlos al revés. ¡El apilamiento lo hace automáticamente! Introduciremos los números uno tras otro asimétricamente en el top de la Pila hasta que no haya datos que leer de la cadena de entrada (`while (cin >> n)`). Una vez llenos, solo vamos imprimiendo la cima del actual recurso(`top()`) y desapilamos (`pop()`) hasta el fondo.

<details>
<summary>Código solución: reverse.cc</summary>

```cpp [p1-reverse/reverse.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void reverse(istream& in, ostream& out) {
    Stack<int> s;
    int n;
    while (in >> n) {
        s.push(n);
    }
    
    // Vamos desapilando y llamando al TOP para extraer en inverso
    while (!s.empty()) {
        out << s.top();
        s.pop();
        if (!s.empty()) out << " ";
    }
    out << endl;
}
```
</details>

:::oopviz{simulation="stack_reverse"}
:::

### Ejercicio 2: Validar Paréntesis

Apilamos solo las aperturas (`(` o `[`). Cuando llega un cierre (`)` o `]`), comprobamos si cuadra con el último abierto almacenado en la cima de la pila (`top()`). Si cuadran, lo retiramos con `.pop()`. Cualquier discrepancia o paréntesis que quede colgado significa secuencia incorrecta.

<details>
<summary>Código solución: parentesis.cc</summary>

```cpp [p2-parentesis/parentesis.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void parentesis(istream& in, ostream& out) {
    Stack<char> s;
    char c;
    int pos = 1;

    // Leemos ignorando espacios (in >> c) hasta toparnos con el carácter punto delimitador puro
    while (in >> c and c != '.') {
        // Apilamos aperturas en el frente puro
        if (c == '(' or c == '[') {
            s.push(c);
        } 
        else if (c == ')' or c == ']') {
            // Cierre excesivo o previo no cuadra
            if (s.empty()) {
                out << "Incorrecte " << pos << endl;
                return;
            }
            char top = s.top();
            // Evaluamos matching y lo deshacemos seguramente:
            if ((c == ')' and top == '(') or (c == ']' and top == '[')) {
                s.pop();
            } else {
                out << "Incorrecte " << pos << endl;
                return;
            }
        }
        pos++;
    }

    // Finalizado, si ha quedado alguna apertura libre pendiente consideraremos error
    if (s.empty()) out << "Correcte\n";
    else out << "Incorrecte " << pos << endl;
}
```
</details>

:::oopviz{simulation="stack_parentesis"}
:::

### Ejercicio 3: Recursividad simulada con Pilas

El ordenador utiliza una pila oculta (el Call-Stack) para procesar funciones recursivas. Este ejercicio nos demuestra cómo cualquier función recursiva del tipo $f(n-1)$ puede traducirse a código iterativo. En el bucle iterativo tomamos el `.top()`, y si cumple la condición de viabilidad ($v > 0$), simulamos la creación teórica de actividades añadiendo manualmente dos operaciones más pequeñas a la pila.

<details>
<summary>Código solución: recursivitat.cc</summary>

```cpp [p3-recursivitat/recursivitat.cc]
#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterando continuamente hasta haber desapilado por puro toda acción virtual
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // Instanciamos instinto base C++, hacia atrás ya que el siguiente paso querrá 
            // hacer 'pop' y consumir el "MÁS NUEVO"
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}
```
</details>

:::oopviz{simulation="stack_recursivitat"}
:::

---

## 4. Colas (Queues)

Las colas garantizan el estándar **FIFO: First In, First Out**. ¡Usaremos `front` al revés para divisar exclusivo salidas lineales presente!

### Ejercicio 5: La Patata Caliente

Resuelve el problema cíclico de Josephus de $N$ participantes utilizando solo una Cola. Para simular pasadas rotativas de 1 en 1 de la patata caducable a paso de $K$, cogemos repetidamente el jugador del `front()`, lo purgamos `.pop()` de la cabeza de la línea y lo enviamos inmediatamente sano y salvo hacia donde no le toque `.push()`. Pasados $K$ giros, el que permanezca en la cabeza se borra de la partida para siempre hasta que solo quede 1.

<details>
<summary>Código solución: patata.cc</summary>

```cpp [p5-patata-calenta/patata.cc]
void patata_calenta(istream& in, ostream& out) {
    int N, k;
    if (in >> N >> k) {
        Queue<int> q;
        for (int i = 1; i <= N; ++i) {
            q.push(i); // Nombres y gente dentro del juego
        }
        
        bool first = true;
        while (q.size() > 1) { // Hasta que sobreviva solo puro 1 individuo
            // Hacemos K giros o "pasos de patatas calientes" hacia fin del ciclo
            for (int i = 0; i < k; ++i) {
                int front = q.front();
                q.pop();
                q.push(front);
            }
            
            if (!first) out << " ";
            // La pobre alma delantera que acaba tocando recibe la expulsión inmediata
            out << q.front();
            q.pop(); 
            first = false;
        }
        
        if (!first) out << endl;
        if (q.size() == 1) {
            out << "Supervivent: " << q.front() << endl;
        }
    }
}
```
</details>

:::oopviz{simulation="queue_patata"}
:::

### Ejercicio 6: Contador Recientes (Sliding Window)

Dado un umbral base de tolerancia de tiempo $T$, ¿cuántos anteriores siguen "vivos" pasado el tiempo? Este patrón se conoce como ventana deslizante ("Sliding Window") y es la principal propiedad vitalicias útil de una cola. Al leer un nuevo instante ($actual$), caducamos los más viejos utilizados mirando el `front()`: Si es menor que $actual - T$, lo podemos dar por prescrito. Acabada la purga secuencial, ¡pedimos simple qué `size()` activo tenemos!

<details>
<summary>Código solución: recents.cc</summary>

```cpp [p6-compta-recents/recents.cc]
void compta_recents(istream& in, ostream& out) {
    int N, T;
    if (in >> N >> T) {
        Queue<int> q;
        bool first = true;
        
        for (int i = 0; i < N; ++i) {
            int t;
            in >> t;
            q.push(t);
            
            // Evaluador externo caducando antiguos viejos almacenados de espanto 
            // que quedan en ninguna parte por el rango de tiempo y de Cola fuera:
            while (!q.empty() && q.front() < t - T) {
                q.pop();
            }
            
            if (!first) out << " ";
            out << q.size(); // Muestra base activos vivos
            first = false;
        }
        out << endl;
    }
}
```
</details>

:::oopviz{simulation="queue_recents"}
:::
