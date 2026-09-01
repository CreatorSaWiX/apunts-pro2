import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { resolveMediaUrl } from '../lib/mediaUtils';

export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    banner?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const cachedUser = localStorage.getItem('auth_user');
            if (cachedUser) {
                const parsed = JSON.parse(cachedUser);
                if (parsed.avatar) parsed.avatar = resolveMediaUrl(parsed.avatar);
                if (parsed.banner) parsed.banner = resolveMediaUrl(parsed.banner);
                return parsed;
            }
            return null;
        } catch {
            return null;
        }
    });
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
                        let firestoreData: Record<string, unknown> = {};

                        try {
                            const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
                            if (docSnap.exists()) {
                                firestoreData = docSnap.data();
                                role = (firestoreData.role as string) || 'invitat';
                            }
                        } catch (e) {
                            console.error("Error fetching user role", e);
                        }

                        const username = (firestoreData.username as string) || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
                        const rawAvatar = (firestoreData.avatar as string) || firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
                        const rawBanner = (firestoreData.banner as string) || undefined;

                        const newUser = {
                            id: firebaseUser.uid,
                            username: username,
                            email: firebaseUser.email || '',
                            avatar: resolveMediaUrl(rawAvatar) || rawAvatar,
                            banner: resolveMediaUrl(rawBanner) || rawBanner,
                            role: role
                        };
                        setUser(newUser);
                        localStorage.setItem('auth_user', JSON.stringify(newUser));
                    } else {
                        setUser(null);
                        localStorage.removeItem('auth_user');
                    }
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Failed to initialize Firebase Auth", error);
                setIsLoading(false);
            }
        };

        initAuth();

        return () => {
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
            { doc, setDoc, getDoc }
        ] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/auth'),
            import('firebase/firestore')
        ]);

        // 0. Comprovar unicitat del nom d'usuari
        const usernameDoc = await getDoc(doc(db, 'usernames', username));
        if (usernameDoc.exists()) {
            throw new Error("Aquest nom d'usuari ja està en ús. Si us plau, tria'n un altre.");
        }

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

            const userData: Record<string, unknown> = {
                username: username,
                email: email,
                avatar: avatarUrl,
                role: finalRole,
                createdAt: new Date().toISOString()
            };

            // 4. Create Firestore Document
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            await setDoc(doc(db, 'usernames', username), { uid: firebaseUser.uid, avatar: avatarUrl });

            // 5. Force update local state and cache
            const newUser = {
                id: firebaseUser.uid,
                username: username,
                email: email,
                avatar: avatarUrl,
                role: userData.role as string
            };
            setUser(newUser);
            localStorage.setItem('auth_user', JSON.stringify(newUser));

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
        localStorage.removeItem('auth_user');
        setUser(null);
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        const savedLang = localStorage.getItem('preferredLang') || 'ca';
        
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.trim(), lang: savedLang }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "No s'ha pogut enviar el correu de recuperació.");
        }
    }, []);

    const updateUser = useCallback((updates: Partial<User>) => {
        if (!user) return;
        const normalizedUpdates = { ...updates };
        if (normalizedUpdates.avatar) normalizedUpdates.avatar = resolveMediaUrl(normalizedUpdates.avatar);
        if (normalizedUpdates.banner) normalizedUpdates.banner = resolveMediaUrl(normalizedUpdates.banner);
        const updated = { ...user, ...normalizedUpdates };
        localStorage.setItem('auth_user', JSON.stringify(updated));
        setUser(updated);
    }, [user]);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        signup,
        resetPassword,
        updateUser,
        isLoading
    }), [user, login, logout, signup, resetPassword, updateUser, isLoading]);

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
