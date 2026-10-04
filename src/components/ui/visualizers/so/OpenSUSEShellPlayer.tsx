import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
    Terminal as TerminalIcon, 
    HardDrive, 
    BookOpen, 
    RotateCcw, 
    Maximize, 
    Minimize, 
    FileText, 
    Folder, 
    Link2, 
    Layers, 
    ChevronLeft,
    LayoutGrid,
    X
} from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';

// --- Types ---
export interface Inode {
    id: number;
    type: 'file' | 'dir' | 'symlink';
    permissions: string;
    octal: number;
    owner: string;
    group: string;
    size: number;
    blocks: number;
    links: number;
    content: string;
    target?: string; // For symlink
    modifyTime: string;
}

export interface OutputLine {
    id: string;
    type: 'cmd' | 'stdout' | 'stderr' | 'info';
    text: string;
    path?: string;
}

export interface OpenSUSEShellPlayerProps {
    scenario?: string;
    title?: string;
    initialCommand?: string;
    command?: string;
    initialInput?: string;
    suggestions?: string | string[];
    variant?: 'compact' | 'full';
    compact?: boolean | string;
}

// Built-in Manual Pages
const MAN_PAGES: Record<string, { name: string; section: number; synopsis: string; desc: string; options: [string, string][]; seeAlso: string }> = {
    'ls': {
        name: 'ls - list directory contents',
        section: 1,
        synopsis: 'ls [OPTION]... [FILE]...',
        desc: 'Llista informació sobre els FITXERS (el directori actual per defecte). Ordena les entrades alfabèticament per defecte.',
        options: [
            ['-a, --all', 'No ignora les entrades que comencen per . (mostra fitxers ocults).'],
            ['-l', 'Utilitza un format de llistat llarg (permisos, links, propietari, mida, dates).'],
            ['-h, --human-readable', 'Amb -l, mostra les mides en format humà (ex: 1K, 234M, 2G).'],
            ['-i, --inode', 'Mostra el número d\'índex (inode) de cada fitxer.'],
            ['-m', 'Emplena l\'amplada d\'una llista d\'entrades separades per comes.']
        ],
        seeAlso: 'stat(1), dir(1), vdir(1)'
    },
    'write': {
        name: 'write - send a message to another user',
        section: 1,
        synopsis: 'write user [ttyname]',
        desc: 'write permet a un usuari enviar línies de text des de la seva terminal cap a la terminal d\'un altre usuari connectat al mateix sistema.',
        options: [
            ['user', 'Nom d\'usuari destinatari del missatge.'],
            ['ttyname', 'Dispositiu de terminal (ex: pts/1) si l\'usuari en té més d\'una oberta.']
        ],
        seeAlso: 'mesg(1), talk(1), wall(1), write(2)'
    },
    'write(2)': {
        name: 'write - write to a file descriptor (system call)',
        section: 2,
        synopsis: '#include <unistd.h>\nssize_t write(int fd, const void *buf, size_t count);',
        desc: 'write() escriu fins a count bytes des del buffer de memòria inicial buf cap al fitxer, canonada (pipe) o socket referenciat pel descriptor fd. És la crida a sistema fonamental d\'escriptura a UNIX.',
        options: [
            ['fd', 'Descriptor de fitxer obert (ex: 1 per stdout, 2 per stderr, o retornat per open).'],
            ['buf', 'Punter al buffer de memòria que conté les dades a transmetre.'],
            ['count', 'Nombre màxim de bytes a escriure.'],
            ['RETURN VALUE', 'En cas d\'èxit es retorna el nombre de bytes escrits realment. En error, es retorna -1 i errno s\'assigna degudament.'],
            ['ERRORS', 'EBADF (descriptor invàlid), EINVAL, EFAULT, EAGAIN (I/O no bloquejant), ENOSPC (disc ple).']
        ],
        seeAlso: 'close(2), fcntl(2), open(2), read(2), write(1)'
    },
    'chmod': {
        name: 'chmod - canvia els permisos d\'accés a fitxers',
        section: 1,
        synopsis: 'chmod [OPTION]... MODE[,MODE]... FILE...',
        desc: 'Canvia el mode de cadascun dels fitxers segons MODE, que pot ser una representació octal o una especificació simbòlica ([ugoa...][[+-=][rwx...]]).',
        options: [
            ['u, g, o, a', 'Usuari propietari (u), grup (g), altres usuaris (o), tots (a).'],
            ['+, -, =', 'Afegeix permisos (+), treu permisos (-), o assigna de forma exacta (=).'],
            ['r, w, x', 'Lectura (r / 4), Escriptura (w / 2), Execució / Travessar directori (x / 1).']
        ],
        seeAlso: 'stat(1), chown(1)'
    },
    'stat': {
        name: 'stat - display file or file system status',
        section: 1,
        synopsis: 'stat [OPTION]... FILE...',
        desc: 'Mostra informació d\'estat del fitxer o del sistema de fitxers, incloent l\'inode, blocs assignats, mida del bloc d\'E/S, comptador de links i timestamps.',
        options: [
            ['-f, --file-system', 'Mostra l\'estat del sistema de fitxers en comptes del fitxer.'],
            ['-c, --format=FORMAT', 'Utilitza el FORMAT especificat en comptes de la sortida per defecte.']
        ],
        seeAlso: 'ls(1), readlink(1)'
    },
    'ln': {
        name: 'ln - make links between files',
        section: 1,
        synopsis: 'ln [OPTION]... TARGET LINK_NAME',
        desc: 'Crea enllaços cap a TARGET amb el nom LINK_NAME. Per defecte crea un enllaç dur (hard link); amb -s crea un enllaç simbòlic (soft link).',
        options: [
            ['-s, --symbolic', 'Crea enllaços simbòlics en lloc d\'enllaços durs.'],
            ['-i, --interactive', 'Demana confirmació abans d\'esborrar destins existents.']
        ],
        seeAlso: 'readlink(1), namei(1), link(2), symlink(2)'
    },
    'bash': {
        name: 'bash - GNU Bourne-Again SHell',
        section: 1,
        synopsis: 'bash [options] [command_string | file]',
        desc: 'Intèrpret d\'ordres estàndard del sistema. Llegeix ordres de l\'entrada estàndard o d\'un fitxer i les executa en un bucle interactiu.',
        options: [
            ['PATH', 'La ruta de cerca per a comandes. És una llista de directoris separats per dos punts (:).'],
            ['HOME', 'El directori d\'inici de l\'usuari actual.'],
            ['PWD', 'El directori de treball actual establert per la comanda cd.']
        ],
        seeAlso: 'sh(1), env(1), export(1)'
    },
    'ps': {
        name: 'ps - report a snapshot of the current processes',
        section: 1,
        synopsis: 'ps [options]',
        desc: 'ps mostra informació sobre una selecció dels processos actius al sistema.',
        options: [
            ['-u [user]', 'Selecciona els processos per UID o nom d\'usuari.'],
            ['-l', 'Mostra format llarg (F, S, UID, PID, PPID, C, PRI, NI, ADDR, SZ, WCHAN, TTY, TIME, CMD).'],
            ['-a', 'Selecciona tots els processos excepte líders de sessió i processos no associats a terminal.']
        ],
        seeAlso: 'top(1), pgrep(1), pstree(1)'
    },
    'fork(2)': {
        name: 'fork - create a child process',
        section: 2,
        synopsis: '#include <sys/types.h>\n#include <unistd.h>\npid_t fork(void);',
        desc: 'fork() crea un nou procés duplicant el procés que fa la crida. El nou procés s\'anomena procés fill. Els dos processos s\'executen en espais de memòria independents.',
        options: [
            ['RETURN VALUE', 'Retorna 0 al fill, el PID del fill al pare, o -1 en cas d\'error.']
        ],
        seeAlso: 'clone(2), execve(2), wait(2)'
    },
    'waitpid(2)': {
        name: 'wait, waitpid - wait for process to change state',
        section: 2,
        synopsis: '#include <sys/types.h>\n#include <sys/wait.h>\npid_t waitpid(pid_t pid, int *wstatus, int options);',
        desc: 'waitpid() suspèn l\'execució del procés que fa la crida fins que un fill especificat per pid ha canviat d\'estat i allibera el seu PCB.',
        options: [
            ['pid', 'Si és -1, espera qualsevol procés fill.'],
            ['options', '0 per espera bloquejant; WNOHANG per retornar immediatament si cap fill ha mort.']
        ],
        seeAlso: 'fork(2), exit(2), wait(2)'
    },
    'execlp(3)': {
        name: 'execlp - execute a file',
        section: 3,
        synopsis: '#include <unistd.h>\nint execlp(const char *file, const char *arg0, ... /*, (char *)0 */);',
        desc: 'execlp() substitueix la imatge del procés actual per un nou binari cercat a través dels directoris del PATH.',
        options: [
            ['RETURN VALUE', 'Només retorna si es produeix un error (-1). Si té èxit no retorna mai.']
        ],
        seeAlso: 'execve(2), fork(2)'
    },
    'sigaction(2)': {
        name: 'sigaction - examine and change a signal action',
        section: 2,
        synopsis: '#include <signal.h>\nint sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);',
        desc: 'sigaction() s\'utilitza per canviar o consultar l\'acció empresa per un procés en rebre un senyal específic signum.',
        options: [
            ['act.sa_handler', 'SIG_DFL, SIG_IGN o punter a la rutina de tractament void (*)(int).'],
            ['act.sa_mask', 'Màscara de senyals addicionals a bloquejar mentre s\'executa el handler.']
        ],
        seeAlso: 'sigprocmask(2), sigsuspend(2), kill(2)'
    },
    'sigsuspend(2)': {
        name: 'sigsuspend - wait for a signal',
        section: 2,
        synopsis: '#include <signal.h>\nint sigsuspend(const sigset_t *mask);',
        desc: 'sigsuspend() substitueix temporalment la màscara de senyals del procés per mask i suspèn el procés fins que arriba un senyal.',
        options: [
            ['RETURN VALUE', 'Sempre retorna -1 amb errno = EINTR.']
        ],
        seeAlso: 'sigaction(2), sigprocmask(2), pause(2)'
    }
};

// --- macOS Style Icons for Graphical Finder View ---
const MacOSFolderIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14C4 11.7909 5.79086 10 8 10H18.5858C19.6466 10 20.6641 10.4214 21.4142 11.1716L24.8284 14.5858C25.5786 15.3359 26.596 15.7574 27.6569 15.7574H40C42.2091 15.7574 44 17.5482 44 19.7574V38C44 40.2091 42.2091 42 40 42H8C5.79086 42 4 40.2091 4 38V14Z" fill="#38BDF8" fillOpacity="0.4" />
        <path d="M4 18C4 15.7909 5.79086 14 8 14H40C42.2091 14 44 15.7909 44 18V38C44 40.2091 42.2091 42 40 42H8C5.79086 42 4 40.2091 4 38V18Z" fill="url(#macFolderGrad)" />
        <defs>
            <linearGradient id="macFolderGrad" x1="24" y1="14" x2="24" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
        </defs>
    </svg>
);

const MacOSFileIcon = ({ className = "w-11 h-11", ext }: { className?: string; ext?: string }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7C11 5.34315 12.3431 4 14 4H27L37 14V41C37 42.6569 35.6569 44 34 44H14C12.3431 44 11 42.6569 11 41V7Z" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
            <path d="M27 4V14H37" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
            <line x1="17" y1="21" x2="31" y2="21" stroke="#52525B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="17" y1="27" x2="31" y2="27" stroke="#52525B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="17" y1="33" x2="25" y2="33" stroke="#52525B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {ext && (
            <span className="absolute bottom-1.5 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-tighter select-none">
                {ext.slice(0, 3)}
            </span>
        )}
    </div>
);

const MacOSSymlinkIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7C11 5.34315 12.3431 4 14 4H27L37 14V41C37 42.6569 35.6569 44 34 44H14C12.3431 44 11 42.6569 11 41V7Z" fill="#18181B" stroke="#8B5CF6" strokeWidth="1.5" />
            <path d="M27 4V14H37" fill="#2E1065" stroke="#8B5CF6" strokeWidth="1" />
            <path d="M17 28L23 22M23 22H18M23 22V27" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

// Initial filesystem factory
const createInitialState = () => {
    let inodeCounter = 1441850;
    const inodes: Record<number, Inode> = {
        [inodeCounter]: {
            id: inodeCounter,
            type: 'dir',
            permissions: 'drwxr-xr-x',
            octal: 755,
            owner: 'alumne',
            group: 'users',
            size: 4096,
            blocks: 8,
            links: 5,
            content: '',
            modifyTime: '16:00'
        },
        [inodeCounter + 1]: {
            id: inodeCounter + 1,
            type: 'dir',
            permissions: 'drwxr-xr-x',
            octal: 755,
            owner: 'alumne',
            group: 'users',
            size: 4096,
            blocks: 8,
            links: 2,
            content: '',
            modifyTime: '16:05'
        },
        [inodeCounter + 2]: {
            id: inodeCounter + 2,
            type: 'dir',
            permissions: 'drwxr-xr-x',
            octal: 755,
            owner: 'alumne',
            group: 'users',
            size: 4096,
            blocks: 8,
            links: 2,
            content: '',
            modifyTime: '16:06'
        },
        [inodeCounter + 3]: {
            id: inodeCounter + 3,
            type: 'dir',
            permissions: 'drwxr-xr-x',
            octal: 755,
            owner: 'alumne',
            group: 'users',
            size: 4096,
            blocks: 8,
            links: 2,
            content: '',
            modifyTime: '16:07'
        },
        [inodeCounter + 4]: {
            id: inodeCounter + 4,
            type: 'file',
            permissions: '-rw-r--r--',
            octal: 644,
            owner: 'alumne',
            group: 'users',
            size: 84,
            blocks: 8,
            links: 1,
            content: "Laboratori de Sistemes Operatius - FIB UPC\nPràctica 1: Shell Linux (Bash) i gestió d'Inodes.\n",
            modifyTime: '16:10'
        },
        [inodeCounter + 5]: {
            id: inodeCounter + 5,
            type: 'file',
            permissions: '-rwxr-xr-x',
            octal: 755,
            owner: 'alumne',
            group: 'users',
            size: 52,
            blocks: 8,
            links: 1,
            content: "#!/bin/bash\necho 'Laboratori 1 de Sistemes Operatius openSUSE!'\n",
            modifyTime: '16:15'
        },
        [inodeCounter + 6]: {
            id: inodeCounter + 6,
            type: 'file',
            permissions: '-rw-r--r--',
            octal: 644,
            owner: 'alumne',
            group: 'users',
            size: 72,
            blocks: 8,
            links: 1,
            content: "Sessió 1: Comandes bàsiques, enllaços durs (ln) i simbòlics (ln -s).\n",
            modifyTime: '16:16'
        },
        [inodeCounter + 7]: {
            id: inodeCounter + 7,
            type: 'file',
            permissions: '-rw-r--r--',
            octal: 644,
            owner: 'alumne',
            group: 'users',
            size: 58,
            blocks: 8,
            links: 1,
            content: "Apunts de classe i manuals del sistema openSUSE.\n",
            modifyTime: '16:18'
        }
    };

    const files: Record<string, number> = {
        '/home/alumne': inodeCounter,
        '/home/alumne/SO': inodeCounter + 1,
        '/home/alumne/EDA': inodeCounter + 2,
        '/home/alumne/Documents': inodeCounter + 3,
        '/home/alumne/test.txt': inodeCounter + 4,
        '/home/alumne/test': inodeCounter + 4,
        '/home/alumne/SO/lab1.sh': inodeCounter + 5,
        '/home/alumne/SO/entrega.txt': inodeCounter + 6,
        '/home/alumne/Documents/apunts.txt': inodeCounter + 7
    };

    return {
        nextInode: inodeCounter + 3,
        inodes,
        files,
        cwd: '/home/alumne',
        env: {
            USER: 'alumne',
            HOME: '/home/alumne',
            PWD: '/home/alumne',
            SHELL: '/bin/bash',
            PATH: '/usr/local/bin:/usr/bin:/bin'
        } as Record<string, string>,
        aliases: {
            ll: 'ls -la',
            cp: 'cp -i'
        }
    };
};

export default function OpenSUSEShellPlayer({
    scenario = 'default',
    title,
    initialCommand = '',
    command = '',
    initialInput = '',
    suggestions = '',
    variant,
    compact
}: OpenSUSEShellPlayerProps) {
    const prefilledCmd = initialInput || command || (scenario === 'links_and_inodes' ? '' : initialCommand) || '';
    const isCompact = variant === 'compact' || compact === true || compact === 'true' || Boolean(command && scenario !== 'links_and_inodes');

    const [fsState, setFsState] = useState(createInitialState);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState<number>(-1);
    const [inputVal, setInputVal] = useState<string>(prefilledCmd);
    const [showFiles, setShowFiles] = useState<boolean>(!isCompact);
    const [outputs, setOutputs] = useState<OutputLine[]>(() => {
        if (isCompact && prefilledCmd) {
            return [
                {
                    id: 'init-1',
                    type: 'info',
                    text: 'openSUSE Leap 15.4 (x86_64) — Bash 5.1\nPrem Enter (↵) per executar la comanda preparada.'
                }
            ];
        }
        return [
            {
                id: 'init-1',
                type: 'info',
                text: 'openSUSE Leap 15.4 (x86_64) — Linux 5.14.21\nTerminal interactiu Bash 5.1. Fes clic a carpetes o fitxers per interactuar.'
            }
        ];
    });
    const [activeTab, setActiveTab] = useState<'term' | 'fs' | 'man'>('term');
    const [activeManPage, setActiveManPage] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [highlightedInode, setHighlightedInode] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'finder' | 'inodes'>('finder');

    const terminalScrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestionList = useMemo(() => {
        if (!suggestions) return [];
        if (Array.isArray(suggestions)) return suggestions;
        return String(suggestions).split(',').map(s => s.trim()).filter(Boolean);
    }, [suggestions]);

    // Auto-scroll terminal ONLY inside its container (prevents window scrolling bug)
    useEffect(() => {
        if (terminalScrollRef.current) {
            terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
        }
    }, [outputs, activeManPage]);

    // Fullscreen body class and escape key + man 'q' key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeManPage) {
                if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveManPage(null);
                    return;
                }
            } else if (e.key === 'Escape') {
                if (isFullscreen) {
                    setIsFullscreen(false);
                }
            }
        };

        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('player-fullscreen');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('player-fullscreen');
        }

        window.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('player-fullscreen');
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [isFullscreen, activeManPage]);

    // Auto-focus terminal input after man page is closed
    useEffect(() => {
        if (!activeManPage) {
            const timer = setTimeout(() => {
                inputRef.current?.focus({ preventScroll: true });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [activeManPage]);

    // Prevent wheel events inside terminal from scrolling the outer window
    useEffect(() => {
        const el = terminalScrollRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const delta = e.deltaY;
            const isUp = delta < 0;
            const isDown = delta > 0;

            if (
                (isUp && scrollTop <= 0) ||
                (isDown && scrollTop + clientHeight >= scrollHeight - 1)
            ) {
                e.preventDefault();
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [outputs, activeManPage]);

    // Helper: Normalize Path
    const resolvePath = useCallback((path: string, cwd: string): string => {
        if (!path || path === '.') return cwd;
        if (path === '~') return fsState.env.HOME;
        if (path.startsWith('~/')) return `${fsState.env.HOME}/${path.slice(2)}`;
        
        let parts: string[];
        if (path.startsWith('/')) {
            parts = path.split('/');
        } else {
            parts = `${cwd}/${path}`.split('/');
        }

        const stack: string[] = [];
        for (const p of parts) {
            if (!p || p === '.') continue;
            if (p === '..') {
                if (stack.length > 0) stack.pop();
            } else {
                stack.push(p);
            }
        }
        return `/${stack.join('/')}` || '/';
    }, [fsState.env.HOME]);

    // Helper: Get files in directory
    const getDirectoryEntries = useCallback((dirPath: string) => {
        const entries: { name: string; fullPath: string; inodeId: number }[] = [];
        const prefix = dirPath === '/' ? '/' : `${dirPath}/`;

        for (const [fPath, inodeId] of Object.entries(fsState.files)) {
            if (fPath === dirPath) continue;
            if (fPath.startsWith(prefix)) {
                const rest = fPath.slice(prefix.length);
                if (!rest.includes('/')) {
                    entries.push({ name: rest, fullPath: fPath, inodeId });
                }
            }
        }
        return entries;
    }, [fsState.files]);

    // Command Execution Engine
    const executeCommand = useCallback((rawCmd: string) => {
        const trimmed = rawCmd.trim();
        if (!trimmed) return;

        // Push to history
        setHistory(prev => [...prev, trimmed]);
        setHistoryIdx(-1);

        // Record prompt output line
        const promptLine: OutputLine = {
            id: Math.random().toString(),
            type: 'cmd',
            text: trimmed,
            path: fsState.cwd
        };

        const newOutputs: OutputLine[] = [promptLine];

        // Process pipes/redirections basic check
        let isAppend = false;
        let redirectTarget: string | null = null;
        let commandToRun = trimmed;

        if (trimmed.includes('>>')) {
            const parts = trimmed.split('>>');
            commandToRun = parts[0].trim();
            redirectTarget = parts[1].trim();
            isAppend = true;
        } else if (trimmed.includes('>')) {
            const parts = trimmed.split('>');
            commandToRun = parts[0].trim();
            redirectTarget = parts[1].trim();
            isAppend = false;
        }

        // Tokenize
        const args = commandToRun.split(/\s+/);
        const cmd = args[0];

        // Execution logic
        switch (cmd) {
            case 'clear': {
                setOutputs([]);
                return;
            }

            case 'pwd': {
                newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: fsState.cwd });
                break;
            }

            case 'whoami': {
                newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: fsState.env.USER });
                break;
            }

            case 'echo': {
                let text = args.slice(1).join(' ');
                // Handle environment variables replacement
                text = text.replace(/\$([A-Z_]+)/g, (_, varName) => fsState.env[varName] || '');
                // Strip quotes
                text = text.replace(/^["']|["']$/g, '');

                if (redirectTarget) {
                    const targetPath = resolvePath(redirectTarget, fsState.cwd);
                    setFsState(prev => {
                        let targetInodeId = prev.files[targetPath];
                        const newInodes = { ...prev.inodes };
                        let nextId = prev.nextInode;

                        if (targetInodeId !== undefined) {
                            const cur = newInodes[targetInodeId];
                            const newContent = isAppend ? `${cur.content}${text}\n` : `${text}\n`;
                            newInodes[targetInodeId] = {
                                ...cur,
                                content: newContent,
                                size: newContent.length,
                                modifyTime: '16:20'
                            };
                        } else {
                            targetInodeId = nextId++;
                            newInodes[targetInodeId] = {
                                id: targetInodeId,
                                type: 'file',
                                permissions: '-rw-r--r--',
                                octal: 644,
                                owner: prev.env.USER,
                                group: 'users',
                                size: text.length + 1,
                                blocks: 8,
                                links: 1,
                                content: `${text}\n`,
                                modifyTime: '16:20'
                            };
                        }

                        return {
                            ...prev,
                            nextInode: nextId,
                            inodes: newInodes,
                            files: { ...prev.files, [targetPath]: targetInodeId }
                        };
                    });
                    newOutputs.push({ id: Math.random().toString(), type: 'info', text: `[Redirecció ${isAppend ? '>>' : '>'} cap a ${redirectTarget}]` });
                } else {
                    newOutputs.push({ id: Math.random().toString(), type: 'stdout', text });
                }
                break;
            }

            case 'cd': {
                const target = args[1] || '~';
                const targetPath = resolvePath(target, fsState.cwd);
                const targetInodeId = fsState.files[targetPath];

                if (targetInodeId === undefined) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `bash: cd: ${target}: No such file or directory` });
                } else {
                    const inode = fsState.inodes[targetInodeId];
                    if (inode.type !== 'dir') {
                        newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `bash: cd: ${target}: Not a directory` });
                    } else {
                        setFsState(prev => ({
                            ...prev,
                            cwd: targetPath,
                            env: { ...prev.env, PWD: targetPath }
                        }));
                    }
                }
                break;
            }

            case 'ls': {
                const flags = args.filter(a => a.startsWith('-')).join('');
                const targetArg = args.filter(a => !a.startsWith('-'))[1] || '.';
                const targetPath = resolvePath(targetArg, fsState.cwd);
                const targetInodeId = fsState.files[targetPath];

                if (targetInodeId === undefined) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `ls: cannot access '${targetArg}': No such file or directory` });
                    break;
                }

                const targetInode = fsState.inodes[targetInodeId];
                const showAll = flags.includes('a');
                const showLong = flags.includes('l');
                const showInode = flags.includes('i');

                if (targetInode.type === 'dir') {
                    const entries = getDirectoryEntries(targetPath);
                    const allEntries = [
                        ...(showAll ? [
                            { name: '.', fullPath: targetPath, inodeId: targetInodeId },
                            { name: '..', fullPath: resolvePath('..', targetPath), inodeId: fsState.files[resolvePath('..', targetPath)] || targetInodeId }
                        ] : []),
                        ...entries
                    ];

                    if (showLong) {
                        const lines = allEntries.map(e => {
                            const inod = fsState.inodes[e.inodeId] || {
                                permissions: '-rw-r--r--',
                                links: 1,
                                owner: 'alumne',
                                group: 'users',
                                size: 0,
                                modifyTime: '16:00',
                                type: 'file'
                            };
                            const inodeCol = showInode ? `${inod.id} ` : '';
                            const symlinkExtra = inod.type === 'symlink' ? ` -> ${inod.target}` : '';
                            return `${inodeCol}${inod.permissions} ${inod.links} ${inod.owner} ${inod.group} ${String(inod.size).padStart(5, ' ')} ${inod.modifyTime} ${e.name}${symlinkExtra}`;
                        });
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: `total ${allEntries.length * 4}\n` + lines.join('\n') });
                    } else {
                        const names = allEntries.map(e => (showInode ? `${e.inodeId} ` : '') + e.name).join('  ');
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: names });
                    }
                } else {
                    newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: targetArg });
                }
                break;
            }

            case 'mkdir': {
                const dirNames = args.slice(1).filter(a => !a.startsWith('-'));
                if (dirNames.length === 0) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'mkdir: missing operand' });
                    break;
                }

                setFsState(prev => {
                    const newInodes = { ...prev.inodes };
                    const newFiles = { ...prev.files };
                    let nextId = prev.nextInode;

                    // Increment links of current directory (contains '..')
                    const cwdInode = newInodes[prev.files[prev.cwd]];
                    if (cwdInode) {
                        cwdInode.links += dirNames.length;
                    }

                    for (const name of dirNames) {
                        const fullPath = resolvePath(name, prev.cwd);
                        if (newFiles[fullPath]) continue;

                        const id = nextId++;
                        newInodes[id] = {
                            id,
                            type: 'dir',
                            permissions: 'drwxr-xr-x',
                            octal: 755,
                            owner: prev.env.USER,
                            group: 'users',
                            size: 4096,
                            blocks: 8,
                            links: 2, // '.' and the name in parent
                            content: '',
                            modifyTime: '16:21'
                        };
                        newFiles[fullPath] = id;
                    }

                    return { ...prev, nextInode: nextId, inodes: newInodes, files: newFiles };
                });
                break;
            }

            case 'rmdir': {
                const target = args[1];
                if (!target) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'rmdir: missing operand' });
                    break;
                }
                const targetPath = resolvePath(target, fsState.cwd);
                const inodeId = fsState.files[targetPath];

                if (!inodeId) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `rmdir: failed to remove '${target}': No such file or directory` });
                    break;
                }

                const entries = getDirectoryEntries(targetPath);
                if (entries.length > 0) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `rmdir: failed to remove '${target}': Directory not empty` });
                    break;
                }

                setFsState(prev => {
                    const newFiles = { ...prev.files };
                    const newInodes = { ...prev.inodes };
                    delete newFiles[targetPath];
                    delete newInodes[inodeId];

                    const cwdInode = newInodes[prev.files[prev.cwd]];
                    if (cwdInode && cwdInode.links > 2) cwdInode.links -= 1;

                    return { ...prev, files: newFiles, inodes: newInodes };
                });
                break;
            }

            case 'rm': {
                const targets = args.slice(1).filter(a => !a.startsWith('-'));
                if (targets.length === 0) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'rm: missing operand' });
                    break;
                }

                setFsState(prev => {
                    const newFiles = { ...prev.files };
                    const newInodes = { ...prev.inodes };

                    for (const t of targets) {
                        const targetPath = resolvePath(t, prev.cwd);
                        const inodeId = newFiles[targetPath];
                        if (inodeId !== undefined) {
                            delete newFiles[targetPath];
                            const inode = newInodes[inodeId];
                            if (inode) {
                                inode.links -= 1;
                                // If hard link count reaches 0, inode is freed
                                if (inode.links <= 0) {
                                    delete newInodes[inodeId];
                                }
                            }
                        }
                    }
                    return { ...prev, files: newFiles, inodes: newInodes };
                });
                break;
            }

            case 'cat': {
                const target = args[1];
                if (!target) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'cat: missing file' });
                    break;
                }
                if (target.startsWith('/proc')) {
                    if (target.includes('status')) {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: 'Name:\tbash\nUmask:\t0022\nState:\tS (sleeping)\nTgid:\t3412\nPid:\t3412\nPPid:\t3411\nUid:\t1000\t1000\t1000\t1000\nGid:\t100\t100\t100\t100\nFDSize:\t256\nVmPeak:\t14840 kB\nVmSize:\t14820 kB\nVmData:\t2120 kB\nVmStk:\t136 kB\nVmExe:\t960 kB\nThreads:\t1\nSigBlk:\t0000000000010000\nSigIgn:\t0000000000384004\nSigCgt:\t000000004b813efb'
                        });
                        break;
                    }
                    if (target.includes('cmdline')) {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: '-bash'
                        });
                        break;
                    }
                    if (target.includes('environ')) {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: 'USER=alumne\nHOME=/home/alumne\nSHELL=/bin/bash\nPATH=/usr/bin:/bin:.\nPWD=/home/alumne'
                        });
                        break;
                    }
                    if (target.includes('stat')) {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: '3412 (bash) S 3411 3412 3412 34816 3892 4194304 3120 0 0 0 14 6 0 0 20 0 1 0 128912 15175680 985 18446744073709551615 1 1 0 0 0 0 0 65536 3670020 1260 0 0 0 17 0 0 0 0 0 0'
                        });
                        break;
                    }
                }

                const targetPath = resolvePath(target, fsState.cwd);
                const inodeId = fsState.files[targetPath];

                if (inodeId === undefined) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `cat: ${target}: No such file or directory` });
                    break;
                }

                const inode = fsState.inodes[inodeId];
                if (inode.type === 'symlink') {
                    // Check symlink target
                    const resolvedTarget = resolvePath(inode.target || '', fsState.cwd);
                    const targetIno = fsState.files[resolvedTarget];
                    if (targetIno === undefined) {
                        newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `cat: ${target}: No such file or directory (enllaç trencat!)` });
                        break;
                    }
                    const targetObj = fsState.inodes[targetIno];
                    newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: targetObj.content || '(fitxer buit)' });
                } else if (inode.type === 'dir') {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `cat: ${target}: Is a directory` });
                } else {
                    // Check read permission
                    if (!inode.permissions.includes('r')) {
                        newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `cat: ${target}: Permission denied` });
                    } else {
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: inode.content || '(fitxer buit)' });
                    }
                }
                break;
            }

            case 'stat': {
                const target = args[1] || '.';
                const targetPath = resolvePath(target, fsState.cwd);
                const inodeId = fsState.files[targetPath];

                if (inodeId === undefined) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `stat: cannot stat '${target}': No such file or directory` });
                    break;
                }

                const inod = fsState.inodes[inodeId];
                const statText = [
                    `  File: ${target}${inod.type === 'symlink' ? ` -> ${inod.target}` : ''}`,
                    `  Size: ${inod.size}        Blocks: ${inod.blocks}      IO Block: 4096   ${inod.type === 'dir' ? 'directory' : inod.type === 'symlink' ? 'symbolic link' : 'regular file'}`,
                    `Device: 801h/2049d    Inode: ${inod.id}       Links: ${inod.links}`,
                    `Access: (0${inod.octal}/${inod.permissions})  Uid: ( 1000/ ${inod.owner})   Gid: (  100/   ${inod.group})`,
                    `Access: 2026-10-04 16:00:00.000000000 +0200`,
                    `Modify: 2026-10-04 ${inod.modifyTime}:00.000000000 +0200`,
                    `Change: 2026-10-04 ${inod.modifyTime}:00.000000000 +0200`
                ].join('\n');

                newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: statText });
                setHighlightedInode(inod.id);
                break;
            }

            case 'ln': {
                const isSymlink = args.includes('-s');
                const fileArgs = args.slice(1).filter(a => !a.startsWith('-'));
                if (fileArgs.length < 2) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'ln: missing file operand' });
                    break;
                }

                const src = fileArgs[0];
                const dest = fileArgs[1];
                const srcPath = resolvePath(src, fsState.cwd);
                const destPath = resolvePath(dest, fsState.cwd);

                const srcInodeId = fsState.files[srcPath];

                if (srcInodeId === undefined && !isSymlink) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `ln: failed to access '${src}': No such file or directory` });
                    break;
                }

                setFsState(prev => {
                    const newFiles = { ...prev.files };
                    const newInodes = { ...prev.inodes };
                    let nextId = prev.nextInode;

                    if (isSymlink) {
                        // Soft link: New inode pointing textually to target
                        const symId = nextId++;
                        newInodes[symId] = {
                            id: symId,
                            type: 'symlink',
                            permissions: 'lrwxrwxrwx',
                            octal: 777,
                            owner: prev.env.USER,
                            group: 'users',
                            size: src.length,
                            blocks: 0,
                            links: 1,
                            content: src,
                            target: src,
                            modifyTime: '16:22'
                        };
                        newFiles[destPath] = symId;
                        setHighlightedInode(symId);
                    } else {
                        // Hard link: Shares the EXACT same inode!
                        newInodes[srcInodeId].links += 1;
                        newFiles[destPath] = srcInodeId;
                        setHighlightedInode(srcInodeId);
                    }

                    return { ...prev, nextInode: nextId, files: newFiles, inodes: newInodes };
                });
                break;
            }

            case 'namei': {
                const target = args[1];
                if (!target) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'namei: missing operand' });
                    break;
                }
                const targetPath = resolvePath(target, fsState.cwd);
                const inodeId = fsState.files[targetPath];

                if (inodeId === undefined) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `f: ${target}\n - ${target} - No such file or directory` });
                } else {
                    const inode = fsState.inodes[inodeId];
                    if (inode.type === 'symlink') {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: `f: ${target}\n l ${target} -> ${inode.target}\n   - ${inode.target}`
                        });
                    } else {
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: `f: ${target}\n - ${target}` });
                    }
                }
                break;
            }

            case 'readlink': {
                const target = args[1];
                if (!target) break;
                const targetPath = resolvePath(target, fsState.cwd);
                const inodeId = fsState.files[targetPath];
                if (inodeId !== undefined && fsState.inodes[inodeId].type === 'symlink') {
                    newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: fsState.inodes[inodeId].target || '' });
                }
                break;
            }

            case 'chmod': {
                const modeStr = args[1];
                const target = args[2];
                if (!modeStr || !target) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'chmod: falta operant (ex: chmod 755 fitxer o chmod u+x fitxer)' });
                    break;
                }
                const targetPath = resolvePath(target, fsState.cwd);
                const inodeId = fsState.files[targetPath];

                if (inodeId === undefined) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `chmod: no s'ha pogut accedir a '${target}': No existeix el fitxer o directori` });
                    break;
                }

                setFsState(prev => {
                    const newInodes = { ...prev.inodes };
                    const inode = { ...newInodes[inodeId] };

                    if (/^[0-7]{3}$/.test(modeStr)) {
                        inode.octal = parseInt(modeStr, 8);
                        const r = (n: number) => `${n & 4 ? 'r' : '-'}${n & 2 ? 'w' : '-'}${n & 1 ? 'x' : '-'}`;
                        const u = (inode.octal >> 6) & 7;
                        const g = (inode.octal >> 3) & 7;
                        const o = inode.octal & 7;
                        inode.permissions = `${inode.type === 'dir' ? 'd' : '-'}${r(u)}${r(g)}${r(o)}`;
                    } else {
                        // Symbolic modes like u+x, go-w, a=r, +x
                        let u = (inode.octal >> 6) & 7;
                        let g = (inode.octal >> 3) & 7;
                        let o = inode.octal & 7;

                        const match = modeStr.match(/^([ugoa]*)([-+=])([rwx]+)$/);
                        if (match) {
                            const [, who, op, perm] = match;
                            let mask = 0;
                            if (perm.includes('r')) mask |= 4;
                            if (perm.includes('w')) mask |= 2;
                            if (perm.includes('x')) mask |= 1;

                            const applyToU = !who || who.includes('u') || who.includes('a');
                            const applyToG = !who || who.includes('g') || who.includes('a');
                            const applyToO = !who || who.includes('o') || who.includes('a');

                            if (op === '+') {
                                if (applyToU) u |= mask;
                                if (applyToG) g |= mask;
                                if (applyToO) o |= mask;
                            } else if (op === '-') {
                                if (applyToU) u &= ~mask;
                                if (applyToG) g &= ~mask;
                                if (applyToO) o &= ~mask;
                            } else if (op === '=') {
                                if (applyToU) u = mask;
                                if (applyToG) g = mask;
                                if (applyToO) o = mask;
                            }
                            inode.octal = (u << 6) | (g << 3) | o;
                            const r = (n: number) => `${n & 4 ? 'r' : '-'}${n & 2 ? 'w' : '-'}${n & 1 ? 'x' : '-'}`;
                            inode.permissions = `${inode.type === 'dir' ? 'd' : '-'}${r(u)}${r(g)}${r(o)}`;
                        }
                    }

                    newInodes[inodeId] = inode;
                    return { ...prev, inodes: newInodes };
                });
                break;
            }

            case 'df': {
                const showInodes = args.includes('-i');
                if (showInodes) {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: 'Filesystem      Inodes   IUsed   IFree IUse% Mounted on\n/dev/sda1      1310720  145200 1165520   12% /\ntmpfs           500000       1  499999    1% /dev/shm'
                    });
                } else {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        40G   14G   24G  37% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm'
                    });
                }
                break;
            }

            case 'mount': {
                newOutputs.push({
                    id: Math.random().toString(),
                    type: 'stdout',
                    text: '/dev/sda1 on / type ext4 (rw,relatime,errors=remount-ro)\ntmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)\nproc on /proc type proc (rw,nosuid,nodev,noexec,relatime)'
                });
                break;
            }

            case 'export': {
                const assignment = args[1];
                if (!assignment) {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: Object.entries(fsState.env).map(([k, v]) => `declare -x ${k}="${v}"`).join('\n')
                    });
                    break;
                }
                const [varName, ...rest] = assignment.split('=');
                let varVal = rest.join('=');
                // Replace $VAR
                varVal = varVal.replace(/\$([A-Z_]+)/g, (_, n) => fsState.env[n] || '');
                setFsState(prev => ({
                    ...prev,
                    env: { ...prev.env, [varName]: varVal }
                }));
                break;
            }

            case 'env':
            case 'printenv': {
                newOutputs.push({
                    id: Math.random().toString(),
                    type: 'stdout',
                    text: Object.entries(fsState.env).map(([k, v]) => `${k}=${v}`).join('\n')
                });
                break;
            }

            case 'which': {
                const target = args[1];
                if (!target) break;

                const pathDirs = fsState.env.PATH.split(':');
                let found = false;

                for (const d of pathDirs) {
                    if (d === '.' && fsState.files[`${fsState.cwd}/${target}`]) {
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: `./${target}` });
                        found = true;
                        break;
                    }
                    if (target === 'ls' && d === '/usr/bin') {
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: '/usr/bin/ls' });
                        found = true;
                        break;
                    }
                    if (target === 'bash' && d === '/bin') {
                        newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: '/bin/bash' });
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `which: no ${target} in (${fsState.env.PATH})` });
                }
                break;
            }

            case 'tar': {
                const flags = args[1] || '';
                const archive = args[2] || '';
                const files = args.slice(3);

                if (flags.includes('c')) {
                    const tarName = archive || 'sessio01.tar.gz';
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: (files.length > 0 ? files : ['entrega.txt']).join('\n')
                    });
                    setFsState(prev => {
                        const targetPath = resolvePath(tarName, prev.cwd);
                        if (prev.files[targetPath]) return prev;
                        const newInodes = { ...prev.inodes };
                        const newFiles = { ...prev.files };
                        const id = prev.nextInode;
                        newInodes[id] = {
                            id,
                            type: 'file',
                            permissions: '-rw-r--r--',
                            octal: 644,
                            owner: prev.env.USER,
                            group: 'users',
                            size: 1024,
                            blocks: 8,
                            links: 1,
                            content: 'gzip compressed data, from Unix, original size 3420\n',
                            modifyTime: '16:30'
                        };
                        newFiles[targetPath] = id;
                        return { ...prev, nextInode: id + 1, inodes: newInodes, files: newFiles };
                    });
                } else if (flags.includes('t')) {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: '-rw-r--r-- alumne/users   3420 2026-10-04 16:30 entrega.txt'
                    });
                } else {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stderr',
                        text: 'tar: cal especificar una opció d\'operació (-c o -t)'
                    });
                }
                break;
            }

            case 'alias': {
                const assign = args.slice(1).join(' ');
                if (!assign) {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: Object.entries(fsState.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n')
                    });
                } else {
                    const match = assign.match(/^([a-zA-Z0-9_-]+)=['"]?(.*?)['"]?$/);
                    if (match) {
                        const [, name, cmdVal] = match;
                        setFsState(prev => ({
                            ...prev,
                            aliases: { ...prev.aliases, [name]: cmdVal }
                        }));
                    }
                }
                break;
            }

            case 'type': {
                const targetCmd = args[1];
                if (!targetCmd) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'type: cal especificar un nom de comanda' });
                    break;
                }
                const builtins = ['cd', 'pwd', 'echo', 'export', 'alias', 'exit', 'help', 'type'];
                if (builtins.includes(targetCmd)) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: `${targetCmd} is a shell builtin` });
                } else if (['ls', 'mkdir', 'rmdir', 'cp', 'rm', 'mv', 'cat', 'stat', 'ln', 'chmod', 'man', 'clear'].includes(targetCmd)) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stdout', text: `${targetCmd} is /usr/bin/${targetCmd}` });
                } else {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `bash: type: ${targetCmd}: not found` });
                }
                break;
            }

            case 'man': {
                let section: number | null = null;
                let page = '';

                if (args[1] === '1' || args[1] === '2' || args[1] === '3') {
                    section = parseInt(args[1], 10);
                    page = args[2] || '';
                } else {
                    page = args[1] || '';
                    if (args[2] === '1' || args[2] === '2' || args[2] === '3') {
                        section = parseInt(args[2], 10);
                    }
                }

                if (!page) {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: 'Quina pàgina de manual vols consultar? (ex: man write o man 2 write)' });
                    break;
                }

                const sectionKey = section ? `${page}(${section})` : null;
                let foundKey = (sectionKey && MAN_PAGES[sectionKey]) ? sectionKey : null;

                if (!foundKey && (!section || section === 1) && MAN_PAGES[page]) {
                    foundKey = page;
                } else if (!foundKey && section === 2 && MAN_PAGES[`${page}(2)`]) {
                    foundKey = `${page}(2)`;
                }

                if (foundKey && MAN_PAGES[foundKey]) {
                    setActiveManPage(foundKey);
                    setActiveTab('man');
                } else {
                    newOutputs.push({ 
                        id: Math.random().toString(), 
                        type: 'stderr', 
                        text: `No hi ha entrada de manual per a ${page}${section ? ` a la secció ${section}` : ''}. Prova amb: man write, man 2 write, man ls.` 
                    });
                }
                break;
            }

            case 'help': {
                newOutputs.push({
                    id: Math.random().toString(),
                    type: 'stdout',
                    text: 'GNU bash, versió 5.1.16(1)-release (x86_64-suse-linux)\nComandes integrades de la Shell suportades:\n  cd [dir], pwd, echo [$VAR], export [VAR=VAL], alias [NOM=CMD], exit, help'
                });
                break;
            }

            case 'ps': {
                const fullArgs = args.slice(1).join(' ');
                if (fullArgs.includes('-l')) {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: 'F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD\n0 S  1000  3412  3411  0  80   0 -  2450 wait   pts/0    00:00:00 bash\n0 R  1000  3892  3412  0  80   0 -  3120 -      pts/0    00:00:00 ps'
                    });
                } else if (fullArgs.includes('-u')) {
                    const user = args[2] || 'alumne';
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n${user}   3412  0.0  0.1  14820  3940 pts/0    Ss   16:00   0:00 -bash\n${user}   3892  0.0  0.0  11240  1820 pts/0    R+   16:25   0:00 ps ${fullArgs}`
                    });
                } else {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: '  PID TTY          TIME CMD\n 3412 pts/0    00:00:00 bash\n 3892 pts/0    00:00:00 ps'
                    });
                }
                break;
            }

            case 'kill': {
                if (args[1] === '-l') {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: ' 1) SIGHUP\t 2) SIGINT\t 3) SIGQUIT\t 4) SIGILL\t 5) SIGTRAP\n 6) SIGABRT\t 7) SIGBUS\t 8) SIGFPE\t 9) SIGKILL\t10) SIGUSR1\n11) SIGSEGV\t12) SIGUSR2\t13) SIGPIPE\t14) SIGALRM\t15) SIGTERM\n16) SIGSTKFLT\t17) SIGCHLD\t18) SIGCONT\t19) SIGSTOP\t20) SIGTSTP\n21) SIGTTIN\t22) SIGTTOU\t23) SIGURG\t24) SIGXCPU\t25) SIGXFSZ'
                    });
                } else {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: `[Senyal transmès al procés ${args[2] || args[1] || 'PID'}]`
                    });
                }
                break;
            }

            case 'make': {
                const sub = args[1];
                if (sub === 'clean') {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: 'rm -f *.o suma words listaParametros myPS myPS_v0 myPS2 myPS3 parsExec ProgA ProgB'
                    });
                } else {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: 'gcc -Wall -c mis_funciones.c -I.\ngcc -Wall -o suma suma.c mis_funciones.o -I.\ngcc -Wall -o words words.c\ngcc -Wall -o listaParametros listaParametros.c\ngcc -Wall -o myPS myPS.c'
                    });
                }
                break;
            }

            case 'gcc': {
                newOutputs.push({
                    id: Math.random().toString(),
                    type: 'stdout',
                    text: '(compilació completada sense errors)'
                });
                break;
            }

            case 'indent': {
                newOutputs.push({
                    id: Math.random().toString(),
                    type: 'stdout',
                    text: `Indentant codi font: ${args[1] || 'fitxer.c'}`
                });
                break;
            }

            default: {
                const cleanCmd = cmd.replace(/^\.\//, '');
                if (cleanCmd === 'ProgA') {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: 'ProgB(3895): val 1\nProgB(3894): val 2\nProgB(3893): val 3\nIter 0: Llib 4\nProgB(3898): val 1\nProgB(3897): val 2\nProgB(3896): val 3\nIter 1: Llib 4'
                    });
                } else if (cleanCmd === 'listaParametros') {
                    if (args.length <= 1) {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: 'Usage:listaParametros arg1 [arg2.. argn]\nAquest programa escriu per la seva sortida la llista d\'arguments que rep'
                        });
                    } else {
                        const lines = [`L'argument 0 és listaParametros`];
                        for (let i = 1; i < args.length; i++) {
                            lines.push(`L'argument ${i} és ${args[i]}`);
                        }
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: lines.join('\n')
                        });
                    }
                } else if (cleanCmd === 'suma') {
                    const numArgs = args.slice(1);
                    if (numArgs.length < 2) {
                        newOutputs.push({
                            id: Math.random().toString(),
                            type: 'stdout',
                            text: 'Usage: suma num1 num2 [num3... numN]\nAquest programa suma els nombres enters passats per línia de comandes.'
                        });
                    } else {
                        const invalidArg = numArgs.find(a => !/^-?\d+$/.test(a));
                        if (invalidArg) {
                            newOutputs.push({
                                id: Math.random().toString(),
                                type: 'stdout',
                                text: `Error: el paràmetre "${invalidArg}" no és un número`
                            });
                        } else {
                            const sum = numArgs.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
                            newOutputs.push({
                                id: Math.random().toString(),
                                type: 'stdout',
                                text: `La suma és ${sum}`
                            });
                        }
                    }
                } else if (cleanCmd === 'words') {
                    const textArg = args.slice(1).join(' ').trim();
                    const wordsCount = textArg ? textArg.split(/[\s,.\n]+/).filter(Boolean).length : 0;
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: `${wordsCount} paraules`
                    });
                } else if (cleanCmd === 'myPS' || cleanCmd === 'myPS_v0') {
                    const user = args[1] || 'alumne';
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: `Sóc el pare amb PID: 3412\nSóc el fill amb PID: 3892 i usuari: ${user}`
                    });
                } else if (cleanCmd === 'myPS2') {
                    const users = args.slice(1);
                    if (users.length === 0) users.push('alumne');
                    const lines = users.map((u, idx) => `[Fill ${3892 + idx}] executant ps per usuari ${u}... fet.`);
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: `Pare (PID 3412) executant fills de manera seqüencial:\n` + lines.join('\n')
                    });
                } else if (cleanCmd === 'myPS3') {
                    const users = args.slice(1);
                    if (users.length === 0) users.push('alumne');
                    const lines = [
                        `Pare (PID 3412): creats tots els fills en paral·lel.`,
                        ...users.map((u, idx) => `Fill (PID ${3895 + idx}) per usuari: ${u}`),
                        ...users.map((_, idx) => `Recollit fill PID ${3895 + idx}`),
                        `Pare: tots els fills han finalitzat.`
                    ];
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: lines.join('\n')
                    });
                } else if (cleanCmd === 'parsExec') {
                    newOutputs.push({
                        id: Math.random().toString(),
                        type: 'stdout',
                        text: "El argumento 0 es listaParametros\nEl argumento 1 es a\nEl argumento 2 es b\nUsage:listaParametros arg1 [arg2..argn]\nEste programa escribe por su salida la lista de argumentos que recibe\nEl argumento 0 es listaParametros\nEl argumento 1 es 25\nEl argumento 2 es 4\nEl argumento 0 es listaParametros\nEl argumento 1 es 1024\nEl argumento 2 es hola\nEl argumento 3 es adios"
                    });
                } else {
                    newOutputs.push({ id: Math.random().toString(), type: 'stderr', text: `bash: ${cmd}: command not found` });
                }
            }
        }

        setOutputs(prev => [...prev, ...newOutputs]);
    }, [fsState, getDirectoryEntries, resolvePath]);

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(inputVal);
        setInputVal('');
    };

    // Helper to calculate common prefix for autocompletion
    const getCommonPrefix = (strings: string[]): string => {
        if (strings.length === 0) return '';
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (!strings[i].toLowerCase().startsWith(prefix.toLowerCase())) {
                prefix = prefix.slice(0, -1);
                if (!prefix) return '';
            }
        }
        return prefix;
    };

    // Tab Autocompletion Engine
    const handleTabCompletion = () => {
        const raw = inputVal;
        if (!raw.trim()) return;

        const lastSpaceIdx = raw.lastIndexOf(' ');

        // A) Complete command name if no space yet
        if (lastSpaceIdx === -1) {
            const commands = [
                'ls', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cat', 'stat', 
                'chmod', 'ln', 'echo', 'whoami', 'clear', 'export', 'env', 
                'alias', 'which', 'df', 'mount', 'namei', 'readlink', 'man', 'help'
            ];
            const matches = commands.filter(c => c.startsWith(raw.toLowerCase()));
            if (matches.length === 1) {
                setInputVal(matches[0] + ' ');
            } else if (matches.length > 1) {
                const common = getCommonPrefix(matches);
                if (common.length > raw.length) {
                    setInputVal(common);
                } else {
                    setOutputs(prev => [
                        ...prev,
                        { id: Math.random().toString(), type: 'cmd', text: raw, path: fsState.cwd },
                        { id: Math.random().toString(), type: 'stdout', text: matches.join('  ') }
                    ]);
                }
            }
            return;
        }

        // B) Complete file or directory path argument
        const beforeArg = raw.slice(0, lastSpaceIdx + 1);
        const currentArg = raw.slice(lastSpaceIdx + 1);
        const commandPart = raw.slice(0, lastSpaceIdx).trim().split(/\s+/)[0];

        let searchDirPath = fsState.cwd;
        let pathPrefix = '';
        let searchTerm = currentArg;

        if (currentArg.includes('/')) {
            const lastSlash = currentArg.lastIndexOf('/');
            pathPrefix = currentArg.slice(0, lastSlash + 1);
            searchTerm = currentArg.slice(lastSlash + 1);
            searchDirPath = resolvePath(pathPrefix, fsState.cwd);
        }

        const dirEntries = getDirectoryEntries(searchDirPath);
        let candidateMatches = dirEntries.map(e => {
            const inode = fsState.inodes[e.inodeId];
            const isDir = inode?.type === 'dir';
            return { name: e.name, isDir };
        });

        // If command is cd or rmdir, prioritize directories
        if (commandPart === 'cd' || commandPart === 'rmdir') {
            const dirOnly = candidateMatches.filter(m => m.isDir);
            if (dirOnly.some(m => m.name.toLowerCase().startsWith(searchTerm.toLowerCase()))) {
                candidateMatches = dirOnly;
            }
        }

        const matching = candidateMatches.filter(m => 
            m.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );

        if (matching.length === 1) {
            const m = matching[0];
            const completed = beforeArg + pathPrefix + m.name + (m.isDir ? '/' : ' ');
            setInputVal(completed);
        } else if (matching.length > 1) {
            const names = matching.map(m => m.name);
            const common = getCommonPrefix(names);
            if (common.length > searchTerm.length) {
                setInputVal(beforeArg + pathPrefix + common);
            } else {
                setOutputs(prev => [
                    ...prev,
                    { id: Math.random().toString(), type: 'cmd', text: raw, path: fsState.cwd },
                    { id: Math.random().toString(), type: 'stdout', text: names.map((n, i) => matching[i].isDir ? n + '/' : n).join('  ') }
                ]);
            }
        }
    };

    // Handle History navigation & Tab autocompletion
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion();
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
            setHistoryIdx(nextIdx);
            setInputVal(history[nextIdx] || '');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx === -1) return;
            const nextIdx = historyIdx + 1;
            if (nextIdx >= history.length) {
                setHistoryIdx(-1);
                setInputVal('');
            } else {
                setHistoryIdx(nextIdx);
                setInputVal(history[nextIdx] || '');
            }
        }
    };

    // Current directory entries for the Right Panel (Finder / Inodes view)
    const currentEntries = useMemo(() => {
        const rawEntries = getDirectoryEntries(fsState.cwd);
        return rawEntries.map(entry => {
            const inode = fsState.inodes[entry.inodeId] || {
                id: entry.inodeId,
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'alumne',
                group: 'users',
                size: 0,
                links: 1,
                content: ''
            };

            const isBrokenSymlink = inode.type === 'symlink' && (
                !inode.target || fsState.files[resolvePath(inode.target, fsState.cwd)] === undefined
            );

            return {
                ...entry,
                inode,
                isBrokenSymlink
            };
        }).sort((a, b) => {
            if (a.inode.type === 'dir' && b.inode.type !== 'dir') return -1;
            if (a.inode.type !== 'dir' && b.inode.type === 'dir') return 1;
            return a.name.localeCompare(b.name);
        });
    }, [fsState.cwd, fsState.files, fsState.inodes, getDirectoryEntries, resolvePath]);

    // Handle interactive item click (open dir with cd or show file with cat)
    const handleItemClick = (item: { name: string; inode: Inode; isBrokenSymlink?: boolean }) => {
        if (item.inode.type === 'dir') {
            executeCommand(`cd ${item.name}`);
        } else if (item.inode.type === 'symlink') {
            const resolved = resolvePath(item.inode.target || '', fsState.cwd);
            const targetId = fsState.files[resolved];
            if (targetId && fsState.inodes[targetId]?.type === 'dir') {
                executeCommand(`cd ${item.name}`);
            } else {
                executeCommand(`cat ${item.name}`);
            }
        } else {
            // File: execute cat to display content in terminal
            executeCommand(`cat ${item.name}`);
        }
        setHighlightedInode(item.inode.id);
    };

    const canGoUp = fsState.cwd !== '/' && fsState.cwd !== '';
    const handleGoUp = () => {
        executeCommand('cd ..');
    };

    // Active man page data
    const manData = activeManPage ? MAN_PAGES[activeManPage] : null;

    // Terminal and Man Page View renderer
    const renderTerminalView = () => (
        activeManPage && manData ? (
            /* Man Page Interactive Pager */
            <div className="flex-1 flex flex-col bg-[#090a0f] text-zinc-300 overflow-hidden font-mono text-xs relative">
                <div className="bg-white/[0.02] border-b border-white/[0.06] px-4 py-2 flex items-center justify-between shrink-0">
                    <span className="text-amber-400 font-medium tracking-wide flex items-center gap-2">
                        <BookOpen size={12} />
                        MANUAL: {manData.name} ({manData.section})
                    </span>
                    <button
                        type="button"
                        onClick={() => setActiveManPage(null)}
                        className="text-xs px-2 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] rounded border border-white/[0.06] text-zinc-300 transition flex items-center gap-1 cursor-pointer"
                    >
                        <X size={11} /> Sortir (q)
                    </button>
                </div>
                <div className="flex-1 p-5 overflow-y-auto overscroll-contain custom-scrollbar space-y-4 leading-relaxed">
                    <div>
                        <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-1">NAME</div>
                        <div className="pl-4 text-zinc-200">{manData.name}</div>
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-1">SYNOPSIS</div>
                        <div className="pl-4 text-zinc-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] whitespace-pre-wrap">{manData.synopsis}</div>
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-1">DESCRIPTION</div>
                        <div className="pl-4 text-zinc-300">{manData.desc}</div>
                    </div>
                    {manData.options.length > 0 && (
                        <div>
                            <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-1">OPTIONS</div>
                            <div className="pl-4 space-y-2 mt-1">
                                {manData.options.map(([opt, desc], idx) => (
                                    <div key={idx} className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
                                        <span className="text-amber-300/90 font-medium">{opt}</span>
                                        <p className="text-zinc-400 text-xs mt-0.5">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mb-1">SEE ALSO</div>
                        <div className="pl-4 text-zinc-400">{manData.seeAlso}</div>
                    </div>
                </div>
                <div className="bg-white/[0.02] border-t border-white/[0.06] px-4 py-1.5 text-[11px] text-zinc-500 flex items-center justify-between shrink-0">
                    <span>Prem <kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300">q</kbd> per tancar el manual</span>
                    <span>Linux Man-Pages</span>
                </div>
            </div>
        ) : (
            /* Interactive Bash Terminal */
            <div 
                className="flex-1 flex flex-col bg-[#090a0f] p-4 overflow-hidden cursor-text"
                onClick={() => inputRef.current?.focus({ preventScroll: true })}
            >
                <div ref={terminalScrollRef} className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar font-mono text-xs space-y-1.5 pr-1">
                    {outputs.map((out) => (
                        <div key={out.id} className="leading-relaxed">
                            {out.type === 'cmd' ? (
                                <div className="flex items-center gap-1.5 text-zinc-300">
                                    <span className="text-emerald-400 font-medium">{fsState.env.USER}@opensuse</span>
                                    <span className="text-zinc-500">:</span>
                                    <span className="text-sky-400">{out.path === fsState.env.HOME ? '~' : out.path}&gt;</span>
                                    <span className="text-zinc-100 font-medium ml-0.5">{out.text}</span>
                                </div>
                            ) : out.type === 'stderr' ? (
                                <div className="text-rose-400 whitespace-pre-wrap">
                                    {out.text}
                                </div>
                            ) : out.type === 'info' ? (
                                <div className="text-zinc-500 whitespace-pre-line text-[11px]">
                                    {out.text}
                                </div>
                            ) : (
                                <div className="text-zinc-300 whitespace-pre-wrap">
                                    {out.text}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Active Input Line */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
                        <span className="text-emerald-400 font-medium shrink-0">{fsState.env.USER}@opensuse</span>
                        <span className="text-zinc-500 shrink-0">:</span>
                        <span className="text-sky-400 shrink-0">{fsState.cwd === fsState.env.HOME ? '~' : fsState.cwd}&gt;</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            className="flex-1 min-w-0 bg-transparent text-zinc-100 outline-none font-mono text-xs border-none p-0 focus:ring-0 placeholder:text-zinc-600 caret-emerald-400 ml-0.5"
                            placeholder="Escriu una comanda (prem Enter per executar)..."
                        />
                        {inputVal.trim() && (
                            <button
                                type="submit"
                                className="px-2 py-0.5 rounded text-[11px] font-mono font-medium transition flex items-center gap-1 bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 hover:text-white border border-white/[0.1] active:scale-95 shrink-0 shadow-sm cursor-pointer"
                                title="Prem Enter o fes clic per executar"
                            >
                                <span>↵ Enter</span>
                            </button>
                        )}
                    </form>

                    {/* Quick Command Suggestions */}
                    {suggestionList.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04] text-[11px] font-mono shrink-0">
                            <span className="text-zinc-500">Prova:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {suggestionList.map((cmd) => (
                                    <button
                                        key={cmd}
                                        type="button"
                                        onClick={() => {
                                            setInputVal(cmd);
                                            inputRef.current?.focus({ preventScroll: true });
                                        }}
                                        className={`px-2 py-0.5 rounded text-xs transition border flex items-center gap-1 cursor-pointer ${
                                            inputVal === cmd
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium'
                                                : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        <code>{cmd}</code>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    );

    return (
        <div 
            className={`not-prose flex flex-col bg-[#09090b] overflow-hidden shadow-2xl font-sans transition duration-300 ease-out origin-center
            ${isFullscreen
                ? 'fixed inset-0 z-[99999] h-dvh w-full rounded-none m-0 bg-[#09090b]'
                : isCompact && !showFiles
                    ? `relative w-full z-10 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] my-6 ${activeManPage ? 'h-[440px]' : 'min-h-[175px] max-h-[380px]'}`
                    : 'relative w-full z-10 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] my-8 h-[580px] max-h-[90vh]'
            }`}
        >
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 inline-block shadow-sm"></span>
                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 inline-block shadow-sm"></span>
                        <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 inline-block shadow-sm"></span>
                    </div>
                    <div className="h-3.5 w-px bg-white/[0.08] mx-0.5 shrink-0"></div>
                    <div className="flex items-center gap-2 text-xs font-mono truncate">
                        <span className="text-zinc-200 font-medium truncate">
                            {title || (command ? `Terminal — ${command}` : 'openSUSE Leap 15.4')}
                        </span>
                        {!title && !command && (
                            <>
                                <span className="text-zinc-600">/</span>
                                <span className="text-zinc-400">Bash 5.1</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Compact mode files toggle */}
                    {isCompact && (
                        <button
                            type="button"
                            onClick={() => setShowFiles(prev => !prev)}
                            className={`px-2.5 py-1 text-xs rounded-md transition flex items-center gap-1.5 border cursor-pointer ${
                                showFiles 
                                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' 
                                    : 'text-zinc-400 hover:text-zinc-200 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06]'
                            }`}
                            title={showFiles ? "Amagar panell de fitxers" : "Veure explorador de fitxers"}
                        >
                            <Folder size={11} className={showFiles ? "text-sky-400" : "text-zinc-400"} />
                            <span className="hidden sm:inline text-[11px] font-mono">Fitxers</span>
                        </button>
                    )}

                    {/* View Mode Toggle Button: Finder vs Inodes (when files panel is shown) */}
                    {showFiles && (
                        <button
                            type="button"
                            onClick={() => setViewMode(prev => prev === 'finder' ? 'inodes' : 'finder')}
                            className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-md transition flex items-center gap-1.5 border border-white/[0.08] cursor-pointer"
                            title={viewMode === 'finder' ? "Mostrar vista tècnica d'Inodes i permisos" : "Tornar a la vista gràfica de carpetes"}
                        >
                            {viewMode === 'finder' ? (
                                <>
                                    <Layers size={11} className="text-zinc-400" />
                                    <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">Inodes</span>
                                </>
                            ) : (
                                <>
                                    <LayoutGrid size={11} className="text-zinc-400" />
                                    <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">Carpetes</span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setFsState(createInitialState());
                            setOutputs(
                                isCompact && prefilledCmd
                                    ? [{ id: 'reset', type: 'info', text: 'Entorn restablert. Prem Enter (↵) per provar la comanda.' }]
                                    : [{ id: 'reset', type: 'info', text: 'Entorn restablert a l\'estat inicial.' }]
                            );
                            setActiveManPage(null);
                            setInputVal(prefilledCmd);
                        }}
                        className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition flex items-center gap-1.5 border border-white/[0.06] cursor-pointer"
                        title="Restableix el sistema de fitxers i el terminal"
                    >
                        <RotateCcw size={11} />
                        <span className="hidden sm:inline text-[11px] font-mono">Reiniciar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition border border-white/[0.06] cursor-pointer"
                        title={isFullscreen ? 'Minimitzar' : 'Pantalla completa'}
                    >
                        {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
                    </button>
                </div>
            </div>

            {/* Mobile Tab Switcher */}
            {showFiles && (
                <div className="flex lg:hidden border-b border-white/[0.06] bg-[#09090b]">
                    <button
                        type="button"
                        onClick={() => setActiveTab('term')}
                        className={`flex-1 py-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
                            activeTab === 'term' ? 'text-zinc-200 bg-white/[0.04] border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <TerminalIcon size={12} /> Consola
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('fs')}
                        className={`flex-1 py-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
                            activeTab === 'fs' ? 'text-zinc-200 bg-white/[0.04] border-b-2 border-sky-400' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <Folder size={12} /> {viewMode === 'finder' ? 'Fitxers' : 'Inodes'}
                    </button>
                    {activeManPage && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('man')}
                            className={`flex-1 py-2 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
                                activeTab === 'man' ? 'text-zinc-200 bg-white/[0.04] border-b-2 border-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <BookOpen size={12} /> man {activeManPage}
                        </button>
                    )}
                </div>
            )}

            {/* Main Workspace */}
            {showFiles ? (
                <div className="flex-1 flex overflow-hidden">
                    <Group orientation="horizontal">
                        {/* Left Panel: Terminal & Man View */}
                        <Panel defaultSize={55} minSize={30} className={`flex flex-col h-full ${activeTab === 'term' || activeTab === 'man' ? 'flex' : 'hidden lg:flex'}`}>
                            {renderTerminalView()}
                        </Panel>

                        <Separator className="w-1 bg-transparent hover:bg-white/[0.08] transition-colors cursor-col-resize flex justify-center items-center z-20 group">
                            <div className="h-6 w-0.5 bg-white/[0.08] group-hover:bg-zinc-400 rounded-full transition-colors" />
                        </Separator>

                    {/* Right Panel: Graphical Folder Manager (Default) or Inodes View */}
                    <Panel defaultSize={45} minSize={25} className={`flex flex-col h-full bg-[#09090b] border-l border-white/[0.06] ${activeTab === 'fs' ? 'flex' : 'hidden lg:flex'}`}>
                        {/* Current path / navigation bar (Replaces "INODES & FITXERS") */}
                        <div className="bg-white/[0.02] border-b border-white/[0.06] px-3.5 py-2 flex items-center justify-between shrink-0 h-10">
                            <div className="flex items-center gap-1.5 min-w-0">
                                {canGoUp && (
                                    <button
                                        type="button"
                                        onClick={handleGoUp}
                                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition shrink-0"
                                        title="Directori superior (cd ..)"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                )}
                                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 font-medium truncate">
                                    <span className="text-zinc-500">/</span>
                                    <span>{fsState.cwd === fsState.env.HOME ? '~' : fsState.cwd.replace(fsState.env.HOME, '~')}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.05] shrink-0">
                                {currentEntries.length} {currentEntries.length === 1 ? 'element' : 'elements'}
                            </span>
                        </div>

                        {/* View Content: Graphical Finder (Default) vs Technical Inodes List */}
                        {viewMode === 'finder' ? (
                            /* Graphical Folder View (Finder / Explorer style) */
                            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                                {currentEntries.length === 0 && !canGoUp ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-xs text-center p-6">
                                        <Folder size={36} className="text-zinc-700 mb-2 stroke-[1.2]" />
                                        <p className="text-zinc-400 font-medium">Aquest directori és buit</p>
                                        <p className="text-[11px] text-zinc-600 mt-1">Crea fitxers amb <code className="text-zinc-400 bg-white/[0.05] px-1 py-0.5 rounded">touch nom</code> o carpetes amb <code className="text-zinc-400 bg-white/[0.05] px-1 py-0.5 rounded">mkdir nom</code></p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {canGoUp && (
                                            <div
                                                onClick={handleGoUp}
                                                className="group flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer select-none border border-transparent hover:border-white/[0.05]"
                                                title="Directori superior (cd ..)"
                                            >
                                                <div className="relative mb-2 transition-transform duration-200 group-hover:scale-105">
                                                    <MacOSFolderIcon />
                                                    <span className="absolute -top-1 -right-1 bg-zinc-800 text-zinc-300 text-[9px] font-mono px-1 rounded border border-white/10">
                                                        ..
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 text-center truncate w-full">
                                                    ..
                                                </span>
                                            </div>
                                        )}
                                        {currentEntries.map(item => {
                                            const ext = item.name.includes('.') ? item.name.split('.').pop() : '';
                                            return (
                                                <div
                                                    key={item.fullPath}
                                                    onClick={() => handleItemClick(item)}
                                                    className="group flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition cursor-pointer select-none border border-transparent hover:border-white/[0.05]"
                                                    title={item.inode.type === 'dir' ? `Obrir directori ${item.name}` : `Veure contingut (cat ${item.name})`}
                                                >
                                                    <div className="relative mb-2 transition-transform duration-200 group-hover:scale-105">
                                                        {item.inode.type === 'dir' ? (
                                                            <MacOSFolderIcon />
                                                        ) : item.inode.type === 'symlink' ? (
                                                            <MacOSSymlinkIcon />
                                                        ) : (
                                                            <MacOSFileIcon ext={ext} />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-mono text-zinc-300 group-hover:text-white text-center truncate w-full px-1">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Inodes & Permissions Detailed List View */
                            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-1.5">
                                {canGoUp && (
                                    <div
                                        onClick={handleGoUp}
                                        className="group px-3 py-2 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] transition cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-xs font-mono"
                                    >
                                        <ChevronLeft size={13} />
                                        <span>.. (Directori superior)</span>
                                    </div>
                                )}
                                {currentEntries.map((item) => {
                                    const isHighlighted = highlightedInode === item.inode.id;
                                    return (
                                        <div
                                            key={item.fullPath}
                                            onClick={() => handleItemClick(item)}
                                            className={`group px-3 py-2 rounded-xl border transition cursor-pointer ${
                                                item.isBrokenSymlink
                                                    ? 'bg-rose-500/[0.06] border-rose-500/30 hover:border-rose-500/50'
                                                    : isHighlighted
                                                    ? 'bg-emerald-500/[0.08] border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                                                    : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04]'
                                            }`}
                                            title={item.inode.type === 'dir' ? `Entrar a directori ${item.name}` : `Executar cat ${item.name}`}
                                        >
                                            {/* Top row: Name, Type, Inode Badge */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {item.inode.type === 'dir' ? (
                                                        <Folder size={13} className="text-amber-400/90 shrink-0" />
                                                    ) : item.inode.type === 'symlink' ? (
                                                        <Link2 size={13} className="text-violet-400 shrink-0" />
                                                    ) : (
                                                        <FileText size={13} className="text-zinc-400 shrink-0" />
                                                    )}
                                                    <span className="font-mono text-xs font-medium text-zinc-200 truncate">
                                                        {item.name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition ${
                                                        isHighlighted
                                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                            : 'bg-zinc-900/90 text-zinc-400 border-white/[0.08] group-hover:border-zinc-700'
                                                    }`}>
                                                        #{item.inode.id}
                                                    </span>
                                                </div>
                                            </div>

                                            {item.inode.type === 'symlink' && (
                                                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 mt-1 pl-5">
                                                    <span className="text-zinc-600">→</span>
                                                    <span className={item.isBrokenSymlink ? 'text-rose-400 line-through' : 'text-violet-300'}>
                                                        {item.inode.target}
                                                    </span>
                                                    {item.isBrokenSymlink && (
                                                        <span className="text-[9px] text-rose-400 font-semibold bg-rose-500/10 px-1 py-0.2 rounded border border-rose-500/20">
                                                            trencat
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500 pl-5">
                                                <span className="text-zinc-400">{item.inode.permissions}</span>
                                                <span className="text-zinc-600">·</span>
                                                <span className={item.inode.links > 1 ? 'text-emerald-400 font-medium' : 'text-zinc-400'}>
                                                    {item.inode.links} {item.inode.links === 1 ? 'link' : 'links'}
                                                </span>
                                                <span className="text-zinc-600">·</span>
                                                <span className="text-zinc-400">{item.inode.size} B</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Panel>
                </Group>
            </div>
        ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
                {renderTerminalView()}
            </div>
        )}
    </div>
);
}
