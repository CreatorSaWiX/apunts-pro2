import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Fetch extra data from Firestore
                let role = 'user';
                let firestoreData: any = {};

                try {
                    const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (docSnap.exists()) {
                        firestoreData = docSnap.data();
                        role = firestoreData.role || 'user';
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

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email: string, password: string, username: string, inviteCode?: string) => {
        // 1. Create User (Auth)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        try {
            // 2. Update Profile
            const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
            await updateProfile(user, {
                displayName: username,
                photoURL: avatarUrl
            });

            // 3. Determine Role and Data
            const userData: any = {
                username: username,
                email: email,
                avatar: avatarUrl,
                role: inviteCode ? 'editor' : 'user',
                createdAt: new Date().toISOString()
            };

            // Only add inviteCode if provided (triggers validation rules for editors)
            if (inviteCode) {
                userData.inviteCode = inviteCode;
            }

            // 4. Create Firestore Document
            await setDoc(doc(db, 'users', user.uid), userData);

            // 5. Force update local state (fix race condition with onAuthStateChanged)
            setUser({
                id: user.uid,
                username: username,
                email: email,
                avatar: avatarUrl,
                role: userData.role
            });

        } catch (error) {
            // If Firestore creation fails (e.g., invalid code), rollback Auth creation
            console.error("Error creating user profile:", error);
            await deleteUser(user);
            throw new Error(inviteCode ? "Codi d'invitació no vàlid o error del sistema." : "Error al crear el perfil d'usuari.");
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
            {!isLoading && children}
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
