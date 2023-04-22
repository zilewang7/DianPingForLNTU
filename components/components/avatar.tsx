import { Avatar } from '@rneui/themed';
import React from 'react'
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';




export function MyAvatar({ avatarUrl, children, onAvatarPress }) {
    return (
        <Avatar
            size={64}
            rounded
            source={avatarUrl && { uri: avatarUrl }}
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