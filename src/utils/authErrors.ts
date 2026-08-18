export const getFirebaseErrorMessage = (err: any, t: (key: string, defaultText: string) => string): string => {
    if (!err || !err.code) {
        if (err && err.message) return err.message;
        return t('auth.genericError', 'S\'ha produït un error inesperat.');
    }

    switch (err.code) {
        // Login Errors
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return t('auth.login.invalidCreds', 'Credencials incorrectes. Torna-ho a provar.');
        
        // Register Errors
        case 'auth/email-already-in-use':
            return t('auth.register.emailInUse', 'Aquest correu electrònic ja està registrat.');
        case 'auth/weak-password':
            return t('auth.register.weakPassword', 'La contrasenya ha de tenir almenys 6 caràcters.');
        case 'auth/invalid-email':
            return t('auth.register.invalidEmail', 'El correu electrònic no és vàlid.');
        
        default:
            return err.message || t('auth.genericError', 'S\'ha produït un error inesperat.');
    }
};
