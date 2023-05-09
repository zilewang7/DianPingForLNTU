import React from 'react'
import { Text } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';

export function UserScreen() {
    const username: any = useRoute().params;

    return (
        <Text>{username}</Text>
    )
}
