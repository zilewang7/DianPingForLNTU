import React, { useEffect, useMemo, useRef, useState } from 'react'
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { Button, Divider, Icon, Input, Text, useTheme } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScreenHeight, ScreenWidth } from '@rneui/base';
import { View, Platform, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { hexToRgba } from '../util/color';
import { ScreenShotBottom } from '../components/components/screenShotBottom';
import { ImageList } from '../components/components/imageList';
import { MyAvatar } from '../components/components/avatar';
import { formatDate } from '../util/time';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Pressable } from 'react-native';

export function PostScreen({ navigation }) {
    const postInfo: any = useRoute().params;
    const { theme } = useTheme();

    const { businessName, businessAddress, imageUrls = [], username, avatarUrl, title, rating, content, createdAt, up, down, comments = [] } = postInfo;

    const headerHeight = useHeaderHeight();

    const viewShotRef = useRef<any>();
    const headerRef = useRef<any>(0);

    const [imgIndex, setImgIndex] = React.useState(0);
    const [onScreenShot, setScreenShot] = useState(false);

    const shortRating = parseInt((rating * 10).toString()) / 10

    const [aspectRatio, setAspectRatio] = useState(1);
    const imageHeight = useMemo(() => {
        const imgH = ScreenWidth / aspectRatio;
        if (imgH < (ScreenHeight / 2)) {
            return imgH;
        } else {
            return ScreenHeight / 2;
        }
    }, [aspectRatio, ScreenWidth, ScreenHeight])
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
    useEffect(() => {
        const place = businessAddress.split('-');
        navigation.setOptions({
            title: `${businessName}(${place[0]}食堂${place[1]}楼) 点评`,
        });
    }, []);

    return (
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
                            <Button size='sm' title='+关注' />
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
                                    style={{ backgroundColor: theme.colors.background, }}
                                    animationType='EFFECTIVE'
                                    data={[]}
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
                        },
                        {
                            name: 'down',
                            icon: 'arrow-down-bold-outline',
                            selectIcon: 'arrow-down-bold',
                            type: 'material-community',
                            selectColor: theme.colors.secondary,
                        },
                        {
                            name: 'star',
                            icon: 'staro',
                            selectIcon: 'star',
                            type: 'antdesign',
                            selectColor: '#f7b129',
                        },
                        {
                            name: 'share',
                            icon: 'sharealt',
                            type: 'antdesign',
                        },
                    ].map((item) => {
                        return (
                            <TouchableOpacity key={item.name} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', width: ScreenWidth / 8 }}>
                                <Icon name={item.icon} type={item.type} />
                                {item.name !== 'share' ? <Text>{0}</Text> : <></>}
                            </TouchableOpacity>
                        )
                    })
                    }
                </View>
            </View>
            {
                onScreenShot && (
                    <ScreenShotBottom ScreenHeight={ScreenHeight} content={``} />
                )
            }
        </View >
    )
}
