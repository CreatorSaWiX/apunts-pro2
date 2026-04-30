import type { Solution } from '../../../solutions';

export const ex7_12: Solution = {
  id: 'M1-T7-Ex7.12',
  title: 'Exercici 7.12: Aplicacions bijectives i dimensions',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu si les aplicacions lineals següents són o no bijectives usant la informació que es dóna:

1) $f: \\mathbb{R}^n \\to \\mathbb{R}^n$, amb $\\ker f = \\{0_{\\mathbb{R}^n}\\}$;

2) $f: \\mathbb{R}^n \\to \\mathbb{R}^n$, amb $\\dim(\\text{Im } f) = n - 1$;

3) $f: \\mathbb{R}^m \\to \\mathbb{R}^n$, amb $n < m$;

4) $f: \\mathbb{R}^n \\to \\mathbb{R}^n$, amb $\\text{Im } f = \\mathbb{R}^n$.`,
  content: `
Per determinar si una aplicació lineal és bijectiva, recordem que ha de ser **injectiva** ($\ker f = \{0\}$) i **exhaustiva** ($\text{Im } f$ és tot l'espai d'arribada). 

En el cas particular d'un endomorfisme (mateixa dimensió en origen i arribada, $n = n$), les tres condicions són equivalents: **injectiva $\\iff$ exhaustiva $\\iff$ bijectiva**.

---

### 1) $f: \\mathbb{R}^n \\to \\mathbb{R}^n$, amb $\\ker f = \\{0_{\\mathbb{R}^n}\\}$

- Com que $\ker f = \{0\}$, l'aplicació és **injectiva**.
- Com que l'espai d'origen i el d'arribada tenen la mateixa dimensió ($n$), pel Teorema de la Dimensió sabem que l'aplicació també és exhaustiva.
- **Conclusió:** L'aplicació **és bijectiva**.

---

### 2) $f: \\mathbb{R}^n \\to \\mathbb{R}^n$, amb $\\dim(\\text{Im } f) = n - 1$

- La dimensió de la imatge ($n-1$) és inferior a la dimensió de l'espai d'arribada ($n$).
- Per tant, l'aplicació no és exhaustiva.
- **Conclusió:** L'aplicació **no és bijectiva**.

---

### 3) $f: \\mathbb{R}^m \\to \\mathbb{R}^n$, amb $n < m$

- Pel Teorema de la Dimensió: $\dim(\ker f) = m - \dim(\text{Im } f)$.
- Com que la dimensió de la imatge no pot superar $n$, tenim que $\dim(\ker f) \geq m - n$.
- Com que $m > n$, llavors $\dim(\ker f) \geq 1$. Això implica que $\ker f$ conté més vectors que el zero, així que no és injectiva.
- **Conclusió:** L'aplicació **no és bijectiva**.

---

### 4) $f: \\mathbb{R}^n \\to \\mathbb{R}^n$, amb $\\text{Im } f = \\mathbb{R}^n$

- Com que la imatge és tot l'espai d'arribada, l'aplicació és **exhaustiva**.
- En ser un endomorfisme (dimensions iguals), l'exhaustivitat implica injectivitat.
- **Conclusió:** L'aplicació **és bijectiva**.
`,
  availableLanguages: ['ca']
};
