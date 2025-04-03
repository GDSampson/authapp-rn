import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { COLORS } from '@/utils/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'expo-router';


//create schema with zod to use for form and validation
const schema = z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password:
        z.string()
            .min(6, 'Password must be at least 6 characters')
            .max(32, 'Password must be at most 32 characters')
})

//create typing for form
type FormData = z.infer<typeof schema>;

const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    //form setup with useForm hook and zod validation
    const { control, handleSubmit, trigger, formState: {errors} } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: 'Tester',
            email: 'a@example.com',
            password: '123456',
        },
        mode: 'onChange', // will validate on field change
    });

    //initial submit handle
    const onSubmit = (data: any) => {
        console.log(data);
        setLoading(true); // set loading to true after submitting

        //setting a timeout to simulate a call
        setTimeout(() => {
            setLoading(false); //set loading back to false when done
            router.push('/'); //push to index
        }, 2000)
    };

    return (
        <View style={styles.container}>
            {/* keyboardAvoidingView adjusts layout when keyboard appears */}
            <KeyboardAvoidingView behavior='padding' style={{ flex: 1, justifyContent:'center' }}>


                {/* controller for name form input */}
                <Controller
                    control={control}
                    name='name'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder='Name (optional)'
                                placeholderTextColor={COLORS.placeholder}
                            />
                        </View>
                    )}
                />

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
                    disabled={!!errors.email || !! errors.password}
                    onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            {/* loading overlay - shown during form submission */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </View>
            )}
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
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
        color:"#ff6b6b",
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