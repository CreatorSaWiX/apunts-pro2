import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; files: Record<string, string>; generateSteps: () => OOPStep[] }> = {
    racional_class: {
        id: "racional_class",
        files: {
            "Makefile": `CXX = g++
CXXFLAGS = -D_JUDGE_ -D_GLIBCXX_DEBUG -O2 -Wall -Wextra -Werror -Wno-sign-compare -std=c++11

TARGET = calc_racionals

all: $(TARGET)

$(TARGET): racional.o main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) racional.o main.o

racional.o: racional.cc racional.hh
	$(CXX) $(CXXFLAGS) -c racional.cc

main.o: main.cc racional.hh
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)`,
            "main.cc": `#include "racional.hh"
#include <iostream>
#include <string>

using namespace std;

// Solució al laboratori Racionals
int main() {
  Racional r;
  Racional acum;
  
  acum.llegeix();
  acum.escriu();
  cout << endl;

  string op;
  while (cin >> op) {
    r.llegeix();

    if (op == "+") {
      acum = acum.suma(r);
    } else if (op == "-") {
      acum = acum.resta(r);
    }

    acum.escriu();
    cout << endl;
  }
}`,
            "racional.hh": `#ifndef RACIONAL_HH
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

#endif`,
            "racional.cc": `#include "racional.hh"
#include <cstdlib>
#include <iostream>

using namespace std;

int Racional::signe(int n) const { return n < 0 ? -1 : 1; }

int Racional::mcd(int a, int b) const {
  while (b != 0) { int aux = b; b = a % b; a = aux; }
  return a;
}

void Racional::simplifica_intern(int n, int d) {
  if (n == 0) { num = 0; den = 1; }
  else {
    int m = mcd(abs(n), abs(d));
    num = (signe(n) * signe(d)) * (abs(n) / m);
    den = abs(d) / m;
  }
}

Racional::Racional() { simplifica_intern(0, 1); }
Racional::Racional(int n, int d) { simplifica_intern(n, d); }

void Racional::llegeix() {
  char _; int n, d;
  cin >> n >> _ >> d;
  simplifica_intern(n, d);
}

void Racional::escriu() const {
  cout << num;
  if (den > 1) { cout << '/' << den; }
}

Racional Racional::suma(const Racional &b) const {
  return Racional(num * b.den + b.num * den, den * b.den);
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 6, description: "pro.racional_class.step_1", terminalOutput: ["pro.racional_class.term_1"], variables: {} },
                { activeFile: "Makefile", line: 12, description: "pro.racional_class.step_2", terminalOutput: ["pro.racional_class.term_2", "pro.racional_class.term_3"], variables: {} },
                { activeFile: "Makefile", line: 15, description: "pro.racional_class.step_3", terminalOutput: ["pro.racional_class.term_4", "pro.racional_class.term_5", "pro.racional_class.term_6"], variables: {} },
                { activeFile: "Makefile", line: 9, description: "pro.racional_class.step_4", terminalOutput: ["pro.racional_class.term_7", "pro.racional_class.term_8", "pro.racional_class.term_9", "pro.racional_class.term_10"], variables: {} },
                { activeFile: "main.cc", line: 8, description: "pro.racional_class.step_5", terminalOutput: ["pro.racional_class.term_11"], variables: {} },
                { activeFile: "main.cc", line: 9, description: "pro.racional_class.step_6", terminalOutput: ["pro.racional_class.term_12"], variables: {} },
                { activeFile: "main.cc", line: 10, description: "pro.racional_class.step_7", terminalOutput: ["pro.racional_class.term_13"], variables: { "r": "Ref?", "acum": "Ref?" } },
                { activeFile: "racional.cc", line: 23, description: "pro.racional_class.step_8", terminalOutput: ["pro.racional_class.term_14"], variables: { "this": "->acum" } },
                { activeFile: "racional.cc", line: 15, description: "pro.racional_class.step_9", terminalOutput: ["pro.racional_class.term_15"], variables: { "this": "->acum", "num": "0", "den": "1" } },
                { activeFile: "main.cc", line: 13, description: "pro.racional_class.step_10", terminalOutput: ["pro.racional_class.term_16"], variables: { "r": "0/1", "acum": "0/1" } },
                { activeFile: "racional.cc", line: 28, description: "pro.racional_class.step_11", terminalOutput: ["pro.racional_class.term_17"], variables: { "this": "->acum" } },
                { activeFile: "racional.cc", line: 29, description: "pro.racional_class.step_12", terminalOutput: ["pro.racional_class.term_18"], variables: { "this": "->acum", "n": "1", "d": "2" } },
                { activeFile: "racional.cc", line: 19, description: "pro.racional_class.step_13", terminalOutput: ["pro.racional_class.term_19"], variables: { "this": "->acum", "num": "1", "den": "2" } },
                { activeFile: "main.cc", line: 14, description: "pro.racional_class.step_14", terminalOutput: ["pro.racional_class.term_20"], variables: { "r": "0/1", "acum": "1/2" } },
                { activeFile: "main.cc", line: 17, description: "pro.racional_class.step_15", terminalOutput: ["pro.racional_class.term_21", "pro.racional_class.term_22"], variables: { "acum": "1/2", "op": "+" } },
                { activeFile: "main.cc", line: 18, description: "pro.racional_class.step_16", terminalOutput: ["pro.racional_class.term_23", "pro.racional_class.term_24", "pro.racional_class.term_25"], variables: { "acum": "1/2", "op": "+", "r": "0/1" } },
                { activeFile: "racional.cc", line: 29, description: "pro.racional_class.step_17", terminalOutput: ["pro.racional_class.term_26"], variables: { "this": "->r", "n": "3", "d": "4" } },
                { activeFile: "main.cc", line: 20, description: "pro.racional_class.step_18", terminalOutput: ["pro.racional_class.term_27"], variables: { "acum": "1/2", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 21, description: "pro.racional_class.step_19", terminalOutput: ["pro.racional_class.term_28"], variables: { "acum": "1/2", "op": "+", "r": "3/4" } },
                { activeFile: "racional.cc", line: 37, description: "pro.racional_class.step_20", terminalOutput: ["pro.racional_class.term_29"], variables: { "this(->acum)": "1/2", "B(->r)": "3/4" } },
                { activeFile: "racional.cc", line: 38, description: "pro.racional_class.step_21", terminalOutput: ["pro.racional_class.term_30"], variables: { "this(->acum)": "1/2", "result": "Racional(10, 8)" } },
                { activeFile: "racional.cc", line: 20, description: "pro.racional_class.step_22", terminalOutput: ["pro.racional_class.term_31"], variables: { "this(->acum)": "1/2", "result": "5/4" } },
                { activeFile: "main.cc", line: 21, description: "pro.racional_class.step_23", terminalOutput: ["pro.racional_class.term_32"], variables: { "acum": "5/4", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 27, description: "pro.racional_class.step_24", terminalOutput: ["pro.racional_class.term_33", "pro.racional_class.term_34"], variables: { "acum": "5/4", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 17, description: "pro.racional_class.step_25", terminalOutput: ["pro.racional_class.term_35", "pro.racional_class.term_36"], variables: {} },
            ] as OOPStep[];
        }
    }
};

export const racional_class: Simulation = {
    id: legacyAlgo.racional_class.id,
    renderer: "oop",
    files: legacyAlgo.racional_class.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.racional_class.generateSteps().map((step: OOPStep) => ({
            line: step.line,
            description: step.description,
            variables: step.variables,
            visual: {
                activeFile: step.activeFile,
                terminalOutput: step.terminalOutput
            }
        }));
    }
};
