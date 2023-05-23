import React from 'react'
import { Text } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { UserView } from '../components/UserView';

export function UserScreen() {
    const authorId: any = useRoute().params;


    return (
        <View>
            <UserView isCurrentUser={false} userInfo={authorId} />
        </View>
    )
}
