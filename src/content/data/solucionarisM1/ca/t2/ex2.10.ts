import type { Solution } from '../../../solutions';

export const ex2_10: Solution = {
   id: 'M1-T2-Ex2.10',
   title: 'Exercici 2.10: Graf estrella adherent G+z',
   author: 'Profe',
   code: '',
   type: 'notebook',
   statement: `Sigui $G = (V, A)$ un graf connex d'ordre almenys 2. Prenem $z \\notin V$ i definim $G + z$ com el graf que té $V \\cup \\{z\\}$ com a conjunt de vèrtexs i $A \\cup \\{zv : v \\in V\\}$ com a conjunt d'arestes. Demostreu que $G + z$ no té vèrtexs de tall.`,
   content: `
$G+z$ s'obté afegint un súper-node $z$ connectat a **tots** els vèrtexs del graf original.

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "v1", "color": "#3b82f6" }, { "id": "v2", "color": "#3b82f6" }, { "id": "v3", "color": "#3b82f6" }, 
    { "id": "z", "color": "#ef4444" }
  ],
  "links": [
    { "source": "v1", "target": "v2" }, { "source": "v2", "target": "v3" },
    { "source": "z", "target": "v1", "color": "#ef4444" }, { "source": "z", "target": "v2", "color": "#ef4444" }, { "source": "z", "target": "v3", "color": "#ef4444" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Exemple: Node z assoleix enllaç amb tothom simultàniament.</div>

Anem a veure que cap eliminació aïllada i concreta no desconnecta el mapa final:
1. **Borrem $z$:** Ens quedem amb $G$. Com que l'enunciat assegura que $G$ és connex, no s'ha desconnectat res.
2. **Borrem un $v \\in V$:** Resten d'altres nodes de pas. Com tots estan lligats a $z$, qualsevol parell de nodes sobreviurà connectat pel camí exprés garantit de redundància absoluta: $x \\to z \\to y$.

**Conclusió:** No hi ha forma de desconnectar-ho traient 1 sol element. Sense talls! $\\square$
  `,
   availableLanguages: ['ca']
};
