---
title: "Topic 1: Probability and RVs"
description: "Probability, Bayes, discrete and continuous random variables, indicators, and bivariate distributions."
readTime: "30 min"
order: 1
draft: false
---

Probability theory provides the formal mathematical framework for quantifying uncertainty and modeling experiments whose outcome cannot be predicted with absolute certainty.

## 1. Random Experiment and Definitions

### Deterministic vs. Random Phenomena
In the scientific method and engineering, we distinguish between two types of phenomena:

- **Deterministic phenomena**: Consistently produce the exact same outcome when reproduced under the same known initial conditions.
  - *Example*: Placing a hand over an open flame will cause a burn; or computing the result of $2 + 2$ on a machine.
- **Random phenomena**: Exhibit intrinsic uncertainty regarding the outcome of an upcoming trial of the experiment, even when maintaining identical starting conditions.
  - *Example*: Rolling a balanced six-sided die; we cannot predict with certainty which number will appear.

### Sample Space ($\Omega$)
The **sample space** ($\Omega$) is the set of **all possible outcomes** of a random experiment or experience:
$$
\Omega = \{\omega_1, \omega_2, \dots\}
$$

Examples:
- **Rolling a 6-sided die**: $\Omega = \{1, 2, 3, 4, 5, 6\}$.
- **Tossing two coins**: $\Omega = \{(\text{heads}, \text{heads}),\, (\text{heads}, \text{tails}),\, (\text{tails}, \text{heads}),\, (\text{tails}, \text{tails})\}$.
- **Discrete count (arrival processes, server requests)**: $\Omega = \{0, 1, 2, 3, \dots\}$.

### Events
An **event** is any subset of the sample space ($A \subseteq \Omega$):
- **Elementary event (outcome)**: A set containing a single individual outcome $\{\omega_i\}$.
- **Certain event**: Coincides with the entire sample space $\Omega$. It always occurs ($P(\Omega) = 1$).
- **Impossible event**: The empty set $\emptyset$. It can never occur ($P(\emptyset) = 0$).

---

## 2. Algebra of Events and Set Operations

Since events are subsets of $\Omega$, all standard set theory operations apply directly to them. The result of any operation is another event.

| Operation | Notation | Probabilistic Meaning | Venn Diagram |
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
This means they cannot occur simultaneously in the same trial of the experiment (their circles in the Venn diagram do not overlap).

### De Morgan's Laws
Allow transforming the negation of unions and intersections:
1. $\neg(A \cup B) = \neg A \cap \neg B$ ("Neither $A$ nor $B$")
2. $\neg(A \cap B) = \neg A \cup \neg B$ ("At least one of the two does not occur")

### Partition of the Sample Space
A finite family of events $\{A_1, A_2, \dots, A_n\}$ forms a **partition** of the sample space $\Omega$ if and only if it satisfies three essential conditions:

1. **Non-empty**: $A_i \neq \emptyset$ for all $i \in \{1, \dots, n\}$.
2. **Pairwise disjoint**: $A_i \cap A_j = \emptyset$ for all $i \neq j$.
3. **Exhaustive union**: $\bigcup_{i=1}^n A_i = \Omega$ (they cover the entire sample space).

When rolling a 6-sided die:
- $A_1 = \text{"roll an even number"} = \{2, 4, 6\}$
- $A_2 = \text{"roll an odd number"} = \{1, 3, 5\}$

Since $A_1 \cap A_2 = \emptyset$ and $A_1 \cup A_2 = \Omega$, the events $\{A_1, A_2\}$ form a partition of $\Omega$. Any event $A$ and its complement $\neg A$ always form a partition of the sample space.

---

## 3. Axioms of Probability and Derived Properties

To quantify uncertainty, we define a function or map $P: \mathcal{P}(\Omega) \to \mathbb{R}$ that assigns each event $A$ a real number called **probability**. By definition, the probability measure must satisfy Kolmogorov's three axioms:

1. **Non-negativity and boundedness**:
   $$0 \le P(A) \le 1 \quad \forall A \subseteq \Omega$$
2. **Certainty of the sample space**:
   $$P(\Omega) = 1$$
3. **Additivity for disjoint events**: If $A_i \cap A_j = \emptyset$ for all $i \neq j$, then:
   $$P(A_1 \cup A_2 \cup \dots \cup A_n) = P(A_1) + P(A_2) + \dots + P(A_n)$$

From these axioms, the following fundamental properties are directly derived:

- **Complement rule**:
  $$P(\neg A) = 1 - P(A)$$
- **Probability of the impossible event**:
  $$P(\emptyset) = 0$$
- **Monotonicity**: If one event is contained in another ($A \subseteq B$), its probability cannot exceed it:
  $$A \subseteq B \implies P(A) \le P(B)$$
- **Inclusion-Exclusion Principle (for 2 events)**:
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Inclusion-Exclusion Principle (for 3 events)**:
  $$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)$$

### Laplace's Rule (Equally Likely Outcomes)
When a random experiment has a finite number of possible outcomes and all of them are **equally likely** (having the exact same probability of occurring), the probability of an event $A$ is given by:
$$
P(A) = \frac{\text{favorable outcomes}}{\text{total outcomes}}
$$

---

## 4. Conditional Probability

**Conditional probability** measures how the probability of an event changes when prior information about the occurrence of another event is available. We denote $P(A \mid B)$ as the probability of observing $A$ given that event $B$ has occurred (read as "probability of $A$ given $B$" or "probability of $A$ conditioned on $B$").

If $P(B) > 0$, conditional probability is defined as:
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}
$$

In practice, conditioning on $B$ means **restricting the universe of observable outcomes to set $B$**. All outcomes outside $B$ become impossible, and the probabilities of subsets of $A$ are rescaled by dividing by the total weight of $B$. When evaluating $P(A \mid B)$, the two events play completely asymmetrical roles: **$A$ is uncertain**, while **$B$ is given or assumed to be true**.

In general:
$$P(A \mid B) \neq P(B \mid A) \neq P(A \cap B)$$

If we define $A = \text{"Smoker"}$ and $B = \text{"Diagnosed with lung cancer"}$, the probability of being a smoker given a lung cancer diagnosis is very high ($P(A \mid B) \approx 0.85$); conversely, the probability of developing lung cancer given that someone smokes is much lower ($P(B \mid A) \approx 0.10$). Confusing both quantities is a classical fallacy.

The information provided by the occurrence of $B$ regarding $A$ can have three effects:
- **Favors** ($B$ increases the probability of $A$): $P(A \mid B) > P(A)$.
- **Disfavors** ($B$ decreases the probability of $A$): $P(A \mid B) < P(A)$.
- **Independent / Indifferent** ($B$ provides no information about $A$): $P(A \mid B) = P(A)$.

### Inequality Inversion
When comparing the marginal sizes of two events $A$ and $B$:
$$
P(A) > P(B) \implies \frac{1}{P(A)} < \frac{1}{P(B)} \implies \frac{P(A \cap B)}{P(A)} < \frac{P(A \cap B)}{P(B)} \implies P(B \mid A) < P(A \mid B)
$$

Let $A = \text{"Being a university student"}$ and $B = \text{"Being a FIB student"}$.  
Because there are far more university students than FIB students, $P(A) > P(B)$.
- If someone is a FIB student ($B$), they are definitely a university student: $P(A \mid B) = 1$.
- If we pick a university student at random ($A$), the probability that they are from FIB is very low: $P(B \mid A) \approx 0.02$.
- The inversion rule holds: $P(B \mid A) < P(A \mid B)$.

---

## 5. Bayes' Theorem

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

Solving for the reverse conditional probability yields **Bayes' formula for two events**:
$$
P(B \mid A) = \frac{P(A \mid B) \cdot P(B)}{P(A)}
$$

This fundamental relationship allows switching from the direct probability $P(A \mid B)$ to the inverse probability $P(B \mid A)$ (reversing the relationship between cause and effect).

---

## 6. Independence of Events

Two events are **statistically independent** if the occurrence of one provides no information about the occurrence of the other and does not alter its probability of occurring.

### Formal Definition
Two events $A$ and $B$ are independent if and only if the probability of their intersection equals the product of their marginal probabilities:
$$A \text{ and } B \text{ independent} \iff P(A \cap B) = P(A) \cdot P(B)$$

### Equivalent Conditions
If $P(A) > 0$ and $P(B) > 0$, the following statements are completely equivalent:
1. $P(A \cap B) = P(A) \cdot P(B)$
2. $P(A \mid B) = P(A)$
3. $P(B \mid A) = P(B)$
4. $P(B \mid A) = P(B \mid \neg A) = P(B)$

If any of these equalities fails to hold, the events are **dependent** ($P(B \mid A) \neq P(B)$).

- **Independent example**: Tossing a coin twice; obtaining heads on the 1st toss ($C_1$) does not change the probability of obtaining heads on the 2nd ($C_2$): $P(C_2 \mid C_1) = P(C_2) = \frac{1}{2} \implies P(C_1 \cap C_2) = \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$.
- **Dependent example**: Drawing cards from a deck **without replacement**. The composition of the deck for the 2nd draw depends on which card was drawn first.

A very common mistake is confusing disjoint events with independent events:
- **Disjoint (mutually exclusive)**: $A \cap B = \emptyset \implies P(A \cap B) = 0$.
- **Independent**: Requires $P(A \cap B) = P(A) \cdot P(B) > 0$.

Two disjoint events with strictly positive probabilities ($P(A) > 0$ and $P(B) > 0$) **can NEVER be independent!** If they are disjoint and we know $A$ occurred, we have absolute certainty that $B$ could not have occurred ($P(B \mid A) = 0 \neq P(B)$); thus, the occurrence of $A$ provides the maximum possible information about $B$.

---

## 7. Representation Tools: Probability Trees and Contingency Tables

To analyze compound experiments and structure problem data, two complementary graphical tools are routinely employed.

### 7.1 Probability Trees
A probability tree breaks down an experiment into sequential stages:
- **Level 1 (Root $\to$ first level)**: Contains the **marginal** probabilities of the initial events ($P(A)$ and $P(\neg A)$).
- **Level 2 (Interior branches)**: **Always contains conditional probabilities**, never joint probabilities.
- **Terminal leaves (multiplication rule)**: The joint probability of the full path from the root to a leaf is obtained by multiplying the probabilities of all branches along the path:
  $$P(A \cap B) = P(A) \cdot P(B \mid A)$$

:::probtreeviz
:::

- **If $A$ and $B$ are independent**: The branches of the second level do not depend on the parent path; they simply equal $P(B)$ and $P(\neg B)$:
  $$P(A \cap B) = P(A) \cdot P(B)$$
- **If $A$ and $B$ are NOT independent**: The probabilities on the second level branches are conditioned on the parent node: $P(B \mid A) \neq P(B \mid \neg A)$.

The sum of all terminal leaves of the tree is always equal to $1$:
$$\sum \text{Leaves} = P(A \cap B) + P(A \cap \neg B) + P(\neg A \cap B) + P(\neg A \cap \neg B) = 1$$

---

### 7.2 Contingency Table ($2 \times 2$ Probability Table)
A contingency table crosses two binary events ($A$ and $B$):

| Event | $B$ | $\neg B$ | **Marginal ($A$)** |
| :---: | :---: | :---: | :---: |
| **$A$** | $P(A \cap B)$ | $P(A \cap \neg B)$ | **$P(A)$** |
| **$\neg A$** | $P(\neg A \cap B)$ | $P(\neg A \cap \neg B)$ | **$P(\neg A)$** |
| **Marginal ($B$)** | **$P(B)$** | **$P(\neg B)$** | **$1.00$** |

1. **Interior cells (4 cells)**: Contain the **joint** probabilities of both events ($P(A \cap B)$, etc.). The sum of the 4 interior cells equals $1$.
2. **Margins (last row and last column)**: Contain the **marginal** probabilities ($P(A), P(\neg A), P(B), P(\neg B)$), obtained by summing across rows or columns via the Law of Total Probability.
3. **Computing conditional probabilities**: Obtained by dividing the joint cell by the total of the conditioning margin:
   - Conditioned on row $A$:
     $$P(B \mid A) = \frac{P(A \cap B)}{P(A)}$$
   - Conditioned on column $B$:
     $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

To check whether $A$ and $B$ are independent using a contingency table, simply verify whether **every interior cell exactly equals the product of its two margins**:
$$P(A \cap B) \stackrel{?}{=} P(A) \cdot P(B)$$
If equality holds for all cells, there is **statistical independence**. If even a single cell fails, the events are **dependent**.

---

## 8. Random Variables

### 8.1 Conceptual Motivation: From Sets to the Real Line

Previously, probability was defined over subsets of the sample space ($A \subseteq \Omega$). However, with sets we can only perform set-theoretic operations (unions $A \cup B$, intersections $A \cap B$, complements $\overline{A}$). **Sets cannot be added, subtracted, multiplied, differentiated, or integrated**.

By defining a **random variable** as a function $X: \Omega \to \mathbb{R}$, we assign each elementary outcome $\omega \in \Omega$ a real numerical value $X(\omega)$. Introducing this numerical mapping transitions us from an abstract domain to the real line: we can now leverage the full power of algebra, inequalities, limits, derivatives, and integrals.

Based on the nature of the values $X$ can take, we distinguish two primary types:
- **Discrete Random Variable (DRV)**: The set of possible values is finite or countable (examples: outcome of a die $\{1, 2, 3, 4, 5, 6\}$, number of requests arriving at a server $\{0, 1, 2, \dots\}$). Computed using **ordinary summations** ($\sum$).
- **Continuous Random Variable (CRV)**: Takes values on an uncountable continuum of the real line (examples: execution time of an algorithm, memory consumed, queue waiting time, temperature). Here we cannot list values one by one; we must make the conceptual leap to **integrals** ($\int$).

---

### 8.2 Discrete Random Variables (DRV)

Let $X$ be a discrete random variable taking values in the set $\{x_1, x_2, \dots\}$. We define:

**Probability Mass Function ($p_X(k)$)**  
Directly assigns the exact probability to each individual possible value $k$:
$$
p_X(k) = P(X = k)
$$

It must satisfy two fundamental conditions:
1. $0 \le p_X(k) \le 1$ for all $k$.
2. The total sum of all probabilities must equal exactly 1:
   $$\sum_k p_X(k) = 1$$

It is represented graphically using a **stick plot (or bar chart)**: each stick located above value $k$ has a height equal to $p_X(k)$. **It is a pure height, not an area**.

**Cumulative Distribution Function ($F_X(x)$)**  
Measures the cumulative probability of all values less than or equal to a point $x$:
$$
F_X(x) = P(X \le x) = \sum_{k \le x} p_X(k)
$$

Properties of $F_X(x)$ for DRVs:
- It is a **piecewise constant, monotonically non-decreasing step function**, with vertical jumps at each possible value $k$.
- The size of the vertical jump at each value $k$ is precisely the point probability of that value:
  $$\Delta F = p_X(k) = F_X(k) - F_X(k^-)$$
- Asymptotic limits: $\lim_{x \to -\infty} F_X(x) = 0$ and $\lim_{x \to +\infty} F_X(x) = 1$.

For discrete variables, strict inequalities exclude values from the sum:
$$P(a < X \le b) = \sum_{k=a+1}^b p_X(k) \quad \neq \quad P(a \le X \le b) = \sum_{k=a}^b p_X(k)$$

*Example*: For a fair 6-sided die ($p_X(k) = 1/6$):
- $P(2 < X \le 5) = P(X \in \{3, 4, 5\}) = \frac{3}{6} = 0.50$
- $P(2 \le X \le 5) = P(X \in \{2, 3, 4, 5\}) = \frac{4}{6} \approx 0.67$

---

### 8.3 Continuous Random Variables (CRV)

Let $X$ be a continuous random variable taking values in an interval or region of the real line ($X(\Omega) \subseteq \mathbb{R}$).

**Probability Density Function ($f_X(x)$)**  
Describes how probability mass is distributed over the real line. For a function to be a valid probability density function, it must satisfy **two mandatory conditions**:
1. **Non-negativity**: $f_X(x) \ge 0 \quad \forall x \in \mathbb{R}$ (negative density is meaningless).
2. **Total area under the curve equals 1**:
   $$\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$$

Unlike discrete variables, probability in a continuous variable is **always the AREA under the density curve**:
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx
$$

Infinitesimal interpretation: Each Riemann rectangle has an infinitesimal base $dx$ and height $f_X(x)$, so the infinitesimal probability of an elementary strip is:
$$d\text{Area} = f_X(x)\,dx$$

**Cumulative Distribution Function ($F_X(x)$) and Barrow's Rule**  
In practice, we do not evaluate definite integrals directly via Riemann sums; we use the antiderivative via the **cumulative distribution function**:
$$
F_X(x) = P(X \le x) = \int_{-\infty}^x f_X(t)\,dt
$$

By the Fundamental Theorem of Calculus (FTC), the derivative of the cumulative distribution function is the density function:
$$
f_X(x) = \frac{d F_X(x)}{dx} = F_X'(x)
$$
*(The slope of the cumulative curve $F_X(x)$ at any point is the density $f_X(x)$).*

Therefore, calculating the probability of any interval for a CRV is as simple as applying **Barrow's Rule**, evaluating the distribution function at the endpoints:
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx = F_X(b) - F_X(a)
$$

1. **Evaluating $f_X(x)$ is NOT a probability**: $f_X(x)$ represents density (height of the curve) and can easily exceed 1 (for instance, a uniform distribution on $[0, 0.2]$ has height $f_X(x) = 5$). For CRVs, probability is always an area (integrals $\int$ or differences of the distribution $F_X(b) - F_X(a)$). Evaluating $f_X(k)$ never yields $P(X = k)$.
2. **The probability of an exact point is always ZERO ($P(X = k) = 0$)**: The integral over a degenerate interval of zero width encloses no area:
   $$P(X = k) = \int_k^k f_X(x)\,dx = 0$$
3. **Strict and non-strict inequalities are completely EQUIVALENT**: Because the probability of each isolated point is zero, including or excluding the endpoints does not alter the area:
   $$P(a \le X \le b) = P(a < X \le b) = P(a \le X < b) = P(a < X < b) = F_X(b) - F_X(a)$$

---

### 8.4 Comprehensive Comparison: DRV vs. CRV

| Concept | Discrete Variable (DRV) | Continuous Variable (CRV) |
| :--- | :--- | :--- |
| **Possible values** | Finite or countable (isolated points: $\{1, 2, 3, \dots\}$) | Continuous / Uncountable (intervals of $\mathbb{R}$) |
| **Computational tool** | Ordinary summations ($\sum$) | Integrals / Infinitesimal calculus ($\int$) |
| **Descriptive function** | **Probability Mass Function** $p_X(k) = P(X = k)$ | **Probability Density Function** $f_X(x)$ (height of curve) |
| **Normalization** | $\sum_k p_X(k) = 1$ | $\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$ (Total area $= 1$) |
| **Point probability** | $P(X = k) = p_X(k) \in [0, 1]$ | $\mathbf{P(X = k) = 0}$ (area of a point $= 0$) |
| **Inequalities** | **Endpoints matter:** $P(X \le k) \neq P(X < k)$ | **Endpoints do not change:** $P(X \le x) = P(X < x)$ |
| **Distribution function** | $F_X(x) = \sum_{k \le x} p_X(k)$ *(piecewise step function)* | $F_X(x) = \int_{-\infty}^x f_X(t)\,dt$ *(smooth continuous curve)* |
| **Interval probability** | $P(a \le X \le b) = \sum_{k=a}^b p_X(k)$ | $P(a \le X \le b) = \int_a^b f_X(x)\,dx = F_X(b) - F_X(a)$ |
| **From distribution to base** | $p_X(k) = F_X(k) - F_X(k^-)$ *(jump size)* | $f_X(x) = \frac{d F_X(x)}{dx}$ *(derivative / slope)* |

---

### 8.5 Quantiles (The Inverse Problem)

Given a probability level $\alpha \in [0, 1]$, the **$\alpha$-quantile** of $X$ (denoted $x_\alpha$) is the threshold value that accumulates exactly a probability equal to $\alpha$:
$$
F_X(x_\alpha) = P(X \le x_\alpha) = \alpha \iff x_\alpha = F_X^{-1}(\alpha)
$$

> *"$x_\alpha$ is the threshold value such that the cumulative probability of the variable not exceeding it ($X \le x_\alpha$) is exactly $\alpha$, calculated by inverting the function $F_X^{-1}(\alpha)$"*

This is the **inverse problem** to calculating cumulative probabilities: instead of finding $p = F_X(x)$ given a value $x$, we fix the desired fraction $\alpha$ and find the threshold $x_\alpha$ by solving the equation $F_X(x) = \alpha$.

**Special cases:**
- **Median ($M = x_{0.50} = P_{50}$):** Divides the distribution into two equal halves ($50\%$).
- **Quartiles:** Divide the distribution into four equal parts:
  - First quartile: $Q_1 = x_{0.25}$
  - Second quartile (median): $Q_2 = M = x_{0.50}$
  - Third quartile: $Q_3 = x_{0.75}$
- **Percentiles:** Divide the distribution into one hundred parts ($P_k = x_{k/100}$, e.g., $P_{90} = x_{0.90}$).

---

### 8.6 Summary Measures for Random Variables

To numerically summarize a random variable without relying on its full functional distribution, we define indicators of **central tendency** (typical values) and **dispersion** (concentration around the mean).

**Probability (Theoretical Model / Population) vs. Statistics (Empirical Data / Sample)**

| Concept | Probability (Population / Theoretical Model) | Statistics (Empirical Sample) |
| :--- | :--- | :--- |
| **Scope** | Complete space $\Omega$ (census, ideal die). | Set of $n$ actual observations. |
| **Weights** | Exact theoretical probability: $p_i = P(X=x_i)$. | Observed relative frequency: $f_i = n_i / n$. |
| **Central tendency** | **Expectation:** $\mu_X = E(X)$ (fixed theoretical parameter). | **Sample mean:** $\overline{x} = \frac{1}{n}\sum x_i$ (fluctuates across samples). |
| **Dispersion** | **Variance:** $\sigma_X^2 = V(X)$ \quad and \quad Std. Dev. $\sigma_X$. | **Sample variance:** $s_x^2$ \quad and \quad Sample Std. Dev. $s_x$. |
| **Connection** | Theoretical model (from parameters $\mu,\sigma$ to probability). | **Inference:** estimating $\mu$ and $\sigma$ from sample data ($\overline{x}, s$). |

**Measure of Central Tendency: Expected Value ($\mu_X = E(X)$)**  
Condenses the distribution into a single weighted typical value:
$$
\mu_X = E(X) = \sum_{\forall k} k \cdot p_X(k) \quad \text{(DRV)} \qquad \int_{-\infty}^{+\infty} x \cdot f_X(x)\,dx \quad \text{(CRV)}
$$

Physically, it represents the **center of mass or balance point** of the probability weights (for example, for a fair 6-sided die, $E(X) = \frac{21}{6} = \mathbf{3.5}$).

**Insufficiency of the central value:** Completely distinct datasets (such as grades $\{5,5,5\}$, $\{4,5,6\}$, or $\{0,5,10\}$) share the exact same mean ($5$). A central value alone is never sufficient; it must always be accompanied by a measure of **dispersion**.

**Measures of Dispersion: Variance ($V(X)$ or $\sigma_X^2$) and Standard Deviation ($\sigma_X$)**  
Quantify the degree of spread or dispersion of values around the mean $\mu = E(X)$:
- **Variance ($V(X)$ or $\sigma_X^2$):** Measures dispersion in squared units (units$^2$, such as $\text{minutes}^2$ or $\text{euros}^2$).
- **Standard deviation ($\sigma_X = \sqrt{V(X)}$):** Square root of the variance; **recovers original units** (such as $\text{minutes}$ or $\text{euros}$), measuring spread on the actual scale.

**Operational Formula (Koenig-Steiner Relation):**
$$
\mathbf{V(X) = E(X^2) - [E(X)]^2} \qquad \text{and} \qquad \mathbf{\sigma_X = \sqrt{V(X)}}
$$

> *"Variance $V(X)$ is the mean of the squares $E(X^2)$ minus the square of the mean $[E(X)]^2$, and the standard deviation $\sigma_X$ is its square root to return to the original units"*

**Step-by-Step Calculation:**
1. **Step 1 (Expectation):** Compute $E(X) = \sum k\,p_X(k)$ \quad (or $\int x\,f_X(x)\,dx$).
2. **Step 2 (2nd Order Moment):** Compute $E(X^2) = \sum k^2\,p_X(k)$ \quad (or $\int x^2\,f_X(x)\,dx$).
3. **Step 3 (Variance and Std. Dev.):** Compute $V(X) = E(X^2) - [E(X)]^2$ \quad and \quad $\sigma_X = \sqrt{V(X)}$.

:::warning[Watch Out for Variance]
Variance **must always be $\ge 0$**. If you get a negative value, verify that you subtracted $[E(X)]^2$ and not $E(X)$!
:::

---

### 8.7 Properties of Expectation and Variance

Let $X$ and $Y$ be random variables, and $a, b \in \mathbb{R}$ constants:

| Operation | Expectation $E(\cdot)$ | Variance $V(\cdot)$ |
| :--- | :--- | :--- |
| **Shift ($+a$)** | $E(a + X) = a + E(X)$ | $V(a + X) = V(X)$ *(shifting data does not alter dispersion!)* |
| **Scaling ($\cdot b$)** | $E(bX) = b \cdot E(X)$ | $V(bX) = b^2 \cdot V(X)$ *(the factor comes out squared)* |
| **Linear transformation** | $E(a + bX) = a + b E(X)$ | $V(a + bX) = b^2 \cdot V(X)$ |
| **Sum of two variables** | $E(X + Y) = E(X) + E(Y)$ | $V(X + Y) = V(X) + V(Y) + 2\,\text{Cov}(X,Y)$ |
| **Difference of two variables** | $E(X - Y) = E(X) - E(Y)$ | $V(X - Y) = V(X) + V(Y) - 2\,\text{Cov}(X,Y)$ |
| **If $X, Y$ are INDEPENDENT** | $E(X \cdot Y) = E(X) \cdot E(Y)$ | $\mathbf{V(X \pm Y) = V(X) + V(Y)}$ (**Attention: ALWAYS with a $+$ sign!**) |

If we subtract two independent variables, the variance is $V(X - Y) = V(X) + V(Y)$. Subtracting independent random variables **accumulates uncertainty**; variances are never subtracted!

---

## 9. Pair of Random Variables (Bivariate Distribution)

When observing two discrete random variables $X$ and $Y$ simultaneously in the same random experiment (for instance: two dice or two system performance metrics), we analyze their joint behavior using a **two-way contingency table**:

1. **Joint Probability Mass Function ($p_{X,Y}(x,y)$):** Probability of each interior cell ($x$ and $y$):
   $$p(x,y) = P(X=x \cap Y=y)$$
   The sum of all interior cells in the table equals exactly:
   $$\sum_x \sum_y p(x,y) = 1$$

2. **Marginal distributions ($p_X(x), p_Y(y)$):** The individual distribution of each variable separately. They are computed by **summing across rows or columns** (at the *margins* of the table):
   $$p_X(x) = \sum_{\forall y} p_{X,Y}(x,y) \quad \text{(summing column } x\text{)}, \qquad p_Y(y) = \sum_{\forall x} p_{X,Y}(x,y) \quad \text{(summing row } y\text{)}$$

3. **Conditional probability function ($p_{X \mid Y}(x \mid y)$):** Restricting the analysis to a specific row or column:
   $$P(X=x \mid Y=y) = \frac{p_{X,Y}(x,y)}{p_Y(y)} = \frac{\text{cell probability }(x,y)}{\text{marginal total of row } y}$$

4. **Formal condition for independence:** $X$ and $Y$ are independent if and only if **all cells** equal the product of their two margins:
   $$p_{X,Y}(x,y) = p_X(x) \cdot p_Y(y) \quad \forall (x,y)$$
   *(Check: If a single cell fails $p(x,y) = p_X(x) \cdot p_Y(y)$, the variables **are NOT independent**).*

### Bivariate Indicators: Covariance ($\text{Cov}(X,Y)$ or $\sigma_{X,Y}$)
Measures the tendency of joint linear association between two variables $X$ and $Y$:

- **Theoretical definition:** Mean product of deviations with respect to their means:
  $$\text{Cov}(X,Y) = \sum_{\forall x}\sum_{\forall y} (x - E(X))(y - E(Y)) \cdot p_{X,Y}(x,y)$$
  > *"Sum of how $x$ and $y$ simultaneously deviate from their means $E(X)$ and $E(Y)$, weighted by the joint probability $p_{X,Y}(x,y)$"*

- **Practical computational formula:** Avoids subtracting means term by term:
  $$\mathbf{\text{Cov}(X,Y) = E(X \cdot Y) - E(X) \cdot E(Y)}$$
  > *"Covariance $\text{Cov}(X,Y)$ is the mean of the cross-product $E(X \cdot Y)$ minus the product of the individual means $E(X) \cdot E(Y)$"*

- **Quadrant interpretation:** Translating the origin to the center of mass $(E(X), E(Y))$, the product $(x-\mu_X)(y-\mu_Y)$ is positive in quadrants I and III (**direct** linear relationship) and negative in quadrants II and IV (**inverse** linear relationship).
- **The scale issue:** Covariance depends on the measurement units (for example: in meters it yields one value, while in millimeters it is multiplied by $1,000$). It does not allow comparing association strengths across different variables.

### Pearson Correlation Coefficient ($\rho_{X,Y}$ or $\rho$)
To eliminate unit dependency, we **standardize** covariance by dividing by the product of the standard deviations:
$$
\rho_{X,Y} = \frac{\text{Cov}(X,Y)}{\sigma_X \cdot \sigma_Y} \qquad \text{with} \quad \mathbf{-1 \le \rho_{X,Y} \le 1}
$$

- **Perfect linear relationship ($|\rho| = 1$):** Points lie exactly on a line $Y = a + bX$ (positive slope if $\rho = +1$, negative if $\rho = -1$).
- **Uncorrelatedness ($\rho = 0$):** No linear trend. If independent $\implies \text{Cov} = 0 \implies \mathbf{\rho = 0}$ (the converse does not always hold: symmetric curved relationships such as $Y = X^2$ can have $\rho = 0$ despite being strictly dependent).

**Algebraic Properties:**

| Property | Description |
| :--- | :--- |
| $\text{Cov}(X, X) = V(X), \quad \rho_{X,X} = 1$ | Variance as auto-covariance |
| $\text{Cov}(X, Y) = \text{Cov}(Y, X)$ | Symmetry |
| $\text{Cov}(aX + c, bY + d) = a \cdot b \cdot \text{Cov}(X,Y)$ | Invariance under shift and scaling |
| $E(X \cdot Y) = E(X) \cdot E(Y) + \text{Cov}(X,Y)$ | Expansion of expectation of the product |
| $V(X \pm Y) = V(X) + V(Y) \pm 2\,\text{Cov}(X,Y)$ | Variance of sum/difference (*if independent:* $V(X \pm Y) = V(X) + V(Y)$) |
