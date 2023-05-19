import { Icon, Text, useTheme } from '@rneui/themed'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { MyAvatar } from './components/avatar';
import { formatDate } from '../util/time';
import { Pressable } from 'react-native';
import { ImageListViewer } from './components/showImage';
import { voteComment } from '../api/post.api';
import { clone } from 'lodash';

export function CommentListBox({ navigation, theme, comment, uid, setPostInfo, userId }) {

    const { _id, authorId, content, imageUrls, createdAt, reply } = comment;

    const { username, avatarUrl } = authorId;

    const vote = (type) => {
        voteComment({ type, uid, commentId: _id }).then((res) => {
            if (res.ok) {
                const { up, down } = res.json;
                setPostInfo(postInfo => {
                    const newPostInfo = clone(postInfo)
                    const currentComment = newPostInfo.comments.find(({ _id: c_id }) => c_id === _id);
                    currentComment.up = up;
                    currentComment.down = down;
                    return newPostInfo;
                })
            }
        })
    }

    return (
        <View style={{ margin: 15 }}>
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { navigation.navigate('用户', authorId); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MyAvatar avatarUrl={avatarUrl} children={undefined} onAvatarPress={undefined} size={'nm'} />
                    <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: 'bold' }}>{username}</Text>
                </View>
                <Text style={{ color: theme.colors.grey3 }}>{formatDate(createdAt).join(' ')}</Text>
            </Pressable>
            <TouchableOpacity style={{ margin: 15, marginLeft: 50 }}>
                <Text style={{ fontSize: 16 }}>{content}</Text>
                {
                    imageUrls.length ? (
                        <ImageListViewer images={imageUrls} />
                    ) : <></>
                }
                {
                    reply.length ? (
                        <Text>{JSON.stringify(imageUrls)}</Text>
                    ) : <></>
                }
            </TouchableOpacity>
            <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                {[
                    {
                        name: 'up',
                        icon: 'arrow-up-bold-outline',
                        selectIcon: 'arrow-up-bold',
                        type: 'material-community',
                        selectColor: theme.colors.primary,
                        onPress: () => { vote('up') },
                    },
                    {
                        name: 'down',
                        icon: 'arrow-down-bold-outline',
                        selectIcon: 'arrow-down-bold',
                        type: 'material-community',
                        selectColor: theme.colors.secondary,
                        onPress: () => { vote('down') },
                    },
                ].map((item) => {
                    const isSelect = comment?.[item.name]?.includes(userId) || false;

                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                paddingHorizontal: 10,
                            }}
                            onPress={item.onPress}
                        >
                            <Icon
                                name={isSelect ? item.selectIcon : item.icon}
                                type={item.type}
                                color={isSelect ? item.selectColor : undefined}
                            />
                            <Text>{comment?.[item.name]?.length || 0}</Text>
                        </TouchableOpacity>
                    )
                })
                }
            </View>
        </View >
    )
}
