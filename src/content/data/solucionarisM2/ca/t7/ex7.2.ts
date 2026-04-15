import type { Solution } from '../../../solutions';

export const ex7_2: Solution = {
  id: 'M2-T7-Ex2',
  title: 'Exercici 2: Dominis de funcions',
  author: 'asdf',
  code: '',
  type: 'notebook',
  statement: `Trobeu i representeu el domini de les funcions següents:

  a) $f(x,y) = \\ln(1 + xy)$
  
  b) $g(x,y) = \\sqrt{y \\sin x}$`,
  content: `
### a) Domini de $f(x,y) = \\ln(1 + xy)$

Perquè un logaritme estigui definit, el seu argument ha de ser **estrictament positiu**. Per tant, la condició del domini és:
$$1 + xy > 0 \\implies xy > -1$$

Podem analitzar la frontera (on $xy = -1$, és a dir, les hipèrboles $y = -1/x$):
1.  Si $x > 0$, llavors $y > -1/x$.
2.  Si $x < 0$, llavors $y < -1/x$.
3.  Si $x = 0$, la condició és $1 > 0$, que es compleix sempre. Per tant, tot l'eix $Y$ forma part del domini.

**Representació visual**: El domini és la regió entre les dues branques de la hipèrbola $xy = -1$. Com que la desigualtat és estricta, la frontera no forma part del domini (**conjunt obert**, la denotem $A^\\circ$).

::mafs{type="ex_7_2_a"}

---

### b) Domini de $g(x,y) = \\sqrt{y \\sin x}$

Perquè una arrel quadrada (d'índex parell) estigui definida, el seu argument ha de ser **major o igual a zero**. La condició és:
$$y \\sin x \\ge 0$$

Això passa en dos casos clau:
1.  **Cas 1**: $\\sin x \\ge 0$ AND $y \\ge 0$.
    Els intervals on el sinus és positiu són $x \\in [0, \\pi], [2\\pi, 3\\pi]$, etc. (quadrants superiors).
2.  **Cas 2**: $\\sin x \\le 0$ AND $y \\le 0$.
    Els intervals on el sinus és negatiu són $x \\in [-\\pi, 0], [\\pi, 2\\pi]$, etc. (quadrants inferiors).

**Representació visual**: Això genera franges verticals de l'amplada $\\pi$ que alternen entre la part superior i inferior de l'eix $X$, creant un patró de tauler. Com que la desigualtat inclou el zero, la frontera (els eixos i les rectes verticals) **sí forma part del domini** (l'adherència $\\bar{B}$).

::mafs{type="ex_7_2_b"}
`,
  availableLanguages: ['ca']
};
