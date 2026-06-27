export interface CFGSModule {
    name: string;
    credits: number;
}

export interface CFGSDegree {
    id: string;
    title: string;
    modules: CFGSModule[];
}

export const CFGS_DEGREES: CFGSDegree[] = [
    {
        id: 'daw_loe',
        title: "Desenvolupament d'aplicacions web (LOE)",
        modules: [
            { name: "Desenvolupament d'aplicacions web", credits: 6.0 },
            { name: "Empresa i iniciativa emprenedora", credits: 6.0 },
            { name: "Gestió de bases de dades", credits: 6.0 },
            { name: "Sistemes informàtics", credits: 6.0 },
            { name: "Xarxes, Internet i aplicacions web", credits: 6.0 }
        ]
    },
    {
        id: 'dai_logse',
        title: "Desenvolupament d'aplicacions informàtiques (LOGSE)",
        modules: [
            { name: "Sistemes informàtics", credits: 6.0 },
            { name: "Desenvolupament d'aplicacions multiplataforma", credits: 6.0 },
            { name: "Empresa i iniciativa emprenedora", credits: 6.0 },
            { name: "Xarxes, Internet i aplicacions web", credits: 6.0 },
            { name: "Gestió de bases de dades", credits: 6.0 }
        ]
    },
    {
        id: 'dam_loe',
        title: "Desenvolupament d'aplicacions multiplataforma (LOE)",
        modules: [
            { name: "Gestió de bases de dades", credits: 6.0 },
            { name: "Desenvolupament d'aplicacions multiplataforma", credits: 6.0 },
            { name: "Empresa i iniciativa emprenedora", credits: 6.0 },
            { name: "Xarxes, Internet i aplicacions web", credits: 6.0 },
            { name: "Sistemes informàtics", credits: 6.0 }
        ]
    },
    {
        id: 'asix_loe',
        title: "Administració de sistemes informàtics en xarxa (LOE)",
        modules: [
            { name: "Sistemes informàtics", credits: 6.0 },
            { name: "Gestió de bases de dades", credits: 6.0 },
            { name: "Empresa i iniciativa emprenedora", credits: 6.0 },
            { name: "Xarxes, internet i aplicacions web", credits: 6.0 },
            { name: "Gestió de sistemes operatius i xarxes de computadors", credits: 6.0 }
        ]
    },
    {
        id: 'asi_logse',
        title: "Administració de Sistemes Informàtics (LOGSE)",
        modules: [
            { name: "Empresa i iniciativa emprenedora", credits: 6.0 },
            { name: "Gestió de sistemes operatius i xarxes de computadors", credits: 6.0 },
            { name: "Gestió de bases de dades", credits: 6.0 },
            { name: "Xarxes, Internet i aplicacions web", credits: 6.0 },
            { name: "Sistemes informàtics", credits: 6.0 }
        ]
    }
];
