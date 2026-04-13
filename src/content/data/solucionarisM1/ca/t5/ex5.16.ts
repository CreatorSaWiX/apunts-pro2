import type { Solution } from '../../../solutions';

export const ex5_16: Solution = {
  id: 'M1-T5-Ex5.16',
  title: 'Exercici 5.16: Linealitat de les Equacions',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Quines de les equacions següents són lineals en $x, y$ i $z$?
1) $x + 3xy + 2z = 2$;
2) $y + x + \\sqrt{2}z = e^2$;
3) $x - 4y + 3z^{1/2} = 0$;
4) $y = z \\sin \\frac{\\pi}{4} - 2y + 3$;
5) $z + x - y^{-1} + 4 = 0$;
6) $x = z$.`,
  content: `
Una equació en les variables $x, y, z$ és **lineal** si es pot escriure de la forma:
$$ax + by + cz = d$$
on $a, b, c, d$ són constants reals. Això implica que les variables han d'estar elevades a la potència 1 i no es poden multiplicar entre elles ni aparèixer dins de funcions no lineals (com arrels, logaritmes o trigonomètriques).

---

### Anàlisi de les equacions:

1. **$x + 3xy + 2z = 2$**: **NO lineal**. El terme $3xy$ és un producte de dues variables, la qual cosa invalida la linealitat.
2. **$y + x + \\sqrt{2}z = e^2$**: **Lineal**. S'escruria com $1x + 1y + \\sqrt{2}z = e^2$. Cal recordar que $\\sqrt{2}$ i $e^2$ són constants (nombres reals).
3. **$x - 4y + 3z^{1/2} = 0$**: **NO lineal**. La variable $z$ està elevada a $1/2$ (una arrel quadrada), i requerim que el grau sigui exactament 1.
4. **$y = z \\sin \\frac{\\pi}{4} - 2y + 3$**: **Lineal**. Es pot reordenar com $0x + 3y - (\\sin \\frac{\\pi}{4})z = 3$. El terme $\\sin \\frac{\\pi}{4}$ és una constant ($\\frac{\\sqrt{2}}{2}$), no afecta les variables.
5. **$z + x - y^{-1} + 4 = 0$**: **NO lineal**. El terme $y^{-1}$ ($1/y$) no és de grau 1.
6. **$x = z$**: **Lineal**. Es pot escriure com $1x + 0y - 1z = 0$.

---

**Resum:** Les equacions lineals són la **2**, la **4** i la **6**.
`,
  availableLanguages: ['ca']
};
