---
title: "Tema 4: Arbres i arbres generadors"
description: "L'estructura estrella. Caracterització i la seqüència de Prüfer."
readTime: "20 Min"
order: 4
---

Un arbre és l'estructura preferida de la informàtica per representar jerarquies. A diferència d'un graf arbitrari on pots quedar atrapat en un cicle (rotonda), els arbres s'expandeixen purament sense rutes de retorn.

## 1. Conceptes bàsics

*   **Arbre**: Tot graf connex i acíclic.
*   **Bosc**: Graf acíclic format per un o més arbres (components connexos independents).
*   **Fulla**: Tot vèrtex en un bosc que tingui grau 1.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "Arrel", "color": "#facc15" }, { "id": "A" }, { "id": "B" },
    { "id": "Fulla1", "color": "#10b981", "label": "Fulla" }, { "id": "C" },
    { "id": "Fulla2", "color": "#10b981", "label": "Fulla" },
    { "id": "Fulla3", "color": "#10b981", "label": "Fulla" }
  ],
  "links": [
    { "source": "Arrel", "target": "A" }, { "source": "Arrel", "target": "B" },
    { "source": "A", "target": "Fulla1" }, { "source": "A", "target": "C" },
    { "source": "C", "target": "Fulla2" }, { "source": "B", "target": "Fulla3" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-amber-400">Arbre únic</b><br/>Connex i acíclic. En verd les fulles (grau 1).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "group": 1 }, { "id": "2", "group": 1 }, { "id": "3", "group": 1 },
    { "id": "4", "group": 2 }, { "id": "5", "group": 2 }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "4", "target": "5" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-sky-400">Exemple de Bosc</b><br/>No hi ha cicles, però té 2 components connexos separats.</div>

::::

:::::

### Propietats fonamentals

Si $T$ és un arbre:
1.  **Mínim 2 fulles**: Si $n \ge 2$, l'arbre té almenys dues fulles (vèrtexs de grau 1).
2.  **Arestes pont**: Totes les arestes d'un arbre són ponts. Si s'elimina una aresta, el graf deixa de ser connex i es divideix en exactament 2 components.
3.  **Vèrtexs de tall**: Eliminar un vèrtex de grau $k$ divideix l'arbre en exactament $k$ components.

:::note{title="Estructura d'Examen: La Biestrella"}
Una **Biestrella** és un arbre que té **exactament dos vèrtexs que no són fulles**. 
*   Visualment, són dos vèrtexs centrals connectats entre sí, i cadascun d'ells té un nombre de fulles penjant.
*   **Diàmetre**: El diàmetre d'una biestrella és sempre $3$ (la distància més llarga és entre dues fulles de costats oposats).
:::

### Teoremes de caracterització
Un graf $G$ d'ordre $n$ i mida $m$ és un arbre si compleix **dues** d'aquestes tres condicions:
1.  $G$ és connex.
2.  $G$ és acíclic.
3.  $m = n - 1$.

:::tip{title="Ex1-Parcial-2014"}
**Problema:** Demostreu que un graf d’ordre $n$ i mida $m$ és arbre si i només si és acíclic i $m = n-1$.

<details>
<summary><b>Veure la demostració</b></summary>

1. ($\implies$) Si $G$ és un arbre, llavors és acíclic per definició. Demostrem que $m = n-1$ per inducció sobre $n$:
    
    **Cas base ($n=1$):** Un node i 0 arestes. $m = 0 = 1-1$. Correcte.
   
   **Pas inductiu:** 
    * **H.I.:** Suposem que la fórmula $m=n-1$ és certa per a tots els arbres de $n=k$ vèrtexs.
    * **T.I.:** Un arbre de $n=k+1$ nodes té almenys una fulla (vèrtex de grau 1). Si l'eliminem juntament amb la seva aresta, obtenim un nou arbre de $n=k$ nodes. Per hipòtesi d'inducció, aquest té $m = k-1$ arestes. En restaurar la fulla i l'aresta original, tenim $m = (k-1) + 1 = k = (k+1)-1$.

2. ($\impliedby$) Si $G$ és acíclic i $m = n-1$, hem de demostrar que és connex (i per tant un arbre):
    * Suposem que $G$ té $k$ components connexes $C_1, C_2, \dots, C_k$. Com que el graf és acíclic, cada component també ho és i, per ser connexa, cada $C_i$ és un arbre.
    * Per a cada component $C_i$, sabem que $m_i = n_i - 1$.
    * Sumant totes les arestes: $m = \sum_{i=1}^k m_i = \sum_{i=1}^k (n_i - 1) = \sum n_i - \sum 1 = n - k$.
    * Com que se'ns diu que $m = n - 1$, llavors $n - k = n - 1 \implies \mathbf{k = 1}$.
    * En haver-hi una sola component, el graf és connex i queda demostrat que és un arbre.
</details>
:::

Altres caracteritzacions:
*   Existeix un **únic camí** entre qualsevol parell de vèrtexs.
*   És acíclic, però si hi afegim qualsevol aresta nova, es crea exactament un cicle.

### Tip d'exàmen:
La majoria de problemes numèrics es resolen combinant lema de les encaixades amb la propietat $m = n - 1$: $$ \sum_{v \in V} g(v) = 2n - 2 $$

:::tip{title="Exemple de càlcul de fulles"}
**Problema:** Un arbre té 3 vèrtexs de graus 4, 3 i 2. La resta són fulles. Quantes fulles té?
**Solució:**
1.  Siguin $f$ el nombre de fulles.
2.  Ordre total: $n = f + 3$ (les fulles + els 3 vèrtexs coneguts).
3.  Suma de graus: $4 + 3 + 2 + (f \cdot 1) = 9 + f$.
4.  Apliquem l'equació: $9 + f = 2(f + 3) - 2 \implies 9 + f = 2f + 4 \implies f = 5$.
:::

---

## 2. Arbres generadors

Un **arbre generador** d'un graf $G$ és un subgraf que conté tots els vèrtexs de $G$ i és un arbre.
*   **Existència**: Un graf té un arbre generador si, i només si, és **connex**.

### Algorismes de construcció
Podem obtenir arbres generadors recorrent el graf de dues maneres principals. Observa com un mateix graf (una roda $W_4$) produeix resultats totalment diferents:

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=200}
{
  "nodes": [
    { "id": "A", "label": "Arrel", "color": "#facc15" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" }
  ],
  "links": [
    { "source": "A", "target": "B", "color": "#f87171", "width": 3 }, 
    { "source": "B", "target": "C", "color": "#f87171", "width": 3 }, 
    { "source": "C", "target": "D", "color": "#f87171", "width": 3 }, 
    { "source": "D", "target": "E", "color": "#f87171", "width": 3 }
  ]
}
:::
<div class="text-center text-sm"><strong>DFS (Profunditat)</strong><br/>Genera camins llargs i profunds.</div>
::::

::::grid{cols=1}
:::graph{height=200}
{
  "nodes": [
    { "id": "A", "label": "Arrel", "color": "#facc15" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" }
  ],
  "links": [
    { "source": "A", "target": "B", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "C", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "D", "color": "#60a5fa", "width": 3 }, 
    { "source": "A", "target": "E", "color": "#60a5fa", "width": 3 }
  ]
}
:::
<div class="text-center text-sm"><strong>BFS (Amplitud)</strong><br/>Genera estructures "panxudes" (estrelles).</div>
::::

:::::

:::tip{title="Nota sobre Isomorfismes"}
Com veiem al dibuix superior, un mateix graf pot generar arbres generadors **no isomorfs**. En la roda $W_4$, el BFS des del centre genera una estrella ($K_{1,4}$), mentre que el DFS genera un camí ($P_5$).
:::

---

## 3. Enumeració i seqüència de Prüfer

**Quants arbres diferents podem formar amb $n$ vèrtexs etiquetats?**
*   **Teorema de Cayley**: Existeixen exactament $n^{n-2}$ arbres diferents.

### Seqüència de Prüfer
És una bijecció que permet codificar un arbre etiquetat de $n$ vèrtexs en una seqüència de longitud $n-2$.

**Algorisme de codificació:**
1.  Busca la fulla amb l'etiqueta més petita.
2.  Apunta el seu veí a la seqüència.
3.  Elimina la fulla.
4.  Repeteix fins que només quedin 2 vèrtexs.

::videoviz{url="/m1/prufer_build.webm" delay="2000"}

:::tip{title="Relació Grau-Seqüència"}
Aquesta és la clau per als exàmens:
$$ \text{Grau de } v = (\text{vegades que } v \text{ surt a la seqüència}) + 1 $$
*   Les **fulles** són els vèrtexs que **no apareixen mai** a la seqüència.
*   Si un vèrtex surt $k$ vegades, el seu grau és $k+1$.
:::

**Algorisme de decodificació:** Permet recuperar l'arbre a partir de la seqüència.

::videoviz{url="/m1/prufer_rebuild.webm" delay="2000"}
