---
title: "Tema 7: Diseño Conceptual (UML)"
description: "Modelado conceptual en UML y traducción al modelo relacional lógico."
readTime: "8 min"
order: 7
draft: false
---

El diseño de bases de datos transforma los requisitos del mundo real en estructuras relacionales lógicas libres de anomalías.

---

## 6.1. Modelo Conceptual en UML

Una **clase** describe un conjunto de objetos del mismo tipo que comparten propiedades (ej: `Empleado`); cada objeto tiene identidad propia (OID). Los **atributos** son las propiedades univaluadas compartidas por los objetos. La **clave externa** (identificador) es el conjunto mínimo de atributos que identifican unívocamente cada instancia, especificada mediante restricciones textuales (ej: *«Clave externa Empleado: dni»*).

### Transformación previa: Atributos multivaluados `[*]`

El modelo relacional no admite valores multivaluados (primera forma normal). Todo atributo `atributo[*]` se transforma en una **asociación 1\:N** hacia una nueva clase:

:::umlviz{schema="uml_multivaluat" title="Transformación de Atributo Multivaluado a Nueva Clase (1:N)" height="260"}
:::

---

## 6.2. Transformación de Asociaciones Binarias

Una vez transformadas las clases a relaciones base (donde la clave externa de UML se convierte en la **clave primaria**), traducimos las asociaciones según sus multiplicidades:

### 1. Caso Uno a Muchos (1\:N)

La multiplicidad es $0..1$ o $1..1$ en un extremo ("uno") y $*$ en el otro ("muchos"). Se añade una **clave foránea (FK)** a la relación del extremo **«muchos»**, referenciando la clave primaria del extremo «uno». Si la multiplicidad mínima del extremo «uno» es **$1$ ($1..1$)**, la FK debe ser **`NOT NULL`**; si es **$0$ ($0..1$)**, admite valores nulos.

:::umlviz{schema="uml_1_n" title="Asociación 1:N (Departamento - Empleado)" height="220"}
:::

```sql
DEPARTAMENT (num_dpt, nom_dpt)
    PRIMARY KEY (num_dpt)

EMPLEAT (dni, nom, num_dpt)
    PRIMARY KEY (dni)
    FOREIGN KEY (num_dpt) REFERENCES DEPARTAMENT(num_dpt)
    num_dpt NOT NULL  -- ¡Obligatorio porque el mínimo al lado Departamento es 1!
```

---

### 2. Caso Uno a Uno (1\:1)

La multiplicidad máxima en ambos extremos es $1$ ($0..1$ o $1..1$). Se añade una clave foránea a **cualquiera de las dos tablas**, pero la columna FK debe tener la restricción **`UNIQUE`** para garantizar que ninguna fila del destino se enlace más de una vez. Si un lado tiene $1..1$ y el otro $0..1$, es preferible propagar la clave al lado $1..1$ con `NOT NULL UNIQUE` para evitar campos nulos.

:::umlviz{schema="uml_1_1" title="Asociación 1:1 (Delegación - Ciudad)" height="220"}
:::

```sql
CIUTAT (nom_ciutat, habitants)
    PRIMARY KEY (nom_ciutat)

DELEGACIO (codi_del, nom_del, nom_ciutat)
    PRIMARY KEY (codi_del)
    FOREIGN KEY (nom_ciutat) REFERENCES CIUTAT(nom_ciutat)
    UNIQUE (nom_ciutat)
```

---

### 3. Caso Muchos a Muchos (M\:N)

La multiplicidad máxima en ambos extremos es $*$ ($0..*$ o $1..*$). Se define una **nueva relación (tabla asociativa intermedia)** con la PK formada por la **composición de las claves primarias** de las dos entidades relacionadas.

:::umlviz{schema="uml_m_n" title="Asociación M:N (Producto - Almacén)" height="220"}
:::

```sql
PRODUCTE (codi_prod, descripcio)
    PRIMARY KEY (codi_prod)

MAGATZEM (codi_mag, ciutat)
    PRIMARY KEY (codi_mag)

EMMAGATZEMATGE (codi_prod, codi_mag)
    PRIMARY KEY (codi_prod, codi_mag)
    FOREIGN KEY (codi_prod) REFERENCES PRODUCTE(codi_prod)
    FOREIGN KEY (codi_mag) REFERENCES MAGATZEM(codi_mag)
```

---

## 6.3. Transformación de Asociaciones N-arias y Ternarias

Una asociación ternaria relaciona 3 clases simultáneamente. **Siempre se traduce a una nueva relación**, pero su clave primaria varía según las multiplicidades:

:::umlviz{schema="uml_ternaria" title="Asociación Ternaria con Rombo de Relación" height="340"}
:::

| Multiplicidades ($A - B - C$) | Composición de la Clave Primaria | Restricciones adicionales |
| :--- | :--- | :--- |
| **Muchos - Muchos - Muchos** ($* - * - *$) | $\text{PK} = (A, B, C)$ | Las tres forman la clave primaria. |
| **Muchos - Muchos - Uno** ($* - * - 0..1$) | $\text{PK} = (A, B)$ | La clave son los dos extremos «muchos». $C$ es atributo simple con `NOT NULL` (y FK a C). |
| **Muchos - Uno - Uno** ($* - 0..1 - 0..1$) | Dos claves candidatas: $(A, B)$ o $(A, C)$ | Una se elige como $\text{PK}$ y la otra se define como `UNIQUE NOT NULL`. |

---

## 6.4. Asociaciones Recursivas

Son asociaciones donde **una misma clase participa más de una vez** ejerciendo roles diferentes. En la variante **1\:N** (ej: Empleado es jefe de otros empleados) se añade una clave foránea a la misma tabla que referencia a la propia clave primaria, renombrando la columna por su rol:

:::umlviz{schema="uml_recursiva" title="Asociación Recursiva 1:N (Roles de Jefe y Subordinado)" height="240"}
:::

```sql
PERSONA (dni, nom, dni_mare)
    PRIMARY KEY (dni)
    FOREIGN KEY (dni_mare) REFERENCES PERSONA(dni)
```

En la variante **M\:N** (ej: Cuenta sigue a Cuenta) se crea una tabla intermedia con dos columnas de tipo FK que apuntan ambas a la tabla base:

```sql
SEGUIMENT (nom_seguidor, nom_seguit)
    PRIMARY KEY (nom_seguidor, nom_seguit)
    FOREIGN KEY (nom_seguidor) REFERENCES COMPTE(nom_usuari)
    FOREIGN KEY (nom_seguit) REFERENCES COMPTE(nom_usuari)
```

---

## 6.5. Clases Asociativas

Una **clase asociativa** surge cuando una asociación tiene atributos propios o participa en otras relaciones. La relación creada para la asociación **absorbe los atributos propios** de la clase asociativa:

:::umlviz{schema="uml_classe_associativa" title="Clase Asociativa (Almacenamiento)" height="310"}
:::

```sql
EMMAGATZEMATGE (codi_prod, codi_mag, quantitat)
    PRIMARY KEY (codi_prod, codi_mag)
    FOREIGN KEY (codi_prod) REFERENCES PRODUCTE(codi_prod)
    FOREIGN KEY (codi_mag) REFERENCES MAGATZEM(codi_mag)
```

---

## 6.6. Generalización y Especialización (Herencia)

La herencia refleja una superclase general (atributos comunes) que se especializa en una o más subclases (atributos específicos).

:::umlviz{schema="uml_herencia" title="Jerarquía de Herencia de Clases (UML)"}
:::

### Estrategia estándar: Una tabla por clase

1. **Tabla para la superclase:** Tiene su clave primaria original y los atributos comunes.
2. **Tabla para cada subclase:** Tiene como clave primaria **la misma clave de la superclase**, que actúa **a la vez como Clave Primaria y Clave Foránea**:

```sql
CREATE TABLE PERSONA (
    dni VARCHAR(10) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE EMPLEAT (
    dni VARCHAR(10) PRIMARY KEY,
    sou INTEGER NOT NULL,
    FOREIGN KEY (dni) REFERENCES PERSONA(dni)
);

CREATE TABLE ESTUDIANT (
    dni VARCHAR(10) PRIMARY KEY,
    centre VARCHAR(50) NOT NULL,
    FOREIGN KEY (dni) REFERENCES PERSONA(dni)
);
```

:::sqlviz{simulation="ddl_empleats"}
:::

---

## 6.7. Resumen de transformaciones y criterios de diseño

| Elemento del Modelo UML | Traducción al Modelo Relacional |
| :--- | :--- |
| **Clase de objetos** | Relación (tabla) con la clave externa como $\text{PK}$. |
| **Asociación binaria 1\:N** | Clave foránea ($\text{FK}$) en la tabla del lado "muchos" (`NOT NULL` si min=1). |
| **Asociación binaria 1\:1** | Clave foránea en cualquier lado con restricción `UNIQUE`. |
| **Asociación binaria M\:N** | Nueva tabla con $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Asociación n-aria** | Nueva tabla. Si es $*.*..*$, $\text{PK}$ contiene todas las claves; si hay lados $0..1$, la PK tiene $n-1$ claves. |
| **Clase asociativa** | La tabla de la asociación incluye los atributos de la clase asociativa. |
| **Herencia (super/subclases)** | Una tabla para la superclase y una para cada subclase con $\text{PK} = \text{FK}$ a la superclase. |

:::uml2relviz
:::

### Casos especiales de modelado

1. **Entidades débiles / Identificadores relativos**: Si una clase no tiene identificador global propio (ej: *«no pueden existir dos plantas con el mismo id en una misma escuela, pero sí en escuelas distintas»*), la clave primaria de `PLANTA` es compuesta: `PRIMARY KEY (nom_escola, id_planta)`.
2. **Clases temporales puras**: Clases como `Fecha`, `Hora` o `Año` que solo contienen un valor temporal y ningún otro atributo no generan tablas propias; se traducen directamente como columnas de tipo `DATE`, `TIME` o `INTEGER` en la tabla asociada.
3. **Clases asociativas con clave propia**: Si el enunciado asigna un identificador externo artificial a la clase asociativa (ej: `idMensaje`), este atributo se convierte en la clave primaria simple, manteniendo las claves de las clases relacionadas como claves foráneas individuales.
4. **Restricciones no capturadas con claves**: Multiplicidades con mínimo $>1$ o máximo fijado, condiciones de cobertura o disyunción en jerarquías, y reglas multitaula no se pueden definir en el DDL básico de tabla; requieren aserciones (`CREATE ASSERTION`) o disparadores (`TRIGGER`).

---

## 6.8. Validación Semántica de Modelos UML (Afirmaciones de Verdadero / Falso)

Ante afirmaciones sobre posibles estados de un modelo UML, hay que determinar si la situación es compatible con el esquema (**VERDADERA**) o si viola alguna restricción estructural (**FALSA**):

| Aspecto del Modelo UML | Cómo interpretarlo | Si es Falsa, ¿cómo se arregla? |
| :--- | :--- | :--- |
| **Multiplicidad máxima $1$** | El objeto solo puede relacionarse con un único elemento en ese rol. | Cambiar la multiplicidad máxima de $1$ a $*$. |
| **Multiplicidad mínima $1$** | El objeto debe existir obligatoriamente asociado a otro (FK `NOT NULL`). | Cambiar la multiplicidad mínima de $1$ a $0$. |
| **Clave externa global** | El atributo identifica unívocamente la instancia en toda la base de datos. | Hacer que la clave externa sea relativa (identificación débil). |
| **Clave externa relativa (Clase débil)** | Dos instancias en contextos distintos sí pueden repetir el mismo identificador local. | Hacer la clave externa global única para toda la clase. |
| **Estructuras cíclicas** | Una asociación reflexiva de ordenación con extremos abiertos prohíbe circuitos cerrados. | Modificar las multiplicidades de los roles o suprimir la restricción de orden acíclico. |

Para justificar que una afirmación es **VERDADERA**, se construye una instancia mínima de datos tabulares que cumpla todas las PK, FK y multiplicidades. Si es **FALSA**, se indica con exactitud qué extremo de asociación o restricción del diagrama hay que modificar para hacerla posible.

---

## 6.9. Clasificación y Traducción de Restricciones Textuales (R1..Rn)

Las restricciones textuales adicionales se implementan según su alcance:

1. **Identificadores alternativos:** `UNIQUE (nomUsuari)` en la tabla correspondiente.
2. **Restricciones de dominio o estado:** restricción de columna `CHECK (estat IN ('confirmada', 'cancel·lada'))`.
3. **Condiciones entre atributos de la misma fila (implicación $A \to B \equiv \neg A \lor B$):** restricción de tabla `CHECK (estat <> 'confirmada' OR dataRegistre IS NOT NULL)`.
4. **Condiciones que cruzan múltiples tablas:** no se pueden definir como restricciones de columna ni de tabla porque involucran a más de una tabla; requieren `CREATE ASSERTION` (o disparadores).

---

## 6.10. Caso Global de Referencia (UML y Relacional)

Ejemplo completo de una organización con departamentos, proyectos y empleados:

### Modelo Conceptual Global (UML)
:::umlviz{schema="uml_empresa" title="Modelo Conceptual UML de la Empresa de Referencia" height="420"}
:::

### Esquema Relacional Resultante (ERD)
:::sqlviz{simulation="esquema_empresa"}
:::
