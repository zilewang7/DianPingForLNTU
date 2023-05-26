import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text } from '@rneui/themed'
import { sortBy } from 'lodash'
import { useSelector } from '../redux/hook';
import { getPost } from '../api/post.api';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { PostListBox } from '../components/PostListBox';

export function PostsScreen({ navigation }) {
    const screenType = useRoute().params as unknown as string;

    const [postsInfo, setPostsInfo] = useState([]);

    const { _id } = useSelector(state => state.user)


    useEffect(() => {
        if (!_id) {
            navigation.goBack();
            navigation.navigate('登录/注册')
        } else {
            getPost(screenType).then((res) => {
                if (res.ok) {
                    const sortByUid = sortBy(res.json, (o) => -Number(o.uid))
                    setPostsInfo(sortByUid);
                }
            })
        }
    }, [screenType, _id])


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                postsInfo.length ? (
                    <StaggeredList
                        animationType='EFFECTIVE'
                        data={postsInfo}
                        renderItem={({ item }) => <PostListBox postInfo={item} navigation={navigation} />}
                    />
                ) : (
                    <Text h4>当前关注的{screenType === 'follow' ? '用户' : '商家'}没有帖子</Text>
                )
            }
        </View>
    )
}
