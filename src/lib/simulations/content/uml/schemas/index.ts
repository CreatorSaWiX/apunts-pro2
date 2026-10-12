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

export const umlSchemas: Record<string, UMLSchema> = {
    uml_associacions: umlAssociacions,
    uml_herencia: umlHerencia,
    uml_empresa: umlEmpresa
};
