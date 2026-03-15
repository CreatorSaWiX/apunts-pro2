import type { Solution } from '../../solutions';

export const ex3_6: Solution = {
  id: 'M1-T3-Ex3.6',
  title: 'Exercici 3.6: Ponts i Graus Parells',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Demostreu que un graf connex amb tots els vèrtexs de grau parell no té arestes pont.`,
  content: `
Aquesta demostració es pot fer de forma molt elegant utilitzant la propietat de la suma de graus (Lema de la naperada).

### Esquema de la demostració per contradicció

1. **Hipòtesi**: Suposem que existeix un graf $G$ on tots els vèrtexs tenen grau parell, però el graf té almenys una **aresta pont** $e = (u, v)$.
2. **Conseqüència del pont**: Per definició de pont, si eliminem l'aresta $e$, el graf $G$ es divideix en dues components connexes separades, $G_1$ i $G_2$. Suposem que el vèrtex $u$ queda a $G_1$ i el vèrtex $v$ queda a $G_2$.
3. **Anàlisi de graus a $G_1$**:
   - Tots els vèrtexs de $G_1$ (excepte $u$) tenen exactament el mateix grau que tenien a $G$, ja que cap de les seves arestes ha estat eliminada. Per tant, el seu grau segueix sent **parell**.
   - El vèrtex $u$, però, ha perdut l'aresta $e$. El seu nou grau a $G_1$ és $g_{G_1}(u) = g_G(u) - 1$. Com que $g_G(u)$ era parell, ara $g_{G_1}(u)$ és **senar**.
4. **Contradicció (Handshaking Lemma)**:
   - El Lema de la naperada diu que la suma dels graus dels vèrtexs de qualsevol graf ha de ser parell (és igual a $2|E|$).
   - A la component $G_1$, tenim un vèrtex de grau senar ($u$) i tota la resta de grau parell.
   - La suma de graus de $G_1$ seria: $\\text{Parell} + \\text{Parell} + \\dots + \\text{Senar} = \\mathbf{Senar}$.
   - Això és **impossible**.

### Conclusió
Com que hem arribat a una contradicció, la nostra hipòtesi inicial era falsa. Per tant, un graf on tots els vèrtexs tenen grau parell **no pot tenir arestes pont**.

---

### Per què passa això visualment?
En un cicle (o circuit eulerià), sempre que entres a un component per un camí, n'has de sortir per un altre per poder tornar a l'origen. Un pont és un camí d'anada sense tornada possible (trencant la condició de circuit).

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "u", "label": "u", "color": "#ef4444" },
    { "id": "v", "label": "v", "color": "#ef4444" },
    { "id": "1" }, { "id": "2" }, { "id": "3" }, { "id": "4" }
  ],
  "links": [
    { "source": "u", "target": "1" }, { "source": "1", "target": "2" }, { "source": "2", "target": "u" },
    { "source": "v", "target": "3" }, { "source": "3", "target": "4" }, { "source": "4", "target": "v" },
    { "source": "u", "target": "v", "label": "PONT", "color": "#facc15" }
  ]
}
\`\`\`
:::
<div class="text-center text-xs text-slate-400 mt-2">Si eliminem el pont groc, $G_1$ tindria només el vèrtex $u$ amb grau senar (2), contradient la teoria.</div>
  `,
  availableLanguages: ['ca']
};
