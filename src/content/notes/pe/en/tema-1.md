---
title: "Topic 1: Probability theory"
description: "Sample space, operations with events, Kolmogorov's axioms, conditional probability, Bayes' formula, independence, probability trees, and contingency tables."
readTime: "12 min"
order: 1
draft: false
---

Probability theory provides the formal mathematical framework to quantify uncertainty and model experiments whose outcome cannot be predicted with absolute certainty.

## 1. Random experiment and definitions

### Deterministic vs. random phenomena
Within the scientific method and engineering, we distinguish two types of phenomena:

- **Deterministic phenomena**: Lead to exactly the same results when reproduced under the same known initial conditions.
  - *Example*: Touching fire burns our hand; or computing the result of the addition $2 + 2$ on a machine.
- **Random phenomena**: Exhibit intrinsic uncertainty about the outcome of the next trial of the experiment, even under identical starting conditions.
  - *Example*: Rolling a fair six-sided die; we cannot predict with certainty which number will come up.

### Sample space ($\Omega$)
The **sample space** ($\Omega$) is the set of **all possible outcomes** of a random experiment or trial:
$$
\Omega = \{\omega_1, \omega_2, \dots\}
$$

Examples:
- **Rolling a 6-sided die**: $\Omega = \{1, 2, 3, 4, 5, 6\}$.
- **Flipping two coins**: $\Omega = \{(\text{heads}, \text{heads}),\, (\text{heads}, \text{tails}),\, (\text{tails}, \text{heads}),\, (\text{tails}, \text{tails})\}$.
- **Discrete count (arrival processes, requests to a server)**: $\Omega = \{0, 1, 2, 3, \dots\}$.

### Events
An **event** is any subset of the sample space ($A \subseteq \Omega$):
- **Elementary event (outcome)**: Set formed by a single individual outcome $\{\omega_i\}$.
- **Certain event**: Coincides with the entire sample space $\Omega$. Always occurs ($P(\Omega) = 1$).
- **Impossible event**: Empty set $\emptyset$. Can never occur ($P(\emptyset) = 0$).

---

## 2. Event algebra and set operations

Since events are subsets of $\Omega$, all set theory operations apply directly to them. The result of any operation is another event.

| Operation | Notation | Probabilistic meaning | Venn diagram |
| :--- | :---: | :--- | :---: |
| **Union** | $A \cup B$ | $A$ occurs, $B$ occurs, or both occur ("at least one") | :vennviz{op="union"} |
| **Intersection** | $A \cap B$ | Both $A$ and $B$ occur simultaneously | :vennviz{op="intersection"} |
| **Complement** | $\neg A$ or $\overline{A}$ | Event $A$ does not occur | :vennviz{op="complement_a"} |
| **Difference** | $A \setminus B$ or $A - B$ | $A$ occurs but $B$ does **not** occur ($A \cap \neg B$) | :vennviz{op="diff_a_b"} |

:::vennviz
:::

Two sets or events $A$ and $B$ are **disjoint** or **mutually exclusive** if their intersection is empty:
$$
A \cap B = \emptyset
$$
This implies they cannot occur simultaneously in the same trial of the experiment (their circles in the Venn diagram do not overlap).

### De Morgan's laws
Allow transforming the negation of unions and intersections:
1. $\neg(A \cup B) = \neg A \cap \neg B$ ("Neither $A$ nor $B$")
2. $\neg(A \cap B) = \neg A \cup \neg B$ ("At least one of the two does not occur")

### Partition of the sample space
A finite family of events $\{A_1, A_2, \dots, A_n\}$ constitutes a **partition** of the sample space $\Omega$ if and only if it satisfies three essential conditions:

1. **Non-empty**: $A_i \neq \emptyset$ for all $i \in \{1, \dots, n\}$.
2. **Pairwise disjoint**: $A_i \cap A_j = \emptyset$ for all $i \neq j$.
3. **Exhaustive union**: $\bigcup_{i=1}^n A_i = \Omega$ (they cover the entire sample space).

In rolling a 6-sided die:
- $A_1 = \text{"roll an even number"} = \{2, 4, 6\}$
- $A_2 = \text{"roll an odd number"} = \{1, 3, 5\}$

Since $A_1 \cap A_2 = \emptyset$ and $A_1 \cup A_2 = \Omega$, the events $\{A_1, A_2\}$ form a partition of $\Omega$. Any two complementary sets $A$ and $\neg A$ always form a partition of the sample space.

---

## 3. Axioms of probability and derived properties

To quantify uncertainty, we define a function or mapping $P: \mathcal{P}(\Omega) \to \mathbb{R}$ that assigns each event $A$ a real number called **probability**. By definition, the probability measure must satisfy the following three axioms:

1. **Non-negativity and boundedness**:
   $$0 \le P(A) \le 1 \quad \forall A \subseteq \Omega$$
2. **Certainty of the sample space**:
   $$P(\Omega) = 1$$
3. **Additivity for disjoint events**: If $A_i \cap A_j = \emptyset$ for all $i \neq j$, then:
   $$P(A_1 \cup A_2 \cup \dots \cup A_n) = P(A_1) + P(A_2) + \dots + P(A_n)$$

From these axioms, the following fundamental properties are directly derived:

- **Probability of the complement event**:
  $$P(\neg A) = 1 - P(A)$$
- **Probability of the impossible event**:
  $$P(\emptyset) = 0$$
- **Monotonicity**: If an event is contained within another ($A \subseteq B$), its probability cannot exceed it:
  $$A \subseteq B \implies P(A) \le P(B)$$
- **Inclusion-exclusion principle (for 2 events)**:
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Inclusion-exclusion principle (for 3 events)**:
  $$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)$$

When a random experiment has a finite number of possible outcomes and all of them are **equiprobable** (equally likely to occur), the probability of an event $A$ is calculated as:
$$
P(A) = \frac{\text{favorable outcomes}}{\text{total outcomes}}
$$

---

## 4. Conditional probability

**Conditional probability** measures how the probability of an event changes when we have prior information about the occurrence of another event. We denote by $P(A \mid B)$ the probability of observing $A$ given that event $B$ has occurred (read as "probability of $A$ given $B$").

If $P(B) > 0$, conditional probability is defined as:
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}
$$

In practice, conditioning on $B$ means **reducing the universe of observable outcomes to the set $B$**. All outcomes outside $B$ become impossible, and the probabilities of subsets of $A$ are rescaled by dividing by the total weight of $B$. When evaluating $P(A \mid B)$, the two events play completely asymmetric roles: **$A$ is uncertain**, whereas **$B$ is known information or assumed to be true**.

In general:
$$P(A \mid B) \neq P(B \mid A) \neq P(A \cap B)$$

If we define $A = \text{"Smoking"}$ and $B = \text{"Having lung cancer"}$, the probability of being a smoker given a diagnosis of lung cancer is very high ($P(A \mid B) \approx 0.85$); in contrast, the probability of having lung cancer knowing that someone smokes is much lower ($P(B \mid A) \approx 0.10$). Confusing these two quantities is a classic fallacy.

The information provided by the occurrence of $B$ regarding $A$ can have three effects:
- **Favors** ($B$ increases the probability of $A$): $P(A \mid B) > P(A)$.
- **Disfavors** ($B$ decreases the probability of $A$): $P(A \mid B) < P(A)$.
- **Indifferent** ($B$ provides no information about $A$): $P(A \mid B) = P(A)$.

### Inequality reversal
When comparing the marginal sizes of two events $A$ and $B$:
$$
P(A) > P(B) \implies \frac{1}{P(A)} < \frac{1}{P(B)} \implies \frac{P(A \cap B)}{P(A)} < \frac{P(A \cap B)}{P(B)} \implies P(B \mid A) < P(A \mid B)
$$

Let $A = \text{"Being a university student"}$ and $B = \text{"Being a FIB student"}$.
Since there are far more university students than FIB students, we have $P(A) > P(B)$.
- If someone is a FIB student ($B$), it is certain that they are a university student: $P(A \mid B) = 1$.
- If we randomly pick any university student ($A$), the probability that they are specifically from the FIB is very low: $P(B \mid A) \approx 0.02$.
- The rule holds: $P(B \mid A) < P(A \mid B)$.

---

## 5. Bayes' theorem

From the definition of conditional probability, we can isolate the probability of the intersection (multiplication rule):
$$
P(A \cap B) = P(A \mid B) \cdot P(B)
$$

Since intersection is commutative ($A \cap B = B \cap A$):
$$
P(B \cap A) = P(B \mid A) \cdot P(A)
$$

Equating both expressions:
$$
P(B \mid A) \cdot P(A) = P(A \mid B) \cdot P(B)
$$

Isolating the inverse conditional probability yields **Bayes' formula for two events**:
$$
P(B \mid A) = \frac{P(A \mid B) \cdot P(B)}{P(A)}
$$

This fundamental relationship allows switching from the direct probability $P(A \mid B)$ to the inverse probability $P(B \mid A)$ (reversing the cause-effect relationship).

---

## 6. Event independence

Two events are **statistically independent** if the occurrence of one provides no information about the occurrence of the other and does not alter its probability.

### Formal definition
Two events $A$ and $B$ are independent if and only if the probability of their intersection equals the product of their marginal probabilities:
$$A \text{ and } B \text{ independent} \iff P(A \cap B) = P(A) \cdot P(B)$$

### Equivalent conditions
If $P(A) > 0$ and $P(B) > 0$, the following statements are completely equivalent:
1. $P(A \cap B) = P(A) \cdot P(B)$
2. $P(A \mid B) = P(A)$
3. $P(B \mid A) = P(B)$
4. $P(B \mid A) = P(B \mid \neg A) = P(B)$

If any of these equalities does not hold, the events are **dependent** ($P(B \mid A) \neq P(B)$).

It is a very common mistake to confuse mutually exclusive (disjoint) events with independent events:
- **Disjoint (mutually exclusive)**: $A \cap B = \emptyset \implies P(A \cap B) = 0$.
- **Independent**: Requires $P(A \cap B) = P(A) \cdot P(B)$.

Two disjoint events with strictly positive probabilities ($P(A) > 0$ and $P(B) > 0$) **can NEVER be independent!** If they are disjoint and we know $A$ has occurred, we have absolute certainty that $B$ cannot have occurred ($P(B \mid A) = 0 \neq P(B)$); therefore, the occurrence of $A$ provides the maximum possible information about $B$.

---

## 7. Representation tools: probability trees and contingency tables

To analyze compound problems and structure experimental data, two complementary graphical tools are commonly used.

### 7.1 Event and probability trees
A probability tree breaks an experiment down into sequential stages:
- **Level 1 (Root $\to$ first level)**: Contains the **marginal** probabilities of the initial events ($P(A)$ and $P(\neg A)$).
- **Level 2 (Inner branches)**: Contains **always conditional probabilities**, never joint probabilities.
- **Terminal leaves (product rule)**: The joint probability of the complete path from the root to a leaf is obtained by multiplying the probabilities of all branches along the path:
  $$P(A \cap B) = P(A) \cdot P(B \mid A)$$

:::probtreeviz
:::

- **If $A$ and $B$ are independent**: The second-level branches do not depend on the origin path; their values are simply $P(B)$ and $P(\neg B)$.
  $$P(A \cap B) = P(A) \cdot P(B)$$
- **If $A$ and $B$ are NOT independent**: The second-level branch probabilities are conditioned on the parent node: $P(B \mid A) \neq P(B \mid \neg A)$.

The sum of all terminal leaves of the tree is always equal to $1$:
$$\sum \text{Leaves} = P(A \cap B) + P(A \cap \neg B) + P(\neg A \cap B) + P(\neg A \cap \neg B) = 1$$

---

### 7.2 Contingency table ($2 \times 2$ probability table)
A contingency table crosses two binary events ($A$ and $B$):

| Event | $B$ | $\neg B$ | **Marginal ($A$)** |
| :---: | :---: | :---: | :---: |
| **$A$** | $P(A \cap B)$ | $P(A \cap \neg B)$ | **$P(A)$** |
| **$\neg A$** | $P(\neg A \cap B)$ | $P(\neg A \cap \neg B)$ | **$P(\neg A)$** |
| **Marginal ($B$)** | **$P(B)$** | **$P(\neg B)$** | **$1.00$** |

1. **Inner cells (4 cells)**: Contain the **joint** probabilities of both events ($P(A \cap B)$, etc.). The sum of the 4 inner cells equals $1$.
2. **Margins (last row and last column)**: Contain the **marginal** probabilities ($P(A), P(\neg A), P(B), P(\neg B)$), obtained by summing the corresponding rows or columns.
3. **Calculating conditional probabilities**: They are obtained by dividing the joint cell by the total of the conditioning margin:
   - Conditioned on row $A$:
     $$P(B \mid A) = \frac{P(A \cap B)}{P(A)}$$
   - Conditioned on column $B$:
     $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

To check whether $A$ and $B$ are independent using a contingency table, it is sufficient to verify whether **each inner cell is exactly equal to the product of its two margins**:
$$P(A \cap B) \stackrel{?}{=} P(A) \cdot P(B)$$
If equality holds for all cells, there is **statistical independence**. If even a single cell violates it, the events are **dependent**.
