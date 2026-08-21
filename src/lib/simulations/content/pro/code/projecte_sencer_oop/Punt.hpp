#ifndef PUNT_HPP
#define PUNT_HPP

class Punt {
    double x, y;
    static int comptador; // Compartit per tots els Punts
public:
    Punt(double a, double b);
    void moure(double dx, double dy);
    
    inline double get_x() const { 
        // inline estalvia la crida de funció
        return x; 
    }
    
    static int quants_punts();
};
#endif