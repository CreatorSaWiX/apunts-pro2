import type { Solution } from '../../../solutions';

export const ex5_26: Solution = {
   id: 'M1-T5-Ex5.26',
   title: 'Exercici 5.26: Propietats Algebraiques dels Determinants',
   author: 'SaWiX',
   code: '',
   type: 'notebook',
   statement: `Siguin $A$ i $B$ matrius quadrades d'ordre 3 tals que $\\det(A) = 10$ i $\\det(B) = 12$. Calculeu:
1) $\\det(AB)$
2) $\\det(A^4)$
3) $\\det(2B)$
4) $\\det(A^t)$
5) $\\det(A^{-1})$`,
   content: `
Per resoldre aquest exercici apliquem les propietats fonamentals dels determinants:
- **Producte:** $\\det(AB) = \\det(A) \\cdot \\det(B)$
- **Potència:** $\\det(A^k) = (\\det A)^k$
- **Escalament:** $\\det(k A) = k^n \\det(A)$, on $n$ és l'ordre de la matriu.
- **Transposada:** $\\det(A^t) = \\det(A)$
- **Inversa:** $\\det(A^{-1}) = \\frac{1}{\\det(A)}$

---

### Resultats:

1. **$\\det(AB)$**:
   $$\\det(A) \\cdot \\det(B) = 10 \\cdot 12 = \\mathbf{120}$$

2. **$\\det(A^4)$**:
   $$(\\det A)^4 = 10^4 = \\mathbf{10000}$$

3. **$\\det(2B)$**:
   Com que l'ordre és $n=3$:
   $$2^3 \\cdot \\det(B) = 8 \\cdot 12 = \\mathbf{96}$$

4. **$\\det(A^t)$**:
   $$\\det(A) = \\mathbf{10}$$

5. **$\\det(A^{-1})$**:
   $$\\frac{1}{\\det(A)} = \\frac{1}{10} = \\mathbf{0.1}$$
`,
   availableLanguages: ['ca']
};
