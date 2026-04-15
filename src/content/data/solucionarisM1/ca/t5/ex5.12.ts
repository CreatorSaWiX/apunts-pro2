import type { Solution } from '../../../solutions';

export const ex5_12: Solution = {
  id: 'M1-T5-Ex5.12',
  title: 'Exercici 5.12: Relació de Semblança entre Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $A$ i $B$ matrius quadrades del mateix tipus. Direm que $A$ és **semblant** a $B$ si existeix una matriu invertible $P$ tal que $B = P^{-1}AP$. Si aquest és el cas, proveu:
1) $B$ és semblant a $A$.
2) Ser semblants és una relació d'equivalència.
3) $A$ és invertible si, i només si, $B$ és invertible.
4) $A^t$ és semblant a $B^t$.
5) Si $A^n = 0$ i $B$ és semblant a $A$, aleshores $B^n = 0$.`,
  content: `
Aquest exercici defineix la **semblança** (o *similaritat*), que és un concepte fonamental en la diagonalització de matrius.

### 1) Simetria de la relació ($B$ semblant a $A$)

Si $A$ és semblant a $B$, existeix una matriu $P$ invertible tal que:
$$B = P^{-1} A P$$
Volem provar que $A$ es pot escriure com $Q^{-1} B Q$ per a alguna $Q$ invertible. Multipliquem per l'esquerra per $P$ i per la dreta per $P^{-1}$:
$$P B P^{-1} = P (P^{-1} A P) P^{-1} = (P P^{-1}) A (P P^{-1}) = I A I = A$$
Definim $Q = P^{-1}$. Llavors $Q^{-1} = (P^{-1})^{-1} = P$. Substituint:
$$A = Q^{-1} B Q$$
Per tant, **$B$ és semblant a $A$**.

### 2) Relació d'equivalència

Una relació és d'equivalència si compleix tres propietats:
- **Reflexiva**: $A = I^{-1} A I$. Tota matriu és semblant a si mateixa (prenent la matriu identitat com a $P$).
- **Simètrica**: Provat en l'apartat (1). Si $A \\sim B \\implies B \\sim A$.
- **Transitiva**: Suposem $A \\sim B$ ($B = P^{-1} A P$) i $B \\sim C$ ($C = Q^{-1} B Q$). Aleshores:
  $$C = Q^{-1} (P^{-1} A P) Q = (PQ)^{-1} A (PQ)$$
  Com que el producte de matrius invertibles ($PQ$) és invertible, $A \\sim C$.

### 3) Invertibilitat

Suposem $A$ invertible. Provarem que $B = P^{-1} A P$ també ho és:
$$B^{-1} = (P^{-1} A P)^{-1} = P^{-1} A^{-1} (P^{-1})^{-1} = P^{-1} A^{-1} P$$
Com que hem pogut trobar una inversa per a $B$ utilitzant $A^{-1}$, $B$ és invertible. El mateix raonament s'aplica a la inversa si suposem $B$ invertible.

### 4) Semblança de les transposades

Tenim $B = P^{-1} A P$. Apliquem la transposada a tota la igualtat:
$$B^t = (P^{-1} A P)^t = P^t A^t (P^{-1})^t$$
Sabem que la transposada de la inversa és la inversa de la transposada $(P^{-1})^t = (P^t)^{-1}$. Aleshores:
$$B^t = P^t A^t (P^t)^{-1}$$
Si definim $S = (P^t)^{-1}$, llavors $S^{-1} = P^t$. Substituint:
$$B^t = S^{-1} A^t S$$
Això prova que **$A^t$ i $B^t$ són semblants**.

### 5) Potències de matrius semblants

Desenvolupem $B^n$:
$$B^n = (P^{-1} A P)^n = (P^{-1} A P)(P^{-1} A P) \\dots (P^{-1} A P)$$
Observem que els termes intermedis s'anul·len: $P P^{-1} = I$.
$$B^n = P^{-1} A (P P^{-1}) A (P P^{-1}) \\dots A P = P^{-1} A^n P$$
Si $A^n = 0$, llavors:
$$B^n = P^{-1} \\cdot 0 \\cdot P = \\mathbf{0}$$
`,
  availableLanguages: ['ca']
};
