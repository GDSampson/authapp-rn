import { AuthProvider, useAuth } from "@/context/AuthContext";
import { COLORS } from "@/utils/colors";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const {token, initialized} = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(authenticated)';
    console.log('inauthgroup:' , inAuthGroup)

    if (token && !inAuthGroup) {
      router.replace('/(authenticated)/(tabs)/messages')
    }
  }, [initialized, token])


  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: COLORS.background
          }
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy Policy', presentation: 'modal' }} />
        <Stack.Screen name="register" options={{
          title: 'Create Account',
          headerBackTitle: 'Login', // for ios
        }} />
      </Stack>
    </AuthProvider>

  );
}
