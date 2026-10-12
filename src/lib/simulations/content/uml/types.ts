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
    attributes: UMLAttribute[];
    x?: number;
    y?: number;
}

export type UMLAssociationType = 'association' | 'inheritance' | 'aggregation' | 'composition';

export interface UMLAssociation {
    id: string;
    type?: UMLAssociationType;
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
