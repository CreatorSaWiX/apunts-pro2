import type { Simulation, SimulationStep } from "../../../engine/types";
import { SQLBuilder } from "../SQLBuilder";
import { empresaSchema, empresaData } from "../schemas/empresa";

const ddlCode = `-- 1. Taula de departaments (entitat mestra)
CREATE TABLE departaments (
    num_dpt     INTEGER PRIMARY KEY,
    nom_dpt     CHAR(30) NOT NULL,
    planta      INTEGER,
    edifici     CHAR(30),
    ciutat      CHAR(30)
);

-- 2. Taula de projectes (entitat mestra)
CREATE TABLE projectes (
    num_proj    INTEGER PRIMARY KEY,
    nom_proj    CHAR(30) NOT NULL,
    producte    CHAR(30),
    pressupost  INTEGER
);

-- 3. Taula d'empleats (relacionada per claus foranes)
CREATE TABLE empleats (
    num_empl    INTEGER PRIMARY KEY,
    nom_empl    CHAR(30) NOT NULL,
    sou         INTEGER DEFAULT 100000 CHECK (sou > 80000),
    ciutat_empl CHAR(30),
    num_dpt     INTEGER REFERENCES departaments(num_dpt),
    num_proj    INTEGER REFERENCES projectes(num_proj)
);

-- 4. Inserció de dades a departaments
INSERT INTO departaments (num_dpt, nom_dpt, planta, edifici, ciutat) VALUES
    (1, 'DIRECCIO', 10, 'PAU CLARIS', 'BARCELONA'),
    (2, 'DIRECCIO', 8, 'RIOS ROSAS', 'MADRID'),
    (3, 'MARQUETING', 1, 'PAU CLARIS', 'BARCELONA');

-- 5. Inserció de dades a projectes
INSERT INTO projectes (num_proj, nom_proj, producte, pressupost) VALUES
    (1, 'IBDTEL', 'TELEVISIO', 1000000),
    (2, 'IBDVID', 'VIDEO', 500000),
    (3, 'IBDTEF', 'TELEFON', 700000);

-- 6. Inserció de dades a empleats
INSERT INTO empleats (num_empl, nom_empl, sou, ciutat_empl, num_dpt, num_proj) VALUES
    (1, 'CARME', 400000, 'MATARO', 1, 1),
    (2, 'EUGENIA', 350000, 'TOLEDO', 2, 2),
    (3, 'JOSEP', 250000, 'SITGES', 3, 1),
    (4, 'RICARDO', 400000, 'BARCELONA', 1, 1),
    (11, 'NURIA', 100000, NULL, 3, 2);`;

export const esquema_empresa: Simulation = {
    id: "esquema_empresa",
    renderer: "sql",
    mode: "schema",
    code: ddlCode,
    generateSteps: (): SimulationStep[] => {
        const builder = new SQLBuilder()
            .setSchema(empresaSchema)
            .setSourceTables(empresaData)
            .setActiveTables(["departaments", "projectes", "empleats"])
            .setActiveStepTitle("Esquema relacional complet")
            .setExplanation("Esquema relacional de referència amb les taules departaments, projectes i empleats.")
            .addStep(0, "sql.esquema_empresa.step_all");

        return builder.build();
    }
};
