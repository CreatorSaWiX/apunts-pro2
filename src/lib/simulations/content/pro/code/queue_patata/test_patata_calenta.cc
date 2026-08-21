#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void patata_calenta(istream& in, ostream& out);

TEST_CASE("N=3, k=1") {
    istringstream sin("3 1");
    ostringstream sout;

    patata_calenta(sin, sout);

    CHECK(sout.str() == "2 1\nSupervivent: 3\n");
}