import type { Solution } from '../../../solutions';

export const ex6_14: Solution = {
  id: 'M1-T6-Ex6.14',
  title: 'Exercici 6.14: Forma Genèrica d’un Subespai de Polinomis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu la forma genèrica dels polinomis de $P(\\mathbb{R})$ que pertanyen al subespai vectorial generat pel conjunt $\\{1+x, x^2\\}$.`,
  content: `
Un polinomi $p(x)$ pertany al subespai generat pel conjunt $S = \\{1+x, x^2\\}$ si es pot escriure com una combinació lineal dels elements de $S$.

Això vol dir que existeixen dos escalars $a, b \\in \\mathbb{R}$ tals que:
$$p(x) = a(1+x) + b(x^2)$$

Si desenvolupem l'expressió:
$$p(x) = a + ax + bx^2$$

### Forma genèrica

Podem expressar la forma genèrica de dues maneres:

1.  **En funció dels paràmetres**:
    $$p(x) = a + ax + bx^2, \\quad a, b \\in \\mathbb{R}$$

2.  **Mitjançant una condició sobre els coeficients**:
    Si denotem un polinomi genèric de grau $\\leq 2$ com $p(x) = a_2 x^2 + a_1 x + a_0$, observem que perquè pertanyi al subespai s'ha de complir que:
    $$a_1 = a_0 = a$$
    Per tant, la forma genèrica és el conjunt de polinomis de grau $\\leq 2$ tals que el seu terme independent i el seu coeficient de grau 1 són iguals.
`,
  availableLanguages: ['ca']
};
