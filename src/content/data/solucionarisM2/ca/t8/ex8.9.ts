import type { Solution } from '../../../solutions';

export const ex8_9: Solution = {
  id: 'M2-T8-Ex9',
  title: 'Exercici 9: Corbes de nivell i direccions de creixement',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu la funció $f(x,y) = x^2 + (y - 1)^2 - 1$.
  
a) Feu un esboç de les corbes de nivell de $z = f(x,y)$ corresponents als nivells $z = -2, -1, 0, 3$.
b) Quina és la direcció en la qual $f(x,y)$ creix més ràpidament en el punt $P = (-1,3)$? Trobeu la derivada direccional en aquesta direcció.
c) Quina és la direcció en la qual $f(x,y)$ decreix més ràpidament en el punt $P = (-1,3)$? Trobeu la derivada direccional en aquesta direcció.
d) Quina és la direcció en la qual $f(x,y)$ és constant en el punt $P = (-1,3)$? Trobeu la derivada direccional en aquesta direcció.`,
  content: `### Apartat a) Esboç de les corbes de nivell
L'equació de les corbes de nivell $k$ és:
$$x^2 + (y-1)^2 - 1 = k \\implies x^2 + (y-1)^2 = k + 1$$
Això representa circumferències centrades al punt $(0,1)$ amb radi $R = \\sqrt{k+1}$.

* **$k = -2$**: $x^2 + (y-1)^2 = -1$. No existeix cap punt (radi imaginari).
* **$k = -1$**: $x^2 + (y-1)^2 = 0$. És el punt $(0,1)$, que és el mínim de la funció.
* **$k = 0$**: $x^2 + (y-1)^2 = 1$. Circumferència de radi 1.
* **$k = 3$**: $x^2 + (y-1)^2 = 4$. Circumferència de radi 2.

---

### Càlcul del gradient a $P(-1,3)$
Primer comprovem que $f$ és de classe $C^1$ (és polinòmica).
* $f_x = 2x \\implies f_x(-1,3) = -2$
* $f_y = 2(y-1) \\implies f_y(-1,3) = 4$
$$\\nabla f(-1,3) = (-2, 4)$$

---

### Apartat b) Creixement màxim
Es produeix en la direcció del gradient: **$\\vec{v} = (-2, 4)$**.
El valor de la derivada en aquesta direcció és el mòdul del gradient:
$$D_{\\vec{v}} f(P) = \\|\\nabla f(P)\\| = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20} = 2\\sqrt{5}$$

---

### Apartat c) Decreixement màxim
Es produeix en la direcció oposada al gradient: **$\\vec{v} = (2, -4)$**.
El valor de la derivada és:
$$D_{\\vec{v}} f(P) = -\\|\\nabla f(P)\\| = -2\\sqrt{5}$$

---

### Apartat d) Direcció constant
Es produeix en la direcció tangent a la corba de nivell (direccions perpendiculars al gradient).
Si $\\nabla f = (-2, 4)$, els vectors perpendiculars són **$(4, 2)$** i **$(-4, -2)$**.
El valor de la derivada en aquestes direccions és **0**.
`,
  availableLanguages: ['ca']
};
