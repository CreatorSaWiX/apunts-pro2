#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> Q;
    
    Q.push(10);
    Q.push(20);
    Q.push(30);
    
    int processar = Q.front();
    cout << "Atenent al primer: " << processar << endl;
    
    Q.pop();
    cout << "Següent del torn: " << Q.front() << endl;
    
    return 0;
}