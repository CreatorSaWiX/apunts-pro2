import type { Solution } from '../../solutions';

export const ex2_15: Solution = {
    id: 'M1-T2-Ex2.15',
    title: 'Exercici 2.15: Càlcul de Diàmetres',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Trobeu el diàmetre dels grafs següents: $K_n$, Grafs de 2.1, $K_{r,s}$, $C_n$, $W_n$, $T_n$.`,
    content: `
| Família de Graf | Diàmetre ( $D(G)$ ) | Raonament visual intuïtiu |
| :--- | :---: | :--- |
| **1) Complet $K_n$** | $1$ | Tots els vèrtexs estan interconnectats; viatges on viatges, costa una aresta.<br/>*(Per $n=1$ el diàmetre tècnic és 0)*. |
| **2) Ex 2.1 (Petersen)** | $2$ | Al graf de Petersen tothom dista un màxim pur de dos passos per assolir qualsevol objectiu. |
| **2.2) Ex 2.1 ($G_2$)** | $4$ | És un disseny on moure's des d'un extrem de l'anell exterior limitat passant cap a sota i travessant suposa un gran volt. La distància màxima es fixa en $4$. |
| **3) Bipartit $K_{r,s}$** | $2$ | Entre cantons oposats ja estàs a dist $1$. Entre gent del *mateix costat*, només has de fer escala en l'altre grup: $a \\to x \\to b$ (dist $2$).<br/>*(Excepcions: l'estrella $K_{1,1}$ té dist. 1).* |
| **4) Cicle $C_n$** | $\\lfloor \\frac{n}{2} \\rfloor$ | Ets a l'anell central: per anar a l'invers del rellotge l'oponent més reculat queda certament a la meitat perfecta del rotatori geomètric descrit. |
| **5) Roda $W_n$** | $2$ | Un anell farcit on tothom té drecera i està connectat a l'"eix central" al mig matemàtic absolut. Així que per anar on sigui utilitzes el central: pujo (1) i baixo cap a on preteníem (2).<br/>*(Assumint base de mida suficient $n \\ge 4$)*. |
| **6) Arbre Nul o Tornejos** $T_n$ | Variable |  Si s'assumeix l'**Arbre Trivial** (null graph de l'anglès), $\\infty$ per estar fragmentat totalment en el no-res. |
  `,
    availableLanguages: ['ca']
};
