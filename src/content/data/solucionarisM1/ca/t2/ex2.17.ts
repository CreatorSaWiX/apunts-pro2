import type { Solution } from '../../../solutions';

export const ex2_17: Solution = {
  id: 'M1-T2-Ex2.17',
  title: 'Exercici 2.17: Centre, Radi i Diàmetre',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `1) Trobeu l'excentricitat de tots els vèrtexs, el radi, els vèrtexs centrals i el centre:\n&nbsp;&nbsp;&nbsp;&nbsp;a) dels grafs de l'ex 2.1\n&nbsp;&nbsp;&nbsp;&nbsp;b) del graf $G = ([8], \\{12, 14, 15, 23, 34, 38, 46, 47, 56, 67, 78\\})$\n2) Doneu un exemple d'un graf connex amb el radi i el diàmetre iguals.\n3) Doneu un exemple d'un graf connex tal que el diàmetre sigui el doble del radi.`,
  content: `
Recordem les definicions clau:
*   **Excentricitat $e(v)$:** La distància més gran entre $v$ i qualsevol altre vèrtex de $G$.
*   **Radi $Rad(G)$:** La mínima de les excentricitats de $G$.
*   **Diàmetre $D(G)$:** La màxima de les excentricitats de $G$.
*   **Centre:** El conjunt de vèrtexs que tenen excentricitat mínima ($e(v) = Rad(G)$).

### 1) a) Grafs de l'Exercici 2.1

És un graf altament simètric (vèrtex-transitiu), el que implica que tots els vèrtexs tenen la mateixa excentricitat.
:::graph{height=220}
\`\`\`json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "3" }, { "id": "4" }, { "id": "5" },
    { "id": "6" }, { "id": "7" }, { "id": "8" }, { "id": "9" }, { "id": "10" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "4" },
    { "source": "4", "target": "5" }, { "source": "5", "target": "1" },
    { "source": "1", "target": "6" }, { "source": "2", "target": "7" }, { "source": "3", "target": "8" },
    { "source": "4", "target": "9" }, { "source": "5", "target": "10" },
    { "source": "6", "target": "8" }, { "source": "6", "target": "9" },
    { "source": "7", "target": "9" }, { "source": "7", "target": "10" },
    { "source": "8", "target": "10" }
  ]
}
\`\`\`
:::

*   **Excentricitat:** $\\forall v, e(v) = 2$.
*   **Radi:** $Rad(G) = 2$.
*   **Diàmetre:** $D(G) = 2$.
*   **Centre:** $V(G)$ (tots els 10 vèrtexs).

Aquest graf té un node unificat a l'anell interior ($11$), el que trenca la simetria.

:::graph{height=220}
\`\`\`json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "3" }, { "id": "4" }, { "id": "5" },
    { "id": "6" }, { "id": "7" }, { "id": "8" }, { "id": "9" }, { "id": "10" }, { "id": "11", "color": "#facc15" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "4" },
    { "source": "4", "target": "5" }, { "source": "5", "target": "1" },
    { "source": "1", "target": "6" }, { "source": "2", "target": "7" }, { "source": "3", "target": "8" },
    { "source": "4", "target": "9" }, { "source": "5", "target": "10" },
    { "source": "6", "target": "11" }, { "source": "7", "target": "11" },
    { "source": "6", "target": "7" }, { "source": "7", "target": "8" },
    { "source": "8", "target": "9" }, { "source": "9", "target": "10" }, { "source": "10", "target": "6" }
  ]
}
\`\`\`
:::

*   **Radi:** $2$ / **Diàmetre:** $3$.
*   **Vèrtexs centrals:** Nodes com el $6$, $7$ o $11$ que estan ben comunicats amb ambdós anells.

### 1) b) Graf $G = ([8], A)$

Calculant les distàncies més llargues de cada node:

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "1", "x": -100, "y": 0 }, { "id": "2", "x": -50, "y": 50 }, { "id": "3", "x": 0, "y": 100 },
    { "id": "4", "x": 50, "y": 0, "color": "#ef4444" }, { "id": "5", "x": -50, "y": -50 }, { "id": "6", "x": 100, "y": -50 },
    { "id": "7", "x": 150, "y": 50 }, { "id": "8", "x": 100, "y": 100 }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "1", "target": "4" }, { "source": "1", "target": "5" },
    { "source": "2", "target": "3" }, { "source": "3", "target": "4" }, { "source": "3", "target": "8" },
    { "source": "4", "target": "6" }, { "source": "4", "target": "7" }, { "source": "5", "target": "6" },
    { "source": "6", "target": "7" }, { "source": "7", "target": "8" }
  ]
}
\`\`\`
:::

| Vèrtex $v$ | 1 | 2 | 3 | **4** | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Excentricitat $e(v)$** | 3 | 3 | 3 | **2** | 3 | 3 | 3 | 3 |

*   **Radi:** $Rad(G) = 2$
*   **Diàmetre:** $D(G) = 3$
*   **Centre:** $\{ 4 \}$

### 2) Exemple de $Radi = Diàmetre$

Qualsevol graf complet o graf vèrtex-transitiu compleix aquesta condició.
*   **Exemple:** $G = K_3$.
*   **Càlcul:** Tots els vèrtexs estan a distància $1$ de tots els altres. $e(v)=1$ per a tothom. $Rad = 1, Diam = 1$.

### 3) Exemple de $Diàmetre = 2 \\times Radi$

Aquesta relació se sol donar en camins llargs on el centre és el punt mitjà.
*   **Exemple:** $G = P_5$ ($1-2-3-4-5$).
*   **Càlcul:** 
    *   Vèrtex central **3**: $e(3) = 2$ (distància cap a 1 o 5). Per tant, $Rad(G) = 2$.
    *   Vèrtexs extrems **1** o **5**: $e(1) = e(5) = 4$ (distància entre ells). Per tant, $D(G) = 4$.
    *   Efectivament, $4 = 2 \\cdot 2$. $\\square$
  `,
  availableLanguages: ['ca']
};
