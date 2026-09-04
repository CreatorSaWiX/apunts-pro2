---
title: "Topic 2: Sequences"
description: "Definitions and convergence criteria."
order: 2
readTime: "15 min"
subject: "m2"
---

## 1.1 Definition

Imagine an infinite list of ordered numbers. That is, literally, a sequence. Mathematically, we define it as a map where to each natural number ($1, 2, 3...$) we assign a real number. We usually use the letter $a$ and a subscript $n$: $(a_n) = a_1, a_2, a_3, \dots, a_n, \dots$

There are three main ways to define them, and we must know how to identify them:

- **List:** They give us the first numbers and we deduce the logic. Example: $2, 4, 6, 8, \dots$ (evens).
- **General term:** It's a "machine" where you put the $n$ (position) and it gives you the value. Example: $a_n = \frac{1}{n}$.
If $n = 1 \rightarrow a_1 = 1$
If $n = 10 \rightarrow a_{10} = 0.1$
- **Recurrence:** They give us the first term and a rule to find the next one based on the previous one. Example: $a_n = a_{n-1} + a_{n-2}$ (Fibonacci). We need the previous ones to calculate the new one.

## 1.2 Bounds

Before seeing where a sequence travels, we must know if it is "enclosed" or if it goes towards infinity.

**Upper bound:** If we can find a real number $k$ that is greater than or equal to all the terms of the sequence ($a_n \leq k$), we say it is an upper bound. Of all the possible upper bounds, the smallest is called the **supremum**.

**Lower bound:** In the same way, if a number $k$ always stays below the terms ($k \leq a_n$), it is a lower bound. The greatest of the lower bounds is called the **infimum**.

**Bounded sequence:** When a sequence has both an upper bound and a lower bound (it has a ceiling and a floor), we say it is bounded.

## 2.1 Limits of a sequence

If we continue the list infinitely, do we approach any concrete number? That is the **limit**:

*   **Convergent:** They get closer and closer to a finite number $l$. A very important theorem states that all convergent sequences are bounded. Example: $a_n = \frac{1}{n}$. The larger $n$ is, the closer to $0$ we are. We say the limit is $0$.

::mafs{type="successio_1_n"}

*   **Divergent:** They grow or decrease endlessly towards $\infty$. Example: $a_n = n^2 \rightarrow 1, 4, 9, 16\dots$ The limit is $+\infty$.
*   **Oscillating:** They neither stabilize nor go to infinity, they jump around. Example: $a_n = (-1)^n \rightarrow -1, 1, -1, 1\dots$ It has no limit.

::mafs{type="successio_oscilant"}

**The sandwich theorem:** This one is very useful. If we have a sequence $a_n$ that is always trapped between two others ($b_n \leq a_n \leq c_n$), and it turns out that both $b_n$ and $c_n$ have the same limit $l$, then $a_n$ will necessarily also tend to $l$.

> In the case of a number $a^n$, the geometric progression will depend on the base:
> *   If $\alpha > 1$: The term becomes infinitely large ($2^{10} = 1024$). Limit = $+\infty$.
> *   If $\alpha = 1$: We have $1^n$, which is always 1. Limit = $1$.
> *   If $-1 < \alpha < 1$: We are multiplying small fractions ($0.5^{10} = 0.0009$). Limit = $0$.
> *   If $\alpha \leq -1$: The sequence alternates signs (oscillates) and grows in absolute value or stays at $1$/$-1$. The limit does not exist.
> 
> If the variable is in the base and the exponent is constant like $n^\alpha$:
> *   If $\alpha > 0$: We have infinity raised to a positive number. Limit = $+\infty$.
> *   If $\alpha = 0$: Any number raised to $0$ is $1$. Limit = $1$.
> *   If $\alpha < 0$: The negative exponent inverts the base (it would be equivalent to $1/n^{|\alpha|}$). A number divided by infinity tends to zero. Limit = $0$.

## 2.2 Limit algebra and indeterminacies

When we add, multiply or divide sequences, their limits behave in a fairly predictable way if they are finite numbers. If $\lim a_n = a$ and $\lim b_n = b$, then the sum of the limits is $a \pm b$, and the product is $a \cdot b$.

But what happens if infinity comes into play?
*   Adding a number to infinity does not change it: $(+\infty) + l = +\infty$.
*   Multiplying infinities gives infinity: $(+\infty)(+\infty) = +\infty$.

However, there are "clashes of infinities" where the answer is not obvious called **indeterminacies**. We must be especially careful with these cases:

$$
\frac{\infty}{\infty} \quad \quad \frac{0}{0} \quad \quad \infty - \infty \quad \quad 1^\infty, 0^0, and\ \infty^0
$$

For polynomials: if we have $\frac{\infty}{\infty}$ formed by polynomials $\frac{P(n)}{Q(n)}$, let's look at the degrees.
If the degree of the numerator is greater, the limit is infinity. If that of the denominator is greater, the limit is 0. If they are equal, it is the division of their leading coefficients.

### A. Hierarchy of infinities

When we have a division of $\frac{\infty}{\infty}$, the one that grows fastest wins: $n! \gg a^n\ (a > 1) \gg n^p \gg \ln(n)$.

$$
\text{If we divide } \frac{\text{Fast}}{\text{Slow}} \rightarrow \infty. \quad \text{If we divide } \frac{\text{Slow}}{\text{Fast}} \rightarrow 0.
$$

*   **Factorial** ($n!$): The fastest of all.
*   **Exponential** ($a^n$): Very fast ($2^n$, $e^n$).
*   **Polynomial** ($n^3$, $n^{100}$): Fast, but loses against the previous ones.
*   **Logarithm** ($\ln(n)$): The slowest.

### B. The number e and $1^\infty$

A sequence is **increasing** if each term is greater than or equal to the previous one ($a_m \leq a_n$ when $m < n$). It is **decreasing** if the opposite happens. Sequences that are increasing or decreasing are generically called **monotonic**.

**By the monotone convergence theorem**, every monotonic and bounded sequence is necessarily convergent. The best example of this is the sequence $a_n = \left(1 + \frac{1}{n}\right)^n$.

It is strictly increasing and is trapped between $2$ and $3$. Since it grows but has a ceiling, it hits a limit. This limit is the very famous **Euler's number**, denoted by $e$ ($2.71828183$). This discovery is key to solving indeterminacies of the type $1^\infty$.

### C. Root and ratio tests

Finally, how do we calculate stranger limits if we don't have polynomials or simple sums? We have two great diagnostic tools:

1.  **Root test:** We calculate the limit of the n-th root of the absolute value of the term: $\lim_n \sqrt[n]{|a_n|} = L$.
    *   If $L < 1$, the original limit of $a_n$ is $0$.
    *   If $L > 1$, the sequence escapes to infinity ($\lim_n |a_n| = +\infty$).

2.  **Ratio test:** If we don't like roots, we can take a term and divide it by the previous one: $\lim_n \frac{|a_n|}{|a_{n-1}|} = L$. The results work exactly the same: if it yields less than 1 it converges to 0, and if it is greater than 1 it diverges.

The **root-ratio test** warns us that if the ratio test gives a result $L$, the root test will give exactly the same $L$. However, be careful: it could be the case that the limit of the root exists but the one of the ratio cannot be calculated.

### D. Sandwich theorem

Imagine a complicated sequence trapped between two easy ones. If the 'small' one and the 'large' one go to the same place, the middle one does too. This is vital for sums of roots like this:

$$
b_n = \frac{1}{\sqrt{n^2 + 1}} + \dots + \frac{1}{\sqrt{n^2 + n}}
$$

1.  We identify the smallest term $\frac{1}{\sqrt{n^2 + n}}$ and the largest $\frac{1}{\sqrt{n^2 + 1}}$.
2.  We bound by substituting all the summands with the small one and all with the large one: $n \cdot \frac{1}{\sqrt{n^2 + n}} \leq b_n \leq n \cdot \frac{1}{\sqrt{n^2 + 1}}$.
3.  Since the endpoints tend to $1$, then $\lim b_n = 1$.

> **Practical cases and representative examples**
>
>  When you encounter the division of roots or polynomials you must attend to the following cases: 
> If we have $\frac{6n^3 + 4n + 1}{2n}$, it is an indeterminacy $\frac{\infty}{\infty}$. Since the degree of the numerator is 3 and that of the denominator 1, the path towards infinity wins. The limit is $+\infty$.
> On the contrary, in $\frac{n^2 - 6n - 2}{3n^2 - 9n}$, the degrees are identical. Then the division is evaluated top coefficient against the denominator's, we have $\frac{1}{3}$.
> Or a number like $\sqrt[n]{n}$ gives $\infty^0$ and we usually know it is resolved as 1.
> For roots like $\left(\sqrt{\frac{n+1}{2n+1}}\right)^{\frac{2n-1}{3n-1}}$, we take the base which is coefficient in root $\sqrt{\frac{1}{2}}$ and exponent which is $\frac{2}{3}$. $\sqrt[3]{\frac{1}{2}}$ will be evaluated.
>  
> When there are massive summations a sandwich will be needed:
>  Analyzing $\frac{1}{\sqrt{n^2 + 1}} + \frac{1}{\sqrt{n^2 + 2}} + \dots + \frac{1}{\sqrt{n^2 + n}}$, we construct bounding at the root level:
>  Upper limit $n \cdot \frac{1}{\sqrt{n^2 + 1}}$ and Lower Limit $n \cdot \frac{1}{\sqrt{n^2 + n}}$. Since both end up in a way with degrees equal to $1$, the answer to the sequence trapped in the middle of the sandwich will be a $1$.
>
> It also applies the fast and slow that we have seen about the **hierarchies**: In $\lim_{n \rightarrow +\infty} \frac{a^n}{n!}$ being $a=10$, for large n the factorial of n crushes the exponential and makes it 0. Everything is determined under $\frac{\text{Slow}}{\text{Fast}} \rightarrow 0$.
>
> And regarding trigonometric functions, like in $\frac{\cos n}{n^2}$, due to the fact that $\cos$ will be comprised and bounded by values between -1 and 1, it ends up dividing by something huge like $n^2$, then it forcefully orients towards $0$. And for indeterminacy of exponentials $\frac{2^n + 3^n}{2^n - 3^n}$ we take the leader: By raising with the predominant element we will find fractions with powers of n that go to 0. Being the final resolution at $-1$. This would be the equivalent case like the constants $\left(\frac{n+2}{n-3}\right)^{\frac{2n-1}{5}}$ that you must apply Euler's rule as $e^{b_n \cdot (a_n - 1)}$ with a result of $e^2$.
> Subtraction of roots is solved as explained for the conjugate: $(\sqrt{n+1} - \sqrt{n})\sqrt{\frac{n+1}{2}}$, which as a method leads us to $\frac{\sqrt{2}}{4}$. And recurrent problems where it says ex. $a_{n+1} = ...$ ask to write the iteration of the limit under the relation found.
