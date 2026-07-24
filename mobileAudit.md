# Auditoria UX/UI - Projecte Apunts PRO2 (Frontend Report)

**Objectiu:** Assolir nivell SOTD/SOTY a Awwwards. Cal prioritzar l'alineació (pixel-perfect), consistència de components (Design System) i solucions fluides lliures de bloquejos d'interacció.

---

## 🔴 Errors Globals de Sistema (Afecten a tota l'App)

*   **Z-Index i Safe Areas Inferiors [CRÍTIC]:** La Bottom Navigation Bar flota constantment sobre el contenidor principal (ex. main scroll view). Falta implementar un `padding-bottom` (idealment utilitzant variables com `env(safe-area-inset-bottom)` més l'alçada de la navbar) a les vistes per evitar que amagui contingut.
*   **Estat de la Bottom Navigation:** El component es renderitza de manera inconsistent. Passa de tenir labels a no tenir-ne, o desapareix deixant un Floating Action Button (FAB) despenjat. Cal unificar l'estat global de la navegació (si s'amaga amb scroll direccional, cal que ho faci arreu).
*   **Design Tokens i Variables de Color:** Hi ha una sobrecàrrega de colors accent (blau, verd, fúcsia, granat) sense jerarquia aparent. Cal repassar el fitxer de variables CSS/Theme per unificar la paleta de colors.
*   **Renderitzat de Gràfics (Anti-aliasing):** Els elements gràfics (ex. fletxes de connexió als diagrames) presenten línies pixelades. Cal revisar l'SVG o el Canvas per assegurar una correcta resolució en pantalles d'alta densitat (Retina).

---

## 📍 Ruta: `/` (Dashboard / Home)
*Context visual: Pantalla inicial amb la llista de temes. Es veu una targeta gran amb un "01" de fons, títol "Topic 1: Classes and object orientation" i un botó principal "Explore topic".*

*   **Header Redundant:** Els components/badges superiors "PRO2 (⚙)" i "PRO2 V1.9.3" competeixen visualment en jerarquia. S'hauria de simplificar la capçalera de l'app.
*   **Alineació de Targeta:** El títol de secció "APUNTS PRO2" requereix un repàs del `margin-bottom` per centrar-lo visualment respecte al grup de targetes inferior.
*   **Disseny de Botons (Padding Intern):** Els botons secundaris "Test" i "Solutions" tenen un espaiat intern (`padding`) insuficient en comparació amb l'estil geomètric més orgànic del botó principal "Explore topic".

---

## 📍 Ruta: `/tema/pro2-tema-1` (Teoria)
*Context visual: Pàgina de lectura teòrica amb el títol "Topic 1: Classes and object orientation", un botó flotant de PDF vermell, i explicacions amb píndoles de codi intercalades.*

*   **Jerarquia del Botó PDF:** El botó granat desentona greument amb el *color mode* de l'aplicació i trenca el `margin-right` de la capçalera de text.
*   **Contrast de Píndoles Inline (`<code>` o `<kbd>`):** Els fragments de codi (ex. `.hpp`, `.hh`) tenen un fons gris-blau amb molt poc contrast sobre el fons marí (fallada d'accessibilitat WCAG).
*   **Scroll Interceptat:** L'última línia de codi visible a la pantalla topa directament amb la barra de navegació, evidenciant l'error global de les Safe Areas.

---

## 📍 Ruta: `/tema/pro2-tema-1/editor` (IDE i Explorador d'Arxius)
*Context visual: Pantalla fosca amb pestanyes de fitxers (main.cpp, Punt.hpp, etc.), una àrea principal de codi il·luminat i un panell inferior desplegable anomenat "OBJECTES A MEMÒRIA".*

*   **Scroll Horitzontal Bloquejat [ALTA PRIORITAT]:** El component que conté les pestanyes de fitxers (arxius oberts) necessita `overflow-x: auto; white-space: nowrap;`. Actualment talla els fitxers i l'usuari no pot navegar cap a la dreta.
*   **Bug Visual Fora del DOM:** Hi ha un element de text flotant `` `Makefile` `` renderitzat per error a la part superior esquerra, possiblement per un `position: absolute` mal calculat o un tooltip mal desmuntat.
*   **Contrast de Tabs Inactives:** L'estat inactiu de les pestanyes (`color` i `opacity`) fa que el text sigui pràcticament invisible sobre el fons de la interfície.
*   **Àrea Clicable de l'Acordió:** El separador i la icona inferior "OBJECTES A MEMÒRIA" manquen de pes visual (grossor de línia, color) per indicar que és una àrea interactiva (botó).

---

## 📍 Ruta: `/tema/pro2-tema-1/editor?state=execution` (Terminal de Sortida)
*Context visual: Finestra superposada que diu "TERMINAL DE SORTIDA", conté un bloc intern informatiu ("Iniciem el programa...") i un reproductor amb botons de control a sota.*

*   **Inconsistència de `border-radius`:** S'estan niant múltiples capses amb diferents radis de vora (contenidor global vs. toast de text). Cal aplicar una escala de variables de vora més harmònica (ex. 16px pare, 8px fill).
*   **Alineament Flexbox del Reproductor:** El *thumb* verd (el punt de la barra de progrés) no està alineat correctament a l'eix vertical (Y) amb el track (la línia de la barra) ni amb el centre dels botons de `play`/`pause`.

---

## 📍 Ruta: `/tema/pro2-tema-1/estructures-dades` (Visualitzador Interactiu)
*Context visual: Interfície amb fons fosc que mostra una llista enllaçada (cercles units per fletxes) de nodes (10, 20, 30...). A sota hi ha controls numèrics i botons de `pop_front`, `pop_back`, etc.*

*   **Interacció Bloquejada [CRÍTIC]:** Els botons inferiors d'acció (`- pop_front`, `- pop_back`) queden amagats a la meitat inferior darrere de la Bottom Navigation, fent la pantalla inoperativa.
*   **Layout de Mètodes `std::list`:** El llistat de mètodes de la part superior (`push_back()`, etc.) utilitza un `display: flex` amb un `gap` irregular i `flex-wrap` mal gestionat, fent que l'espaiat entre ells sigui asimètric i descuidat.
*   **Cohesió Visual dels Inputs:** El camp gran de text ("45") i els botons rectangulats fúcsia/verds de sota trenquen radicalment amb l'estil arrodonit tipus "pill" vist a la vista Home.

---

## 📍 Ruta: `/` (Modal de Configuració / Bottom Sheet)
*Context visual: Un "bottom sheet" (menú inferior lliscant) que s'obre sobre la pantalla principal enfosquida. Conté opcions ràpides: configuració de "Subject" (PRO2, M1, M2), "Language" i "Links".*

*   **Inconsistència d'Estats Actius (Design Tokens):** El selector de "SUBJECT" utilitza un blau neó vibrant per a l'estat actiu (`PRO2`), mentre que el selector de "LANGUAGE" just a sota utilitza un gradient gris/blanc molt suau per a l'estat actiu (`EN`). Aquesta inconsistència trenca el sistema de disseny. Cal unificar l'estil dels *segmented controls* a tota l'app.
*   **Contrast de l'Indicador d'Arrossegament (Drag Handle):** La petita pastilla gris fosc a la part superior del modal gairebé no es veu contra el fons fons. Necessita un color més clar (ex. `rgba(255,255,255, 0.3)`) per indicar clarament que es pot lliscar cap avall.
*   **Contrast de Text Inactiu:** Els textos dels botons inactius (com "M1", "M2", "CA", "ES") són massa foscos. No superen les ràtios de contrast d'accessibilitat (WCAG) sobre el fons del contenidor.

---

## 📍 Ruta: `/settings` (Pestanya: General)
*Context visual: Pantalla de configuració principal. A dalt hi ha una navegació horitzontal (General, Shortcuts, Storage...). A sota, selecció d'idioma i gestor d'assignatures (Subjects).*

*   **Z-Index i Safe Areas [CRÍTIC]:** Novament, el final de la llista (el buscador i els tags "PRO2", "M1") està tallat brutalment per la Bottom Navigation Bar.
*   **Inconsistència del component "Language":** El selector d'idioma aquí té un disseny completament diferent del que hem vist al modal de la pantalla `/`. Aquí és un botó gran amb la icona d'una bola del món. S'ha de decidir un únic component per a la selecció d'idiomes i reutilitzar-lo.
*   **Input amb Badge "TAB":** Dins de l'input "Search and add subjects...", el botó o indicador "TAB" se sent desplaçat visualment. Si és un hint per a teclat, el contrast i l'espaiat intern de l'input requereixen ajustos per no semblar atapeït.

---

## 📍 Ruta: `/settings` (Pestanya: Shortcuts)
*Context visual: Llistat de targetes amb dreceres de teclat (Ex: "Search Subjects -> TAB", "Previous Topic -> LEFT").*

*   **Context d'Ús (Error de UX Conceptual):** Si el producte s'està auditant/renderitzant en un entorn mòbil (com suggereixen les captures i la UI), mostrar dreceres de teclat genera confusió. *Recomanació per a l'equip:* Implementar una detecció de dispositiu (`navigator.maxTouchPoints` o *media queries* de *pointer*) per amagar aquesta pestanya en mòbils, o bé moure-la a un apartat avançat.
*   **Safe Area Inferior:** Igual que a la pestanya General, l'última targeta de la llista topa i s'amaga darrere la navegació inferior.

---

## 📍 Ruta: `/settings` (Pestanya: Storage)
*Context visual: Gestió d'emmagatzematge offline. Es mostra una barra de progrés (7MB) i a sota una secció de gestió de PDFs amb un botó de descàrrega i un toggle (interruptor).*

*   **Alineació i Espaiat (Secció Inferior):** A la targeta inferior (on es veu parcialment darrere la nav bar), els elements `[PDFS]`, `[ Download ]` i el `Toggle` (interruptor d'encès/apagat) pateixen de mala alineació vertical. El *flex-center* o els marges no estan ben aplicats, i l'espai entre ells és erràtic.
*   **Barra de Progrés (Contrast):** La part "plena" de la barra de progrés té un color molt similar al fons fosc i a la part buida. S'hauria d'utilitzar l'accent de color (blau o verd de la marca) per donar pes visual a la dada (7MB).

---

## 📍 Ruta: `/settings` (Pestanya: AI Assistant)
*Context visual: Configuració del copilot (Identitat, Ànima i Memòria a Llarg Termini). Està dividit en diverses seccions amb camps de text, imatges i targetes amb blur.*

*   **Inputs de Text (Padding Intern):** Als camps "AI Name" i "Pronouns", els textos ("sahur", "he") no semblen estar perfectament centrats verticalment dins les seves capses. Cal revisar el `line-height` i el `padding` vertical de l'element `<input>`.
*   **Secció "Soul" (Llegibilitat sobre Blur):** El concepte de difuminar el text sota regles "MANAGED AUTONOMOUSLY..." és bo estèticament, però el text en majúscules blanques és massa petit, estret (`letter-spacing`) i aspre per llegir-se bé. El botó "Force Edit" podria tenir un toc (glow o vora) per fer-lo menys genèric i més atractiu.
*   **Secció "Long Term Memory" (Paddings):** El text de les targetes de memòria ("L'usuari és un creative developer...") està massa enganxat a les vores laterals de la targeta interior. S'ha d'augmentar el `padding` d'aquestes capses per respirar millor.
*   **Avatars:** La fotografia (peluix) utilitza un `border-radius` (squircle) que no sembla estar estandarditzat amb la resta de radis de la interfície. Idealment s'hauria d'emmascarar en un cercle perfecte o amb els mateixos píxels de radi que les targetes (`border-radius: 16px` o `24px`).

---

## 📍 Ruta: `/settings` (Pestanya: About)
*Context visual: Targetes informatives "Repository" (GitHub) i "Contributors" (Cor) amb icones de fons (watermark).*

*   **Acabat dels Watermarks (Icones de fons):** Les icones decoratives a la dreta (el gat de GitHub i el cor) estan tallades de forma molt seca (`overflow: hidden`). Per a un toc més "Premium Awwwards", aquestes icones de fons solen tenir un gradient d'opacitat (mask-image) perquè es difuminin subtilment cap a l'esquerra, en lloc de tallar-se bruscament.
*   **Safe Area Inferior:** (Repetició) La targeta de Contributors no es pot llegir completament a causa del menú de navegació flotant que la intercepta.

---

## 📍 Ruta: `/comunitat` (Hero i Capçalera)
*Context visual: Pantalla de benvinguda a la comunitat amb fons d'estrelles, text "Let's pass together the semester.", botó "Upload Resource" i inici d'una llista de targetes a la part inferior.*

*   **Alineació Mixta:** El text principal i el subtítol ("Share your resources...") estan alineats a l'esquerra, però el botó "+ Upload Resource" està centrat. En disseny editorial i web de nivell Awwwards, cal mantenir l'eix d'alineació (tot a l'esquerra o tot centrat) per a una lectura fluida.
*   **Accessibilitat (Contrast de Color):** El text "the semester." en blau neó sobre el fons ple d'estrelles blanques pateix pèrdua de llegibilitat (contrast reduït). Es necessita una capa de *dimming* (enfosquiment) o una ombra de text (text-shadow) molt suau per separar-ho del fons.
*   **Top Toggle Flotant:** El selector superior dret (Comunitat / Dibuix) està flotant sense cap ancoratge clar a un `header` o *App Bar*, donant la sensació d'estar "perdut" a l'espai.
*   **Z-Index i Safe Area [REPETICIÓ CRÍTICA]:** Les targetes de la part inferior comencen just darrere de la Bottom Navigation, tallant el contingut abans de fer scroll.

---

## 📍 Ruta: `/comunitat` (Grid de Recursos)
*Context visual: Usuari ha fet scroll cap avall. Es veu una graella de 2 columnes amb targetes (vídeos, PDFs, codi).*

*   **Z-Index del Toggle Superior [CRÍTIC]:** En fer scroll, les targetes de recursos passen per sota (o pitjor, el toggle flota per sobre) del selector superior (Comunitat / Dibuix). Aquest botó hauria de desaparèixer amb l'scroll (hide-on-scroll) o bé cal un `header` amb `backdrop-filter: blur` que protegeixi l'espai. Actualment col·lisiona amb el text "Basic hooks in...".
*   **Truncament de Text a Targetes:** El títol de les targetes de la dreta ("Basic hooks \n 'use...' in react:") es talla de manera antiestètica. L'interlineat (`line-height`) i el límit de línies (`line-clamp`) de les targetes s'han de revisar.
*   **Espaiat del Grid (Gap):** L'espai entre les columnes i files de targetes és molt reduït. Les targetes necessiten més marge (`gap` en CSS grid) per respirar, donant un aspecte menys atapeït i més prèmium.
*   **Jerarquia de Metadades:** A les targetes, el nom de l'usuari ("CreatorSaWiX") i les icones de likes/vistes estan molt enganxats a la vora inferior de la targeta. Falta `padding-bottom` dins de les targetes.

---

## 📍 Ruta: `/comunitat` (Canvas / Draw)
*Context visual: Usuari ha canviat al mode dibuix (paleta). Línies de neó sobre un fons de graella. A la part inferior hi ha una barra d'eines amb colors, goma i desfer.*

*   **Bloqueig Interactiu Total [FATAL ERROR]:** Aquesta és la topada d'interfície més greu. La barra d'eines específica del Canvas (eines de dibuix, colors, desfer) està **superposada gairebé al 100%** amb la Bottom Navigation principal de l'app. L'usuari no pot seleccionar colors amb precisió ni interactuar còmodament sense clicar el menú principal per error. 
    *   *Solució obligatòria:* Quan s'entra al mode Canvas, la navegació principal inferior (Home, Community, Calendar...) s'ha d'ocultar completament, deixant només les eines de dibuix i un botó de "Tancar/Enrere" a la part superior.