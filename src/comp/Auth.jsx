import React, { useState } from 'react'
import { useColorScheme, Alert, StyleSheet, View, ActivityIndicator, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const theme = useColorScheme();

  async function signInWithEmail() {
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) setError(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    setError('')

    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.')
      setLoading(false)
      return
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) setError(error.message)
    if (!session) Alert.alert('Success', 'Please check your inbox for email verification!')
    setLoading(false)
  }

  function isPasswordStrong(password) {
    return password.length >= 8 && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          style={[
            styles.input,
            { color: theme === 'light' ? 'white' : 'dark' } // Conditional text color
          ]}
          label="Email"
          leftIcon={<Ionicons name="mail-outline" size={24} color="gray" />}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          style={[
            styles.input,
            { color: theme === 'light' ? 'white' : 'dark' } // Conditional text color
          ]}
          label="Password"
          leftIcon={<Ionicons name="lock-closed-outline" size={24} color="gray" />}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button 
          title={loading ? 'Loading...' : 'Sign in'} 
          disabled={loading} 
          onPress={signInWithEmail}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button 
          title={loading ? 'Loading...' : 'Sign up'} 
          disabled={loading} 
          onPress={signUpWithEmail}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    width: "80%",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 40,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
})