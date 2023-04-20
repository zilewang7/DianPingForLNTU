import { Avatar } from '@rneui/themed';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { MyAvatar } from './components/avatar';

interface UserInfo {
    isCurrentUser: boolean,
    username: string,
    avatarUrl?: string,
}


export function UserView({ isCurrentUser = false, username, avatarUrl }: UserInfo) {

    return (
        <View>
            <View style={styles.baseInfoContainer}>
                <MyAvatar
                    avatarUrl={avatarUrl}
                    onAvatarPress={() => {
                        console.log(666);
                    }}
                >
                    {isCurrentUser && <Avatar.Accessory size={18} onPress={() => {
                        console.log('777');
                    }} />}
                </MyAvatar>
                <Text>{username}</Text>
            </View>
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