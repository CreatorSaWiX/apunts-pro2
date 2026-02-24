import type { Solution } from '../../solutions';

export const ex2_6: Solution = {
    id: 'M1-T2-Ex2.6',
    title: 'Exercici 2.6: Mida en Dos Components Complets',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Sigui $G$ un graf d'ordre $n$ que té exactament dos components connexos i tots dos són grafs complets. Demostreu que la mida de $G$ és, almenys, $(n^2 - 2n)/4$.`,
    content: `
Tenim un graf distribuït en dos illes i ambdues porten a l'extrem la màxima capacitat d'arestes possible amb el grup, sent doncs **grafs complets ($K_{n_1}$ i $K_{n_2}$)**.
L'ordre complert d'aquests grafs se suma així: $n_1 + n_2 = n$.
I volem esbrinar com queda l'àmbit de mínims corresponent a la Mida sumada de tot el graf ($m$).

Com sabem que els components són $K_{n_1}$ i $K_{n_2}$, el preu exacte de les arestes de cadascun ve donat per la fórmula del complet:
$$ m = \\frac{n_1(n_1-1)}{2} + \\frac{n_2(n_2-1)}{2} $$

Apliquem el concepte de substitució directa aïllant ràpidament un dels termes: com sabem generalment $n_2 = n - n_1$.
$$ m(n_1) = \\frac{n_1^2 - n_1 + (n - n_1)^2 - (n - n_1)}{2} $$

Sumem i desenvolupem el quadrat del costat dret al sumatori: $(n - n_1)^2 = n^2 + n_1^2 - 2n(n_1)$.
$$ m = \\frac{1}{2} \\Big( n_1^2 - n_1 + n^2 + n_1^2 - 2n n_1 - n + n_1 \\Big) $$

Cancel·lem factors oposats exactes ($-n_1$ i $+n_1$) i fusionem parelles estables comunes al mateix nivell ($2n_1^2$) aconseguint finalment reduir l'expressió cap a un element de base simple constant i orientat a obtenir el factor minimitzant:
$$ m(n_1) = \\frac{2n_1^2 - 2n \\cdot n_1 + n^2 - n}{2} $$

Aquesta és una **funció polinòmica asimètrica o paràbola quadràtica en forma de $U$ (còncava)** on variem l'incògnita d'equilibri de vèrtexs $n_1$. I com bé sap tothom del batxillerat, una paràbola obté sempre condició d'esfondrament o vall sota en el seu propi **Mínim global absolut**. 
Punt focalitzant el vèrtex es treu pel clàssic derivat igualat respecte un canvi $0$, localitzant precisament el fons base a la suma completada del punt on $n_1$ fa exactament meitats perfectes uniformades pures on l'element es distribueix part contra l'altra: $n_1 = \\frac{n}{2}$

Tot d'una deducció ens fa raonar: Les mides estaran el més arran de terra aprop respecte reducció quantitativa possible i assolint el Mínim mentre més empaquetats de forma simètrica constant es reparteixi el recurs! I com més elements i variables disperses fiquis en un i redueixis a res a l'altre asimètric (per exemple un de gairebé $1$ vèrtex i l'altre s'ho porta tot) creixerà l'index exponent d'arestes quadrat com si tractés el fons cap un gegant pur absolut fins pujar vuit al màxim exponent complet en formatiu d'únic d'un $K_n$.

Agafant per avaluar la hipòtesi i calcular just i completament el seu fons substituint doncs on la incògnita limit relatiu $n_1 = n/2$ per descobrir si just és o no "La fita donada de l'enunciat teòric":
$$
m_{min} = \\frac{ 2 \\left(\\frac{n}{2}\\right)^2 - 2n \\left(\\frac{n}{2}\\right) + n^2 - n }{2}
$$

Expandeix-ho i anul·la factors tancants pur aplicatius variables respecte variables igualitàries d'oposicions multiplicadors constants oberts per 2 i l'altre entre factors dividits extrems absolut de 2 darrere tancat per multiplicador d'índex $n$:
$$
m_{min} = \\frac{ 2 \\left(\\frac{n^2}{4}\\right) - n^2 + n^2 - n }{2} = \\frac{ \\frac{n^2}{2} - n }{2}
$$

Dividint de manera unitària entre 2 cada part referent estricte constant:
$$
m_{min} = \\frac{n^2 - 2n}{4}
$$
I certament trobem amb detall l'expressió pura teòrica i resultant esperada que demostra a base teòrica la condició original pel Lema de Mínim absolut! $\\square$
  `,
    availableLanguages: ['ca']
};
