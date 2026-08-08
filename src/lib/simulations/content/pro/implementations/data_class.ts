import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    data_class: {
        id: "data_class",
        files: {
            "Makefile": `CXX = g++
CXXFLAGS = -D_JUDGE_ -D_GLIBCXX_DEBUG -O2 -Wall -Wextra -Werror -Wno-sign-compare -std=c++11

TARGET = demo_data

all: $(TARGET)

$(TARGET): data.o main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) data.o main.o

data.o: data.cc data.hh
	$(CXX) $(CXXFLAGS) -c data.cc

main.o: main.cc data.hh
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)`,
            "main.cc": `#include "data.hh"
#include <iostream>

using namespace std;

int main() {
  Data d;
  int n;

  d.llegeix();
  while (cin >> n) {
    Data resultat = d.suma_dies(n);
    resultat.escriu();
    cout << endl;
    
    d.llegeix();
  }
  return 0;
}`,
            "data.hh": `#ifndef DATA_HH
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

#endif`,
            "data.cc": `#include "data.hh"
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
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 6, description: "pro.data_class.step_1", terminalOutput: ["pro.data_class.term_1"], variables: {} },
                { activeFile: "Makefile", line: 11, description: "pro.data_class.step_2", terminalOutput: ["pro.data_class.term_2", "pro.data_class.term_3"], variables: {} },
                { activeFile: "Makefile", line: 14, description: "pro.data_class.step_3", terminalOutput: ["pro.data_class.term_4", "pro.data_class.term_5", "pro.data_class.term_6"], variables: {} },
                { activeFile: "Makefile", line: 9, description: "pro.data_class.step_4", terminalOutput: ["pro.data_class.term_7", "pro.data_class.term_8", "pro.data_class.term_9", "pro.data_class.term_10"], variables: {} },
                { activeFile: "main.cc", line: 6, description: "pro.data_class.step_5", terminalOutput: ["pro.data_class.term_11"], variables: {} },
                { activeFile: "main.cc", line: 7, description: "pro.data_class.step_6", terminalOutput: ["pro.data_class.term_12"], variables: { "d": "Data{?.?.?}" } },
                { activeFile: "data.cc", line: 6, description: "pro.data_class.step_7", terminalOutput: ["pro.data_class.term_13"], variables: { "this": "->d" } },
                { activeFile: "data.cc", line: 7, description: "pro.data_class.step_8", terminalOutput: ["pro.data_class.term_14"], variables: { "this": "->d", "dia": "1", "mes": "1", "any": "0" } },
                { activeFile: "main.cc", line: 8, description: "pro.data_class.step_9", terminalOutput: ["pro.data_class.term_15"], variables: { "d": "1/1/0", "n": "?" } },
                { activeFile: "main.cc", line: 10, description: "pro.data_class.step_10", terminalOutput: ["pro.data_class.term_16"], variables: { "d": "1/1/0", "n": "?" } },
                { activeFile: "data.cc", line: 21, description: "pro.data_class.step_11", terminalOutput: ["pro.data_class.term_17"], variables: { "this": "->d" } },
                { activeFile: "data.cc", line: 22, description: "pro.data_class.step_12", terminalOutput: ["pro.data_class.term_18"], variables: { "this": "->d", "dia": "28", "mes": "2", "any": "2024" } },
                { activeFile: "main.cc", line: 11, description: "pro.data_class.step_13", terminalOutput: ["pro.data_class.term_19"], variables: { "d": "28/02/2024", "n": "1" } },
                { activeFile: "main.cc", line: 12, description: "pro.data_class.step_14", terminalOutput: ["pro.data_class.term_20"], variables: { "d": "28/02/2024", "n": "1" } },
                { activeFile: "data.cc", line: 32, description: "pro.data_class.step_15", terminalOutput: ["pro.data_class.term_21"], variables: { "this": "->d", "dies": "1", "res": "28/02/2024" } },
                { activeFile: "data.cc", line: 34, description: "pro.data_class.step_16", terminalOutput: ["pro.data_class.term_22"], variables: { "this": "->d", "dies": "1", "res": "29/02/2024" } },
                { activeFile: "data.cc", line: 10, description: "pro.data_class.step_17", terminalOutput: ["pro.data_class.term_23"], variables: { "this": "->res", "res_retorn_dies": "29" } },
                { activeFile: "data.cc", line: 34, description: "pro.data_class.step_18", terminalOutput: ["pro.data_class.term_24"], variables: { "this": "->d", "dies": "1", "res": "29/02/2024" } },
                { activeFile: "data.cc", line: 42, description: "pro.data_class.step_19", terminalOutput: ["pro.data_class.term_25"], variables: { "this": "->d", "res": "29/02/2024" } },
                { activeFile: "main.cc", line: 12, description: "pro.data_class.step_20", terminalOutput: ["pro.data_class.term_26"], variables: { "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" } },
                { activeFile: "main.cc", line: 13, description: "pro.data_class.step_21", terminalOutput: ["pro.data_class.term_27"], variables: { "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" } },
                { activeFile: "data.cc", line: 25, description: "pro.data_class.step_22", terminalOutput: ["pro.data_class.term_28"], variables: { "this": "->resultat", "dia": "29" } },
                { activeFile: "main.cc", line: 16, description: "pro.data_class.step_23", terminalOutput: ["pro.data_class.term_29"], variables: { "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" } },
                { activeFile: "main.cc", line: 11, description: "pro.data_class.step_24", terminalOutput: ["pro.data_class.term_30", "pro.data_class.term_31"], variables: {} }
            ] as OOPStep[];
        }
    }
};

export const data_class: Simulation = {
    id: legacyAlgo.data_class.id,
    renderer: "oop",
    files: legacyAlgo.data_class.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.data_class.generateSteps().map((step: OOPStep) => ({
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
