import type { Solution } from '../../solutions';

export const ex2_1: Solution = {
    id: 'M1-T2-Ex2.1',
    title: 'Exercici 2.1: Trobar Camins i Cicles',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Trobeu en els grafs següents, si és possible, camins de longitud 9 i 11, i cicles de longitud 5, 6, 8 i 9.`,
    content: `
Recordem primer les restriccions d'ordre d'un graf ($n$):
*   Un **camí** (sense repetir vèrtexs) pot tenir una longitud màxima d'$n-1$.
*   Un **cicle** pot tenir una longitud màxima d'$n$.

### Graf $G_1$ (Graf de Petersen)
Aquest és el famós Graf de Petersen, que té **$n = 10$ vèrtexs**.

*   **Camí de longitud 9**: Sí, és possible, ja que implica passar pels 10 vèrtexs (és un camí Hamiltonià respecte els vèrtexs). 
    *   *Exemple*: $1 \\to 2 \\to 3 \\to 4 \\to 5 \\to 10 \\to 8 \\to 6 \\to 9 \\to 7$. (9 arestes, 10 vèrtexs).
*   **Camí de longitud 11**: **Impossible**. Un camí simple requereix travessar 12 vèrtexs sense repetir, i només en tenim 10.
*   **Cicles de longitud:**
    *   **5**: Sí, l'exterior mateix n'és un: $1-2-3-4-5-1$.
    *   **6**: Sí. Exemple: $1-2-3-4-9-6-1$. Verifica arestes: $1-2, 2-3, 3-4, 4-9, 9-6, 6-1$. Llargada 6!
    *   **8**: Sí. Exemple: $1-2-3-4-5-10-8-6-1$. Verifica arestes: $1-2, 2-3, 3-4, 4-5, 5-10, 10-8, 8-6, 6-1$. Llargada 8!
    *   **9**: Sí. Exemple: $1-2-7-10-5-4-3-8-6-1$. Verifica arestes: $1-2, 2-7, 7-10, 10-5, 5-4, 4-3, 3-8, 8-6, 6-1$. Llargada 9!

### Graf $G_2$ (Graf d'ordre 11)
El graf de la dreta té un vèrtex extra al centre (el vèrtex 11), de manera que **$n = 11$ vèrtexs** i té canvis en les connexions que destrueixen la simetria de Petersen formant Cicles i camins nous.

*   **Camí de longitud 9**: Sí, hi entra de sobres podent agafar part de l'exterior i l'interior sense agafar tots els nodes.
*   **Camí de longitud 11**: **Impossible**. Com tenim 11 vèrtexs com a màxim podem fer un camí de longitud 10 (passant-hi un cop per cadascun, és a dir el camí hamiltonià total). Requereix un vèrtex extra que aquest graf no té.
*   **Cicles de longitud 5, 6, 8, 9**: Sí, n'hi ha molts disponibles. Per exemple, per la llargada 5 només hem d'emprar el cicle pentagonal i fàcil de l'exterior de nou obtenint $1-2-3-4-5-1$.

:::tip{title="Conclusió sobre la Longitud"}
El parany principal d'aquest exercici és saber aplicar la teoria que prohibeix recorreguts superiors al nombre de recursos ($n$). Independentment de l'estructura laberíntica del dibuix, mai trobarem un camí simple de longitud 11 en grafs de menys de 12 vèrtexs!
:::
  `,
    availableLanguages: ['ca']
};
