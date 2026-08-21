#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void reverse(istream& in, ostream& out);

TEST_CASE("dos elements") {
    istringstream sin("7 3");
    ostringstream sout;

    reverse(sin, sout);

    CHECK(sout.str() == "3 7\n");
}