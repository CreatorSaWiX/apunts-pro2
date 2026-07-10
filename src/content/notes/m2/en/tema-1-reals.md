---
title: "Topic 1: Real numbers"
description: "Absolute values, inequalities and complex numbers. Basic properties."
order: 1
readTime: "10 min"
subject: "m2"
---

## 1.1 Definition
First we had the **naturals** $\mathbb{N} = \{1, 2, 3, \dots\}$. Then the **integers** $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$. Now we have zero and the negatives. The **rationals** $\mathbb{Q}$ arrive, they are the fractions $a/b$.

It seems that we have filled the whole line. The Greeks discovered that there are holes. For example, the diagonal of a square with side 1 is $\sqrt{2}$, and this number cannot be written as a fraction. It is an **irrational**. The set of **real** numbers $\mathbb{R}$ is the union of **rationals** and **irrationals**.

We say that $\mathbb{R}$ is a **field** because it has two operations (addition and multiplication) that work very well.

| Property | Addition and Multiplication |
| --- | --- |
| **Associative** | $(a+b)+c = a+(b+c)$ |
| **Commutative** | $a+b = b+a$ |
| **Identity element** | $a+0 = a$ and $a \cdot 1 = a$ |
| **Inverse elements** | $a+(-a) = 0$ and $a \cdot a^{-1} = 1$ where $a \neq 0$ |

## 1.2 Order and intervals
In addition to adding and multiplying, the reals are ordered. Given two numbers, either they are equal, or one is smaller than the other. This is written $a < b$.

**Properties of inequalities:**
- If we **add** the same thing to both sides, the order is maintained: $a < b \implies a+c < b+c$.
- If we **multiply** by a **positive** number, the order is maintained.
- If we **multiply** by a **negative** number ($c < 0$), the inequality flips: $a < b \implies ac > bc$.

**Intervals** are the most famous subsets of the line.

- **Open $(a,b)$:** The endpoints are NOT there: $\{x \in \mathbb{R} \mid a < x < b\}$.
- **Closed $[a,b]$:** The endpoints ARE there: $\{x \in \mathbb{R} \mid a \leq x \leq b\}$.
- **Infinite:** $(a, +\infty)$ or $(-\infty, a]$. Infinity always goes with an open parenthesis because it is not a number.

## 1.3 Absolute value and distance
How do we measure the distance between two points? We don't care if we go from right to left or vice versa, the distance must be positive. We define the absolute value $|x|$:
$$
|x| = \begin{cases}
  x  & \text{if } x \geq 0 \\
  -x & \text{if } x < 0
\end{cases}
$$

- If $x$ is **positive** or zero, we leave it **the same**.
- If $x$ is **negative**, we **change its sign** to make it **positive**.

**Properties:**
- **Triangle inequality:** Going direct is always shorter or equal to making a stop: $|x+y| \leq |x| + |y|$
- **Neighborhoods:** $|x| < a$ is equivalent to saying that $x$ is trapped between $-a$ and $a$: $-a < x < a$.

## 1.4 Bounds: Supremum, infimum, maximum and minimum
Imagine a set $A$ within the real line:

- **Upper bound:** A number $k$ is an upper bound if it is greater than or equal to ALL the elements of the set. It's like a 'ceiling'. If it has one, the set is bounded above.
- **Lower bound:** A number $l$ is a lower bound if it is less than or equal to ALL the elements. It's like a 'floor'.

**Supremum ($\sup A$):** It is the **least of the upper bounds**. It is the 'ceiling' that fits the set tightest.
**Maximum ($\max A$):** It is a **supremum** that, in addition, belongs to the set $A$.

> If the interval is closed $[a, b]$: The maximum is $b$ and the supremum is $b$.
> If the interval is open $(a, b)$: The supremum is $b$, but it has no maximum.

**Example:** Consider the interval $A = [0, 2)$.
- **Bounded above:** Yes, 5 is a bound, 100 is a bound, 2 is a bound.
- **Supremum:** 2, because any number smaller than 2 would leave elements of $A$ outside.
- **Maximum:** There is none. Because 2 is not inside the interval (it's open). 1.9? No, because 1.99 is bigger. 1.99? No... We never reach the maximum.

The same applies for the **infimum** ($\inf A$) and the **minimum** ($\min A$) at the bottom part.

**Extreme value theorem:** In $\mathbb{R}$, every non-empty set that is bounded above always has a supremum. This property does not happen in the rationals (where there could be a hole right where the supremum would go).

## 1.5 Polynomials
Polynomials are functions formed by sums and products of $x$. The key property here is factorization. When we divide a polynomial $f(x)$ by $(x - a)$, the remainder is $f(a)$ (**Remainder theorem**).

This means that $a$ is a root (solution of $f(x) = 0$) if and only if the division is exact. In the reals, any polynomial can be decomposed into factors of degree 1 (type $x - a$) or degree 2.
