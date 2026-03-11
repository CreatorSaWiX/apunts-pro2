import React, { createContext, useContext, useState, useEffect } from 'react';
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
    signup: (email: string, password: string, username: string, inviteCode?: string) => Promise<void>;
    logout: () => Promise<void>;
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
                const { auth, db } = await import('../lib/firebase');
                const { onAuthStateChanged } = await import('firebase/auth');
                const { doc, getDoc } = await import('firebase/firestore');

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

    const login = async (email: string, password: string) => {
        const { auth } = await import('../lib/firebase');
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email: string, password: string, username: string, inviteCode?: string) => {
        const { auth, db } = await import('../lib/firebase');
        const { createUserWithEmailAndPassword, updateProfile, deleteUser } = await import('firebase/auth');
        const { doc, setDoc } = await import('firebase/firestore');

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
            let finalRole = 'invitat';
            if (inviteCode) {
                if (inviteCode === import.meta.env.VITE_REGISTRATION_CODE) {
                    finalRole = 'moderador';
                } else {
                    await updateProfile(firebaseUser, { displayName: username }); // fallback cleanup
                    await deleteUser(firebaseUser);
                    throw new Error("El codi d'invitació introduït no és correcte.");
                }
            }

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
    };

    const logout = async () => {
        const { auth } = await import('../lib/firebase');
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
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
