---
title: "Tema 8: Derivada parcial y gradiente"
description: "Cálculo diferencial multivariable: derivadas direccionales, vectores gradiente, diferenciabilidad y el plano tangente."
order: 8
readTime: "35 min"
subject: "m2"
---

### 1.1 Interpretación geométrica
Para entender qué es la **derivada direccional** $D_{\mathbf{v}}f(\mathbf{a})$ (Derivada direccional de $f$ en el punto $\mathbf{a}$ según el vector $\mathbf{v}$), pensemos en el método del **corte vertical**:

1.  **Plano $\pi$**: Imaginemos un cuchillo vertical que pasa por $\mathbf{a}$ siguiendo la dirección de $\mathbf{v}$.
2.  **Curva de intersección $C$**: El corte sobre la superficie (el "pastel").
3.  **La pendiente**: Si miramos este corte de frente (como un folio 2D), la derivada es la **pendiente** de la recta tangente en el punto.

::three{type="vis_derivada_direccional_hibrida"}

### 1.2 Derivadas parciales
Son el caso donde la dirección $\mathbf{v}$ coincide con los ejes coordenados:
- **Respecto a x**: $\frac{\partial f}{\partial x}$ (*"Derivada parcial de f respecto a x"*).
- **Respecto a y**: $\frac{\partial f}{\partial y}$ (*"Derivada parcial de f respecto a y"*).


> **Otras notaciones**: Aunque la fracción es la más clásica, también se puede escribir como ($f_x, f_y$) o ($D_x f, \partial_x f$).

::three{type="vis_derivades_parcials_hibrida"}

Siguiendo la visualización anterior, cuando derivas parcialmente estás convirtiendo la función en una de **1 variable**. Por tanto, todas las demás se tratan como si fueran **números constantes**.
Sea $f(x, y, z) = e^{xy+2z} + \sin(5xy) + \cos(z)$:
*   $\frac{\partial f}{\partial x} = \mathbf{y} \cdot e^{xy+2z} + \mathbf{5y} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial y} = \mathbf{x} \cdot e^{xy+2z} + \mathbf{5x} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial z} = \mathbf{2} \cdot e^{xy+2z} + 0 - \sin(z)$

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

### Propiedades geométricas:
1. El gradiente apunta siempre en la **dirección de máximo crecimiento** de la función.
2. Su módulo $\|\nabla f(\mathbf{a})\|$ es el valor de aquel crecimiento máximo.
3. El gradiente en un punto es **perpendicular a la curva de nivel** que pasa por aquel punto.
4. El valor máximo de la derivada direccional es $\|\nabla f(\mathbf{a})\|$ y se alcanza cuando $\mathbf{v}$ tiene la misma dirección que el gradiente.

::threeviz{type="vector_gradient"}

### 2.1 Cálculo práctico de la derivada direccional
Una vez conocemos el gradiente, calcular $D_{\mathbf{v}}f(\mathbf{a})$ es muy sencillo si la función es **diferenciable**:
$$D_{\mathbf{v}}f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v}$$

**Regla de oro**: El vector $\mathbf{v}$ **DEBE SER UNITARIO** ($|\mathbf{v}|=1$). Si el problema te da un vector $\mathbf{w}$ cualquiera, primero calcula $\mathbf{v} = \frac{\mathbf{w}}{\|\mathbf{w}\|}$.

**Si la dirección viene dada por un ángulo $\alpha$:**
$$\mathbf{v} = (\cos \alpha, \sin \alpha)$$

---

## 3. Diferenciabilidad y plano tangente

Una función es **diferenciable** en un punto si se puede aproximar localmente por un plano (el equivalente a la recta tangente en 2D). Esta "aproximación plana" local nos permite hacer cálculos sencillos en lugar de trabajar con la superficie curva.

::three{type="pla_tangent"}

> **Plano Tangente**: Observa cómo el plano azul se adapta a la montaña. La ecuación que ves encima es la mejor aproximación lineal de la función en este punto.

### 3.2 Recta normal
Es la recta perpendicular a la superficie en el punto $(a, b, f(a,b))$. Como puedes ver en el visualizador (la aguja amarilla), su vector director es el propio gradiente combinado con un $-1$ para la componente vertical:
$$\mathbf{r}(\lambda) = (a, b, f(a, b)) + \lambda \left( \frac{\partial f}{\partial x}(a,b), \frac{\partial f}{\partial y}(a,b), -1 \right)$$

### 3.3 Plano tangente horizontal
Si el plano tangente es **paralelo al plano $XY$**, la pendiente en todas las direcciones es cero.
- **Condición**: $\nabla f(a, b) = (0, 0)$.
- Esto ocurre en los puntos críticos (máximos, mínimos o puntos de silla).

---

## 4. Funciones vectoriales y matrices

Cuando hablamos de funciones que devuelven un vector, $f: \mathbb{R}^n \to \mathbb{R}^m$, ya no hablamos de gradiente sino de **Matriz Jacobiana**:

::three{type="vis_jacobiana"}

**Interpretación Geométrica**: La matriz jacobiana es la mejor aproximación lineal de una transformación. En el visualizador superior, puedes ver cómo el cuadrado azul del dominio se transforma en el paralelogramo rosa; los componentes de la matriz nos dicen cómo se ha deformado cada eje localmente.

$$
\mathcal{J}f(\mathbf{a}) = \begin{pmatrix} 
\nabla f_1(\mathbf{a}) \\
\vdots \\
\nabla f_m(\mathbf{a})
\end{pmatrix} = \begin{pmatrix}
\frac{\partial f_1}{\partial x_1} & \dots & \frac{\partial f_1}{\partial x_n} \\
\vdots & \ddots & \vdots \\
\frac{\partial f_m}{\partial x_1} & \dots & \frac{\partial f_m}{\partial x_n}
\end{pmatrix}
$$

### Regla de la Cadena
Para la composición de funciones $g \circ f$, la matriz jacobiana del resultado es el producto de las matrices jacobianas:
$$\mathcal{J}(g \circ f)(\mathbf{a}) = \mathcal{J}g(f(\mathbf{a})) \cdot \mathcal{J}f(\mathbf{a})$$

> Aunque la matriz parezca gigante, piénsala como una simple multiplicación de "pendientes" generalizadas a muchas dimensiones.
