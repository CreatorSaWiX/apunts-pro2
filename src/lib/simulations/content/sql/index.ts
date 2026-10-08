import type { Simulation } from '../../engine/types';
import { ddl_empleats } from './implementations/ddl_empleats';
import { select_filtre_join } from './implementations/select_filtre_join';
import { esquema_empresa } from './implementations/esquema_empresa';

export const sql: Record<string, Simulation> = {
    esquema_empresa,
    ddl_empleats,
    select_filtre_join
};
