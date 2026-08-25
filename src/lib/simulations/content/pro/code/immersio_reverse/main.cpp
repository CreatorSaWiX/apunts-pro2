#include <iostream>
#include <string>
using namespace std;

string i_reverse(const string& s, int i) {
    if (i == s.size()) return "";
    return i_reverse(s, i + 1) + s[i];
}

string reverse(const string& s) {
    return i_reverse(s, 0);
}

int main() {
    string text = "PRO2";
    string res = reverse(text);
    cout << res << endl;
    return 0;
}
