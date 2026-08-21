#include "data.hh"
#include <iostream>
#include <iomanip>
using namespace std;

Data::Data() {
  dia = 1; mes = 1; any = 0;
}

int Data::dies_mes(int mes, int any) const {
  if (mes == 2) {
    return ((any % 4 == 0 && any % 100 != 0) || any % 400 == 0) ? 29 : 28;
  } else if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
    return 30;
  } else {
    return 31;
  }
}

void Data::llegeix() {
  char _; 
  cin >> dia >> _ >> mes >> _ >> any;
}

void Data::escriu() const {
  cout << setfill('0') << setw(2) << dia << '/' 
       << setfill('0') << setw(2) << mes << '/' 
       << setfill('0') << setw(4) << any;
}

Data Data::suma_dies(int dies) const {
  Data res = *this; 
  res.dia += dies;
  while (res.dia > res.dies_mes(res.mes, res.any)) {
    res.dia -= res.dies_mes(res.mes, res.any);
    res.mes++;
    if (res.mes > 12) {
      res.mes = 1;
      res.any++;
    }
  }
  return res;
}