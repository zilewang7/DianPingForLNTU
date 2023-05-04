import React from 'react'
import { Text } from '@rneui/themed'
import { View } from 'react-native'

export function PostListBox({ postId }) {
    return (
        <View>
            <Text>{postId}</Text>
        </View>
    )
}