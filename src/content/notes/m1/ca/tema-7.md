---
title: "Tema 7: Aplicacions lineals"
description: "Aplicacions lineals, isomorfismes, bases i dimensió."
order: 8
readTime: "19 min"
subject: "m1"
draft: false
isNew: true
---

## 0. Transformacions geomètriques

 > **Vols programar el GTA VII?** 
 > Si el teu somni és treballar a Rockstar Games o crear el proper motor gràfic revolucionari, aquest és el tema més important de tota la carrera. Les rotacions de càmera, el moviment dels personatges i la física dels objectes són, en essència, **Aplicacions Lineals**. A més, posa-hi ganes: aquest tema sol representar un **40% de l'examen final**.

En exercicis de $\mathbb{R}^2$ i $\mathbb{R}^3$, les transformacions més típiques que veuràs (i usen els shaders de qualsevol videojoc) són:

*   **Rotació**: Girar objectes respecte a un eix.
*   **Reflexió**: L'efecte mirall (canvi d'orientació).
*   **Projecció**: "Aplanar" objectes sobre un pla o eix (fonamental per renderitzar 3D en pantalles 2D).
*   **Escalat**: Fer les coses més grans o petites.

::three{type="vis_transformacions_hibrida"}

> **Geometria en 3D**: Mentre que a $\mathbb{R}^2$ només tenim un eix de rotació, a $\mathbb{R}^3$ podem rotar respecte a $X, Y$ o $Z$. Fixa't com la **reflexió** inverteix l'objecte; és un concepte clau en gràfics per ordinador.

---

## 1. Què és una Aplicació Lineal?

Una **aplicació lineal** és una funció entre dos espais vectorials (diguem $E$ i $F$) que "respecta" l'estructura d'aquests espais. No és una funció qualsevol; és una transformació "recta" i "proporcional".

Perquè una funció $f: E \to F$ sigui lineal, ha de complir **dues condicions sagrades**:

1.  **Suma**: $f(\vec{u} + \vec{v}) = f(\vec{u}) + f(\vec{v})$  
    *(Transformar la suma és el mateix que sumar les transformacions).*
2.  **Producte per escalar**: $f(\lambda \cdot \vec{u}) = \lambda \cdot f(\vec{u})$  
    *(Si dupliques l'entrada, la sortida es duplica).*

Una aplicació lineal **sempre** envia el vector zero al vector zero ($f(\vec{0}_E) = \vec{0}_F$). Si veus una funció on $f(0,0) = (1,2)$, ja saps segur que **no** és lineal!

::mafs{type="vis_propietats_lineals"}

### Com treballar amb polinomis i matrius?
Quan l'exercici no és de $\mathbb{R}^n$, el primer pas és convertir els objectes en "vectors de números" (coordenades) respecte a una base. Un cop tens els vectors, l'exercici es resol exactament igual que a $\mathbb{R}^n$.
*   **Polinomis ($\mathbb{R}_n[x]$)**: Un polinomi $ax^2 + bx + c$ es converteix en el vector $(a, b, c)$ si usem la base $\{x^2, x, 1\}$.
*   **Matrius ($\mathcal{M}_{2 \times 2}$)**: Una matriu $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ es converteix en el vector $(a, b, c, d)$ usant la base canònica de matrius.

---

## 2. La matriu associada

Treballar amb fórmules tipus $f(x,y) = (2x+y, x-y)$ és cansat. Per sort, tota la informació d'una aplicació lineal es pot guardar en una **matriu**. Aquesta matriu actua com un "traductor".

::mafs{type="vis_matriu_associada"}

### Com es construeix la matriu $M_W^B(f)$?
La recepta és sempre la mateixa (i és la pregunta típica d'examen):

1.  **Agafa els vectors de la base de sortida** $B = \{\vec{b}_1, \dots, \vec{b}_n\}$.
2.  **Calcula la seva imatge** aplicant la fórmula: $f(\vec{b}_1), f(\vec{b}_2), \dots$
3.  **Expressa els resultats en coordenades** de la base d'arribada $W$.
4.  **Posa els resultats per columnes** a la matriu.

> **Imatges per columnes**. Si recordes aquesta frase, tens mig examen fet. Com veus a la visualització superior, moure els valors de la matriu és literalment moure cap a on apunten les imatges dels vectors base.

**L'equació fonamental:**
$$[f(\vec{v})]_W = M_W^B(f) \cdot [\vec{v}]_B$$
Això vol dir: si em dónes un vector en la base $B$ i el multiplico per la matriu, obtinc la seva imatge en la base $W$.

---

## 3. On van els vectors? Nucli i Imatge

Aquest és el concepte més important per resoldre problemes de dimensions i subespais.

::three{type="vis_kernel_imatge_3d"}

### El Nucli (Ker f)
Són els vectors de l'espai de sortida que "moren" en anar al zero.
*   **Definició**: $\text{Ker}(f) = \{ \vec{v} \in E : f(\vec{v}) = \vec{0} \}$
*   **Càlcul**: Has de resoldre el sistema homogeni $M \cdot \vec{x} = \vec{0}$.
*   **Interpretació**: Si el Nucli només té el vector zero ($\text{Ker} = \{\vec{0}\}$), l'aplicació no perd informació. Al laboratori 3D superior, el nucli és l'eix vermell: qualsevol vector que estigui sobre aquest eix es projecta al punt $(0,0,0)$.

### La Imatge (Im f)
És el subespai format per tots els vectors que "podem assolir" en l'espai d'arribada.
*   **Càlcul**: La Imatge està generada per les **columnes** de la matriu associada.
*   **Base de la Imatge**: Si escalones la matriu, les columnes on hi ha "pivots" (triades de la matriu original!) formen una base de la Imatge.
*   **Interpretació**: A la visualització, la imatge és el pla verd. No importa on moguis el vector blau, la seva imatge (vector verd) sempre estarà "atrapada" dins d'aquest pla.

### L'Antiimatge (Anar enrere)
L'antiimatge d'un vector $\vec{w}$, denotada com $f^{-1}(\vec{w})$, són tots els vectors $\vec{v}$ que en aplicar-los $f$ donen $\vec{w}$.

::mafs{type="vis_antiimatge_subespais"}

*   **Com es calcula?** Has de resoldre el sistema **no homogeni** $M \cdot \vec{x} = \vec{w}$.
*   **Resultat**: Pot ser un únic vector, un subespai sencer (si el sistema és compatible indeterminat) o buit (si és incompatible).

### Transformant Subespais (S)
Si tens un subespai $S$ definit pels seus generadors $S = \langle \vec{s}_1, \dots, \vec{s}_k \rangle$:
*   **Imatge de S**: $f(S) = \langle f(\vec{s}_1), \dots, f(\vec{s}_k) \rangle$. Només cal transformar els generadors.
*   **Antiimatge de S**: $f^{-1}(S)$ són els vectors que van a parar dins de $S$. Es calcula buscant quins $\vec{x}$ compleixen que $M \cdot \vec{x}$ és una combinació lineal de la base de $S$.

### El Teorema de la Dimensió (Rang-Nul·litat)
Aquesta fórmula t'ajudarà a verificar si els teus càlculs són coherents:
$$\dim(\text{Espai Sortida}) = \dim(\text{Ker } f) + \dim(\text{Im } f)$$
*Pista: La dimensió de la Imatge és el mateix que el **rang** de la matriu.*

---

## 4. Classificació: Com és la nostra aplicació?

Segons les dimensions del Nucli i la Imatge, classifiquem les aplicacions:

::mafs{type="vis_classificacio_aplicacions"}

*   **Injectiva (Monomorfisme)**: No hi ha dos vectors diferents que vagin al mateix lloc.
    *   Condició: $\text{Ker}(f) = \{\vec{0}\}$ (és a dir, $\dim \text{Ker} = 0$).
    *   Rang de la matriu = $\dim(\text{Espai Sortida})$.
*   **Sobrejectiva / Exhaustiva (Epimorfisme)**: L'aplicació "omple" tot l'espai d'arribada.
    *   Condició: $\text{Im}(f) = F$ (és a dir, $\dim \text{Im} = \dim F$).
    *   Rang de la matriu = $\dim(\text{Espai Arribada})$.
*   **Bijectiva (Isomorfisme)**: És injectiva i sobrejectiva a la vegada. És una relació 1 a 1 perfecta.
    *   Condició: La matriu és quadrada i el seu determinant és $\neq 0$.

> Si l'espai de sortida i el d'arribada tenen la **mateixa dimensió**, aleshores:
> Injectiva $\iff$ Sobrejectiva $\iff$ Bijectiva. Si en compleix una, les compleix totes automàticament!

### Cas Especial: Endomorfismes Nilpotents
Un endomorfisme és **nilpotent** si existeix un número $k$ tal que $f^k = \mathbf{0}$ (l'aplicació nul·la). 

::mafs{type="vis_endomorfisme_nilpotent"}

*   Això vol dir que si apliques la transformació vàries vegades seguides sobre qualsevol vector, acabes arribant sempre al zero (**vòrtex d'anihilació**).
*   La seva matriu associada té tots els valors propis iguals a zero.

---

## 5. Composició i Inversa

### Composició ($g \circ f$)
Si apliquem primer $f$ i després $g$, la matriu de la composició és el **producte** de les matrius.
$$M(g \circ f) = M(g) \cdot M(f)$$

::mafs{type="vis_composicio_aplicacions"}

> **L'ordre importa**: L'ordre de les matrius és l'invers a l'ordre de lectura. La que s'aplica primer ($f$) va a la dreta del producte!

### Inversa ($f^{-1}$)
Només existeix si $f$ és un isomorfisme (bijectiva). La matriu de l'aplicació inversa és la matriu inversa de l'original:
$$M(f^{-1}) = (M(f))^{-1}$$

::mafs{type="vis_inversa_aplicacio"}

---

## 6. Canvi de Base: La "Fórmula Sandvitx"

A vegades ens donen la matriu en les bases canòniques ($C$), però la volem en unes altres bases $B$ i $W$. La fórmula general que has de memoritzar és:
$$M_W^B(f) = P_{W \leftarrow C} \cdot M_C^C(f) \cdot P_{C \leftarrow B}$$

::mafs{type="vis_canvi_base_sandvitx"}

*   $P_{C \leftarrow B}$: Matriu de canvi de base (vectors de $B$ posats en columnes).
*   $P_{W \leftarrow C}$: És la **inversa** de la matriu que té els vectors de $W$ en columnes ($P_{C \leftarrow W}^{-1}$).

**Lògica visual**: Per anar de $B$ a $W$ a través de $f$, fem un "viatge" en tres etapes:
1.  Saltem de la base $B$ a la **canònica**.
2.  Apliquem la transformació $f$ usant la matriu fàcil (la de la canònica).
3.  Saltem de la canònica a la base de sortida **$W$**.
