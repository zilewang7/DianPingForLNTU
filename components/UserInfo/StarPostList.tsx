import React from 'react'
import { ScrollView, View } from 'react-native'
import { Text } from '@rneui/themed'

export function StarPostList({ starPost }) {
    return (
        <ScrollView>
            <Text>{JSON.stringify(starPost)}</Text>
        </ScrollView>
    )
}