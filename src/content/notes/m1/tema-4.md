---
title: "Tema 4: Arbres i Arbres Generadors"
description: "L'estructura estrella. Caracterització i la seqüència de Prüfer."
readTime: "20 Min"
order: 4
---

Un arbre és l'estructura preferida de la informàtica per representar jerarquies. A diferència d'un graf arbitrari on pots quedar atrapat en un cicle (rotonda), els arbres s'expandeixen purament sense rutes de retorn.

## 1. El concepte pur: Arbres, Boscos i Fulles

*   **Arbre**: Tot graf connex i acíclic.
*   **Bosc**: Graf acíclic format per un o més arbres (components connexos independents).
*   **Fulla**: Tot vèrtex en un bosc que tingui grau 1. És un "carreró sense sortida".

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

### Propietats i Talls
En els arbres reals si tallem una branca o tallem un nus tot s'esfondra. Què li passa al nostre graf arbre $T$:
1.  **Dues fulles miním**: Tot arbre amb $n \ge 2$ té com a mínim dues fulles.
2.  **Sempre arestes pont**: Qualsevol aresta d'un arbre és una *aresta pont*. Si l'esborrem, l'arbre es trenca exclusivament en bosc de 2 components.
3.  **Vèrtexs de tall**: Si esborrem un vèrtex $u$ que té grau $\ge 2$, l'arbre col·lapsa separant-se violentament en **$g(u)$ components connexos**.
4.  **Només potar**: Si només esborrem una de les seves *fulles*, el component general continua lligat per ser considerat encara un arbre $T$ vàlid intacte.

:::note{title="Estructura DestaCada d'Examen: La Biestrella"}
Als parcials sovint treuran un estrany nom gaire formal a la pràctica de casos i de combinacions i respostes: la **Biestrella**. Què és aquest terme que els exàmens criden i valoren de forma d'incògnita?
És aquell arbre únic matemàtic determinat sota la particularitat irrompible lligada de posseir pur l'extricte requeriment vital que només i exactament un **límit absolut tancat natural total d'únicament 2 dels representataris purs dels seus vèrtexs se certifiquin i actuin considerant-se no ésser tractats ni comptats per "fulles".** 
*(Literalment són com si forcessin a dues Estrelles radials llunyanes donant-se literal la clau mestra forçant la línia frontal unida entre els cor central dels dos caps lliures generals que l'un i l'altre fan originar)*.
A nivell avaluador d'estadística matemàtica lligat assegura als de dita classe directa tenir clavat a prova formatives tancades **un diàmetre oficial pur clavat en $D_{biestrella} = 3$**, gràcies al tràmit mig.
:::

### Teoremes Absoluts Evaluadors
No necessites dibuixar, mira les matemàtiques que et donen sobre una prova:
> **Limitador Màxim d'Arestes**: Qualsevol bosc de $n$ vèrtexs format d'un número o combinat de $k$ components pur connexos, contindrà màxim i absolut $n - k$ arestes naturals limit per on s'escampen. Per tant cap arbre pur pot excedir $n - 1$ arestes de consum.

> **Caracterització Pura d'Arbres (Teorema Estel-lar)**
> Donat graf complet global referent pur genèric que disposa viari sobre forma d'exactament ordre $n$ i té en ell consum arestes globals absoluts mida $m$, totes les sentències afirmen el mateix sense dubtes sobre en estar segurs que **$G$ ÉS UN ARBRE**:
> * És acíclic, i l'han vist exhaurir mesura d'arestes $m = n - 1$.
> * És connex, però va lliurat genèric i de fet li prenen $m = n - 1$ arestes.
> * Connecta purament absolut, i tota pràctica aresta visual lligat es comporta directament de pont separador de mons naturals!
> * Donats $u$ i $v$ qualsevol, del plànol se n'extreu sempre de model referent únic i estricte on només hi ha cap ells UN pur camí!

### 🎯 Tip d'Examen: L'Equació d'Or dels Arbres

Gairebé el 40% dels exercicis d'arbres a l'examen es resolen amb una única equació de primer grau, sense dibuixar res.
Com que un arbre té exactament $m = n - 1$ arestes, si apliquem el **Lema de les Encaixades** ($\sum g(v_i) = 2m$), obtenim la fórmula mestra:

$$ \sum_{v \in V} g(v) = 2n - 2 $$

:::tip{title="Exemple Clàssic d'Examen"}
**Problema:** Un arbre $T$ té ordre $n$. Sabem que té 3 vèrtexs que no són fulles amb graus $4, 3$ i $2$. Quantes fulles té?
**Solució Directa:** Si té $f$ fulles (que tenen sempre grau 1), la suma de graus és $4 + 3 + 2 + (f \cdot 1) = 2n - 2$.
Com que l'ordre total és $n = f + 3$ (les fulles més els 3 vèrtexs interiors), substituïm $n$:
$9 + f = 2(f + 3) - 2 \implies 9 + f = 2f + 4 \implies f = 5$.
L'arbre té 5 fulles i ordre $n = 8$. **Molt ràpid i precís.**
:::

---

## 2. Arbres Generadors: L'esquelet intern dels grafs

A les ciutats súper saturades (connexes), a vegades volem crear canonades eficients netejant vèrtexs residuals sense destruir barriades. Volem extraure **un Arbre Generador**: Un subgraf que descobreix mantenir vius tots els habitatges sense cicles ni elements de connexions extres residuals de luxe.

**Teorema de l'Existència:** Un graf $G$ té inclòs de regal arbre generador pur si, i *només* si, $G$ resulta ser un pla genèric completament **connex**!

### Com aconseguim extreure l'Esquelet? DFS i BFS

Els propis algorismes natius de recerca de components DFS i BFS, extreuen un "Aresta" al Arbre $(W,B)$ només l'instant matemàtic lligat on creuen frontera desconeguda que els permet de viatge conèixer en descobriment on havíem pas! 

* **Arbre per DFS (Profunditat)**: General el camins prims super allargats per immersió, s'enreda profund per endavant.
* **Arbre per BFS (Onades)**: Les distàncies d'origen, crea una onada expandint un arbre complet panxut en totes bandes.

:::tip{title="Truc d'Examen: Isomorfismes perduts per l'Origen"}
Posa que t'apareix una roda clàssica ($W_n$) un examen per fer els arbres o preguntar variables originades abstractes referint pures depenen inicial de l'arrencament general assignat per l'estratègic BFS o DFS aplicat per recórrer..
Saps clar que **L'arbre sorgit variarà formal complet sota natural puresa originant dos de no isomorfs i radicalment de disseny absolut oposat.**
1. Si l'arrel lligada d'origen pur pren arrenacament llançat sobre **l'autèntic cèntric general (El hub mig de $W_n$)** : Només pel mètode clàssic ràpid pur tàctil onada de referència, capturarà del "salt límit onadenc" a tothom sense paràboles donat lloc només total a una espectacularment àgil pura combinatòria d'arbre i estricte on tot allò només era pur $K_{1, n-1}$. (Una simple, genèrica i pura Estrella base que penja sense tancats lícits restants!).
2. Si però arrel i enfrontat es comença a posició allunyada sobre **La perifèrica per un extrem marge marginal circular lligat**: El salt d'amplitud agafa al mig pur cert originat pel de mig cert absolut radial costat originat per marge capturarà exclusiu limitats tancats que un d'ells resulta esdevindre literal l'"ull fort mestre absolut", estricte provocador que a pràctic lligat d'escala pas tàctil serà ells exclusivament des d'enlaire els propagadors naturals directes finals expansius i generant formes complexes estranyament combinades deformals de fulles llunyanes. Òbviament **Són clarment No-Isomorfics sempre!**
:::

(Mireu la simulació interactiva d'aquests grans de Tema 2; les rutes blanques i fletxetes formaven els dits Arbres Generadors natius).

<br/>

## 3. Enumeració i el Miracle de Prüfer

**"Quants arbres diferents es poden fer lliurant la llibertat amb $n$ vèrtexs fix?"**

**Teorema de l'etiquetat i relació absoluta per Cayley**: Si tens $n$ vèrtexs anomenats pur per $[n]$ (on de genèrica tota referència tots tenen noms), de possibles arbres diferents viables existeixen en natura formatives excepte límits absolut exclus en quantitat forçant la puresa d'exacte **$n^{n-2}$** combinatòries possibles generacions viables!! 

### Comprimir l'arbre viari de 2D en d'una matriu text
Ho demostren usant **Seqüències de Prüfer**. Tot arbre pot reduir-se en un Array de números escollit esborrant purament el model en paper pas a pas:
1. Troba la FULLA que tingui l'ID referent **més petit** del sistema.
2. Observa el se únic "veí lligat" i registra el SEU NÚMERO a la Seqüència d'informe en el Array llista.
3. Arrenca físicament la fulla. A l'escombreries!
4. Repeteix fins que quedin 2 solituds nodes centrals purs connectats per salvar. I para totalment!

Siguin aquest codi implementat i pur, veurem l'aniquilador algoritme:

:::algoviz{algorithm="prufer_build"}
:::

:::tip{title="Truc d'Examen: Grau vs Seqüència"}
Als exàmens et donaran seqüències i et demanaran graus (sense dibuixar l'arbre!). Hi ha una traducció matemàtica directa i **obligatòria**:
$$ \text{Grau de } v \text{ a l'arbre} = (\text{Cops que } v \text{ surt a la seq. de Prüfer}) + 1 $$

*   **Corol·lari fonamental:** Les **fulles** tenen grau 1, per tant surten $0$ vegades (no surten mai a la seqüència).
*   **Si a l'examen et diuen:** "una seqüència te els valors $a$ dos cops, $b$ un cop, i $c$ un cop", saps instantàniament que: $g(a)=3$, $g(b)=2$, $g(c)=2$, i la resta de vèrtexs de l'arbre que no es mencionen són fulles (grau 1).
:::

I esclar, es pot fer l'inrevès quan en proves d'avaluació on només us regalen l'array numèrica abstracte i heu de generar l'Arbre originari sense ajuda:

:::algoviz{algorithm="prufer_rebuild"}
:::
