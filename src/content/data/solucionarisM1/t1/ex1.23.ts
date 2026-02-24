import type { Solution } from '../../solutions';

export const ex1_23: Solution = {
  id: 'M1-T1-Ex1.23',
  title: 'Exercici 1.23: Classes Isomorfia',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Classifiqueu per classes d'isomorfia els grafs de la figura 1.1.`,
  content: `
Agrupem els grafs analitzant el seu ordre, mida, regularitat i l'existència de cicles característics.

1. **Classe 1: $K_4$**
   * **$G_1, G_2$**: Són grafs del tipus Complet d'ordre 4. Grau 3 a tots els vèrtexs.
2. **Classe 2: $C_5$**
   * **$G_3, G_4$**: Ambdós són grafs 2-regulars d'ordre 5, que equivalen al cicle invariant $C_5$.
3. **Classe 3: $K_{3,3}$**
   * **$G_5, G_6$**: Grafs d'ordre 6, 3-regulars i bipartits. $G_5$ permet l'alternança de color als vèrtexs de l'hexàgon per demostrar la bipartició.
4. **Classe 4: Prisma d'ordre 6**
   * **$G_7$**: Un graf geomètric pla 3-regular però que conté cicles de longitud menor (triangles) diferents dels de Petersen i $K_{3,3}$. 
5. **Classe 5: Graf de Petersen**
   * **$G_8, G_9$**: Tots dos són representacions isomorfes del mític graf 3-regular d'ordre 10 que no conté cicles de longitud $< 5$.
6. **Classe 6: Desargues o Möbius inferior**
   * **$G_{10}$**: Encara que té ordre 10 i grau regular 3 com el Petersen, té arestes creuades que **formen cicles de 4**. Això el descarta de l'isomorfisme amb $G_8, G_9$.
7. **Classe 7: Arbre no regular d'ordre 6**
   * **$G_{11}, G_{12}, G_{13}$**: Pertanyen a la mateixa classe arbòria on tenim un vèrtex central de grau 3 i rames simples; només varia la representació plana.
`,
  availableLanguages: ['ca']
};
