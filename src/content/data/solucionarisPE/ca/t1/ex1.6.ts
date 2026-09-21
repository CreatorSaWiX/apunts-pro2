import type { Solution } from '../../../solutions';

export const ex1_6: Solution = {
  id: 'PE-T1-Ex1.6',
  title: 'Exercici 1.6: Aeroport I - Probabilitats de facturació i embarcament',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Per estudiar l'eficiència en un aeroport, una primera aproximació ens porta a estudiar les probabilitats d'haver-se d'esperar a l'hora de facturar i a l'hora d'embarcar.

Considerem el cas d'un aeroport on s'ha comprovat que per a un viatger que arriba:
- La probabilitat de trobar cua a **facturació** és $0.4$.
- La probabilitat de trobar cua a l'**embarcament** és $0.6$ si va trobar cua a facturació, i de $0.2$ si no en va trobar.

### Calculeu les següents probabilitats:
a) De trobar cua a la facturació i a l'embarcament simultàniament.
b) De trobar cua a l'embarcament.
c) De trobar cua a l'embarcament si s'ha trobat cua a la facturació.
d) D'haver trobat cua a la facturació si no ha trobat cua a l'embarcament.`,
  content: `## 1. Definició dels esdeveniments i dades del problema

Definim els següents esdeveniments per a un passatger qualsevol:
- $F$: "El viatger troba cua a facturació".
- $\\neg F$: "El viatger no troba cua a facturació".
- $E$: "El viatger troba cua a l'embarcament".
- $\\neg E$: "El viatger no troba cua a l'embarcament".

De l'enunciat extraiem les probabilitats directes:
$$
P(F) = 0.4 \\implies P(\\neg F) = 1 - 0.4 = 0.6
$$
$$
P(E \\mid F) = 0.6 \\implies P(\\neg E \\mid F) = 1 - 0.6 = 0.4
$$
$$
P(E \\mid \\neg F) = 0.2 \\implies P(\\neg E \\mid \\neg F) = 1 - 0.2 = 0.8
$$

---

## 2. Resolució dels apartats

### Apartat a: Probabilitat de trobar cua a facturació i embarcament ($P(F \\cap E)$)
Apliquem la regla del producte de la probabilitat condicionada:
$$
P(F \\cap E) = P(F) \\cdot P(E \\mid F)
$$
Substituint els valors:
$$
P(F \\cap E) = 0.4 \\times 0.6 = 0.24 \\quad (24\\%)
$$

---

### Apartat b: Probabilitat de trobar cua a l'embarcament ($P(E)$)
Com que els esdeveniments $F$ i $\\neg F$ formen una partició completa de l'espai mostral, apliquem el **Teorema de la Probabilitat Total**:
$$
P(E) = P(F \\cap E) + P(\\neg F \\cap E)
$$
$$
P(E) = P(F) \\cdot P(E \\mid F) + P(\\neg F) \\cdot P(E \\mid \\neg F)
$$
Substituint:
$$
P(E) = 0.4 \\times 0.6 + 0.6 \\times 0.2 = 0.24 + 0.12 = 0.36 \\quad (36\\%)
$$
Per tant, la probabilitat de no trobar cua a embarcament és:
$$
P(\\neg E) = 1 - P(E) = 1 - 0.36 = 0.64 \\quad (64\\%)
$$

---

### Apartat c: Cua a embarcament si s'ha trobat cua a facturació ($P(E \\mid F)$)
Aquesta és una dada directe de l'enunciat del problema:
$$
P(E \\mid F) = 0.60 \\quad (60\\%)
$$

---

### Apartat d: Cua a facturació si NO ha trobat cua a embarcament ($P(F \\mid \\neg E)$)
Ens demanen la probabilitat inversa o a posteriori: sabem que el viatger ha embarcat ràpidament (sense cua) i volem avaluar la probabilitat que hagués fet cua prèviament a facturació.

Apliquem el **Teorema de Bayes**:
$$
P(F \\mid \\neg E) = \\frac{P(F \\cap \\neg E)}{P(\\neg E)} = \\frac{P(F) \\cdot P(\\neg E \\mid F)}{P(\\neg E)}
$$
Calculem el numerador:
$$
P(F \\cap \\neg E) = P(F) \\cdot P(\\neg E \\mid F) = 0.4 \\times (1 - 0.6) = 0.4 \\times 0.4 = 0.16
$$
I dividim pel denominador $P(\\neg E) = 0.64$:
$$
P(F \\mid \\neg E) = \\frac{0.16}{0.64} = \\frac{1}{4} = 0.25 \\quad (25\\%)
$$

---

## 3. Taula de contingència resum

Podem resumir totes les probabilitats conjuntes i marginals en la següent taula de probabilitat:

| Facturació \\ Embarcament | Cua ($E$) | No Cua ($\\neg E$) | **Marginal Facturació** |
| :--- | :---: | :---: | :---: |
| **Cua ($F$)** | $0.24$ | $0.16$ | **$0.40$** |
| **No Cua ($\\neg F$)** | $0.12$ | $0.48$ | **$0.60$** |
| **Marginal Embarcament** | **$0.36$** | **$0.64$** | **$1.00$** |

> **Observació**: $P(F \\mid \\neg E) = \\frac{0.16}{0.64} = 0.25$. Veiem com no haver trobat cua a l'embarcament redueix la probabilitat d'haver fet cua a facturació del $40\\%$ (probabilitat a priori) al $25\\%$ (probabilitat a posteriori).`
};
