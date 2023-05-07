import React from 'react'
import { Text, useTheme } from '@rneui/themed'
import { View, StyleSheet } from 'react-native'
import { ScreenWidth } from '@rneui/base';

const ITEM_WIDTH = ScreenWidth / 2;
const ITEM_HEIGHT = 250;

const PostItem = ({ postInfo }) => {
    const { theme } = useTheme();
    return (
        <View style={{ backgroundColor: theme.colors.background }}>
            <View style={{ ...styles.item, backgroundColor: theme.colors.background }}>
                <Text>{JSON.stringify(postInfo)}</Text>
            </View>
        </View>
    );
};

export function PostListBox({ index, postInfo }) {
    const isLeft = index % 2 !== 0;
    return (
        <View style={styles.row}>
            {isLeft ? (
                <PostItem postInfo={postInfo} />
            ) : (
                <View style={{ width: ITEM_WIDTH }} />
            )}
            {!isLeft ? (
                <PostItem postInfo={postInfo} />
            ) : (
                <View style={{ width: ITEM_WIDTH }} />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    item: {
        width: ITEM_WIDTH - 20,
        height: ITEM_HEIGHT,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
});
