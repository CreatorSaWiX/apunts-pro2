

export const topics: Section[] = [
    {
        id: 'tema-1',
        title: 'Tema 1: Programació Orientada a Objectes',
        description: 'Fonaments de classes, disseny modular i gestió de memòria.',
        readTime: '3 min',
        blocks: [
            {
                type: 'text',
                title: '1.1 Repàs: Structs i Pas de Paràmetres',
                value: "Una **struct** és un tipus de dades definit per l'usuari que permet agrupar diverses variables."
            },
            {
                type: 'code',
                language: 'cpp',
                value: `struct Estudiant {
    int dni;
    string nom;
    double nota;
};`
            },
            {
                type: 'list',
                title: 'Pas de paràmetres',
                value: [
                    "**Pas per valor**: Es fa una còpia. És lent i si modifiques no afecta l'original.",
                    "**Pas per referència (&)**: No es copia (ràpid). Si modifiques, canvies l'original.",
                    "**Lectura (const &)**: `void mostrar(const Estudiant& e);` (Ràpid i segur).",
                    "**Escriptura (&)**: `void actualitzar(Estudiant& e);` (Permet modificar)."
                ]
            },
            {
                type: 'text',
                title: '1.2 Disseny Modular i Classes',
                value: "El **disseny modular** consisteix a descompondre un programa en peces independents (mòduls). Això millora l'organització i la reutilització."
            },
            {
                type: 'list',
                value: [
                    "**Especificació (.hpp)**: Declaracions de funcions, classes i tipus (el *què*).",
                    "**Implementació (.cpp)**: El codi de les funcions (el *com*)."
                ]
            },
            {
                type: 'text',
                value: "Una **Classe** és com una struct, però amb una diferència clau: la visibilitat per defecte. En POO, protegim les dades."
            },
            {
                type: 'list',
                value: [
                    "**Private**: Els atributs. SEMPRE privats. Ningú de fora els pot tocar directament.",
                    "**Public**: Els mètodes. És l'única manera d'interactuar amb els objectes."
                ]
            },
            {
                type: 'comparison',
                value: [
                    {
                        title: 'Punt.hpp (Especificació)',
                        language: 'cpp',
                        code: `class Punt {
private:
    double x, y;    // Atributs (Privats)

public:
    // Constructors
    Punt();
    Punt(double a, double b);

    // Modificadors
    void moure(double dx, double dy);

    // Consultors (const!)
    double get_x() const;
    double get_y() const;
    double distancia() const;
};`
                    },
                    {
                        title: 'Punt.cpp (Implementació)',
                        language: 'cpp',
                        code: `#include "Punt.hpp"
#include <cmath>

Punt::Punt() {
    x = 0; y = 0;
}

Punt::Punt(double a, double b) {
    x = a; y = b;
}

void Punt::moure(double dx, double dy) {
    x += dx; y += dy;
}

double Punt::get_x() const {
    return x;
}

double Punt::distancia() const {
    return sqrt(x*x + y*y);
}`
                    }
                ]
            }
        ]
    },
    // Placeholders for other topics
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `tema-${i + 2}`,
        title: `Tema ${i + 2}: Properament`,
        description: 'Contingut pendent d\'actualització.',
        readTime: '???',
        blocks: [
            {
                type: 'text',
                value: "Aquest tema estarà disponible aviat."
            }
        ]
    })) as Section[]
];

export interface CodeBlockData {
    title: string;
    code: string;
    language?: string;
}

export interface ContentBlock {
    type: 'text' | 'code' | 'list' | 'warning' | 'tip' | 'comparison';
    value: string | string[] | CodeBlockData[];
    title?: string;
    language?: string;
}

export interface Section {
    id: string;
    title: string;
    description: string;
    readTime?: string;
    blocks: ContentBlock[];
}
