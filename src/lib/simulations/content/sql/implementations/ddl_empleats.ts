import type { Simulation, SimulationStep } from "../../../engine/types";
import { SQLBuilder } from "../SQLBuilder";
import { empresaSchema } from "../schemas/empresa";

const ddlCode = `CREATE TABLE empleats (
    num_empl     INTEGER,
    nom_empl     CHAR(30) NOT NULL,
    sou          INTEGER DEFAULT 100000 CHECK (sou > 80000),
    ciutat_empl  CHAR(30),
    num_dpt      INTEGER,
    num_proj     INTEGER,
    PRIMARY KEY (num_empl),
    FOREIGN KEY (num_dpt) REFERENCES departaments(num_dpt),
    FOREIGN KEY (num_proj) REFERENCES projectes(num_proj)
);`;

export const ddl_empleats: Simulation = {
    id: "ddl_empleats",
    renderer: "sql",
    mode: "schema",
    code: ddlCode,
    generateSteps: (): SimulationStep[] => {
        const builder = new SQLBuilder()
            .setSchema(empresaSchema)
            .setActiveTables(["empleats"])
            // Pas 1: Definició de la taula
            .setActiveStepTitle("Creació de la taula")
            .setExplanation("S'inicia la declaració de la taula 'empleats' amb CREATE TABLE.")
            .addStep(1, "sql.ddl_empleats.step_1")

            // Pas 2: Columnes bàsiques
            .setActiveColumns("empleats", ["num_empl", "nom_empl"])
            .setActiveStepTitle("Columnes i restriccions")
            .setExplanation("Es defineixen els camps 'num_empl' (INTEGER) i 'nom_empl' amb la restricció NOT NULL.")
            .addStep(3, "sql.ddl_empleats.step_2")

            // Pas 3: Restricció DEFAULT i CHECK
            .setActiveColumns("empleats", ["sou"])
            .setActiveStepTitle("Valor per defecte i CHECK")
            .setExplanation("El camp 'sou' té valor per defecte 100.000 i una regla CHECK que exigeix un sou superior a 80.000.")
            .addStep(4, "sql.ddl_empleats.step_3")

            // Pas 4: Clau primària
            .setActiveColumns("empleats", ["num_empl"])
            .setActiveStepTitle("Clau primària (PK)")
            .setExplanation("PRIMARY KEY (num_empl): garanteix que cada empleat té un identificador únic i no nul.")
            .addStep(8, "sql.ddl_empleats.step_4")

            // Pas 5: Clau forana a departaments
            .setActiveTables(["empleats", "departaments"])
            .setActiveColumns("empleats", ["num_dpt"])
            .setActiveStepTitle("Clau forana a departaments (FK1)")
            .setExplanation("FOREIGN KEY (num_dpt) REFERENCES departaments(num_dpt): garanteix la integritat referencial amb la taula departaments.")
            .addStep(9, "sql.ddl_empleats.step_5")

            // Pas 6: Clau forana a projectes
            .setActiveTables(["empleats", "projectes"])
            .setActiveColumns("empleats", ["num_proj"])
            .setActiveStepTitle("Clau forana a projectes (FK2)")
            .setExplanation("FOREIGN KEY (num_proj) REFERENCES projectes(num_proj): vincula l'empleat amb un projecte existent.")
            .addStep(10, "sql.ddl_empleats.step_6")

            // Pas 7: Esquema complet integrat
            .setActiveTables(["empleats", "departaments", "projectes"])
            .setActiveColumns("empleats", [])
            .setActiveStepTitle("Esquema relacional complet")
            .setExplanation("La taula 'empleats' queda integrada amb les claus primàries i foranes connectades.")
            .addStep(11, "sql.ddl_empleats.step_7");

        return builder.build();
    }
};
