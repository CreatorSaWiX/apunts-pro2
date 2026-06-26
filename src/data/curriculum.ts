export const geiBaseNodes = [
    // Q1
    'F', 'FM', 'IC', 'PRO1',
    // Q2
    'M1', 'M2', 'PRO2', 'EC',
    // Q3
    'EDA', 'PE', 'SO', 'CI', 'BD',
    // Q4
    'EEE', 'IDI', 'IES', 'AC', 'XC',
    // Q5
    'PROP', 'PAR'
];

export const geiBaseEdges = [
    // Precorequisits i Prerequisits (Simplificats com edges visuals)
    { source: 'F', target: 'EDA' },
    { source: 'FM', target: 'PE' },
    { source: 'IC', target: 'EC' },
    { source: 'PRO1', target: 'PRO2' },
    { source: 'PRO1', target: 'EDA' },
    { source: 'PRO1', target: 'PROP' },
    { source: 'M1', target: 'PE' },
    { source: 'M1', target: 'SO' },
    { source: 'EC', target: 'SO' },
    { source: 'EC', target: 'AC' },
    { source: 'EC', target: 'CI' },
    { source: 'EC', target: 'XC' },
    { source: 'M2', target: 'PE' },
    { source: 'PRO2', target: 'EDA' },
    { source: 'PRO2', target: 'PROP' },
    { source: 'PRO2', target: 'PAR' },
    { source: 'PRO2', target: 'IES' },
    { source: 'EDA', target: 'IES' },
    { source: 'BD', target: 'IES' }
];

// Helper to determine base ECTS based on acronym (default 6, 7.5 for some Q1/Q2)
export const getCreditsForSubject = (acronym: string): number => {
    const q1q2 = ['F', 'FM', 'IC', 'PRO1', 'M1', 'M2', 'PRO2', 'EC'];
    if (q1q2.includes(acronym)) return 7.5;
    if (acronym === 'TFG') return 18;
    if (acronym === 'TFM') return 30; // Depèn del màster, posem 30 estàndard
    return 6;
};

// Helper to assign strict semester columns for the Grid layout
export const getSemesterForSubject = (acronym: string): number => {
    const semesters: Record<string, number> = {
        'F': 1, 'FM': 1, 'IC': 1, 'PRO1': 1,
        'M1': 2, 'M2': 2, 'PRO2': 2, 'EC': 2,
        'EDA': 3, 'PE': 3, 'SO': 3, 'CI': 3, 'BD': 3,
        'EEE': 4, 'IDI': 4, 'IES': 4, 'AC': 4, 'XC': 4,
        'PROP': 5, 'PAR': 5,
        // Computació
        'A': 5, 'G': 5, 'IA': 5,
        'LI': 6, 'LP': 6, 'TC': 6,
        // Enginyeria del Software
        'AS': 5, 'ASW': 5, 'DBD': 5,
        'ER': 6, 'GPS': 6, 'PES': 6,
        // Enginyeria de Computadors
        'AC2': 5, 'DSBM': 5, 'MP': 5,
        'PEC': 6, 'SO2': 6, 'XC2': 6,
        // Sistemes d'Informació
        'ADEI': 5, 'DSI': 5, 'NE': 5,
        'PSI': 6, 'SIO': 6, 'ABD': 6, // Nota: poden variar, poso Q5 i Q6 per quadrar la graella
        // Tecnologies de la Informació (assignació suggerida per la graella visual)
        'ASO': 5, 'PI': 5, 'PTI': 5,
        'SI': 6, 'SOA': 6, 'TXC': 6,
    };
    return semesters[acronym] || 8; // Default to row 8 if not defined
};

export interface SpecializationData {
    id: string;
    name: string;
    mandatory: string[];
    complementary: string[];
    description: string;
    whyChoose: string;
    roles: string[];
    benefits: string[];
    themeColor: 'indigo' | 'emerald' | 'sky' | 'amber' | 'rose';
}

export const specializations: SpecializationData[] = [
    {
        id: 'C',
        name: 'Computació',
        mandatory: ['A', 'G', 'IA', 'LI', 'LP', 'TC'],
        complementary: ['AA', 'APA', 'CAIM', 'CL', 'CN', 'IO', 'SID'],
        description: "Aprofundeix en els fonaments matemàtics i algorísmics de la informàtica. Domina la Intel·ligència Artificial, el disseny d'algorismes avançats i l'optimització de sistemes complexos.",
        whyChoose: "Si t'apassiona resoldre problemes complexos, entendre com funcionen els llenguatges per sota i crear IA des de zero.",
        roles: ["AI/ML Engineer", "Algorithm Researcher", "Data Scientist", "Graphics Engineer"],
        benefits: ["Gran demanda en sectors d'IA", "Base matemàtica sòlida", "Capacitat de resoldre problemes inèdits"],
        themeColor: 'indigo'
    },
    {
        id: 'EC',
        name: 'Enginyeria de Computadors',
        mandatory: ['AC2', 'DSBM', 'MP', 'PEC', 'SO2', 'XC2'],
        complementary: ['CASO', 'CPD', 'PAP', 'PCA', 'PDS', 'STR', 'VLSI'],
        description: "Connecta el món del software amb l'electrònica. Dissenya arquitectures de microprocessadors, sistemes encastats, IoT i aprèn a esprémer al màxim el rendiment del maquinari.",
        whyChoose: "Si vols entendre com funciona realment un ordinador i dissenyar els dispositius que connectaran el món del futur.",
        roles: ["Hardware Engineer", "Embedded Systems Developer", "IoT Architect", "Systems Programmer"],
        benefits: ["Molt pràctic i tangible", "Indispensable per a robòtica i IoT", "Poca competència de programadors purs"],
        themeColor: 'emerald'
    },
    {
        id: 'ES',
        name: 'Enginyeria del Software',
        mandatory: ['AS', 'ASW', 'DBD', 'ER', 'GPS', 'PES'],
        complementary: ['CAP', 'CBDE', 'CSI', 'ECSDI', 'SIM', 'SOAD'],
        description: "Especialitza't en el cicle de vida complet de grans sistemes de programari. Aprèn arquitectura, gestió de projectes, assegurament de la qualitat i metodologies àgils.",
        whyChoose: "Si el teu objectiu és liderar equips, dissenyar arquitectures escalables i construir productes de software de gran impacte.",
        roles: ["Software Architect", "Full Stack Engineer", "Project Manager", "QA Lead"],
        benefits: ["Alta versatilitat laboral", "Preparació per a rols de lideratge", "Domini de metodologies professionals"],
        themeColor: 'sky'
    },
    {
        id: 'SI',
        name: 'Sistemes d\'Informació',
        mandatory: ['ADEI', 'DSI', 'NE', 'PSI', 'SIO', 'ABD'],
        complementary: ['EDO', 'MI', 'VPE'],
        description: "Alinea la tecnologia amb les estratègies de negoci. Aprèn a dissenyar, integrar i auditar sistemes d'informació empresarials complexos maximitzant-ne el valor corporatiu.",
        whyChoose: "Si tens visió de negoci i vols ser el pont entre la direcció estratègica i la implementació tecnològica.",
        roles: ["IT Consultant", "Business Analyst", "Data Engineer", "ERP Specialist"],
        benefits: ["Visió holística empresa-tecnologia", "Carrera en consultoria", "Gestió de grans volums de dades corporatives"],
        themeColor: 'amber'
    },
    {
        id: 'TI',
        name: 'Tecnologies de la Informació',
        mandatory: ['ASO', 'PI', 'PTI', 'SI', 'SOA', 'TXC'],
        complementary: ['AD', 'CASO', 'CPD', 'IM', 'SDX', 'TCI'],
        description: "Domina el desplegament, configuració i manteniment d'infraestructures tecnològiques. Sigues expert en xarxes, ciberseguretat, sistemes operatius i integració de serveis.",
        whyChoose: "Si gaudeixes amb el hacking ètic, el disseny de xarxes de telecomunicacions i l'administració de grans servidors cloud.",
        roles: ["Cloud Architect", "Cybersecurity Analyst", "DevOps Engineer", "Network Administrator"],
        benefits: ["Demanda explosiva en ciberseguretat", "Fonamental en l'era del Cloud Computing", "Perfil hiper-tècnic i indispensable"],
        themeColor: 'rose'
    }
];
