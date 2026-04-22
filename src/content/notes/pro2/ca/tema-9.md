---
title: "Tema 9: Implementació de vectors"
description: "Gestió de memòria, capacitat i cost amortitzat."
readTime: "15 min"
order: 10
draft: false
isNew: true
---

## 1. Atributs i estructura interna

Un vector no és més que un **array dinàmic** que gestiona la seva pròpia memòria al *heap*. Per fer-ho, necessita tres atributs bàsics:

- **`T* data_`**: Punter al bloc de memòria on guardem els elements.
- **`int size_`**: Quantes caselles estem usant realment.
- **`int capacity_`**: Quantes caselles hem reservat en total (mida del bloc al heap).

```cpp
template <typename T>
class Vector {
    T* data_;
    int size_;
    int capacity_;
    
    void reallocate_(int new_cap); // El "motor" del vector
public:
    // ... mètodes públics ...
};
```

## 2. El motor: `reallocate_`

Aquest mètode privat és l'únic que demana memòria nova. Segueix sempre aquests 4 passos:

1. Demana un nou bloc de mida `new_cap`.
2. Copia els elements del bloc vell al nou.
3. Allibera la memòria vella (`delete[] data_`).
4. Actualitza el punter `data_` i la `capacity_`.

```cpp
void reallocate_(int new_cap) {
    T* new_data = new T[new_cap];
    for (int i = 0; i < size_; ++i) {
        new_data[i] = data_[i];
    }
    delete[] data_;
    data_ = new_data;
    capacity_ = new_cap;
}
```

## 3. Inserció: `push_back` i Creixement Exponencial

Quan volem afegir un element i el vector està ple (`size_ == capacity_`), el vector **dobla la seva capacitat**.

```cpp
void push_back(const T& x) {
    if (size_ == capacity_) {
        int new_cap = (capacity_ == 0) ? 1 : 2 * capacity_;
        reallocate_(new_cap);
    }
    data_[size_] = x;
    ++size_;
}
```

### El Cost Amortitzat $\mathcal{O}(1)$
Tot i que fer un `reallocate_` costa $\mathcal{O}(n)$, només es fa de tant en tant. Si analitzem 1000 insercions, la mitjana de cost per inserció acaba sent **constant**. Això es coneix com a **Cost Amortitzat**.

## 4. Extracció: `pop_back` i el "Thrashing"

Per no malbaratar memòria, si el vector s'està buidant, hauríem de reduir la seva capacitat. Però, si la reduíssim just quan `size_ == capacity_ / 2`, podríem caure en el **Thrashing**:
- Fas `push_back` -> Dobles (car).
- Fas `pop_back` -> Redueixes (car).
- Fas `push_back` -> Tornes a doblar (car).

**La solució**: Esperar que el vector estigui molt buit (**1/4 de la capacitat**) per reduir-lo a la **meitat**.

```cpp
void pop_back() {
    --size_;
    if (size_ > 0 && size_ == capacity_ / 4) {
        reallocate_(capacity_ / 2);
    }
}
```

## 5. `reserve` vs `resize`

Són mètodes que sovint es confonen però fan coses molt diferents:

- **`reserve(n)`**: Canvia la **capacitat**. No toca els elements. Útil si saps que hauràs de fer molts `push_back` i vols evitar redimensionaments.
- **`resize(n)`**: Canvia el **tamany** real (`size_`). Si `n` és més gran que `size_`, "crea" elements nous amb el valor per defecte.

---

## Resum de complexitat

| Operació | Complexitat | Nota |
| :--- | :--- | :--- |
| **Accés `[i]`** | $\Theta(1)$ | Directe per punter. |
| **`push_back`** | $\mathcal{O}(1)$ amortitzat | $\mathcal{O}(n)$ en el pitjor cas (redimensionament). |
| **`pop_back`** | $\mathcal{O}(1)$ amortitzat | $\mathcal{O}(n)$ si es redueix la memòria. |
| **`size() / empty()`** | $\Theta(1)$ | No canvien segons el tamany. |
