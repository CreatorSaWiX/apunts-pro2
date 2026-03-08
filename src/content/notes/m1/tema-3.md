---
title: "Tema 3: Grafs Eulerians i Hamiltonians"
description: "Camins i cicles i els seus teoremes associats."
readTime: "15 Min"
order: 3
---

Els grafs Eulerians i Hamiltonians responen a dos problemes clàssics: recórrer totes les arestes sense repetir-ne cap (Eulerià) i recórrer tots els vèrtexs sense repetir-ne cap (Hamiltonià).

## 1. Grafs Eulerians: Recorregut d'Arestes

L'objectiu és recórrer un graf passant per **totes les arestes exactament un cop**.

*   **Senderó Eulerià**: Un recorregut no tancat que passa per totes les arestes d'un graf connex sense repetir-ne cap.
*   **Circuit Eulerià**: Un recorregut tancat (cicle) que passa per totes les arestes d'un graf connex sense repetir-ne cap.
*   **Graf Eulerià**: Un graf que conté un circuit eulerià.

### Teorema d'Euler (Caracterització)
Un graf connex és **Eulerià** si i només si **tots els seus vèrtexs tenen grau parell**.

*Raonament*: Si és un circuit, cada cop que arribes a un vèrtex per una aresta, necessites una altra aresta per sortir-ne. Per tant, les arestes incidentes a cada vèrtex han d'anar en parelles (una d'entrada i una de sortida).

### Corol·lari per a Senderons Eulerians
Un graf connex té un **senderó eulerià** (però no circuit) si i només si té **exactament dos vèrtexs de grau senar**. 
En aquest cas, el senderó començarà obligatòriament en un dels vèrtexs de grau senar i acabarà a l'altre.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "A", "label": "Grau 2", "color": "#10b981" },
    { "id": "B", "label": "Grau 3", "color": "#ef4444" },
    { "id": "C", "label": "Grau 3", "color": "#ef4444" },
    { "id": "D", "label": "Grau 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "A", "target": "B" }, { "source": "A", "target": "C" },
    { "source": "B", "target": "C" }, { "source": "B", "target": "D" },
    { "source": "C", "target": "D" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-rose-400">NO Eulerià (Té Senderó)</b><br/>Té exactament 2 nodes de grau senar (B i C).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "label": "Grau 2", "color": "#10b981" }, { "id": "2", "label": "Grau 2", "color": "#10b981" },
    { "id": "3", "label": "Grau 2", "color": "#10b981" }, { "id": "4", "label": "Grau 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "3", "target": "4" }, { "source": "4", "target": "1" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-emerald-400">Graf Eulerià</b><br/>Tots els nodes tenen grau parell.</div>
::::

:::::

:::tip{title="Truc d'Examen: El joc algebraic de l'Eulerià"}
Examen típic: "Per a quins valors de $n$, el graf complementari $T^c$ és eulerià?" L'examen juga on no pots veure gràfics, només equacions de lletres mortes.
Si pregunten això, invoca ràpidament el "Grau del Complementari" de Tema 1:
$$g_{T^c}(v) = (n - 1) - g_T(v)$$
I aquí apliquem Euler pur: **Per tal que $T^c$ sigui eulerià, el resultat d'aquella equació TOTS ELS COPS per TOTS els elements ha de donar obligatòriament valor PARELL.**
*(També vigila amb productes $K_{r,s}$, exclusivament seran Eulerians de per sí estret si casualment els conjunts categories the variables dimensionades com la $r$ i la $s$ assoleixen valor genèric totalment parells cadascun).*
:::

Pots veure com s'avaluen programàticament els graus senars per decidir si és o no eulerià en l'algorisme de continuació:

:::algoviz{algorithm="eulerian_check"}
:::

---

## 2. Grafs Hamiltonians: Recorregut de Vèrtexs

Mentre Euler es fixava en les arestes, Hamilton es fixa en els **vèrtexs**. L'objectiu és visitar cada vèrtex exactament un cop.

*   **Camí Hamiltonià**: Un camí que passa per **tots els vèrtexs** del graf sense repetir-ne cap.
*   **Cicle Hamiltonià**: Un cicle que passa per **tots els vèrtexs** del graf exactament un cop (excepte el vèrtex origen/destí).
*   **Graf Hamiltonià**: Un graf que conté un cicle hamiltonià.

Malauradament, saber si un graf general és Hamiltonià és un problema **NP-Complet**. No existeix cap regla fàcil i infal·lible (com els graus parells d'Euler) per afirmar-ho o denegar-ho a primer cop d'ull. Ens basem en condicions i exploració amb *backtracking*.

### 2.1 Condicions Necessàries (Si no ho compleix, NO és Hamiltonià)

Perquè un graf connex pugui ser hamiltonià, ha de complir:

1.  **Grau mínim estrictament positiu >=2**: Tot vèrtex ha de tenir com a mínim grau $2$, ja que en un cicle hem d'entrar i sortir de cada node obligatòriament per dues vies diferents. (Corol·lari: Els arbres mai, absolutament mai assoleixen poder ser Hamiltonians donat que com a mínim viuen plens de nodes extrem fulles penjant tallades de final 1 sol grau).
2.  **Llei de Tallaments Vèrtex-Components (La més forta)**: Suposem que extirpeu o torneu negres purament algun grup limitat tancat selectiu de certs vèrtexs anomenat $S$. Llavors el nombre resultant general o restant total com a pur components connex "illes sobrevivents" no pot superar mai, en valors absoluts sota cap circumstància estricta visual la xifra final que sumen o equivalen als elements perduts $|S|$.

:::tip{title="Truc d'Examen: Assassinant del tot l'opció Hamiltoniana"}
Si veieu pregunten literalment en un exercici per demostrar que NO ÉS cert "un graf sigui absolut purament Hamiltonià" ni es plantegi mai provar caminant a força bruta manual l'infinit. El truc per professors radica ocult a la **Condició 2 de component de Talls.**
Busqueu mentalment sempre algun "vèrtex o grup de vèrtexs de tall neuràlgics tàctics", on per culpa seva exclusivament quan suprimir purament només per exemple ell ($|S|=1$) l'univers resultant es dividiti de sobte natural genèric es creïn sense sentit o més $\ge 2$ parts desconnectades completament irreligades... S'han creat $2$ components robant només $1$ ! Això viola instantàniament la norma i es prova amb nota la impossibilitat pràctica de Hamilton a primera vista de l'esquema d'examen.
*(A més afegiu purament per famílies: Un Bipartit Complet $K_{r,s}$ té dret només factible d'aspirar o posseir el títol de purament ser Hamiltonià al cor de les ànimes com excepció absoluta d'estricte requeriment vital que els extrems equilibrin identitat al model exacte com de dimensions que assoleixen ser $r = s$. I la Roda trencada $R_k$ que amaga centralitat genèrica lliure, no assoleix ser cap de les tres euler hamilton sense afegir cordes).*
:::

### 2.2 Condicions Suficients (Si ho compleix, SÍ és Hamiltonià)

Un graf és Hamiltonià segur si hi ha una alta densitat d'arestes.

> **Teorema d'Ore**
> Sigui $G$ un graf senzilla d'ordre $n \ge 3$. 
> Si per a **tota parella de vèrtexs no adjacents** $(u, v)$ la capacitat que sumen entre les dos assoleix tota la xarxa, $g(u) + g(v) \ge n$, el graf és **Hamiltonià**.

> **Teorema de Dirac** (Corol·lari directe d'Ore)
> Simplificant: Si **absolutament tots** els vèrtexs estan endollats a mitja ciutat, tenint un grau $g(v) \ge n/2$, el graf és **Hamiltonià**.

### L'Algorisme d'Exploració (Backtracking)

Per trobar un camí hamiltonià en general necessitem provar rutes a fons confiant en no equivocar-nos i fent _backtracking_ (marxa enrere) quan arribem a un cul-de-sac:

:::algoviz{algorithm="hamiltonian_backtrack"}
:::
