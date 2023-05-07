import { Avatar } from '@rneui/themed';
import React from 'react'
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const AvatarSize = {
    sm: 20,
    md: 50,
    lg: 64,
}

const AvatarHeight = {
    sm: '50',
    md: '100',
    lg: '200',
}

export function MyAvatar({
    avatarUrl, children, onAvatarPress, size
}: {
    avatarUrl: string, children, onAvatarPress: () => void | undefined, size: 'sm' | 'md' | 'lg'
}) {
    const url = avatarUrl + `?x-oss-process=image/resize,h_${AvatarHeight[size]},m_lfit`;
    return (
        <Avatar
            size={AvatarSize[size]}
            rounded
            source={{ uri: avatarUrl ? url : undefined }}
            renderPlaceholderContent={<Image source={require('../../assets/Transparent_Akkarin_Transparentized.png')} style={styles.defaultAvatar} />}
            ImageComponent={Image}
            onPress={onAvatarPress}
        >
            {children}
        </Avatar>
    )
};

const styles = StyleSheet.create({
    defaultAvatar: {
        width: '100%',
        height: '100%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 50,
    }
})