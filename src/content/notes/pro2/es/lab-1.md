---
title: "Lab 1: Struct a class"
description: "Sesión de laboratorio resuelta. Salto a la programación orientada a objetos."
readTime: "8 min"
order: 1.5
---
<details>
<summary>Explicación de la solución</summary>

## 1. El salto al paradigma orientado a objetos

En PRO1, definíamos un `struct` y después hacíamos funciones pasando la tupla como parámetro `funcio(tupla)`. 

Ahora, se trata de hacer que estas "funciones" vivan **dentro** del `struct` (métodos), de forma que tengan **acceso directo al estado interno**. Cambiaremos la sintaxis por `tupla.funcio()`, encapsulando finalmente el código usando la protección que da `class`.

### Cómo programábamos en PRO1 (data.cc)

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

### Cómo programaremos en PRO2

Nuestra `Data` tiene **responsabilidades propias**. Solo permite el acceso a variables y funciones públicas.


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

### Solución 1: Conversión a clase data.cc

:::oopviz{simulation="data_class"}
:::

<details>
<summary>Archivo original racional.cc</summary>

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


### Solución 2: Conversión a clase racional.cc

:::oopviz{simulation="racional_class"}
:::
