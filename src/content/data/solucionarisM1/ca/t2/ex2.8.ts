import type { Solution } from '../../../solutions';

export const ex2_8: Solution = {
  id: 'M1-T2-Ex2.8',
  title: 'Exercici 2.8: Construcció Fita Superior (Mida i Connexió)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $n$ amb exactament $k+1$ components connexos. En aquest exercici volem trobar una fita superior per la mida de $G$. Per a fer-ho definim el graf auxiliar $H$ d'ordre $n$ amb $k+1$ components connexos, $k \\ge 1$: $k$ són isomorfs a $K_1$ i un component és isomorf a $K_{n-k}$.\n\n1) Calculeu la mida de $H$.\n2) Demostreu que la mida de $H$ és més gran o igual que la mida de $G$.`,
  content: `
L'objectiu és descobrir la fita superior matemàtica d'arestes. Per maximitzar les arestes d'un graf desconnectat, ens convé que les illes de vèrtexs estiguin totalment polaritzades: components minúsculs buits, en contraposició a un únic component gegantí del tot farcit on el creixement quadràtic de $K_n$ s'apliqui amb el pes més gran possible.

Aquest "cas límit" on es concentra el màxim poblacional idealitzat és el **Graf $H$**.

### 1) Calculeu la mida associada d'$H$

El graf auxiliar $H$ està dividit en $k+1$ components:
*   **$k$ components idèntics a $K_1$**: Això són $k$ vèrtexs completament aïllats (0 arestes cadascun).
*   **1 component isomorf a $K_{n-k}$**: Un sol "blob" completament connectat on hem empilat tots els nodes restants $(n-k)$.

Atès que només un grup conté arestes, calcular la mida $m(H)$ resideix solament en extreure la mida d'aquest enorme graf complet $K_{n-k}$:
$$ m(H) = m(K_{n-k}) = \\frac{(n-k)(n-k-1)}{2} $$

---

### 2) Demostreu que $m(H) \\ge m(G)$

Suposem que $G$ i $H$ actuen tots dos complint el límit de $k+1$ components. Volem provar que la fragmentació d'arestes de qualsevol $G$ sempre surt perdent (o empatant) contra la polarització ideal d'$H$.

**Intuïció visual:** Moure vèrtexs cap al component més gros **sempre fa guanyar arestes**.

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#ef4444" }, { "id": "2", "color": "#ef4444" }, { "id": "3", "color": "#ef4444" },
    { "id": "A", "color": "#3b82f6" }, { "id": "B", "color": "#3b82f6" }, { "id": "C", "color": "#3b82f6" }, { "id": "D", "color": "#3b82f6" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "1", "target": "3" }, { "source": "2", "target": "3" },
    { "source": "A", "target": "B" }, { "source": "A", "target": "C" }, { "source": "A", "target": "D" },
    { "source": "B", "target": "C" }, { "source": "B", "target": "D" }, { "source": "C", "target": "D" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Graf G (Repartit): K₃ (3 arestes) + K₄ (6 arestes) = <b>9 arestes</b></div>

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#ef4444" }, { "id": "2", "color": "#ef4444" },
    { "id": "3", "color": "#3b82f6" }, { "id": "A", "color": "#3b82f6" }, { "id": "B", "color": "#3b82f6" }, { "id": "C", "color": "#3b82f6" }, { "id": "D", "color": "#3b82f6" }
  ],
  "links": [
    { "source": "1", "target": "2" },
    { "source": "A", "target": "B" }, { "source": "A", "target": "C" }, { "source": "A", "target": "D" }, { "source": "A", "target": "3" },
    { "source": "B", "target": "C" }, { "source": "B", "target": "D" }, { "source": "B", "target": "3" },
    { "source": "C", "target": "D" }, { "source": "C", "target": "3" },
    { "source": "D", "target": "3" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Si transvasem un node per polaritzar: K₂ (1 ar) + K₅ (10 ar) = <b>11 arestes!</b> Hem guanyat arestes (+2).</div>

**Demostració matemàtica:**
Ho demostrem observant què passa si prenem dos components complets de $G$ ($K_a$ i $K_b$) on $a \\ge b \\ge 2$ i extraiem un vèrtex del grup petit per transferir-lo al grup més gran.

Si movem **un vèrtex** del component de mida $b$ cap al d'$a$:
*   Arestes afegides al component nou gran: hi ha un nou complet $K_{a+1}$, guanyant $+a$ arestes.
*   Arestes perdudes al component minvat: deixem un $K_{b-1}$, perdent $-(b-1)$ arestes.

L'increment net ($\\Delta m$) a la mida total serà:
$$ \\Delta m = a - (b - 1) = a - b + 1 $$

Atès que $a \\ge b$, tenim que **$\\Delta m > 0$**.
Això demostra que concentrar vèrtexs d'un grup petit a un grup més gran **sempre guanya arestes**.

Aplicant transvasaments successivament, el màxim absolut insuperable s'aconseguirà quan hàgim buidat els grupets deixant-los a 1 sol vèrtex ($K_1$), acumulant absolutament tot el volum a la bossa central gros ($K_{n-k}$). Aquest estat final és **exactament el graf $H$**.

Llavors concloem que per a qualsevol graf $G$:
$$ m(G) \\le m(H) = \\frac{(n-k)(n-k-1)}{2} $$
$\\square$
  `,
  availableLanguages: ['ca']
};
