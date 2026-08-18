interface FirebaseLikeError {
    code?: string;
    message?: string;
}

export const getFirebaseErrorMessage = (err: unknown, t: (key: string, defaultText: string) => string): string => {
    const errorObj = (typeof err === 'object' && err !== null) ? (err as FirebaseLikeError) : null;
    if (!errorObj || !errorObj.code) {
        if (errorObj && errorObj.message) return errorObj.message;
        return t('auth.genericError', 'S\'ha produït un error inesperat.');
    }

    switch (errorObj.code) {
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
            return errorObj.message || t('auth.genericError', 'S\'ha produït un error inesperat.');
    }
};
