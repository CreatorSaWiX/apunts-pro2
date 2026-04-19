import type { Solution } from '../../../solutions';

export const ex6_5: Solution = {
  id: 'M1-T6-Ex6.5',
  title: 'Exercici 6.5: Espai de Polinomis de Grau Parell',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $P(\\mathbb{R})_p$ el conjunt de tots els polinomis amb coeficients a $\\mathbb{R}$ i on totes les potències de $x$ tenen grau parell. Esbrineu si $P(\\mathbb{R})_p$ és un espai vectorial amb les operacions de suma i producte per escalar habituals. (Considerem que el polinomi 0 té grau 0.)`,
  content: `
Per determinar si $P(\\mathbb{R})_p$ és un espai vectorial, comprovarem si compleix les propietats de **subespai vectorial** del conjunt de tots els polinomis $\\mathbb{R}[x]$, que ja sabem que és un espai vectorial.

Un subconjunt $S$ és un subespai vectorial si conté el vector nul i és tancat per la suma i el producte per escalar.

### 1) Existència de l'element neutre (Polinomi nul)

El polinomi nul $p(x) = 0$ pertany a $P(\\mathbb{R})_p$?
L'enunciat ens indica que considerem que el polinomi $0$ té grau $0$. Com que $0$ és un nombre parell, el polinomi nul compleix la condició de pertinença al conjunt.
$$0 \\in P(\\mathbb{R})_p$$

### 2) Tancament respecte a la suma

Siguin $p(x)$ i $q(x)$ dos polinomis de $P(\\mathbb{R})_p$. Això vol dir que es poden escriure com:
$$p(x) = a_0 + a_2 x^2 + a_4 x^4 + \\dots + a_{2n} x^{2n}$$
$$q(x) = b_0 + b_2 x^2 + b_4 x^4 + \\dots + b_{2m} x^{2m}$$

Si els sumem:
$$(p+q)(x) = (a_0 + b_0) + (a_2 + b_2) x^2 + (a_4 + b_4) x^4 + \\dots$$

El resultat és un nou polinomi on totes les potències de $x$ segueixen sent parelles. Per tant:
$$(p+q)(x) \\in P(\\mathbb{R})_p$$

### 3) Tancament respecte al producte per escalar

Sigui $p(x) \\in P(\\mathbb{R})_p$ i sigui $\\lambda \\in \\mathbb{R}$ un escalar qualsevol:
$$(\\lambda p)(x) = \\lambda(a_0 + a_2 x^2 + a_4 x^4 + \\dots) = (\\lambda a_0) + (\\lambda a_2) x^2 + (\\lambda a_4) x^4 + \\dots$$

Totes les potències de $x$ en el polinomi resultant són parelles. Per tant:
$$(\\lambda p)(x) \\in P(\\mathbb{R})_p$$

### Conclusió

Com que es compleixen les tres condicions, $P(\\mathbb{R})_p$ és un **subespai vectorial** de $\\mathbb{R}[x]$ i, per tant, és un **espai vectorial** amb les operacions habituals.
`,
  availableLanguages: ['ca']
};
