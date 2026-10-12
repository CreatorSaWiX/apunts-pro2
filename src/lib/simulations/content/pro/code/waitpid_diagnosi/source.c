#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/wait.h>

int main() {
    char buf[128];
    int status;

    int p1 = fork();
    if (p1 == 0) {
        exit(0);
    }

    int p2 = fork();
    if (p2 == 0) {
        kill(getpid(), 9);
        exit(1);
    }

    for (int i = 0; i < 2; i++) {
        int pid_fill = waitpid(-1, &status, 0);

        if (WIFEXITED(status)) {
            int codi = WEXITSTATUS(status);
            sprintf(buf, "Fill %d ha acabat be amb codi %d\n", pid_fill, codi);
            write(1, buf, strlen(buf));
        } else if (WIFSIGNALED(status)) {
            int senyal = WTERMSIG(status);
            sprintf(buf, "Fill %d ha mort pel senyal %d\n", pid_fill, senyal);
            write(1, buf, strlen(buf));
        }
    }
}
