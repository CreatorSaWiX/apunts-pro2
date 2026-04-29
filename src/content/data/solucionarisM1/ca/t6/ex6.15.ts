import type { Solution } from '../../../solutions';

export const ex6_15: Solution = {
  id: 'M1-T6-Ex6.15',
  title: 'Exercici 6.15: Igualtat de Subespais i Pertinença',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $F = \\left\\langle \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\end{pmatrix} \\right\\rangle$ i $G = \\left\\langle \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ -2 \\\\ 2 \\end{pmatrix} \\right\\rangle$ subespais de $\\mathbb{R}^3$.

1) Demostreu que $F = G$.
2) Sigui $e = \\begin{pmatrix} 9 \\\\ \\sqrt{2}-1 \\\\ 1-\\sqrt{2} \\end{pmatrix}$. Proveu que $e \\in F$ i expresseu-lo com a combinació lineal dels vectors que generen $F$.`,
  content: `
### 1) Demostració de $F = G$

Dos subespais són iguals si tenen la mateixa dimensió i un d'ells està contingut en l'altre. 

1.  **Càlcul de dimensions**:
    *   Els generadors de $F$ són $v_1 = \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\end{pmatrix}$ i $v_2 = \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\end{pmatrix}$. Com que no són proporcionals (el primer té un $1$ a la primera component i el segon un $0$), són linealment independents (LI). Per tant, formen una base de $F$ i **$\\dim(F) = 2$**.
    *   Els generadors de $G$ són $w_1 = \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\end{pmatrix}$ i $w_2 = \\begin{pmatrix} 1 \\\\ -2 \\\\ 2 \\end{pmatrix}$. Tampoc són proporcionals, per tant són LI i **$\\dim(G) = 2$**.

2.  **Contenció ($G \\subseteq F$)**:
    Només cal veure que els generadors de $G$ es poden escriure com a combinació lineal dels de $F$:
    *   Per a $w_1$: Observem que $v_1 + v_2 = \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\end{pmatrix} + \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\end{pmatrix} = \\mathbf{w_1}$.
    *   Per a $w_2$: Busquem $a, b$ tals que $a v_1 + b v_2 = w_2$:
        $a(1) + b(0) = 1 \\implies a = 1$
        $a(-1) + b(1) = -2 \\implies -1 + b = -2 \\implies b = -1$
        Comprovem la 3a component: $1(1) + (-1)(-1) = 2$. Correcte.
        Per tant, **$w_2 = v_1 - v_2$**.

Com que $\\dim(F) = \\dim(G)$ i tots els generadors de $G$ estan a $F$, concloem que **$F = G$**.

---

### 2) Pertinença del vector $e$ a $F$

Busquem els escalars $x, y$ tals que $x v_1 + y v_2 = e$:
$$x \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\end{pmatrix} + y \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ \\sqrt{2}-1 \\\\ 1-\\sqrt{2} \\end{pmatrix}$$

Resolem el sistema:
1.  Component 1: **$x = 9$**
2.  Component 2: $-x + y = \\sqrt{2}-1 \\implies -9 + y = \\sqrt{2}-1 \\implies \\mathbf{y = \\sqrt{2}+8}$
3.  Comprovem a la Component 3: $x - y = 9 - (\\sqrt{2}+8) = 1 - \\sqrt{2}$. **Correcte**.

El vector $e$ pertany a $F$ i la seva expressió és: **$e = 9v_1 + (\\sqrt{2}+8)v_2$**.
 La seva expressió com a combinació lineal és:
$$\\mathbf{e = 9 \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\end{pmatrix} + (8+\\sqrt{2}) \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\end{pmatrix}}$$
`,
  availableLanguages: ['ca']
};
