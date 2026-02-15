import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Map Firebase user to app user
                // Using email as username fallback if display name is not set
                const username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';

                setUser({
                    id: firebaseUser.uid,
                    username: username,
                    email: firebaseUser.email || '',
                    avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
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
        const { createUserWithEmailAndPassword, updateProfile, deleteUser } = await import('firebase/auth');
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');

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
