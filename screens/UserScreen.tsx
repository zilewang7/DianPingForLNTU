import React from 'react'
import { Tab, TabView, Text } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { UserView } from '../components/UserView';
import { StarBusinessList } from '../components/UserInfo/StarBusinessList';
import { StarPostList } from '../components/UserInfo/StarPostList';
import { UserList } from '../components/UserInfo/UserList';

export function UserScreen({ navigation }) {
    const userInfo: any = useRoute().params;
    const [index, setIndex] = React.useState(0);

    return (
        <View style={{ flex: 1 }}>
            <UserView isCurrentUser={false} userInfo={userInfo} navigation={navigation} />
            <View style={{ flex: 1 }}>
                <Tab
                    value={index}
                    onChange={(e) => setIndex(e)}
                    style={{}}
                >
                    <Tab.Item title="点评" />
                    <Tab.Item title="收藏" />
                    <Tab.Item title="关注" />
                    <Tab.Item title="粉丝" />
                </Tab>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item style={{ width: '100%' }}>
                        {
                            userInfo?.posts.length ?
                                <StarPostList starPost={userInfo.posts} navigation={navigation} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>ta没有点评过</Text>
                                </View>
                        }
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        {
                            userInfo?.starBusiness.length ?
                                <StarBusinessList starBusiness={userInfo.starBusiness} navigation={navigation} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>ta没有收藏店铺</Text>
                                </View>
                        }
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        {
                            userInfo?.follow.length ?
                                <UserList userList={userInfo.follow} navigation={navigation} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>ta没有关注的人</Text>
                                </View>
                        }
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        {
                            userInfo?.fans.length ?
                                <UserList userList={userInfo.fans} navigation={navigation} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>还没有人关注ta</Text>
                                </View>
                        }
                    </TabView.Item>
                </TabView>
            </View>
        </View>
    )
}
