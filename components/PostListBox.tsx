import React, { useEffect, useState } from 'react'
import { Icon, Text, useTheme } from '@rneui/themed'
import { View, StyleSheet, Image as rnImg } from 'react-native'
import { ScreenWidth } from '@rneui/base';
import { Image } from 'expo-image';
import { MyAvatar } from './components/avatar';
import { StarRatingDisplay } from 'react-native-star-rating-widget';


const ITEM_WIDTH = ScreenWidth / 2;

export function PostListBox({ postInfo }) {
    const { theme } = useTheme();

    const { username, avatarUrl, rating, title, content, imageUrls } = postInfo;

    const [aspectRatio, setAspectRatio] = useState(1);
    useEffect(() => {
        if (imageUrls.length) {
            rnImg.getSize(
                imageUrls[0] + '?x-oss-process=image/resize,h_50,m_lfit',
                (width, height) => {
                    setAspectRatio(width / height);
                }
            );
        }
    }, [imageUrls?.[0]])


    return (
        <View style={{
            ...styles.item,
            backgroundColor: theme.colors.background,
        }}>
            {
                imageUrls?.[0] && (
                    <Image
                        style={{ width: '100%', aspectRatio: aspectRatio, }}
                        source={imageUrls[0] + '?x-oss-process=image/resize,w_400,m_lfit'}
                    />
                )
            }
            <View style={{ padding: 10 }}>
                {
                    imageUrls.length ?
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>{title || content}</Text>
                        :
                        (

                            title ? (
                                <>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                                    <Text numberOfLines={3} ellipsizeMode='tail'>{content}</Text>
                                </>
                            ) : (
                                <Text style={{ fontSize: 18 }} numberOfLines={5} ellipsizeMode='tail'>{content}</Text>
                            )
                        )
                }
                <View style={{
                    flexDirection: 'row',
                    height: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text>评分：</Text>
                    <StarRatingDisplay
                        rating={rating}
                        starSize={18}
                        starStyle={{ marginHorizontal: 0 }}
                    />
                    <Text> ({rating})</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MyAvatar avatarUrl={avatarUrl} size='sm' children={undefined} onAvatarPress={undefined} />
                        <Text style={{ fontSize: 12, maxWidth: ITEM_WIDTH / 3 + 8 }} numberOfLines={1} ellipsizeMode='tail'> {username}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='arrow-up-bold' type='material-community' size={20} color={theme.colors.primary} style={{ paddingLeft: 3, marginRight: -3 }} />
                        <Text>{114}</Text>
                        <Icon name='arrow-down-bold' type='material-community' size={20} color={theme.colors.secondary} style={{ paddingTop: 1, marginBottom: -1, paddingLeft: 3, marginRight: -3 }} />
                        <Text>{514}</Text>
                    </View>
                </View>
            </View>
        </View >
    );
}


const styles = StyleSheet.create({
    item: {
        width: ITEM_WIDTH - 12,
        margin: 6,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        overflow: 'hidden',
    },
});
