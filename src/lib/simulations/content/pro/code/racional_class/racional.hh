#ifndef RACIONAL_HH
#define RACIONAL_HH

class Racional {
private:
  int num, den;

  int mcd(int a, int b) const;
  int signe(int n) const;
  void simplifica_intern(int n, int d);

public:
  Racional();
  Racional(int n, int d);

  void llegeix();
  void escriu() const;

  Racional suma(const Racional &b) const;
  Racional resta(const Racional &b) const;
  // ... (multiplica i divideix fets iguals)
};

#endif