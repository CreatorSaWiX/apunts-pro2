import type { Solution } from '../../solutions';

export const ex1_20: Solution = {
  id: 'M1-T1-Ex1.20',
  title: 'Exercici 1.20: Festa i Salutacions',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `L'Aran i la seva parella organitzen una festa on es reuneixen un total de 5 parelles. Es produeixen un cert nombre de salutacions però, com és natural, ningú no saluda la pròpia parella. A la sortida l'Aran pregunta a tothom quantes persones ha saludat i rep nou respostes diferents. Quantes persones ha saludat l'Aran i quantes la seva parella?\n_Indicació_: Descriviu un graf que modeli la situació. Esbrineu quantes salutacions fa cada membre d'una parella.`,
  content: `
Modelem el problema amb un graf $G=(V, A)$ on els vèrtexs són les 10 persones (5 parelles) i les arestes representen salutacions.

**Restriccions del grau:**
* Ningú es saluda a si mateix ni a la seva parella.
* El grau màxim possible és $\\Delta(G) = 10 - 2 = 8$.
* Com que l'Aran rep 9 respostes diferents (valors entre 0 i 8), els graus dels altres assistents són exactament $\\{0, 1, 2, 3, 4, 5, 6, 7, 8\\}$.

Diguem-los $v_0, v_1, \\dots, v_8$ on $\g(v_i) = i$. 

**Aparellament lògic:**
1. $v_8$ ha saludat a tothom excepte a la seva parella. Com que $v_0$ no ha saludat a ningú, l'única opció és que **$v_8$ i $v_0$ siguin parella**.
2. Si ignorem $v_8$ i $v_0$, la resta de graus es redueixen en 1 (tots passen a tenir de 0 a 6 salutacions restants).
3. Repetint el procés recursivament:
   * **$v_7$ i $v_1$** són parella.
   * **$v_6$ i $v_2$** són parella.
   * **$v_5$ i $v_3$** són parella.

**Conclusió:**
L'única persona que queda sense emparellar en aquesta deducció és $v_4$. Per tant, l'Aran ha de ser la parella de $v_4$.

Com que la regla de sumes de parelles es manté constant i simètrica en aquest graf, l'Aran també ha de tenir grau 4.
**Resposta**: L'Aran ha saludat a **4 persones**, i la seva parella també a **4**.

:::graph{height=300}
\`\`\`json
{
  "nodes": [
    { "id": "v8 (8)", "color": "#f87171" }, { "id": "v0 (0)", "color": "#fca5a5" },
    { "id": "v7 (7)", "color": "#fb923c" }, { "id": "v1 (1)", "color": "#fdba74" },
    { "id": "v6 (6)", "color": "#fbbf24" }, { "id": "v2 (2)", "color": "#fcd34d" },
    { "id": "v5 (5)", "color": "#a3e635" }, { "id": "v3 (3)", "color": "#bef264" },
    { "id": "v4 (Aran)", "color": "#38bdf8" }, { "id": "v4 (Par)", "color": "#7dd3fc" }
  ],
    "links": [
      { "source": "v8 (8)", "target": "v7 (7)" }, { "source": "v8 (8)", "target": "v1 (1)" },
      { "source": "v8 (8)", "target": "v6 (6)" }, { "source": "v8 (8)", "target": "v2 (2)" },
      { "source": "v8 (8)", "target": "v5 (5)" }, { "source": "v8 (8)", "target": "v3 (3)" },
      { "source": "v8 (8)", "target": "v4 (Aran)" }, { "source": "v8 (8)", "target": "v4 (Par)" }
    ]
}
\`\`\`
:::
`,
  availableLanguages: ['ca']
};
