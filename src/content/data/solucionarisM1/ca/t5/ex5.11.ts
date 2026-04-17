import type { Solution } from '../../../solutions';

export const ex5_11: Solution = {
  id: 'M1-T5-Ex5.11',
  title: 'Exercici 5.11: Identitats Notables amb Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Esbrineu si les igualtats següents les satisfan totes les matrius $A, B \\in \\mathcal{M}_n(\\mathbb{R})$. En cas negatiu, doneu alguna condició sobre $A$ i $B$ per tal que es satisfacin.
1) $(A + B)^2 = A^2 + B^2 + 2AB$;
2) $(A - B)(A + B) = A^2 - B^2$.`,
  content: `
### 1) Estudi de $(A + B)^2 = A^2 + B^2 + 2AB$

Desenvolupem utilitzant la propietat distributiva:
$$(A + B)^2 = (A + B)(A + B) = A^2 + AB + BA + B^2$$

Comparem aquest resultat amb la igualtat proposada:
$$A^2 + AB + BA + B^2 = A^2 + B^2 + 2AB \\implies AB + BA = 2AB$$

$$BA = 2AB - AB \\implies BA = AB$$

La condició necessària i suficient és que les matrius $A$ i $B$ **commutin** ($AB = BA$).

---

### 2) Estudi de $(A - B)(A + B) = A^2 - B^2$

Desenvolupem el producte del costat esquerre:
$$(A - B)(A + B) = A^2 + AB - BA - B^2$$

Comparem amb el costat dret:
$$A^2 + AB - BA - B^2 = A^2 - B^2 \\implies AB - BA = O$$
$$AB = BA$$

La condició és, novament, que les matrius $A$ i $B$ **commutin** ($AB = BA$).

`,
  availableLanguages: ['ca']
};
