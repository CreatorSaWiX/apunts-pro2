---
title: "Topic 6: Conceptual Design (UML)"
description: "Conceptual modeling in UML and mapping to the relational logical schema."
readTime: "8 min"
order: 6
draft: false
---

Database design transforms real-world requirements into normalized logical relational schemas free of anomalies.

---

## 6.1. Conceptual Modeling in UML

A **class** describes a collection of entities sharing structural properties (e.g., `Employee`); each object possesses an identity (OID). **Attributes** represent atomic single-valued properties. The **candidate/external key** (identifier) is the minimal set of attributes uniquely identifying each class instance, declared via explicit textual constraints (e.g., *«Candidate key Employee: dni»*).

### Upfront Normalization: Multivalued Attributes `[*]`

The relational model forbids multi-valued attributes (first normal form). Any `attribute[*]` must be factored into an **independent class associated via a 1\:N relationship**:

:::umlviz{schema="uml_multivaluat" title="Transforming Multivalued Attribute into New Class (1:N)" height="260"}
:::

---

## 6.2. Mapping Binary Associations

Once classes are mapped to base relations (where UML candidate keys become **primary keys**), associations map based on their multiplicities:

### 1. One-to-Many Associations (1\:N)

Multiplicity is $0..1$ or $1..1$ on one end ("one") and $*$ on the other ("many"). A **foreign key (FK)** is added to the relation on the **«many»** side, referencing the primary key of the «one» side. If minimum multiplicity on the «one» side is **$1$ ($1..1$)**, the FK must be declared **`NOT NULL`**; if **$0$ ($0..1$)**, it allows nulls.

:::umlviz{schema="uml_1_n" title="1:N Association (Department - Employee)" height="220"}
:::

```sql
DEPARTAMENT (num_dpt, nom_dpt)
    PRIMARY KEY (num_dpt)

EMPLEAT (dni, nom, num_dpt)
    PRIMARY KEY (dni)
    FOREIGN KEY (num_dpt) REFERENCES DEPARTAMENT(num_dpt)
    num_dpt NOT NULL  -- Mandatory because minimum cardinality on Department is 1!
```

---

### 2. One-to-One Associations (1\:1)

Maximum multiplicity on both ends is $1$ ($0..1$ or $1..1$). A foreign key is placed in **either relation**, but the FK column must carry a **`UNIQUE`** constraint to guarantee one-to-one mapping. If one side has $1..1$ and the other $0..1$, prefer propagating the foreign key to the $1..1$ entity with `NOT NULL UNIQUE` to prevent null values.

:::umlviz{schema="uml_1_1" title="1:1 Association (Branch - City)" height="220"}
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

### 3. Many-to-Many Associations (M\:N)

Maximum multiplicity on both ends is $*$ ($0..*$ or $1..*$). A **new junction relation (associative table)** is created whose PK consists of the **composite combination of both participating primary keys**.

:::umlviz{schema="uml_m_n" title="M:N Association (Product - Warehouse)" height="220"}
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

## 6.3. Mapping N-ary and Ternary Associations

A ternary association interrelates 3 classes simultaneously. **It always maps to a new junction relation**, with its primary key derived from participating multiplicities:

:::umlviz{schema="uml_ternaria" title="Ternary Association Diamond" height="340"}
:::

| Multiplicities ($A - B - C$) | Primary Key Definition | Structural Constraints |
| :--- | :--- | :--- |
| **Many - Many - Many** ($* - * - *$) | $\text{PK} = (A, B, C)$ | All 3 entity keys form the composite primary key. |
| **Many - Many - One** ($* - * - 0..1$) | $\text{PK} = (A, B)$ | Key is formed by the two «many» ends. $C$ is a foreign key attribute with `NOT NULL`. |
| **Many - One - One** ($* - 0..1 - 0..1$) | Two candidate keys: $(A, B)$ or $(A, C)$ | One is designated as $\text{PK}$, the other as `UNIQUE NOT NULL`. |

---

## 6.4. Recursive Associations

Associations where **a single class participates multiple times** in distinct roles. In the **1\:N** pattern (e.g., an Employee manages other Employees), a self-referencing foreign key column is added to the table, renamed to reflect the role:

:::umlviz{schema="uml_recursiva" title="1:N Recursive Association (Manager and Subordinate Roles)" height="240"}
:::

```sql
PERSONA (dni, nom, dni_mare)
    PRIMARY KEY (dni)
    FOREIGN KEY (dni_mare) REFERENCES PERSONA(dni)
```

In the **M\:N** pattern (e.g., Account follows Account), a junction table is formed containing two foreign keys referencing the base entity:

```sql
SEGUIMENT (nom_seguidor, nom_seguit)
    PRIMARY KEY (nom_seguidor, nom_seguit)
    FOREIGN KEY (nom_seguidor) REFERENCES COMPTE(nom_usuari)
    FOREIGN KEY (nom_seguit) REFERENCES COMPTE(nom_usuari)
```

---

## 6.5. Association Classes

An **association class** arises when an association holds attributes of its own or participates in further associations. The generated junction relation **absorbs all attributes** of the association class:

:::umlviz{schema="uml_classe_associativa" title="Association Class (Storage)" height="310"}
:::

```sql
EMMAGATZEMATGE (codi_prod, codi_mag, quantitat)
    PRIMARY KEY (codi_prod, codi_mag)
    FOREIGN KEY (codi_prod) REFERENCES PRODUCTE(codi_prod)
    FOREIGN KEY (codi_mag) REFERENCES MAGATZEM(codi_mag)
```

---

## 6.6. Generalization and Specialization (Inheritance)

Inheritance structures model a general superclass (common attributes) specialized into one or more subclasses (specific attributes).

:::umlviz{schema="uml_herencia" title="Class Inheritance Hierarchy (UML)"}
:::

### Standard Mapping Strategy: One Table per Class

1. **Table for Superclass:** Holds original primary key and common attributes.
2. **Table for Each Subclass:** Inherits the superclass primary key, serving **simultaneously as Primary Key and Foreign Key**:

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

## 6.7. Transformation Rules and Design Guidelines

| UML Conceptual Construct | Relational Logical Mapping |
| :--- | :--- |
| **Object Class** | Base table with candidate key as $\text{PK}$. |
| **1\:N Binary Association** | Foreign key ($\text{FK}$) on the «many» side (`NOT NULL` if min=1). |
| **1\:1 Binary Association** | Foreign key in either relation with `UNIQUE` constraint. |
| **M\:N Binary Association** | Dedicated junction table with $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **N-ary Association** | Dedicated junction table. If $*.*..*$, $\text{PK}$ contains all keys; with $0..1$ ends, PK has $n-1$ keys. |
| **Association Class** | Junction table absorbs all association class attributes. |
| **Inheritance Hierarchies** | One table per class with subclass $\text{PK} = \text{FK}$ pointing to superclass. |

:::uml2relviz
:::

### Special Modeling Scenarios

1. **Weak Entities / Relative Identifiers**: If an entity lacks a global unique key (e.g., *«floors share identical numbers across different schools, but are unique within a school»*), `PLANTA` takes a composite primary key: `PRIMARY KEY (school_name, floor_id)`.
2. **Pure Temporal Classes**: Auxiliary temporal classes such as `Date`, `Time`, or `Year` lacking extra attributes do not spawn separate tables; they map directly as `DATE`, `TIME`, or `INTEGER` columns.
3. **Association Classes with Artificial Keys**: If an explicit artificial identifier is assigned (e.g., `messageId`), it becomes the scalar primary key, with participating entity keys mapped as individual foreign keys.
4. **Unenforceable Constraints**: Minimum cardinality $>1$, fixed maximums, complete/disjoint inheritance covering, and cross-table assertions cannot be expressed via standard DDL keys; they require `CREATE ASSERTION` or triggers (`TRIGGER`).

---

## 6.8. Semantic Model Validation (True / False Assertions)

Evaluating potential instance states against a UML conceptual model requires determining whether a configuration is allowed (**TRUE**) or violates structural invariants (**FALSE**):

| UML Model Characteristic | Semantic Interpretation | If False, How to Remediate? |
| :--- | :--- | :--- |
| **Maximum Multiplicity $1$** | An instance can participate at most once in this role. | Increase maximum multiplicity from $1$ to $*$. |
| **Minimum Multiplicity $1$** | An instance must obligatorily link to another (FK `NOT NULL`). | Relax minimum multiplicity from $1$ to $0$. |
| **Global External Key** | The key uniquely identifies the instance system-wide. | Convert the key into a relative identifier (weak entity). |
| **Relative Key (Weak Class)** | Instances in different parent contexts can share identifiers. | Promote key to a global unique identifier. |
| **Acyclic Ordering** | Open reflexive ordering associations prohibit circular loops. | Adjust role multiplicities or drop the acyclic ordering constraint. |

To prove an assertion is **TRUE**, construct a minimal tabular instance verifying all PKs, FKs, and cardinalities. If **FALSE**, identify the exact diagram constraint requiring modification.

---

## 6.9. Classifying and Mapping Textual Constraints (R1..Rn)

Additional textual domain constraints map according to their scope:

1. **Alternate Identifiers:** `UNIQUE (username)` on the relation.
2. **Domain/State Restrictions:** column check `CHECK (status IN ('confirmed', 'cancelled'))`.
3. **Same-Tuple Logical Implication ($A \to B \equiv \neg A \lor B$):** table check `CHECK (status <> 'confirmed' OR registration_date IS NOT NULL)`.
4. **Cross-Table Invariants:** cannot be enforced via table checks; require `CREATE ASSERTION` or database triggers.

---

## 6.10. End-to-End Enterprise Reference Case (UML & Relational)

Comprehensive organization schema encompassing departments, projects, and employees:

### Conceptual UML Schema
:::umlviz{schema="uml_empresa" title="UML Conceptual Model of Reference Enterprise" height="420"}
:::

### Resulting Logical Relational ERD
:::sqlviz{simulation="esquema_empresa"}
:::
