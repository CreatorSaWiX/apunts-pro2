---
title: "Tema 8: Derivada parcial i gradient"
description: "Càlcul diferencial multivariable: derivades direccionals, vectors gradient, diferenciabilitat i el pla tangent."
order: 8
readTime: "35 min"
subject: "m2"
draft: false
isNew: true
---

### 1.1 Interpretació geomètrica
Per entendre què és la **derivada direccional** $D_{\mathbf{v}}f(\mathbf{a})$ (Derivada direccional de $f$ en el punt $\mathbf{a}$ segons el vector $\mathbf{v}$), pensem en el mètode del **tall vertical**:

1.  **Plànol $\pi$**: Imaginem un ganivet vertical que passa per $\mathbf{a}$ seguint la direcció de $\mathbf{v}$.
2.  **Corba d'intersecció $C$**: El tall sobre la superfície (el "pastís").
3.  **El pendent**: Si mirem aquest tall de cara (com un foli 2D), la derivada és el **pendent** de la recta tangent en el punt.

::three{type="vis_derivada_direccional_hibrida"}

### 1.2 Derivades parcials
Són el cas on la direcció $\mathbf{v}$ coincideix amb els eixos coordenats:
- **Respecte a x**: $\frac{\partial f}{\partial x}$ (*"Derivada parcial de f respecte a x"*).
- **Respecte a y**: $\frac{\partial f}{\partial y}$ (*"Derivada parcial de f respecte a y"*).


> **Altres notacions**: Tot i que la fracció és la més clàssica, també es pot escriure com ($f_x, f_y$) o ($D_x f, \partial_x f$).

::three{type="vis_derivades_parcials_hibrida"}

Seguint la visualització anterior, quan derives parcialment estàs convertint la funció en una de **1 variable**. Per tant, totes les altres es tracten com si fossin **números constants**.
Sigui $f(x, y, z) = e^{xy+2z} + \sin(5xy) + \cos(z)$:
*   $\frac{\partial f}{\partial x} = \mathbf{y} \cdot e^{xy+2z} + \mathbf{5y} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial y} = \mathbf{x} \cdot e^{xy+2z} + \mathbf{5x} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial z} = \mathbf{2} \cdot e^{xy+2z} + 0 - \sin(z)$

---

## 2. El vector gradient $\nabla$

El Gradient de $f$ en el punt $\mathbf{a}$ $\nabla f(\mathbf{a})$ agrupa totes les derivades parcials en un sol vector:
$$\nabla f(\mathbf{a}) = \left( \frac{\partial f}{\partial x_1}(\mathbf{a}), \dots, \frac{\partial f}{\partial x_n}(\mathbf{a}) \right)$$

**Exemple:** Seguint amb la funció anterior, calculem el seu gradient en el punt $\mathbf{a} = (2, 0, \pi)$:
*   Punt: $(x,y,z) = (2,0,\pi) \implies xy+2z = 2\pi$.
*   $\frac{\partial f}{\partial x} = 0 \cdot e^{2\pi} + 0 = \mathbf{0}$
*   $\frac{\partial f}{\partial y} = 2 \cdot e^{2\pi} + 10 \cdot \cos(0) = \mathbf{2e^{2\pi} + 10}$
*   $\frac{\partial f}{\partial z} = 2 \cdot e^{2\pi} - \sin(\pi) = \mathbf{2e^{2\pi}}$

$$ \nabla f(2, 0, \pi) = (0, \, 2e^{2\pi} + 10, \, 2e^{2\pi}) $$

### Propietats geomètriques:
1. El gradient apunta sempre en la **direcció de màxim creixement** de la funció.
2. El seu mòdul $\|\nabla f(\mathbf{a})\|$ és el valor d'aquell creixement màxim.
3. El gradient en un punt és **perpendicular a la corba de nivell** que passa per aquell punt.
4. El valor màxim de la derivada direccional és $\|\nabla f(\mathbf{a})\|$ i s'assoleix quan $\mathbf{v}$ té la mateixa direcció que el gradient.

::threeviz{type="vector_gradient"}

### 2.1 Càlcul pràctic de la derivada direccional
Un cop coneixem el gradient, calcular $D_{\mathbf{v}}f(\mathbf{a})$ és molt senzill si la funció és **diferenciable**:
$$D_{\mathbf{v}}f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v}$$

**Regla d'or**: El vector $\mathbf{v}$ **HA DE SER UNITARI** ($|\mathbf{v}|=1$). Si el problema et dona un vector $\mathbf{w}$ qualsevol, primer calcula $\mathbf{v} = \frac{\mathbf{w}}{\|\mathbf{w}\|}$.

**Si la direcció ve donada per un angle $\alpha$:**
$$\mathbf{v} = (\cos \alpha, \sin \alpha)$$

---

## 3. Diferenciabilitat i pla tangent

Una funció és **diferenciable** en un punt si es pot aproximar localment per un pla (l'equivalent a la recta tangent en 2D). Aquesta "aplanació" local ens permet fer càlculs senzills en lloc de treballar amb la superfície corba.

::three{type="pla_tangent"}

> [!TIP]
> **Pla Tangent**: Observa com el pla blau s'adapta a la muntanya. L'equació que veus a sobre és la millor aproximació lineal de la funció en aquest punt.

### 3.2 Recta normal
És la recta perpendicular a la superfície en el punt $(a, b, f(a,b))$. Com pots veure al visualitzador (l'agulla groga), el seu vector director és el propi gradient combinat amb un $-1$ per la component vertical:
$$\mathbf{r}(\lambda) = (a, b, f(a, b)) + \lambda \left( \frac{\partial f}{\partial x}(a,b), \frac{\partial f}{\partial y}(a,b), -1 \right)$$

### 3.3 Pla tangent horitzontal
Si el pla tangent és **paral·lel al pla $XY$**, el pendent en totes les direccions és zero.
- **Condició**: $\nabla f(a, b) = (0, 0)$.
- Això passa en els punts crítics (màxims, mínims o punts de sella).

---

## 4. Funcions vectorials i matrius

quan parlem de funcions que tornen un vector, $f: \mathbb{R}^n \to \mathbb{R}^m$, ja no parlem de gradient sinó de **Matriu Jacobiana**:

::three{type="vis_jacobiana"}

**Interpretació Geomètrica**: La matriu jacobiana és la millor aproximació lineal d'una transformació. Al visualitzador superior, pots veure com el quadrat blau del domini es transforma en el paral·lelogram rosa; els components de la matriu ens diuen com s'ha deformat cada eix localment.

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

> Encara que la matriu sembli gegant, pensa-la com una simple multiplicació de "pendents" generalitzades a moltes dimensions.
