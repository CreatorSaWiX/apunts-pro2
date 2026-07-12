import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const initAuth = async () => {
            try {
                const [
                    { auth, db },
                    { onAuthStateChanged },
                    { doc, getDoc }
                ] = await Promise.all([
                    import('../lib/firebase'),
                    import('firebase/auth'),
                    import('firebase/firestore')
                ]);

                unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
                    if (firebaseUser) {
                        let role = 'invitat';
                        let firestoreData: any = {};

                        try {
                            const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
                            if (docSnap.exists()) {
                                firestoreData = docSnap.data();
                                role = firestoreData.role || 'invitat';
                            }
                        } catch (e) {
                            console.error("Error fetching user role", e);
                        }

                        const username = firestoreData.username || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';

                        setUser({
                            id: firebaseUser.uid,
                            username: username,
                            email: firebaseUser.email || '',
                            avatar: firestoreData.avatar || firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
                            role: role
                        });
                    } else {
                        setUser(null);
                    }
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Failed to initialize Firebase Auth", error);
                setIsLoading(false);
            }
        };

        // Delay firebase initialization slightly so it doesn't compete with React hydration
        const timer = setTimeout(() => {
            initAuth();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const [{ auth }, { signInWithEmailAndPassword }] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/auth')
        ]);
        await signInWithEmailAndPassword(auth, email, password);
    }, []);

    const signup = useCallback(async (email: string, password: string, username: string) => {
        const [
            { auth, db },
            { createUserWithEmailAndPassword, updateProfile },
            { doc, setDoc }
        ] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/auth'),
            import('firebase/firestore')
        ]);

        // 1. Create User (Auth)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        try {
            // 2. Update Profile
            const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
            await updateProfile(firebaseUser, {
                displayName: username,
                photoURL: avatarUrl
            });

            // 3. Determine Role and Data
            const finalRole = 'invitat';

            const userData: any = {
                username: username,
                email: email,
                avatar: avatarUrl,
                role: finalRole,
                createdAt: new Date().toISOString()
            };

            // 4. Create Firestore Document
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);

            // 5. Force update local state
            setUser({
                id: firebaseUser.uid,
                username: username,
                email: email,
                avatar: avatarUrl,
                role: userData.role
            });

        } catch (error) {
            console.error("Error creating user profile:", error);
            throw new Error(error instanceof Error ? error.message : "Error al crear el perfil d'usuari.");
        }
    }, []);

    const logout = useCallback(async () => {
        const [{ auth }, { signOut }] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/auth')
        ]);
        await signOut(auth);
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        const savedLang = localStorage.getItem('preferredLang') || 'ca';
        
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, lang: savedLang }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "No s'ha pogut enviar el correu de recuperació.");
        }
    }, []);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        signup,
        resetPassword,
        isLoading
    }), [user, login, logout, signup, resetPassword, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
