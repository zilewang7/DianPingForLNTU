import { Avatar } from '@rneui/themed';
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { MyAvatar } from './components/avatar';
import { pickImage, uploadImg } from '../util/img';
import { MyImageViewer } from './components/imgVIewer';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/userSlice';

interface UserInfo {
    isCurrentUser: boolean,
    username: string,
    avatarUrl?: string,
}

export function UserView({ isCurrentUser = false, username, avatarUrl }: UserInfo) {
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    const pickAvatar = async () => {
        const uri = await pickImage(true);
        if (uri) {
            const result = await uploadImg(uri, 'Avatar');

            dispatch(updateUser({ avatarUrl: result }))
        }
    };

    return (
        <View>
            <View style={styles.baseInfoContainer}>
                <MyAvatar
                    avatarUrl={avatarUrl}
                    onAvatarPress={() => {
                        setVisible(true)
                    }}
                >
                    {isCurrentUser && <Avatar.Accessory size={18} onPress={pickAvatar} />}
                </MyAvatar>
                <Text>{username}</Text>
            </View>
            <MyImageViewer
                visible={visible}
                onCancel={setVisible.bind(this, false)}
                images={[{ url: avatarUrl }]}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    baseInfoContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: "center",
    },
})