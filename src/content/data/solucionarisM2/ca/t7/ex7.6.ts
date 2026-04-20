import type { Solution } from '../../../solutions';

export const ex7_6: Solution = {
  id: 'M2-T7-Ex6',
  title: 'Exercici 6: Topologia i Compacitat',
  author: 'asdf',
  code: '',
  type: 'notebook',
  statement: `Considereu els conjunts:

$A = \\{(x,y) \\in \\mathbb{R}^2 : x^2 - y^2 < 1\\}$

$B = \\{(x,y) \\in \\mathbb{R}^2 : x > 0, y > 0, xy \\le 1\\}$

$C = \\{(x,y,z) \\in \\mathbb{R}^3 : x + y + z = 1, x^2 + y^2 + z^2 \\le 1\\}$

a) Dibuixeu aquests conjunts.

b) Trobeu la frontera, l'interior i l'adherència d'aquests conjunts.

c) Quins d'aquests conjunts són oberts? I quins tancats? I quins compactes?`,
  content: `
### a) Dibuix dels conjunts

### Conjunt A
És la regió compresa **entre** les dues branques de la hipèrbola $x^2 - y^2 = 1$. Inclou l'eix d'ordenades ($x=0$) i tots els punts tals que $|x| < \\sqrt{1 + y^2}$. Com que la desigualtat és estricta, la frontera és oberta.

::mafs{type="ex_7_6_a"}

### Conjunt B
És la regió del primer quadrant ($x>0, y>0$) situada per sota o sobre la hipèrbola equilàtera $y = 1/x$. Noteu que els eixos no estan inclosos en la definició original, però la hipèrbola sí.

::mafs{type="ex_7_6_b"}

### Conjunt C
És la intersecció d'un pla ($x+y+z=1$) amb una bola sòlida ($x^2+y^2+z^2 \\le 1$). El resultat és un **disc circular** situat sobre el pla.

::three{type="vis_ex_7_6_c"}

---

### b) Topologia dels conjunts

### Per al conjunt $A$:
L'expressió $x^2 - y^2 < 1$ defineix un conjunt obert de forma natural (funció contínua < constant).
- **$A^\\circ$**: El propi conjunt $A$.
- **$\\bar{A}$**: $\\{(x,y) \\in \\mathbb{R}^2 : x^2 - y^2 \\le 1\\}$.
- **$Fr(A)$**: La hipèrbola $\\{(x,y) \\in \\mathbb{R}^2 : x^2 - y^2 = 1\\}$.

### Per al conjunt $B$:
- **$B^\\circ$**: $\\{(x,y) \\in \\mathbb{R}^2 : x > 0, y > 0, xy < 1\\}$.
- **$\\bar{B}$**: $\\{(x,y) \\in \\mathbb{R}^2 : x \\ge 0, y \\ge 0, xy \\le 1\\}$.
- **$Fr(B)$**: Formada per la hipèrbola $xy=1$ ($x>0$), el segment de l'eix X ($x \\ge 0, y=0$) i el segment de l'eix Y ($y \\ge 0, x=0$). Noteu que la frontera s'estén fins a l'infinit.

### Per al conjunt $C$:
- **$C^\\circ$**: $\\emptyset$ (en $\\mathbb{R}^3$). Un disc en un pla no té interior en l'espai tridimensional perquè qualsevol bola 3D centrada en un punt del disc sortirà del pla.
- **$\\bar{C}$**: El propi conjunt $C$ (ja que és tancat).
- **$Fr(C)$**: El propi conjunt $C$ (ja que $Fr(C) = \\bar{C} \\setminus C^\\circ = C \\setminus \\emptyset = C$).

---

### c) Tipus de conjunts

### Conjunt A:
- **Obert**: Sí ($A = A^\\circ$).
- **Tancat**: No ($Fr(A) \\not\\subset A$).
- **Compacte**: No (no és tancat, i tampoc és acotat).

### Conjunt B:
- **Obert**: No (conté punts de la hipèrbola on $xy=1$).
- **Tancat**: No (no conté els punts sobre els eixos on $x=0$ o $y=0$).
- **Compacte**: No (no és tancat ni acotat).

### Conjunt C:
- **Obert**: No ($C \\ne C^\\circ = \\emptyset$).
- **Tancat**: Sí ($Fr(C) = C \\subset C$).
- **Compacte**: **Sí**. És tancat i acotat (està contingut dins de la bola unitat).
`,
  availableLanguages: ['ca']
};
