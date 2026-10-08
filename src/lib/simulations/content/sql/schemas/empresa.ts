import type { SQLDatabaseSchema, SQLTableData } from "../../../engine/types";

export const empresaSchema: SQLDatabaseSchema = {
    tables: [
        {
            name: "departaments",
            x: 50,
            y: 50,
            columns: [
                { name: "num_dpt", type: "INTEGER", isPk: true, nullable: false },
                { name: "nom_dpt", type: "CHAR(30)", nullable: false },
                { name: "planta", type: "INTEGER", nullable: true },
                { name: "edifici", type: "CHAR(30)", nullable: true },
                { name: "ciutat", type: "CHAR(30)", nullable: true }
            ]
        },
        {
            name: "projectes",
            x: 480,
            y: 50,
            columns: [
                { name: "num_proj", type: "INTEGER", isPk: true, nullable: false },
                { name: "nom_proj", type: "CHAR(30)", nullable: false },
                { name: "producte", type: "CHAR(30)", nullable: true },
                { name: "pressupost", type: "INTEGER", nullable: true }
            ]
        },
        {
            name: "empleats",
            x: 240,
            y: 300,
            columns: [
                { name: "num_empl", type: "INTEGER", isPk: true, nullable: false },
                { name: "nom_empl", type: "CHAR(30)", nullable: false },
                { name: "sou", type: "INTEGER", nullable: true, defaultValue: "100000", check: "sou > 80000" },
                { name: "ciutat_empl", type: "CHAR(30)", nullable: true },
                { name: "num_dpt", type: "INTEGER", isFk: true, references: { table: "departaments", column: "num_dpt" } },
                { name: "num_proj", type: "INTEGER", isFk: true, references: { table: "projectes", column: "num_proj" } }
            ]
        }
    ],
    relations: [
        {
            fromTable: "empleats",
            fromColumn: "num_dpt",
            toTable: "departaments",
            toColumn: "num_dpt",
            cardinality: "1:N"
        },
        {
            fromTable: "empleats",
            fromColumn: "num_proj",
            toTable: "projectes",
            toColumn: "num_proj",
            cardinality: "1:N"
        }
    ]
};

export const empresaData: Record<string, SQLTableData> = {
    departaments: {
        columns: ["num_dpt", "nom_dpt", "planta", "edifici", "ciutat"],
        rows: [
            [1, "DIRECCIO", 10, "PAU CLARIS", "BARCELONA"],
            [2, "DIRECCIO", 8, "RIOS ROSAS", "MADRID"],
            [3, "MARQUETING", 1, "PAU CLARIS", "BARCELONA"]
        ]
    },
    projectes: {
        columns: ["num_proj", "nom_proj", "producte", "pressupost"],
        rows: [
            [1, "IBDTEL", "TELEVISIO", 1000000],
            [2, "IBDVID", "VIDEO", 500000],
            [3, "IBDTEF", "TELEFON", 700000]
        ]
    },
    empleats: {
        columns: ["num_empl", "nom_empl", "sou", "ciutat_empl", "num_dpt", "num_proj"],
        rows: [
            [1, "CARME", 400000, "MATARO", 1, 1],
            [2, "EUGENIA", 350000, "TOLEDO", 2, 2],
            [3, "JOSEP", 250000, "SITGES", 3, 1],
            [4, "RICARDO", 400000, "BARCELONA", 1, 1],
            [11, "NURIA", 100000, null, 3, 2]
        ]
    }
};
