import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'

const EmptyContainer = () => {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default EmptyContainer

