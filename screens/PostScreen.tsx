import React, { useEffect, useMemo, useRef, useState } from 'react'
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { Text, useTheme } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScreenHeight, ScreenWidth } from '@rneui/base';
import { View, Platform, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { hexToRgba } from '../util/color';
import { ScreenShotBottom } from '../components/components/screenShotBottom';
import { ImageList } from '../components/components/imageList';

export function PostScreen() {
    const postInfo: any = useRoute().params;
    const { theme } = useTheme();

    const { imageUrls = [], username, avatarUrl, title, rating, content, createdAt, up, down, comments = [] } = postInfo;


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

    return (
        <View style={{ flex: 1 }} ref={viewShotRef}>
            <View
                ref={headerRef}
                style={{
                    height: headerHeight,
                    marginBottom: -headerHeight,
                    zIndex: 100,
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={4}
                onScroll={(event) => {
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
                        ) : <></>
                    }
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
                                    height: ScreenHeight - (Platform.OS === "ios" ? 120 : headerHeight) - 75,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: theme.colors.background,
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
                height: 60,
                backgroundColor: theme.colors.background,
            }}>
                <Text>底部工具</Text>
            </View>
            {
                onScreenShot && (
                    <ScreenShotBottom ScreenHeight={ScreenHeight} content={``} />
                )
            }
        </View >
    )
}
