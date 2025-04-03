import { Text, View, StyleSheet, TouchableOpacity } from "react-native"; 
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { COLORS } from '@/utils/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useRouter } from 'expo-router';


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
  
  
      //form setup with useForm hook and zod validation
      const { control, handleSubmit, trigger, formState: {errors} } = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
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
    <View style={styles.container}
    >
      <Link href={'/register'} asChild>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>
            Register!
          </Text>
        </TouchableOpacity>
      </Link>
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
    alignItems:'center',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginVertical: 8,
    backgroundColor: 'transparent',

  },
  outlineButtonText: {  
    color:'#fff',
    fontSize: 16,
    fontWeight: 600,
  },
})