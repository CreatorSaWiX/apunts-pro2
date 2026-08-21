#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void parentesis(istream& in, ostream& out);

TEST_CASE("seqüència correcta amb claudàtors") {
    istringstream sin("(()[[]]).");
    ostringstream sout;

    parentesis(sin, sout);

    CHECK(sout.str() == "Correcte\n");
}