import mascotData from '../data/mascotLogos.json';

export interface MascotLogo {
    id: number;
    name: string;
    cat: string;
    key: string;
}

export const CDN_MASCOT_BASE = 'https://cdn.ipaslogo.com/display-512';

const mascots: MascotLogo[] = mascotData as MascotLogo[];
const animalMascots: MascotLogo[] = mascots.filter((m) => m.cat === 'animals');

/**
 * Retorna la URL CDN optimitzada per a una mascota concreta
 */
export function getMascotUrl(key: string): string {
    if (!key) return '';
    return `${CDN_MASCOT_BASE}/${key}`;
}

/**
 * Retorna la col·lecció completa de les 3.448 mascotes
 */
export function getAllMascots(): MascotLogo[] {
    return mascots;
}

/**
 * Genera un avatar de mascota de forma determinista basat en un nom o seed (ex: username o uid).
 * Per defecte utilitza la col·lecció de més de 1.500 animals per garantir màxima simpatia i appeal.
 */
export function getDefaultMascotAvatar(seed: string = 'user'): string {
    const cleanSeed = (seed || 'user').trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < cleanSeed.length; i++) {
        hash = (hash << 5) - hash + cleanSeed.charCodeAt(i);
        hash |= 0;
    }
    const pool = animalMascots.length > 0 ? animalMascots : mascots;
    if (pool.length === 0) return '';
    const index = Math.abs(hash) % pool.length;
    return getMascotUrl(pool[index].key);
}

/**
 * Comprova si una URL d'avatar prové del catàleg de mascotes IP as Logo
 */
export function isMascotUrl(url?: string | null): boolean {
    if (!url) return false;
    return url.includes('cdn.ipaslogo.com');
}
