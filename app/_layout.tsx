import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { Slot } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

const RootLayout = () => {
  return (
    <AuthProvider>
       <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
    </AuthProvider>
  )
}

export default RootLayout
