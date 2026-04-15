---
title: "Tema 7: Func. de vàries variables"
description: "Introducció a l'espai euclidi Rn, topologia bàsica (oberts, tancats, compactes), gràfiques de superfícies i corbes de nivell."
order: 7
readTime: "30 min"
subject: "m2"
draft: false
isNew: true
---

## 1. L'espai euclidi $\mathbb{R}^n$ i la distància

A l'espai $n$-dimensional de nombres reals, denotat per $\mathbb{R}^n$, la n-upla $(x_1, \dots, x_n)$ representa un punt o vector. Per mesurar la "proximitat" entre punts necessitem una funció de distància. La distància entre dos punts $\mathbf{x}$ i $\mathbf{y}$ és la longitud del segment que els uneix:
$$d(\mathbf{x}, \mathbf{y}) = \sqrt{(x_1-y_1)^2 + (x_2-y_2)^2 + \dots + (x_n-y_n)^2}$$

::threeviz{type="vis_distancia_sync_3d_2d"}

---

## 2. El concepte de "n-bola"

La bola és l'extensió del concepte d'interval de $\mathbb{R}$ a qualsevol dimensió.

* **Bola Oberta ($B_r(\mathbf{a})$)**: Conjunt de punts a distància menor que $r$.
$$B(\vec{a}, r) = \{ \vec{x} \in \mathbb{R}^n : d(\vec{x}, \vec{a}) < r \}$$
* **Bola Tancada ($\bar{B}_r(\mathbf{a})$)**: Inclou els punts que estan exactament a distància $r$.
$$\bar{B}(\vec{a}, r) = \{ \vec{x} \in \mathbb{R}^n : d(\vec{x}, \vec{a}) \le r \}$$

::mafs{type="vis_bola_interactiva"}

---

## 3. Metodologia de càlcul de dominis

| Si veus... | Atenció a... | Condició |
| :--- | :--- | :--- |
| **Arrels** ($\sqrt{g}$) | L'interior | $g(x, y) \ge 0$ |
| **Logs** ($\ln g$) | L'argument | $g(x, y) > 0$ |
| **Fraccions** ($1/g$) | El denominador | $g(x, y) \neq 0$ |

### Mètode dels punts de prova
És la "recepta" per dibuixar inequacions (ex: $x^2 + y^2 \le 4$):

1. **Dibuixa la vora**: Fes com si fos un igual ($x^2 + y^2 = 4$). Dibuixa la línia.
2. **Tria un punt**: Agafa el $(0,0)$ o qualsevol punt fàcil que no estigui a la línia.
3. **Comprova**: Si el punt compleix la inecuació $\implies$ **Ombreja** tot el seu costat.

::mafs{type="vis_metode_punts_prova"}

---

## 4. Topologia pràctica

Sigui $A \subseteq \mathbb{R}^n$ un conjunt. Cada punt de l'espai pot ser:

1. **Punt interior**: Si podem "tancar-lo" en una bola petita que estigui tota dins d'$A$. El conjunt de punts interiors és l'**Interior ($A^\circ$)**.
2. **Punt de frontera**: Si qualsevol bola que fem al seu voltant talla tant a $A$ com al seu complementari. El conjunt de punts frontera és la **Frontera ($Fr(A)$)**.
3. **Punt adherent**: Si qualsevol bola que fem al seu voltant talla a $A$. L'**Adherència ($\bar{A}$)** és la unió: $\bar{A} = A \cup Fr(A)$.

### L'exemple del triangle
Observem com s'apliquen aquests conceptes al conjunt:
$$A = \{(x, y) \in \mathbb{R}^2 : x \ge 0, y \ge 0, x+y < 1\}$$

::mafs{type="vis_ex_pissarra_topologia"}

---

## 5. Classificació de conjunts

Podem descriure els conjunts segons el comportament de la seva frontera:

- **Obert**: Si no conté cap punt de la seva frontera ($A \cap Fr(A) = \emptyset$). Equival a dir que $A = A^\circ$.
- **Tancat**: Si conté tota la seva frontera ($Fr(A) \subseteq A$). Equival a dir que $A = \bar{A}$.
- **Acotat**: Si el conjunt es pot tancar dins d'una bola de radi finit.
- **Compacte**: Molt important per a càlcul d'extrems. Un conjunt és compacte si és **tancat i acotat**.

::mafs{type="vis_classificacio_conjunts"}

---

## 6. Bordes i còniques

| Nom | Equació Canònica | Forma Visual |
| :--- | :--- | :--- |
| **Circumferència** | $x^2 + y^2 = r^2$ | Cercle |
| **El·lipse** | $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ | Ou (Oval) |
| **Hipèrbola** | $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ | Dues ales simètriques |
| **Paràbola** | $y = a x^2$ | Vall o muntanya |
| **Diamant** | $|x| + |y| = k$ | Quadrat girat $45^\circ$ |
| **Quadrat** | $\max(|x|, |y|) = k$ | Marc de foto |

::mafs{type="vis_cheat_sheet_coniques"}

---

## 7. Geometria a l'espai $\mathbb{R}^3$

Per als exercicis de conjunts en 3D, les superfícies "mare" són:

| Superfície | Equació | Descripció Visual |
| :--- | :--- | :--- |
| **Pla** | $Ax + By + Cz = D$ | Full de paper infinit |
| **Esfera** | $x^2 + y^2 + z^2 = r^2$ | Pilota de ping-pong |
| **Cilindre** | $x^2 + y^2 = r^2$ | Tub infinit (eix Z) |
| **Paraboloide** | $z = x^2 + y^2$ | Copa / Bol |

::threeviz{type="vis_superficies_basiques_3d"}

### Corbes de Nivell
Són les línies de "tall" a una altura $k$ constant ($f(x, y) = k$).

::threeviz{type="vis_corbes_nivell_3d_2d"}

