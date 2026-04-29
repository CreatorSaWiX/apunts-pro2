import type { Solution } from '../../../solutions';

export const ex7_6: Solution = {
  id: 'M1-T7-Ex7.6',
  title: 'Exercici 7.6: Propietats de les imatges de conjunts de vectors',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $E$ i $F$ dos espais vectorials, $f: E \\to F$ una aplicació lineal, i $v_1, v_2, \\dots, v_n$ vectors d'E. Discutiu les afirmacions següents: demostreu les certes i doneu contraexemples per a les falses.

1) Si $v_1, v_2, \\dots, v_n$ són linealment independents, aleshores $f(v_1), f(v_2), \\dots, f(v_n)$ són linealment independents.

2) Si $f(v_1), f(v_2), \\dots, f(v_n)$ són linealment independents, aleshores $v_1, v_2, \\dots, v_n$ són linealment independents.

3) Si $v_1, v_2, \\dots, v_n$ és un conjunt de generadors d'E, aleshores $f(v_1), f(v_2), \\dots, f(v_n)$ és un conjunt de generadors de F.

4) Si $f(v_1), f(v_2), \\dots, f(v_n)$ és un conjunt de generadors de F, aleshores $v_1, v_2, \\dots, v_n$ és un conjunt de generadors d'E.

5) Si $v_1, v_2, \\dots, v_n$ és un conjunt de generadors d'E, aleshores $f(v_1), f(v_2), \\dots, f(v_n)$ és un conjunt de generadors de $\\text{Im } f$.`,
  content: `
Aquest exercici ens ajuda a entendre com una aplicació lineal "transporta" les estructures d'independència i generació d'un espai a un altre.

---

### 1) Si $\\{v_i\\}$ són LI, llavors $\\{f(v_i)\\}$ són LI

**FALS.** Una aplicació lineal pot "col·lapsar" vectors independents.
- **Contraexemple:** Sigui $f: \\mathbb{R}^2 \\to \\mathbb{R}^2$ l'aplicació nul·la, $f(v) = \\vec{0}$. Els vectors $v_1 = (1,0)$ i $v_2 = (0,1)$ són LI, però les seves imatges $f(v_1) = \\vec{0}$ i $f(v_2) = \\vec{0}$ són linealment dependents (qualsevol conjunt que contingui el vector zero és LD).
- **Nota:** Aquesta afirmació només és certa si $f$ és **injectiva**.

---

### 2) Si $\\{f(v_i)\\}$ són LI, llavors $\\{v_i\\}$ són LI

**CERT.**
- **Demostració:** Suposem que $\\{v_1, \\dots, v_n\\}$ fossin LD. Llavors existiria una combinació lineal no nul·la tal que $\\sum_{i=1}^n \\alpha_i v_i = \\vec{0}$. Si apliquem $f$:
  $$f\\left(\\sum_{i=1}^n \\alpha_i v_i\\right) = f(\\vec{0}) \\implies \\sum_{i=1}^n \\alpha_i f(v_i) = \\vec{0}$$
  Això voldria dir que $\\{f(v_1), \\dots, f(v_n)\\}$ són LD, cosa que contradiu la hipòtesi. Per tant, els vectors originals han de ser LI.

---

### 3) Si $\\{v_i\\}$ generen E, llavors $\\{f(v_i)\\}$ generen F

**FALS.** Les imatges dels generadors de $E$ generen la imatge de l'aplicació ($Im f$), però no necessàriament tot l'espai d'arribada $F$.
- **Contraexemple:** Sigui $f: \\mathbb{R} \\to \\mathbb{R}^2$ on $f(x) = (x, 0)$. El vector $v_1 = 1$ genera $\mathbb{R}$, però la seva imatge $f(v_1) = (1, 0)$ no genera tot $\mathbb{R}^2$ (només l'eix X).
- **Nota:** Aquesta afirmació només és certa si $f$ és **exhaustiva**.

---

### 4) Si $\\{f(v_i)\\}$ generen F, llavors $\\{v_i\\}$ generen E

**FALS.**
- **Contraexemple:** Sigui $f: \\mathbb{R}^2 \\to \\mathbb{R}$ on $f(x, y) = x$. Si triem $v_1 = (1, 0)$, la seva imatge $f(v_1) = 1$ genera $\mathbb{R}$ (que és $F$). Tanmateix, $v_1$ no genera tot $\mathbb{R}^2$ (no pot generar vectors amb component $y$ diferent de zero).

---

### 5) Si $\\{v_i\\}$ generen E, llavors $\\{f(v_i)\\}$ generen $\text{Im } f$

**CERT.**
- **Demostració:** Per definició, qualsevol vector $w \\in Im f$ és la imatge d'algun vector $v \\in E$, és a dir, $w = f(v)$. Com que $\\{v_i\\}$ genera $E$, podem escriure $v$ com a combinació lineal: $v = \\sum \\alpha_i v_i$. Llavors:
  $$w = f(v) = f\\left(\\sum \\alpha_i v_i\\right) = \\sum \\alpha_i f(v_i)$$
  Això demostra que qualsevol vector de $Im f$ es pot escriure com a combinació lineal de $\\{f(v_i)\\}$, per tant, el conjunt $\\{f(v_1), \\dots, f(v_n)\\}$ genera $Im f$.
`,
  availableLanguages: ['ca']
};
