import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import Snackbar from "react-native-snackbar"


export const signUp = (data) => async (dispatch) => {
    console.log("in signup", data)
    const {name, instaUserName, bio, email, password, country, image} = data

    auth().createUserWithEmailAndPassword(email, password)
    .then(data => {
        console.log('data', data)
        console.log('User created')

        database()
        .ref('/user/' + data.user.uid)
        .set({
            name, 
            instaUserName, 
            bio,
            country, 
            image,
            uid: data.user.uid
        })
        .then(() => console.log('Account set success')) 
        Snackbar.show({
            text: 'Account Created',
            textColor: 'white',
            backgroundColor: '#1b262c'
        })
    })
    .catch(error => {
        console.log('error', error)
        Snackbar.show({
            text: 'Signup failed',
            textColor: 'white',
            backgroundColor: 'red'
        })
    })
}

export const signIn = (data) => async (dispatch) => {
    const {email, password} = data

    auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log('Signin successfull')
        Snackbar.show({
            text: 'Signin Successfull',
            textColor: 'white',
            backgroundColor: '#1b262c'
        })
    })
    .catch((error) => {
        console.log('error', error)
        Snackbar.show({
            text: 'Signup failed',
            textColor: 'white',
            backgroundColor: 'red'
        })
    })
}

export const signOut = () => async (dispatch) => {

    auth().signOut()
    .then(() => {
        console.log('Signout successfull')
        Snackbar.show({
            text: 'Signout Successfull',
            textColor: 'white',
            backgroundColor: '#1b262c'
        })
    })
    .catch(error => {
        console.log('error', error)
        Snackbar.show({
            text: 'Signout failed',
            textColor: 'white',
            backgroundColor: 'red'
        })
    })
}