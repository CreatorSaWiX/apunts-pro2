#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void escriu(int n, ostream& out);

TEST_CASE("n = 2") {
    ostringstream sout;

    escriu(2, sout);

    CHECK(sout.str() == " 2 1 1");
}