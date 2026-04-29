import type { Solution } from '../../../solutions';

export const ex7_4: Solution = {
  id: 'M1-T7-Ex7.4',
  title: 'Exercici 7.4: Imatge d\'un polinomi per linealitat',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$ l'aplicació lineal definida per: 
  
$f(1) = 1+x$, $f(x) = 3-x^2$ i $f(x^2) = 4+2x-3x^2$. 

Quina és la imatge del polinomi $a_0+a_1x+a_2x^2$? Calculeu $f(2-2x+3x^2)$.`,
  content: `
En una aplicació lineal, la imatge de qualsevol vector es pot calcular com la combinació lineal de les imatges dels vectors d'una base. En aquest cas, ens donen les imatges de la base canònica de $P_2(\\mathbb{R})$: $\\{1, x, x^2\\}$.

---

### 1) Imatge del polinomi genèric $a_0 + a_1 x + a_2 x^2$

Per la propietat de linealitat, sabem que:
$$f(a_0 + a_1 x + a_2 x^2) = a_0 f(1) + a_1 f(x) + a_2 f(x^2)$$

Substituïm les imatges donades:
$$f(a_0 + a_1 x + a_2 x^2) = a_0(1+x) + a_1(3-x^2) + a_2(4+2x-3x^2)$$

Ara agrupem els termes segons la potència de $x$:
$$f(a_0 + a_1 x + a_2 x^2) = (a_0 + 3a_1 + 4a_2) + (a_0 + 2a_2)x + (-a_1 - 3a_2)x^2$$

Aquesta és l'expressió general de l'aplicació.

---

### 2) Càlcul de $f(2 - 2x + 3x^2)$

Podem utilitzar l'expressió general que acabem de trobar substituint $a_0 = 2$, $a_1 = -2$ i $a_2 = 3$:

- **Terme constant:** $2 + 3(-2) + 4(3) = 2 - 6 + 12 = 8$
- **Terme en $x$:** $2 + 2(3) = 2 + 6 = 8$
- **Terme en $x^2$:** $-(-2) - 3(3) = 2 - 9 = -7$

Per tant:
$$f(2 - 2x + 3x^2) = 8 + 8x - 7x^2$$

---

**Comprovació alternativa:**
$$f(2 - 2x + 3x^2) = 2f(1) - 2f(x) + 3f(x^2)$$
$$= 2(1+x) - 2(3-x^2) + 3(4+2x-3x^2)$$
$$= (2+2x) - (6-2x^2) + (12+6x-9x^2)$$
$$= (2-6+12) + (2x+6x) + (2x^2-9x^2)$$
$$= 8 + 8x - 7x^2$$

El resultat és coherent.
`,
  availableLanguages: ['ca']
};
