import type { Solution } from '../../solutions';

export const ex1_27: Solution = {
  id: 'M1-T1-Ex1.27',
  title: 'Exercici 1.27: Grafs Autocomplementaris (General)',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Un graf és *autocomplementari* si és isomorf al seu graf complementari.\n\n1) Quantes arestes té un graf autocomplementari d'ordre $n$?\n2) Demostreu que si $n$ és l'ordre d'un graf autocomplementari, aleshores $n$ és congruent amb 0 o amb 1 mòdul 4.\n3) Comproveu que si $n = 4k$ per $k \\ge 1$, la construcció següent dona un graf autocomplementari: prenem $V = V_1 \\cup V_2 \\cup V_3 \\cup V_4$, on cada $V_i$ conté $k$ vèrtexs; els vèrtexs de $V_1$ i de $V_2$ indueixen grafs complets; a més, tenim totes les arestes entre $V_1$ i $V_3$, entre $V_3$ i $V_4$, i entre $V_4$ i $V_2$.\n4) Com podem modificar la construcció anterior per obtenir un graf autocomplementari amb $n = 4k + 1$ vèrtexs?`,
  content: `
**1) Arestes d'un graf autocomplementari**
Com $G \\cong G^c$, cadascun ha de tenir exactament la meitat de les arestes del graf complet:
$ m = \\frac{n(n-1)}{4} $

**2) Limitacions mòdul 4**
Com que l'equació anterior ha de retornar forçosament un valor enter positiu i real:
El producte del numerador $n(n-1)$ ha de ser múltiple de 4. Com que $n$ i $(n-1)$ formen una seqüència intersecant consecutiva, el múltiple comú cau sobre només un bloc:
* Cas factor a $n$: $n \\equiv 0 \\pmod 4$
* Cas factor a $n-1$: $n-1 \\equiv 0 \\pmod 4 \\implies n \\equiv 1 \\pmod 4$

**3) Comprovació de la construcció particional ($n=4k$)**
Prenent: $V_1, V_2$ (cliques complets) i $V_3, V_4$ (conjunts estables de nodes no unificats de la mateixa fracció proporcional $k$). Les vinculacions establint conjunts només amb adjacències creuades formals demostren com el Complementari d'aquest fa l'invers perfecte i bijectable per:
$ V_1^c \\to V_3, \\, V_2^c \\to V_4 $
La inversió s'ajusta purament generant isomorfismes en base general i demostrant les seqüències automàtiques d'apropiació de patrons a qualsevol bloc base gran parell autocomplementari.

**4) Modificació en funció de restes senars ($4k+1$)**
L'únic pas procedimental i resolutiu és integrar un vèrtex extern "$v$" aliè als conjunts prèviament isomorfs com a node cèntric d'associació amb dos únics costats de la base particional autocomplementària descrita en paritat de forces asimètriques amb elements passats. El reflex sobre el "node zero $v$" traspassarà a l'espai oposat intacte l'extensió i respectarà purament la clàusula inicial de la funció bijectiva $f$.
`,
  availableLanguages: ['ca']
};
