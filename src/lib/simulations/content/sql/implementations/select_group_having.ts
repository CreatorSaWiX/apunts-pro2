import type { Simulation, SimulationStep } from "../../../engine/types";
import { SQLBuilder } from "../SQLBuilder";
import { empresaSchema, empresaData } from "../schemas/empresa";

const queryCode = `SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats
WHERE sou > 200000
GROUP BY num_dpt
HAVING COUNT(*) > 1;`;

export const select_group_having: Simulation = {
    id: "select_group_having",
    renderer: "sql",
    mode: "query",
    code: queryCode,
    generateSteps: (): SimulationStep[] => {
        const builder = new SQLBuilder()
            .setSchema(empresaSchema)
            .setSourceTables(empresaData)

            // Pas 1: FROM (Taula font)
            .setActiveTables(["empleats"])
            .setActiveStepTitle("1. Clàusula FROM (Taula font)")
            .setExplanation("Identifiquem la taula font 'empleats', que conté 5 files inicials a la base de dades.")
            .updateRowStatuses("empleats", ["normal", "normal", "normal", "normal", "normal"])
            .addStep(2, "sql.select_group_having.step_from")

            // Pas 2: WHERE (Filtre individual abans d'agrupar)
            .setActiveTables(["empleats"])
            .setActiveStepTitle("2. Clàusula WHERE: Filtre individual (sou > 200000)")
            .setExplanation("Filtrem les tuples individuals abans de qualsevol agrupament: NÚRIA (sou 100.000) queda descartada per no complir la condició.")
            .updateRowStatuses("empleats", ["active", "active", "active", "active", "filtered"])
            .addStep(3, "sql.select_group_having.step_where")

            // Pas 3: GROUP BY (Partició en grups)
            .setActiveTables(["empleats"])
            .setActiveColumns("empleats", ["num_dpt"])
            .setActiveStepTitle("3. Clàusula GROUP BY: Agrupament per departament")
            .setExplanation("Les 4 files supervivents es divideixen en 3 grups segons num_dpt: Grup 1 (Carme, Ricardo), Grup 2 (Eugènia), Grup 3 (Josep).")
            .updateRowStatuses("empleats", ["active", "active", "active", "active", "filtered"])
            .addStep(4, "sql.select_group_having.step_group")

            // Pas 4: HAVING (Filtre sobre funcions d'agregació)
            .setActiveTables(["empleats"])
            .setActiveStepTitle("4. Clàusula HAVING: Filtre de grups (COUNT(*) > 1)")
            .setExplanation("S'avalua la condició sobre el resum de cada grup. Només el departament 1 té 2 empleats (> 1). Els departaments 2 i 3 (amb 1 sol empleat) es descarten.")
            .updateRowStatuses("empleats", ["active", "filtered", "filtered", "active", "filtered"])
            .addStep(5, "sql.select_group_having.step_having")

            // Pas 5: SELECT (Projecció i càlcul d'agregats)
            .setActiveTables(["empleats"])
            .setActiveColumns("empleats", ["num_dpt", "sou"])
            .setActiveStepTitle("5. SELECT: Projecció de num_dpt i AVG(sou)")
            .setExplanation("Es calcula la mitjana de sou per al grup 1 supervivent (400.000 + 400.000 / 2 = 400.000). Es retorna exactament 1 fila resultant.")
            .setResultTable({
                columns: ["num_dpt", "sou_mig"],
                rows: [
                    [1, 400000]
                ],
                rowStatuses: ["inserted"]
            })
            .addStep(1, "sql.select_group_having.step_select");

        return builder.build();
    }
};
