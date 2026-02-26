export interface JutgeProblem {
    id: string;
    title: string;
    statement: string;
    url: string;
    source?: string;
    availableLanguages?: string[];
}

// This service connects to our Vercel Serverless Function (api/jutge-proxy.ts)
// which acts as a bridge to Jutge.org, handling CORS and HTML parsing.

export const fetchJutgeProblem = async (problemId: string, lang: string = 'ca'): Promise<JutgeProblem | null> => {
    try {
        // En producció, això crida a /api/jutge-proxy
        // Eliminem cache de service worker localitzada (PWA) afegint un query rand
        const response = await fetch(`/api/jutge-proxy?id=${problemId}&lang=${lang}&v=${Date.now()}`);

        if (!response.ok) {
            throw new Error(`API Proxy Error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.warn(`Could not fetch problem ${problemId} from proxy:`, error);

        // Retornar error net
        return {
            id: problemId,
            title: `Error carregant ${problemId}`,
            statement: `<div class="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
                <p class="font-bold">No s'ha pogut carregar l'enunciat.</p>
                <p class="text-sm opacity-80 mt-2">Verifica les credencials del servidor (JUTGE_EMAIL).</p>
                <a href="https://jutge.org/problems/${problemId}" target="_blank" class="block mt-4 text-emerald-400 hover:underline">
                    Veure a Jutge.org &rarr;
                </a>
            </div>`,
            url: `https://jutge.org/problems/${problemId}`,
            source: 'error'
        };
    }
};
