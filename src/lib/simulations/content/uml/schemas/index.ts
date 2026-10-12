import type { UMLSchema } from '../types';

export const umlAssociacions: UMLSchema = {
    id: 'uml_associacions',
    title: 'Tipus d\'Associacions Binàries (1:1, 1:N i M:N)',
    description: 'Models d\'associacions binàries segons multiplicitats màximes i mínimes.',
    classes: [
        // 1:1
        {
            id: 'delegacio',
            name: 'Delegacio',
            x: 60,
            y: 40,
            attributes: [
                { name: 'codi_del', isId: true, type: 'INTEGER' },
                { name: 'nom_del', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'ciutat',
            name: 'Ciutat',
            x: 460,
            y: 40,
            attributes: [
                { name: 'nom_ciutat', isId: true, type: 'CHAR(30)' },
                { name: 'habitants', type: 'INTEGER' }
            ]
        },

        // 1:N
        {
            id: 'departament',
            name: 'Departament',
            x: 60,
            y: 220,
            attributes: [
                { name: 'num_dpt', isId: true, type: 'INTEGER' },
                { name: 'nom_dpt', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'empleat',
            name: 'Empleat',
            x: 460,
            y: 220,
            attributes: [
                { name: 'dni', isId: true, type: 'CHAR(9)' },
                { name: 'nom', type: 'CHAR(30)' },
                { name: 'sou', type: 'INTEGER' }
            ]
        },

        // M:N
        {
            id: 'producte',
            name: 'Producte',
            x: 60,
            y: 420,
            attributes: [
                { name: 'codi_prod', isId: true, type: 'INTEGER' },
                { name: 'descripcio', type: 'CHAR(50)' }
            ]
        },
        {
            id: 'magatzem',
            name: 'Magatzem',
            x: 460,
            y: 420,
            attributes: [
                { name: 'codi_mag', isId: true, type: 'INTEGER' },
                { name: 'ciutat', type: 'CHAR(30)' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_delegacio_ciutat',
            type: 'association',
            name: 'Es situa a (1:1)',
            fromClass: 'delegacio',
            toClass: 'ciutat',
            fromMultiplicity: '0..1',
            toMultiplicity: '0..1'
        },
        {
            id: 'ass_departament_empleat',
            type: 'association',
            name: 'Pertany a (1:N)',
            fromClass: 'departament',
            toClass: 'empleat',
            fromMultiplicity: '1..1',
            toMultiplicity: '0..*'
        },
        {
            id: 'ass_producte_magatzem',
            type: 'association',
            name: 'Emmagatzema (M:N)',
            fromClass: 'producte',
            toClass: 'magatzem',
            fromMultiplicity: '0..*',
            toMultiplicity: '0..*'
        }
    ]
};

export const umlHerencia: UMLSchema = {
    id: 'uml_herencia',
    title: 'Jerarquia d\'Herència (Generalització / Especialització)',
    description: 'Superclasse Persona especialitzada en subclasses Empleat i Estudiant.',
    classes: [
        {
            id: 'persona',
            name: 'Persona',
            x: 280,
            y: 40,
            attributes: [
                { name: 'dni', isId: true, type: 'VARCHAR(10)' },
                { name: 'nom', type: 'VARCHAR(50)' }
            ]
        },
        {
            id: 'empleat_sub',
            name: 'Empleat',
            x: 100,
            y: 260,
            attributes: [
                { name: 'sou', type: 'INTEGER' }
            ]
        },
        {
            id: 'estudiant_sub',
            name: 'Estudiant',
            x: 460,
            y: 260,
            attributes: [
                { name: 'centre', type: 'VARCHAR(50)' }
            ]
        }
    ],
    associations: [
        {
            id: 'her_empleat_persona',
            type: 'inheritance',
            fromClass: 'empleat_sub',
            toClass: 'persona'
        },
        {
            id: 'her_estudiant_persona',
            type: 'inheritance',
            fromClass: 'estudiant_sub',
            toClass: 'persona'
        }
    ]
};

export const umlEmpresa: UMLSchema = {
    id: 'uml_empresa',
    title: 'Model Conceptual de l\'Empresa de Referència',
    description: 'Classes Departament, Projecte i Empleat amb les seves associacions conceptuals.',
    classes: [
        {
            id: 'departament_emp',
            name: 'Departament',
            x: 80,
            y: 40,
            attributes: [
                { name: 'num_dpt', isId: true, type: 'INTEGER' },
                { name: 'nom_dpt', type: 'CHAR(30)' },
                { name: 'planta', type: 'INTEGER' },
                { name: 'edifici', type: 'CHAR(30)' },
                { name: 'ciutat', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'projecte_emp',
            name: 'Projecte',
            x: 520,
            y: 40,
            attributes: [
                { name: 'num_proj', isId: true, type: 'INTEGER' },
                { name: 'nom_proj', type: 'CHAR(30)' },
                { name: 'producte', type: 'CHAR(30)' },
                { name: 'pressupost', type: 'INTEGER' }
            ]
        },
        {
            id: 'empleat_emp',
            name: 'Empleat',
            x: 300,
            y: 300,
            attributes: [
                { name: 'num_empl', isId: true, type: 'INTEGER' },
                { name: 'nom_empl', type: 'CHAR(30)' },
                { name: 'sou', type: 'INTEGER' },
                { name: 'ciutat_empl', type: 'CHAR(30)' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_dpt_empl',
            type: 'association',
            name: 'Adscrit a',
            fromClass: 'departament_emp',
            toClass: 'empleat_emp',
            fromMultiplicity: '1..1',
            toMultiplicity: '1..*'
        },
        {
            id: 'ass_proj_empl',
            type: 'association',
            name: 'Assignat a',
            fromClass: 'projecte_emp',
            toClass: 'empleat_emp',
            fromMultiplicity: '0..1',
            toMultiplicity: '0..*'
        }
    ]
};

export const umlMultivaluat: UMLSchema = {
    id: 'uml_multivaluat',
    title: 'Transformació d\'Atribut Multivaluat a Nova Classe (1:N)',
    description: 'Transformació de l\'atribut multivaluat telefon[*] a una classe Telefon amb associació 1:N.',
    classes: [
        {
            id: 'empleat_mv',
            name: 'Empleat',
            x: 80,
            y: 50,
            attributes: [
                { name: 'dni', isId: true, type: 'CHAR(9)' },
                { name: 'nom', type: 'CHAR(30)' },
                { name: 'cognom', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'telefon_mv',
            name: 'Telefon',
            x: 440,
            y: 50,
            attributes: [
                { name: 'numTel', isId: true, type: 'CHAR(15)' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_emp_tel',
            type: 'association',
            name: 'Té',
            fromClass: 'empleat_mv',
            toClass: 'telefon_mv',
            fromMultiplicity: '1..1',
            toMultiplicity: '0..*'
        }
    ]
};

export const uml1N: UMLSchema = {
    id: 'uml_1_n',
    title: 'Associació 1:N (Departament - Empleat)',
    description: 'Associació 1:N on un empleat pertany a un departament i un departament té múltiples empleats.',
    classes: [
        {
            id: 'departament_1n',
            name: 'Departament',
            x: 80,
            y: 50,
            attributes: [
                { name: 'num_dpt', isId: true, type: 'INTEGER' },
                { name: 'nom_dpt', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'empleat_1n',
            name: 'Empleat',
            x: 440,
            y: 50,
            attributes: [
                { name: 'dni', isId: true, type: 'CHAR(9)' },
                { name: 'nom', type: 'CHAR(30)' },
                { name: 'sou', type: 'INTEGER' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_dpt_emp_1n',
            type: 'association',
            name: 'Pertany a',
            fromClass: 'departament_1n',
            toClass: 'empleat_1n',
            fromMultiplicity: '1..1',
            toMultiplicity: '0..*'
        }
    ]
};

export const uml11: UMLSchema = {
    id: 'uml_1_1',
    title: 'Associació 1:1 (Delegació - Ciutat)',
    description: 'Associació 1:1 on una delegació se situa a com a màxim una ciutat i una ciutat té com a màxim una delegació.',
    classes: [
        {
            id: 'delegacio_11',
            name: 'Delegacio',
            x: 80,
            y: 50,
            attributes: [
                { name: 'codi_del', isId: true, type: 'INTEGER' },
                { name: 'nom_del', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'ciutat_11',
            name: 'Ciutat',
            x: 440,
            y: 50,
            attributes: [
                { name: 'nom_ciutat', isId: true, type: 'CHAR(30)' },
                { name: 'habitants', type: 'INTEGER' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_del_ciu_11',
            type: 'association',
            name: 'Es situa a',
            fromClass: 'delegacio_11',
            toClass: 'ciutat_11',
            fromMultiplicity: '0..1',
            toMultiplicity: '0..1'
        }
    ]
};

export const umlMN: UMLSchema = {
    id: 'uml_m_n',
    title: 'Associació M:N (Producte - Magatzem)',
    description: 'Associació M:N on un producte pot guardar-se en diversos magatzems i un magatzem guarda diversos productes.',
    classes: [
        {
            id: 'producte_mn',
            name: 'Producte',
            x: 80,
            y: 50,
            attributes: [
                { name: 'codi_prod', isId: true, type: 'INTEGER' },
                { name: 'descripcio', type: 'CHAR(50)' }
            ]
        },
        {
            id: 'magatzem_mn',
            name: 'Magatzem',
            x: 440,
            y: 50,
            attributes: [
                { name: 'codi_mag', isId: true, type: 'INTEGER' },
                { name: 'ciutat', type: 'CHAR(30)' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_prod_mag_mn',
            type: 'association',
            name: 'Emmagatzema',
            fromClass: 'producte_mn',
            toClass: 'magatzem_mn',
            fromMultiplicity: '0..*',
            toMultiplicity: '0..*'
        }
    ]
};

export const umlTernaria: UMLSchema = {
    id: 'uml_ternaria',
    title: 'Associació Ternària amb Rombe de Relació',
    description: 'Relació ternària Assignació que relaciona Professor, Assignatura i Aula.',
    classes: [
        {
            id: 'professor_tern',
            name: 'Professor',
            x: 50,
            y: 30,
            attributes: [
                { name: 'dni_prof', isId: true, type: 'CHAR(9)' },
                { name: 'nom', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'assignatura_tern',
            name: 'Assignatura',
            x: 510,
            y: 30,
            attributes: [
                { name: 'codi_assig', isId: true, type: 'INTEGER' },
                { name: 'nom_assig', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'rel_assignacio',
            name: 'Assignació',
            isDiamond: true,
            x: 320,
            y: 50,
            attributes: []
        },
        {
            id: 'aula_tern',
            name: 'Aula',
            x: 270,
            y: 220,
            attributes: [
                { name: 'num_aula', isId: true, type: 'INTEGER' },
                { name: 'capacitat', type: 'INTEGER' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_prof_rel',
            type: 'association',
            fromClass: 'professor_tern',
            toClass: 'rel_assignacio',
            fromMultiplicity: '0..*'
        },
        {
            id: 'ass_assig_rel',
            type: 'association',
            fromClass: 'assignatura_tern',
            toClass: 'rel_assignacio',
            fromMultiplicity: '0..*'
        },
        {
            id: 'ass_aula_rel',
            type: 'association',
            fromClass: 'aula_tern',
            toClass: 'rel_assignacio',
            fromMultiplicity: '0..1'
        }
    ]
};

export const umlRecursiva: UMLSchema = {
    id: 'uml_recursiva',
    title: 'Associació Recursiva / Reflexiva (1:N)',
    description: 'Associació on la mateixa classe Empleat participa exercint el rol de Cap (0..1) i de Subordinat (0..*).',
    classes: [
        {
            id: 'empleat_rec',
            name: 'Empleat',
            x: 240,
            y: 40,
            attributes: [
                { name: 'dni', isId: true, type: 'CHAR(9)' },
                { name: 'nom', type: 'CHAR(30)' },
                { name: 'sou', type: 'INTEGER' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_empleat_cap',
            type: 'association',
            name: 'És cap de',
            fromClass: 'empleat_rec',
            toClass: 'empleat_rec',
            fromMultiplicity: '0..1 (Cap)',
            toMultiplicity: '0..* (Subordinat)'
        }
    ]
};

export const umlClasseAssociativa: UMLSchema = {
    id: 'uml_classe_associativa',
    title: 'Classe Associativa (Emmagatzematge)',
    description: 'La classe associativa Emmagatzematge depèn de la relació M:N entre Producte i Magatzem i conté l\'atribut quantitat.',
    classes: [
        {
            id: 'producte_ca',
            name: 'Producte',
            x: 70,
            y: 40,
            attributes: [
                { name: 'codi_prod', isId: true, type: 'INTEGER' },
                { name: 'descripcio', type: 'CHAR(50)' }
            ]
        },
        {
            id: 'magatzem_ca',
            name: 'Magatzem',
            x: 450,
            y: 40,
            attributes: [
                { name: 'codi_mag', isId: true, type: 'INTEGER' },
                { name: 'ciutat', type: 'CHAR(30)' }
            ]
        },
        {
            id: 'emmagatzematge_ca',
            name: 'Emmagatzematge',
            x: 260,
            y: 200,
            attributes: [
                { name: 'quantitat', type: 'INTEGER' }
            ]
        }
    ],
    associations: [
        {
            id: 'ass_prod_mag_ca',
            type: 'association',
            name: 'Es guarda a',
            fromClass: 'producte_ca',
            toClass: 'magatzem_ca',
            fromMultiplicity: '0..*',
            toMultiplicity: '0..*'
        },
        {
            id: 'ass_classe_assoc',
            type: 'dashed',
            dashed: true,
            name: 'Atribut d\'associació',
            fromClass: 'emmagatzematge_ca',
            toClass: 'producte_ca'
        }
    ]
};

export const umlSchemas: Record<string, UMLSchema> = {
    uml_associacions: umlAssociacions,
    uml_herencia: umlHerencia,
    uml_empresa: umlEmpresa,
    uml_multivaluat: umlMultivaluat,
    uml_1_n: uml1N,
    uml_1_1: uml11,
    uml_m_n: umlMN,
    uml_ternaria: umlTernaria,
    uml_recursiva: umlRecursiva,
    uml_classe_associativa: umlClasseAssociativa
};
