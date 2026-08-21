#include "Caixa.hh"
#include <cassert>

// Usant la llista d'inicialitzadors (:)
Caixa::Caixa(int valor_inicial) : valor_(valor_inicial) {
    assert(valor_inicial >= 0);
}

void Caixa::afegir(int extra) {
    // Control de qualitat intern amb l'assert
    assert(extra >= 0); 
    valor_ += extra;
}