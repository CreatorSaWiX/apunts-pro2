import type { Solution } from '../../../solutions';

export const ex1_7: Solution = {
  id: 'PE-T1-Ex1.7',
  title: 'Exercici 1.7: Aeroport II - Facturació i control de passaports (CP)',
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `Per estudiar l'eficiència en un aeroport, una primera aproximació ens porta a estudiar les probabilitats d'haver-se d'esperar a l'hora de facturar i al control de passaports (CP).

Considerem el cas d'un aeroport on s'ha comprovat que per a un viatger que arriba, la probabilitat de trobar cua a facturació és $0.64$.

Posteriorment s'ha comprovat que les probabilitats d'esperar o no pel CP depenen del fet d'haver esperat al moment de facturar, com mostra la següent taula de probabilitats condicionades:

| Situació al CP | Si s'ha hagut d'esperar per facturar ($F$) | Si no s'ha hagut d'esperar per facturar ($\\neg F$) |
| :--- | :---: | :---: |
| **No espera ($E_0$)** | $0.187$ | $0.238$ |
| **Espera el primer a la cua ($E_1$)** | $0.687$ | $0.461$ |
| **Espera perquè ja hi ha una cua ($E_{>1}$)** | $0.126$ | $0.301$ |

### Calcula:
1. La probabilitat de no esperar a facturació ni a CP.
2. La probabilitat de ser atès immediatament al CP (és a dir, no hi ha ningú passant el control).
3. La probabilitat d'haver d'esperar a facturació o a CP.
4. La probabilitat d'haver d'esperar a un dels llocs (però només a un).
5. Si un viatger arriba al CP i ha d'esperar perquè hi ha una persona passant el control, i cap més: quina és la probabilitat d'haver esperat a facturació?
6. Els passatgers A i B arriben a l'aeroport en dos moments independents per agafar els seus vols. Trobeu la probabilitat que els dos hagin de posar-se a la cua al CP.`,
  content: `## 1. Formalització de variables i dades

Definim els esdeveniments per a un viatger:
- $F$: Espera a facturació ($P(F) = 0.64$).
- $\\neg F$: No espera a facturació ($P(\\neg F) = 1 - 0.64 = 0.36$).
- $E_0$: No espera al CP (és atès immediatament).
- $E_1$: Espera el primer a la cua del CP (exactament una persona passant el control).
- $E_{>1}$: Espera perquè ja hi ha cua formada al CP (més d'una persona davant).

L'esdeveniment "esperar al CP" és la unió:
$$
\\text{Espera a CP} = E_1 \\cup E_{>1} = \\neg E_0
$$

---

## 2. Resolució pas a pas

### Pregunta 1: Probabilitat de no esperar a facturació ni a CP
Busquem la intersecció de no esperar a cap dels dos serveis:
$$
P(\\neg F \\cap E_0) = P(\\neg F) \\cdot P(E_0 \\mid \\neg F)
$$
$$
P(\\neg F \\cap E_0) = 0.36 \\times 0.238 = 0.08568 \\approx 0.09 \\quad (8.57\\%)
$$

---

### Pregunta 2: Probabilitat de ser atès immediatament al CP ($P(E_0)$)
Apliquem el **Teorema de la Probabilitat Total** sobre la partició $\\{F, \\neg F\\}$:
$$
P(E_0) = P(F) \\cdot P(E_0 \\mid F) + P(\\neg F) \\cdot P(E_0 \\mid \\neg F)
$$
$$
P(E_0) = 0.64 \\times 0.187 + 0.36 \\times 0.238 = 0.11968 + 0.08568 = 0.20536 \\approx 0.21 \\quad (20.54\\%)
$$

---

### Pregunta 3: Probabilitat d'haver d'esperar a facturació o a CP
L'esdeveniment "esperar a facturació o a CP" és la unió $F \\cup \\neg E_0$.
El seu succés contrari (complementari) és exactament "no esperar a facturació ni a CP" (trobat a la pregunta 1):
$$
\\neg(F \\cup \\neg E_0) = \\neg F \\cap E_0
$$
Per tant:
$$
P(F \\cup \\neg E_0) = 1 - P(\\neg F \\cap E_0) = 1 - 0.08568 = 0.91432 \\approx 0.91 \\quad (91.43\\%)
$$

---

### Pregunta 4: Probabilitat d'haver d'esperar només a un dels dos llocs
L'esdeveniment és la diferència simètrica:
$$
(F \\cap E_0) \\cup (\\neg F \\cap \\neg E_0)
$$
Com que són esdeveniments incompatibles, sumem les seves probabilitats:
1. Espera a facturació i NO al CP:
   $$P(F \\cap E_0) = P(F) \\cdot P(E_0 \\mid F) = 0.64 \\times 0.187 = 0.11968$$
2. NO espera a facturació i SÍ al CP:
   $$P(\\neg F \\cap \\neg E_0) = P(\\neg F) \\cdot (1 - P(E_0 \\mid \\neg F)) = 0.36 \\times (1 - 0.238) = 0.36 \\times 0.762 = 0.27432$$

Sumant ambdues opcions:
$$
P(\\text{Només un lloc}) = 0.11968 + 0.27432 = 0.39400 \\approx 0.39 \\quad (39.40\\%)
$$

---

### Pregunta 5: Probabilitat d'haver esperat a facturació donat que espera sol el primer a la cua de CP
Ens condicionen pel succés $E_1$ (arriba i hi ha exactament una persona al control). Apliquem el **Teorema de Bayes**:
$$
P(F \\mid E_1) = \\frac{P(F \\cap E_1)}{P(E_1)} = \\frac{P(F) \\cdot P(E_1 \\mid F)}{P(F) \\cdot P(E_1 \\mid F) + P(\\neg F) \\cdot P(E_1 \\mid \\neg F)}
$$
Calculem cada component:
- Numerador:
  $$P(F \\cap E_1) = 0.64 \\times 0.687 = 0.43968$$
- Denominador $P(E_1)$:
  $$P(E_1) = 0.43968 + (0.36 \\times 0.461) = 0.43968 + 0.16596 = 0.60564$$
Dividint:
$$
P(F \\mid E_1) = \\frac{0.43968}{0.60564} \\approx 0.72597 \\approx 0.72 \\quad (72.60\\%)
$$

---

### Pregunta 6: Probabilitat que dos passatgers independents hagin de fer cua a CP
Sigui $C_{\\text{CP}} = \\neg E_0$ l'esdeveniment que un passatger hagi de fer cua al CP.
D'acord amb la Pregunta 2, per a qualsevol passatger:
$$
P(C_{\\text{CP}}) = 1 - P(E_0) = 1 - 0.20536 = 0.79464
$$
Si emprem el valor arrodonit del document $P(E_0) \\approx 0.21$:
$$
P(C_{\\text{CP}}) \\approx 1 - 0.21 = 0.79
$$
Donat que els passatgers A i B arriben en moments **estocàsticament independents**:
$$
P(C_{\\text{CP, A}} \\cap C_{\\text{CP, B}}) = P(C_{\\text{CP}})^2
$$
- Amb l'arrodoniment de les transparències oficials de la FIB:
  $$0.79^2 = 0.6241 \\approx 0.624 \\quad (62.4\\%)$$
- Amb el valor analític exacte:
  $$0.79464^2 \\approx 0.63145 \\quad (63.15\\%)$$`
};
