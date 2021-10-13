import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import database from "@react-native-firebase/database"

import { useSelector } from "react-redux"

const h = Dimensions.get('window').height

const Post = ({ item, userDetails }) => {

    const [upvote, setUpvote] = useState(0)
    const [downvote, setDownvote] = useState(0)

    const upVotePost = () => {
        database().ref(`/posts/${item.id}/vote/${userDetails.uid}`)
            .set({
                upvote: 1
            })
            .then(() => console.log('UPVOTED'))
    }

    const downVotePost = () => {
        database().ref(`/posts/${item.id}/vote/${userDetails.uid}`)
            .set({
                downvote: 1
            })
            .then(() => console.log('DOWNVOTED'))
    }

    useEffect(() => {
        console.log('item', item)

        if (item.vote) {
            let upVote = 0;
            let downVote = 0;


            Object.values(item.vote).map(val => {
                if (val.upvote) {
                    upVote += 1
                }

                if (val.downvote) {
                    downVote += 1
                }
            })

            setUpvote(upVote)
            setDownvote(downVote)
        }

    }, [item])

    return (
        <View style={styles.postContainer}>
            <View style={styles.topContainer}>
                <View style={styles.profileImgContainer}>
                    <Image
                        source={{ uri: item.userImage }}
                        style={styles.profileImg}
                    />
                </View>
                <View>
                    <Text style={{ fontWeight: 'bold' }}>{item.by}</Text>
                    <Text>{item.location}</Text>
                </View>
            </View>
            <View style={styles.imgContainer}>
                <Image
                    source={{ uri: item.picture }}
                    style={styles.image}
                />
            </View>
            <View style={styles.description}>
                <Text>{item.description}</Text>
            </View>
            <View style={styles.likeContainer}>
                <View style={{ flexDirection: 'row', marginRight: 5 }}>
                    <MaterialCommunityIcons name="thumb-up-outline" size={22} onPress={upVotePost} />
                    <Text> {upvote} </Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                    <MaterialCommunityIcons name="thumb-down-outline" size={22} onPress={downVotePost} />
                    <Text> {downvote} </Text>
                </View>
            </View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        marginTop: 10,
        marginHorizontal: 10
    },
    topContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    profileImgContainer: {
        marginHorizontal: 10,
    },
    profileImg: {
        width: 40,
        height: 40,
    },
    imgContainer: {
        height: h * 0.3
    },
    image: {
        width: '100%',
        height: '100%',
    },
    description: {
        margin: 5
    },
    likeContainer: {
        flexDirection: 'row',
        marginHorizontal: 5,
        marginTop: 10,
        marginBottom: 15
    },
})

export default Post

