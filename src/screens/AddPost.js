import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    Image,
    Button,
    Dimensions,
    Alert
} from 'react-native'
import ProgressBar from "react-native-progress/Bar"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import Snackbar from 'react-native-snackbar'
import { useDispatch, useSelector } from 'react-redux'
import shortid from 'shortid'
import { useNavigation } from '@react-navigation/native'

import storage from "@react-native-firebase/storage"
import database from "@react-native-firebase/database"

const h = Dimensions.get('window').height

const options = {
    mediaType: 'photo',
}

const AddPost = () => {
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)

    const [imageUploading, setImageUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState(null)

    const navigation = useNavigation()

    const userState = useSelector(state => state.auth?.user)


    const onCameraLaunch = async () => {
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

    const addPost = async () => {
        try {
            if (!location || !image || !description) {
                Snackbar.show({
                    text: 'Please add all fields',
                    textColor: 'white',
                    backgroundColor: 'red'
                })
            }

            const uid = shortid.generate()

            await database().ref(`/posts/${uid}`).set({
                location,
                description,
                picture: image,
                by: userState.name,
                date: Date.now(),
                instaId: userState.instaUserName,
                userImage: userState.image,
                id: uid
            })

            console.log('Post added successfully')
            navigation.navigate('Home')

        } catch (error) {
            console.log(error)
            Snackbar.show({
                text: 'Post upload failed',
                textColor: 'white',
                backgroundColor: 'red'
            })
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                
                <TextInput
                    value={location}
                    onChangeText={text => setLocation(text)}
                    placeholder="Location"
                    style={styles.input}
                />
                {image &&
                    <View style={{alignItems:'center', marginVertical: 10}}>
                        <Image
                            source={{ uri: image }}
                            resizeMode='center'
                            style={styles.img}
                        />
                    </View>
                }
                {
                    imageUploading ? (
                        <ProgressBar progress={uploadStatus} style={styles.progress} />
                    ) : (
                        <View style={{ marginBottom: 10 }}>
                            <Button title="Choose an Image" onPress={chooseImage} />
                        </View>
                    )
                }
                <TextInput
                    value={description}
                    onChangeText={text => setDescription(text)}
                    placeholder="Description"
                    style={{ ...styles.input, textAlignVertical: 'top' }}
                    multiline
                    numberOfLines={5}
                />
                <View style={{ marginBottom: 10 }}>
                    <Button title="Add Post" onPress={addPost} />
                </View>

            </View>
            {/* <Text>AddPost</Text> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    img: {
        width: h * 0.2,
        height: h * 0.2,
        borderWidth: 1,
        borderColor: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 15
    },
    progress:{
        width: null,
        marginBottom: 10
    }
})

export default AddPost

