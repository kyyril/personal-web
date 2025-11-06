"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  getIdToken,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

// Define Prisma User type for context
interface PrismaUser {
  id: string;
  firebaseUid: string;
  email?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
}

// Define types for the context
type AuthContextType = {
  currentUser: User | null;
  prismaUser: PrismaUser | null; // Add prismaUser to context
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  prismaUser: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
  getToken: async () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [prismaUser, setPrismaUser] = useState<PrismaUser | null>(null); // State for Prisma user
  const [loading, setLoading] = useState(true);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log("NEXT_PUBLIC_BACKEND_URL:", backendUrl);
      const fetchUrl = `${backendUrl}/user`;
      console.log("Frontend attempting POST to:", fetchUrl);

      // Send the ID token to your backend to create/update the user in your database
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sync user with backend");
      }
      const userData = await response.json();
      setPrismaUser(userData.user); // Set prismaUser from backend response

    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setPrismaUser(null); // Clear prismaUser on logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getToken = async () => {
    if (!currentUser) return null;
    try {
      return await getIdToken(currentUser, true);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create prisma user when firebase user is available
        try {
          const idToken = await user.getIdToken();
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const fetchUrl = `${backendUrl}/user`;
          const response = await fetch(fetchUrl, {
            method: "POST", // Use POST to ensure creation/update
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to sync user on auth state change");
          }
          const userData = await response.json();
          setPrismaUser(userData.user);
        } catch (error) {
          console.error("Error syncing Prisma user:", error);
          setPrismaUser(null);
        }
      } else {
        setPrismaUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    prismaUser,
    loading,
    signIn,
    logOut,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
