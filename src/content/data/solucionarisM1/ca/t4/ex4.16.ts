import type { Solution } from '../../../solutions';

export const ex4_16: Solution = {
  id: 'M1-T4-Ex4.16',
  title: "Exercici 4.16: Seqüències de Prüfer",
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Trobeu les seqüències de Prüfer dels arbres següents:
- $T_1 = ([6], \\{12, 13, 14, 15, 56\\})$
- $T_2 = ([8], \\{12, 13, 14, 18, 25, 26, 27\\})$
- $T_3 = ([11], \\{12, 13, 24, 25, 36, 37, 48, 49, 5 \\: 10, 5 \\: 11\\})$`,
  content: `### 1) $T_1 = ([6], \\{1,2, 1,3, 1,4, 1,5, 5,6\\})$
1. Fulla més petita: **2**. Veí: **1**. Seq: $(1)$
2. Fulla més petita: **3**. Veí: **1**. Seq: $(1, 1)$
3. Fulla més petita: **4**. Veí: **1**. Seq: $(1, 1, 1)$
4. Fulla més petita: **1**. Veí: **5**. Seq: $(1, 1, 1, 5)$
5. Queden els vèrtexs 5 i 6. Final.

**Resultat**: $P(T_1) = (1, 1, 1, 5)$

::videoviz{url="/m1/prufer_PruferScene1.webm"}

---

### 2) $T_2 = ([8], \\{1,2, 1,3, 1,4, 1,8, 2,5, 2,6, 2,7\\})$
1. Fulla més petita: **3**. Veí: **1**. Seq: $(1)$
2. Fulla més petita: **4**. Veí: **1**. Seq: $(1, 1)$
3. Fulla més petita: **5**. Veí: **2**. Seq: $(1, 1, 2)$
4. Fulla més petita: **6**. Veí: **2**. Seq: $(1, 1, 2, 2)$
5. Fulla més petita: **7**. Veí: **2**. Seq: $(1, 1, 2, 2, 2)$
6. Fulla més petita: **2**. Veí: **1**. Seq: $(1, 1, 2, 2, 2, 1)$
7. Queden els vèrtexs 1 i 8. Final.

**Resultat**: $P(T_2) = (1, 1, 2, 2, 2, 1)$

::videoviz{url="/m1/prufer_PruferScene2.webm"}

---

### 3) $T_3 = ([11], \\{1,2, 1,3, 2,4, 2,5, 3,6, 3,7, 4,8, 4,9, 5,10, 5,11\\})$
1. Fulla més petita: **6**. Veí: **3**. Seq: $(3)$
2. Fulla més petita: **7**. Veí: **3**. Seq: $(3, 3)$
3. Fulla més petita: **3**. Veí: **1**. Seq: $(3, 3, 1)$
4. Fulla més petita: **1**. Veí: **2**. Seq: $(3, 3, 1, 2)$
5. Fulla més petita: **8**. Veí: **4**. Seq: $(3, 3, 1, 2, 4)$
6. Fulla més petita: **9**. Veí: **4**. Seq: $(3, 3, 1, 2, 4, 4)$
7. Fulla més petita: **4**. Veí: **2**. Seq: $(3, 3, 1, 2, 4, 4, 2)$
8. Fulla més petita: **2**. Veí: **5**. Seq: $(3, 3, 1, 2, 4, 4, 2, 5)$
9. Fulla més petita: **10**. Veí: **5**. Seq: $(3, 3, 1, 2, 4, 4, 2, 5, 5)$
10. Queden els vèrtexs 5 i 11. Final.

**Resultat**: $P(T_3) = (3, 3, 1, 2, 4, 4, 2, 5, 5)$

::videoviz{url="/m1/prufer_PruferScene3.webm"}
`,
  availableLanguages: ['ca']
};
