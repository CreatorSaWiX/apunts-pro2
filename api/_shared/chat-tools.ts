import { Type } from '@google/genai';

/**
 * Esquema de declaració de funció per al Gestor de Memòria del Chatbot.
 * Permet a Gemini proposar accions estructurades ADD, UPDATE o DELETE sobre el perfil de l'alumne.
 */
export const manageMemoryTool = {
    name: "manage_memory",
    description: "Utilitza aquesta eina EXCLUSIVAMENT quan l'usuari reveli fets personals clars, canvis en la seva vida acadèmica o aficions, o t'ordeni explícitament que oblidis alguna cosa que sabies d'ell.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            actions: {
                type: Type.ARRAY,
                description: "Llista d'accions CRUD per mantenir el perfil al dia.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        action: {
                            type: Type.STRING,
                            enum: ["ADD", "UPDATE", "DELETE"],
                            description: "Tipus d'acció: només pot ser ADD, UPDATE o DELETE."
                        },
                        old_fact: {
                            type: Type.STRING,
                            description: "Només per UPDATE i DELETE. La cadena EXACTA de la memòria a modificar o esborrar de la llista que has rebut."
                        },
                        new_fact: {
                            type: Type.STRING,
                            description: "Només per ADD i UPDATE. El nou fet pur a guardar."
                        }
                    },
                    required: ["action"]
                }
            }
        },
        required: ["actions"]
    }
};
