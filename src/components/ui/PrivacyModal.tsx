import React from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" overlayVariant="transparent">
            <Modal.Header>
                <div className="px-2 pt-2">
                    <h2 className="text-2xl font-serif text-slate-100 tracking-tight">{t('privacy.title', 'Política de Privacitat i Tractament de Dades')}</h2>
                    <p className="text-sm text-slate-400 font-medium tracking-wide uppercase mt-2">
                        {t('privacy.subtitle', 'Normativa aplicable: Reglament General de Protecció de Dades (RGPD)')}
                    </p>
                </div>
            </Modal.Header>
            <Modal.Layout>
                <Modal.Body className="p-8">
                    <div className="prose prose-invert prose-slate max-w-none 
                        prose-headings:font-serif prose-headings:font-medium prose-headings:text-slate-200 
                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm
                        prose-a:text-primary hover:prose-a:text-primary/80
                        prose-strong:text-slate-200 prose-strong:font-semibold">

                        <p className="lead text-base text-slate-300 italic mb-8 border-l-2 border-slate-700 pl-4">
                            {t('privacy.intro', "L'equip de desenvolupament reconeix la importància fonamental de la privacitat i la protecció de les dades personals. Aquesta política estableix els principis pels quals ens regim en el tractament de la informació, garantint la màxima transparència i respecte pels drets dels nostres usuaris.")}
                        </p>

                        <h3 className="text-lg mt-8 mb-4 border-b border-slate-800 pb-2">{t('privacy.nature.title', '1. Naturalesa del Tractament')}</h3>
                        <p>
                            {t('privacy.nature.content', "Les dades recopilades a través d'aquesta plataforma tenen com a objectiu exclusiu la millora contínua de l'experiència educativa i la interacció amb l'assistent d'Intel·ligència Artificial. Tota informació és tractada sota els principis de licitud, lleialtat, transparència i minimització de dades, de conformitat amb l'Article 5 del RGPD.")}
                        </p>

                        <h3 className="text-lg mt-8 mb-4 border-b border-slate-800 pb-2">{t('privacy.data.title', '2. Dades Recopilades')}</h3>
                        <p>
                            {t('privacy.data.content', "Durant l'ús de la plataforma, ens limitem a recopilar estrictament les següents dades essencials:")}
                        </p>
                        <ul className="list-disc pl-5 mb-4 text-sm text-slate-300 space-y-2 marker:text-slate-600">
                            <li><strong>{t('privacy.data.id', "Informació d'Identitat:")}</strong> {t('privacy.data.idDesc', "Nom, correu electrònic institucional i identificador exclusiu assignat pel sistema d'autenticació.")}</li>
                            <li><strong>{t('privacy.data.interactions', "Interaccions Cognitives:")}</strong> {t('privacy.data.interactionsDesc', "Historial de converses amb l'assistent virtual per tal de proveir un context de memòria acurat.")}</li>
                            <li><strong>{t('privacy.data.metrics', "Mètriques de Sistema:")}</strong> {t('privacy.data.metricsDesc', "Dades analítiques anonimitzades (processades en remot) destinades a comprendre els patrons d'ús i avaluar el rendiment tècnic de l'aplicació.")}</li>
                        </ul>

                        <h3 className="text-lg mt-8 mb-4 border-b border-slate-800 pb-2">{t('privacy.rights.title', '3. Exercici de Drets (Drets ARCO)')}</h3>
                        <p>
                            {t('privacy.rights.content', "En virtut de la legislació vigent, vostè posseeix la facultat d'exercir en qualsevol moment el seu dret a l'oblit. La plataforma integra eines d'autonomia per a l'usuari; concretament, des de la secció de Configuració, vostè pot executar l'esborrat permanent i irreversible de la totalitat del seu compte i de tots els registres vinculats, sense requerir intervenció administrativa per la nostra part.")}
                        </p>

                        <h3 className="text-lg mt-8 mb-4 border-b border-slate-800 pb-2">{t('privacy.security.title', '4. Seguretat i Integritat')}</h3>
                        <p>
                            {t('privacy.security.content', "La integritat de les seves dades està avalada per l'arquitectura de seguretat de Firebase (Google Cloud Platform), la qual disposa de certificacions internacionals d'encriptació tant en trànsit com en repòs. Tanmateix, s'adverteix explícitament a l'usuari que s'abstingui de divulgar dades d'alt nivell de confidencialitat (com ara credencials bancàries o informació mèdica) durant les consultes amb l'assistent d'Intel·ligència Artificial.")}
                        </p>

                        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                            <span>{t('privacy.footer.date', 'Darrera revisió: Juliol 2026')}</span>
                            <span>Apunts</span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal.Layout>
        </Modal>
    );
};

export default PrivacyModal;
