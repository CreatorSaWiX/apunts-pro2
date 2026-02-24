import type { Solution } from '../../solutions';

export const ex1_28: Solution = {
  id: 'M1-T1-Ex1.28',
  title: 'Exercici 1.28: Cicles en Grafs Grans',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $n \\ge 6$.\n\n1) Demostreu que $G$ o $G^c$ conté un vèrtex $v$ de grau almenys 3.\n2) Demostreu que $G$ o $G^c$ conté un cicle de longitud 3. (Considereu les adjacències entre els veïns del vèrtex $v$ del primer apartat.)\n3) Demostreu que en una reunió de $n \\ge 6$ persones, sempre n'hi ha 3 que es coneixen dos a dos o 3 que no es coneixen dos a dos.`,
  content: `
**1) La regla del grau $v$ per $n \\ge 6$**
Prenem un vèrtex determinat i particular de tota la festa com a mostra central, anomenat $v$. Hi ha $n-1 \\ge 5$ altres assistents a la sala directes.
Es classifiquen tots sota només dues caixes per al node focal (les condicions complementàries binàries):
*  O hi ha dret a una **Aresta** ("es coneixen", graf $G$).
*  O **No hi ha connexió** ("no es coneixen", graf $G^c$).

A l'aplicar el Principi de les caixes de Dirichlet pel mínim present sobre aquest objectiu i situacions:
$\\lceil 5 / 2 \\rceil = 3$
Existeix indiscutiblement per al graf (comú o reflex del complementari general objectiu) almenys un grup de 3 veïns en relació directa del mateix escenari cap a nosaltres. El qual demostra que efectivament **grau mínim associat** $\\ge 3$ comença en l'entorn definit.

**2) Comprovació de Triangles Formatius Isomorfs $C_3$**
Siguin $v_1, v_2, v_3$ aquests tres nodes vinculats prèviament al Node general esmentat referent actiu:
*   Si existeix una aresta base al pla actual al voltant de les connexions d'un en relació purament als altres, i ho vinculen (ex. vinculació respecte a $v_1 v_2$): Formem el nostre primer cicle $C_3$ (Triangle) directament amb els components $v$, lligant cicles per primer pla base real!
*   Però; ¿I si NO estan interconnectats en absolut cap amb cap i s'aïllen entre ells? Llavors al fer la imatge respectiva visual inversa cap el terreny complementari total base (canvi oposicional pla $G^c$), apareixeran connectats obligatòriament formatius junts conformant ells base lligada del triangle $C_3$. Llei Universal resolta garantint Cicle final $C_3$ Tancat Trilogia!

**3) Equivalència Sociocultural Estadística de l'Efecte Ramsey**
La conclusió demostra teòricament la **Llei de Ramsey** general sobre formació d'entorns d'estabilitat i teoria del Caos respectiu relatiu al model de la base estadística R(3,3)=6! En conjunts grans com sales superant elements com en 6 s'unifiquen sempre 3 amb elements compartits que es repelen els mateixos amb elements d'unificació paral·lela sense res.
`,
  availableLanguages: ['ca']
};
