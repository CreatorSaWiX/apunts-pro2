#include <stdlib.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>

void error_y_exit(char *msg, int exit_status) {
    perror(msg);
    exit(exit_status);
}

void trata_alarma_padre(int s) {
    char buff[128];
    sprintf(buff, "TIMEOUT 2s. El pare envia SIGKILL als fills vius...\n");
    write(1, buff, strlen(buff));
}

void trata_alarma(int s) {
    // Handler buit: només serveix per despertar el sigsuspend
}

int main(int argc, char *argv[]) {
    int pid, res;
    int pids_hijos[10];
    int segons_restants;
    char buff[256];
    int contador = 0;
    int hijos = 0;
    struct sigaction sa;
    sigset_t mask;

    /* 1. Bloquegem SIGALRM abans del fork per evitar curses */
    sigemptyset(&mask);
    sigaddset(&mask, SIGALRM);
    sigprocmask(SIG_BLOCK, &mask, NULL);

    /* 2. Creacio dels 10 fills */
    for (hijos = 0; hijos < 10; hijos++) {
        sprintf(buff, "Creando el hijo numero %d\n", hijos);
        write(1, buff, strlen(buff));

        pid = fork();
        if (pid == 0) {
            sa.sa_handler = &trata_alarma;
            sa.sa_flags = SA_RESTART;
            sigfillset(&sa.sa_mask);
            if (sigaction(SIGALRM, &sa, NULL) < 0) error_y_exit("sigaction", 1);

            sprintf(buff, "Hola, soy %d\n", getpid());
            write(1, buff, strlen(buff));

            alarm(1);
            sigfillset(&mask);
            sigdelset(&mask, SIGALRM);
            sigdelset(&mask, SIGINT);
            sigsuspend(&mask);

            exit(0);
        } else if (pid > 0) {
            pids_hijos[hijos] = pid;
        } else if (pid < 0) {
            error_y_exit("Error en el fork", 1);
        }
    }

    /* 3. El pare es prepara per vigilar amb timeout de 2s */
    sa.sa_handler = &trata_alarma_padre;
    sa.sa_flags = 0; // Sense SA_RESTART: volem que waitpid retorni -1 si arriba SIGALRM
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    sigemptyset(&mask);
    sigaddset(&mask, SIGALRM);
    sigprocmask(SIG_UNBLOCK, &mask, NULL);

    /* 4. Esperem que acabin els fills */
    while (hijos > 0) {
        alarm(2);
        pid = waitpid(-1, &res, 0);

        if (pid > 0) {
            segons_restants = alarm(0);
            sprintf(buff, "Faltaven %d segons per a l'alarma\n", segons_restants);
            write(1, buff, strlen(buff));

            for (int i = 0; i < 10; i++) {
                if (pids_hijos[i] == pid) pids_hijos[i] = 0;
            }

            if (WIFEXITED(res)) {
                sprintf(buff, "Termina el proceso %d con exit(%d)\n", pid, WEXITSTATUS(res));
                write(1, buff, strlen(buff));
            } else if (WIFSIGNALED(res)) {
                sprintf(buff, "El proceso %d ha muerto por recibir el signal %d\n", pid, WTERMSIG(res));
                write(1, buff, strlen(buff));
            }

            hijos--;
            contador++;
        } else {
            // Timeout de 2s expirat: waitpid() ha fallat interromput per SIGALRM
            for (int i = 0; i < 10; i++) {
                if (pids_hijos[i] > 0) kill(pids_hijos[i], SIGKILL);
            }
        }
    }

    sprintf(buff, "Valor del contador %d\n", contador);
    write(1, buff, strlen(buff));
    return 0;
}
