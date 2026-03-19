<!-- ---
title: "Tema 8: Derivades Parcials i Gradient"
description: "Càlcul diferencial multivariable: derivades direccionals, vectors gradient, diferenciabilitat i el pla tangent."
order: 8
readTime: "35 min"
subject: "m2"
---

Aquest tema és el nucli del càlcul diferencial en $\mathbb{R}^n$. Aprendrem a mesurar com canvia una funció segons la direcció en què ens movem i com aproximar superfícies complexes mitjançant plans simples.

## 1. Derivades Direccionals i Parcials

Si estem en un punt $\mathbf{a}$ d'una muntanya (superfície), la **derivada direccional** ens diu quina és la pendent si caminem en una direcció específica $\mathbf{v}$.

> **Definició**: La derivada de $f$ en el punt $\mathbf{a}$ segons el vector unitari $\mathbf{v}$ és:
> $$D_{\mathbf{v}}f(\mathbf{a}) = \frac{\partial f}{\partial \mathbf{v}}(\mathbf{a}) = \lim_{\lambda \to 0} \frac{f(\mathbf{a} + \lambda\mathbf{v}) - f(\mathbf{a})}{\lambda}$$

### Derivades Parcials
Són un cas particular on la direcció és la dels eixos de coordenades:
- **Respecte a x**: $\frac{\partial f}{\partial x}$ (mantenint la $y$ constant).
- **Respecte a y**: $\frac{\partial f}{\partial y}$ (mantenint la $x$ constant).

---

## 2. El Vector Gradient ($\nabla f$)

El gradient és un vector que agrupa totes les derivades parcials de la funció en un punt:
$$\nabla f(\mathbf{a}) = \left( \frac{\partial f}{\partial x_1}(\mathbf{a}), \dots, \frac{\partial f}{\partial x_n}(\mathbf{a}) \right)$$

### Propietats geomètriques (Clau per a l'examen):
1. El gradient apunta sempre en la **direcció de màxim creixement** de la funció.
2. El seu mòdul $\|\nabla f(\mathbf{a})\|$ és el valor d'aquell creixement màxim.
3. El gradient en un punt és **perpendicular a la corba de nivell** que passa per aquell punt.

::threeviz{type="vector_gradient"}

---

## 3. Diferenciabilitat i Pla Tangent

Una funció és **diferenciable** en un punt si es pot aproximar localment per un pla (l'equivalent a la recta tangent en 2D). No és suficient que existeixin les derivades parcials per garantir la diferenciabilitat.

### Equació del Pla Tangent
Si $f$ és diferenciable en $(a, b)$, l'equació del pla tangent a la superfície $z = f(x, y)$ en el punt $(a, b, f(a,b))$ és:
$$z = f(a, b) + \frac{\partial f}{\partial x}(a, b)(x - a) + \frac{\partial f}{\partial y}(a, b)(y - b)$$

::threeviz{type="pla_tangent"}

---

## 4. Funcions Vectorials i Matrius

Quan tenim una funció que torna un vector, $f: \mathbb{R}^n \to \mathbb{R}^m$, ja no parlem de gradient sinó de **Matriu Jacobiana**:

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
Per a la composició de funcions $g \circ f$, la matriu jacobiana del resultat és el producte de les matrius jacobianes:
$$\mathcal{J}(g \circ f)(\mathbf{a}) = \mathcal{J}g(f(\mathbf{a})) \cdot \mathcal{J}f(\mathbf{a})$$

> **Consell de Senior**: Encara que la matriu sembli gegant, pensa-la com una simple multiplicació de "pendents" generalitzades a moltes dimensions. -->
