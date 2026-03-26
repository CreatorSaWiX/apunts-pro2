---
title: "Tema 7: Func. de vàries variables"
description: "Introducció a l'espai euclidi Rn, topologia bàsica (oberts, tancats, compactes), gràfiques de superfícies i corbes de nivell."
order: 7
readTime: "30 min"
subject: "m2"
draft: true
---

Fins ara hem estudiat funcions d'una sola variable $f(x)$. En aquest tema estenem el càlcul a funcions on el domini és un subconjunt de l'espai $n$-dimensional: $f(x_1, x_2, \dots, x_n)$.

## 1. L'espai Euclidi $\mathbb{R}^n$

Els elements de $\mathbb{R}^n$ s'anomenen **vectors** o **punts**. Tenen estructura d'espai vectorial amb les operacions de suma i producte per escalar.

### Producte Escalar i Norma
Donats dos vectors $\mathbf{u} = (u_1, \dots, u_n)$ i $\mathbf{v} = (v_1, \dots, v_n)$:
- **Producte Escalar**: $\mathbf{u} \cdot \mathbf{v} = u_1v_1 + \dots + u_nv_n$.
- **Normal (Mòdul)**: $\|\mathbf{u}\| = \sqrt{\mathbf{u} \cdot \mathbf{u}} = \sqrt{u_1^2 + \dots + u_n^2}$.
- **Distància**: $d(\mathbf{x}, \mathbf{y}) = \|\mathbf{y} - \mathbf{x}\|$.

## 2. Topologia en $\mathbb{R}^n$

La topologia ens permet definir formalment el concepte de "proximitat".

> **Bola Oberta**: Donat un punt $\mathbf{a} \in \mathbb{R}^n$ i un radi $r > 0$, la bola de centre $\mathbf{a}$ i radi $r$ és:
> $$B_r(\mathbf{a}) = \{ \mathbf{x} \in \mathbb{R}^n : d(\mathbf{a}, \mathbf{x}) < r \}$$

### Tipus de Conjunts
Un subconjunt $A \subseteq \mathbb{R}^n$ pot ser:
- **Obert**: Si per a tot punt $\mathbf{a} \in A$, existeix una bola $B_r(\mathbf{a}) \subseteq A$.
- **Tancat**: Si el seu complementari és obert (o si conté tots els seus punts frontera).
- **Compacte**: Un conjunt és compacte si és **tancat i acotat**. (Teorema de Weierstrass: una funció contínua en un compacte sempre assoleix un màxim i un mínim absoluts).

---

## 3. Gràfiques i Superfícies

Si $f: D \subseteq \mathbb{R}^2 \to \mathbb{R}$, la seva gràfica és el conjunt de punts $(x, y, f(x, y))$ de $\mathbb{R}^3$. Això defineix una **superfície**.

### Exemples Clàssics en 3D

::threeviz{type="paraboloide"}

::threeviz{type="punts_sella"}

### Corbes de Nivell
Per a una funció $f(x, y)$, el conjunt de nivell $k$ és el conjunt de punts del domini on la funció val exactament $k$:
$$C_k = \{ (x, y) \in D : f(x, y) = k \}$$
Això ens permet visualitzar una funció 3D en un mapa 2D (com si fos un mapa topogràfic de muntanyes).

---

## 4. Límits i Continuïtat

El límit en vàries variables és més complex que en una variable, perquè ens podem apropar a un punt des de **infinites direccions** (rectes, paràboles, etc.).

> **Definició**: $\lim_{\mathbf{x} \to \mathbf{a}} f(\mathbf{x}) = \ell$ si per a tot $\epsilon > 0$ existeix un $\delta > 0$ tal que si $0 < d(\mathbf{x}, \mathbf{a}) < \delta \implies |f(\mathbf{x}) - \ell| < \epsilon$.

### Estratègies per calcular límits:
1. **Límits direccionals**: Si ens acostem per diferents rectes ($y=mx$) i obtenim resultats diferents, el límit **no existeix**.
2. **Coordenades polars**: Útil si el límit és a l'origen $(0,0)$. Fem $x = r\cos\alpha$ i $y = r\sin\alpha$. Si el resultat depèn de $\alpha$ quan $r \to 0$, el límit no existeix.
3. **Fites (Majoració)**: Si podem demostrar que $|f(x, y) - \ell| \leq g(x, y)$ i $g \to 0$, llavors el límit és $\ell$.

### Teorema de Weierstrass
Si $f$ és una funció real contínua definida en un conjunt **compacte** $K \subseteq \mathbb{R}^n$:
1. $f$ està acotada en $K$.
2. Existeixen $\mathbf{a}, \mathbf{b} \in K$ tals que $f(\mathbf{a}) \leq f(\mathbf{x}) \leq f(\mathbf{b})$ per a tot $\mathbf{x} \in K$.
*(En altres paraules: hi ha un màxim i un mínim absolut).*
