---
title: "Tema 8: Derivada parcial i gradient"
description: "Càlcul diferencial multivariable: derivades direccionals, vectors gradient, diferenciabilitat i el pla tangent."
order: 8
readTime: "20 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 1. Derivades parcials i direccionals

### 1.1 Interpretació geomètrica
Per entendre què és la **derivada direccional** $D_{\mathbf{v}}f(\mathbf{a})$ (Derivada direccional de $f$ en el punt $\mathbf{a}$ segons el vector $\mathbf{v}$), pensem en el mètode del **tall vertical**:

1.  **Plànol $\pi$**: Imaginem un ganivet vertical que passa per $\mathbf{a}$ seguint la direcció de $\mathbf{v}$.
2.  **Corba d'intersecció $C$**: El tall sobre la superfície (el "pastís").
3.  **El pendent**: Si mirem aquest tall de cara (com un foli 2D), la derivada és el **pendent** de la recta tangent en el punt.

::three{type="vis_derivada_direccional_hibrida"}

Les **derivades parcials** són el cas on la direcció coincideix amb els eixos coordenats ($X, Y, Z$). A la pràctica, quan derives parcialment, tractes totes les altres variables com si fossin **constants**.

- **Respecte a x**: $\frac{\partial f}{\partial x}$ (*"Derivada parcial de f respecte a x"*).
- **Respecte a y**: $\frac{\partial f}{\partial y}$ (*"Derivada parcial de f respecte a y"*).

> **Altres notacions**: Tot i que la fracció és la més clàssica, també es pot escriure com ($f_x, f_y$) o ($D_x f, \partial_x f$).

::three{type="vis_derivades_parcials_hibrida"}

Seguint la visualització anterior, quan derives parcialment estàs convertint la funció en una de **1 variable**. Per tant, totes les altres es tracten com si fossin **números constants**.
Sigui $f(x, y, z) = e^{xy+2z} + \sin(5xy) + \cos(z)$:
*   $\frac{\partial f}{\partial x} = \mathbf{y} \cdot e^{xy+2z} + \mathbf{5y} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial y} = \mathbf{x} \cdot e^{xy+2z} + \mathbf{5x} \cdot \cos(5xy) + 0$
*   $\frac{\partial f}{\partial z} = \mathbf{2} \cdot e^{xy+2z} + 0 - \sin(z)$

### 1.2 El vector director $\mathbf{v}$
Perquè la derivada direccional representi realment el pendent per unitat de distància, el vector **HA DE SER UNITARI** ($\|\mathbf{v}\|=1$).

*   **Normalització**: Si ens donen un vector $\mathbf{w}$ no unitari: $\mathbf{v} = \frac{\mathbf{w}}{\|\mathbf{w}\|}$.
*   **Si ens donen un angle $\alpha$**: $\mathbf{v} = (\cos \alpha, \sin \alpha)$.

::three{type="vis_vector_director_angle"}

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

> **Fórmula fonamental**: $D_{\mathbf{v}}f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v}$

### 2.1 Propietats geomètriques:
Per què el gradient apunta al màxim creixement? Si analitzem la fórmula del producte escalar:
$$D_{\mathbf{v}}f(\mathbf{a}) = \nabla f(\mathbf{a}) \cdot \mathbf{v} = \|\nabla f(\mathbf{a})\| \cdot \|\mathbf{v}\| \cdot \cos \theta$$

Com que el vector $\mathbf{v}$ és unitari ($\|\mathbf{v}\| = 1$), el valor de la derivada depèn només de l'angle $\theta$ entre el gradient i la direcció:

1.  **Màxim creixement**: S'assoleix quan $\cos \theta = 1$ ($\theta = 0^\circ$). El vector $\mathbf{v}$ té la **mateixa direcció i sentit** que el gradient. Valor màxim: $\|\nabla f(\mathbf{a})\|$.
2.  **Màxim decreixement**: S'assoleix quan $\cos \theta = -1$ ($\theta = 180^\circ$). El vector $\mathbf{v}$ té la **mateixa direcció però sentit oposat**. Valor mínim: $-\|\nabla f(\mathbf{a})\|$.
3.  **Creixement nul**: S'assoleix quan $\cos \theta = 0$ ($\theta = 90^\circ$). La direcció és **perpendicular** al gradient (direcció de la corba de nivell).

::threeviz{type="vector_gradient"}

---

## 3. Regularitat: Les classes $C^n$

La **regularitat** d'una funció mesura el seu grau de "suavitat" geomètrica: ens indica quantes vegades la podem derivar abans de trobar una discontinuïtat o una "punxa" en els seus pendents. Aquesta es classifica en **classes de regularitat**:

| Classe | Nom | Què vol dir? | Conseqüència pràctica |
| :--- | :--- | :--- | :--- |
| **$C^0$** | Contínua | No té salts, però pot tenir **"punxes"**. | No podem garantir el pla tangent a tot arreu. |
| **$C^1$** | Diferenciable | Les **primeres derivades** són contínues. | Podem usar el **Gradient** i el **Pla Tangent**. |
| **$C^2$** | Dues vegades derivable | Les **segones derivades** són contínues. | Es compleix **Schwarz** i podem fer **Taylor de grau 2**. (Tema 9) |
| **$C^k$** | Classe $k$ | Es pot derivar $k$ vegades amb continuïtat. | Aproximacions de Taylor fins a grau $k$. |
| **$C^\infty$** | Suau | Es pot derivar infinites vegades (Ex: polinomis, $\sin, e^x$). | Tot funciona sempre. |

::three{type="vis_regularitat_hibrida"}

> **Condició de diferenciabilitat**: Una funció és diferenciable en un punt si és de classe $C^1$ en un entorn d'aquell punt. Si no ho és, cal recórrer a la definició formal de límit per veure si existeix el pla tangent.

---

## 4. Diferenciabilitat i pla tangent

Si una funció és de classe $C^1$, podem aproximar-la localment per un pla tangent.

::three{type="pla_tangent"}

### 4.1 Cas explícit: $z = f(x, y)$
Si la superfície ve donada de forma explícita, el pla tangent en el punt $M(a, b, f(a,b))$ és:

**Pla tangent:**
$$z = f(a,b) + \frac{\partial f}{\partial x}(a,b)(x-a) + \frac{\partial f}{\partial y}(a,b)(y-b)$$

**Recta normal:**
Té vector director $(f_x, f_y, -1)$. La seva equació contínua és:
$$\frac{x-a}{f_x(a,b)} = \frac{y-b}{f_y(a,b)} = \frac{z-f(a,b)}{-1}$$

### 4.2 Cas implícit: $F(x, y, z) = 0$
Si la superfície ve definida per una equació implícita, el pla tangent en $M(a, b, c)$ és:

**Pla tangent:**
$$F_x(a,b,c)(x-a) + F_y(a,b,c)(y-b) + F_z(a,b,c)(z-c) = 0$$

**Recta normal:**
Té la direcció del gradient $\nabla F(a,b,c)$. L'equació contínua és:
$$\frac{x-a}{F_x(a,b,c)} = \frac{y-b}{F_y(a,b,c)} = \frac{z-c}{F_z(a,b,c)}$$

> **Conversió**: Qualsevol funció explícita $z = f(x,y)$ es pot tractar com una implícita fent $F(x,y,z) = f(x,y) - z = 0$.

### 4.3 Pla tangent horitzontal
Si el pla tangent és **paral·lel al pla $XY$**:
*   **Condició**: $f_x = 0$ i $f_y = 0$ (gradient nul).
*   Això passa en els punts crítics de la funció.
