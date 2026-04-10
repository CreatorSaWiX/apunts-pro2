import type { Solution } from '../../../solutions';

export const ex3_12: Solution = {
  id: 'M1-T3-Ex3.12',
  title: 'Exercici 3.12: Unir components hamiltonians',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf que té exactament dos components connexos que són grafs hamiltonians. Trobeu el mínim nombre d'arestes que cal afegir per obtenir un graf hamiltonià.`,
  content: `
Per resoldre aquest problema, hem d'entendre què necessitem per formar un **cicle hamiltonià** que recorri tots els vèrtexs de dues components separades, $C_1$ i $C_2$.

### 1. Per què 1 aresta no és suficient?
Si afegim només una aresta entre un vèrtex $u \\in C_1$ i un vèrtex $v \\in C_2$, l'aresta resultant seria un **pont**.
- Qualsevol cicle en un graf no pot contenir cap aresta pont (ja que per tancar el cicle hauries de tornar a creuar el pont, repetint una aresta o un vèrtex).
- Per tant, amb 1 sola aresta el graf seria connex, però no podria tenir cap cicle que passés per vèrtexs de les dues components alhora.

### 2. Amb 2 arestes és suficient
Si afegim dues arestes, podem "cosir" els dos cicles originals per formar-ne un de sol més gran. Siguin els vèrtexs $u, u' \\in C_1$ i $v, v' \\in C_2$.

**Estratègia de construcció:**
1. Com que $C_1$ és hamiltonià, té un cicle que passa per tots els seus vèrtexs. Escollim una aresta d'aquest cicle, per exemple $(u, u')$, i la "deixem d'utilitzar".
2. Fem el mateix amb $C_2$, escollint una aresta $(v, v')$ del seu cicle hamiltonià.
3. Ara connectem els components afegint les arestes $(u, v)$ i $(u', v')$.
4. El nou cicle seria:
   - Camí hamiltonià de $C_1$ (des d'$u$ fins a $u'$).
   - Aresta nova $(u', v')$.
   - Camí hamiltonià de $C_2$ (des de $v'$ fins a $v$).
   - Aresta nova $(v, u)$.

Aquesta construcció garanteix un cicle que visita absolutament tots els vèrtexs de $G$ sense repetir-ne cap.

### Conclusió
El mínim nombre d'arestes que cal afegir és **2**.

---

### Visualització del procés
Imagineu dos quadrats ($C_1$ i $C_2$) que volem unir:

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "u", "label": "u", "color": "#3b82f6" },
    { "id": "u2", "label": "u'", "color": "#3b82f6" },
    { "id": "u3" }, { "id": "u4" },
    { "id": "v", "label": "v", "color": "#ef4444" },
    { "id": "v2", "label": "v'", "color": "#ef4444" },
    { "id": "v3" }, { "id": "v4" }
  ],
  "links": [
    { "source": "u", "target": "u3" }, { "source": "u3", "target": "u4" }, { "source": "u4", "target": "u2" },
    { "source": "v", "target": "v3" }, { "source": "v3", "target": "v4" }, { "source": "v4", "target": "v2" },
    { "source": "u", "target": "v", "label": "Nova 1", "color": "#10b981", "width": 3 },
    { "source": "u2", "target": "v2", "label": "Nova 2", "color": "#10b981", "width": 3 }
  ]
}
\`\`\`
:::
<div class="text-center text-xs text-slate-400 mt-2">Hem substituït una aresta de cada component per dues arestes pont (verdes) per fusionar els cicles.</div>
  `,
  availableLanguages: ['ca']
};
