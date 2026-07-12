import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};

import { lazy, Suspense } from 'react';

const VisSuccessio1N = lazy(() => import('./mafs/VisSuccessio1N'));
const VisSuccessioOscilant = lazy(() => import('./mafs/VisSuccessioOscilant'));
const VisTeoremaBolzano = lazy(() => import('./mafs/VisTeoremaBolzano'));
const VisDerivadaTangent = lazy(() => import('./mafs/VisDerivadaTangent'));
const VisTaylorCentrat = lazy(() => import('./mafs/VisTaylorCentrat'));
const VisTaylorError = lazy(() => import('./mafs/VisTaylorError'));
const VisTaylorComportament = lazy(() => import('./mafs/VisTaylorComportament'));
const VisExtremsRelatius = lazy(() => import('./mafs/VisExtremsRelatius'));
const VisTaylorTeorema = lazy(() => import('./mafs/VisTaylorTeorema'));
const VisTaylorLagrange = lazy(() => import('./mafs/VisTaylorLagrange'));
const VisTaylorMaclaurin = lazy(() => import('./mafs/VisTaylorMaclaurin'));
const VisDerivacioLogaritmica = lazy(() => import('./mafs/VisDerivacioLogaritmica'));
const VisTeoremaRolle = lazy(() => import('./mafs/VisTeoremaRolle'));
const VisTeoremaValorMitja = lazy(() => import('./mafs/VisTeoremaValorMitja'));
const VisReglaHopital = lazy(() => import('./mafs/VisReglaHopital'));
const VisParametrizadaExp = lazy(() => import('./mafs/VisParametrizadaExp'));
const VisUnicitat3x = lazy(() => import('./mafs/VisUnicitat3x'));
const VisTeoremaFonamental = lazy(() => import('./mafs/VisTeoremaFonamental'));
const VisPrimitivaFamilia = lazy(() => import('./mafs/VisPrimitivaFamilia'));
const VisPropietatsLineals = lazy(() => import('./mafs/VisPropietatsLineals'));
const VisMatriuAssociada = lazy(() => import('./mafs/VisMatriuAssociada'));
const VisReglaBarrow = lazy(() => import('./mafs/VisReglaBarrow'));
const VisLimitsIntegracio = lazy(() => import('./mafs/VisLimitsIntegracio'));
const VisIntegracioTrapezi = lazy(() => import('./mafs/VisIntegracioTrapezi'));
const VisIntegracioSimpson = lazy(() => import('./mafs/VisIntegracioSimpson'));
const VisAreaEntreCorbes = lazy(() => import('./mafs/VisAreaEntreCorbes'));
const VisTeoremaMitjana = lazy(() => import('./mafs/VisTeoremaMitjana'));
const VisRiemannSums = lazy(() => import('./mafs/VisRiemannSums'));
const VisParitatIntegrals = lazy(() => import('./mafs/VisParitatIntegrals'));
const VisInversioLimits = lazy(() => import('./mafs/VisInversioLimits'));
const VisAdditivitatInterval = lazy(() => import('./mafs/VisAdditivitatInterval'));
const VisCotaError = lazy(() => import('./mafs/VisCotaError'));
const VisLinealitat = lazy(() => import('./mafs/VisLinealitat'));
const VisBolaInteractiva = lazy(() => import('./mafs/VisBolaInteractiva'));
const VisExPissarraTopologia = lazy(() => import('./mafs/VisExPissarraTopologia'));
const VisDominisComplexos = lazy(() => import('./mafs/VisDominisComplexos'));
const VisCheatSheetConiques = lazy(() => import('./mafs/VisCheatSheetConiques'));
const VisClassificacioConjunts = lazy(() => import('./mafs/VisClassificacioConjunts'));
const VisMapsTopograficsInteractiu = lazy(() => import('./mafs/VisMapsTopograficsInteractiu'));
const VisDistanciaEuclidia = lazy(() => import('./mafs/VisDistanciaEuclidia'));
const VisMetodePuntsProva = lazy(() => import('./mafs/VisMetodePuntsProva'));
const VisEx71a = lazy(() => import('./mafs/VisEx71a'));
const VisEx71b = lazy(() => import('./mafs/VisEx71b'));
const VisCombinacioLineal = lazy(() => import('./mafs/VisCombinacioLineal'));
const VisEx79 = lazy(() => import('./mafs/VisEx79'));
const VisEx77a = lazy(() => import('./mafs/VisEx77a'));
const VisEx77b = lazy(() => import('./mafs/VisEx77b'));
const VisEx77c = lazy(() => import('./mafs/VisEx77c'));
const VisEx76a = lazy(() => import('./mafs/VisEx76a'));
const VisEx76b = lazy(() => import('./mafs/VisEx76b'));
const VisEx75a = lazy(() => import('./mafs/VisEx75a'));
const VisEx75b = lazy(() => import('./mafs/VisEx75b'));
const VisEx75c = lazy(() => import('./mafs/VisEx75c'));
const VisEx72a = lazy(() => import('./mafs/VisEx72a'));
const VisEx72b = lazy(() => import('./mafs/VisEx72b'));
const VisEx74a = lazy(() => import('./mafs/VisEx74a'));
const VisEx74b = lazy(() => import('./mafs/VisEx74b'));
const VisM1T6Ex6_2 = lazy(() => import('./mafs/VisM1T6Ex6_2'));
const VisM1T6Ex6_3 = lazy(() => import('./mafs/VisM1T6Ex6_3'));
const VisVectorAdditionIntro = lazy(() => import('./mafs/VisVectorAdditionIntro'));
const VisAxiomesSuma = lazy(() => import('./mafs/VisAxiomesSuma'));
const VisAxiomesProducte = lazy(() => import('./mafs/VisAxiomesProducte'));
const VisExemplesEspais = lazy(() => import('./mafs/VisExemplesEspais'));
const VisSEVIntro = lazy(() => import('./mafs/VisSEVIntro'));
const VisOperacionsSEV = lazy(() => import('./mafs/VisOperacionsSEV'));
const VisIndependenciaLineal = lazy(() => import('./mafs/VisIndependenciaLineal'));
const VisReglesOrBase = lazy(() => import('./mafs/VisReglesOrBase'));
const VisCanviBase = lazy(() => import('./mafs/VisCanviBase'));
const VisAntiimatgeSubespais = lazy(() => import('./mafs/VisAntiimatgeSubespais'));
const VisClassificacioAplicacions = lazy(() => import('./mafs/VisClassificacioAplicacions'));
const VisEndomorfismeNilpotent = lazy(() => import('./mafs/VisEndomorfismeNilpotent'));
const VisComposicioAplicacions = lazy(() => import('./mafs/VisComposicioAplicacions'));
const VisInversaAplicacio = lazy(() => import('./mafs/VisInversaAplicacio'));
const VisCanviBaseSandvitx = lazy(() => import('./mafs/VisCanviBaseSandvitx'));
const VisTransformacionsGeometricas = lazy(() => import('./mafs/VisTransformacionsGeometricas'));

const VISUALIZERS: Record<string, React.ComponentType<any>> = {
    'vis_canvi_base': VisCanviBase,
    'vis_regles_or_base': VisReglesOrBase,
    'vis_independencia_lineal': VisIndependenciaLineal,
    'vis_operacions_sev': VisOperacionsSEV,
    'vis_sev_intro': VisSEVIntro,
    'vis_exemples_espais': VisExemplesEspais,
    'vis_axiomes_producte': VisAxiomesProducte,
    'vis_axiomes_suma': VisAxiomesSuma,
    'successio_1_n': VisSuccessio1N,
    'successio_oscilant': VisSuccessioOscilant,
    'teorema_bolzano': VisTeoremaBolzano,
    'derivada_tangent': VisDerivadaTangent,
    'taylor_centrat': VisTaylorCentrat,
    'taylor_error': VisTaylorError,
    'taylor_comportament': VisTaylorComportament,
    'extrems_relatius': VisExtremsRelatius,
    'taylor_teorema': VisTaylorTeorema,
    'taylor_lagrange': VisTaylorLagrange,
    'taylor_maclaurin': VisTaylorMaclaurin,
    'derivacio_logaritmica': VisDerivacioLogaritmica,
    'teorema_rolle': VisTeoremaRolle,
    'teorema_valor_mitja': VisTeoremaValorMitja,
    'regla_hopital': VisReglaHopital,
    'parametrizada_exp': VisParametrizadaExp,
    'unicitat_3x': VisUnicitat3x,
    'teorema_fonamental': VisTeoremaFonamental,
    'primitiva_familia': VisPrimitivaFamilia,
    'regla_barrow': VisReglaBarrow,
    'limits_integracio': VisLimitsIntegracio,
    'integracio_trapezi': VisIntegracioTrapezi,
    'integracio_simpson': VisIntegracioSimpson,
    'area_entre_corbes': VisAreaEntreCorbes,
    'teorema_mitjana': VisTeoremaMitjana,
    'riemann_sums': VisRiemannSums,
    'paritat_integrals': VisParitatIntegrals,
    'cota_error': VisCotaError,
    'propietat_inversio': VisInversioLimits,
    'propietat_additivitat': VisAdditivitatInterval,
    'propietat_linealitat': VisLinealitat,
    'vis_combinacio_lineal': VisCombinacioLineal,
    'ex_7_9': VisEx79,
    'ex_7_7_a': VisEx77a,
    'ex_7_7_b': VisEx77b,
    'ex_7_7_c': VisEx77c,
    'ex_7_6_a': VisEx76a,
    'ex_7_6_b': VisEx76b,
    'ex_7_5_a': VisEx75a,
    'ex_7_5_b': VisEx75b,
    'ex_7_5_c': VisEx75c,
    'ex_7_1_a': VisEx71a,
    'ex_7_1_b': VisEx71b,
    'ex_7_2_a': VisEx72a,
    'ex_7_2_b': VisEx72b,
    'ex_7_4_a': VisEx74a,
    'ex_7_4_b': VisEx74b,
    'm1_t6_ex6_2': VisM1T6Ex6_2,
    'm1_t6_ex6_3': VisM1T6Ex6_3,
    'vis_vector_addition_intro': VisVectorAdditionIntro,
    'vis_bola_interactiva': VisBolaInteractiva,
    'vis_ex_pissarra_topologia': VisExPissarraTopologia,
    'vis_dominis_complexos': VisDominisComplexos,
    'vis_cheat_sheet_coniques': VisCheatSheetConiques,
    'vis_maps_topografics_interactiu': VisMapsTopograficsInteractiu,
    'vis_distancia_euclidia': VisDistanciaEuclidia,
    'vis_metode_punts_prova': VisMetodePuntsProva,
    'vis_classificacio_conjunts': VisClassificacioConjunts,
    'vis_propietats_lineals': VisPropietatsLineals,
    'vis_matriu_associada': VisMatriuAssociada,
    'vis_antiimatge_subespais': VisAntiimatgeSubespais,
    'vis_classificacio_aplicacions': VisClassificacioAplicacions,
    'vis_endomorfisme_nilpotent': VisEndomorfismeNilpotent,
    'vis_composicio_aplicacions': VisComposicioAplicacions,
    'vis_inversa_aplicacio': VisInversaAplicacio,
    'vis_canvi_base_sandvitx': VisCanviBaseSandvitx,
    'vis_transformacions_geometriques': VisTransformacionsGeometricas,
};


import { useInteraction } from '../../contexts/InteractionContext';

const MafsVisualizer: React.FC<MafsVisualizerProps> = ({ type }) => {
    const Component = VISUALIZERS[type];
    const { isFullScreen } = useInteraction();

    if (!Component) {
        return (
            <div className="p-4 border border-red-500/50 rounded-xl bg-red-500/10 text-red-400">
                [Error de Mafs] Tipus de visualització no trobat: {type}
            </div>
        );
    }

    return (
        <InteractionLock className="my-8">
            <div className="w-full h-full overflow-hidden transition-all duration-500 flex flex-col">
                <Suspense fallback={<div className="p-4 flex items-center justify-center">Carregant visualització...</div>}><Component /></Suspense>
            </div>
        </InteractionLock>
    );
};

export default MafsVisualizer;
