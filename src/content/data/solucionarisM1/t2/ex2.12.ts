import type { Solution } from '../../solutions';

export const ex2_12: Solution = {
  id: 'M1-T2-Ex2.12',
  title: 'Exercici 2.12: Ponts i Talls dependents als regulars',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Demostreu que un graf 3-regular té un vèrtex de tall si, i només si, té alguna aresta pont.`,
  content: `
Demostració de doble via ($\\iff$):

**1) Pont $\\implies$ Tall**  
Propietat del tema: els extrems d'un pont sempre resulten vèrtexs de tall, amb excepció que si l'extrem posseeix grau 1 ("fulla simple final"). Però l'enunciat assegura que un **3-regular** (tots connecten exactament $3$). Llavors l'excepció està morta. Hi ha vèrtex de tall.

**2) Tall $\\implies$ Pont**  
Suposem l'existència d'un vèrtex passiu de tall $v$.
Si l'extirpéssim en trossos, el graf base inicial és fragmenta obligat per pròpia definició en $\\ge 2$ subcomponents desconnectades lliures. 
Farem recompte de rutes: atès que $\\deg(v) = 3$, nosaltres teníem solament repartides **3 arestes** prèvies sortint seu cap al món per ajuntar trossos.
*   **El Repartiment Numèric** per distribuir $3$ fils entre $\\ge 2$ mons exigeix les pautes exclusives: 
    *   $1 + 1 + 1$
    *   $2 + 1$

Absolutament sempre i en totes les variants numèriques per paritat, apareixerà forçosament un món sencer rebent **només $1$ aresta lliure de $v$**.
I segons definim clarament, aquesta ruta fina, per on l'illa solia penjar de via única, actua netejanet per complet de **Pont**. $\\square$
  `,
  availableLanguages: ['ca']
};
