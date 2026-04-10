import type { Solution } from '../../../solutions';

export const ex3_8: Solution = {
  id: 'M1-T3-Ex3.8',
  title: 'Exercici 3.8: El Graf n-cub (Qn)',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `El graf $n$-cub $Q_n$ té per conjunt de vèrtexs $\{0, 1\}^n$ i dos vèrtexs $(x_1, x_2, \\dots, x_n), (y_1, y_2, \\dots, y_n)$ són adjacents si difereixen en exactament una coordenada.
  
1. Representeu $Q_i$ per $1 \\le i \\le 4$.
2. Determineu l'ordre, la mida i la seqüència de graus de $Q_n$.
3. Trobeu els valors de $n$ tals que $Q_n$ és eulerià.`,
  content: `
### 1. Representació de $Q_n$ ($n=1, 2, 3$)

El graf $Q_n$ es pot veure com la generalització d'un cub en $n$ dimensions.

::::grid{cols=3}
:::graph{height=150}
\`\`\`json
{
  "nodes": [{ "id": "0" }, { "id": "1" }],
  "links": [{ "source": "0", "target": "1" }]
}
\`\`\`
:::
:::graph{height=150}
\`\`\`json
{
  "nodes": [{ "id": "00" }, { "id": "01" }, { "id": "11" }, { "id": "10" }],
  "links": [
    { "source": "00", "target": "01" }, { "source": "01", "target": "11" },
    { "source": "11", "target": "10" }, { "source": "10", "target": "00" }
  ]
}
\`\`\`
:::
:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "000" }, { "id": "001" }, { "id": "011" }, { "id": "010" },
    { "id": "100" }, { "id": "101" }, { "id": "111" }, { "id": "110" }
  ],
  "links": [
    { "source": "000", "target": "001" }, { "source": "000", "target": "010" }, { "source": "000", "target": "100" },
    { "source": "001", "target": "011" }, { "source": "001", "target": "101" },
    { "source": "010", "target": "011" }, { "source": "010", "target": "110" },
    { "source": "100", "target": "101" }, { "source": "100", "target": "110" },
    { "source": "011", "target": "111" }, { "source": "101", "target": "111" }, { "source": "110", "target": "111" }
  ]
}
\`\`\`
:::
<div class="text-center text-xs text-slate-400">Q_1 (Segment)</div>
<div class="text-center text-xs text-slate-400">Q_2 (Quadrat)</div>
<div class="text-center text-xs text-slate-400">Q_3 (Cub)</div>
::::


*Nota: $Q_4$ (l'hipercub) té 16 vèrtexs i 32 arestes. Es pot visualitzar com dos cubs $Q_3$ connectats vèrtex a vèrtex.*

### 2. Propietats de $Q_n$

- **Ordre ($n$ vèrtexs)**: El nombre de cadenes binàries de longitud $n$ és $|V| = 2^n$.
- **Grau**: Cada vèrtex té exactament **$n$** veïns (podem canviar qualsevol de les $n$ coordenades per obtenir un veí). És un graf **$n$-regular**.
- **Seqüència de graus**: $(n, n, \\dots, n)$ repetit $2^n$ vegades.
- **Mida ($m$ arestes)**: Aplicant el Lema de les encaixades ($2m = \\sum g(v)$):
  $$2m = n \\cdot 2^n \\implies m = n \\cdot 2^{n-1}$$

### 3. Eulerianitat de $Q_n$

Segons el Teorema d'Euler, un graf connex és eulerià si i només si tots els seus vèrtexs tenen grau parell.
- El grau de cada vèrtex a $Q_n$ és $n$.
- Per tant, $Q_n$ serà eulerià si i només si **$n$ és un nombre parell**. **$Q_n$ és eulerià $\\iff n \\in \\{2, 4, 6, \\dots\\}$**

> Tot i que només és eulerià per a $n$ parells, es pot demostrar que el graf $Q_n$ és **hamiltonià** per a tot $n \\ge 2$.
  
`,
  availableLanguages: ['ca']
};
