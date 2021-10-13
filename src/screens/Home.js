import React, { useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native'

import { useSelector, useDispatch } from "react-redux"

import { getPosts } from "../actions/post"
import Post from "../components/Post"
import EmptyContainer from "../components/EmptyContainer"

const h = Dimensions.get('window').height

const Home = () => {
    const dispatch = useDispatch()
    const postState = useSelector(state => state.post)
    const userDetails = useSelector(state => state.auth?.user)
    
    useEffect(() => {
        dispatch(getPosts())
    }, [])

    if(postState.loading){
        return (
            <EmptyContainer />
        )
    }

    return (
        <View>
            <FlatList 
            data={postState.posts}
            keyExtractor={item => item.id}
            renderItem={({item, index, seperators}) => (
                <Post item={item} userDetails={userDetails} key={item.id} />
            )}
            ListEmptyComponent={() => (
                <View style={{height: h, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>No posts found!</Text>
                </View>
            )}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})
