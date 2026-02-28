import type { Solution } from '../../solutions';

export const ex1_24: Solution = {
  id: 'M1-T1-Ex1.24',
  title: 'Exercici 1.24: Isomorfismes de Complementaris',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G=(V,A)$ i $H=(W,B)$ dos grafs. Demostreu que $G$ i $H$ són isomorfs, si i només si, $G^c$ i $H^c$ són isomorfs.`,
  content: `
**Recordatori:** Dos grafs $G$ i $H$ són **isomorfs** ($G \\cong H$) si existeix una bijecció $f: V \\to W$ que preserva les arestes:
$$uv \\in A \\iff f(u)f(v) \\in B$$

En altres paraules: $f$ reanomena els vèrtexs de $G$ i el resultat és exactament $H$.

---

### Demostració $(\\implies)$: Si $G \\cong H$, llavors $G^c \\cong H^c$

**Suposem** que $G \\cong H$. Existeix una bijecció $f: V \\to W$ tal que:
$$uv \\in A \\iff f(u)f(v) \\in B \\quad (*)$$

**Volem veure** que la **mateixa $f$** és un isomorfisme entre $G^c$ i $H^c$.

Prenem qualsevol parell de vèrtexs $u, v \\in V$ (distincts). Per definició del complementari:
$$uv \\in A^c \\iff uv \\notin A$$

Aplicant la condició $(*)$ de l'isomorfisme (pel bicondicional):
$$uv \\notin A \\iff f(u)f(v) \\notin B$$

I per definició del complementari de $H$:
$$f(u)f(v) \\notin B \\iff f(u)f(v) \\in B^c$$

Encadenant: $uv \\in A^c \\iff f(u)f(v) \\in B^c$.

Per tant, la mateixa $f$ és isomorfisme de $G^c$ a $H^c$. $\\square$

---

### Demostració $(\\impliedby)$: Si $G^c \\cong H^c$, llavors $G \\cong H$

**Suposem** que $G^c \\cong H^c$.

Apliquem el resultat anterior (la implicació $\\implies$) als grafs $G^c$ i $H^c$:
- Sabem: $G^c \\cong H^c$
- Aplicant $\\implies$: $(G^c)^c \\cong (H^c)^c$
- Però $(G^c)^c = G$ i $(H^c)^c = H$ (el complementari del complementari és el graf original)
- Per tant: $G \\cong H$ $\\square$

---

:::tip
**Idea clau**: un isomorfisme és un reanomenat de vèrtexs. Si reanomenes els vèrtexs de $G$ per obtenir $H$, el **mateix reanomenat** transforma $G^c$ en $H^c$, perquè les arestes que *no hi havia* a $G$ tampoc n'hi havia a $H$ (el bicondicional és simètric).
:::
  `,
  availableLanguages: ['ca']
};
