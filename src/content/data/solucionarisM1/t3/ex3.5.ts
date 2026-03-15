import type { Solution } from '../../solutions';

export const ex3_5: Solution = {
  id: 'M1-T3-Ex3.5',
  title: 'Exercici 3.5: Connectant Components Eulerians',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf que té exactament dos components connexos que són eulerians. Trobeu el mínim nombre d'arestes que cal afegir per obtenir un graf eulerià.`,
  content: `
Perquè un graf sigui eulerià, ha de complir dues condicions:
1. Ser **connex**.
2. Que tots els seus vèrtexs tinguin **grau parell**.

### Anàlisi Inicial
Tenim dos components connexos $C_1$ i $C_2$. Com que ambdós són eulerians per separat:
- Tots els vèrtexs de $C_1$ tenen grau parell.
- Tots els vèrtexs de $C_2$ tenen grau parell.
- El graf global $G$ **no és connex** (té 2 components).

### Quantes arestes cal afegir?

1. **Amb 1 aresta**: Si afegim una aresta $e = (u, v)$ amb $u \in C_1$ i $v \in C_2$:
   - El graf passa a ser **connex**.
   - Però els vèrtexs $u$ i $v$ passen a tenir **grau senar** (parell + 1). El graf deixaria de ser eulerià (seria semi-eulerià).

2. **Amb 2 arestes**: 
   - **Opció Multigraf**: Si afegim dues arestes entre els mateixos vèrtexs, $e_1 = (u, v)$ i $e_2 = (u, v)$:
     - El graf és connex.
     - Els graus de $u$ i $v$ augmenten en 2, així que **segueixen sent parells**.
     - El mínim absolut és **2 arestes**.
   
   - **Opció Graf Simple**: Si no permetem arestes paral·leles, amb 2 arestes no podem mantenir la paritat i connectar-los (necessitaríem un cicle que passés pels dos components). El mínim en un graf simple seria **3 arestes** (formant un triangle entre components, per exemple: $(u, v), (u, w), (v, w)$ amb $u \in C_1$ i $v, w \in C_2$).

### Conclusió

> El nombre mínim d'arestes és **2**. 

*(Nota: En el context de camins eulerians, sovint es permeten multigrafs. Si s'exigeix que el graf sigui simple, el mínim seria 3).*

---

### Visualització (Cas Multigraf, $n=2$)

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "u", "label": "C1", "color": "#3b82f6" },
    { "id": "v", "label": "C2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "u", "target": "v", "label": "e1" },
    { "source": "u", "target": "v", "label": "e2" }
  ]
}
\`\`\`
:::
<div class="text-center text-xs text-slate-400 mt-2">Dues arestes connecten els components i mantenen els graus parells (+2).</div>
  `,
  availableLanguages: ['ca']
};
