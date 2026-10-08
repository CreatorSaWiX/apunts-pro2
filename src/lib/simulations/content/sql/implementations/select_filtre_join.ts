import type { Simulation, SimulationStep } from "../../../engine/types";
import { SQLBuilder } from "../SQLBuilder";
import { empresaSchema, empresaData } from "../schemas/empresa";

const queryCode = `SELECT e.nom_empl, d.nom_dpt, e.sou
FROM empleats e, departaments d
WHERE e.num_dpt = d.num_dpt
  AND e.sou >= 350000;`;

export const select_filtre_join: Simulation = {
    id: "select_filtre_join",
    renderer: "sql",
    mode: "query",
    code: queryCode,
    generateSteps: (): SimulationStep[] => {
        const builder = new SQLBuilder()
            .setSchema(empresaSchema)
            .setSourceTables(empresaData)

            // Pas 1: FROM (Selecció de taules font)
            .setActiveTables(["empleats", "departaments"])
            .setActiveStepTitle("1. Clàusula FROM (Taules font)")
            .setExplanation("Identifiquem les taules implicades a la consulta: 'empleats' (àlies e) i 'departaments' (àlies d).")
            .updateRowStatuses("empleats", ["normal", "normal", "normal", "normal", "normal"])
            .addStep(2, "sql.select_filtre_join.step_from")

            // Pas 2: WHERE condició de JOIN
            .setActiveTables(["empleats", "departaments"])
            .setActiveStepTitle("2. WHERE: Condició de combinació (JOIN)")
            .setExplanation("Aparellem cada empleat amb el seu departament mitjançant la clau forana e.num_dpt = d.num_dpt.")
            .updateRowStatuses("empleats", ["active", "active", "active", "active", "active"])
            .addStep(3, "sql.select_filtre_join.step_join")

            // Pas 3: Filtre de condició de selecció
            .setActiveStepTitle("3. WHERE: Filtre de predicat (sou >= 350000)")
            .setExplanation("Filtrem per la condició de sou: JOSEP (250.000) i NÚRIA (100.000) queden descartats perquè no compleixen el filtre.")
            .updateRowStatuses("empleats", ["active", "active", "filtered", "active", "filtered"])
            .addStep(4, "sql.select_filtre_join.step_where")

            // Pas 4: SELECT (Projecció de columnes i generació de la taula resultant)
            .setActiveColumns("empleats", ["nom_empl", "sou"])
            .setActiveColumns("departaments", ["nom_dpt"])
            .setActiveStepTitle("4. SELECT: Projecció i resultat final")
            .setExplanation("Es projecten només els atributs nom_empl, nom_dpt i sou de les 3 files que han complert els filtres.")
            .setResultTable({
                columns: ["nom_empl", "nom_dpt", "sou"],
                rows: [
                    ["CARME", "DIRECCIO", 400000],
                    ["EUGENIA", "DIRECCIO", 350000],
                    ["RICARDO", "DIRECCIO", 400000]
                ],
                rowStatuses: ["inserted", "inserted", "inserted"]
            })
            .addStep(1, "sql.select_filtre_join.step_select");

        return builder.build();
    }
};
