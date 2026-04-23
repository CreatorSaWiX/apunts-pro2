import type { Solution } from '../../../solutions';

export const ex7_7: Solution = {
  id: 'M2-T7-Ex7',
  title: 'Exercici 7: Representació de dominis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu i representeu el domini de les funcions següents:

a) $f(x,y) = x^2 - y^2$;

b) $g(x,y) = \\sqrt{1 - x^2 - y^2}$;

c) $h(x,y) = \\ln(x + y)$.`,
  content: `
### a) Domini de $f(x,y) = x^2 - y^2$

La funció $f(x,y)$ és un polinomi. Els polinomis estan definits per a qualsevol valor real de les seves variables. Per tant:
$$D = \\mathbb{R}^2$$

Gràficament, el domini és tot el pla cartesià.

::mafs{type="ex_7_7_a"}

---

### b) Domini de $g(x,y) = \\sqrt{1 - x^2 - y^2}$

Perquè la funció estigui definida, l'argument de l'arrel quadrada ha de ser major o igual a zero:
$$1 - x^2 - y^2 \\ge 0 \\implies x^2 + y^2 \\le 1$$

Aquesta desigualtat representa el **disc unitat tancat** centrat a l'origen. Inclou tots els punts de l'interior i els de la circumferència de radi 1.

::mafs{type="ex_7_7_b"}

---

### c) Domini de $h(x,y) = \\ln(x + y)$

Perquè la funció logaritme estigui definida, el seu argument ha de ser estrictament positiu:
$$x + y > 0 \\implies y > -x$$

Gràficament, el domini és el semiplà situat per sobre de la recta $y = -x$. Com que la desigualtat és estricta, la recta $y = -x$ és una frontera **oberta** (no pertany al domini).

::mafs{type="ex_7_7_c"}
`,
  availableLanguages: ['ca']
};
