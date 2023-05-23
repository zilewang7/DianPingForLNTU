import { Avatar, Button, Divider, Text } from '@rneui/themed';
import React, { useState } from 'react'
import { View, StyleSheet, Pressable } from 'react-native';
import { MyAvatar } from './components/avatar';
import { pickImage, uploadImg } from '../util/img';
import { MyImageViewer } from './components/imgVIewer';
import { useDispatch } from 'react-redux';
import { User, updateUser } from '../redux/slices/userSlice';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FollowButton } from './components/followButton';

interface UserInfo {
    isCurrentUser: boolean,
    userInfo: User,
}

export function UserView({ isCurrentUser, userInfo }: UserInfo) {
    const { username, _id, avatarUrl } = userInfo;

    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const pickAvatar = async () => {
        const uri = await pickImage(true);
        if (uri) {
            const result = await uploadImg(uri, 'Avatar');

            dispatch(updateUser({ avatarUrl: result }))
        }
    };

    const Info = ({ title, num = 0 }) =>
    (<View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={{ padding: 4 }}>{num}</Text>
    </View>)

    return (
        <Pressable onPress={() => {
            if (isCurrentUser && username === '未登录') {
                navigation.dispatch(
                    CommonActions.navigate({
                        name: '登录/注册',
                        params: {
                            screen: '登录/注册',
                        },
                    })
                );
            }
        }}>
            <View style={{ marginTop: 25 }}>
                <View style={styles.baseInfoContainer}>
                    <MyAvatar
                        avatarUrl={avatarUrl}
                        onAvatarPress={username !== '未登录' ? () => {
                            if (avatarUrl) {
                                setVisible(true)
                            } else {
                                pickAvatar()
                            }
                        } : undefined}
                        size='lg'
                    >
                        {isCurrentUser && username !== '未登录' && <Avatar.Accessory size={20} onPress={pickAvatar} />}
                    </MyAvatar>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username}>{username} </Text>
                        {isCurrentUser || <FollowButton userId={_id} />}
                    </View>
                </View>
                <MyImageViewer
                    visible={visible}
                    onCancel={setVisible.bind(this, false)}
                    images={[{ url: avatarUrl }]}
                />
            </View>
            <View style={styles.vertical}>
                <Info title='点评' num={userInfo.posts?.length} />
                <Divider orientation="vertical" width={2} />
                <Info title='收藏' num={userInfo.starBusiness?.length} />
                <Divider orientation="vertical" width={2} />
                <Info title='关注' num={userInfo.follow?.length} />
                <Divider orientation="vertical" width={2} />
                <Info title='粉丝' num={userInfo.fans?.length} />
            </View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    baseInfoContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    usernameContainer: {
        flexDirection: 'row',
        width: '50%',
        height: '100%',
        alignItems: "center",
        justifyContent: 'center',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    vertical: {
        padding: 20,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    infoContainer: {
        alignItems: "center",
        paddingVertical: 5,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})
