#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void compta_recents(istream& in, ostream& out);

TEST_CASE("frontera exacta de la finestra") {
    istringstream sin("3 10\n0 10 20");
    ostringstream sout;

    compta_recents(sin, sout);

    CHECK(sout.str() == "1 2 2\n");
}