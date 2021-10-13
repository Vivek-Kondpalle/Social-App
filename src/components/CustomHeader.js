import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch, useSelector } from "react-redux"
import { useNavigation } from '@react-navigation/native'

import { signOut } from "../actions/auth"

const CustomHeader = () => {
    const dispatch = useDispatch()
    const authState = useSelector(state => state.auth)
    const navigation = useNavigation()

    const logout = () => {
        dispatch(signOut())
    }

    console.log("authState in customHEader", authState)
    return (
        <View style={styles.headerContainer}>
            <View style={{ marginLeft: 5 }}>
                <Text style={{ color: 'white' }}>Social App</Text>
            </View>
            <View>
                {authState.isAuthenticated && (
                    <View style={styles.authenticatedContainer}>
                        <TouchableOpacity style={{ marginRight: 30 }} onPress={() => navigation.navigate('AddPost')}>
                            <Text style={{ color: 'white' }}>Add Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={logout}>
                            <MaterialCommunityIcons name="logout" size={24} color="red" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0f4c75',
        height: 45
    },
    authenticatedContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default CustomHeader

