import type { Solution } from '../../solutions';

export const ex2_16: Solution = {
    id: 'M1-T2-Ex2.16',
    title: 'Exercici 2.16: Impacte del tall al Diàmetre',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Per a cadascuna de les relacions següents sobre el diàmetre, doneu un graf $G = (V, A)$ connex i un vèrtex $u \\in V$ que les satisfacin:\n1) $D(G) = D(G - u)$.\n2) $D(G) < D(G - u)$.\n3) $D(G) > D(G - u)$.`,
    content: `
Anem a visualitzar cada escenari escollint l'exemple més pur i ximple que ho faci evident a primer cop d'ull:

**1) SENSE CAP AFECTACIÓ**: $D(G) = D(G - u)$
*   **Agafa un:** $G = K_4$ (complet de 4 vèrtexs), $u =$ qualsevol.
*   **Lògica pura:** El complet originari $K_4$ és tot veí amb amics llavors té diàmetre absolut $1$. Al morir-se $u$, el grup restant queda $K_3$ de 3 nodes amb la mateixa força de grup complint idèntica distància de diàmetre perfecte $1$. Res canvia.

**2) EL MÓN ES TORNARÀ MÉS LLARG**: $D(G) < D(G - u)$
*   **Agafa un:** $G = W_7$ (una roda amb l'exterior anell de 6, lligada al cor intern) i elimines just precisament el del mig de referència vital $u = \\text{centre}$.
*   **Lògica pura:**  Al caure el nucli $u$ (drecera natural universal, gràcies a la qual $D=2$), la gent del vot voltant demana rutes a dit exterior! Al no haver cor drecera el mapa final ($C_6$ a les palpentes) ha d'allargar viatges amb diàmetre pesat de radi llunyà $\\lfloor 6/2 \\rfloor = 3$. ($2 < 3$). Hem perdut la nostra gran drecera vital central.

**3) EL MÓN ES DISMINUIRÀ**: $D(G) > D(G - u)$
*   **Agafa un:** Camí estirat clàssic $G = P_4$ ($A-B-C-D$) i un de l'extrem es limitats morts complets com actius: $u = A$.
*   **Lògica pura:** Teníem el camí que dictava i encarnava tot el destí sencer per a desplaçaments llunyans asolint el seu topall teòric extrem pel viatge llargària d'$A-D$ fins a un temps tardat $D=3$. Esborrem el seu pes terminal de dret fonamental d'últim de l'aeroport (eliminem final extrem d'$a$). Qüestió llavors: la nova carretera del nou ordre ($B-C-D$) viu curta en viatge teòric màxim llarg on només fa la seva mida diàmetre just i just reduït natural a de temps de pas $2$. Tret el final del final, la vida té per límits estats curts obligats! ($3 > 2$). $\\square$
  `,
    availableLanguages: ['ca']
};
