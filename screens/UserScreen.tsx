import React from 'react'
import { Text } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';

export function UserScreen() {
    const authorId: any = useRoute().params;

    return (
        <Text>{JSON.stringify(authorId)}</Text>
    )
}
