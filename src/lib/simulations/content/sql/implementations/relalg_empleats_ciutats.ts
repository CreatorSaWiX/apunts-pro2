import type { Simulation, SimulationStep, SQLTableData } from "../../../engine/types";
import { SQLBuilder } from "../SQLBuilder";
import { empresaSchema } from "../schemas/empresa";

const queryCode = `A = EMPLEATS {CIUTAT_EMPL -> CIUTAT_EMPL1, NOM_EMPL -> NOM_EMPL1, NUM_DPT -> NUM_DPT1, NUM_EMPL -> NUM_EMPL1, NUM_PROJ -> NUM_PROJ1, SOU -> SOU1}
B = EMPLEATS [NUM_DPT = NUM_DPT1, CIUTAT_EMPL <> CIUTAT_EMPL1] A
C = DEPARTAMENTS * B
R = C [NUM_DPT, NOM_DPT]`;

const sourceData: Record<string, SQLTableData> = {
    departaments: {
        columns: ["num_dpt", "nom_dpt", "planta", "edifici", "ciutat"],
        rows: [
            [1, "DIRECCIO", 10, "EDIFICI1", "BARCELONA"],
            [3, "MARKETING", 1, "EDIFICI1", "SABADELL"]
        ]
    },
    empleats: {
        columns: ["num_empl", "nom_empl", "sou", "ciutat_empl", "num_dpt", "num_proj"],
        rows: [
            [1, "CARME", 35000, "BARCELONA", 1, null],
            [2, "LAURA", 32000, "BARCELONA", 1, null],
            [4, "JOAN", 30000, "BARCELONA", 3, null],
            [5, "PERE", 25000, "MATARO", 3, null]
        ]
    }
};

export const relalg_empleats_ciutats: Simulation = {
    id: "relalg_empleats_ciutats",
    renderer: "sql",
    mode: "query",
    code: queryCode,
    generateSteps: (): SimulationStep[] => {
        const builder = new SQLBuilder()
            .setSchema(empresaSchema)
            .setSourceTables(sourceData)

            // Pas 1: Reanomenament
            .setActiveTables(["empleats"])
            .setActiveColumns("empleats", ["ciutat_empl", "num_dpt"])
            .setActiveStepTitle("1. Reanomenament: Rèplica A d'EMPLEATS")
            .setExplanation("Creem una rèplica 'A' reanomenant els atributs amb el sufix '1' per poder fer un self-join sense ambigüitat de columnes.")
            .updateRowStatuses("empleats", ["normal", "normal", "normal", "normal"])
            .addStep(1, "sql.relalg.step_rename")

            // Pas 2: Theta Join d'empleat amb empleat
            .setActiveTables(["empleats"])
            .setActiveColumns("empleats", ["num_dpt", "ciutat_empl"])
            .setActiveStepTitle("2. Theta Join: EMPLEATS [...] A")
            .setExplanation("Comparem empleats del mateix departament (NUM_DPT = NUM_DPT1) però ciutat diferent (CIUTAT_EMPL <> CIUTAT_EMPL1). El dpt 1 es descarta (mateixa ciutat), el dpt 3 es conserva (JOAN a Barcelona, PERE a Mataró).")
            .updateRowStatuses("empleats", ["filtered", "filtered", "active", "active"])
            .addStep(2, "sql.relalg.step_thetajoin")

            // Pas 3: Natural Join amb DEPARTAMENTS
            .setActiveTables(["departaments", "empleats"])
            .setActiveColumns("departaments", ["num_dpt", "nom_dpt"])
            .setActiveColumns("empleats", ["num_dpt"])
            .setActiveStepTitle("3. Natural Join: DEPARTAMENTS * B")
            .setExplanation("Unim el resultat amb DEPARTAMENTS mitjançant l'atribut comú NUM_DPT per afegir el nom del departament (NOM_DPT).")
            .updateRowStatuses("departaments", ["filtered", "active"])
            .addStep(3, "sql.relalg.step_join_dpt")

            // Pas 4: Projecció final
            .setActiveTables(["departaments"])
            .setActiveColumns("departaments", ["num_dpt", "nom_dpt"])
            .setActiveStepTitle("4. Projecció: R = C [NUM_DPT, NOM_DPT]")
            .setExplanation("Projectem únicament NUM_DPT i NOM_DPT. Com que en àlgebra relacional mai hi ha tuples repetides, el resultat final conté una única fila per al departament 3.")
            .setResultTable({
                columns: ["NUM_DPT", "NOM_DPT"],
                rows: [
                    [3, "MARKETING"]
                ],
                rowStatuses: ["inserted"]
            })
            .addStep(4, "sql.relalg.step_project");

        return builder.build();
    }
};
