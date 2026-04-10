import type { Solution } from '../../../solutions';

export const ex2_3: Solution = {
  id: 'M1-T2-Ex2.3',
  title: 'Exercici 2.3: Components Connexos i Vèrtexs',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Un graf té ordre 13 i 3 components connexos. Demostreu que un dels components té un mínim de 5 vèrtexs.`,
  content: `
Ho demostrarem per **reducció a l'absurd**. Siguin $n_1, n_2, n_3$ els ordres dels 3 components, amb $n_1 + n_2 + n_3 = 13$. Suposem que **cap** component té 5 o més vèrtexs, és a dir, $n_i \\le 4$ per a tot $i$.

Llavors:
$$ n_1 + n_2 + n_3 \\le 4 + 4 + 4 = 12 $$

Però sabem que $n_1 + n_2 + n_3 = 13 > 12$. **Contradicció!**

Per tant, almenys un dels components ha de tenir $\\ge 5$ vèrtexs. $\\square$
  `,
  availableLanguages: ['ca']
};
