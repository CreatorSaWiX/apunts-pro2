---
title: "Tema 7: Aplicaciones lineales"
description: "Aplicaciones lineales, isomorfismos, bases y dimensión."
order: 8
readTime: "19 min"
subject: "m1"
draft: false
isNew: true
---

## 0. Transformaciones geométricas

 > **¿Quieres programar el GTA VII?** 
 > Si tu sueño es trabajar en Rockstar Games o crear el próximo motor gráfico revolucionario, este es el tema más importante de toda la carrera. Las rotaciones de cámara, el movimiento de los personajes y la física de los objetos son, en esencia, **Aplicaciones Lineales**. Además, ponle ganas: este tema suele representar un **40% del examen final**.

En ejercicios de $\mathbb{R}^2$ y $\mathbb{R}^3$, las transformaciones más típicas que verás (y usan los shaders de cualquier videojuego) son:

*   **Rotación**: Girar objetos respecto a un eje.
*   **Reflexión**: El efecto espejo (cambio de orientación).
*   **Proyección**: "Aplanar" objetos sobre un plano o eje (fundamental para renderizar 3D en pantallas 2D).
*   **Escalado**: Hacer las cosas más grandes o pequeñas.

::three{type="vis_transformacions_hibrida"}

 > **Geometría en 3D**: Mientras que en $\mathbb{R}^2$ solo tenemos un eje de rotación, en $\mathbb{R}^3$ podemos rotar respecto a $X, Y$ o $Z$. Fíjate cómo la **reflexión** invierte el objeto; es un concepto clave en gráficos por ordenador.

---

## 1. ¿Qué es una Aplicación Lineal?

Una **aplicación lineal** es una función entre dos espacios vectoriales (digamos $E$ y $F$) que "respeta" la estructura de estos espacios. No es una función cualquiera; es una transformación "recta" y "proporcional".

Para que una función $f: E \to F$ sea lineal, debe cumplir **dos condiciones sagradas**:

1.  **Suma**: $f(\vec{u} + \vec{v}) = f(\vec{u}) + f(\vec{v})$  
    *(Transformar la suma es lo mismo que sumar las transformaciones).*
2.  **Producto por escalar**: $f(\lambda \cdot \vec{u}) = \lambda \cdot f(\vec{u})$  
    *(Si duplicas la entrada, la salida se duplica).*

Una aplicación lineal **siempre** envía el vector cero al vector cero ($f(\vec{0}_E) = \vec{0}_F$). ¡Si ves una función donde $f(0,0) = (1,2)$, ya sabes seguro que **no** es lineal!

::mafs{type="vis_propietats_lineals"}

 > **¿Cómo interpretar el gráfico?**  
 > Prueba a mover los vectores $\vec{u}$ y $\vec{v}$. Si la aplicación es **Lineal**, verás que la imagen de la suma $f(\vec{u}+\vec{v})$ coincide exactamente con el "vértice" del paralelogramo formado por $f(\vec{u})$ y $f(\vec{v})$.  
 > Si cambias a **No Lineal**, verás cómo la "física" se rompe y el resultado se desvía.

### ¿Cómo trabajar con Polinomios y Matrices?
Cuando el ejercicio no es de $\mathbb{R}^n$, el primer paso es convertir los objetos en "vectores de números" (coordenadas) respecto a una base.
*   **Polinomios ($\mathbb{R}_n[x]$)**: Un polinomio $ax^2 + bx + c$ se convierte en el vector $(a, b, c)$ si usamos la base $\{x^2, x, 1\}$.
*   **Matrices ($\mathcal{M}_{2 \times 2}$)**: Una matriz $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ se convierte en el vector $(a, b, c, d)$ usando la base canónica de matrices.
*   **La clave**: Una vez tienes los vectores, el ejercicio se resuelve exactamente igual que en $\mathbb{R}^n$.

---

## 2. La Matriz Asociada: El "Corazón" de la Aplicación

Trabajar con fórmulas tipo $f(x,y) = (2x+y, x-y)$ es cansado. Por suerte, toda la información de una aplicación lineal se puede guardar en una **matriz**. Esta matriz actúa como un "traductor".

::mafs{type="vis_matriu_associada"}

### ¿Cómo se construye la matriz $M_W^B(f)$?
La receta es siempre la misma (y es la pregunta típica de examen):

1.  **Toma los vectores de la base de salida** $B = \{\vec{b}_1, \dots, \vec{b}_n\}$.
2.  **Calcula su imagen** aplicando la fórmula: $f(\vec{b}_1), f(\vec{b}_2), \dots$
3.  **Expresa los resultados en coordenadas** de la base de llegada $W$.
4.  **Pon los resultados por columnas** en la matriz.

 > **Consejo de profesor**: "Imágenes por columnas". Si recuerdas esta frase, tienes medio examen hecho. Como ves en la visualización superior, mover los valores de la matriz es literalmente mover hacia dónde apuntan las imágenes de los vectores base.

**La ecuación fundamental:**
$$[f(\vec{v})]_W = M_W^B(f) \cdot [\vec{v}]_B$$
Esto quiere decir: si me das un vector en la base $B$ y lo multiplico por la matriz, obtengo su imagen en la base $W$.

---

## 3. ¿A dónde van los vectores? Núcleo e Imagen

Este es el concepto más importante para resolver problemas de dimensiones y subespacios.

::three{type="vis_kernel_imatge_3d"}

### El Núcleo (Ker f)
Son los vectores del espacio de salida que "mueren" al ir al cero.
*   **Definición**: $\text{Ker}(f) = \{ \vec{v} \in E : f(\vec{v}) = \vec{0} \}$
*   **Cálculo**: Tienes que resolver el sistema homogéneo $M \cdot \vec{x} = \vec{0}$.
*   **Interpretación**: Si el Núcleo solo tiene el vector cero ($\text{Ker} = \{\vec{0}\}$), la aplicación no pierde información. En el laboratorio 3D superior, el núcleo es el eje rojo: cualquier vector que esté sobre este eje se proyecta al punto $(0,0,0)$.

### La Imagen (Im f)
Es el subespacio formado por todos los vectores que "podemos alcanzar" en el espacio de llegada.
*   **Cálculo**: La Imagen está generada por las **columnas** de la matriz asociada.
*   **Base de la Imagen**: Si escalonas la matriz, las columnas donde hay "pivotes" (¡elegidas de la matriz original!) forman una base de la Imagen.
*   **Interpretación**: En la visualización, la imagen es el plano verde. No importa dónde muevas el vector azul, su imagen (vector verde) siempre estará "atrapada" dentro de este plano.

### La Antiimagen (Ir hacia atrás)
La antiimagen de un vector $\vec{w}$, denotada como $f^{-1}(\vec{w})$, son todos los vectores $\vec{v}$ que al aplicarles $f$ dan $\vec{w}$.

::mafs{type="vis_antiimatge_subespais"}

*   **¿Cómo se calcula?** Tienes que resolver el sistema **no homogéneo** $M \cdot \vec{x} = \vec{w}$.
*   **Resultado**: Puede ser un único vector, un subespacio entero (si el sistema es compatible indeterminado) o vacío (si es incompatible).

### Transformando Subespacios (S)
Si tienes un subespacio $S$ definido por sus generadores $S = \langle \vec{s}_1, \dots, \vec{s}_k \rangle$:
*   **Imagen de S**: $f(S) = \langle f(\vec{s}_1), \dots, f(\vec{s}_k) \rangle$. Solo hay que transformar los generadores.
*   **Antiimagen de S**: $f^{-1}(S)$ son los vectores que van a parar dentro de $S$. Se calcula buscando qué $\vec{x}$ cumplen que $M \cdot \vec{x}$ es una combinación lineal de la base de $S$.

### El Teorema de la Dimensión (Rango-Nulidad)
Esta fórmula te ayudará a verificar si tus cálculos son coherentes:
$$\dim(\text{Espacio Salida}) = \dim(\text{Ker } f) + \dim(\text{Im } f)$$
*Pista: La dimensión de la Imagen es lo mismo que el **rango** de la matriz.*

---

## 4. Clasificación: ¿Cómo es nuestra aplicación?

Según las dimensiones del Núcleo y la Imagen, clasificamos las aplicaciones:

::mafs{type="vis_classificacio_aplicacions"}

*   **Inyectiva (Monomorfismo)**: No hay dos vectores diferentes que vayan al mismo lugar.
    *   Condición: $\text{Ker}(f) = \{\vec{0}\}$ (es decir, $\dim \text{Ker} = 0$).
    *   Rango de la matriz = $\dim(\text{Espacio Salida})$.
*   **Sobreproyectiva / Exhaustiva (Epimorfismo)**: La aplicación "llena" todo el espacio de llegada.
    *   Condición: $\text{Im}(f) = F$ (es decir, $\dim \text{Im} = \dim F$).
    *   Rango de la matriz = $\dim(\text{Espacio Llegada})$.
*   **Biyectiva (Isomorfismo)**: Es inyectiva y sobreproyectiva a la vez. Es una relación 1 a 1 perfecta.
    *   Condición: La matriz es cuadrada y su determinante es $\neq 0$.

 > Si el espacio de salida y el de llegada tienen la **misma dimensión**, entonces:
 > Inyectiva $\iff$ Sobreproyectiva $\iff$ Biyectiva. ¡Si cumple una, las cumple todas automáticamente!

### Caso Especial: Endomorfismos Nilpotentes
Un endomorfismo es **nilpotente** si existe un número $k$ tal que $f^k = \mathbf{0}$ (la aplicación nula). 

::mafs{type="vis_endomorfisme_nilpotent"}

*   Esto significa que si aplicas la transformación varias veces seguidas sobre cualquier vector, terminas llegando siempre al cero (**vórtice de aniquilación**).
*   Su matriz asociada tiene todos los valores propios iguales a cero.

---

## 5. Composición e Inversa

### Composición ($g \circ f$)
Si aplicamos primero $f$ y después $g$, la matriz de la composición es el **producto** de las matrices.
$$M(g \circ f) = M(g) \cdot M(f)$$

::mafs{type="vis_composicio_aplicacions"}

 > **El orden importa**: El orden de las matrices es el inverso al orden de lectura. ¡La que se aplica primero ($f$) va a la derecha del producto!

### Inversa ($f^{-1}$)
Solo existe si $f$ es un isomorfismo (biyectiva). La matriz de la aplicación inversa es la matriz inversa de la original:
$$M(f^{-1}) = (M(f))^{-1}$$

::mafs{type="vis_inversa_aplicacio"}

---

## 6. Cambio de Base: La "Fórmula Sándwich"

A veces nos dan la matriz en las bases canónicas ($C$), pero la queremos en otras bases $B$ y $W$. La fórmula general que tienes que memorizar es:
$$M_W^B(f) = P_{W \leftarrow C} \cdot M_C^C(f) \cdot P_{C \leftarrow B}$$

::mafs{type="vis_canvi_base_sandvitx"}

*   $P_{C \leftarrow B}$: Matriz de cambio de base (vectores de $B$ puestos en columnas).
*   $P_{W \leftarrow C}$: Es la **inversa** de la matriz que tiene los vectores de $W$ en columnas ($P_{C \leftarrow W}^{-1}$).

**Lógica visual**: Para ir de $B$ a $W$ a través de $f$, hacemos un "viaje" en tres etapas:
1.  Saltamos de la base $B$ a la **canónica**.
2.  Aplicamos la transformación $f$ usando la matriz fácil (la de la canónica).
3.  Saltamos de la canónica a la base de salida **$W$**.
