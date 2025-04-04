import { Text, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator, TextInput, Alert } from "react-native";
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { COLORS } from '@/utils/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useRouter } from 'expo-router';
import { useAuth } from "@/context/AuthContext";


//create schema with zod to use for form and validation
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password:
    z.string()
      .min(1, 'Password is required')
})

//create typing for form
type FormData = z.infer<typeof schema>;

export default function Index() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { onLogin } = useAuth();

  //form setup with useForm hook and zod validation
  const { control, handleSubmit, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'a@a.com',
      password: '123456',
    },
    mode: 'onChange', // will validate on field change
  });

  //initial submit handle
  const onSubmit = async (data: any) => {
    setLoading(true); // set loading to true after submitting
    const result = await onLogin!(data.email, data.password);
    if (result && result.error) {
      Alert.alert('Error', result.msg);
    } else {
      router.push('/');
    }
    setLoading(false);
  };


  return (
    <View style={styles.container}
    >
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1, justifyContent: 'center' }}>

        <Image
          source={require('../../assets/images/FF.png')}
          style={styles.image}
        />

        <Text style={styles.header}>Final Fantasy</Text>
        <Text style={styles.subheader}>An app for Final Fantasy art</Text>

        {/* keyboardAvoidingView adjusts layout when keyboard appears */}
        {/* controller for email form input */}
        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder='john@example.com'
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize='none'
                keyboardType='email-address'
              />
              {/* display validation error if exists */}
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        {/* controller for password form input */}
        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder='Password'
                secureTextEntry
                placeholderTextColor={COLORS.placeholder}
              />
              {/* display validation error if exists */}
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />
        {/* submit button - disabled when validation errors exist */}
        <TouchableOpacity style={[styles.button,
        !errors.email && !errors.password ? {} : styles.buttonDisabled]}
          disabled={!!errors.email || !!errors.password}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        {/* register button */}
        <Link href={'/register'} asChild>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>
              Register!
            </Text>
          </TouchableOpacity>
        </Link>

        {/* button for fake policy page */}
        <Link href={'/privacy'} asChild>
          <TouchableOpacity style={{ alignItems: 'center', paddingTop: 5 }}>
            <Text style={styles.outlineButtonText}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </Link>

      </KeyboardAvoidingView>
      {/* loading overlay - shown during form submission */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={'large'} color={'#fff'} />
        </View>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  outlineButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginVertical: 8,
    backgroundColor: 'transparent',

  },
  outlineButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,

  },
  header: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  subheader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
  },
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: 50,
    color: '#fff',

  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, //makes sure the component this is applied to has absolute position and fills the entire screen
    backgroundColor: 'rgba(0, 0, 0, .6)',
    justifyContent: 'center',
    zIndex: 1,

  }
})