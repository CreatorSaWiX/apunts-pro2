import type { Solution } from '../../../solutions';

export const ex4_17: Solution = {
  id: 'M1-T4-Ex4.17',
  title: "Exercici 4.17: Reconstrucció d'arbres des de seqüències de Prüfer",
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els arbres que tenen les seqüències de Prüfer següents:
1) $(4,4,3,1,1)$
2) $(6,5,6,5,1)$
3) $(1,8,1,5,2,5)$
4) $(4,5,7,2,1,1,6,6,7)$`,
  content: `### 1) $(4,4,3,1,1) \\rightarrow n = 7$
- **Graus inicials**: $g(1)=3, g(2)=1, g(3)=2, g(4)=3, g(5)=1, g(6)=1, g(7)=1$
- **Tratament**:
  1. $P[1]=4 \\rightarrow$ fulla mín: **2**. Aresta: **(2,4)**. Graus: $g(4)=2, g(2)=0$
  2. $P[2]=4 \\rightarrow$ fulla mín: **5**. Aresta: **(5,4)**. Graus: $g(4)=1, g(5)=0$. Ara **4** és fulla.
  3. $P[3]=3 \\rightarrow$ fulla mín: **4**. Aresta: **(4,3)**. Graus: $g(3)=1, g(4)=0$. Ara **3** és fulla.
  4. $P[4]=1 \\rightarrow$ fulla mín: **3**. Aresta: **(3,1)**. Graus: $g(1)=2, g(3)=0$. Ara **1** és fulla... no, perdó, $g(1)$ era 3, ara és 2.
  5. $P[5]=1 \\rightarrow$ fulla mín: **6**. Aresta: **(6,1)**. Graus: $g(1)=1, g(6)=0$. Ara **1** és fulla.
- **Aresta final**: Queden **1** i **7**. Aresta: **(1,7)**.

**Arestes**: $\\{1,3, 1,6, 1,7, 2,4, 3,4, 4,5\\}$

::videoviz{url="/m1/prufer_InversePrufer1.webm"}

---

### 2) $(6,5,6,5,1) \\rightarrow n = 7$
- **Graus inicials**: $g(1)=2, g(2)=1, g(3)=1, g(4)=1, g(5)=3, g(6)=3, g(7)=1$
- **Tratament**:
  1. $P[1]=6 \\rightarrow$ fulla mín: **2**. Aresta: **(2,6)**. Graus: $g(6)=2, g(2)=0$
  2. $P[2]=5 \\rightarrow$ fulla mín: **3**. Aresta: **(3,5)**. Graus: $g(5)=2, g(3)=0$
  3. $P[3]=6 \\rightarrow$ fulla mín: **4**. Aresta: **(4,6)**. Graus: $g(6)=1, g(4)=0$. Ara **6** és fulla.
  4. $P[4]=5 \\rightarrow$ fulla mín: **6**. Aresta: **(6,5)**. Graus: $g(5)=1, g(6)=0$. Ara **5** és fulla.
  5. $P[5]=1 \\rightarrow$ fulla mín: **5**. Aresta: **(5,1)**. Graus: $g(1)=1, g(5)=0$. Ara **1** és fulla.
- **Aresta final**: Queden **1** i **7**. Aresta: **(1,7)**.

**Arestes**: $\\{1,5, 1,7, 2,6, 3,5, 4,6, 5,6\\}$

::videoviz{url="/m1/prufer_InversePrufer2.webm"}

---

### 3) $(1,8,1,5,2,5) \\rightarrow n = 8$
- **Graus inicials**: $g(1)=3, g(2)=2, g(3)=1, g(4)=1, g(5)=3, g(6)=1, g(7)=1, g(8)=2$
- **Tratament**:
  1. $P[1]=1 \\rightarrow$ fulla mín: **3**. Aresta: **(3,1)**. $g(1)=2, g(3)=0$
  2. $P[2]=8 \\rightarrow$ fulla mín: **4**. Aresta: **(4,8)**. $g(8)=1, g(4)=0$. Ara **8** és fulla.
  3. $P[3]=1 \\rightarrow$ fulla mín: **6**. Aresta: **(6,1)**. $g(1)=1, g(6)=0$. Ara **1** és fulla.
  4. $P[4]=5 \\rightarrow$ fulla mín: **1**. Aresta: **(1,5)**. $g(5)=2, g(1)=0$.
  5. $P[5]=2 \\rightarrow$ fulla mín: **7**. Aresta: **(7,2)**. $g(2)=1, g(7)=0$. Ara **2** és fulla.
  6. $P[6]=5 \\rightarrow$ fulla mín: **2**. Aresta: **(2,5)**. $g(5)=1, g(2)=0$. Ara **5** és fulla.
- **Aresta final**: Queden **5** i **8**. Aresta: **(5,8)**.

**Arestes**: $\\{1,3, 1,5, 1,6, 2,5, 2,7, 4,8, 5,8\\}$

::videoviz{url="/m1/prufer_InversePrufer3.webm"}

---

### 4) $(4,5,7,2,1,1,6,6,7) \\rightarrow n = 11$
- **Graus**: $g(1)=3, g(2)=2, g(3)=1, g(4)=2, g(5)=2, g(6)=3, g(7)=3, g(8)=1, g(9)=1, g(10)=1, g(11)=1$
- **Tratament**:
  1. $P[1]=4, min=3 \\rightarrow (3,4)$. $g(4)=1$
  2. $P[2]=5, min=4 \\rightarrow (4,5)$. $g(5)=1$
  3. $P[3]=7, min=5 \\rightarrow (5,7)$. $g(7)=2$
  4. $P[4]=2, min=8 \\rightarrow (8,2)$. $g(2)=1$
  5. $P[5]=1, min=2 \\rightarrow (2,1)$. $g(1)=2$
  6. $P[6]=1, min=9 \\rightarrow (9,1)$. $g(1)=1$
  7. $P[7]=6, min=1 \\rightarrow (1,6)$. $g(6)=2$
  8. $P[8]=6, min=10 \\rightarrow (10,6)$. $g(6)=1$
  9. $P[9]=7, min=6 \\rightarrow (6,7)$. $g(7)=1$
- **Aresta final**: Queden **7** i **11**. Aresta: **(7,11)**.

**Arestes**: $\\{1,2, 1,6, 1,9, 2,8, 3,4, 4,5, 5,7, 6,7, 6,10, 7,11\\}$

::videoviz{url="/m1/prufer_InversePrufer4.webm"}
`,
  availableLanguages: ['ca']
};
