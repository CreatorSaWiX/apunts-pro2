import type { Solution } from '../../../solutions';

export const ex10_10: Solution = {
  id: 'M2-T10-Ex10',
  title: 'Exercici 10: Distància mínima a una corba en el espai',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els punts de la corba intersecció de la superfície $x^2 - xy + y^2 - z^2 = 1$ i la superfície $x^2 + y^2 = 1$ que són més a prop a l'origen de coordenades.`,
  content: `### 1. Definició del problema
Volem minimitzar la distància al quadrat a l'origen:
$$f(x,y,z) = x^2 + y^2 + z^2$$
Subjecte a les dues restriccions:
1.  $g_1(x,y,z) = x^2 - xy + y^2 - z^2 = 1$
2.  $g_2(x,y,z) = x^2 + y^2 = 1$

### 2. Simplificació del sistema
En lloc d'utilitzar multiplicadors de Lagrange directament amb tres variables, podem simplificar el problema utilitzant la segona restricció en la primera i en la funció objectiu.

De (2) sabem que $x^2 + y^2 = 1$. Substituïm això en (1):
$$1 - xy - z^2 = 1 \\implies xy + z^2 = 0 \\implies \\mathbf{z^2 = -xy}$$

Com que $z^2$ ha de ser un nombre no negatiu ($z^2 \\geq 0$), la condició imposa que el producte **$xy \\leq 0$**.

Ara substituïm $x^2 + y^2 = 1$ en la funció objectiu:
$$f(x,y,z) = (x^2 + y^2) + z^2 = 1 + z^2$$

### 3. Minimització
Per minimitzar $f = 1 + z^2$, hem de fer que $z^2$ sigui el més petit possible.
Com que $z^2 \\geq 0$, el valor mínim possible és **$z = 0$**.

Si $z = 0$, aleshores de la relació $z^2 = -xy$ obtenim:
$$-xy = 0 \\implies \\mathbf{xy = 0}$$

Això ens indica que o bé $x=0$ o bé $y=0$. Combinant-ho amb la restricció $x^2 + y^2 = 1$:
*   Si $x = 0 \\implies y^2 = 1 \\implies y = \\pm 1$.
*   Si $y = 0 \\implies x^2 = 1 \\implies x = \\pm 1$.

### 4. Resultat final
Els punts de la corba més propers a l'origen són:
$$\\mathbf{(0, 1, 0), \\, (0, -1, 0), \\, (1, 0, 0), \\, (-1, 0, 0)}$$

Tots aquests punts estan a una distància $d = \\sqrt{0^2 + 1^2 + 0^2} = \\mathbf{1}$ de l'origen.`,
  availableLanguages: ['ca']
};
