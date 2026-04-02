import type { Solution } from '../../solutions';

export const m2t2Solutions: Solution[] = [
    {
        id: "M2-T2-Ex1",
        title: "Problema 1: Càlcul de límits bàsics",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu el límit de les successions de terme general:
a) $a^n, \\alpha \\in \\mathbb{R}$
b) $n^\\alpha, \\alpha \\in \\mathbb{R}$
c) $\\sqrt[n]{n}$`,
        content: `**a) $a^n$:**
Això és una progressió geomètrica. El seu comportament a l'infinit depèn de la base $\\alpha$:
*   Si $\\alpha > 1$: El terme es fa infinitament gran ($2^{10} = 1024$). Límit = $+\\infty$.
*   Si $\\alpha = 1$: Tenim $1^n$, que sempre és 1. Límit = $1$.
*   Si $-1 < \\alpha < 1$: Estem multiplicant fraccions petites ($0.5^{10} = 0.0009$). Límit = $0$.
*   Si $\\alpha \\leq -1$: La successió va alternant signes (oscil·la) i creixent en valor absolut o mantenint-se en $1$/$-1$. El límit no existeix.

**b) $n^\\alpha$:**
Aquí la base creix i l'exponent és fix.
*   Si $\\alpha > 0$: Tenim l'infinit elevat a un nombre positiu. Límit = $+\\infty$.
*   Si $\\alpha = 0$: Qualsevol nombre elevat a $0$ és $1$. Límit = $1$.
*   Si $\\alpha < 0$: L'exponent negatiu inverteix la base (seria equivalent a $1/n^{|\\alpha|}$). Un nombre dividit per infinit tendeix a zero. Límit = $0$.

**c)** $\\sqrt[n]{n}$
Aquest és un límit clàssic que dóna una indeterminació $\\infty^0$. S'ha de conèixer directament per teoria o resoldre via L'Hôpital després de prendre logaritmes que el seu límit val $1$.`
    },
    {
        id: "M2-T2-Ex2",
        title: "Problema 2: Indeterminacions als límits",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu el límit de les successions de terme general:
a) $\\frac{6n^3 + 4n + 1}{2n}$
b) $\\frac{n^2 - 6n - 2}{3n^2 - 9n}$
c) $\\left(\\sqrt{\\frac{n+1}{2n+1}}\\right)^{\\frac{2n-1}{3n-1}}$`,
        content: `**a)** $\\frac{6n^3 + 4n + 1}{2n}$
Tenim una indeterminació de l'estil $\\frac{\\infty}{\\infty}$.
Ens fixem en els graus: el numerador té grau 3 i el denominador grau 1. Com que el grau de dalt és superior, la successió s'escapa cap a l'infinit. Límit = $+\\infty$.

**b)** $\\frac{n^2 - 6n - 2}{3n^2 - 9n}$
Grau del numerador = 2; Grau del denominador = 2. Són iguals. El límit és directament el quocient dels coeficients principals: $\\frac{1}{3}$.

**c)** $\\left(\\sqrt{\\frac{n+1}{2n+1}}\\right)^{\\frac{2n-1}{3n-1}}$
Avaluem primer la base: dins de l'arrel, tenim el mateix grau (1) a dalt i a baix. El coeficient és $\\frac{1}{2}$. Per tant, la base tendeix a $\\sqrt{\\frac{1}{2}}$. Avaluem l'exponent: Mateix grau dalt i baix, coeficients 2 i 3. Tendeix a $\\frac{2}{3}$.
$$ \\left(\\sqrt{\\frac{1}{2}}\\right)^{\\frac{2}{3}} = ((\\frac{1}{2})^{\\frac{1}{2}})^{\\frac{2}{3}} = (\\frac{1}{2})^{\\frac{1}{3}} = \\sqrt[3]{\\frac{1}{2}} $$`
    },
    {
        id: "M2-T2-Ex3",
        title: "Problema 3: Criteri del sandvitx",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Feu servir el criteri del sandvitx per trobar el límit quan $n \\to \\infty$ de $b_n$ si el terme general és
$b_n = \\frac{1}{\\sqrt{n^2 + 1}} + \\frac{1}{\\sqrt{n^2 + 2}} + \\dots + \\frac{1}{\\sqrt{n^2 + n}}$`,
        content: `Això és un sumatori de $n$ fraccions. No podem simplement sumar els límits perquè el nombre de termes creix amb $n$. Hem de construir amb **criteri de sandvitx**:

**Cota inferior (el més petit):** Substituïm cada terme per la fracció més petita possible del sumatori (la que té el denominador més gran, és a dir, l'última). Si tenim $n$ vegades aquesta fracció menor, tenim: $n \\cdot \\frac{1}{\\sqrt{n^2 + n}}$.

**Cota superior (el més gran):** Substituïm cada terme per la fracció més gran possible (la del denominador més petit, és a dir, la primera). Tenim: $n \\cdot \\frac{1}{\\sqrt{n^2 + 1}}$.

Ara calculem el límit dels extrems:
**Límit inferior:** $\\lim \\frac{n}{\\sqrt{n^2+n}} = \\frac{n}{n} = 1$.
**Límit superior:** $\\lim \\frac{n}{\\sqrt{n^2+1}} = \\frac{n}{n} = 1$.

Com que totes dues fites convergeixen a 1, la nostra successió atrapada al mig també té com a límit 1.`
    },
    {
        id: "M2-T2-Ex4",
        title: "Problema 4: Jerarquia d'infinits",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu els següents límits:
a) $\\lim_{n \\rightarrow +\\infty} \\frac{a^n}{n!}$ amb $|a| > 1$
b) $\\lim_{n \\rightarrow +\\infty} \\frac{n^\\alpha}{a^n}$ amb $|a| > 1$, $\\alpha \\in \\mathbb{R}^+$`,
        content: `**a) $\\lim_{n \\rightarrow +\\infty} \\frac{a^n}{n!}$**
A dalt tenim una exponencial (creix ràpid) i a baix un factorial (creix moltíssim més ràpid).
Recordem que si dividim $\\frac{\\text{Lent}}{\\text{Ràpid}}$ el límit s'aproximarà ràpidament a $0$.  El factorial acaba destrossant a qualsevol potència per valors prou grans d'$n$. Resultat 0.

**b) $\\lim_{n \\rightarrow +\\infty} \\frac{n^\\alpha}{a^n}$**
Tenim un polinomi sobre una exponencial. A baix l'exponencial creix a una velocitat superior.
Novament estem sota la relació $\\frac{\\text{Lent}}{\\text{Ràpid}} \\rightarrow 0$. Per tant, el límit també és 0.`
    },
    {
        id: "M2-T2-Ex5",
        title: "Problema 5: Límits amb exponents variables",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu el límit de les successions de terme general:
a) $\\frac{\\cos n}{n^2}$
b) $\\frac{2^n + 3^n}{2^n - 3^n}$
c) $\\left(\\frac{n+2}{n-3}\\right)^{\\frac{2n-1}{5}}$
d) $(\\sqrt{n+1} - \\sqrt{n})\\sqrt{\\frac{n+1}{2}}$`,
        content: `**a)** $\\frac{\\cos n}{n^2}$
Pensem-hi un moment: el cosinus sempre oscil·la entre -1 i 1, per tant és una successió acotada. A sota tenim $n^2$, que creix cap a l'infinit, així que successió va multiplicada per $1/n^2$ tendeix a 0.

**b)** $\\frac{2^n + 3^n}{2^n - 3^n}$
Com que sorgeix indeterminació $\\frac{\\infty}{\\infty}$, es divideix el numerador i el denominador pel terme que domina o creix més, l'$3^n$. Al dividir-ho tot ens queda: $\\frac{(2/3)^n + 1}{(2/3)^n - 1}$. Com que $\\frac{2}{3}$ és més petit que 1, en elevar-lo a infinit tendeix a 0 respecte als sub-termes. Aleshores el límit decau a $\\frac{0 + 1}{0 - 1} = -1$.

**c)** $\\left(\\frac{n+2}{n-3}\\right)^{\\frac{2n-1}{5}}$
Indeterminació de tipus $1^\\infty$. S'ha d'utilitzar la fòrmula exponencial de límit: $\\lim a_n^{b_n} = e^{\\lim b_n \\cdot (a_n - 1)}$.
$$ \\frac{2n-1}{5} \\cdot \\left(\\frac{n+2}{n-3} - 1\\right) = \\frac{2n-1}{5} \\cdot \\left(\\frac{5}{n-3}\\right) = \\frac{2n-1}{n-3} $$
El límit del nou càlcul com té mateix grau té per valor els coeficients: $2$. Per tant, el límit agrupa tot és $e^2$.

**d)** $(\\sqrt{n+1} - \\sqrt{n})\\sqrt{\\frac{n+1}{2}}$
Resta d'arrels dóna $\\infty - \\infty$. Tret obligatòri de multiplicar per conjugat generant $\\frac{1}{\\sqrt{n+1}+\\sqrt{n}}$ a multiplicar a arrel final: $\\frac{\\sqrt{n+1}}{\\sqrt{2}(\\sqrt{n+1}+\\sqrt{n})}$. La dominant al mig extreu  $\\frac{1}{\\sqrt{2}(1+1)}$, portat a valor final $\\frac{\\sqrt{2}}{4}$.`
    },
    {
        id: "M2-T2-Ex6",
        title: "Problema 6: Successions recurrents (Inducció)",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Sigui $(a_n)_{n \\geq 1}$ una successió tal que $a_1 = -2/3$ i $3a_{n+1} = 2 + a_n^3$ si $n \\geq 1$.

a) Proveu que $-2 \\leq a_n \\leq 1$ per a tot $n \\geq 1$.

b) Proveu que $(a_n)$ és creixent

c) Proveu que $(a_n)_{n \\geq 1}$ és convergent i calculeu el seu límit.`,
        content: `**a) Proveu que $-2 \\leq a_n \\leq 1$**

Ho demostrem per inducció.

**Pas base:** Per $n = 1$, $a_1 = -2/3$. Es compleix $-2 \\leq -2/3 \\leq 1$.

**Pas inductiu:**
*   **HI (Hipòtesi d'Inducció):** Suposem que per a un cert $n$ es compleix $-2 \\leq a_n \\leq 1$.
*   **TI (Tesi d'Inducció):** Volem demostrar que aleshores $-2 \\leq a_{n+1} \\leq 1$.

Sabem que $a_{n+1} = \\frac{2 + a_n^3}{3}$. Apliquem la **HI**:
Com que $-2 \\leq a_n \\leq 1$, i la funció $f(x) = x^3$ és creixent:

$$ -2 \\leq a_n \\leq 1 \\implies (-2)^3 \\leq a_n^3 \\leq 1^3 \\implies -8 \\leq a_n^3 \\leq 1 $$
$$ -8+2 \\leq 2+a_n^3 \\leq 1+2 \\implies -6 \\leq 2+a_n^3 \\leq 3 \\implies \\frac{-6}{3} \\leq \\frac{2+a_n^3}{3} \\leq \\frac{3}{3} \\implies -2 \\leq a_{n+1} \\leq 1 $$
Per tant, la propietat és certa per a tot $n \\geq 1$. 

**b) Proveu que $(a_n)$ és creixent**

Volem veure que $a_{n+1} - a_n \\geq 0$:
$$ a_{n+1} - a_n = \\frac{2 + a_n^3}{3} - a_n = \\frac{a_n^3 - 3a_n + 2}{3} $$
Podem factoritzar el polinomi del numerador (per Ruffini):
$$ \\frac{a_n^3 - 3a_n + 2}{3} = \\frac{(a_n - 1)^2(a_n + 2)}{3} $$
Sabem d'**a)** que $-2 \\leq a_n \\leq 1$:
*   El terme $(a_n - 1)^2$ sempre és $\\geq 0$ (quadrat).
*   Com que $a_n \\geq -2$, el terme $(a_n + 2)$ és $\\geq 0$.

Per tant, $a_{n+1} - a_n \\geq 0$, el que demostra que la successió és creixent.

**c) Convergència i límit:**

Pel Teorema de la Convergència Monòtona, com que la successió és monòtona (creixent) i està acotada superiorment (per 1), sabem que és convergent. Sigui $L = \\lim_{n\\rightarrow\\infty} a_n$:
$$ L = \\frac{2 + L^3}{3} \\implies L^3 - 3L + 2 = 0 \\implies (L - 1)^2(L + 2) = 0 $$
Les solucions són $L = 1$ i $L = -2$. Com que $a_1 = -2/3$ i la successió és creixent, el límit forçosament ha de ser $L = 1$.`
    },
    {
        id: "M2-T2-Ex9",
        title: "Problema 9: Taller de límits (II)",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu els límits següents:
a) $\\lim_{n \\to +\\infty} \\frac{2^n \\cdot 3^n + 5^{n+1}}{(2^n + 1)(3^{n-1} - 1)}$`,
        content: `**Resolució A**
Aquesta és la resolució d'un exercici típic de sumatori amb elements dispars que busquem el component general:

Simplifiquem els termes dominants.

**Numerador:**  $2^n \\cdot 3^n = 6^n$. El terme $5^{n+1}$ passa a ser insignificant al final vs un $6$.
**Denominador:** Operem el parell el que produeix de multiplicació del de bases grosses a $(2^n + 1)(3^{n-1} - 1) \\sim 2^n \\cdot 3^{n-1} = 2^n \\cdot \\frac{3^n}{3} = \\frac{6^n}{3}$.

$$ \\lim_{n\\rightarrow\\infty} \\frac{6^n + 5 \\cdot 5^n}{(2^n+1)(\\frac{1}{3}3^n-1)} = \\lim_{n\\rightarrow\\infty} \\frac{1 + 5(5/6)^n}{(1 + 1/2^n)(\\frac{1}{3} - 1/3^n)} $$

Operació fina donarà final a divisions entre el que queda viu sense menyspreables $(5/6)^n \\rightarrow 0$, $(1/2)^n \\rightarrow 0$, resultància dóna $= \\frac{1 + 0}{1 \\cdot \\frac{1}{3}} = 3$`
    },
    {
        id: "M2-T2-Ex12",
        title: "Problema 12: Substitució de paràmetres",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu $a$ i $b$ tals que $\\lim_{n \\rightarrow +\\infty} \\left(\\frac{1-an^2}{3n^2-2}\\right)^{1-bn^2} = \\sqrt{e}$`,
        content: `El límit és $\\sqrt{e} = e^{1/2}$. Perquè un límit de tipus potencial-exponencial doni un nombre diferent de 0, 1 o infinit, normalment prové d'una indeterminació $1^\\infty$. La base ha de tendir a 1.

$$ \\lim_{n\\rightarrow\\infty} \\frac{1-an^2}{3n^2-2} = \\frac{-a}{3} = 1 \\implies a = -3. \\text{ Ara la base és } \\frac{1+3n^2}{3n^2-2}. $$

Usem la fórmula de número de Euler ($e^L$) sabent $L = \\text{lim}(\\text{base} - 1) \\cdot \\text{exp}$:

$$ \\text{Base} - 1 = \\frac{1+3n^2}{3n^2-2} - 1 = \\frac{1+3n^2 - (3n^2-2)}{3n^2-2} = \\frac{3}{3n^2-2} $$

$$ L = \\lim_{n\\rightarrow\\infty} \\frac{3}{3n^2-2} \\cdot (1-bn^2) = \\lim_{n\\rightarrow\\infty} \\frac{3-3bn^2}{3n^2-2} = \\frac{-3b}{3} = -b $$

Sabem que el límit per la precondició assignada de  arrel d'exponent s'iguala a l'obtenció extreta. Per tant extreiem $\\sqrt{e} = e^{1/2}$. Finalment veiem valid de $-b = \\frac{1}{2} \\implies b = -\\frac{1}{2}$ prenent la constatació matemàtica del polinomi.`
    }
];
