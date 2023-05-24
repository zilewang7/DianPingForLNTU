import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Divider, Text } from '@rneui/themed'
import { getPosts } from '../../api/post.api';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export function StarPostList({ starPost, navigation }) {
    const [postsInfo, setPostsInfo] = useState([]);

    useEffect(() => {
        (() => {
            getPosts({ posts: starPost }).then((res) => {
                if (res.ok) {
                    setPostsInfo(res.json);
                }
            }).catch((err) => { console.error(err) })
        })()
    }, [JSON.stringify(starPost)])
    return (
        <ScrollView>
            {
                postsInfo.length ? starPost.map((currentUid) => {
                    const currentPost = postsInfo.find(({ uid }) => uid === currentUid);
                    if (!currentPost) {
                        return undefined
                    }
                    const { authorId, businessName, businessAddress, rating, title, content } = currentPost;

                    const place = businessAddress.split('-');
                    const placeText = `${place[0]} 食堂 ${place[1]} 楼`;

                    return (
                        <Pressable
                            key={currentUid}
                            style={{
                                padding: 8,
                                marginHorizontal: 8,
                                marginVertical: 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                navigation.navigate('点评', currentPost)
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{authorId.username} 的点评</Text>
                            <Divider style={{ marginVertical: 2 }} />
                            <StarRatingDisplay
                                rating={rating}
                                starSize={20}
                                starStyle={{ marginHorizontal: 0 }}
                            />
                            <Text>{businessName}({placeText}) </Text>
                            <Divider style={{ marginVertical: 2 }} />
                            <Text numberOfLines={1}>
                                {(title || content)}
                            </Text>
                        </Pressable>
                    )
                }) : <></>
            }
        </ScrollView >
    )
}