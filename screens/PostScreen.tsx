import React, { useEffect, useMemo, useRef, useState } from 'react'
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { Button, Divider, Icon, Input, Text, useTheme } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScreenHeight, ScreenWidth } from '@rneui/base';
import { View, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { hexToRgba } from '../util/color';
import { ScreenShotBottom } from '../components/components/screenShotBottom';
import { ImageList } from '../components/components/imageList';
import { MyAvatar } from '../components/components/avatar';
import { formatDate } from '../util/time';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Pressable } from 'react-native';
import { FollowButton } from '../components/components/followButton';
import { addPostStar, getPosts, votePost } from '../api/post.api';
import { useSelector } from '../redux/hook';
import { pullUser } from '../util/user2';

export function PostScreen({ navigation }) {
    const beforePostInfo: any = useRoute().params;
    const { _id, starPost } = useSelector(state => state.user);
    const { theme } = useTheme();
    const headerHeight = useHeaderHeight();

    const viewShotRef = useRef<any>();
    const headerRef = useRef<any>(0);

    const [postInfo, setPostInfo] = useState(beforePostInfo);
    const [imgIndex, setImgIndex] = useState(0);
    const [onScreenShot, setScreenShot] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);

    let { uid, businessName, businessAddress, imageUrls = [], username, authorId, avatarUrl, title, rating, content, createdAt, up, down, comments = [] } = postInfo;


    const imageHeight = useMemo(() => {
        const imgH = ScreenWidth / aspectRatio;
        if (imgH < (ScreenHeight / 2)) {
            return imgH;
        } else {
            return ScreenHeight / 2;
        }
    }, [aspectRatio, ScreenWidth, ScreenHeight])

    const bottomButtonState = useMemo(() => {
        return {
            'up': up?.includes(_id) || false,
            'down': down?.includes(_id) || false,
            'star': starPost?.includes(uid) || false,
        }
    }, [_id, starPost, JSON.stringify(up), JSON.stringify(down), uid])

    useEffect(() => {
        getPosts({ posts: [uid] }).then((res) => {
            if (res.ok) {
                setPostInfo(res.json[0]);
            }
        })
    }, [uid])
    useEffect(() => {
        if (imageUrls.length) {
            Image.getSize(
                imageUrls[0] + '?x-oss-process=image/resize,h_50,m_lfit',
                (width, height) => {
                    setAspectRatio(width / height);
                }
            );
        }
    }, [imageUrls?.[0]])
    const headerTitle = useMemo(() => {
        const place = businessAddress.split('-');
        return `${businessName}(${place[0]}食堂${place[1]}楼) 点评`
    }, [])
    useEffect(() => {
        navigation.setOptions({
            title: headerTitle,
        });
    }, []);

    const vote = (type) => {
        votePost({ type, uid }).then((res) => {
            if (res.ok) {
                const { up, down } = res.json;
                setPostInfo(postInfo => ({
                    ...postInfo,
                    up,
                    down,
                }))
            }
        })
    }


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={25}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }} ref={viewShotRef}>
                <View
                    ref={headerRef}
                    style={{
                        height: headerHeight,
                        marginBottom: -headerHeight,
                        zIndex: 100,
                        ...imageUrls.length ? {} : {
                            backgroundColor: theme.colors.background,
                            elevation: 4,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        }
                    }}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={4}
                    onScroll={(event) => {
                        if (!imageUrls.length) return;
                        const { contentOffset } = event.nativeEvent;
                        if (contentOffset.y < (imageHeight - headerHeight)) {
                            headerRef?.current.setNativeProps({
                                style: {
                                    backgroundColor: hexToRgba(theme.colors.background, (contentOffset.y / (imageHeight - headerHeight)).toString()),
                                    elevation: null,
                                    shadowOffset: null,
                                    shadowOpacity: null,
                                    shadowRadius: null,
                                }
                            })
                        } else {
                            headerRef?.current.setNativeProps({
                                style: {
                                    backgroundColor: hexToRgba(theme.colors.background, '1'),
                                    elevation: 4,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                }
                            })
                        }
                    }}
                >
                    <>
                        {
                            imageUrls.length ? (
                                <>
                                    <View
                                        style={{
                                            width: '100%',
                                            height: imageHeight,
                                        }}
                                    >
                                        <ImageList
                                            index={imgIndex}
                                            setIndex={setImgIndex}
                                            imageUrls={imageUrls}
                                            height={imageHeight}
                                        />
                                        <View style={{ width: '100%', height: 30, marginTop: -30, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text>{imgIndex + 1}/{imageUrls.length}</Text>
                                        </View>
                                    </View>
                                </>
                            ) : <View style={{ height: headerHeight }} />
                        }
                        <View style={{ paddingHorizontal: 15 }}>
                            <View style={{ flexDirection: 'row', marginVertical: 15, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                    navigation.navigate('用户', username);
                                }}>
                                    <MyAvatar avatarUrl={avatarUrl} children={undefined} onAvatarPress={undefined} size={'md'} />
                                    <Text h4> {username}</Text>
                                </Pressable>
                                <FollowButton userId={authorId} />
                            </View>
                            {
                                title && <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{title}</Text>
                            }
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>评分：</Text>
                                <StarRatingDisplay
                                    rating={rating}
                                    starSize={22}
                                    starStyle={{ marginHorizontal: 0 }}
                                />
                                <Text>（{rating}）</Text>
                            </View>
                            <Text style={{ fontSize: 18, paddingVertical: 10 }}>{content}</Text>
                            <Text style={{ color: theme.colors.grey3 }}>发布时间：{formatDate(createdAt).join(' ')}</Text>
                        </View>
                        <Divider style={{ marginVertical: 10, marginHorizontal: 10 }} />
                        <View style={{ paddingHorizontal: 15 }}><Text h4>回复</Text></View>
                        {
                            comments.length ?
                                (
                                    <StaggeredList
                                        animationType='EFFECTIVE'
                                        data={comments}
                                        numColumns={1}
                                        renderItem={({ item }) => <></>}
                                    />
                                )
                                : (
                                    <View style={{
                                        height: ScreenHeight - (Platform.OS === "ios" ? 120 : headerHeight) - 55,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text h4>暂无回复</Text>
                                            <TouchableOpacity onPress={() => { }}><Text>说点什么 &gt;</Text></TouchableOpacity>
                                        </View>
                                    </View>
                                )
                        }
                        <View style={{
                            backgroundColor: theme.colors.background,
                            alignItems: 'center',
                            height: 200,
                            marginBottom: -200,
                        }}>
                            <Text h3 style={{ marginTop: 10 }}>我是有底线的</Text>
                        </View>
                    </>
                </ScrollView>
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    backgroundColor: theme.colors.background,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <View style={{ width: '50%', paddingHorizontal: 10 }}>
                        <Input
                            placeholder='回复'
                            containerStyle={{ backgroundColor: theme.colors.grey5, borderRadius: 10, overflow: 'hidden', height: 40 }}
                            leftIconContainerStyle={{ marginVertical: 0 }}
                            inputContainerStyle={{ borderBottomWidth: 0 }}
                            leftIcon={<Icon name='edit' type='antdesign' size={15} />}
                        />
                    </View>
                    <View style={{ width: '50%', flexDirection: 'row' }}>
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
                            {
                                name: 'star',
                                icon: 'staro',
                                selectIcon: 'star',
                                type: 'antdesign',
                                selectColor: '#f7b129',
                                onPress: () => { addPostStar(uid).then((res) => { if (res.ok) { pullUser() } }) }
                            },
                            {
                                name: 'share',
                                icon: 'sharealt',
                                type: 'antdesign',
                                onPress: async () => {
                                    try {
                                        setScreenShot(true);
                                        await new Promise(resolve => setTimeout(resolve)); // 等待渲染完成
                                        const uri = await captureRef(viewShotRef,
                                            { fileName: username + headerTitle }
                                        )
                                        await Sharing.shareAsync('file://' + uri);
                                    } catch (error) {
                                        console.error(error);
                                    } finally {
                                        setScreenShot(false);
                                    }
                                }
                            },
                        ].map((item) => {
                            const isSelect = bottomButtonState[item.name]
                            return (
                                <TouchableOpacity
                                    key={item.name}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        width: ScreenWidth / 8
                                    }}
                                    onPress={item.onPress}
                                >
                                    <Icon
                                        name={isSelect ? item.selectIcon : item.icon}
                                        type={item.type}
                                        color={isSelect ? item.selectColor : undefined}
                                    />
                                    {(item.name === 'up' || item.name === 'down') ? <Text>{postInfo[item.name].length}</Text> : <></>}
                                </TouchableOpacity>
                            )
                        })
                        }
                    </View>
                </View>
                {
                    onScreenShot && (
                        <ScreenShotBottom ScreenHeight={ScreenHeight} content={username + ' 的\n' + headerTitle} />
                    )
                }
            </View >
        </KeyboardAvoidingView>
    )
}