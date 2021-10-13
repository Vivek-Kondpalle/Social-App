import React, { useState } from 'react'
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    Alert, 
    Button, 
    TextInput,
    Image,
    Dimensions 
} from 'react-native'

import storage from "@react-native-firebase/storage"
import ProgressBar from "react-native-progress/Bar"
import { useDispatch, useSelector } from 'react-redux'
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import {useNavigation} from "@react-navigation/native"
// import {options} from "../utils/options"

import { signUp } from "../actions/auth"
import defaultImage from "../assests/defaultImage.png"
import { requestPermission } from "../utils/AskPermission"

const options = {
    mediaType: 'photo',
    maxHeight: 400,
    maxWidth: 400
}

const h = Dimensions.get('window').height

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [instaUserName, setInstaUserName] = useState('')
    const [country, setCountry] = useState('')
    const [bio, setBio] = useState('')
    const [image, setImage] = useState('')
    console.log('default', image)
    const [imageUploading, setImageUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState(null)

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const onCameraLaunch = async () => {
        // await requestPermission()
        console.log('inside cameraLaunch')
        launchCamera(options, (response) => {
            console.log('response in cameraLaunch', response)

            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.errorCode === 'camera_unavailable') {
                console.log('Camera unavailable')
            } else if (response.errorCode === 'permission') {
                console.log('Permission not satisfied')
            } else {
                console.log('response.assests', response.assets[0].uri)
                uploadImage(response.assets[0])
            }
        })
    }

    const onGalleryLaunch = () => {
        launchImageLibrary(options, (response) => {
            console.log('response in cameraLaunch', response)

            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.errorCode === 'camera_unavailable') {
                console.log('Camera unavailable')
            } else if (response.errorCode === 'permission') {
                console.log('Permission not satisfied')
            } else {
                console.log('response.assests', response.assets[0].uri)
                uploadImage(response.assets[0])
            }
        })
    }

    const chooseImage = async () => {
        Alert.alert('Choose Image', 'Choose image from :', [
            {
                text: 'Gallery',
                onPress: onGalleryLaunch
            },
            {
                text: 'Camera',
                onPress: onCameraLaunch
            },
            {
                text: 'Cancel',
                onPress: () => { console.log('Cancel pressed') },
                style: 'cancel'
            },
        ], {
            cancelable: true
        })
    }

    const uploadImage = async (response) => {
        setImageUploading(true)
        const reference = storage().ref(response.fileName)

        const task = reference.putFile(response.uri)

        task.on('state_changed', (taskSnapshot) => {
            const percentage = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000

            setUploadStatus(percentage)
        })

        task.then(async () => {
            const url = await reference.getDownloadURL()

            setImage(url)
            setImageUploading(false)
        })
    }

    const doSignUp = async () => {
        console.log('in doSignUp', name, instaUserName, email, password, bio, country, image)
        dispatch(signUp({ name, instaUserName, email, password, bio, country, image }))
    }

    return (
        <ScrollView>
            {/* <Text>Signup</Text>
            <Button title="Photo" onPress={chooseImage} /> */}
            <View style={styles.signUpContainer}>
                <TouchableOpacity style={styles.imgContainer} onPress={chooseImage}>
                    <Image style={{ width: h * 0.2, height: h * 0.2 , borderWidth: 1, borderColor: 'black'}} source={image ? {uri : image} : require('../assests/defaultImage.png') }/>
                </TouchableOpacity>
                {
                    imageUploading && (
                        <ProgressBar progress={uploadStatus} style={styles.progress} />
                    )
                }
                <View style={styles.inputContainer}>
                    <View>
                        <TextInput
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholder="Name"
                        style={styles.input}
                        />
                    </View>
                    <View>
                        <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="Email"
                        style={styles.input}
                        />
                    </View>
                    <View>
                        <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        placeholder="Password"
                        style={styles.input}
                        secureTextEntry
                        />
                    </View>
                    <View>
                        <TextInput
                        value={instaUserName}
                        onChangeText={text => setInstaUserName(text)}
                        placeholder="Instagram user name"
                        style={styles.input}
                        />
                    </View>
                    <View>
                        <TextInput
                        value={bio}
                        onChangeText={text => setBio(text)}
                        placeholder="Your Short Bio"
                        style={styles.input}
                        />
                    </View>
                    <View>
                        <TextInput
                        value={country}
                        onChangeText={text => setCountry(text)}
                        placeholder="Country"
                        style={styles.input}
                        />
                    </View>
                </View>
                <View style={{marginBottom: 10}}>
                    <Button title="Sign up" onPress={doSignUp} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Already have an account?</Text>
                    <Text><Text onPress={() => navigation.navigate('Signin')}> LogIn </Text> here</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({ 
    signUpContainer:{
        margin: 10,
        // backgroundColor: '#0f4c75'
    },
    imgContainer:{
        alignItems: 'center',
        marginBottom: 10,
    },
    inputContainer:{
        marginBottom: 10
    },
    input:{
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 15
    },
    progress:{
        width: null,
        marginBottom: 10
    }
})

export default Signup

