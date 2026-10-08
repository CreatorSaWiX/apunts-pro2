/**
 * Assignatures que tenen els apunts allotjats a Discord en lloc de fitxers markdown locals.
 * Pots afegir o treure assignatures fàcilment separant-les per comes.
 */
export const apuntsDiscord: string[] = ['PE', 'CI', 'EC', 'IC', 'PRO1', 'FM', 'F'];

/**
 * Enllaç oficial d'invitació al servidor de Discord de la comunitat Apunts.
 */
export const DISCORD_INVITE_URL = 'https://discord.gg/BDHKechRKk';

/**
 * Comprova si una assignatura té els seus apunts a Discord.
 */
export const isDiscordSubject = (subject?: string | null): boolean => {
    if (!subject) return false;
    const normalized = subject.trim().toUpperCase();
    return apuntsDiscord.some(s => s.trim().toUpperCase() === normalized);
};
