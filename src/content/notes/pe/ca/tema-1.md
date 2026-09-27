---
title: "Tema 1: Probabilitat i VAs"
description: "Probabilitat, Bayes, variables aleatòries discretes i contínues, indicadors i distribucions bivariants."
readTime: "30 min"
order: 1
draft: false
---

La teoria de la probabilitat proporciona el marc matemàtic formal per quantificar la incertesa i modelar experiments en què el resultat no es pot predir amb certesa absoluta.

## 1. Experiència aleatòria i definicions

### Fenòmens deterministes vs. aleatoris
Dins del mètode científic i l'enginyeria distingim dos tipus de fenòmens:

- **Fenòmens deterministes**: Condueixen exactament als mateixos resultats quan es reprodueixen a partir d'unes mateixes condicions inicials conegudes.
  - *Exemple*: Si posem la mà al foc, ens cremarem; o calcular el resultat d'una suma $2 + 2$ en una màquina.
- **Fenòmens aleatoris**: Presenten una incertesa intrínseca sobre el resultat d'una propera realització de l'experiència, fins i tot mantenint les condicions de partida.
  - *Exemple*: Llençar un dau equilibrat de sis cares; no podem predir amb certesa quin número sortirà.

### Espai mostral ($\Omega$)
L'**espai mostral** ($\Omega$) és el conjunt de **tots els resultats possibles** d'un experiment o experiència aleatòria:
$$
\Omega = \{\omega_1, \omega_2, \dots\}
$$

Exemples:
- **Llançament d'un dau de 6 cares**: $\Omega = \{1, 2, 3, 4, 5, 6\}$.
- **Llançament de dues monedes**: $\Omega = \{(\text{cara}, \text{cara}),\, (\text{cara}, \text{creu}),\, (\text{creu}, \text{cara}),\, (\text{creu}, \text{creu})\}$.
- **Recompte discret (processos d'arribada, peticions a un servidor)**: $\Omega = \{0, 1, 2, 3, \dots\}$.

### Successos o esdeveniments
Un **succés** o **esdeveniment** és qualsevol subconjunt de l'espai mostral ($A \subseteq \Omega$):
- **Succés elemental**: Conjunt format per un sol resultat individual $\{\omega_i\}$.
- **Succés segur**: Coincideix amb tot l'espai mostral $\Omega$. Sempre s'esdevé ($P(\Omega) = 1$).
- **Succés impossible**: Conjunt buit $\emptyset$. Mai no es pot produir ($P(\emptyset) = 0$).

---

## 2. Àlgebra d'esdeveniments i operacions de conjunts

Com que els esdeveniments són subconjunts de $\Omega$, s'hi apliquen directament totes les operacions de la teoria de conjunts. El resultat de qualsevol operació és un altre esdeveniment.

| Operació | Notació | Significat probabilístic | Diagrama de Venn |
| :--- | :---: | :--- | :---: |
| **Unió** | $A \cup B$ | Ocorre $A$, ocorre $B$ o ocorren tots dos («almenys un») | :vennviz{op="union"} |
| **Intersecció** | $A \cap B$ | Ocorren $A$ i $B$ simultàniament | :vennviz{op="intersection"} |
| **Complementari** | $\neg A$ o $\overline{A}$ | No ocorre el succés $A$ | :vennviz{op="complement_a"} |
| **Diferència** | $A \setminus B$ o $A - B$ | Ocorre $A$ però **no** ocorre $B$ ($A \cap \neg B$) | :vennviz{op="diff_a_b"} |

:::vennviz
:::

Dos conjunts o esdeveniments $A$ i $B$ són **disjunts** o **incompatibles** si la seva intersecció és buida:
$$
A \cap B = \emptyset
$$
Això implica que no poden produir-se simultàniament en una mateixa realització de l'experiment (els seus cercles al diagrama de Venn no es toquen).

### Lleis de De Morgan
Permeten transformar la negació d'unions i interseccions:
1. $\neg(A \cup B) = \neg A \cap \neg B$ («Ni $A$ ni $B$»)
2. $\neg(A \cap B) = \neg A \cup \neg B$ («Com a mínim un dels dos no passa»)

### Partició de l'espai mostral
Una família finita d'esdeveniments $\{A_1, A_2, \dots, A_n\}$ constitueix una **partició** de l'espai mostral $\Omega$ si i només si compleix tres condicions indispensables:

1. **No buits**: $A_i \neq \emptyset$ per a tot $i \in \{1, \dots, n\}$.
2. **Disjunts dos a dos**: $A_i \cap A_j = \emptyset$ per a tot $i \neq j$.
3. **Unió exhaustiva**: $\bigcup_{i=1}^n A_i = \Omega$ (recobreixen tot l'espai mostral).

En el llançament d'un dau de 6 cares:
- $A_1 = \text{«sortir parell»} = \{2, 4, 6\}$
- $A_2 = \text{«sortir senar»} = \{1, 3, 5\}$

Com que $A_1 \cap A_2 = \emptyset$ i $A_1 \cup A_2 = \Omega$, els esdeveniments $\{A_1, A_2\}$ formen una partició de $\Omega$. Dos conjunts $A$ i $\neg A$ sempre formen una partició de l'espai mostral.

---

## 3. Axiomes de la probabilitat i propietats deduïdes

Per quantificar la incertesa es defineix una funció o aplicació $P: \mathcal{P}(\Omega) \to \mathbb{R}$ que assigna a cada succés $A$ un nombre real anomenat **probabilitat**. Per definició, la mesura de probabilitat ha de satisfer els tres axiomes de Kolmogórov:

1. **No-negativitat i acotació**:
   $$0 \le P(A) \le 1 \quad \forall A \subseteq \Omega$$
2. **Certesa de l'espai mostral**:
   $$P(\Omega) = 1$$
3. **Additivitat per a successos disjunts**: Si $A_i \cap A_j = \emptyset$ per a tot $i \neq j$, aleshores:
   $$P(A_1 \cup A_2 \cup \dots \cup A_n) = P(A_1) + P(A_2) + \dots + P(A_n)$$

A partir d'aquests axiomes es deriven directament les propietats fonamentals següents:

- **Probabilitat del succés contrari**:
  $$P(\neg A) = 1 - P(A)$$
- **Probabilitat del succés impossible**:
  $$P(\emptyset) = 0$$
- **Monotonia**: Si un esdeveniment està contingut en un altre ($A \subseteq B$), la seva probabilitat no pot ser superior:
  $$A \subseteq B \implies P(A) \le P(B)$$
- **Principi d'inclusió-exclusió (per a 2 successos)**:
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Principi d'inclusió-exclusió (per a 3 successos)**:
  $$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)$$

### Regla de Laplace (resultats equiprobables)
Quan un experiment aleatori té un nombre finit de resultats possibles i tots ells són **equiprobables** (tenen exactament la mateixa probabilitat d'ocórrer), la probabilitat d'un esdeveniment $A$ es calcula com:
$$
P(A) = \frac{\text{casos favorables}}{\text{casos totals}}
$$

---

## 4. Probabilitat condicionada

La **probabilitat condicionada** mesura com canvia la probabilitat d'un esdeveniment quan disposem d'informació prèvia sobre la realització d'un altre esdeveniment. Notem $P(A \mid B)$ la probabilitat d'observar $A$ sabent que s'ha produït l'esdeveniment $B$ (es llegeix «probabilitat de $A$ donat $B$» o «probabilitat de $A$ condicionada per $B$»).

Si $P(B) > 0$, la probabilitat condicionada es defineix com:
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}
$$

A la pràctica, condicionar per $B$ significa **reduir l'univers de resultats observables al conjunt $B$**. Tots els resultats fora de $B$ esdevenen impossibles, i les probabilitats dels subconjunts d'$A$ es reescalen dividint pel pes total de $B$. En avaluar $P(A \mid B)$, els dos esdeveniments juguen rols completament asimètrics: **$A$ és incert**, mentre que **$B$ és una dada coneguda o assumida com a certa**.

En general:
$$P(A \mid B) \neq P(B \mid A) \neq P(A \cap B)$$

Si definim $A = \text{«Fumar»}$ i $B = \text{«Tenir càncer de pulmó»}$, la probabilitat de ser fumador si ja s'ha diagnosticat càncer de pulmó és molt elevada ($P(A \mid B) \approx 0{,}85$); en canvi, la probabilitat de tenir càncer de pulmó sabent que una persona fuma és molt més petita ($P(B \mid A) \approx 0{,}10$). Confondre totes dues magnituds és una fal·làcia clàssica.

La informació que aporta l'ocurrència de $B$ sobre $A$ pot tenir tres efectes:
- **Afavoreix** ($B$ augmenta la probabilitat de $A$): $P(A \mid B) > P(A)$.
- **Desafavoreix** ($B$ disminueix la probabilitat de $A$): $P(A \mid B) < P(A)$.
- **Indiferent** ($B$ no aporta informació sobre $A$): $P(A \mid B) = P(A)$.

### Inversió de la desigualtat
Quan comparem les mides marginals de dos esdeveniments $A$ i $B$:
$$
P(A) > P(B) \implies \frac{1}{P(A)} < \frac{1}{P(B)} \implies \frac{P(A \cap B)}{P(A)} < \frac{P(A \cap B)}{P(B)} \implies P(B \mid A) < P(A \mid B)
$$

Siguin $A = \text{«Ser estudiant universitari»}$ i $B = \text{«Ser estudiant de la FIB»}$.  
Com que hi ha molts més universitaris que estudiants de la FIB, tenim $P(A) > P(B)$.
- Si algú és estudiant de la FIB ($B$), és segur que és universitari: $P(A \mid B) = 1$.
- Si escollim un universitari qualsevol a l'atzar ($A$), la probabilitat que sigui precisament de la FIB és molt baixa: $P(B \mid A) \approx 0{,}02$.
- Es compleix la regla d'inversió: $P(B \mid A) < P(A \mid B)$.

---

## 5. Teorema de Bayes

A partir de la definició de probabilitat condicionada podem aïllar la probabilitat de la intersecció (regla del producte):
$$
P(A \cap B) = P(A \mid B) \cdot P(B)
$$

Com que la intersecció és commutativa ($A \cap B = B \cap A$):
$$
P(B \cap A) = P(B \mid A) \cdot P(A)
$$

Igualant ambdues expressions:
$$
P(B \mid A) \cdot P(A) = P(A \mid B) \cdot P(B)
$$

Aïllant la probabilitat condicionada inversa obtenim la **fórmula de Bayes per a dos esdeveniments**:
$$
P(B \mid A) = \frac{P(A \mid B) \cdot P(B)}{P(A)}
$$

Aquesta relació fonamental permet passar de la probabilitat directa $P(A \mid B)$ a la probabilitat inversa $P(B \mid A)$ (revertir la relació entre causa i efecte).

---

## 6. Independència d'esdeveniments

Dos esdeveniments són **estadísticament independents** si l'ocurrència de l'un no aporta cap informació sobre l'ocurrència de l'altre ni en modifica la probabilitat d'ocurrència.

### Definició formal
Dos esdeveniments $A$ i $B$ són independents si i només si la probabilitat de la seva intersecció és igual al producte de les seves probabilitats marginals:
$$A \text{ i } B \text{ independents} \iff P(A \cap B) = P(A) \cdot P(B)$$

### Condicions equivalents
Si $P(A) > 0$ i $P(B) > 0$, les següents afirmacions són completament equivalents:
1. $P(A \cap B) = P(A) \cdot P(B)$
2. $P(A \mid B) = P(A)$
3. $P(B \mid A) = P(B)$
4. $P(B \mid A) = P(B \mid \neg A) = P(B)$

Si alguna d'aquestes igualtats no es compleix, els esdeveniments són **dependents** ($P(B \mid A) \neq P(B)$).

- **Exemple independent**: En llançar una moneda dues vegades, que surti cara a la 1a tirada ($C_1$) no canvia la probabilitat de treure cara a la 2a ($C_2$): $P(C_2 \mid C_1) = P(C_2) = \frac{1}{2} \implies P(C_1 \cap C_2) = \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$.
- **Exemple dependent**: Extreure cartes d'una baralla **sense reemplaçament**. La composició de la baralla per a la 2a carta depèn de quina carta s'ha extret primer.

És un error molt freqüent confondre que dos esdeveniments siguin disjunts amb el fet que siguin independents:
- **Disjunts (incompatibles)**: $A \cap B = \emptyset \implies P(A \cap B) = 0$.
- **Independents**: Exigeix $P(A \cap B) = P(A) \cdot P(B) > 0$.

Dos successos disjunts amb probabilitats estrictament positives ($P(A) > 0$ i $P(B) > 0$) **MAI poden ser independents!** Si són disjunts i sabem que ha passat $A$, tenim la certesa absoluta que no pot haver passat $B$ ($P(B \mid A) = 0 \neq P(B)$); per tant, l'ocurrència d'$A$ proporciona la màxima informació possible sobre $B$.

---

## 7. Eines de representació: arbres de probabilitat i taules de contingència

Per analitzar experiments compostos i estructurar les dades d'un problema s'utilitzen habitualment dues eines gràfiques complementàries.

### 7.1 Arbres d'esdeveniments i probabilitats
Un arbre de probabilitat desglossa un experiment en etapes seqüencials:
- **Nivell 1 (Arrel $\to$ primer nivell)**: Conté les probabilitats **marginals** dels esdeveniments inicials ($P(A)$ i $P(\neg A)$).
- **Nivell 2 (Branques interiors)**: Conté **sempre probabilitats condicionades**, mai probabilitats conjuntes.
- **Fulles terminals (regla del producte)**: La probabilitat conjunta del camí complet des de l'arrel fins a una fulla s'obté multiplicant les probabilitats de totes les branques del camí:
  $$P(A \cap B) = P(A) \cdot P(B \mid A)$$

:::probtreeviz
:::

- **Si $A$ i $B$ són independents**: Les branques del segon nivell no depenen del camí d'origen; valen directament $P(B)$ i $P(\neg B)$:
  $$P(A \cap B) = P(A) \cdot P(B)$$
- **Si $A$ i $B$ NO són independents**: Les probabilitats de les branques del segon nivell són condicionades al node pare: $P(B \mid A) \neq P(B \mid \neg A)$.

La suma de totes les fulles terminals de l'arbre és sempre igual a $1$:
$$\sum \text{Fulles} = P(A \cap B) + P(A \cap \neg B) + P(\neg A \cap B) + P(\neg A \cap \neg B) = 1$$

---

### 7.2 Taula de contingència ($2 \times 2$ de probabilitats)
Una taula de contingència creua dos esdeveniments binaris ($A$ i $B$):

| Esdeveniment | $B$ | $\neg B$ | **Marginal ($A$)** |
| :---: | :---: | :---: | :---: |
| **$A$** | $P(A \cap B)$ | $P(A \cap \neg B)$ | **$P(A)$** |
| **$\neg A$** | $P(\neg A \cap B)$ | $P(\neg A \cap \neg B)$ | **$P(\neg A)$** |
| **Marginal ($B$)** | **$P(B)$** | **$P(\neg B)$** | **$1{,}00$** |

1. **Cel·les interiors (4 cel·les)**: Contenen les probabilitats **conjuntes** d'ambdós successos ($P(A \cap B)$, etc.). La suma de les 4 cel·les interiors val $1$.
2. **Marges (última fila i última columna)**: Contenen les probabilitats **marginals** ($P(A), P(\neg A), P(B), P(\neg B)$), obtingudes sumant les files o columnes corresponents pel Teorema de la Probabilitat Total.
3. **Càlcul de probabilitats condicionades**: S'obtenen dividint la cel·la conjunta pel total del marge condicionant:
   - Condicionada sobre la fila $A$:
     $$P(B \mid A) = \frac{P(A \cap B)}{P(A)}$$
   - Condicionada sobre la columna $B$:
     $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Per comprovar si $A$ i $B$ són independents observant una taula de contingència, n'hi ha prou de verificar si **cada cel·la interior és exactament igual al producte dels seus dos marges**:
$$P(A \cap B) \stackrel{?}{=} P(A) \cdot P(B)$$
Si la igualtat es compleix a totes les cel·les, hi ha **independència estadística**. Si fins i tot una sola cel·la no la compleix, els esdeveniments són **dependents**.


---

## 8. Variables aleatòries

### 8.1 Motivació conceptual: De conjunts a la recta real

Fins ara definíem la probabilitat sobre subconjunts de l'espai mostral ($A \subseteq \Omega$). Ara bé, amb conjunts només podem fer operacions de teoria de conjunts (unions $A \cup B$, interseccions $A \cap B$, complementaris $\overline{A}$). **Els conjunts no es poden sumar, restar, multiplicar, derivar ni integrar**.

En definir una **variable aleatòria** com una funció $X: \Omega \to \mathbb{R}$, assignem a cada esdeveniment elemental $\omega \in \Omega$ un valor numèric real $X(\omega)$. En posar aquesta capa numèrica, passem d'un domini abstracte a la recta real: ara podem utilitzar tot el potencial de l'àlgebra, les desigualtats, límits, derivades i integrals.

Segons la naturalesa dels valors que pot prendre $X$, distingim dos grans tipus:
- **Variable Aleatòria Discreta (VAD)**: El conjunt de valors possibles és finit o enumerable (exemples: resultat d'un dau $\{1, 2, 3, 4, 5, 6\}$, nombre de peticions que arriben a un servidor $\{0, 1, 2, \dots\}$). Es calcula mitjançant **sumatoris ordinaris** ($\sum$).
- **Variable Aleatòria Contínua (VAC)**: Pren valors en un continu no enumerable de la recta real (exemples: temps d'execució d'un algorisme, memòria consumida, temps d'espera en una cua, temperatura). Aquí no podem llistar els valors d'un en un; cal fer el salt conceptual a les **integrals** ($\int$).

---

### 8.2 Variables Aleatòries Discretes (VAD)

Sigui $X$ una variable aleatòria discreta que pren valors en el conjunt $\{x_1, x_2, \dots\}$. Definim:

**Funció de probabilitat puntual ($p_X(k)$)**  
Assigna directament la probabilitat exacta a cada valor possible individual $k$:
$$
p_X(k) = P(X = k)
$$

Ha de complir dues condicions fonamentals:
1. $0 \le p_X(k) \le 1$ per a tot $k$.
2. La suma total de totes les probabilitats ha de ser exactament 1:
   $$\sum_k p_X(k) = 1$$

Es representa gràficament mitjançant un **gràfic de bastons**: cada bastó situat sobre el valor $k$ té una alçada igual a $p_X(k)$. **És una alçada pura, no és una àrea**.

**Funció de distribució acumulada ($F_X(x)$)**  
Mesura la probabilitat acumulada de tots els valors menors o iguals a un punt $x$:
$$
F_X(x) = P(X \le x) = \sum_{k \le x} p_X(k)
$$

Propietats de $F_X(x)$ en VAD:
- És una funció **esglaonada creixent a trossos**, amb salts verticals a cada valor possible $k$.
- La mida del salt vertical a cada valor $k$ és exactament la probabilitat puntual d'aquell punt:
  $$\Delta F = p_X(k) = F_X(k) - F_X(k^-)$$
- Límits als extrems: $\lim_{x \to -\infty} F_X(x) = 0$ i $\lim_{x \to +\infty} F_X(x) = 1$.

En variables discretes, les desigualtats estrictes exclouen valors de la suma:
$$P(a < X \le b) = \sum_{k=a+1}^b p_X(k) \quad \neq \quad P(a \le X \le b) = \sum_{k=a}^b p_X(k)$$

*Exemple*: En un dau de 6 cares equiprobable ($p_X(k) = 1/6$):
- $P(2 < X \le 5) = P(X \in \{3, 4, 5\}) = \frac{3}{6} = 0{,}50$
- $P(2 \le X \le 5) = P(X \in \{2, 3, 4, 5\}) = \frac{4}{6} \approx 0{,}67$

---

### 8.3 Variables Aleatòries Contínues (VAC)

Sigui $X$ una variable aleatòria contínua que pren valors en un interval o regió de la recta real ($X(\Omega) \subseteq \mathbb{R}$).

**Funció de densitat de probabilitat ($f_X(x)$)**  
Descriu com es reparteix la massa de probabilitat sobre la recta real. Perquè una funció pugui ser una funció de densitat vàlida ha de satisfer **obligatòriament dues condicions**:
1. **No-negativitat**: $f_X(x) \ge 0 \quad \forall x \in \mathbb{R}$ (no té sentit una densitat negativa).
2. **Àrea total sota la corba igual a 1**:
   $$\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$$

A diferència de les discretes, la probabilitat en una variable contínua és **sempre l'ÀREA sota la corba de densitat**:
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx
$$

Interpretació infinitesimal: Cada rectangle de Riemann té una base infinitesimal $dx$ i una alçada $f_X(x)$, de manera que la probabilitat infinitesimal d'un tramet és:
$$d\text{Àrea} = f_X(x)\,dx$$

**Funció de distribució acumulada ($F_X(x)$) i la Regla de Barrow**  
A la pràctica, no resolem integrals definides directament per sumes infinitesimals: fem servir la primitiva mitjançant la **funció de distribució**:
$$
F_X(x) = P(X \le x) = \int_{-\infty}^x f_X(t)\,dt
$$

Pel Teorema Fonamental del Càlcul (TFC), la derivada de la funció de distribució és la funció de densitat:
$$
f_X(x) = \frac{d F_X(x)}{dx} = F_X'(x)
$$
*(El pendent de la corba acumulada $F_X(x)$ en cada punt és la densitat $f_X(x)$).*

Per tant, calcular la probabilitat de qualsevol interval en VAC és tan senzill com aplicar la **Regla de Barrow**, avaluant la funció de distribució als extrems:
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx = F_X(b) - F_X(a)
$$

1. **Avaluar $f_X(x)$ NO és una probabilitat**: $f_X(x)$ representa la densitat (alçada de la corba) i pot ser perfectament superior a 1 (per exemple, una distribució uniforme en $[0, 0{,}2]$ té alçada $f_X(x) = 5$). En VAC la probabilitat sempre és una àrea (integrals $\int$ o diferències de distribució $F_X(b) - F_X(a)$). Avaluar $f_X(k)$ no dóna mai $P(X = k)$.
2. **La probabilitat d'un punt exacte és sempre ZERO ($P(X = k) = 0$)**: La integral en un interval degenerat d'amplada zero no tanca cap àrea:
   $$P(X = k) = \int_k^k f_X(x)\,dx = 0$$
3. **Desigualtats estrictes i no estrictes són completament EQUIVALENTS**: Com que la probabilitat de cada punt aïllat és nul·la, incloure o excloure els extrems no modifica el valor de l'àrea:
   $$P(a \le X \le b) = P(a < X \le b) = P(a \le X < b) = P(a < X < b) = F_X(b) - F_X(a)$$

---

### 8.4 Taula comparativa exhaustiva: VAD vs. VAC

| Concepte | Variable Discreta (VAD) | Variable Contínua (VAC) |
| :--- | :--- | :--- |
| **Valors possibles** | Finit o enumerable (punts aïllats: $\{1, 2, 3, \dots\}$) | Continu / No enumerable (intervals de $\mathbb{R}$) |
| **Eina de càlcul** | Sumatoris ordinaris ($\sum$) | Integrals / Càlcul infinitesimal ($\int$) |
| **Funció descriptiva** | **Funció de probabilitat** $p_X(k) = P(X = k)$ | **Funció de densitat** $f_X(x)$ (alçada de la corba) |
| **Normalització** | $\sum_k p_X(k) = 1$ | $\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$ (Àrea total $= 1$) |
| **Probabilitat puntual** | $P(X = k) = p_X(k) \in [0, 1]$ | $\mathbf{P(X = k) = 0}$ (àrea d'un punt $= 0$) |
| **Desigualtats** | **Extrems compten:** $P(X \le k) \neq P(X < k)$ | **Extrems no canvien:** $P(X \le x) = P(X < x)$ |
| **Funció de distribució** | $F_X(x) = \sum_{k \le x} p_X(k)$ *(esglaons a trossos)* | $F_X(x) = \int_{-\infty}^x f_X(t)\,dt$ *(corba contínua suau)* |
| **Càlcul d'un interval** | $P(a \le X \le b) = \sum_{k=a}^b p_X(k)$ | $P(a \le X \le b) = \int_a^b f_X(x)\,dx = F_X(b) - F_X(a)$ |
| **Pas de distribució a base** | $p_X(k) = F_X(k) - F_X(k^-)$ *(mida del salt)* | $f_X(x) = \frac{d F_X(x)}{dx}$ *(derivada / pendent)* |

---

### 8.5 Quantils (El problema invers)

Donat un nivell de probabilitat $\alpha \in [0, 1]$, el **quantil $\alpha$** de $X$ (notat $x_\alpha$) és el valor llindar que acumula exactament una probabilitat igual a $\alpha$:
$$
F_X(x_\alpha) = P(X \le x_\alpha) = \alpha \iff x_\alpha = F_X^{-1}(\alpha)
$$

> *«$x_\alpha$ és el valor llindar tal que la probabilitat acumulada que la variable no el superi ($X \le x_\alpha$) és exactament $\alpha$, calculat invertint la funció $F_X^{-1}(\alpha)$»*

És el **problema invers** al càlcul de probabilitats acumulades: en lloc de buscar $p = F_X(x)$ a partir d'un valor $x$, fixem la fracció desitjada $\alpha$ i determinem el llindar $x_\alpha$ resolent l'equació $F_X(x) = \alpha$.

**Casos particulars:**
- **Mediana ($M = x_{0{,}50} = P_{50}$):** Divideix la distribució en dues meitats iguals ($50\%$).
- **Quartils:** Divideixen la distribució en quatre parts:
  - Primer quartil: $Q_1 = x_{0{,}25}$
  - Segon quartil (mediana): $Q_2 = M = x_{0{,}50}$
  - Tercer quartil: $Q_3 = x_{0{,}75}$
- **Percentils:** Divideixen la distribució en cent parts ($P_k = x_{k/100}$, per exemple $P_{90} = x_{0{,}90}$).

---

### 8.6 Indicadors en variables aleatòries

Per caracteritzar numèricament una variable aleatòria sense dependre de tota la distribució funcional, definim indicadors de **tendència central** (valors típics) i de **dispersió** (concentració respecte a la mitjana).

**Probabilitat (Model teòric / Població) vs. Estadística (Dades empíriques / Mostra)**

| Concepte | Probabilitat (Població / Model teòric) | Estadística (Mostra empírica) |
| :--- | :--- | :--- |
| **Àmbit** | Espai $\Omega$ complet (cens, dau ideal). | Conjunt de $n$ observacions reals. |
| **Pesos** | Probabilitat teòrica exacta: $p_i = P(X=x_i)$. | Freqüència relativa observada: $f_i = n_i / n$. |
| **Tendència central** | **Esperança:** $\mu_X = E(X)$ (paràmetre teòric fix). | **Mitjana mostral:** $\overline{x} = \frac{1}{n}\sum x_i$ (fluctua a cada mostra). |
| **Dispersió** | **Variància:** $\sigma_X^2 = V(X)$ \quad i \quad Desv. $\sigma_X$. | **Variància mostral:** $s_x^2$ \quad i \quad Desviació mostral $s_x$. |
| **Connexió** | Model teòric (del paràmetre $\mu,\sigma$ a la probabilitat). | **Inferència:** de la mostra ($\overline{x}, s$) s'estimen $\mu$ i $\sigma$. |

**Mesura de tendència central: Esperança matemàtica ($\mu_X = E(X)$)**  
Condensa la distribució en un únic valor típic ponderat:
$$
\mu_X = E(X) = \sum_{\forall k} k \cdot p_X(k) \quad \text{(VAD)} \qquad \int_{-\infty}^{+\infty} x \cdot f_X(x)\,dx \quad \text{(VAC)}
$$

Físicament és el **centre de gravetat o punt d'equilibri** dels pesos de probabilitat (per exemple: en un dau equilibrat de 6 cares, $E(X) = \frac{21}{6} = \mathbf{3{,}5}$).

**Insuficiència del valor central:** Conjunts de dades completament diferents (com les notes $\{5,5,5\}$, $\{4,5,6\}$ o $\{0,5,10\}$) comparteixen la mateixa mitjana ($5$). Un valor central mai no és suficient per si sol; cal acompanyar-lo sempre d'una mesura de **dispersió**.

**Mesura de dispersió: Variància ($V(X)$ o $\sigma_X^2$) i Desviació típica ($\sigma_X$)**  
Quantifiquen el grau de concentració o allunyament dels valors respecte a la mitjana $\mu = E(X)$:
- **Variància ($V(X)$ o $\sigma_X^2$):** Mesura la dispersió al quadrat (unitats$^2$, per exemple $\text{minuts}^2$ o $\text{euros}^2$).
- **Desviació típica ($\sigma_X = \sqrt{V(X)}$):** Arrel quadrada de la variància; **recupera les unitats originals** (per exemple $\text{minuts}$ o $\text{euros}$), mesurant la dispersió en l'escala real.

**Fórmula operativa (Relació de Koenig):**
$$
\mathbf{V(X) = E(X^2) - [E(X)]^2} \qquad \text{i} \qquad \mathbf{\sigma_X = \sqrt{V(X)}}
$$

> *«La variància $V(X)$ és la mitjana dels quadrats $E(X^2)$ menys el quadrat de la mitjana $[E(X)]^2$, i la desviació $\sigma_X$ n'és l'arrel per retornar a les unitats originals»*

**Càlcul pas a pas:**
1. **1r Pas (Esperança):** Calculem $E(X) = \sum k\,p_X(k)$ \quad (o $\int x\,f_X(x)\,dx$).
2. **2n Pas (Moment d'ordre 2):** Calculem $E(X^2) = \sum k^2\,p_X(k)$ \quad (o $\int x^2\,f_X(x)\,dx$).
3. **3r Pas (Variància i desviació):** Fem $V(X) = E(X^2) - [E(X)]^2$ \quad i \quad $\sigma_X = \sqrt{V(X)}$.

:::warning[Compte amb la variància]
La variància **sempre ha de ser $\ge 0$**. Si obtens un valor negatiu, revisa haver restat $[E(X)]^2$ i no $E(X)$!
:::

---

### 8.7 Propietats de l'esperança i la variància

Siguin $X$ i $Y$ variables aleatòries, i $a, b \in \mathbb{R}$ constants:

| Operació | Esperança $E(\cdot)$ | Variància $V(\cdot)$ |
| :--- | :--- | :--- |
| **Desplaçament ($+a$)** | $E(a + X) = a + E(X)$ | $V(a + X) = V(X)$ *(desplaçar les dades no altera la dispersió!)* |
| **Escalat ($\cdot b$)** | $E(bX) = b \cdot E(X)$ | $V(bX) = b^2 \cdot V(X)$ *(el factor surt al quadrat)* |
| **Transformació lineal** | $E(a + bX) = a + b E(X)$ | $V(a + bX) = b^2 \cdot V(X)$ |
| **Suma de dues variables** | $E(X + Y) = E(X) + E(Y)$ | $V(X + Y) = V(X) + V(Y) + 2\,\text{Cov}(X,Y)$ |
| **Resta de dues variables** | $E(X - Y) = E(X) - E(Y)$ | $V(X - Y) = V(X) + V(Y) - 2\,\text{Cov}(X,Y)$ |
| **Si $X, Y$ són INDEPENDENTS** | $E(X \cdot Y) = E(X) \cdot E(Y)$ | $\mathbf{V(X \pm Y) = V(X) + V(Y)}$ (**Atenció: SEMPRE amb signe $+$!**) |

Si restem dues variables independents, la variància és $V(X - Y) = V(X) + V(Y)$. Restar variables aleatòries independents **acumula incertesa**, mai no es resten les variàncies!

---

## 9. Parell de variables aleatòries (Distribució bivariant)

Quan en una mateixa experiència aleatòria observem simultàniament dues variables discretes $X$ i $Y$ (per exemple: dos daus o dues mètriques d'un sistema), analitzem el seu comportament conjunt mitjançant una **taula de doble entrada**:

1. **Funció de probabilitat conjunta ($p_{X,Y}(x,y)$):** Probabilitat de cada cel·la interior ($x$ i $y$):
   $$p(x,y) = P(X=x \cap Y=y)$$
   La suma de totes les cel·les interiors de la taula és exactament:
   $$\sum_x \sum_y p(x,y) = 1$$

2. **Distribucions marginals ($p_X(x), p_Y(y)$):** La distribució de cada variable per separat. Es calculen **sumant per files o per columnes** (als *marges* de la taula):
   $$p_X(x) = \sum_{\forall y} p_{X,Y}(x,y) \quad \text{(sumar columna } x\text{)}, \qquad p_Y(y) = \sum_{\forall x} p_{X,Y}(x,y) \quad \text{(sumar fila } y\text{)}$$

3. **Funció de probabilitat condicionada ($p_{X \mid Y}(x \mid y)$):** Restringir l'estudi a una fila o columna concreta:
   $$P(X=x \mid Y=y) = \frac{p_{X,Y}(x,y)}{p_Y(y)} = \frac{\text{probabilitat de la cel·la }(x,y)}{\text{total marginal de la fila } y}$$

4. **Condició formal d'independència:** $X$ i $Y$ són independents si i només si **totes les cel·les** són el producte dels seus dos marges:
   $$p_{X,Y}(x,y) = p_X(x) \cdot p_Y(y) \quad \forall (x,y)$$
   *(Comprovació: Si hi ha una sola cel·la on $p(x,y) \neq p_X(x) \cdot p_Y(y)$, les variables **NO són independents**).*

### Indicadors bivariants: Covariància ($\text{Cov}(X,Y)$ o $\sigma_{X,Y}$)
Mesura la tendència d'associació lineal conjunta entre dues variables $X$ i $Y$:

- **Definició teòrica:** Mitjana del producte de les desviacions respecte a les seves mitjanes:
  $$\text{Cov}(X,Y) = \sum_{\forall x}\sum_{\forall y} (x - E(X))(y - E(Y)) \cdot p_{X,Y}(x,y)$$
  > *«Suma de com es desvien alhora $x$ i $y$ respecte a les seves mitjanes $E(X)$ i $E(Y)$, ponderada per la probabilitat $p_{X,Y}(x,y)$ que es donin conjuntament»*

- **Fórmula pràctica de càlcul:** S'evita restar mitjanes terme a terme calculant:
  $$\mathbf{\text{Cov}(X,Y) = E(X \cdot Y) - E(X) \cdot E(Y)}$$
  > *«La covariància $\text{Cov}(X,Y)$ és la mitjana del producte creuat $E(X \cdot Y)$ menys el producte de les mitjanes individuals $E(X) \cdot E(Y)$»*

- **Interpretació per quadrants:** Desplaçant l'origen al centre de masses $(E(X), E(Y))$, el producte $(x-\mu_X)(y-\mu_Y)$ és positiu als quadrants I i III (relació **directa**) i negatiu als quadrants II i IV (relació **inversa**).
- **El problema d'escala:** La covariància depèn de les unitats de mesura (per exemple: en metres dóna un valor i en mil·límetres queda multiplicada per $1.000$). No permet comparar intensitats d'associació.

### Coeficient de correlació de Pearson ($\rho_{X,Y}$ o $\rho$)
Per eliminar la dependència de les unitats, **estandarditzem** la covariància dividint pel producte de les desviacions típiques:
$$
\rho_{X,Y} = \frac{\text{Cov}(X,Y)}{\sigma_X \cdot \sigma_Y} \qquad \text{amb} \quad \mathbf{-1 \le \rho_{X,Y} \le 1}
$$

- **Relació lineal perfecta ($|\rho| = 1$):** Punts sobre una recta $Y = a + bX$ (pendent positiu si $\rho = +1$, negatiu si $\rho = -1$).
- **Incorrelació ($\rho = 0$):** Sense tendència lineal. Si són independents $\implies \text{Cov} = 0 \implies \mathbf{\rho = 0}$ (la inversa no sempre: relacions corbes simètriques com $Y=X^2$ poden tenir $\rho = 0$ tot i dependre l'una de l'altra).

**Propietats algebraiques:**

| Propietat | Descripció |
| :--- | :--- |
| $\text{Cov}(X, X) = V(X), \quad \rho_{X,X} = 1$ | Variància com a autocovariància |
| $\text{Cov}(X, Y) = \text{Cov}(Y, X)$ | Simetria |
| $\text{Cov}(aX + c, bY + d) = a \cdot b \cdot \text{Cov}(X,Y)$ | Invariància per desplaçament i escalat |
| $E(X \cdot Y) = E(X) \cdot E(Y) + \text{Cov}(X,Y)$ | Desglossament de l'esperança del producte |
| $V(X \pm Y) = V(X) + V(Y) \pm 2\,\text{Cov}(X,Y)$ | Variància de la suma/resta (*si independents:* $V(X \pm Y) = V(X) + V(Y)$) |