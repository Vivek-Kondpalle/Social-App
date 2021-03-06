import { PermissionsAndroid, ToastAndroid } from "react-native"

export const requestPermission = async () => {
    console.log("request permission")
    try {   
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ])

        console.log("granted", granted)
        
        if(
            granted['android.permission.READ_EXTERNAL_STORAGE'] === 'denied' ||
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
        ){
            ToastAndroid.show('We cannot proced without permission', ToastAndroid.LONG)
            requestPermission()
        }

    } catch (error) {
        console.log('error', error)
    }
}