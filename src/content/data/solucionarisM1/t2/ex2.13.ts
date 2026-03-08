import type { Solution } from '../../solutions';

export const ex2_13: Solution = {
    id: 'M1-T2-Ex2.13',
    title: 'Exercici 2.13: Propietats del Complementari i els talls',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Siguin $G = (V, A)$ un graf i $v$ un vèrtex de $G$. Proveu que:  
1) si $G$ és no connex, aleshores $G^c$ és connex;  
2) $(G - v)^c = G^c - v$;  
3) si $G$ és connex i $v$ és un vèrtex de tall de $G$, aleshores $v$ no és un vèrtex de tall de $G^c$.`,
    content: `
Resolent l'escala de cascada en tres simples passos directes:

### 1) $G$ desconnectat $\\implies G^c$ hiperconnex  
Si a $G$ existeixen clàssics dos bàndols barallats completament buits en aresta cap un a l'altre (ex. llistats separats $A$ i $B$). A l'univers inverit, $G^c$ es fusionen llançant enllaços de distància lliure $1$ entre qualssevol enemics per definició. I els propers d'$A$ originals passen a parlar junts via l'aliat invertit de l'altre lloc en només distància de pas $2$. Tothom es parla: $G^c$ Connex fortament. 

### 2) Vèrtex Comodí a Inversos: $(G - v)^c = G^c - v$  
Matemàtica simètrica assequible pura: Treure del conjunt $v$ tallat físicament i commutar el cel o línies restants $\\implies$  Actuar idèntic en primer pas invertint totalment res i en secundari traient el dit de focus $v$ esborrada. Ordre canviat i cap afectació en aresta pura resultant d'àlgebra lineal de llistats! Resultat igual i equivalent.

### 3) Comprovant el Vèrtex inefable als inversos!  
1. Si $v$ es vèrtex actiu de tall línia inicial a $G$, l'evangeli ens marca que $G-v$ final de tallar quedarà fracturat $\\to$ **No Connex**.
2. Des d'acord al nostre bloc *pas (1)* fixat abans s'escau que un graf lliurat no connex el complementari adquireix estabilitat ferotge cap $\\to$ **$(G-v)^c$ és alt i clarament Connex**.
3. Assentint del bloc pur *pas (2)* deduït on en forma tenim intercanvi d'aliens $(G-v)^c = G^c - v$. En reemplaç directe pel terme superior assegurat sabem amb mà als ulls resultants que $G^c - v$ **és efectivament Connex**.
4. I quin significat te una filla d'eliminació de $v$ lliurant pas de normal connex final? Que a l'àmbit d'univers invers lliure $v$ just allà ja mort no servia en res de barrera pura, ergo final de tall $v$ a $G^c$ **Té de deixar l'etiqueta letal de tall darrere i ja NO ser cap vèrtex esberlador.** $\\square$
  `,
    availableLanguages: ['ca']
};
