import { useState } from 'react';
import ConfirmModal from '../ui/ConfirmModal';
import { auth, db } from '../../lib/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export const DeleteAccSection = () => {
    const { t } = useTranslation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!auth.currentUser) return;
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, 'users', auth.currentUser.uid));
            await deleteUser(auth.currentUser);
        } catch (error: any) {
            console.error("Error esborrant el compte:", error);
            if (error.code === 'auth/requires-recent-login') {
                alert(t('settings.deleteAcc.errorRecentLogin', "Per motius de seguretat, necessites tancar la sessió i tornar a entrar per poder esborrar el teu compte."));
            } else {
                alert(t('settings.deleteAcc.errorGeneric', "Hi ha hagut un error esborrant el compte."));
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-red-500/20 pb-6 gap-6 mt-4">
            <div>
                <h2 className="text-2xl font-bold text-red-500 mb-1">{t('settings.deleteAcc.title', 'Eliminar compte')}</h2>
                <p className="text-slate-400 text-sm font-medium">{t('settings.deleteAcc.subtitle', 'Esborra de forma permanent el teu compte i totes les teves dades associades.')}</p>
            </div>

            <button type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-colors border border-red-500/20 whitespace-nowrap"
            >
                {isDeleting ? t('settings.deleteAcc.deleting', "Esborrant...") : t('settings.deleteAcc.button', "Eliminar el meu compte")}
            </button>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title={t('settings.deleteAcc.confirmTitle', "Esborrar compte")}
                message={t('settings.deleteAcc.confirmMessage', "Estàs totalment segur? Aquesta acció esborrarà el teu compte, tots els xats, tasques i apunts de forma irreversible.")}
                confirmText={t('settings.deleteAcc.confirmYes', "Sí, esborrar")}
                cancelText={t('settings.deleteAcc.confirmNo', "Cancel·lar")}
                isDestructive={true}
            />
        </div>
    );
};
