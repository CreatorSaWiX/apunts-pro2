---
title: "Lab 1: Struct to class"
description: "Solved laboratory session. Leap to object-oriented programming."
readTime: "8 min"
order: 1.5
---
<details>
<summary>Solution Explanation</summary>

## 1. The leap to the object-oriented paradigm

In PRO1, we defined a `struct` and then we made functions passing the tuple as a parameter `function(tuple)`. 

Now, it is about making these "functions" live **inside** the `struct` (methods), so that they have **direct access to the internal state**. We will change the syntax to `tuple.function()`, finally encapsulating the code using the protection given by `class`.

### How we programmed in PRO1 (data.cc)

```cpp [data.cc]
struct Data {
    int dia, mes, any;
};

Data data_suma_dies(const Data& d, int dies) {
    Data res = d;
    res.dia += dies;
    // ... 
    return res;
}

int main() {
    Data avui = data_actual();
    Data dema = data_suma_dies(avui, 1);
}
```

### How we will program in PRO2

Our `Data` has **its own responsibilities**. It only allows access to public variables and functions.


```cpp [main.cpp]
class Data {
private:
    int dia, mes, any; 
    
public:
    Data() { dia = 1; mes = 1; any = 2000; }
    
    Data suma_dies(int dies) const {
        Data resultat = *this;
        resultat.dia += dies; 
        return resultat;
    }
};

int main() {
    Data avui; 
    Data dema = avui.suma_dies(1);
}
```
</details>

### Solution 1: Conversion to class data.cc

:::oopviz{simulation="data_class"}
:::

<details>
<summary>Original file racional.cc</summary>

```cpp [racional.cc]
struct Racional {
	int num_, den_;
};

int mcd(int a, int b) {
	while (b != 0) {
		int aux = b;
		b = a % b;
		a = aux;
	}
	return a;
}

int signe(int n) {
	return n < 0 ? -1 : 1;
}

Racional racional_llegeix() {
    char _;
    Racional r;
    cin >> r.num_ >> _ >> r.den_;
    return r;
}

Racional racional_crea(int n, int d) {
	if (n == 0) {
		return {0, 1};
	}
	int sig = signe(n) * signe(d);
	n = abs(n);
	d = abs(d);
	const int m = mcd(n, d);
	return {sig * n / m, d / m};
}

Racional racional_suma(Racional a, Racional b) {
	return racional_crea(a.num_ * b.den_ + b.num_ * a.den_, a.den_ * b.den_);
}

Racional racional_resta(Racional a, Racional b) {
	return racional_crea(a.num_ * b.den_ - b.num_ * a.den_, a.den_ * b.den_);
}

Racional racional_multiplica(Racional a, Racional b) {
	return racional_crea(a.num_ * b.num_, a.den_ * b.den_);
}

Racional racional_divideix(Racional a, Racional b) {
	return racional_crea(a.num_ * b.den_, a.den_ * b.num_);
}

void racional_escriu(Racional a) {
	cout << a.num_;
	if (a.den_ > 1) {
		cout << '/' << a.den_;
	}
}

int main() {
    Racional acum = racional_llegeix();
	racional_escriu(acum);
    cout << endl;

	string op;
	while (cin >> op) {
		Racional r = racional_llegeix();
		if (op == "+") {
			acum = racional_suma(acum, r);
		} else if (op == "-") {
			acum = racional_resta(acum, r);
		} else if (op == "*") {
			acum = racional_multiplica(acum, r);
		} else if (op == "/") {
			acum = racional_divideix(acum, r);
		}
		racional_escriu(acum);
        cout << endl;
	}
}
```
</details>


### Solution 2: Conversion to class racional.cc

:::oopviz{simulation="racional_class"}
:::
