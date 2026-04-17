import type { Solution } from '../../../solutions';

export const ex5_9: Solution = {
  id: 'M1-T5-Ex5.9',
  title: 'Exercici 5.9: Condició de Simetria del Producte',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $A$ i $B$ dues matrius simètriques del mateix tipus. Proveu que $AB$ és una matriu simètrica si, i només si, $A$ i $B$ commuten.`,
  content: `
**Hipòtesis:**
1. $A$ és simètrica: $A^t = A$
2. $B$ és simètrica: $B^t = B$
3. $A$ i $B$ són del mateix tipus (perquè el producte estigui definit i sigui quadrat).

**Objectiu:** Provar que $(AB)^t = AB \\iff AB = BA$.

### Demostració

Utilitzarem la propietat fonamental de la transposada d'un producte: **$(AB)^t = B^t A^t$**.

Substituint les nostres hipòtesis de simetria ($B^t = B$ i $A^t = A$):
$$(AB)^t = B A$$

Perquè $AB$ sigui simètrica s'ha de complir que:
$$(AB)^t = AB$$

Substituint el resultat aplicant la transposada al producte ($(AB)^t = BA$):
$$B A = AB$$

Aquesta darrera igualtat és, precisament, la definició de **commutar**.
`,
  availableLanguages: ['ca']
};
