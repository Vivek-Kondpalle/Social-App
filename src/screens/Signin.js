import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TextInput, Button } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import {useDispatch} from "react-redux"

import {signIn} from "../actions/auth"

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const doSignIn = () => {
        dispatch(signIn({email, password}))
    }

    return (
        <ScrollView>
            <View style={styles.formContainer}>
                <View style={styles.imgContainer}>
                    <Image
                        style={{ width: '100%', height: 300, resizeMode: 'contain' }}
                        source={require('../assests/undraw_welcome_cats_thqn.png')}
                    />
                </View>
                <View>
                    <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="Email"
                        style={styles.input}
                    />
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        placeholder="Password"
                        style={styles.input}
                        secureTextEntry
                    />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Button title="Sign up" onPress={doSignIn} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Don't have an account?</Text>
                    <Text><Text onPress={() => navigation.navigate('Signup')}> SignUp</Text> here</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        margin: 10
    },
    imgContainer: {
        marginBottom: 10,
    },
    image: {
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 15
    }
})

export default Signin

