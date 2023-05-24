import React, { useEffect, useState } from 'react'
import { Text } from '@rneui/themed'
import { getUsersInfo } from '../../api/user.api'
import { Pressable, View } from 'react-native';
import { MyAvatar } from '../components/avatar';
import { FollowButton } from '../components/followButton';

export function UserList({ userList, navigation }) {
    const [usersInfo, setUsersInfo] = useState([]);

    useEffect(() => {
        getUsersInfo(userList).then(
            (res) => {
                if (res.ok) {
                    setUsersInfo(res.json)
                }
            }
        )
    }, [JSON.stringify(userList)])
    return (
        <View>
            {
                usersInfo.length ? (
                    usersInfo.map((user) => {
                        const { username, avatarUrl, _id } = user

                        return (
                            <Pressable
                                key={username}
                                style={{
                                    padding: 8,
                                    marginHorizontal: 8,
                                    marginVertical: 5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    navigation.goBack();
                                    navigation.navigate('用户', user)
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MyAvatar avatarUrl={avatarUrl} children={undefined} onAvatarPress={undefined} size={'nm'} />
                                    <Text style={{ fontSize: 20 }}> {username}</Text>
                                </View>
                                <FollowButton userId={_id} />
                            </Pressable>
                        )
                    })
                ) : <></>
            }
        </View>
    )
}
