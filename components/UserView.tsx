import { Avatar } from '@rneui/themed';
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { MyAvatar } from './components/avatar';
import { pickImage } from '../util/img';
import { MyImageViewer } from './components/imgVIewer';
import { ImageResult } from 'expo-image-manipulator';

interface UserInfo {
    isCurrentUser: boolean,
    username: string,
    avatarUrl?: string,
}

export function UserView({ isCurrentUser = false, username, avatarUrl }: UserInfo) {
    const [image, setImage] = useState(null);
    const [visible, setVisible] = useState(false);

    const pickAvatar = async () => {
        const uri = await pickImage(true) as ImageResult;
        if (uri) {
            setImage(uri);
        }
    };

    return (
        <View>
            <View style={styles.baseInfoContainer}>
                <MyAvatar
                    avatarUrl={image}
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
                images={[{ url: image }]}
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