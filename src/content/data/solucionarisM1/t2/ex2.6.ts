import type { Solution } from '../../solutions';

export const ex2_6: Solution = {
  id: 'M1-T2-Ex2.6',
  title: 'Exercici 2.6: Mida en Dos Components Complets',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $n$ que té exactament dos components connexos i tots dos són grafs complets. Demostreu que la mida de $G$ és, almenys, $(n^2 - 2n)/4$.`,
  content: `
Tenim un graf $G$ amb $n$ vèrtexs format per dos components complets: $K_{n_1}$ i $K_{n_2}$, amb $n_1 + n_2 = n$.

**Intuïció:** La mida (arestes) es minimitza quan els dos components són el més iguals possible (equilibri $n/2, n/2$). Si desequilibrem, la mida creix.

<div class="flex flex-row gap-4 justify-center">
<div class="flex-1">

:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#3b82f6" }, { "id": "2", "color": "#3b82f6" }, { "id": "3", "color": "#3b82f6" },
    { "id": "4", "color": "#ef4444" }, { "id": "5", "color": "#ef4444" }, { "id": "6", "color": "#ef4444" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "1", "target": "3" }, { "source": "2", "target": "3" },
    { "source": "4", "target": "5" }, { "source": "4", "target": "6" }, { "source": "5", "target": "6" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Cas equilibrat (n=6): K₃ + K₃ = 6 arestes (mínim)</div>

</div>
<div class="flex-1">

:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#3b82f6" }, { "id": "2", "color": "#3b82f6" }, { "id": "3", "color": "#3b82f6" },
    { "id": "4", "color": "#3b82f6" }, { "id": "5", "color": "#3b82f6" },
    { "id": "6", "color": "#ef4444" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "1", "target": "3" }, { "source": "1", "target": "4" }, { "source": "1", "target": "5" },
    { "source": "2", "target": "3" }, { "source": "2", "target": "4" }, { "source": "2", "target": "5" },
    { "source": "3", "target": "4" }, { "source": "3", "target": "5" },
    { "source": "4", "target": "5" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Cas desequilibrat (n=6): K₅ + K₁ = 10 arestes</div>

</div>
</div>

**1. Mida total en funció de $n_1$**

$$ m = \\frac{n_1(n_1-1)}{2} + \\frac{n_2(n_2-1)}{2} $$

Substituïm $n_2 = n - n_1$ i simplifiquem:

$$ m(n_1) = \\frac{2n_1^2 - 2n \\cdot n_1 + n^2 - n}{2} $$

**2. On és el mínim?**

Aquesta és una paràbola en $n_1$ (coeficient positiu → forma de U). El mínim és al vèrtex: $n_1 = \\frac{n}{2}$.

**3. Avaluem al mínim** ($n_1 = n/2$):

$$ m_{min} = \\frac{ 2 \\cdot \\frac{n^2}{4} - 2n \\cdot \\frac{n}{2} + n^2 - n }{2} = \\frac{ \\frac{n^2}{2} - n^2 + n^2 - n }{2} = \\frac{n^2 - 2n}{4} $$

Com que el mínim de la funció és $\\frac{n^2 - 2n}{4}$, qualsevol repartiment compleix $m \\ge \\frac{n^2 - 2n}{4}$. $\\square$
  `,
  availableLanguages: ['ca']
};
