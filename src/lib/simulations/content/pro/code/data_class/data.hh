#ifndef DATA_HH
#define DATA_HH

class Data {
private:
  int dia, mes, any;

  bool es_de_traspas(int any) const;
  int dies_mes(int mes, int any) const;

public:
  Data();
  Data(int dia, int mes, int any);

  void llegeix();
  void escriu() const;
  Data suma_dies(int dies) const;
  bool menor(const Data &b) const;

  static Data actual();
};

#endif