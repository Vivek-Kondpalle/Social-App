import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import 'react-native-gesture-handler'
import LottieView from 'lottie-react-native'

import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import { useDispatch, useSelector } from 'react-redux'

import AddPost from './screens/AddPost'
import Signin from './screens/Signin'
import Home from './screens/Home'
import Signup from './screens/Signup'
import CustomHeader from './components/CustomHeader'
import EmptyContainer from './components/EmptyContainer'

import {SET_USER, IS_AUTHENTICATED} from './actions/action.types'

import {requestPermission} from './utils/AskPermission'
// import AnimatedLottieView from 'lottie-react-native'

const Stack = createStackNavigator()

const App = () => {
  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)

  console.log("authState in App", authState)
  const onAuthStateChanged = (user) => {
    console.log("user in App", user)
    if(user){
      dispatch({
        type: IS_AUTHENTICATED,
        payload: true
      })

      console.log(user._user.uid)

      database().ref(`/user/${user._user.uid}`)
      .on('value', (snapshot) => {
        console.log('USER DETAILS', snapshot.val())
        dispatch({
          type: SET_USER,
          payload: snapshot.val()
        })
      })
    } else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false
      })
    }
  }

  useEffect(() => {
    requestPermission()
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  if(authState.loading){
    return (
        // <EmptyContainer />
        <View style={styles.lottieContainer}>
          <LottieView 
            source={require('./assests/22651-gradient-loader-splash-screen-loading.json')}
            style={styles.splashLoader}
            autoPlay
            loop
          />
        </View>
    )
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: () => <CustomHeader />
          }}
        >
          {authState.isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddPost" component={AddPost} />
            </>
          ) : (
            <>
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Signin" component={Signin} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

const styles = StyleSheet.create({
  lottieContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  splashLoader:{
    width: 100,
    height: 100,
  }
})

export default App

