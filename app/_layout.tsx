import React, { useEffect } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { Slot } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter_900Black, useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

//keep the splash screen until I tell the app to hide it
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

const RootLayout = () => {
  // load the custom fonts from the expo font library
let [fonstLoaded] = useFonts({
  Inter_900Black,
  Inter_400Regular,
})

// hide the splash screen once fonts are loaded
useEffect(() =>{
  if (fonstLoaded) {
    SplashScreen.hideAsync();
  }  
} ,[fonstLoaded])

// prevent rendering the app until fonts are fully loaded
// this avoids layout shifts or unstyled text flashing
if (!fonstLoaded) {
  return null;
}

  return (
    <AuthProvider>
       <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
    </AuthProvider>
  )
}

export default RootLayout
