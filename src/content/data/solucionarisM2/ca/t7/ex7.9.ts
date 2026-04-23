import type { Solution } from '../../../solutions';

export const ex7_9: Solution = {
  id: 'M2-T7-Ex9',
  title: 'Exercici 9: Verificació de corbes de nivell',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Comproveu que les paràboles $y = ax^2$ són corbes de nivell de la funció:
$$f(x,y) = \\frac{x^4 y^4}{(x^4 + y^2)^3}$$`,
  content: `
### Demostració teòrica

Per comprovar que les paràboles $y = ax^2$ són corbes de nivell, hem de substituir aquesta relació en l'expressió de la funció i verificar que el resultat és una constant (que no depèn de $x$ ni $y$, sinó només del paràmetre $a$ que defineix cada paràbola).

Substituïm $y = ax^2$ en $f(x,y)$:

$$f(x, ax^2) = \\frac{x^4 (ax^2)^4}{(x^4 + (ax^2)^2)^3}$$

Operem amb les potències del numerador i el denominador:

$$f(x, ax^2) = \\frac{x^4 \\cdot a^4 \\cdot x^8}{(x^4 + a^2 x^4)^3} = \\frac{a^4 x^{12}}{(x^4(1 + a^2))^3}$$

Simplifiquem el denominador elevant al cub:

$$f(x, ax^2) = \\frac{a^4 x^{12}}{x^{12}(1 + a^2)^3}$$

Finalment, cancel·lem el terme $x^{12}$:

$$f(x, ax^2) = \\frac{a^4}{(1 + a^2)^3}$$

### Conclusió

Com que el valor de la funció sobre qualsevol punt de la paràbola $y = ax^2$ val constantment $\\frac{a^4}{(1 + a^2)^3}$, queda demostrat que aquestes paràboles són, efectivament, les corbes de nivell de la funció $f(x,y)$.

A continuació podeu explorar com canvia el valor del nivell segons la paràbola escollida:

::mafs{type="ex_7_9"}
`,
  availableLanguages: ['ca']
};
