import type { Solution } from '../../solutions';

export const ex2_17: Solution = {
    id: 'M1-T2-Ex2.17',
    title: 'Exercici 2.17: Centre, Radi i Diàmetre',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `1) Trobeu l'excentricitat de tots els vèrtexs, el radi, els vèrtexs centrals i el centre:\n&nbsp;&nbsp;&nbsp;&nbsp;a) dels grafs de l'ex 2.1\n&nbsp;&nbsp;&nbsp;&nbsp;b) del graf $G = ([8], \\{12, 14, 15, 23, 34, 38, 46, 47, 56, 67, 78\\})$\n2) Doneu un exemple d'un graf connex amb el radi i el diàmetre iguals.\n3) Doneu un exemple d'un graf connex tal que el diàmetre sigui el doble del radi.`,
    content: `
Anem per passos, calculant sempre la distància màxima de cada vèrtex cap a qualsevol punt cec desconegut, la seva anomenada **excentricitat $e(v)$**:

### 1) a) Pels Grafs 2.1
*   **Graf $G_1$ (Petersen)**: És un dels exemples més simètrics matemàticament assolits purs. Tot absolut element de la xarxa compleix $e(v) = 2$.
    *   **Radi**: $2$ *(el mínim de les e(v))*
    *   **Diàmetre**: $2$ *(el màxim de les e(v))*
    *   **Centre**: Tots i cadascun dels nodes $\\{1, 2, \\dots, 10\\}$ empaten com a centrals lliures simultàniament!

### 1) b) Pel graf de 8 línies teòric numèric ([8])
Si iterem pel seu llistat d'arestes donades al test ($1-2, 1-4, 1-5, 2-3, \\dots$) i executem mental o visualitzant BFS de la xarxa:
| Vèrtex $v$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Excentricitat $e(v)$** | 3 | 3 | 3 | **2** | 3 | 3 | 3 | 3 |

*   **Radi $Rad(G)$:** $\\min(e(v)) = 2$
*   **Diàmetre $D(G)$:** $\\max(e(v)) = 3$
*   **Centre de $G$:** Unicament el node $\\{4\\}$ posseeix l'excepcional drecera i excentricitat central més baixa del subgrup de 2 temps pur. Ell domina i engloba pròpiament com a "el vèrtex central" al nucli general.

### 2) Voleu graf amb $Radi = Diàmetre$ ?
*   **Exemple:** Tria i escull un complet, per exemple el Triangle **$G = K_3$** (nodes A,B,C).
*   **Fonament:** Sigui qui sigui, per parlar amb el llunyà i aliè ha d'emprar drecera just $1$ ($e(A)=1, e(B)=1, e(C)=1$). Resultat perfectament lligat on cota baixa mínima cau a la mateixa dalt (Radi $1$ = Diàmetre $1$) tot complert matemàtic.

### 3) Voleu un $Diàmetre = 2 \\times Radi$ ?
*   **Exemple:** Dissenya una carretera llarga natural recta assolellada, un Camí pur de 5 passos com un braç llarg **$G = P_5$** $(1-2-3-4-5)$.
*   **Fonament:** 
    *   El **mig de la cua $3$**, només triga màxim 2 bots per cridar els caps distants $1$ i $5$ i arribar-hi bé. S'emporta per aclamació universal el ceptre dictat del centre. ($Radi = 2$)
    *   Als **extrems naturals d'arrel limit logíc (el node 1)**, per visitar l'indret capvespre de l'extrem (5) li faran falta travessar completament tot just 4 bots complets en ruta! ($Diàmetre = 4$). Resulta just matemàticament $4 = 2 \\times 2$ (el doble d'afectació).
$\\square$
  `,
    availableLanguages: ['ca']
};
