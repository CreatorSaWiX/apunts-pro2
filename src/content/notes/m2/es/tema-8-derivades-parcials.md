---
title: "Tema 8: Derivada parcial y gradiente"
description: "Cálculo diferencial multivariable: derivadas direccionales, vectores gradiente, diferenciabilidad y el plano tangente."
order: 8
readTime: "20 min"
subject: "m2"
draft: false
isNew: true
---

## 1. Derivadas parciales y direccionales

### 1.1 Interpretación geométrica
Para entender qué es la **derivada direccional** $D_{\mathbf{v}}f(\mathbf{a})$ (Derivada direccional de $f$ en el punto $\mathbf{a}$ según el vector $\mathbf{v}$), pensemos en el método del **corte vertical**:

1.  **Plano $\pi$**: Imaginamos un cuchillo vertical que pasa por $\mathbf{a}$ siguiendo la dirección de $\mathbf{v}$.
2.  **Curva de intersección $C$**: El corte sobre la superficie (el "pastel").
3.  **La pendiente**: Si miramos este corte de frente (como un folio 2D), la derivada es la **pendiente** de la recta tangente en el punto.

::three{type="vis_derivada_direccional_hibrida"}

Las **derivadas parciales** son el caso donde la dirección coincide con los ejes coordenados ($X, Y, Z$). En la práctica, cuando derivas parcialmente, tratas todas las demás variables como si fuesen **constantes**.

- **Respecto a x**: $\frac{\partial f}{\partial x}$ (*"Derivada parcial de f respecto a x"*).
- **Respecto a y**: $\frac{\partial f}{\partial y}$ (*"Derivada parcial de f respecto a y"*).

> **Otras notaciones**: Aunque la fracción es la más clásica, también se puede escribir como ($f_x, f_y$) o ($D_x f, \partial_x f$).

::three{type="vis_derivades_parcials_hibrida"}

Siguiendo la visualización anterior, cuando derivas parcialmente estás convirtiendo la función en una de **1 variable**. Por tanto, todas las demás se tratan como si fuesen **números constantes**.
Sea $f(x, y, z) = e^{xy+2z} + \sin(5xy) + \cos(z)$:
*   $\frac{\partial f}{\partial x} = \mathbf{y} \cdot e^{xy+2z} + \mathbf{5y} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial y} = \mathbf{x} \cdot e^{xy+2z} + \mathbf{5x} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial z} = \mathbf{2} \cdot e^{xy+2z} + 0 - \sin(z)$

### 1.2 El vector director $\mathbf{v}$
Para que la derivada direccional represente realmente la pendiente por unidad de distancia, el vector **DEBE SER UNITARIO** ($\|\mathbf{v}\|=1$).

*   **Normalización**: Si nos dan un vector $\mathbf{w}$ no unitario: $\mathbf{v} = \frac{\mathbf{w}}{\|\mathbf{w}\|}$.
*   **Si nos dan un ángulo $\alpha$**: $\mathbf{v} = (\cos \alpha, \sin \alpha)$.

::three{type="vis_vector_director_angle"}

---

## 2. El vector gradiente $\nabla$

El Gradiente de $f$ en el punto $\mathbf{a}$ $\nabla f(\mathbf{a})$ agrupa todas las derivadas parciales en un solo vector:
$$\nabla f(\mathbf{a}) = \left( \frac{\partial f}{\partial x_1}(\mathbf{a}), \dots, \frac{\partial f}{\partial x_n}(\mathbf{a}) \right)$$

**Ejemplo:** Siguiendo con la función anterior, calculamos su gradiente en el punto $\mathbf{a} = (2, 0, \pi)$:
*   Punto: $(x,y,z) = (2,0,\pi) \implies xy+2z = 2\pi$.
*   $\frac{\partial f}{\partial x} = 0 \cdot e^{2\pi} + 0 = \mathbf{0}$
*   $\frac{\partial f}{\partial y} = 2 \cdot e^{2\pi} + 10 \cdot \cos(0) = \mathbf{2e^{2\pi} + 10}$
*   $\frac{\partial f}{\partial z} = 2 \cdot e^{2\pi} - \sin(\pi) = \mathbf{2e^{2\pi}}$

$$ \nabla f(2, 0, \pi) = (0, \, 2e^{2\pi} + 10, \, 2e^{2\pi}) $$

> **Fórmula fundamental**: $D_{\mathbf{v}}f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v}$

### 2.1 Propiedades geométricas:
¿Por qué el gradiente apunta al máximo crecimiento? Si analizamos la fórmula del producto escalar:
$$D_{\mathbf{v}}f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v} = \|\nabla f(\mathbf{a})\| \cdot \|\mathbf{v}\| \cdot \cos \theta$$

Como el vector $\mathbf{v}$ es unitario ($\|\mathbf{v}\| = 1$), el valor de la derivada depende solo del ángulo $\theta$ entre el gradiente y la dirección:

1.  **Máximo crecimiento**: Se alcanza cuando $\cos \theta = 1$ ($\theta = 0^\circ$). El vector $\mathbf{v}$ tiene la **misma dirección y sentido** que el gradiente. Valor máximo: \|\nabla f(\mathbf{a})\|.
2.  **Máximo decrecimiento**: Se alcanza cuando $\cos \theta = -1$ ($\theta = 180^\circ$). El vector $\mathbf{v}$ tiene la **misma dirección pero sentido opuesto**. Valor mínimo: -\|\nabla f(\mathbf{a})\|.
3.  **Crecimiento nulo**: Se alcanza cuando $\cos \theta = 0$ ($\theta = 90^\circ$). La dirección es **perpendicular** al gradiente (dirección de la curva de nivel).

::threeviz{type="vector_gradient"}

---

## 3. Regularidad: Las clases $C^n$

La **regularidad** de una función mide su grado de "suavidad" geométrica: nos indica cuántas veces la podemos derivar antes de encontrar una discontinuidad o un "pico" en sus pendientes. Esta se clasifica en **clases de regularidad**:

| Clase | Nombre | ¿Qué significa? | Consecuencia práctica |
| :--- | :--- | :--- | :--- |
| **$C^0$** | Continua | No tiene saltos, pero puede tener **"picos"**. | No podemos garantizar el plano tangente en todas partes. |
| **$C^1$** | Diferenciable | Las **primeras derivadas** son continuas. | Podemos usar el **Gradiente** y el **Plano Tangente**. |
| **$C^2$** | Dos veces derivable | Las **segundas derivadas** son continuas. | Se cumple **Schwarz** y podemos hacer **Taylor de grado 2**. (Tema 9) |
| **$C^k$** | Clase $k$ | Se puede derivar $k$ veces con continuidad. | Aproximaciones de Taylor hasta grado $k$. |
| **$C^\infty$** | Suave | Se puede derivar infinitas veces (Ej: polinomios, $\sin, e^x$). | Todo funciona siempre. |

::three{type="vis_regularitat_hibrida"}

> **Condición de diferenciabilidad**: Una función es diferenciable en un punto si es de clase $C^1$ en un entorno de aquel punto. Si no lo es, hay que recurrir a la definición formal de límite para ver si existe el plano tangente.

---

## 4. Diferenciabilidad y plano tangente

Si una función es de clase $C^1$, podemos aproximarla localmente por un plano tangente.

::three{type="pla_tangent"}

### 4.1 Caso explícito: $z = f(x, y)$
Si la superficie viene dada de forma explícita, el plano tangente en el punto $M(a, b, f(a,b))$ es:

**Plano tangente:**
$$z = f(a,b) + \frac{\partial f}{\partial x}(a,b)(x-a) + \frac{\partial f}{\partial y}(a,b)(y-b)$$

**Recta normal:**
Tiene vector director $(f_x, f_y, -1)$. Su ecuación continua es:
$$\frac{x-a}{f_x(a,b)} = \frac{y-b}{f_y(a,b)} = \frac{z-f(a,b)}{-1}$$

### 4.2 Caso implícito: $F(x, y, z) = 0$
Si la superficie viene definida por una ecuación implícita, el plano tangente en $M(a, b, c)$ es:

**Plano tangente:**
$$F_x(a,b,c)(x-a) + F_y(a,b,c)(y-b) + F_z(a,b,c)(z-c) = 0$$

**Recta normal:**
Tiene la dirección del gradiente $\nabla F(a,b,c)$. La ecuación continua es:
$$\frac{x-a}{F_x(a,b,c)} = \frac{y-b}{F_y(a,b,c)} = \frac{z-c}{F_z(a,b,c)}$$

> **Conversión**: Cualquier función explícita $z = f(x,y)$ se puede tratar como una implícita haciendo $F(x,y,z) = f(x,y) - z = 0$.

### 4.3 Plano tangente horizontal
Si el plano tangente es **paralelo al plano $XY$**:
*   **Condición**: $f_x = 0$ e $f_y = 0$ (gradiente nulo).
*   Esto ocurre en los puntos críticos de la función.
