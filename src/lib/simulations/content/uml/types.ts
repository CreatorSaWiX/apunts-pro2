export interface UMLAttribute {
    name: string;
    type?: string;
    isId?: boolean; // Clau externa / identificador {id}
    multiplicity?: string; // ex: [*] per a multivaluat
}

export interface UMLClass {
    id: string;
    name: string;
    isAbstract?: boolean;
    isDiamond?: boolean; // Rombe per a relacions ternàries o n-àries
    attributes: UMLAttribute[];
    x?: number;
    y?: number;
}

export type UMLAssociationType = 'association' | 'inheritance' | 'aggregation' | 'composition' | 'dashed';

export interface UMLAssociation {
    id: string;
    type?: UMLAssociationType;
    dashed?: boolean; // Línia discontínua per a classes associatives
    name?: string; // Nom de la relació al mig (ex: "Treballa a", "Té")
    fromClass: string;
    toClass: string;
    fromMultiplicity?: string; // ex: "1", "0..1", "1..1", "0..*", "1..*", "*"
    toMultiplicity?: string;
    fromRole?: string;
    toRole?: string;
}

export interface UMLSchema {
    id: string;
    title?: string;
    description?: string;
    classes: UMLClass[];
    associations: UMLAssociation[];
}
