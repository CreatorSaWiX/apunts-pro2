import type { Solution } from '../../../solutions';

export const ex5_5: Solution = {
  id: 'M1-T5-Ex5.5',
  title: 'Exercici 5.5: Representació Matricial de Dades',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Una empresa confecciona bosses i maletes en dues fàbriques diferents. La taula adjunta dóna la informació del cost total de fabricació en milers d'euros de cada producte a cada lloc:

| | Fàbrica 1 | Fàbrica 2 |
|---|---|---|
| Bosses | 135 | 150 |
| Maletes | 627 | 681 |

Responeu les preguntes següents mitjançant operacions matricials:
1) Sabent que el cost de personal representa $2/3$ del cost total, trobeu la matriu que representa el cost de personal de cada producte en cada fàbrica.
2) Trobeu la matriu que representa els costos de material de cada producte en cada fàbrica, suposant que, a més dels costos de personal i de materials, hi ha un cost de 20.000 euros per cada producte a cada fàbrica.`,
  content: `
Definim primer la **matriu de costos totals $C$** (en milers d'euros):
$$C = \\begin{pmatrix} 135 & 150 \\\\ 627 & 681 \\end{pmatrix}$$

### 1) Matriu de cost de personal ($P$)

Se'ns indica que el cost de personal és el $2/3$ del cost total. Per tant, multipliquem la matriu $C$ per l'escalar $2/3$:

$$P = \\frac{2}{3} C = \\frac{2}{3} \\begin{pmatrix} 135 & 150 \\\\ 627 & 681 \\end{pmatrix} = \\begin{pmatrix} \\frac{2 \\cdot 135}{3} & \\frac{2 \\cdot 150}{3} \\\\ \\frac{2 \\cdot 627}{3} & \\frac{2 \\cdot 681}{3} \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 90 & 100 \\\\ 418 & 454 \\end{pmatrix}}$$

### 2) Matriu de costos de material ($M$)

L'enunciat diu que el cost total es composa de:
$$\\text{Cost Total} = \\text{Personal} + \\text{Material} + \\text{Altres}$$

On els "Altres" costos són de 20.000 euros per cada producte i fàbrica. Com que la matriu $C$ està expressada en **milers d'euros**, 20.000 euros equivalen a **20** unitats. Definim la matriu d'altres costos $O$:
$$O = \\begin{pmatrix} 20 & 20 \\\\ 20 & 20 \\end{pmatrix}$$

Per trobar la matriu de materials $M$, aïllem:
$$M = C - P - O$$

$$C - P = \\begin{pmatrix} 45 & 50 \\\\ 209 & 227 \\end{pmatrix}$$

$$M = \\begin{pmatrix} 45 & 50 \\\\ 209 & 227 \\end{pmatrix} - \\begin{pmatrix} 20 & 20 \\\\ 20 & 20 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 25 & 30 \\\\ 189 & 207 \\end{pmatrix}}$$
`,
  availableLanguages: ['ca']
};
