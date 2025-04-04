import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser } from "@/utils/api";
import axios from 'axios';

// Key used for storing JWT in secure storage
const JWT_KEY = 'jwt-key';

// Type definition for the Authentication context properties
type AuthProps = {
    token: string | null;              // JWT token for authenticated user
    userId: number | null;             // User ID extracted from the token
    onRegister: (email: string, password: string, name: string) => Promise<any>; // Function to register a new user
    onLogin: (email: string, password: string) => Promise<any>;   // Function to authenticate user
    onLogout: () => Promise<any>;      // Function to log out user
    initialized: boolean;              // Flag indicating if auth state is initialized

}

// Interface for the decoded JWT token structure
interface DecodedToken {
    id: number;                        // User ID stored in the token
}

// Create context with default empty object
const AuthContext = createContext<Partial<AuthProps>>({})

// Custom hook to use the auth context in components
export const useAuth = () => {
    return useContext(AuthContext);
}

// Authentication provider component that wraps the app
export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    // State for storing the JWT token
    const [token, setToken] = useState<string | null>(null);
    // State for storing the user ID
    const [userId, setUserId] = useState<number | null>(null);
    // State to track if the auth system has been initialized
    const [initialized, setInitialized] = useState(false);

    // Effect to load token from secure storage on component mount
    useEffect(() => {
        const loadToken = async () => {
            // Retrieve token from secure storage
            const storedToken = await SecureStore.getItemAsync(JWT_KEY);
            // If token exists, process it
            if(storedToken) {
                processToken(storedToken);
            }
            // Mark auth system as initialized
            setInitialized(true);
        }
        loadToken();
    }, []);

    // Function to decode and process JWT token
    const processToken = (token: string) => {
        try {
            // Decode the JWT token to extract user ID
            const decodedToken = jwtDecode<DecodedToken>(token);
            // Set token in state
            setToken(token);
            // Set user ID from decoded token
            setUserId(decodedToken.id);
            // include the token in the http header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            // Handle token decoding errors by logging out
            console.error('Error decoding token', error)
            handleLogout();
        }
    }

    // Function to handle user login
    const handleLogin = async (email: string, password: string): Promise<any> => {
        // Call API login function
        const result = await loginUser(email, password);
        // If error exists in result, return error details
        if (result.error) {
          return { error: true, msg: result.error };
        }
        // Process the returned token
        processToken(result.data);
        // Store token in secure storage
        await SecureStore.setItemAsync(JWT_KEY, result.data);
        return result;
      };

    // Function to handle user registration
    const handleRegister = async (email: string, password: string, name?: string) => {
        // Call API register function
        const result = await registerUser(email, password, name);
        // If error exists in result, return error details
        if (result.error) {
          return { error: true, msg: result.error };
        }
        return result;
      };
    
    // Function to handle user logout
    const handleLogout = async () => {
        // Remove token from secure storage
        await SecureStore.deleteItemAsync(JWT_KEY);
        // Clear token state
        setToken(null);
        // Clear user ID state
        setUserId(null);
        axios.defaults.headers.common['Authorization'] = '';
    }

    // Combine all auth-related data and functions into a context value object
    const value = {
        initialized,
        onLogin: handleLogin,
        onRegister: handleRegister,
        onLogout: handleLogout,
        token,
        userId,
    };

    // Provide auth context to all child components
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}