import type { Solution } from "../../../solutions";

export const ex7_4: Solution = {
  id: "M2-T7-Ex4",
  title: "Exercici 4: Domini i Corbes de Nivell complexes",
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu la funció $f(x,y) = \\frac{\\ln(xy)}{\\sqrt{1 - x^2 + y}}$.
  
  a) Trobeu el seu domini i representeu-lo gràficament.
  
  b) Calculeu l'equació de la corba de nivell de la superfície $z = f(x,y)$ que passa pel punt $(1,1)$ i representeu-la gràficament.`,
  content: `
### a) Càlcul del Domini

Per determinar el domini de $f(x,y)$, hem de considerar les restriccions imposades per les funcions elementals que la componen:

1.  **Logaritme neperià**: L'argument ha de ser estrictament positiu:
    $$xy > 0$$
    Això es compleix en el **primer quadrant** ($x>0, y>0$) i en el **tercer quadrant** ($x<0, y<0$).

2.  **Arrel quadrada al denominador**: L'interior de l'arrel ha de ser estrictament positiu (no pot ser zero perquè està dividint):
    $$1 - x^2 + y > 0 \\implies y > x^2 - 1$$
    Això representa el conjunt de punts que estan **per sobre de la paràbola** $y = x^2 - 1$.

**Conclusió**: El domini $D$ és la intersecció d'aquestes regions:
$$D = \\{(x,y) \\in \\mathbb{R}^2 : xy > 0, y > x^2 - 1\\}$$

::mafs{type="ex_7_4_a"}

---

### b) Corba de nivell pel punt $(1,1)$

Primer, trobem el valor de la constant $k$ avaluant la funció en el punt $(1,1)$:
$$f(1,1) = \\frac{\\ln(1 \\cdot 1)}{\\sqrt{1 - 1^2 + 1}} = \\frac{\\ln(1)}{\\sqrt{1}} = \\frac{0}{1} = 0$$

Per tant, busquem la corba de nivell $k = 0$:
$$\\frac{\\ln(xy)}{\\sqrt{1 - x^2 + y}} = 0 \\implies \\ln(xy) = 0$$
Aplicant l'exponencial a ambdós costats:
$$xy = e^0 \\implies xy = 1 \\implies y = \\frac{1}{x}$$

Aquesta corba és una **hipèrbola**. Noteu que només té sentit en les regions que pertanyen al domini definit a l'apartat anterior. Com que el punt $(1,1)$ és al primer quadrant i compleix $1 > 1^2 - 1$, la branca de la hipèrbola que busquem és la del primer quadrant.

::mafs{type="ex_7_4_b"}
`
};
