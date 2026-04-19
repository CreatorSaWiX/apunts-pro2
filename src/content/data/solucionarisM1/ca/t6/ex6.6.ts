import type { Solution } from '../../../solutions';

export const ex6_6: Solution = {
  id: 'M1-T6-Ex6.6',
  title: "Exercici 6.6: Espai Vectorial de les Funcions Reals",
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu el conjunt $\\mathcal{F}(\\mathbb{R})$ format per totes les funcions $f : \\mathbb{R} \\to \\mathbb{R}$. Donades dues funcions $f,g \\in \\mathcal{F}(\\mathbb{R})$ i $\\lambda \\in \\mathbb{R}$, definim les funcions $f + g$ i $\\lambda f$ com:
  
$$(f + g)(x) = f(x) + g(x)$$
$$(\\lambda f)(x) = \\lambda f(x)$$

Demostreu que $\\mathcal{F}(\\mathbb{R})$ amb aquestes operacions és un $\\mathbb{R}$-espai vectorial.`,
  content: `
Per demostrar que $(\\mathcal{F}(\\mathbb{R}), +, \\cdot)$ és un espai vectorial sobre $\\mathbb{R}$, hem de verificar que es compleixen els 8 axiomes fonamentals. Totes aquestes propietats es basen en el fet que les operacions es defineixen punt a punt i aprofiten les propietats dels nombres reals.

### Propietats de la Suma (+)

Siguin $f, g, h \\in \\mathcal{F}(\\mathbb{R})$:

1.  **Associativa**: $((f+g)+h)(x) = (f(x)+g(x))+h(x) = f(x)+(g(x)+h(x)) = (f+(g+h))(x)$.
2.  **Commutativa**: $(f+g)(x) = f(x)+g(x) = g(x)+f(x) = (g+f)(x)$.
3.  **Element neutre**: Existeix la funció nul·la $z(x) = 0$ tal que $(f+z)(x) = f(x)+0 = f(x)$. Llavors $f+z = f$.
4.  **Element oposat**: Per a cada $f$, existeix $-f$ definida com $(-f)(x) = -f(x)$ tal que $(f+(-f))(x) = f(x)-f(x) = 0 = z(x)$.

### Propietats del Producte per Escalar ($\\cdot$)

Siguin $a, b \\in \\mathbb{R}$ i $f, g \\in \\mathcal{F}(\\mathbb{R})$:

5.  **Pseudo-associativa**: $(a(bf))(x) = a(b f(x)) = (ab)f(x) = ((ab)f)(x)$.
6.  **Element unitat**: $(1f)(x) = 1 \\cdot f(x) = f(x)$. Llavors $1f = f$.
7.  **Distributiva respecte a la suma de vectors**:
    $(a(f+g))(x) = a(f(x)+g(x)) = a f(x) + a g(x) = (af + ag)(x)$.
8.  **Distributiva respecte a la suma d'escalars**:
    $((a+b)f)(x) = (a+b)f(x) = a f(x) + b f(x) = (af + bf)(x)$.

### Conclusió

Com que es compleixen els vuit axiomes, el conjunt $\\mathcal{F}(\\mathbb{R})$ amb les operacions de suma i producte per escalar definides és un **$\\mathbb{R}$-espai vectorial**.
`,
  availableLanguages: ['ca']
};
