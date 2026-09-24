---
title: "Tema 1: Anàlisi d'Algorismes"
description: "Eficiència algorísmica, notació asimptòtica (O, Ω, Θ), anàlisi iteratiu i recursiu, i Teoremes Mestres."
readTime: "20 min"
order: 1
draft: false
---

# 1. Fonaments d'eficiència i notació asimptòtica

Per saber quant triga un algorisme ($T(n)$), necessitem mesurar **com de gran és l'entrada** ($x$). La mida $n = |x|$ depèn del tipus de dada:
- **Vectors o llistes:** La quantitat d'elements ($n = \texttt{v.size()}$).
- **Grafs:** Es mesura amb dues variables alhora: vèrtexs ($|V|$) i arestes ($|E|$), amb mida combinada $|V| + |E|$.

Per a una mateixa mida $n$, el temps depèn de com vinguin les dades (p. ex. en cercar un element dins d'un vector de mida $n$):
- **Cas millor ($T_{\text{millor}}$):** El temps mínim possible. P. ex., trobar l'element a la primera posició.
- **Cas mitjà ($T_{\text{mitjà}}$):** La mitjana de temps de totes les entrades possibles. P. ex., trobar l'element cap al mig del vector.
- **Cas pitjor ($T_{\text{pitjor}}$):** El temps màxim possible. P. ex., trobar l'element a l'última posició o que no hi sigui. **És el que es calcula sempre a EDA** perquè garanteix el límit que el programa mai superarà.

---

## 1.1. Definicions formals de notació asimptòtica

Imaginem que tenim un programa i comptem exactament quantes operacions fa: $f(n) = 3n^2 + 5n + 18$. Aquesta és la nostra funció real, $f(n)$. 
Però si algú pregunta «com de ràpid és el programa?», no recitaràs tot el xoriço $3n^2 + 5n + 18$. Diràs «és quadràtic ($n^2$)», volem dir que el codi **creix com un quadràtic** ($n^2$), comparant-lo amb una funció patró senzilla $g(n)$.

### Fita superior: $\mathcal{O}$ gran (òmicron) — El sostre
Ens diu que el nostre algorisme **com a màxim creix tan ràpidament com $g(n)$**. Multiplicant $g(n)$ per una constant $c$, la corba $c \cdot g(n)$ queda **per sobre** de $f(n)$ a partir del punt $n_0$. Funciona com un **sostre**: el programa mai trigarà més que això a la llarga.

$$
\mathcal{O}(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tals que} \quad \forall n \ge n_0,\; f(n) \le c \cdot g(n) \}
$$

*Intuïció:* $f \le g$ a la llarga ($c \cdot g(n)$ fa de límit superior màxim).

### Fita inferior: $\Omega$ gran (omega) — El terra
Ens diu que el nostre algorisme **com a mínim creix tan ràpidament com $g(n)$**. Multiplicant $g(n)$ per una constant $c$, la corba $c \cdot g(n)$ queda **per sota** de $f(n)$ a partir del punt $n_0$. Funciona com un **terra**: el programa mai podrà ser màgicament més ràpid que aquest ritme.

$$
\Omega(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tals que} \quad \forall n \ge n_0,\; f(n) \ge c \cdot g(n) \}
$$

*Intuïció:* $f \ge g$ a la llarga ($c \cdot g(n)$ fa de límit inferior mínim).

### Fita exacta: $\Theta$ gran (theta) — La faixa
Indica que el nostre algorisme creix **exactament al mateix ritme** que $g(n)$. Podem trobar dues constants ($c_1$ i $c_2$) de manera que $f(n)$ queda atrapada en una **faixa** entre un terra ($c_1 \cdot g(n)$) i un sostre ($c_2 \cdot g(n)$) a partir de $n_0$:

$$
\Theta(g) = \mathcal{O}(g) \cap \Omega(g) = \{ f: \mathbb{N} \to \mathbb{R}^+ \mid \exists c_1, c_2 \in \mathbb{R}^+,\; \exists n_0 \in \mathbb{N} \quad \text{tals que} \quad \forall n \ge n_0,\; c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \}
$$

*Intuïció:* $f \approx g$ a la llarga ($f(n)$ creix al mateix ritme que $g(n)$ llevat de factors constants).

| Notació | Concepte geomètric | Desigualtat a la llarga ($\forall n \ge n_0$) | Paper que juga |
| :--- | :--- | :--- | :--- |
| $\mathcal{O}(g)$ | **Sostre** | $f(n) \le c \cdot g(n)$ | Cota superior màxima |
| $\Omega(g)$ | **Terra** | $f(n) \ge c \cdot g(n)$ | Cota inferior mínima |
| $\Theta(g)$ | **Faixa exacta** | $c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n)$ | Comportament asimptòtic exacte |

> **Exemple de demostració formal per definició:**  
> Demostrar que $f(n) = 3n^3 + 5n^2 - 7n + 41 \in \mathcal{O}(n^3)$.  
> **Objectiu:** Trobar constants $c > 0$ i $n_0 \in \mathbb{N}$ tals que $\forall n \ge n_0,\; 3n^3 + 5n^2 - 7n + 41 \le c \cdot n^3$.
> 
> 1. **Fitar termes negatius:** Com que $-7n \le 0$ per a tot $n \ge 0$, tenim:
>    $$3n^3 + 5n^2 - 7n + 41 \le 3n^3 + 5n^2 + 41$$
> 2. **Fitar termes de grau menor:** Com que per a tot $n \ge 1$ és cert que $n^2 \le n^3$:
>    $$3n^3 + 5n^2 + 41 \le 3n^3 + 5n^3 + 41 = 8n^3 + 41$$
> 3. **Triar la constant $c$:** Volem que $8n^3 + 41 \le c \cdot n^3$. Triem $c = 9$:
>    $$8n^3 + 41 \le 9n^3 \iff 41 \le n^3$$
> 4. **Determinar el llindar $n_0$:**
>    - Per a $n = 1 \implies 1 < 41$
>    - Per a $n = 2 \implies 8 < 41$
>    - Per a $n = 3 \implies 27 < 41$
>    - Per a $n = 4 \implies 64 \ge 41$
> 
> Prenent **$c = 9$** i **$n_0 = 4$**, es compleix $\forall n \ge 4,\; f(n) \le 9n^3$. Queda demostrat que $f(n) \in \mathcal{O}(n^3)$.

### Criteri del límit del quocient
Demostrar fites amb constants $c$ i el llindar $n_0$ a cada exercici és molt lent i feixuc. A la pràctica, per saber quina funció creix més ràpid, simplement les dividim i calculem el **límit del seu quocient** quan $n \to \infty$:

$$
L = \lim_{n \to \infty} \frac{f(n)}{g(n)}
$$

Pensa en la fracció $\frac{f(n)}{g(n)}$ com una cursa entre el numerador $f$ i el denominador $g$:
- **Si $L = 0$ ($f$ creix molt més a poc a poc que $g$):** El denominador $g(n)$ creix tan ràpidament que es menja el numerador ($\frac{\text{petit}}{\text{gegant}} \to 0$). A la llarga, $f$ queda infinitament per sota de $g$.
  $$ f \in \mathcal{O}(g) \quad\text{però}\quad f \notin \Omega(g) \qquad (\text{notació informal: } f \prec g, \text{ «$f$ està dominada per $g$»}) $$
  *Exemple:* $\lim_{n \to \infty} \frac{n}{n^2} = \lim_{n \to \infty} \frac{1}{n} = 0 \implies n \in \mathcal{O}(n^2)$ (un lineal és molt més lent que un quadràtic).
- **Si $L = \infty$ ($f$ creix molt més ràpid que $g$):** El numerador $f(n)$ guanya per golejada i la fracció es dispara ($\frac{\text{gegant}}{\text{petit}} \to \infty$). A la llarga, $f$ queda infinitament per sobre de $g$.
  $$ f \in \Omega(g) \quad\text{però}\quad f \notin \mathcal{O}(g) \qquad (\text{notació informal: } f \succ g, \text{ «$f$ domina a $g$»}) $$
  *Exemple:* $\lim_{n \to \infty} \frac{n^2}{n} = \lim_{n \to \infty} n = \infty \implies n^2 \in \Omega(n)$.
- **Si $L = c$ amb $0 < c < \infty$ (empat: creixen exactament al mateix ritme):** Cap de les dues funcions s'escapa de l'altra; arriben a un equilibri constant $c$. Creixen a la mateixa velocitat llevat d'un factor d'escala:
  $$ f \in \Theta(g) \iff g \in \Theta(f) $$
  *Exemple:* $\lim_{n \to \infty} \frac{5n^2 + 3}{2n^2} = \frac{5}{2} \implies 5n^2 + 3 \in \Theta(n^2)$ (tots dos són algorismes quadràtics).
- **Si el límit oscil·la o no existeix:** No podem fer servir aquesta drecera (p. ex. amb funcions oscil·lants com $(-1)^n$). Només en aquest cas cal anar a la definició formal amb $\exists c, \exists n_0$.

### Propietats fonamentals de les classes asimptòtiques
Són regles per estalviar-nos feina: permeten simplificar l'ordre de cost d'un algorisme a cop d'ull sense haver de calcular límits:
- **Reflexivitat (tot codi és del seu propi ordre):** Qualsevol funció creix al seu mateix ritme: $f \in \Theta(f)$, $f \in \mathcal{O}(f)$, $f \in \Omega(f)$.
- **Transitivitat (les cadenes de fita es mantenen):** Si $A \le B$ i $B \le C$, llavors $A \le C$:
  $$ f \in \mathcal{O}(g) \land g \in \mathcal{O}(h) \implies f \in \mathcal{O}(h) \qquad (\text{igualment vàlid per a } \Omega \text{ i } \Theta) $$
  *Exemple:* Com que $n \in \mathcal{O}(n^2)$ i $n^2 \in \mathcal{O}(n^3)$, és evident que $n \in \mathcal{O}(n^3)$.
- **Simetria en $\Theta$ (l'ordre exacte funciona com un «igual»):** Si el meu codi creix com $g$, llavors $g$ creix com el meu codi: $f \in \Theta(g) \iff g \in \Theta(f)$.  
  > **Alerta d'examen:** Això NO val per a $\mathcal{O}$ ni $\Omega$. Si $n \in \mathcal{O}(n^2)$, el terme quadràtic $n^2$ NO està dins de $\mathcal{O}(n)$!
- **Dualitat (girar el punt de vista entre sostre i terra):** Dir que «$f$ com a màxim és $g$» equival a dir que «$g$ com a mínim és $f$»: $f \in \mathcal{O}(g) \iff g \in \Omega(f)$.
- **Invariància per constants (les constants no canvien la categoria):** Multiplicar per un nombre fix $k > 0$ no canvia l'ordre de magnitud: $\Theta(k \cdot f) = \Theta(f)$ i $\mathcal{O}(k \cdot f) = \mathcal{O}(f)$.  
  *Exemple:* Un algorisme que fa $1.000 \cdot n^2$ operacions continua sent quadràtic $\Theta(n^2)$.
- **Regla de la suma (el terme dominant s'ho menja tot):** Si un programa fa fases consecutives, el cost total és la suma. Asimptòticament només mana la part més costosa; la resta es descarta completament:
  $$ \Theta(f) + \Theta(g) = \Theta(f + g) = \Theta(\max(f, g)) $$
  *Exemple:* Si un codi primer fa una ordenació de cost $n^2$ i després un recorregut de cost $n$, el cost total és $n^2 + n \in \Theta(n^2)$ (el terme lineal $n$ és menyspreable a la llarga).
- **Regla del producte (bucles anidats):** Si un bucle fa $f(n)$ voltes i a dins de cadascuna executa un bloc de cost $g(n)$, els ordres es multipliquen:
  $$ \mathcal{O}(f) \cdot \mathcal{O}(g) = \mathcal{O}(f \cdot g) \quad\text{i}\quad \Theta(f) \cdot \Theta(g) = \Theta(f \cdot g) $$
  *Exemple:* Un bucle de $n$ iteracions que dins fa una cerca dicotòmica de cost $\log n$ costa en total $\Theta(n \log n)$.

---

## 1.2. Jerarquia de creixement

### Jerarquia universal de classes asimptòtiques
A partir de la regla del límit, establim **tres resultats teòrics fonamentals** per classificar qualsevol funció:
- **Polinomis (només mana el terme de major grau):** Per a qualsevol polinomi $p(n) = a_k n^k + a_{k-1}n^{k-1} + \dots + a_0$ amb $a_k > 0$, es compleix:
  $$ p(n) \in \Theta(n^k) $$
  *Regla pràctica:* Es descarta completament el coeficient $a_k$ i tots els termes de grau inferior (p. ex. $7n^3 - 50n^2 + 18 \in \Theta(n^3)$).
- **Logaritmes (la base no importa a la classe asimptòtica):** Donades dues bases qualsevol $a, b > 1$, la fórmula del canvi de base ens diu:
  $$ \log_a n = \frac{\log_b n}{\log_b a} = \left(\frac{1}{\log_b a}\right) \cdot \log_b n $$
  Com que $\frac{1}{\log_b a}$ és un nombre fix (constant), per la propietat d'invariància tenim $\Theta(\log_a n) = \Theta(\log_b n)$. A EDA escriurem sempre simplement $\Theta(\log n)$ sense indicar la base.  
  > **Alerta d'examen:** La base **SÍ que importa** si està a l'exponent: $2^{\log_2 n} = n \neq 2^{\log_3 n} = n^{\log_3 2} \approx n^{0.631}$.
- **Jerarquia relativa (Logaritmes $\ll$ Polinomis $\ll$ Exponencials):** Per a constants $a, b > 0$ i $c > 1$:
  - *Logaritmes vs. Polinomis (tortugues):* Qualsevol potència de logaritme creix més a poc a poc que qualsevol potència de $n$:
    $$ \lim_{n \to \infty} \frac{\log^a n}{n^b} = 0 \implies \log^a n \prec n^b \qquad (\text{fins i tot } \log^{100} n \prec \sqrt{n} \text{ o } n^{0.01}) $$
  - *Polinomis vs. Exponencials (monstres):* Qualsevol polinomi creix infinitament més a poc a poc que una exponencial:
    $$ \lim_{n \to \infty} \frac{n^b}{c^n} = 0 \implies n^b \prec c^n \qquad (\text{fins i tot } n^{1000} \prec 1.001^n \text{ o } 2^n) $$

### Cadena de creixement asimptòtic universal
$$
\Theta(1) \prec \Theta(\log \log n) \prec \Theta(\log n) \prec \Theta(\sqrt{n}) \prec \Theta(n) \prec \Theta(n \log n) \prec \Theta(n^2) \prec \Theta(n^k) \prec \Theta(2^n) \prec \Theta(n!) \prec \Theta(n^n)
$$

### Frontera de la intractabilitat i impacte de la tecnologia
Quan un algorisme té cost exponencial ($2^n$ o $3^n$), el temps es dispara de manera brutal fins i tot per a mides ridículament petites. Assumint un processador estàndard que executa $10^6$ operacions bàsiques per segon ($1\,\mu\text{s}$ per operació):

| Complexitat | $n = 10$ | $n = 20$ | $n = 30$ | $n = 50$ | Efecte de comprar una màquina $\times 1000$ més ràpida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $n$ (lineal) | $0.00001\text{ s}$ | $0.00002\text{ s}$ | $0.00003\text{ s}$ | $0.00005\text{ s}$ | Mida $1000 \cdot N$ (guany proporcional complet) |
| $n^2$ (quadràtic) | $0.0001\text{ s}$ | $0.0004\text{ s}$ | $0.0009\text{ s}$ | $0.0025\text{ s}$ | Mida $\sqrt{1000} \cdot N \approx 31.6 \cdot N$ (guany amortit per arrel) |
| $n^3$ (cúbic) | $0.001\text{ s}$ | $0.008\text{ s}$ | $0.027\text{ s}$ | $0.125\text{ s}$ | Mida $\sqrt[3]{1000} \cdot N = 10 \cdot N$ |
| $2^n$ (exponencial) | $0.001\text{ s}$ | $1.05\text{ s}$ | $17.9\text{ min}$ | **$35.7\text{ anys}$** | Només $N + \log_2(1000) \approx \mathbf{N + 10}$ elements més! |
| $3^n$ (exponencial) | $0.059\text{ s}$ | $58\text{ min}$ | $6.5\text{ anys}$ | **$2 \times 10^8\text{ segles}$** | Només $N + \log_3(1000) \approx \mathbf{N + 6.3}$ elements més! |

Si comprem una màquina $m = 1000$ cops més ràpida, només se suma una petita constant. L'única solució possible és el **redisseny algorísmic**.

---

## 1.3. Algorismes no recursius

- **Càlcul i I/O bàsic ($\mathbf{\Theta(1)}$):** Assignacions primitives (`int`, `double`, `bool`, punters...), operadors aritmètics, lògics, relacionals (`+`, `==`, `&&`, `++`) i lectura/escriptura simple (`cin`, `cout`).
- **Accés directe a vector ($\mathbf{\Theta(1)}$):** `v[i]` té cost $\mathbf{\Theta(1)}$ gràcies a l'aritmètica de punters ($\text{adreça} = \text{inici} + i \cdot \text{mida}$).

### Expressions, crides a funcions i pas de paràmetres
El cost d'una instrucció o expressió (ex. `x = f(a, b);`) és la **suma de totes les seves etapes**: arguments + paràmetres + cos + retorn + assignació a `x`. La regla clau de cost segons el tipus és:
- **Tipus primitius i referències (`&`, `const &`):** Cost $\mathbf{\Theta(1)}$ (es passa el valor directe a la pila o un punter de 8 bytes; mai es copien dades, encara que contingui $10^8$ elements).
- **Contenidors de mida $n$ per valor (`vector`):** Cost $\mathbf{\Theta(n)}$ tant en assignar, passar com fer `return` (cal reservar memòria a la *heap* i duplicar els seus $n$ elements).

### Composició seqüencial
Quan s'executen instruccions una darrere l'altra ($F_1; \dots; F_N$), el cost és la suma: $\sum C_i$. Si el nombre d'instruccions és fix (independent de $n$), **el bloc més lent mana** ($\Theta(\max)$), absorbint els ràpids:

```cpp
int x = 0;                          // Θ(1) (elemental)
sort(v.begin(), v.end());           // Θ(n log n) ← el bloc més lent mana
cout << x << endl;                  // Θ(1) (elemental)

// Cost total: Θ(1) + Θ(n log n) + Θ(1) = Θ(n log n)
```

### Composició alternativa (condicionals `if / else`)
En una estructura `if (B) { F1 } else { F2 }`, primer s'avalua la condició $B$ (cost $D$, usualment $\Theta(1)$) i després només s'executa una de les dues branques ($F_1$ amb cost $C_1$, o $F_2$ amb cost $C_2$):
- **Pitjor cas (branca més costosa):** $\text{Cost}_{\text{pitjor}} = D + \max(C_1, C_2)$. Ex.: si $C_1 = \Theta(1)$ i $C_2 = \Theta(n)$, el pitjor cas és $\mathbf{\Theta(n)}$.
- **Millor cas (branca més ràpida):** $\text{Cost}_{\text{millor}} = D + \min(C_1, C_2)$. Si només hi ha un `if (B) { F1 }` sense `else`, el millor cas és només avaluar la condició $B$ ($\text{cost } D = \Theta(1)$ quan $B$ és fals).

### Composició iterativa: Bucles `while` i `for`
Si un bucle realitza $N$ iteracions:
- **Freqüència d'execució:** La condició s'avalua sempre **$N + 1$ vegades** i el cos s'executa **$N$ vegades**. En un `for`, la inicialització es fa $1$ cop i el pas d'increment $N$ cops.
- **Nombre de voltes en un `for`:** De $i = a$ fins a $b$, fa $N = \max(0, b - a + 1)$ iteracions (ex. de $0$ a $n-1$ o d'$1$ a $n$ són exactament $n$ voltes).
- **Cost total:** Suma de totes les iteracions: $\text{Cost} = \sum_{k=1}^N \text{Cost}(\text{cos}_k) + (N+1)\Theta(1)$. Quan el cos té cost elemental $\Theta(1)$, el cost total és $\mathbf{\Theta(N)}$.

---

### Ordenació per selecció (Selection Sort)
A cada iteració $i$ (de $n-1$ baixant fins a $1$), cerca el màxim de la part restant $v[0 \dots i]$ i l'intercanvia amb $v[i]$, deixant-lo fixat al final:

:::oopviz{simulation="selection_sort"}
:::

#### Exemple pas a pas ($v = [3, \; 8, \; 5, \; 1, \; 4]$ amb $n=5$):

| Iteració ($i$) | Estat del vector $v$ | Cerca de màxim a $v[0 \dots i]$ | Acció (`swap`) |
| :---: | :---: | :--- | :--- |
| **Inicial** | $[3, \; 8, \; 5, \; 1, \; 4]$ | — | — |
| **$i = 4$** | $[3, \; \mathbf{4}, \; 5, \; 1 \mid \mathbf{8}]$ | Màxim $8$ a $k=1$ ($4$ comparacions) | `swap(v[1], v[4])` |
| **$i = 3$** | $[3, \; 4, \; \mathbf{1} \mid \mathbf{5}, \; 8]$ | Màxim $5$ a $k=2$ ($3$ comparacions) | `swap(v[2], v[3])` |
| **$i = 2$** | $[3, \; \mathbf{1} \mid \mathbf{4}, \; 5, \; 8]$ | Màxim $4$ a $k=1$ ($2$ comparacions) | `swap(v[1], v[2])` |
| **$i = 1$** | $[\mathbf{1} \mid \mathbf{3}, \; 4, \; 5, \; 8]$ | Màxim $3$ a $k=0$ ($1$ comparació) | `swap(v[0], v[1])` |

#### Anàlisi pas a pas del cost de selecció (tot en funció de $n$):
- **Cerca del màxim (`posicio_maxim`):** Trobar el màxim d'una llista de mida $n$ requereix comparar tots els seus elements: el seu cost és $\mathbf{\Theta(n)}$.
- **Nombre de comparacions a cada volta:** Com que a cada pas col·loquem el màxim al seu lloc definitiu, la part restant es redueix en $1$ element a cada iteració: amb $n$ elements pendents es fan $n - 1$ comparacions; amb $n - 1$ elements es fan $n - 2$ comparacions; i així successivament fins a l'última volta amb només $2$ elements, on es fa $1$ comparació (com a la taula amb $n=5$: $4, 3, 2, 1$).
- **Suma total de comparacions (fórmula de Gauss):**
  $$ (n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2} \implies \mathbf{\Theta(n^2)} $$
  (a l'exemple amb $n=5$: $4 + 3 + 2 + 1 = 10 = \frac{5 \cdot 4}{2}$).
- **Cost total:** Sumant comparacions ($\Theta(n^2)$) i els $n-1$ intercanvis (`swap`, de cost $\Theta(n)$):
  $$ T_{\text{sel}}(n) = \Theta(n^2) + \Theta(n) = \mathbf{\Theta(n^2)} $$
- **No adaptatiu (cost rígid):** No té sortida anticipada: tant si el vector ve ordenat com invertit, fa **sempre** exactament $\frac{n(n-1)}{2}$ comparacions ($\text{Millor} = \text{Pitjor} = \text{Mitjà} = \mathbf{\Theta(n^2)}$).

---

### Ordenació per inserció (Insertion Sort)

:::oopviz{simulation="insertion_sort"}
:::

#### Exemple pas a pas ($v = [3, \; 8, \; 5, \; 1, \; 4]$ amb $n=5$):
La barra $\mid$ separa la part ja ordenada $v[0 \dots k-1]$ (esquerra) de la part pendent d'explorar (dreta):

| Iteració ($k$) | Estat del vector $v$ | Inserció de $v[k]$ al subvector ordenat | Acció (`while` / `swap`) |
| :---: | :---: | :--- | :--- |
| **Inicial** | $[3 \mid 8, \; 5, \; 1, \; 4]$ | Prefix $v[0 \dots 0]$ ordenat per definició | Cap acció |
| **$k = 1$** | $[3, \; \mathbf{8} \mid 5, \; 1, \; 4]$ | Inserim $v[1]=8$: comparem $8 \ge 3$, atura immediat | $1$ comp., $0$ `swaps` |
| **$k = 2$** | $[3, \; \mathbf{5}, \; 8 \mid 1, \; 4]$ | Inserim $v[2]=5$: $5 < 8$ (mou), després $5 \ge 3$ (atura) | $2$ comp., $1$ `swap(v[1], v[2])` |
| **$k = 3$** | $[\mathbf{1}, \; 3, \; 5, \; 8 \mid 4]$ | Inserim $v[3]=1$: menor que $8, 5, 3$ (arriba a posició $0$) | $3$ comp., $3$ `swaps` |
| **$k = 4$** | $[1, \; 3, \; \mathbf{4}, \; 5, \; 8]$ | Inserim $v[4]=4$: menor que $8, 5$, major que $3$ (atura) | $3$ comp., $2$ `swaps` |

#### Anàlisi pas a pas del cost d'inserció $T(n)$:
- **Comportament adaptatiu:** A diferència de Selecció (on el cost és rígid i no mira el contingut), a Inserció el bucle `while` s'executa entre $0$ i $k$ cops segons si el valor ja està al seu lloc. El cost depèn de com d'ordenat estigui el vector.
- **Cas millor (vector ja ordenat, ex. $[1, \; 3, \; 4, \; 5, \; 8]$):** A cada passada $k$, l'element nou ja és més gran que el seu predecessor ($v[k] \ge v[k-1]$). El `while` avalua la condició un sol cop, dóna fals i fa $0$ intercanvis. Fa exactament **$1$ comparació** per passada:
  $$ T_{\text{millor}}(n) = \sum_{k=1}^{n-1} 1 = n - 1 \implies \mathbf{\Theta(n)} $$
- **Cas pitjor (vector en ordre invers, ex. $[8, \; 5, \; 4, \; 3, \; 1]$):** Cada nou element $v[k]$ és menor que tots els anteriors i ha de retrocedir fins a la posició $0$. A la passada $k$ fa exactament $k$ comparacions i $k$ `swaps`:
  $$ T_{\text{pitjor}}(n) = \sum_{k=1}^{n-1} k = 1 + 2 + \dots + (n - 1) = \frac{n(n - 1)}{2} \implies \mathbf{\Theta(n^2)} $$
- **Cas mitjà (permutació aleatòria):** De mitjana, un element retrocedeix fins a la meitat del subvector ordenat ($k/2$ passos):
  $$ \sum_{k=1}^{n-1} \frac{k}{2} = \frac{1}{2}\frac{n(n-1)}{2} \approx \frac{n^2}{4} \implies \mathbf{\Theta(n^2)} $$
- **Vectors quasi-ordenats (elements a distància fitada):** Si cap element està a més d'una distància fixa $c$ de la seva posició final (on $c \ge 0$ és una constant independent de $n$, $c \in \mathcal{O}(1)$), cada element fa com a màxim $c$ passos:
  $$ T(n) \le \sum_{k=1}^{n-1} c = c(n-1) = \mathcal{O}(n) \implies \mathbf{\Theta(n)} $$
- **Relació formal amb les inversions ($I$):** Una inversió és qualsevol parella $(a, b)$ amb $a < b$ però $v[a] > v[b]$. Cada `swap` redueix exactament $1$ inversió. El cost total és:
  $$ \mathbf{T(n) = \Theta(n + I)} $$
  on $I$ és el nombre d'inversions inicials ($0 \le I \le \frac{n(n-1)}{2}$). Si $I = \mathcal{O}(n)$, el cost és $\Theta(n)$.

---

## 1.4. Algorismes recursius i teoremes mestres

El cost d'una funció recursiva s'expressa segons el nombre de crides i la mida dels subproblemes:

$$ C(n) = a \cdot C(\text{mida subproblema}) + g(n) $$

on $a \ge 1$ és el nombre de crides recursives i $g(n)$ és el cost de la feina no recursiva (preparar les crides i combinar-ne els resultats).

### Teorema mestre de recurrències subtractives
Aplica a funcions on cada crida recursiva redueix la mida de l'entrada en una quantitat fixa $c \ge 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n - c) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad\text{amb } g(n) \in \Theta(n^k), \; k \ge 0
$$

$$
C(n) \in \begin{cases} 
\Theta(n^k), & \text{si } a < 1 \quad\text{(les crides disminueixen)} \\ 
\Theta(n^{k+1}), & \text{si } a = 1 \quad\text{(una sola crida: augmenta un grau de polinomi)} \\ 
\Theta(a^{n/c}), & \text{si } a > 1 \quad\text{(es ramifica: creixement exponencial)} 
\end{cases}
$$

*Exemples:*
- $C(n) = C(n-1) + \Theta(1) \implies a=1, k=0 \implies \Theta(n^{0+1}) = \Theta(n)$ (cerca lineal recursiva).
- $C(n) = C(n-1) + \Theta(n) \implies a=1, k=1 \implies \Theta(n^{1+1}) = \Theta(n^2)$ (ordenació recursiva lenta).
- $C(n) = 2C(n-1) + \Theta(1) \implies a=2 > 1 \implies \Theta(2^n)$ (Torres de Hanoi).

---

### Teorema mestre de recurrències divisores
Aplica a algorismes de divide and conquer, on dividim la mida de l'entrada entre $b > 1$:

$$
C(n) = \begin{cases} \Theta(1), & \text{si } n < n_0 \\ a \cdot C(n/b) + g(n), & \text{si } n \ge n_0 \end{cases} \qquad\text{amb } g(n) \in \Theta(n^k), \; k \ge 0
$$

Definim l'exponent crític de les fulles: $\mathbf{\alpha = \log_b(a)}$.  
*Intuïció:* L'arbre té alçada $\log_b n$ i el nombre total de fulles és $a^{\log_b n} = n^{\log_b a} = \mathbf{n^\alpha}$. El teorema és una cursa entre el cost de les fulles ($n^\alpha$) i el cost de la feina a l'arrel ($g(n) = n^k$):

$$
C(n) \in \begin{cases} 
\Theta(n^k), & \text{si } \alpha < k \iff a < b^k \quad \text{(domina el terme no recursiu $g(n)$)} \\ 
\Theta(n^k \log n), & \text{si } \alpha = k \iff a = b^k \quad \text{(treball equilibrat a cada nivell)} \\ 
\Theta(n^\alpha) = \Theta(n^{\log_b a}), & \text{si } \alpha > k \iff a > b^k \quad \text{(dominen les fulles de l'arbre)} 
\end{cases}
$$

*Exemples:*
- **Cerca binària:** $C(n) = C(n/2) + \Theta(1) \implies a=1, b=2, k=0 \implies \alpha = \log_2 1 = 0 = k \implies \mathbf{\Theta(\log n)}$.
- **Mergesort:** $C(n) = 2C(n/2) + \Theta(n) \implies a=2, b=2, k=1 \implies \alpha = \log_2 2 = 1 = k \implies \mathbf{\Theta(n \log n)}$.
- **Karatsuba:** $C(n) = 3C(n/2) + \Theta(n) \implies a=3, b=2, k=1 \implies \alpha = \log_2 3 \approx 1.585 > 1 \implies \mathbf{\Theta(n^{1.585})}$.
- **Strassen:** $C(n) = 7C(n/2) + \Theta(n^2) \implies a=7, b=2, k=2 \implies \alpha = \log_2 7 \approx 2.807 > 2 \implies \mathbf{\Theta(n^{2.807})}$.