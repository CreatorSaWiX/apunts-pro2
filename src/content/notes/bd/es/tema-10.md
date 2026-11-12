---
title: "Tema 10: NoSQL"
description: "Conceptos básicos de NoSQL: OLTP vs OLAP vs NoSQL, teorema CAP, modelo BASE vs ACID, los 4 tipos de BD NoSQL, comparativa con relacionales y tendencias actuales."
readTime: "4 min"
order: 13
draft: true
---

### ESTE TEMA NO ENTRA EN EL EXAMEN FINAL

**NoSQL** (*Not Only SQL*) agrupa sistemas de bases de datos no relacionales pensados para grandes volúmenes de datos distribuidos, alta velocidad de consulta y esquemas flexibles.

---

## 10.1. Contexto: OLTP, OLAP y NoSQL

| Tipo de BD | Datos y carga principal | Modelo habitual |
| :--- | :--- | :--- |
| **Operacionales (OLTP)** | Datos estructurados, operaciones diarias y transacciones concurrentes. | Modelo relacional (SQL). |
| **Decisionales (OLAP)** | Principalmente lecturas masivas para analizar y pronosticar (*Data Warehousing*). | Almacenamiento analítico / columnar. |
| **NoSQL** | Datos semiestructurados o no estructurados a gran escala (web, redes sociales). | Clave-valor, columnas, documentos, grafos. |

- **Se acaba el *"One size fits all"*:** no todos los problemas se resuelven mejor usando solo SGBD relacionales tradicionales; *"NoSQL"* quiere decir *Not Only SQL* (no *nunca SQL*).
- **Rasgos comunes de NoSQL:** grandes volúmenes de datos, replicación y distribución en miles de nodos, actualizaciones asíncronas, alta eficiencia en lectura y ausencia de esquema predefinido (*schema-less*).

---

## 10.2. Teorema CAP y modelo BASE (vs. ACID)

### Teorema CAP

En un sistema distribuido hay tres propiedades: **C** (*Consistency* — todos los nodos ven los mismos datos), **A** (*Availability* — toda petición recibe respuesta) y **P** (*Partition tolerance* — el sistema funciona pese a cortes de comunicación entre nodos).

- Cuando se produce una partición de red inevitable, **no se pueden garantizar `C` y `A` a la vez**: hay que elegir entre devolver error para proteger los datos (**CP**) o seguir atendiendo peticiones con riesgo de inconsistencia temporal (**AP**).
- Las BD NoSQL tradicionales priorizan la **disponibilidad (`AP`)** por encima de la consistencia inmediata.

### ACID vs. BASE

| Propiedad / Enfoque | **ACID** (Relacional) | **BASE** (NoSQL) |
| :--- | :--- | :--- |
| **Significado** | **A**tomicidad, **C**onsistencia, **I**solation (aislamiento), **D**efinitividad. | **B**asically **A**vailable, **S**oft state, **E**ventually consistent. |
| **Consistencia** | Fuerte e inmediata (transacciones seguras). | Débil / eventual (los cambios se propagan de forma asíncrona). |
| **Prioridad** | Integridad y fiabilidad de los datos. | Disponibilidad y rendimiento (acepta respuestas aproximadas, optimista). |

---

## 10.3. Los 4 modelos de bases de datos NoSQL

| Modelo | Estructura de datos | Características clave |
| :--- | :--- | :--- |
| **Key-Value Stores** | Parejas `<Key, Value>` planas. | Solo operaciones `get` / `set` / `delete` por clave; la aplicación interpreta el valor (a menudo JSON). |
| **Wide-Column Stores** | Tablas de **familias de columnas** (*Key-Value de 2 niveles*). | Cada fila puede tener columnas y formatos distintos sin esquema rígido. |
| **Document-Stores** | Parejas `<Key, Doc>` (JSON o XML). | Permite consultar e indexar por el **contenido interno** del documento; muchos añaden SQL extendido y ACID. |
| **Graph Databases** | **Nodos** y **aristas** con propiedades. | Ideal para información semiestructurada altamente conectada (redes sociales, rutas). |

---

## 10.4. Relacionales vs. NoSQL y tendencias

| Criterio | BD Relacionales (SGBDR) | BD NoSQL |
| :--- | :--- | :--- |
| **Esquema** | Predefinido (`CREATE TABLE` / `ALTER TABLE`). | Sin esquema fijo (*schema-less*). |
| **Lenguaje** | SQL estándar declarativo (*qué*, no *cómo*) con optimizador. | APIs o lenguajes propios de cada producto. |
| **Consistencia** | Fuerte (`ACID`, restricciones DDL y triggers). | Eventual (`BASE`), priorizando disponibilidad y escalabilidad horizontal. |

- **El coste de renunciar al modelo relacional:** sin compilador/optimizador SQL ni garantías ACID en el gestor, la lógica de acceso y la consistencia de datos recaen sobre el **código de la aplicación**.
- **Tendencias actuales:**
  - Proveedores NoSQL añadiendo **transacciones ACID** y **SQL** (o dialectos similares).
  - **Sistemas multi-modelo:** un mismo SGBD combina modelos (ej: PostgreSQL soporta el modelo relacional y documentos `JSON`).
  - **BD relacionales columnares:** almacenan por columnas en lugar de filas para acelerar consultas analíticas.
  - **Bases de datos vectoriales:** guardan *embeddings* (vectores numéricos generados por modelos de IA) para hacer búsquedas rápidas por **similitud semántica** (documentos, imágenes, recomendaciones).
